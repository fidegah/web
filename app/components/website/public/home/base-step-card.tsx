import { type ComponentType, type ReactNode } from "react";
import { cn } from "~/lib/utils";

interface BaseStepCardProps {
  title: string;
  description: string;
  icon?: ComponentType<{ className?: string }>;
  customHeader?: ReactNode;
  badgeText?: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function BaseStepCard({
  title,
  description,
  icon: Icon,
  customHeader,
  badgeText,
  isSelected = false,
  onClick,
}: Readonly<BaseStepCardProps>) {
  const renderHeaderOrIcon = () => {
    if (customHeader) {
      return (
        <div className="transition-all duration-500 transform group-hover:-translate-y-1">
          {customHeader}
        </div>
      );
    }

    if (Icon) {
      return (
        <div
          className={cn(
            "p-3 rounded-2xl border transition-all duration-500 transform",
            isSelected
              ? "border-blue-500/30 bg-blue-500/10 text-blue-500 shadow-inner scale-105"
              : "border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 group-hover:text-blue-500 group-hover:-translate-y-1 group-hover:rotate-3 shadow-xs",
          )}
        >
          <Icon className="size-5 transition-transform duration-500" />
        </div>
      );
    }

    return <div />;
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full h-full relative rounded-3xl p-6 transition-all duration-500 select-none overflow-hidden group",
        "border bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md text-right",
        "flex flex-col justify-between items-stretch gap-6", // تضمین هم‌ارتفاعی و توزیع عادلانه فضا
        onClick ? "cursor-pointer" : "cursor-default",
        isSelected
          ? "border-blue-500/50 ring-1 ring-blue-500/20 shadow-2xl shadow-blue-500/5 -translate-y-2"
          : "border-zinc-200/60 dark:border-zinc-800/60 hover:border-blue-500/30 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]",
      )}
    >
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="flex items-center justify-between relative z-10 w-full">
        {renderHeaderOrIcon()}

        {badgeText && (
          <span
            className={cn(
              "text-4xl font-black tracking-tight transition-all duration-500 font-mono",
              isSelected
                ? "text-blue-500/20 scale-105"
                : "text-zinc-300 dark:text-zinc-800 group-hover:text-blue-500/10 group-hover:scale-105",
            )}
          >
            {badgeText}
          </span>
        )}
      </div>

      <div className="space-y-2.5 relative z-10 flex-1 flex flex-col justify-start">
        <h3
          className={cn(
            "text-lg font-extrabold tracking-tight transition-colors duration-300 text-zinc-900 dark:text-zinc-100",
            isSelected ||
              "group-hover:text-blue-500 dark:group-hover:text-blue-400",
          )}
        >
          {title}
        </h3>

        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal transition-colors duration-300">
          {description}
        </p>
      </div>

      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-[3px] transition-all duration-700 transform scale-x-0 origin-left rounded-b-3xl",
          isSelected
            ? "bg-linear-to-r from-blue-500 to-blue-400 scale-x-100"
            : "bg-linear-to-r from-blue-500/40 to-blue-400/10 group-hover:scale-x-100",
        )}
      />
    </button>
  );
}
