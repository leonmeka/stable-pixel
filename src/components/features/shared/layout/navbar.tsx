"use client";

import { Credits } from "@/components/features/auth/credits";
import { AuthButton } from "@/components/features/auth/auth-button";
import { type Session } from "next-auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Logo from "public/logo.svg";

interface NavbarProps {
  session: Session | null;
}

export const Navbar = ({ session }: NavbarProps) => {
  return (
    <nav className="flex h-9 w-full items-center justify-end overflow-hidden border-b bg-background">
      <Link href="/">
        <Image src={Logo as string} alt="Logo" className="h-9 w-9" />
      </Link>

      <div className="flex w-full flex-1 items-center">
        <Link href="/">
          <Button>Home</Button>
        </Link>
        <Link href="mailto:help@stablepixel.app">
          <Button variant={"ghost"}>Support</Button>
        </Link>
        <Link href="/legal">
          <Button variant={"ghost"}>Legal</Button>
        </Link>
        <Link href="/terms">
          <Button variant={"ghost"}>Terms</Button>
        </Link>
        <Link href="/privacy">
          <Button variant={"ghost"}>Privacy</Button>
        </Link>
      </div>

      <div className="flex items-center">
        {session && <Credits session={session} />}
        <AuthButton session={session} />
      </div>
    </nav>
  );
};
