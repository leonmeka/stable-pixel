"use client";

import { AuthButton } from "../auth/auth-button";
import { type Session } from "next-auth";

interface NavbarProps {
  session: Session | null;
}

export const Navbar = ({ session }: NavbarProps) => {
  return (
    <nav className="grid w-full items-center justify-end border-b bg-background">
      <AuthButton session={session} />
    </nav>
  );
};
