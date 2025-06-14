import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

import { ClientSessionProvider } from "@/components/providers/client-session-provider";
import { ClientTRPCProvider } from "@/components/providers/client-trpc-provider";
import { getServerAuthSession } from "@/+server/auth/auth";

export const metadata: Metadata = {
  title: "Stable Pixel",
  description: "Stable Pixel",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    images: [{ url: "/og-image.png" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();

  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <ClientSessionProvider session={session}>
          <ClientTRPCProvider>{children}</ClientTRPCProvider>
        </ClientSessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
