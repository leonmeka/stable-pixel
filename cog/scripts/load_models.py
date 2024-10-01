#!/usr/bin/env python

import os
import shutil
import sys

from diffusers import AutoencoderKL, ControlNetModel, StableDiffusionXLControlNetPipeline

# append project directory to path so predict.py can be imported
sys.path.append('.')

from cog.predict import MODEL_CACHE, MODEL_ID, CONTROLNET_MODEL_ID

if os.path.exists(MODEL_CACHE):
    shutil.rmtree(MODEL_CACHE)
os.makedirs(MODEL_CACHE, exist_ok=True)


controlnet = ControlNetModel.from_pretrained(
    CONTROLNET_MODEL_ID,
    cache_dir=MODEL_CACHE,
)

pipe = StableDiffusionXLControlNetPipeline.from_pretrained(
    MODEL_ID,
    cache_dir=MODEL_CACHE,
)