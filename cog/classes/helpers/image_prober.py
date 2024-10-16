import numpy as np
import scipy
from PIL import Image
from sklearn.decomposition import PCA
from concurrent.futures import ThreadPoolExecutor

class ImageProber:
    @staticmethod
    def get_pixel_size(image: Image) -> int:
        # Convert the image to a NumPy array
        npim = np.array(image)[..., :3]

        # Compute horizontal differences between pixels
        hdiff = np.sqrt(np.sum((npim[:, :-1, :] - npim[:, 1:, :])**2, axis=2))
        hsum = np.sum(hdiff, 0)

        # Compute vertical differences between pixels
        vdiff = np.sqrt(np.sum((npim[:-1, :, :] - npim[1:, :, :])**2, axis=2))
        vsum = np.sum(vdiff, 1)

        # Find peaks in the horizontal and vertical sums
        hpeaks, _ = scipy.signal.find_peaks(hsum, distance=1, height=0.0)
        vpeaks, _ = scipy.signal.find_peaks(vsum, distance=1, height=0.0)

        # Compute spacing between the peaks
        hspacing = np.diff(hpeaks)
        vspacing = np.diff(vpeaks)
        padding = 4

        # Return the max median spacing
        return int(max(np.median(hspacing + padding), np.median(vspacing + padding)))

    @staticmethod
    def get_best_k(image: Image, max_k: int, pca_components: int = 1) -> int:
        image = image.convert("RGB")
        pixels = np.array(image)
        pixel_indices = np.reshape(pixels, (-1, 3))

        # Apply PCA to reduce dimensions once for all pixels
        pca = PCA(n_components=pca_components)
        pixel_indices_pca = pca.fit_transform(pixel_indices)

        # Optimized quantization function
        def batch_quantize(k):
            quantized_image = image.quantize(colors=k, method=0, kmeans=k, dither=0)
            centroids = np.array(quantized_image.getpalette()[:k * 3]).reshape(-1, 3)
            # Apply PCA to centroids once per k
            centroids_pca = pca.transform(centroids)

            # Efficient vectorized distance calculation in PCA space
            distances = np.sum((pixel_indices_pca[:, np.newaxis] - centroids_pca) ** 2, axis=2)
            min_distances = np.min(distances, axis=1)
            total_distortion = np.sum(min_distances)
            return k, total_distortion

        # Define initial k values for coarse search
        k_values_initial = [2, 4, 8, max_k]

        # Define refined k values around the best coarse k
        def refine_k_values(min_k):
            return list(range(max(2, min_k - 5), min(max_k, min_k + 5)))

        # Use a single ThreadPoolExecutor for both coarse and refined searches
        with ThreadPoolExecutor() as executor:
            # Perform coarse search in parallel
            coarse_results = list(executor.map(batch_quantize, k_values_initial))

            # Find the minimum distortion from coarse search without sorting
            min_k, _ = min(coarse_results, key=lambda x: x[1])

            # Perform refined search in parallel
            k_values_refined = refine_k_values(min_k)
            refined_results = list(executor.map(batch_quantize, k_values_refined))

        # Find the minimum distortion from refined search without sorting
        best_k, _ = min(refined_results, key=lambda x: x[1])

        return best_k