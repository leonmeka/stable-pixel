import Replicate from "replicate";
import { z } from "zod";

import { env } from "@/env";
import { createTRPCRouter, publicProcedure } from "@/+server/api/trpc";

const replicate = new Replicate({
  auth: env.REPLICATE_API_KEY,
});

export const inferenceRouter = createTRPCRouter({
  generate: publicProcedure
    .input(
      z.object({
        prompt: z.string(),
        numInferenceSteps: z.number(),
        guidanceScale: z.number(),
        poseStrength: z.number(),
        pose: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const t = performance.now();
      const prediction = await replicate.run(
        process.env.REPLICATE_MODEL_ID as never,
        {
          input: {
            prompt: input.prompt,
            num_inference_steps: input.numInferenceSteps,
            guidance_scale: input.guidanceScale,

            pose_image: input.pose,
            controlnet_conditioning_scale: input.poseStrength,

            scheduler: "K_EULER_ANCESTRAL",
          },
        },
      );
      const elapsed = performance.now() - t;

      return {
        image: prediction as unknown as string,
        ms: elapsed,
      };
    }),
});
