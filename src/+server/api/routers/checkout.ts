import { createTRPCRouter, protectedProcedure } from "@/+server/api/trpc";
import { createNewCheckout } from "@/+server/lemon";

export const checkoutRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const checkoutSession = await createNewCheckout({
      customerId: ctx.session.user.customerId,
    });

    const url = checkoutSession.data?.data.attributes.url;

    if (!url) {
      throw new Error("Failed to create checkout session");
    }

    return {
      id: checkoutSession.data?.data.id,
      url: url,
    };
  }),
});
