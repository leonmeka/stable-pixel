"use client";

import { Button } from "@/components/ui/button";
import { AuthButton } from "../auth/auth-button";
import { type Session } from "next-auth";
import { api } from "@/trpc/react";

interface NavbarProps {
  session: Session | null;
}

export const Navbar = ({ session }: NavbarProps) => {
  const { mutateAsync, isPending } = api.checkout.create.useMutation();

  const handleCheckout = async () => {
    if (!session) {
      return;
    }

    const result = await mutateAsync();

    window.location.href = result.url;
  };

  return (
    <nav className="flex w-full items-center justify-end border-b bg-background">
      {session && (
        <Button loading={isPending} onClick={handleCheckout}>
          Credits ({session?.user.credits ?? 0})
        </Button>
      )}
      <AuthButton session={session} />
    </nav>
  );
};
