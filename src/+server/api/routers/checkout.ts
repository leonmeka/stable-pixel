import { createTRPCRouter, protectedProcedure } from "@/+server/api/trpc";

export const checkoutRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const email = ctx.session?.user?.email;

    const url = `https://store.stable-pixel.com?email=${email}`;

    return {
      url,
    };
  }),
});
