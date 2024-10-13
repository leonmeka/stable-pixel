import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { type PredictionInput } from "@/types";
import { Loader2 } from "lucide-react";
import { type Prediction } from "replicate";

interface ListItemProps {
  item: Prediction;
  onImageClick: (input: PredictionInput, output: string) => void;
}

export const ListItem = ({ item, onImageClick }: ListItemProps) => {
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
      <CardFooter className="grid p-2">
        <p className="text-xs text-muted-foreground">
          {(item.input as PredictionInput).prompt}
        </p>
      </CardFooter>
    </Card>
  );
};
