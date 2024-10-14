import { env } from "@/env";
import {
  lemonSqueezySetup,
  createCustomer,
  createCheckout,
  getCustomer,
} from "@lemonsqueezy/lemonsqueezy.js";

const configureLemonSqueezy = () =>
  lemonSqueezySetup({
    apiKey: env.LEMONSQUEEZY_API_KEY,
    onError: (error) => {
      throw new Error(`Lemon Squeezy API error: ${error.message}`);
    },
  });

export async function createNewCustomer({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  configureLemonSqueezy();

  return await createCustomer(env.LEMONSQUEEZY_STORE_ID, {
    email,
    name,
  });
}

export async function createNewCheckout({
  customerId,
}: {
  customerId: string;
}) {
  configureLemonSqueezy();

  const customer = await getCustomer(customerId);
  const email = customer.data?.data.attributes.email;

  if (!email) {
    throw new Error("No email found in customer details");
  }

  return await createCheckout(
    env.LEMONSQUEEZY_STORE_ID,
    env.LEMONSQUEEZY_MAIN_VARIANT_ID,
    {
      checkoutData: {
        email,
      },
      productOptions: {
        redirectUrl: env.NEXTAUTH_URL,
      },
      testMode: env.NODE_ENV === "development",
    },
  );
}
