import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { type Session } from "next-auth";
import { signIn } from "next-auth/react";

interface AuthButtonProps {
  session: Session | null;
}

export const AuthButton = ({ session }: AuthButtonProps) => {
  if (!session) {
    return <Button onClick={() => signIn()}>Login</Button>;
  }

  return (
    <div className="flex items-center gap-2 p-2">
      <span className="text-sm text-muted-foreground">
        {session.user?.name}
      </span>
      <Avatar className="h-8 w-8">
        <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
        <AvatarImage
          src={session.user?.image ?? ""}
          alt={session.user?.name ?? ""}
        />
      </Avatar>
    </div>
  );
};
