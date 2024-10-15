"use client";

import { Credits } from "@/components/features/auth/credits";
import { AuthButton } from "@/components/features/auth/auth-button";
import { type Session } from "next-auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NavbarProps {
  session: Session | null;
}

export const Navbar = ({ session }: NavbarProps) => {
  return (
    <nav className="flex w-full items-center justify-end border-b bg-background">
      <div className="flex w-full flex-1 items-center">
        <Link href="/">
          <Button>Home</Button>
        </Link>
        <Link href="/terms">
          <Button variant={"secondary"}>Terms</Button>
        </Link>
        <Link href="/privacy">
          <Button variant={"secondary"}>Privacy</Button>
        </Link>
      </div>

      <div className="flex items-center">
        {session && <Credits session={session} />}
        <AuthButton session={session} />
      </div>
    </nav>
  );
};
