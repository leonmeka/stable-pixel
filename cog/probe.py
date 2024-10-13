import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
from sklearn.cluster import KMeans

from classes.post_processor import PostProcessor

post_processor = PostProcessor()

# Load an image
image = Image.open("input.png")

# Probe function
output = post_processor.process(image)

output.save("output.png")