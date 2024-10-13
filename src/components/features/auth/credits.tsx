import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Coins } from "lucide-react";
import { type Session } from "next-auth";

interface CreditsProps {
  session: Session | null;
}

export const Credits = ({ session }: CreditsProps) => {
  const { mutateAsync, isPending } = api.checkout.create.useMutation();

  const hasCredits = session?.user.credits ?? 0 > 0;
  const text = hasCredits
    ? `Credits (${session?.user.credits})`
    : "Get Credits";

  const handleCheckout = async () => {
    if (!session) {
      return;
    }

    const result = await mutateAsync();

    window.location.href = result.url;
  };

  return (
    <Button loading={isPending} onClick={handleCheckout}>
      <Coins size={16} />
      {text}
    </Button>
  );
};
