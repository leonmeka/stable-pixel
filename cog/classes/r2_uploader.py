import boto3
from botocore.client import Config
from PIL import Image
import io
from datetime import datetime

class R2Uploader:
    def __init__(self, access_key, secret_key, account_id, bucket_name):
        self.access_key = access_key
        self.secret_key = secret_key
        self.account_id = account_id
        self.bucket_name = bucket_name
        self.r2 = boto3.client(
            's3',
            endpoint_url=f'https://{self.account_id}.r2.cloudflarestorage.com',
            aws_access_key_id=self.access_key,
            aws_secret_access_key=self.secret_key,
            config=Config(signature_version='s3v4')
        )
    
    def upload_image(self, image: Image.Image, image_format: str = 'PNG'):
        try:
            # Create a unique object name with timestamp
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            object_name = f"image_{timestamp}.{image_format.lower()}"

            # Convert PIL Image to bytes
            image_bytes = io.BytesIO()
            image.save(image_bytes, format=image_format)
            image_bytes.seek(0)

            # Upload the image to R2
            self.r2.upload_fileobj(image_bytes, self.bucket_name, object_name)
            
            # Generate a pre-signed URL immediately after upload
            presigned_url = self.r2.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': object_name}
            )

            return presigned_url

        except Exception as e:
            return f"Error uploading file or generating pre-signed URL: {e}"
