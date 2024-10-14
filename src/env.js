import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),

    DATABASE_URL: z.string().url(),
    DATABASE_DIRECT_URL: z.string().url(),

    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string() : z.string().url(),
    ),

    RESEND_API_KEY: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),

    REPLICATE_API_KEY: z.string(),
    REPLICATE_MODEL_ID: z.string(),
    LEMONSQUEEZY_API_KEY: z.string(),
    LEMONSQUEEZY_STORE_ID: z.string(),
    LEMONSQUEEZY_WEBHOOK_SECRET: z.string(),
    LEMONSQUEEZY_MAIN_VARIANT_ID: z.string(),
    LEMONSQUEEZY_100_VARIANT_ID: z.string(),
    LEMONSQUEEZY_1000_VARIANT_ID: z.string(),
  },

  client: {},

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,

    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_DIRECT_URL: process.env.DATABASE_DIRECT_URL,

    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    REPLICATE_API_KEY: process.env.REPLICATE_API_KEY,
    REPLICATE_MODEL_ID: process.env.REPLICATE_MODEL_ID,
    LEMONSQUEEZY_API_KEY: process.env.LEMONSQUEEZY_API_KEY,
    LEMONSQUEEZY_STORE_ID: process.env.LEMONSQUEEZY_STORE_ID,
    LEMONSQUEEZY_WEBHOOK_SECRET: process.env.LEMONSQUEEZY_WEBHOOK_SECRET,
    LEMONSQUEEZY_MAIN_VARIANT_ID: process.env.LEMONSQUEEZY_MAIN_VARIANT_ID,
    LEMONSQUEEZY_100_VARIANT_ID: process.env.LEMONSQUEEZY_100_VARIANT_ID,
    LEMONSQUEEZY_1000_VARIANT_ID: process.env.LEMONSQUEEZY_1000_VARIANT_ID,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
