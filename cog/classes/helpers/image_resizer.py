from PIL import Image

class ImageResizer:
    @staticmethod
    def resize(image: Image.Image, width: int, height: int) -> Image.Image:
        if width == 0 or height == 0:
            return image
        
        return image.resize((width, height), Image.NEAREST)
