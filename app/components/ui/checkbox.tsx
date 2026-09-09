"use client";

import * as React from "react";
import { CheckIcon } from "lucide-react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cn } from "~/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-5 shrink-0 items-center justify-center rounded-md border border-input outline-none cursor-pointer",
        "transition-all duration-300 ease-out precision-gpu",
        "active:scale-90",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50 group-has-disabled/field:opacity-50",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className={cn(
          "flex items-center justify-center text-current",
          "transition-all duration-200 ease-out data-[state=checked]:animate-in data-[state=unchecked]:animate-out data-[state=unchecked]:fade-out-0 data-[state=checked]:fade-in-0 data-[state=unchecked]:zoom-out-95 data-[state=checked]:zoom-in-95",
        )}
      >
        <CheckIcon className="size-3.5 stroke-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
