"use client";

import { api } from "@/trpc/react";
import { toast } from "sonner";

import { Prompt } from "@/components/features/generation/prompt";
import { Output } from "@/components/features/generation/output";
import { Toaster } from "@/components/ui/sonner";
import { OpenposeEditor } from "@/components/features/generation/openpose/openpose-editor";
import { blobToBase64 } from "@/lib/utils";
import { List } from "@/components/features/generation/list/list";
import { Navbar } from "@/components/features/layout/navbar";
import { useSession } from "next-auth/react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession();

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
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <Navbar session={session} />

      <main className="flex h-full w-full flex-grow overflow-hidden">
        <div className="flex h-full w-full overflow-hidden">
          <div className="h-full w-[350px] flex-shrink-0 overflow-y-auto">
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
              isDisabled={!pose || !isAuthorized}
            />
          </div>

          <ResizablePanelGroup
            direction="vertical"
            className="flex h-full w-full flex-col overflow-hidden"
          >
            <ResizablePanel defaultSize={50}>
              <Output src={image} />
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={50}>
              <OpenposeEditor onPoseChange={setPose} />
            </ResizablePanel>
          </ResizablePanelGroup>

          <div className="h-full w-[250px] flex-shrink-0 overflow-y-auto">
            <List
              onImageClick={(_input, output) => {
                setImage(output);
              }}
            />
          </div>
        </div>
        <Toaster />
      </main>
    </div>
  );
}
