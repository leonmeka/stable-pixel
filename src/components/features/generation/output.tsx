import { Card, CardContent } from "@/components/ui/card";

interface OutputProps {
  src?: string | File | null;
  title?: string;
}

export const Output = ({ src, title }: OutputProps) => {
  return (
    <Card className="relative h-full w-full flex-1">
      <CardContent className="grid h-full w-full items-center justify-center p-0">
        {!src && (
          <p className="text-muted-foreground text-center">
            No image available.
          </p>
        )}

        {src && (
          <img
            src={src instanceof File ? URL.createObjectURL(src) : src}
            alt="Generated Image"
            className="absolute inset-0 h-full w-full object-contain"
          />
        )}

        {title && (
          <h2 className="text-foreground bg-background absolute bottom-2 right-2 bg-opacity-50 p-2 text-sm">
            {title}
          </h2>
        )}
      </CardContent>
    </Card>
  );
};
