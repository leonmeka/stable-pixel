import { env } from "@/env";
import { createTRPCRouter, protectedProcedure } from "@/+server/api/trpc";
import { Stripe } from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

export const checkoutRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { session } = ctx;

    if (!session.user) {
      throw new Error("User not found");
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: session.user.stripeCustomerId,
      line_items: [
        {
          price_data: {
            product: env.STRIPE_PRODUCT_ID,
            currency: "usd",
            unit_amount: 5_99,
          },
          quantity: 1,
        },
      ],
      consent_collection: {
        terms_of_service: "required",
      },
      success_url: `${env.NEXTAUTH_URL}`,
      cancel_url: `${env.NEXTAUTH_URL}`,
    });

    if (!checkoutSession.url) {
      throw new Error("Failed to create checkout session");
    }

    return {
      id: checkoutSession.id,
      url: checkoutSession.url,
    };
  }),
});
