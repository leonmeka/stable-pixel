import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Footer } from "@/components/features/shared/layout/footer";

export default async function Home() {
  return (
    <div className="flex h-dvh w-dvw flex-col overflow-hidden">
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold">Stable Pixel</h1>
        <p className="max-w-xs text-center text-lg text-muted-foreground md:max-w-sm">
          Create stunning pixel art with the power of AI in just seconds.
        </p>

        <Link href="/app">
          <Button>Start Now</Button>
        </Link>
      </div>

      <Footer />
    </div>
  );
}
