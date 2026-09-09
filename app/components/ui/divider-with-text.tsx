import { cn } from "~/lib/utils";

interface DividerWithTextProps {
  label: string;
  className?: string;
}

export default function DividerWithText({
  label,
  className,
}: DividerWithTextProps) {
  return (
    <div
      className={cn(
        "my-1 flex items-center text-xs text-gray-400 dark:text-gray-500 before:flex-1 before:border-t before:border-gray-200 dark:before:border-gray-800 before:me-4 after:flex-1 after:border-t after:border-gray-200 dark:after:border-gray-800 after:ms-4",
        className,
      )}
    >
      {label}
    </div>
  );
}
