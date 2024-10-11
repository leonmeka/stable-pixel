import { createTRPCRouter, protectedProcedure } from "@/+server/api/trpc";
import { createCheckoutSession } from "@/+server/lemon";

export const checkoutRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { session } = ctx;

    if (!session.user) {
      throw new Error("User not found");
    }

    const checkoutSession = await createCheckoutSession({
      customerId: session.user.customerId,
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
