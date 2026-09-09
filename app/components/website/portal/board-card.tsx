import { ChevronLeftIcon, FileTextIcon } from "lucide-react";

interface PortalBoardCardProps {
  title: string;
  postCount?: number;
  onClick: () => void;
  isActive?: boolean;
}

export default function PortalBoardCard({
  title,
  postCount,
  onClick,
  isActive = false,
}: Readonly<PortalBoardCardProps>) {
  return (
    <button
      onClick={onClick}
      className={`
        group flex items-center justify-between gap-3 rounded-lg 
        px-4 py-3 cursor-pointer transition-all duration-300 
        hover:shadow-md hover:-translate-y-0.5
        ${
          isActive
            ? "border border-blue-400 bg-blue-50/50 hover:bg-blue-50/70 hover:border-blue-400 dark:bg-blue-950/30 dark:border-blue-700"
            : "border border-border/50 bg-muted/30 hover:bg-muted/60 hover:border-border"
        }
      `}
    >
      <div className="flex items-center gap-2.5">
        <div
          className={`
            flex h-7 w-7 shrink-0 items-center justify-center rounded-md 
            border transition-all duration-300
            ${
              isActive
                ? "border-blue-300 bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:border-blue-600 dark:text-blue-300"
                : "border-border/50 bg-background text-muted-foreground group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-950/50 dark:group-hover:text-blue-400 dark:group-hover:border-blue-800"
            }
          `}
        >
          <FileTextIcon className="w-3.5 h-3.5" />
        </div>
        <span className="text-sm font-medium lg:text-base">{title}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {postCount !== undefined && postCount > 0 && (
          <div
            className={`
              inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium
              ${
                isActive
                  ? "border-blue-300 bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:border-blue-600 dark:text-blue-300"
                  : "border-border/50 bg-background text-muted-foreground"
              }
            `}
          >
            {postCount}
          </div>
        )}
        <ChevronLeftIcon className="w-4 h-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-x-1" />
      </div>
    </button>
  );
}
