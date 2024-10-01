import { create } from "zustand";

interface AppState {
  image: string | null;
  pose: Blob | null;
  prompt: string;
  numInferenceSteps: number;
  guidanceScale: number;
  poseStrength: number;
  setImage: (image?: string) => void;
  setPose: (pose?: Blob) => void;
  setPrompt: (prompt: string) => void;
  setNumInferenceSteps: (steps: number) => void;
  setGuidanceScale: (scale: number) => void;
  setPoseStrength: (strength: number) => void;
}

export const useAppState = create<AppState>()((set) => ({
  image: null,
  prompt: "",
  pose: null,
  numInferenceSteps: 25,
  guidanceScale: 1.5,
  poseStrength: 1,
  setImage: (image) => set({ image }),
  setPrompt: (prompt) => set({ prompt }),
  setPose: (pose) => set({ pose }),
  setNumInferenceSteps: (steps) => set({ numInferenceSteps: steps }),
  setGuidanceScale: (scale) => set({ guidanceScale: scale }),
  setPoseStrength: (strength) => set({ poseStrength: strength }),
}));
