export interface CanvasSize {
  width: number;
  height: number;
}

export interface PredictionInput {
  prompt: string;
  num_inteference_steps: number;
  guidance_scale: number;
  pose_image: string;
  controlnet_conditioning_scale: number;
}

export interface CheckoutSessionParams {
  productId: string;
  locale: string;
}
