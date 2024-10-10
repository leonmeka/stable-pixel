import { inferenceRouter } from "@/+server/api/routers/inference";
import { createCallerFactory, createTRPCRouter } from "@/+server/api/trpc";
import { checkoutRouter } from "./routers/checkout";

export const appRouter = createTRPCRouter({
  inference: inferenceRouter,
  checkout: checkoutRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
