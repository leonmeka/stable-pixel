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

const SCHEMA = z.object({
  prompt: z.string().min(5),
  numInferenceSteps: z.number().min(0).max(60),
  guidanceScale: z.number().min(0).max(12),
  poseStrength: z.number().min(0).max(2),
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
            disabled
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
            disabled
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
            disabled
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

        <Button
          type="submit"
          size={"lg"}
          loading={isPending}
          disabled={!form.formState.isValid || isPending || isDisabled}
        >
          {isPending ? "Generating..." : "Generate (1 Credit)"}
        </Button>
      </form>
    </Form>
  );
};
