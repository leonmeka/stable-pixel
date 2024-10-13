import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";

const SCHEMA = z.object({
  prompt: z.string().min(5),
  numInferenceSteps: z.number().min(5).max(10),
  guidanceScale: z.number().min(1).max(2),
  poseStrength: z.number().min(0).max(1),
});

interface PromptProps {
  onSubmit: (values: z.infer<typeof SCHEMA>) => void;
  isPending: boolean;
  isDisabled?: boolean;
}

export const Prompt = ({ onSubmit, isPending, isDisabled }: PromptProps) => {
  const form = useForm<z.infer<typeof SCHEMA>>({
    resolver: zodResolver(SCHEMA),
    defaultValues: {
      prompt: "A generic man",
      numInferenceSteps: 10,
      guidanceScale: 1.5,
      poseStrength: 1,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full w-full flex-col justify-between border"
      >
        <div className="grid gap-2 overflow-y-auto p-4">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter prompt..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numInferenceSteps"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inference Steps</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter number of inference steps..."
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="guidanceScale"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Guidance Scale</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter guidance scale..."
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="poseStrength"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pose Strength</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter pose strength..."
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4">
          <p className="px-2 text-center text-xs text-muted-foreground">
            Image generation usually takes under 5 seconds. The first one may
            take up to 80 seconds while the server warms up.
          </p>
          <Button
            type="submit"
            size={"lg"}
            loading={isPending}
            disabled={!form.formState.isValid || isPending || isDisabled}
          >
            <Sparkles size={16} />
            {isPending ? "Starting..." : "Generate (1 Credit)"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
