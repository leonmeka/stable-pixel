from PIL import Image
import numpy as np
import scipy
from itertools import product
from sklearn.cluster import KMeans

class ImagePixelator:
    @staticmethod
    def get_background_color(image: Image.Image, sample_size: int = 10) -> tuple:
        width, height = image.size
        corners = [
            (0, 0),
            (width - sample_size, 0),
            (0, height - sample_size),
            (width - sample_size, height - sample_size)
        ]
        
        samples = []
        for x, y in corners:
            sample = image.crop((x, y, x + sample_size, y + sample_size))
            samples.extend(sample.getdata())
        
        # Use K-means to find the dominant color
        kmeans = KMeans(n_clusters=1, random_state=42)
        kmeans.fit(samples)
        
        return tuple(map(int, kmeans.cluster_centers_[0]))

    @staticmethod
    def pixelate(image: Image.Image, max_colors: int, pixel_size: int, distance_threshold: int = 30) -> Image.Image:
        # Get the background color
        bg_color = ImagePixelator.get_background_color(image)
        
        # Resize the image to pixelate
        small = image.resize(
            (image.width // pixel_size, image.height // pixel_size),
            resample=Image.NEAREST
        )
        
        # Convert to numpy array
        arr = np.array(small)
        
        # Reshape the array for clustering
        original_shape = arr.shape
        arr = arr.reshape(-1, 3)
        
        # Unify background colors by applying a color distance threshold
        distance = np.sum((arr - bg_color) ** 2, axis=1)
        arr[distance < distance_threshold ** 2] = bg_color
        
        # Perform k-means clustering to reduce colors to a fixed number
        kmeans = KMeans(n_clusters=max_colors, random_state=42)
        labels = kmeans.fit_predict(arr)
        
        # Get the cluster centers (representative colors)
        centers = kmeans.cluster_centers_.astype('uint8')
        
        # Replace each pixel by its cluster center (dominant color)
        result = centers[labels]
        
        # Reshape back to image dimensions
        result = result.reshape(original_shape)
        
        # Convert back to PIL Image and resize to original dimensions
        pixelated = Image.fromarray(result.astype('uint8'), 'RGB')
        pixelated = pixelated.resize(image.size, Image.NEAREST)
        
        return pixelated

    @staticmethod
    def kCentroid(image: Image, width: int, height: int, centroids: int):
        image = image.convert("RGB")

        # Create an empty array for the downscaled image
        downscaled = np.zeros((height, width, 3), dtype=np.uint8)

        # Calculate the scaling factors
        wFactor = image.width / width
        hFactor = image.height / height

        # Iterate over each tile in the downscaled image
        for x, y in product(range(width), range(height)):
            # Crop the tile from the original image
            tile = image.crop((x * wFactor, y * hFactor, (x * wFactor) + wFactor, (y * hFactor) + hFactor))

            # Quantize the colors of the tile using k-means clustering
            tile = tile.quantize(colors=centroids, method=1, kmeans=centroids).convert("RGB")

            # Get the color counts and find the most common color
            color_counts = tile.getcolors()
            most_common_color = max(color_counts, key=lambda x: x[0])[1]

            # Assign the most common color to the corresponding pixel in the downscaled image
            downscaled[y, x, :] = most_common_color

        return Image.fromarray(downscaled, mode='RGB')

    @staticmethod
    def pixel_detect(image: Image):
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

        # Resize input image using kCentroid with the calculated horizontal and vertical factors
        return ImagePixelator.kCentroid(image, round(image.width / np.median(hspacing)), round(image.height / np.median(vspacing)), 2), np.median(hspacing), np.median(vspacing)

    @staticmethod
    def determine_best_k(image: Image, max_k: int):
        image = image.convert("RGB")
        pixels = np.array(image)
        pixel_indices = np.reshape(pixels, (-1, 3))

        distortions = []
        for k in range(1, max_k + 1):
            quantized_image = image.quantize(colors=k, method=0, kmeans=k, dither=0)
            centroids = np.array(quantized_image.getpalette()[:k * 3]).reshape(-1, 3)

            distances = np.linalg.norm(pixel_indices[:, np.newaxis] - centroids, axis=2)
            min_distances = np.min(distances, axis=1)
            distortions.append(np.sum(min_distances ** 2))

        rate_of_change = np.diff(distortions) / np.array(distortions[:-1])

        if len(rate_of_change) == 0:
            best_k = 2
        else:
            elbow_index = np.argmax(rate_of_change) + 1
            best_k = elbow_index + 2

        return best_k
