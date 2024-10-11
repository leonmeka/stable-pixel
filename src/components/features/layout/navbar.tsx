"use client";

import { Credits } from "@/components/features/auth/credits";
import { AuthButton } from "@/components/features/auth/auth-button";
import { type Session } from "next-auth";

interface NavbarProps {
  session: Session | null;
}

export const Navbar = ({ session }: NavbarProps) => {
  return (
    <nav className="flex w-full items-center justify-end border-b bg-background">
      {session && <Credits session={session} />}
      <AuthButton session={session} />
    </nav>
  );
};
