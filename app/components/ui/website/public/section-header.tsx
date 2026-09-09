import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

interface SectionHeaderProps {
  title: string;
  description: string;
  className?: string;
  children: ReactNode;
}

export default function SectionHeader({
  title,
  description,
  className,
  children,
}: Readonly<SectionHeaderProps>) {
  return (
    <div
      className={cn(
        "w-full flex flex-col items-center px-4 mt-20 gap-4 md:gap-5 text-center",
        className,
      )}
    >
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-linear-to-b from-zinc-950 via-zinc-900 to-zinc-700 dark:from-white dark:via-zinc-200 dark:to-zinc-400">
        {title}
      </h2>

      <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed font-normal">
        {description}
      </p>

      {children}
    </div>
  );
}
