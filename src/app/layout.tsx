import "@/styles/globals.css";

import { GeistMono } from "geist/font/mono";
import { type Metadata } from "next";
import { getSession } from "next-auth/react";

import { ClientSessionProvider } from "@/components/providers/client-session-provider";
import { ClientTRPCProvider } from "@/components/providers/client-trpc-provider";

export const metadata: Metadata = {
  title: "Stable Pixel",
  description: "Stable Pixel",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();

  return (
    <html lang="en">
      <body className={GeistMono.className}>
        <ClientTRPCProvider>
          <ClientSessionProvider session={session}>
            {children}
          </ClientSessionProvider>
        </ClientTRPCProvider>
      </body>
    </html>
  );
}
