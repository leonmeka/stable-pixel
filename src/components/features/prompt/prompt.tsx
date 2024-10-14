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
import { Slider } from "@/components/ui/slider";

const numInferenceStepsMIN = 5;
const numInferenceStepsMAX = 10;
const guidanceScaleMIN = 1;
const guidanceScaleMAX = 2;
const poseStrengthMIN = 0.5;
const poseStrengthMAX = 1.5;

const SCHEMA = z.object({
  prompt: z.string().min(5),
  numInferenceSteps: z
    .number()
    .min(numInferenceStepsMIN)
    .max(numInferenceStepsMAX),
  guidanceScale: z.number().min(guidanceScaleMIN).max(guidanceScaleMAX),
  poseStrength: z.number().min(poseStrengthMIN).max(poseStrengthMAX),
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
      prompt: "A generic character",
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
                  <Slider
                    defaultValue={[field.value]}
                    min={numInferenceStepsMIN}
                    max={numInferenceStepsMAX}
                    step={0.1}
                    onValueChange={(vals) => {
                      field.onChange(vals[0]);
                    }}
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
                  <Slider
                    defaultValue={[field.value]}
                    min={guidanceScaleMIN}
                    max={guidanceScaleMAX}
                    step={0.1}
                    onValueChange={(vals) => {
                      field.onChange(vals[0]);
                    }}
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
                  <Slider
                    defaultValue={[field.value]}
                    min={poseStrengthMIN}
                    max={poseStrengthMAX}
                    step={0.1}
                    onValueChange={(vals) => {
                      field.onChange(vals[0]);
                    }}
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
          {isPending ? "Starting..." : "Generate (1 Credit)"}
        </Button>
      </form>
    </Form>
  );
};
