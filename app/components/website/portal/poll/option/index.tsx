import { Activity, type SetStateAction } from "react";
import { CountingNumber } from "~/components/ui/animate-ui/text/counting-number";
import { cn } from "~/lib/utils";
import type { Poll, PollOption } from "~/types";
import PollOptionContent from "./content";

interface PollOptionProps {
  poll: Poll;
  option: PollOption;
  isActive: boolean;
  selectedOptions: string[];
  setSelectedOptions: (value: SetStateAction<string[]>) => void;
}

const getUpdatedOptions = (
  type: string,
  optionId: string,
  prev: string[],
): string[] => {
  if (type === "ranking" || type === "multiple") {
    return prev.includes(optionId)
      ? prev.filter((id) => id !== optionId)
      : [...prev, optionId];
  }
  if (type === "single") {
    return prev.includes(optionId) ? [] : [optionId];
  }
  return prev;
};

const getContainerClasses = (
  isActive: boolean,
  isSelectedOrVoted: boolean,
  showResults: boolean,
  isTopVoted: boolean,
): string => {
  return cn(
    "relative overflow-hidden p-4 border rounded-xl flex items-center justify-between",
    "transition-all duration-300 select-none gap-4 group bg-background border-border/70",
    isActive &&
      "cursor-pointer hover:border-cyan-500 hover:bg-cyan-50/10 dark:hover:bg-cyan-950/5 hover:shadow-sm hover:-translate-y-px active:translate-y-0 active:shadow-none",
    isSelectedOrVoted &&
      "border-cyan-500 bg-cyan-50/30 dark:bg-cyan-950/10 shadow-sm shadow-cyan-500/5 hover:border-red-500 hover:bg-red-50/10 dark:hover:bg-red-950/10",
    showResults &&
      isTopVoted &&
      !isSelectedOrVoted &&
      "border-emerald-500/70 bg-emerald-50/20 dark:bg-emerald-950/10",
    !isActive && "cursor-default",
  );
};

export default function PollOption({
  poll,
  option,
  isActive,
  selectedOptions,
  setSelectedOptions,
}: Readonly<PollOptionProps>) {
  const { type, isVoted, options } = poll;

  const isThisOptionVoted = option.isVoted;
  const uiRankIndex = selectedOptions.indexOf(option.id);
  const isCheckedInUI = uiRankIndex !== -1;

  const isSelectedOrVoted = isVoted
    ? isCheckedInUI
    : isCheckedInUI || isThisOptionVoted;
  const displayRank = isCheckedInUI ? uiRankIndex + 1 : option.userRank;
  const showResults = isVoted || !isActive;

  const hasOptions = !!(options && options.length > 0);
  const maxVotes = hasOptions
    ? Math.max(...options.map((o) => o.votesCount || 0))
    : 0;
  const isTopVoted =
    hasOptions && maxVotes > 0 && option.votesCount === maxVotes;

  const handleSelect = () => {
    if (isActive) {
      setSelectedOptions((prev) => getUpdatedOptions(type, option.id, prev));
    }
  };

  return (
    <button
      onClick={handleSelect}
      disabled={!isActive}
      className={getContainerClasses(
        isActive,
        isSelectedOrVoted,
        showResults,
        isTopVoted,
      )}
    >
      <Activity mode={showResults ? "visible" : "hidden"}>
        <div
          className={cn(
            "absolute top-0 right-0 bottom-0 transition-all duration-700 pointer-events-none",
            isTopVoted && !isSelectedOrVoted
              ? "bg-emerald-500/10 dark:bg-emerald-500/5"
              : "bg-cyan-500/10 dark:bg-cyan-500/5",
            isSelectedOrVoted &&
              "bg-cyan-500/15 dark:bg-cyan-500/10 group-hover:bg-red-500/5",
          )}
          style={{ width: `${option.percentage}%` }}
        />
      </Activity>

      <PollOptionContent
        type={type}
        isSelectedOrVoted={isSelectedOrVoted}
        displayRank={displayRank}
        isActive={isActive}
        option={option}
        isThisOptionVoted={isThisOptionVoted}
        isCheckedInUI={isCheckedInUI}
        showResults={showResults}
        isTopVoted={isTopVoted}
      />

      <Activity mode={showResults ? "visible" : "hidden"}>
        <div className="flex items-center gap-2 relative z-10 shrink-0">
          <span
            className={cn(
              "text-sm lg:text-base font-bold tabular-nums transition-colors",
              isSelectedOrVoted
                ? "text-cyan-600 dark:text-cyan-400 group-hover:text-red-500"
                : "text-muted-foreground/70",
              isTopVoted &&
                !isSelectedOrVoted &&
                "text-emerald-600 dark:text-emerald-400",
            )}
          >
            <CountingNumber number={option.votesCount || 0} />
          </span>
          <span className="text-sm text-muted-foreground/60">
            ({option.percentage}%)
          </span>
        </div>
      </Activity>
    </button>
  );
}
