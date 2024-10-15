import { Button } from "@/components/ui/button";
import { type Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";

interface AuthButtonProps {
  session: Session | null;
}

export const AuthButton = ({ session }: AuthButtonProps) => {
  if (!session) {
    return (
      <Button onClick={() => signIn()} disabled>
        Login
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Button onClick={() => signOut()} variant={"ghost"}>
        Logout
      </Button>
    </div>
  );
};
