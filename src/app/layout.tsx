import "@/styles/globals.css";

import { GeistMono } from "geist/font/mono";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import { getSession } from "next-auth/react";

import { ClientSessionProvider } from "@/components/providers/client-session-provider";

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
        <TRPCReactProvider>
          <ClientSessionProvider session={session}>
            {children}
          </ClientSessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
