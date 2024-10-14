from beam import Image, Volume, endpoint

import os
import torch
import base64
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
from PIL import Image as PILImage
from io import BytesIO

from classes.helpers.image_resizer import ImageResizer
from classes.post_processor import PostProcessor
from classes.r2_uploader import R2Uploader

# Constants
MODEL_ID = "John6666/super-pixelart-xl-m-v1-v10-sdxl"
ADAPTER_MODEL_ID = "TencentARC/t2i-adapter-openpose-sdxl-1.0"
VAE_MODEL_ID = "madebyollin/sdxl-vae-fp16-fix"
MODEL_CACHE = "./models"

# Image for the container
IMAGE=Image(
    python_version="python3.8",
    python_packages=[
        "diffusers==0.30.3",
        "Pillow==10.4.0",
        "torch==2.4.1",
        "transformers==4.44.2",
        "scikit-learn==1.2.2",
        "python-multipart==0.0.9",
        "controlnet-aux==0.0.9",
        "accelerate==0.34.2",
        "boto3==1.35.29",
        "botocore==1.35.29",
        "sentencepiece==0.2.0",
        "protobuf==5.28.2",
        "peft==0.13.0",
        "imagequant==1.1.1",
        "safetensors",
        "xformers",
    ],
)

# Load models once when the container first boots
def load_models():
    device = "cuda" if torch.cuda.is_available() else "cpu"
    
    print("1: Loading Adapter...")
    adapter = T2IAdapter.from_pretrained(
        ADAPTER_MODEL_ID, torch_dtype=torch.float16, cache_dir=MODEL_CACHE
    ).to(device)

    print("2: Loading VAE...")
    vae = AutoencoderKL.from_pretrained(
        VAE_MODEL_ID, torch_dtype=torch.float16, cache_dir=MODEL_CACHE
    )

    print("3: Loading Stable Diffusion XL Adapter Pipeline...")
    pipe = StableDiffusionXLAdapterPipeline.from_pretrained(
        MODEL_ID,
        vae=vae,
        adapter=adapter,
        torch_dtype=torch.float16 if device == "cuda" else torch.float32,
        cache_dir=MODEL_CACHE,
    ).to(device)
    
    print("Pipeline loaded successfully!")

    return {"pipe": pipe, "device": device}

# Scheduler selection function
def use_scheduler(name, config):
    return {
        "PNDM": PNDMScheduler.from_config(config),
        "KLMS": LMSDiscreteScheduler.from_config(config),
        "DDIM": DDIMScheduler.from_config(config),
        "K_EULER": EulerDiscreteScheduler.from_config(config),
        "K_EULER_ANCESTRAL": EulerAncestralDiscreteScheduler.from_config(config),
        "DPMSolverMultistep": DPMSolverMultistepScheduler.from_config(config),
    }[name]

# Task Queue
@endpoint(
    name="stable-pixel",
    image=IMAGE,
    on_start=load_models,
    keep_warm_seconds=60,
    cpu=2,
    memory="32Gi",
    gpu="A10G",
    volumes=[Volume(name="models", mount_path=MODEL_CACHE)],
)
def generate(context, **inputs):
    # Access pre-loaded models
    pipe = context.on_start_value["pipe"]
    device = context.on_start_value["device"]
    
    # Image resizer, post-processor, and uploader
    image_resizer = ImageResizer()
    post_processor = PostProcessor()
    r2_uploader = R2Uploader(
        access_key="b75696732e4485af41d26ff6c3cd5896",
        secret_key="07190fdc199cb937d54d42ad3c4f93b89c5fc4627dc2af8d1b75e6c9fc048776",
        account_id="0edda680dda92bfbba610c142aecfbb3",
        bucket_name="images"
    )
    
    # Extract inputs
    prompt = inputs.get("prompt", "a generic male character")
    num_inference_steps = inputs.get("num_inference_steps", 10)
    guidance_scale = inputs.get("guidance_scale", 1.5)
    pose_image_data = inputs.get("pose_image", None)
    controlnet_conditioning_scale = inputs.get("controlnet_conditioning_scale", 1.0)
    
    # Handle pose image if provided
    if pose_image_data:
        pose_image = PILImage.open(BytesIO(base64.b64decode(pose_image_data))).convert("RGB")
        r, g, b = pose_image.split()
        pose_image = PILImage.merge("RGB", (b, g, r))
        pose_image = image_resizer.resize(pose_image, 1024, 1024)
    else:
        pose_image = PILImage.new("RGB", (1024, 1024), color=(0, 0, 0)) 
    
    # Set up the generator with a random seed
    seed = int.from_bytes(os.urandom(2), "big")
    generator = torch.Generator(device).manual_seed(seed)

    # Scheduler setup
    pipe.scheduler = use_scheduler("K_EULER_ANCESTRAL", pipe.scheduler.config)

    # Parameters for image generation
    parameters = {
        "width": 1024,
        "height": 1024,
        "prompt": prompt + " pixelart, pixel art, (concept art), (high detail:1.4), ((solid grey background))",
        "negative_prompt": "realistic, 3d render, photo, text, watermark, blurry, deformed, depth of field, 3d render, (outline)",
        "num_inference_steps": num_inference_steps,
        "guidance_scale": guidance_scale,
        "image": pose_image,
        "adapter_conditioning_scale": controlnet_conditioning_scale,
        "generator": generator,
        "num_images_per_prompt": 1
    }

    # Generate the image
    image = pipe(**parameters).images[0]

    # Apply post-processing
    processed_image = post_processor.process(image)

    # Upload the image to R2
    file_url = r2_uploader.upload_image(processed_image)

    return file_url