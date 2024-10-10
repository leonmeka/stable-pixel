import { db } from "@/+server/db";
import { env } from "@/env";
import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const handleCheckoutSessionCompleted = async (
  event: Stripe.CheckoutSessionCompletedEvent,
) => {
  const session = event.data.object;
  const customerDetails = session.customer_details;

  if (!customerDetails?.email) {
    throw new Error("No email found in customer details");
    return;
  }

  await db.user.update({
    where: {
      email: customerDetails.email,
    },
    data: {
      credits: {
        increment: 100,
      },
    },
  });
};

export async function POST(req: NextRequest) {
  try {
    const event = stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get("Stripe-Signature")!,
      env.STRIPE_WEBHOOK_SECRET,
    );

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
