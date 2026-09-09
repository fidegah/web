import { Activity } from "react";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import { cn } from "~/lib/utils";

interface PollOptionContentProps {
  type: string;
  isSelectedOrVoted: boolean;
  displayRank: number | null | undefined;
  isActive: boolean;
  option: any;
  isThisOptionVoted: boolean | undefined;
  isCheckedInUI: boolean;
  showResults: boolean;
  isTopVoted: boolean;
}

export default function PollOptionContent({
  type,
  isSelectedOrVoted,
  displayRank,
  isActive,
  option,
  isThisOptionVoted,
  isCheckedInUI,
  showResults,
  isTopVoted,
}: Readonly<PollOptionContentProps>) {
  return (
    <div className="flex items-center gap-3.5 relative z-10 min-w-0">
      <Activity mode={type === "ranking" ? "visible" : "hidden"}>
        <div
          className={cn(
            "w-6 h-6 rounded-lg border text-xs flex items-center justify-center font-bold transition-all duration-200 shrink-0",
            isSelectedOrVoted
              ? "bg-cyan-600 border-cyan-600 text-white shadow-sm scale-105 group-hover:bg-red-500 group-hover:border-red-500"
              : "border-border text-transparent bg-muted/40",
            isActive && !isSelectedOrVoted && "group-hover:border-cyan-500/50",
          )}
        >
          {isSelectedOrVoted ? displayRank : ""}
        </div>
      </Activity>

      <Activity mode={type === "ranking" ? "hidden" : "visible"}>
        <div className="shrink-0 pointer-events-none">
          <Checkbox
            className={cn(
              "rounded-md border-border bg-muted-foreground transition-colors",
              isSelectedOrVoted &&
                "scale-105 text-cyan-600 border-cyan-500 bg-cyan-500 group-hover:border-red-500 group-hover:bg-red-500 group-hover:text-red-600",
            )}
            checked={isSelectedOrVoted}
          />
        </div>
      </Activity>

      <span className="text-sm lg:text-base font-medium truncate text-foreground/80 group-hover:text-foreground transition-colors">
        {option.title}

        <Activity mode={isThisOptionVoted ? "visible" : "hidden"}>
          <span
            className={cn(
              "text-xs font-semibold px-2 py-0.5 rounded-md mr-2.5 inline-block border transition-colors",
              isCheckedInUI
                ? "text-cyan-600 dark:text-cyan-400 bg-cyan-100/50 dark:bg-cyan-950/50 border-cyan-500/10 group-hover:text-red-500 group-hover:bg-red-100/50 group-hover:border-red-500/20"
                : "text-muted-foreground bg-muted border-border",
            )}
          >
            رای شما{" "}
            {option.user_rank && type !== "single"
              ? `(رتبه ${option.user_rank})`
              : ""}
          </span>
        </Activity>

        <Activity mode={showResults && isTopVoted ? "visible" : "hidden"}>
          <Badge
            variant="secondary"
            className="mr-2.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 text-xs font-medium px-2 py-0.5 hover:bg-emerald-100 dark:hover:bg-emerald-950/70"
          >
            🏆 گزینه برتر
          </Badge>
        </Activity>
      </span>
    </div>
  );
}
