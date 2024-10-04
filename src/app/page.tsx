"use client";

import { api } from "@/trpc/react";
import { toast } from "sonner";

import { Prompt } from "@/components/features/generation/prompt";
import { Output } from "@/components/features/generation/output";
import { Toaster } from "@/components/ui/sonner";
import { OpenposeEditor } from "@/components/features/openpose/openpose-editor";
import { useAppState } from "@/hooks/use-app-state";
import { blobToBase64 } from "@/lib/utils";
import { List } from "@/components/features/generation/list";

export default function Home() {
  const { image, setImage, pose } = useAppState();

  const { inference } = api.useUtils();
  const { mutateAsync, isPending } = api.inference.create.useMutation({
    onSuccess: async () => {
      toast("Image is generating...", {
        position: "top-right",
        duration: 1500,
      });
      await inference.list.invalidate();
    },
    onError: (error) => {
      toast("Something went wrong...", {
        description: error.message,
        position: "top-right",
        duration: 1500,
      });
    },
  });

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden">
      <div className="flex h-full">
        <div className="h-full w-[500px]">
          <Prompt
            onSubmit={async (data) => {
              if (!pose) {
                return;
              }

              const base64 = await blobToBase64(pose);

              await mutateAsync({
                ...data,
                pose: base64,
              });
            }}
            isPending={isPending}
            isDisabled={!pose}
          />
        </div>

        <div className="flex h-full w-full flex-col">
          <div className="flex h-1/2 w-full">
            <Output src={image} title="Generated Image" />
          </div>

          <div className="flex h-1/2 w-full">
            <OpenposeEditor />
          </div>
        </div>

        <div className="h-full w-[250px]">
          <List
            onImageClick={(_input, output) => {
              setImage(output);
            }}
          />
        </div>
      </div>
      <Toaster />
    </main>
  );
}
