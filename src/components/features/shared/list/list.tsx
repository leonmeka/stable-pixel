import { type PredictionInput } from "@/types";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { ListItem } from "./list-item";
import { api } from "@/components/providers/client-trpc-provider";

interface ListProps {
  onImageClick: (input: PredictionInput, output: string) => void;
}

export const List = ({ onImageClick }: ListProps) => {
  const session = useSession();
  const { data, isLoading, isFetched } = api.inference.list.useQuery(
    undefined,
    {
      enabled: session.status === "authenticated",
      refetchInterval: 5_000,
    },
  );

  return (
    <div className="grid h-full gap-1 border p-2">
      {isLoading && (
        <div className="flex flex-col items-center justify-center">
          <Loader2 size={24} className="animate-spin text-muted-foreground" />
        </div>
      )}

      {isFetched && (
        <div className="flex flex-col gap-1 overflow-y-auto">
          {data?.map((item) => (
            <ListItem key={item.id} item={item} onImageClick={onImageClick} />
          ))}
        </div>
      )}
    </div>
  );
};
