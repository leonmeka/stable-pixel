/* eslint-disable @next/next/no-img-element */
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { type PredictionInput } from "@/types";
import { Loader } from "lucide-react";

interface ListProps {
  onImageClick: (input: PredictionInput, output: string) => void;
}

export const List = ({ onImageClick }: ListProps) => {
  const { data, isPending } = api.inference.list.useQuery();

  return (
    <div className="grid h-full gap-1">
      {isPending && (
        <div className="grid items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <Loader size={24} className="animate-spin" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      )}

      {!isPending && (
        <div className="flex flex-col gap-1 overflow-y-auto">
          {data?.map((item) => (
            <Card
              key={item.id}
              className="border-none"
              onClick={() =>
                onImageClick(
                  item.input as PredictionInput,
                  item.output as string,
                )
              }
            >
              <CardContent className="p-1">
                {item.status === "succeeded" ? (
                  <img
                    src={item.output as string}
                    alt={(item.input as PredictionInput).prompt}
                    className="aspect-square cursor-pointer outline outline-2 outline-muted-foreground hover:outline-primary"
                  />
                ) : (
                  <div className="aspect-square animate-pulse bg-muted" />
                )}
              </CardContent>

              <CardFooter className="grid p-1">
                <p className="text-xs text-muted-foreground">
                  {(item.input as PredictionInput).prompt}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
