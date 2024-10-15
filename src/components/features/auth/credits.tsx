import { api } from "@/components/providers/client-trpc-provider";
import { Button } from "@/components/ui/button";
import { type Session } from "next-auth";

interface CreditsProps {
  session: Session | null;
}

export const Credits = ({ session }: CreditsProps) => {
  const { mutateAsync, isPending } = api.checkout.create.useMutation();

  const hasCredits = session?.user.credits ?? 0 > 0;
  const text = hasCredits
    ? `Credits (${session?.user.credits})`
    : "Buy Credits";

  const handleCheckout = async () => {
    if (!session) {
      return;
    }

    const result = await mutateAsync();

    window.location.href = result.url;
  };

  return (
    <Button loading={isPending} onClick={handleCheckout}>
      {text}
    </Button>
  );
};
