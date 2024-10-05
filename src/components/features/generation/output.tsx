/* eslint-disable @next/next/no-img-element */
import { Card, CardContent } from "@/components/ui/card";

interface OutputProps {
  src?: string | null;
}

export const Output = ({ src }: OutputProps) => {
  return (
    <Card className="relative h-full w-full flex-1 border-none">
      <CardContent className="grid h-full w-full items-center justify-center p-0">
        {!src && (
          <p className="text-center text-muted-foreground">
            No output available.
          </p>
        )}

        {src && (
          <img
            src={src}
            alt={"generated image"}
            className="absolute inset-0 m-auto w-[256px] object-contain"
          />
        )}
      </CardContent>
    </Card>
  );
};
