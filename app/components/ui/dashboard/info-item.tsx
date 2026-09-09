import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

interface InfoItemProps {
  className?: string;
  icon: React.ElementType;
  children: ReactNode;
  label: string;
}

export default function InfoItem({
  className,
  icon: Icon,
  children,
  label,
}: Readonly<InfoItemProps>) {
  return (
    <div
      className={cn(
        `w-full flex items-center justify-between text-sm border-b gap-3 p-2`,
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="size-5 text-muted-foreground" />
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
      </div>
      {children ?? <span>—</span>}
    </div>
  );
}
