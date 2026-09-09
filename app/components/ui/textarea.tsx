import { Ban } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "~/lib/utils";

type TextareaProps = {
  label?: string;
  placeholder: string;
  id: string;
  icon?: React.ElementType;
  isDisabled?: boolean;
  ltr?: boolean;
  className?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea({
  label,
  placeholder,
  icon: Icon,
  id,
  isDisabled,
  ltr,
  className,
  ...props
}: TextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="group flex flex-col gap-2">
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "text-sm font-medium transition-all duration-200 ease-out select-none",
            isFocused
              ? "text-indigo-500 dark:text-indigo-400 translate-x-0.5"
              : "text-muted-foreground",
          )}
        >
          {label}
        </label>
      )}

      {/* Wrapper */}
      <div
        className={cn(
          "relative flex gap-1 rounded-xl border bg-background",
          "transition-all duration-300 ease-out",
          isFocused
            ? "border-indigo-400 dark:border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.15)] dark:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]"
            : "border-border shadow-sm hover:border-muted-foreground/40 hover:shadow-md",
          isDisabled &&
            "bg-muted/50 border-border opacity-60 cursor-not-allowed shadow-none hover:border-border hover:shadow-none",
          ltr ? "ltr pl-3" : "pr-3",
        )}
      >
        {/* Icon */}
        {Icon && (
          <div className="flex shrink-0 pt-3">
            <Icon
              className={cn(
                "size-4 lg:size-4.5 transition-all duration-300 ease-out",
                isFocused
                  ? "text-indigo-500 dark:text-indigo-400 scale-110"
                  : "text-muted-foreground",
              )}
            />
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          id={id}
          name={id}
          className={cn(
            "w-full py-2.5 px-1 outline-none text-sm lg:text-base",
            "bg-transparent transition-colors duration-200 placeholder:text-muted-foreground/50",
            "caret-indigo-500 dark:caret-indigo-400",
            "resize-none min-h-25",
            className,
          )}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isDisabled}
          {...props}
        />

        {/* Disabled icon */}
        {isDisabled && (
          <div className={cn("flex shrink-0 pt-3", ltr ? "mr-2" : "ml-2")}>
            <Ban className="size-3.5 text-muted-foreground/70 animate-in fade-in duration-200" />
          </div>
        )}

        {/* Animated bottom-border line */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bottom-0 left-1/2 h-0.5 rounded-full",
            "bg-indigo-500 dark:bg-indigo-400",
            "transition-all duration-400 ease-out",
            isFocused
              ? "w-[calc(100%-24px)] -translate-x-1/2"
              : "w-0 -translate-x-1/2",
          )}
        />
      </div>
    </div>
  );
}
