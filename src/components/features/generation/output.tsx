/* eslint-disable @next/next/no-img-element */
import { Card, CardContent } from "@/components/ui/card";

interface OutputProps {
  src?: string | null;
  title?: string;
}

export const Output = ({ src, title }: OutputProps) => {
  return (
    <Card className="relative h-full w-full flex-1 border-none">
      <CardContent className="grid h-full w-full items-center justify-center p-0">
        {!src && (
          <p className="text-center text-muted-foreground">
            No image available.
          </p>
        )}

        {src && (
          <img
            src={src}
            alt="Generated Image"
            className="absolute inset-0 m-auto w-[256px] object-contain"
          />
        )}

        {title && (
          <h2 className="absolute bottom-2 right-2 bg-background bg-opacity-50 p-2 text-sm text-foreground">
            {title}
          </h2>
        )}
      </CardContent>
    </Card>
  );
};
