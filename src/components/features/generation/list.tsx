/* eslint-disable @next/next/no-img-element */
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { api } from "@/trpc/react";
import { type PredictionInput } from "@/types";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface ListProps {
  onImageClick: (input: PredictionInput, output: string) => void;
}

export const List = ({ onImageClick }: ListProps) => {
  const session = useSession();
  const { data, isLoading, isFetched } = api.inference.list.useQuery(
    undefined,
    {
      enabled: session.status === "authenticated",
      refetchInterval: 10_000,
    },
  );

  return (
    <div className="grid h-full gap-1 border p-2">
      {isLoading && (
        <div className="grid items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <Loader2 size={24} className="animate-spin text-muted-foreground" />
          </div>
        </div>
      )}

      {isFetched && (
        <div className="flex flex-col gap-1 overflow-y-auto">
          {data?.map((item) => (
            <Card key={item.id} className="border-none">
              <CardContent className="p-2">
                {item.status === "succeeded" ? (
                  <img
                    src={item.output as string}
                    alt={(item.input as PredictionInput).prompt}
                    onClick={() =>
                      onImageClick(
                        item.input as PredictionInput,
                        item.output as string,
                      )
                    }
                    className="rendering-pixelated aspect-square cursor-pointer outline outline-2 outline-muted-foreground hover:outline-primary"
                  />
                ) : (
                  <div className="grid aspect-square animate-pulse items-center justify-center bg-muted">
                    <Loader2
                      size={32}
                      className="animate-spin text-muted-foreground"
                    />
                  </div>
                )}
              </CardContent>

              <CardFooter className="grid p-2">
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
