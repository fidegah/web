import { type LucideIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Badge } from "./badge";
import { getTagIcon } from "~/lib/changelog-tag-icons";

interface ChangelogBadgeProps {
  name: string | undefined;
  icon: string | null;
}

export default function ChangelogBadge({
  name,
  icon,
}: Readonly<ChangelogBadgeProps>) {
  const Icon = getTagIcon(icon);

  return (
    <Badge
      className={cn(
        "gap-1.5 px-3 py-1 text-xs font-medium cursor-default",
        "bg-blue-50 text-blue-700 border-blue-200",
        "dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
        "hover:bg-blue-100 dark:hover:bg-blue-950/70",
        "transition-colors",
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      {name}
    </Badge>
  );
}
