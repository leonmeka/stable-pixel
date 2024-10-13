import Replicate from "replicate";
import { z } from "zod";

import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/+server/api/trpc";
import { db } from "@/+server/db";

const replicate = new Replicate({
  auth: env.REPLICATE_API_KEY,
});

export const inferenceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        numInferenceSteps: z.number(),
        guidanceScale: z.number(),
        poseStrength: z.number(),
        pose: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.credits <= 0) {
        throw new Error("Insufficient credits");
      }

      const identifier = env.REPLICATE_MODEL_ID;
      const model = identifier.split("/")[1] as never;
      const version = identifier.split(":")[1];

      const prediction = await replicate.predictions.create({
        model,
        version,
        input: {
          prompt: input.prompt,
          num_inference_steps: input.numInferenceSteps,
          guidance_scale: input.guidanceScale,

          pose_image: input.pose,
          controlnet_conditioning_scale: input.poseStrength,

          scheduler: "K_EULER_ANCESTRAL",
        },
      });

      await db.prediction.create({
        data: {
          userId: ctx.session.user.id,
          predictionId: prediction.id,
        },
      });

      await db.user.update({
        data: {
          credits: {
            decrement: 1,
          },
        },
        where: {
          id: ctx.session.user.id,
        },
      });

      return prediction.id;
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const userPredictions = await db.prediction.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    const predictions = await replicate.predictions.list();

    const filtered = predictions.results.filter((item) => {
      if (
        !userPredictions.some(
          (userPrediction) => userPrediction.predictionId === item.id,
        )
      ) {
        return false;
      }

      if (["failed", "canceled"].includes(item.status)) {
        return false;
      }

      return true;
    });

    return filtered;
  }),
});
