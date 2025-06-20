"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, value: propValue, onValueChange, ...props }, ref) => {
  const [value, setValue] = React.useState(
    propValue ?? props.defaultValue ?? 0,
  );

  React.useEffect(() => {
    if (propValue !== undefined) {
      setValue(propValue);
    }
  }, [propValue]);

  const handleChange = (newValue: number[]) => {
    setValue(newValue[0]!);
    if (onValueChange) onValueChange(newValue);
  };

  return (
    <div className="flex flex-col items-end justify-center gap-2">
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className,
        )}
        onValueChange={handleChange}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-4 w-4 cursor-pointer rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>
      <span className="text-sm text-primary">{`${Number(value) ?? props.min}/${props.max}`}</span>
    </div>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
