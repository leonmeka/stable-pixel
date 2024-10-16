import time
import torch
import os
import base64
from io import BytesIO
from PIL import Image

from cog import BasePredictor, Input

from diffusers import (
    T2IAdapter, 
    AutoencoderKL,
    StableDiffusionXLAdapterPipeline, 
    EulerAncestralDiscreteScheduler,
)

from classes.helpers.image_resizer import ImageResizer
from classes.post_processor import PostProcessor
from classes.r2_uploader import R2Uploader

MODEL_ID = "John6666/super-pixelart-xl-m-v1-v10-sdxl"
ADAPTER_MODEL_ID = "TencentARC/t2i-adapter-openpose-sdxl-1.0"
VAE_MODEL_ID = "madebyollin/sdxl-vae-fp16-fix"
MODEL_CACHE = "diffusers-cache"

class Predictor(BasePredictor):
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.image_resizer = ImageResizer()
        self.post_processor = PostProcessor()
        self.r2_uploader = R2Uploader(
            access_key="b75696732e4485af41d26ff6c3cd5896",
            secret_key="07190fdc199cb937d54d42ad3c4f93b89c5fc4627dc2af8d1b75e6c9fc048776",
            account_id="0edda680dda92bfbba610c142aecfbb3",
            bucket_name="images"
        )  

    def setup(self):
        performance = {}

        print("1: Loading Adapter and VAE...")
        start_time = time.time()
        adapter = T2IAdapter.from_pretrained(
            ADAPTER_MODEL_ID, 
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32, 
            cache_dir=MODEL_CACHE,
        )
        vae = AutoencoderKL.from_pretrained(
            VAE_MODEL_ID, 
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32, 
            cache_dir=MODEL_CACHE,
        )
        performance["Adapter and VAE"] = (time.time() - start_time) * 1000

        print("2: Loading Stable Diffusion XL Adapter Pipeline...")
        start_time = time.time()
        self.pipe = StableDiffusionXLAdapterPipeline.from_pretrained(
            MODEL_ID,
            vae=vae,
            adapter=adapter,
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32, 
            cache_dir=MODEL_CACHE,
        ).to(self.device)
        self.pipe.scheduler = EulerAncestralDiscreteScheduler.from_config(self.pipe.scheduler.config)
        performance["Pipeline"] = (time.time() - start_time) * 1000

        print("--------------------------------------------------")
        print("PERFORMANCE:")
        for task, time_ms in performance.items():
            print(f"{task}: {time_ms:.2f}ms")

        total_time = sum(performance.values()) * 0.001
        print(f"Total: {total_time:.2f}s")
        print("--------------------------------------------------")

        print("Pipeline loaded successfully!")


    @torch.inference_mode()
    def predict(
        self,
        prompt: str = Input(description="Prompt of the picture", default="a generic male character"),
        negative_prompt: str = Input(description="Negative prompt of the picture", default="blurry, nsfw"),
        num_inteference_steps: int = Input(description="Number of steps", le=50, default=10),
        guidance_scale: float = Input(description="Number of steps", le=20.0, default=8.0),
        pose_image: str = Input(description="Guiding image for Controlnet", default=None),
        controlnet_conditioning_scale: float = Input(description="Number of steps", default=1.0),
    ) -> str:
        # Load the pose image
        if pose_image:
            pose_image = Image.open(BytesIO(base64.b64decode(pose_image))).convert("RGB")

            # Flip the red and blue channels 
            # Hint: this is due to the way the model was trained, see https://www.reddit.com/r/StableDiffusion/comments/1f854k3/psa_fixing_sdxl_t2iadapter_openpose/)
            r, g, b = pose_image.split()
            pose_image = Image.merge("RGB", (b, g, r))
            pose_image = self.image_resizer.resize(pose_image, 1024, 1024)
        else:
            pose_image = Image.new("RGB", (1024, 1024), (0, 0, 0))

        # Generate the image
        generator = torch.Generator("cuda").manual_seed(int.from_bytes(os.urandom(2), "big"))
        Parameters = {
            "width": 1024,
            "height": 1024,
            "prompt": prompt + "pixelart, pixel art, (concept art), (high detail:1.4), ((solid grey background))",
            "negative_prompt": negative_prompt + "realistic, 3d render, photo, text, watermark, blurry, deformed, depth of field, 3d render, (outline)",
            "num_inference_steps": num_inteference_steps,
            "guidance_scale": guidance_scale,

            "image": pose_image,
            "adapter_conditioning_scale": controlnet_conditioning_scale,

            "generator": generator,
            "num_images_per_prompt": 1
        }
        image = self.pipe(
            **Parameters
        ).images[0]

        # Apply post-processing
        output = self.post_processor.process(image)

        # Upload the image to R2
        file_url = self.r2_uploader.upload_image(output)

        return file_url