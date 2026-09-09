import { Ban, Eye, EyeOff } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "~/lib/utils";

type AuthInputProps = {
  label?: string;
  placeholder: string;
  id: string;
  icon?: React.ElementType;
  isPassword?: boolean;
  isDisabled?: boolean;
  prefixText?: string;
  suffixText?: string;
  ltr?: boolean;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  label,
  placeholder,
  icon: Icon,
  id,
  isPassword,
  isDisabled,
  prefixText,
  ltr,
  suffixText,
  className,
  ...props
}: Readonly<AuthInputProps>) {
  const [isShowPassword, setIsShowPassword] = useState(!!isPassword);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="group flex flex-col gap-2">
      {/* Floating label */}
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

      {/* Input wrapper */}
      <div
        className={cn(
          "relative flex items-center gap-1 rounded-xl border bg-background",
          "transition-all duration-300 ease-out",
          // Shadow & ring animation on focus
          isFocused
            ? "border-indigo-400 dark:border-indigo-500 shadow-[0_0_0_3px_rgba(99,102,241,0.15)] dark:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]"
            : "border-border shadow-sm hover:border-muted-foreground/40 hover:shadow-md",
          isDisabled &&
            "bg-muted/50 border-border opacity-60 cursor-not-allowed shadow-none hover:border-border hover:shadow-none",
          ltr ? "ltr pl-3" : "pr-3",
        )}
      >
        {/* Left side: icon + prefix */}
        <div className="flex items-center gap-2 shrink-0">
          {Icon && (
            <Icon
              className={cn(
                "size-4 lg:size-4.5 transition-all duration-300 ease-out",
                isFocused
                  ? "text-indigo-500 dark:text-indigo-400 scale-110"
                  : "text-muted-foreground",
              )}
            />
          )}
          {prefixText && (
            <span
              className={cn(
                "text-sm lg:text-base transition-colors duration-200",
                isFocused
                  ? "text-indigo-500 dark:text-indigo-400"
                  : "text-muted-foreground",
              )}
            >
              {prefixText}
            </span>
          )}
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          id={id}
          name={id}
          type={isShowPassword ? "password" : "text"}
          className={cn(
            "w-full py-2.5 px-1 outline-none text-sm lg:text-base",
            "bg-transparent transition-colors duration-200 placeholder:text-muted-foreground/50",
            "caret-indigo-500 dark:caret-indigo-400",
            className,
          )}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            props.onChange?.(e);
          }}
          disabled={isDisabled}
          {...props}
        />

        {/* Right side: disabled icon / password toggle / suffix */}
        {(isDisabled || isPassword || suffixText) && (
          <div
            className={cn(
              "flex items-center gap-1.5 shrink-0",
              ltr ? "mr-2" : "ml-2",
            )}
          >
            {isDisabled && (
              <Ban className="size-3.5 text-muted-foreground/70 animate-in fade-in duration-200" />
            )}

            {isPassword && (
              <button
                type="button"
                onClick={() => setIsShowPassword((v) => !v)}
                className={cn(
                  "flex items-center justify-center size-7 rounded-lg",
                  "text-muted-foreground transition-all duration-200 ease-out",
                  "hover:text-foreground hover:bg-muted/60 active:scale-90",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
                )}
                aria-label={isShowPassword ? "Hide password" : "Show password"}
              >
                <span
                  className={cn(
                    "transition-all duration-300 ease-out flex items-center justify-center",
                    // swap with a small rotate+scale effect
                    isShowPassword
                      ? "rotate-0 opacity-100"
                      : "rotate-12 opacity-90",
                  )}
                >
                  {isShowPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </span>
              </button>
            )}

            {suffixText && (
              <span
                className={cn(
                  "text-sm lg:text-base px-1 transition-colors duration-200",
                  isFocused
                    ? "text-indigo-500 dark:text-indigo-400"
                    : "text-muted-foreground",
                )}
              >
                {suffixText}
              </span>
            )}
          </div>
        )}

        {/* Animated bottom-border line (optional accent) */}
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
