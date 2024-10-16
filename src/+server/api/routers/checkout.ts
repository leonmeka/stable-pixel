import { createTRPCRouter, protectedProcedure } from "@/+server/api/trpc";
import { env } from "@/env";

export const checkoutRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const email = ctx.session?.user?.email;

    const url = `${env.GUMROAD_SHOP_URL}?email=${email}`;

    return {
      url,
    };
  }),
});
