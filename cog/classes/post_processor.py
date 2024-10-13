import time
from PIL import Image

from .helpers.image_resizer import ImageResizer
from .helpers.image_prober import ImageProber
from .helpers.image_quantizer import ImageQuantizer
from .helpers.image_pixelator import ImagePixelator

class PostProcessor():
    def __init__(self):
        self.image_resizer = ImageResizer()
        self.image_prober = ImageProber()     
        self.image_quantizer = ImageQuantizer()
        self.image_pixelator = ImagePixelator()     

    def process(self, image: Image) -> Image:
        performance = {}

        # Downscale image for faster processing (256x256)
        start_time = time.time()
        downsized = self.image_resizer.resize(image, 256, 256)
        performance["Resizing (256x256)"] = (time.time() - start_time) * 1000

        # Determine the best number of colors for the image
        start_time = time.time()
        best_k = self.image_prober.get_best_k(downsized, max_k=16)
        performance["Determining Best K"] = (time.time() - start_time) * 1000

        # Quantize the image to the best number of colors
        start_time = time.time()
        quantized_image = self.image_quantizer.quantize(image, best_k)
        performance["Quantizing"] = (time.time() - start_time) * 1000

        # Detect pixel scale of the image
        start_time = time.time()
        pixel_size  = self.image_prober.get_pixel_size(quantized_image)
        performance["Detecting Pixel Scale"] = (time.time() - start_time) * 1000

        # Pixelate the image to the detected pixel scale
        start_time = time.time()
        pixelated_image = self.image_pixelator.pixelate(quantized_image, max_colors=best_k, pixel_size=round(pixel_size))
        performance["Pixelating"] = (time.time() - start_time) * 1000

        # Downscale to final output (256x256)
        start_time = time.time()
        processed_image = self.image_resizer.resize(pixelated_image, 256, 256)
        performance["Resizing (256x256)"] = (time.time() - start_time) * 1000

        print("--------------------------------------------------")
        print("PERFORMANCE:")
        for task, time_ms in performance.items():
            if time_ms >= 200:
                print(f"\033[91m{task}: {time_ms:.2f}ms\033[0m")
            elif time_ms >= 100:
                print(f"\033[93m{task}: {time_ms:.2f}ms\033[0m")
            else:
                print(f"\033[92m{task}: {time_ms:.2f}ms\033[0m")

        total_time = sum(performance.values()) * 0.001
        print(f"Total: {total_time:.2f}s")
        print("--------------------------------------------------")

        return processed_image