from PIL import Image
import numpy as np

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
    def pixelate(image: Image.Image, max_colors: int, pixel_size: int) -> Image.Image:
        # Get the background color
        bg_color = ImagePixelator.get_background_color(image)
        
        # Resize the image
        small = image.resize(
            (image.width // pixel_size, image.height // pixel_size),
            resample=Image.NEAREST
        )
        
        # Convert to numpy array
        arr = np.array(small)
        
        # Reshape the array
        original_shape = arr.shape
        arr = arr.reshape(-1, 3)
        
        # Unify background colors
        threshold = 10 
        arr[np.sum((arr - bg_color) ** 2, axis=1) < threshold ** 2] = bg_color
        
        # Perform k-means clustering to reduce colors
        kmeans = KMeans(n_clusters=max_colors, random_state=42)
        labels = kmeans.fit_predict(arr)
        
        # Get the cluster centers
        centers = kmeans.cluster_centers_
        
        # Apply the updated colors
        result = centers[labels]
        
        # Reshape back to image dimensions
        result = result.reshape(original_shape)
        
        # Convert back to PIL Image and resize to original dimensions
        pixelated = Image.fromarray(result.astype('uint8'), 'RGB')
        pixelated = pixelated.resize(image.size, Image.NEAREST)
        
        return pixelated