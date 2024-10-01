import { inferenceRouter } from "@/+server/api/routers/inference";
import { createCallerFactory, createTRPCRouter } from "@/+server/api/trpc";

export const appRouter = createTRPCRouter({
  inference: inferenceRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
