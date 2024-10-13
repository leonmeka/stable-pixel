from PIL import Image
import numpy as np
import scipy
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
        return int(max(np.median(hspacing), np.median(vspacing)) + padding)

    @staticmethod
    def get_best_k(image: Image, max_k: int) -> int:
        image = image.convert("RGB")
        pixels = np.array(image)
        pixel_indices = np.reshape(pixels, (-1, 3))

        def calc_distortion(k):
            quantized_image = image.quantize(colors=k, method=0, kmeans=k, dither=0)
            centroids = np.array(quantized_image.getpalette()[:k * 3]).reshape(-1, 3)
            distances = np.linalg.norm(pixel_indices[:, np.newaxis] - centroids, axis=2)
            min_distances = np.min(distances, axis=1)
            return np.sum(min_distances ** 2)

        with ThreadPoolExecutor() as executor:
            distortions = list(executor.map(calc_distortion, range(1, max_k + 1)))

        rate_of_change = np.diff(distortions) / np.array(distortions[:-1])

        if len(rate_of_change) == 0:
            best_k = 2
        else:
            elbow_index = np.argmax(rate_of_change) + 1
            best_k = elbow_index + 2

        return best_k
