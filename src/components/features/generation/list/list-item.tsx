import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { type PredictionInput } from "@/types";
import { Loader2, Timer } from "lucide-react";
import { type Prediction } from "replicate";

interface ListItemProps {
  item: Prediction;
  onImageClick: (input: PredictionInput, output: string) => void;
}

export const ListItem = ({ item, onImageClick }: ListItemProps) => {
  const timeRemaining = () => {
    if (!item.completed_at) {
      return (
        <span className="text-xs text-muted-foreground">processing...</span>
      );
    }

    const createdAt = new Date(item.completed_at);
    const now = new Date();
    const differenceInMs = createdAt.getTime() + 3600000 - now.getTime();
    const differenceInMinutes = Math.floor(differenceInMs / 60000);

    return (
      <span className="flex items-center text-xs text-muted-foreground">
        <Timer size={14} className="mr-2" />
        {`expires in ${differenceInMinutes} minutes`}
      </span>
    );
  };

  return (
    <Card className="border-none">
      <CardContent className="p-2">
        {item.status === "succeeded" ? (
          <img
            src={item.output as string}
            alt={(item.input as PredictionInput).prompt}
            onClick={() =>
              onImageClick(item.input as PredictionInput, item.output as string)
            }
            className="aspect-square cursor-pointer outline outline-2 outline-muted-foreground rendering-pixelated hover:outline-primary"
          />
        ) : (
          <div className="grid aspect-square animate-pulse items-center justify-center bg-muted">
            <Loader2 size={32} className="animate-spin text-muted-foreground" />
          </div>
        )}
      </CardContent>
      <CardFooter className="grid gap-2 p-2">
        <p className="text-xs text-muted-foreground">
          {(item.input as PredictionInput).prompt}
        </p>
        <hr />

        <span className="flex items-center text-xs text-muted-foreground">
          <Timer size={14} className="mr-2" />
          {timeRemaining()}
        </span>
      </CardFooter>
    </Card>
  );
};
