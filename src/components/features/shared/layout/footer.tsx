import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="flex h-10 w-full items-center justify-between border-t bg-background p-2">
      <p className="text-xs text-muted-foreground">© 2024 Stable Pixel</p>

      <div className="flex items-center">
        <Link href="/terms">
          <Button variant={"link"} size={"sm"}>
            Terms
          </Button>
        </Link>
        <Link href="/privacy">
          <Button variant={"link"} size={"sm"}>
            Privacy
          </Button>
        </Link>
      </div>
    </footer>
  );
};
