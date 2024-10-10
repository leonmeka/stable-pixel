import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";

import { env } from "@/env";
import { db } from "@/+server/db";
import Stripe from "stripe";
import { type DefaultJWT, type JWT } from "next-auth/jwt";

const stripe = new Stripe(env.STRIPE_SECRET_KEY);

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    stripeCustomerId: string;
    credits: number;
  }
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      stripeCustomerId: string;
      credits: number;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  debug: env.NODE_ENV !== "production",
  jwt: { maxAge: 30 * 24 * 60 * 60 }, // 30 days
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.stripeCustomerId = token.stripeCustomerId;
        session.user.credits = token.credits;
      }

      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findUnique({
        where: {
          email: token.email!,
        },
      });

      if (!dbUser) {
        token.id = user.id;
        return token;
      }

      token.stripeCustomerId = dbUser.stripeCustomerId ?? "";
      token.credits = dbUser.credits ?? 0;

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        stripeCustomerId: dbUser.stripeCustomerId ?? "",
        credits: dbUser.credits,
      } as JWT;
    },
  },
  events: {
    createUser: async ({ user }) => {
      try {
        const name = user.name ?? user.email?.split("@")[0];

        if (!user.email) {
          throw new Error("Email not found");
        }

        const customer = await stripe.customers.create({
          email: user.email,
          name: name,
        });

        await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            name: name,
            stripeCustomerId: customer.id,
            credits: 0,
          },
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
