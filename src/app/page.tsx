"use client";

import { api } from "@/trpc/react";
import { toast } from "sonner";

import { Prompt } from "@/components/features/generation/prompt";
import { Output } from "@/components/features/generation/output";
import { Toaster } from "@/components/ui/sonner";
import { OpenposeEditor } from "@/components/features/openpose/openpose-editor";
import { useAppState } from "@/hooks/use-app-state";
import { blobToBase64 } from "@/lib/utils";

export default function Home() {
  const { image, setImage, pose } = useAppState();

  const { mutateAsync, isPending } = api.inference.generate.useMutation({
    onSuccess: (data) => {
      setImage(data.image);
      toast(`Image generated in ${data.ms} ms`, {
        position: "top-right",
        duration: 1500,
      });
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
    <main className="flex h-screen w-screen flex-col">
      <div className="flex h-full">
        <div className="flex h-full w-full flex-col">
          <div className="flex h-1/2 w-full">
            <Output src={image} title="Generated Image" />
          </div>

          <div className="flex h-1/2 w-full">
            <OpenposeEditor />
          </div>
        </div>

        <div className="h-full w-[500px]">
          <Prompt
            onSubmit={async (data) => {
              if (!pose) {
                return;
              }

              const base64 = await blobToBase64(pose);

              void mutateAsync({
                ...data,
                pose: base64,
              });
            }}
            isPending={isPending}
            isDisabled={!pose}
          />
        </div>
      </div>
      <Toaster />
    </main>
  );
}
