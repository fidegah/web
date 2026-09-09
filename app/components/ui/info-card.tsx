import { cn } from "~/lib/utils";

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}

export default function InfoCard({
  icon,
  label,
  value,
  highlight = false,
}: Readonly<InfoCardProps>) {
  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-lg border border-border/50 bg-muted/30 px-3 py-2 transition-all duration-200 hover:bg-muted/50 hover:border-border",
        highlight &&
          "bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800",
      )}
    >
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
          highlight
            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400"
            : "bg-muted text-muted-foreground",
        )}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[11px] font-medium text-muted-foreground leading-tight">
          {label}
        </span>
        <span
          className={cn(
            "text-sm font-semibold leading-tight mt-1",
            highlight && "text-amber-700 dark:text-amber-400",
          )}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
