from PIL import Image
from PIL.Image import Quantize

class ImageQuantizer:
    @staticmethod
    def quantize(image: Image.Image, best_k: int = 16) -> Image.Image:
        return image.quantize(colors=best_k, method=Quantize.MAXCOVERAGE, kmeans=best_k, dither=0).convert('RGB')