import "@/styles/globals.css";

import { GeistMono } from "geist/font/mono";
import { type Metadata } from "next";

import { ClientSessionProvider } from "@/components/providers/client-session-provider";
import { ClientTRPCProvider } from "@/components/providers/client-trpc-provider";
import { getServerAuthSession } from "@/+server/auth/auth";

export const metadata: Metadata = {
  title: "Stable Pixel",
  description: "Stable Pixel",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();

  return (
    <html lang="en">
      <body className={GeistMono.className}>
        <ClientSessionProvider session={session}>
          <ClientTRPCProvider>{children}</ClientTRPCProvider>
        </ClientSessionProvider>
      </body>
    </html>
  );
}
