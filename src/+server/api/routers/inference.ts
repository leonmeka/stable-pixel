import Replicate from "replicate";
import { z } from "zod";

import { env } from "@/env";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/+server/api/trpc";
import { db } from "@/+server/db";

const replicate = new Replicate({
  auth: env.REPLICATE_API_KEY,
});

const ttlHasExpired = (started_at?: string) => {
  if (!started_at) {
    return false;
  }

  const expires = 3600;
  const now = Date.now();

  const startedAt = new Date(started_at).getTime();
  const elapsed = now - startedAt;
  const elapsedSeconds = elapsed / 1000;

  return elapsedSeconds <= expires;
};

export const inferenceRouter = createTRPCRouter({
  create: publicProcedure
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
          predictionId: prediction.id,
          userId: ctx.session!.user.id,
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

      return ttlHasExpired(item.started_at);
    });

    return filtered;
  }),
});
