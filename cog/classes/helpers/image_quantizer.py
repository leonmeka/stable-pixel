from PIL import Image
from PIL.Image import Quantize
from concurrent.futures import ThreadPoolExecutor

class ImageQuantizer:
    @staticmethod
    def quantize(image: Image.Image, best_k: int = 16, regions_xy: int = 10, overlap: int = 25) -> Image.Image:
        def process_region(index, region_coordinates):
            left, upper, right, lower = region_coordinates
            region = image.crop((left, upper, right, lower))
            quantized_region = region.quantize(colors=best_k, method=Quantize.MAXCOVERAGE, kmeans=best_k, dither=0)
            
            # Crop the overlapping edges
            quantized_region = quantized_region.convert('RGB')
            region_cropped = quantized_region.crop(
                (overlap if left != 0 else 0, overlap if upper != 0 else 0, 
                 quantized_region.width - (overlap if right != width else 0), 
                 quantized_region.height - (overlap if lower != height else 0))
            )
            return (index, region_cropped)

        width, height = image.size
        region_width = width // regions_xy
        region_height = height // regions_xy

        # Create a list of regions with overlap
        region_coordinates = []
        for i in range(regions_xy):
            for j in range(regions_xy):
                left = max(i * region_width - overlap, 0)
                upper = max(j * region_height - overlap, 0)
                right = min((i + 1) * region_width + overlap, width)
                lower = min((j + 1) * region_height + overlap, height)
                region_coordinates.append((left, upper, right, lower))
        
        # Process regions (quantize and blend overlaps) in parallel
        with ThreadPoolExecutor() as executor:
            results = list(executor.map(lambda idx_region: process_region(*idx_region), enumerate(region_coordinates)))

        # Create a new image and paste the quantized regions in parallel
        new_image = Image.new('RGB', image.size)
        for index, region_cropped in results:
            i = index // regions_xy
            j = index % regions_xy
            left = i * region_width
            upper = j * region_height
            new_image.paste(region_cropped, (left, upper))

        return new_image
