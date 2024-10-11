/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { db } from "@/+server/db";
import { env } from "@/env";
import { NextResponse, type NextRequest } from "next/server";
import { type WebhookPayload, type Order } from "lemonsqueezy-webhooks";
import crypto from "crypto";

const handleOrderCreated = async (order: Order) => {
  const email = order.attributes.user_email;

  if (!email) {
    throw new Error("No email found in customer details");
  }

  const variant = order.attributes.first_order_item.variant_id;

  let credits = 0;

  switch (variant) {
    case Number(env.LEMONSQUEEZY_100_VARIANT_ID):
      credits = 100;
      break;
    case Number(env.LEMONSQUEEZY_MAIN_VARIANT_ID):
      credits = 500;
      break;
    case Number(env.LEMONSQUEEZY_1000_VARIANT_ID):
      credits = 1000;
      break;
    default:
      throw new Error("Invalid variant ID");
  }

  await db.user.update({
    where: {
      email: email,
    },
    data: {
      credits: {
        increment: credits,
      },
    },
  });
};

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    const hmac = crypto.createHmac("sha256", env.LEMONSQUEEZY_WEBHOOK_SECRET);
    const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
    const signature = Buffer.from(req.headers.get("X-Signature") ?? "", "utf8");

    if (!crypto.timingSafeEqual(digest, signature)) {
      throw new Error("Invalid signature.");
    }

    const payload = JSON.parse(rawBody) as WebhookPayload;

    const eventName = payload.meta.event_name;
    const obj = payload.data as Order;

    switch (eventName) {
      case "order_created":
        await handleOrderCreated(obj);
        break;
      default:
        console.log(`Unhandled event type ${eventName}`);
    }

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
