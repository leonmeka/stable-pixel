export interface CanvasSize {
  width: number;
  height: number;
}

export interface PredictionInput {
  prompt: string;
  numInferenceSteps: number;
  guidanceScale: number;
  poseStrength: number;
  pose_image: string;
}
