"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Prompt } from "@/components/features/create-character/prompt/prompt";
import { Output } from "@/components/features/create-character/output/output";
import { Toaster } from "@/components/ui/sonner";
import { OpenposeEditor } from "@/components/features/create-character/openpose/openpose-editor";
import { blobToBase64 } from "@/lib/utils";
import { List } from "@/components/features/shared/list/list";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { api } from "@/components/providers/client-trpc-provider";
import { type Session } from "next-auth";

interface CreateCharacterProps {
  session: Session | null;
}

export const CreateCharacter = ({ session }: CreateCharacterProps) => {
  const [pose, setPose] = useState<Blob | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const { inference } = api.useUtils();
  const { mutateAsync, isPending } = api.inference.create.useMutation({
    onSuccess: async () => {
      toast("Image generation started...", {
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

  const isAuthorized = session ? session.user.credits > 0 : false;

  return (
    <main className="flex h-full w-full flex-grow flex-col overflow-hidden md:flex-row">
      <div className="flex h-full w-full flex-col overflow-y-auto md:flex-row">
        <div className="w-full flex-shrink-0 md:h-full md:w-[350px]">
          <Prompt
            onSubmit={async (data) => {
              if (!pose) {
                return;
              }
              await mutateAsync({
                ...data,
                pose: await blobToBase64(pose),
              });
            }}
            isPending={isPending}
            isDisabled={!pose || !isAuthorized}
          />
        </div>

        <ResizablePanelGroup
          direction="vertical"
          className="flex h-full min-h-[500px] w-full"
        >
          <ResizablePanel defaultSize={50}>
            <Output src={image} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50}>
            <OpenposeEditor onPoseChange={setPose} />
          </ResizablePanel>
        </ResizablePanelGroup>

        <div className="w-full flex-shrink-0 overflow-y-auto md:h-full md:w-[250px]">
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
};
