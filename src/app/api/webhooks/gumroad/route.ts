import { db } from "@/+server/db/db";
import { NextResponse, type NextRequest } from "next/server";

const handleOrderCreated = async (
  email?: string,
  variant?: string,
  quantity?: string,
) => {
  if (!email) {
    throw new Error("No email found in customer details");
  }

  if (!variant) {
    throw new Error("No variant found in order details");
  }

  if (!quantity) {
    throw new Error("No quantity found in order details");
  }

  let credits = 0;

  switch (variant) {
    case "100x Credits":
      credits = 100;
      break;
    case "500x Credits":
      credits = 500;
      break;
    case "1000x Credits":
      credits = 1_000;
      break;
    default:
      throw new Error("Invalid variant ID");
  }

  await db.user.update({
    where: {
      email,
    },
    data: {
      credits: {
        increment: credits * parseInt(quantity),
      },
    },
  });
};

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const params = new URLSearchParams(bodyText);
    const body = Object.fromEntries(params.entries());

    const email = body.email;
    const variant = body["variants[Version]"];
    const quantity = body.quantity;

    await handleOrderCreated(email, variant, quantity);

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
