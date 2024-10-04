import torch
import os
from PIL import Image
import base64
from io import BytesIO

from cog import BasePredictor, Input

from diffusers import (
    T2IAdapter, 
    AutoencoderKL,
    StableDiffusionXLAdapterPipeline, 
    PNDMScheduler,
    LMSDiscreteScheduler,
    DDIMScheduler,
    EulerDiscreteScheduler,
    EulerAncestralDiscreteScheduler,
    DPMSolverMultistepScheduler,
)

from classes.image_resizer import ImageResizer
from classes.image_pixelator import ImagePixelator
from classes.r2_uploader import R2Uploader

MODEL_ID = "John6666/super-pixelart-xl-m-v1-v10-sdxl"
ADAPTER__MODEL_ID = "TencentARC/t2i-adapter-openpose-sdxl-1.0"
VAE_MODEL_ID = "madebyollin/sdxl-vae-fp16-fix"
MODEL_CACHE = "diffusers-cache"

def use_scheduler(name, config):
    return {
        "PNDM": PNDMScheduler.from_config(config),
        "KLMS": LMSDiscreteScheduler.from_config(config),
        "DDIM": DDIMScheduler.from_config(config),
        "K_EULER": EulerDiscreteScheduler.from_config(config),
        "K_EULER_ANCESTRAL": EulerAncestralDiscreteScheduler.from_config(config),
        "DPMSolverMultistep": DPMSolverMultistepScheduler.from_config(config),
    }[name]

class Predictor(BasePredictor):
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.image_resizer = ImageResizer()
        self.image_pixelator = ImagePixelator()      
        self.r2_uploader = R2Uploader(
            access_key="b75696732e4485af41d26ff6c3cd5896",
            secret_key="07190fdc199cb937d54d42ad3c4f93b89c5fc4627dc2af8d1b75e6c9fc048776",
            account_id="0edda680dda92bfbba610c142aecfbb3",
            bucket_name="images"
        )  

    def setup(self):
        print("Loading pipeline...")

        print("1: Loading Adapter...")
        adapter = T2IAdapter.from_pretrained(
            ADAPTER__MODEL_ID, torch_dtype=torch.float16,
            cache_dir=MODEL_CACHE
        ).to(self.device)
        
        print("2: Loading vae...")
        vae=AutoencoderKL.from_pretrained(
            VAE_MODEL_ID, 
            torch_dtype=torch.float16, 
            cache_dir=MODEL_CACHE
        )

        print("3: Loading Stable Diffusion XL Adapter Pipeline...")
        self.pipe = StableDiffusionXLAdapterPipeline.from_pretrained(
            MODEL_ID,
            vae=vae,
            adapter=adapter,
            safety_checker=None,
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
            cache_dir=MODEL_CACHE,
        ).to(self.device)

        print("Pipeline loaded succesfully!")

    @torch.inference_mode()
    def predict(
        self,
        prompt: str = Input(description="Prompt of the picture", default="a generic male character"),
        negative_prompt: str = Input(description="Negative prompt of the picture", default="blurry, nsfw"),
        num_inteference_steps: int = Input(description="Number of steps", le=50, default=10),
        guidance_scale: float = Input(description="Number of steps", le=20.0, default=8.0),
        
        pose_image: str = Input(description="Guiding image for Controlnet", default=None),
        controlnet_conditioning_scale: float = Input(description="Number of steps", default=1.0),

        scheduler: str = Input(
            default="K_EULER_ANCESTRAL",
            choices=[
                "DDIM",
                "K_EULER",
                "DPMSolverMultistep",
                "K_EULER_ANCESTRAL",
                "PNDM",
                "KLMS",
            ],
            description="Choose a scheduler.",
        ),
    ) -> str:
        seed = int.from_bytes(os.urandom(2), "big")
        generator = torch.Generator("cuda").manual_seed(seed)

        if pose_image:
            pose_image = Image.open(BytesIO(base64.b64decode(pose_image))).convert("RGB")

            # Flip the red and blue channels
            r, g, b = pose_image.split()
            pose_image = Image.merge("RGB", (b, g, r))
            
            pose_image = self.image_resizer.resize(pose_image, 1024, 1024)

        Parameters = {
            "width": 1024,
            "height": 1024,
            "prompt": prompt + ", (concept art), (realistic), (high detail), ((solid grey background))",
            "negative_prompt": negative_prompt + "realistic, 3d render, photo, text, watermark, blurry, deformed, depth of field, 3d render, ((outline)), (shadow), (extra objects)",
            "num_inference_steps": num_inteference_steps,
            "guidance_scale": guidance_scale,

            "image": pose_image,
            "adapter_conditioning_scale": controlnet_conditioning_scale,

            "generator": generator,
            "num_images_per_prompt": 1
        }

        self.pipe.scheduler = use_scheduler(scheduler, self.pipe.scheduler.config)
        pipe_output = self.pipe(
            **Parameters
        )

        image = pipe_output.images[0]

        # 1024x1024 -> 5.120x5.120
        image = self.image_resizer.resize(image, 5120, 5120)

        # Pixelate the image
        image = self.image_pixelator.pixelate(image, max_colors=16, pixel_size=4)

        # 5.120x5.120 -> 256x256
        image = self.image_resizer.resize(image, 256, 256)

        file_url = self.r2_uploader.upload_image(image)

        return file_url