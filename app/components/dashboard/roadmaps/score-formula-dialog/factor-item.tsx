import { Trash2, Loader2, Sparkles } from "lucide-react";
import { Activity } from "react";
import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ROADMAP_FACTOR_TYPES } from "~/constants/roadmap/factors";
import { cn } from "~/lib/utils";
import type { RoadmapFactor } from "~/types";

const METRIC_LABELS: Record<string, string> = {
  votes: "تعداد رأی‌ها",
  comments: "تعداد دیدگاه‌ها",
  age: "قدمت پست",
};

interface FactorItemProps {
  factor: RoadmapFactor;
  weightOptions: number[];
  onWeightChange: (id: string, weight: number) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

export default function RoadmapFactorItem({
  factor,
  weightOptions,
  onWeightChange,
  onDelete,
  isUpdating,
  isDeleting,
}: Readonly<FactorItemProps>) {
  const isDisabled = isUpdating || isDeleting;
  const isBuiltIn = factor.source === "built_in";

  const typeLabel =
    ROADMAP_FACTOR_TYPES.find((opt) => opt.value === factor.type)?.label ??
    factor.type;

  return (
    <div
      className={cn(
        "relative flex items-center justify-between gap-4 bg-background p-3 rounded-md border shadow-sm transition-all duration-300",
        isUpdating && "border-sky-500/40 bg-sky-500/2 animate-pulse",
        isDeleting && "border-destructive/40 bg-destructive/2 scale-[0.99]",
      )}
    >
      <div className="flex items-center gap-3 flex-1 truncate">
        <span
          className={cn(
            "font-medium text-sm text-foreground truncate transition-all duration-300",
            isDisabled && "blur-[1.5px] opacity-60",
          )}
        >
          {factor.name}
        </span>

        <Activity mode={isUpdating ? "visible" : "hidden"}>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shadow-[0_0_12px_-3px_rgba(14,165,233,0.3)] animate-pulse backdrop-blur-sm">
            <Loader2 className="h-3 w-3 animate-spin text-sky-500 stroke-[2.5]" />
            در حال به‌روزرسانی
          </span>
        </Activity>

        <Activity mode={isDeleting ? "visible" : "hidden"}>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wide bg-destructive/10 text-destructive border border-destructive/20 shadow-[0_0_12px_-3px_rgba(239,68,68,0.2)] animate-pulse backdrop-blur-sm">
            <Loader2 className="h-3 w-3 animate-spin text-destructive stroke-[2.5]" />
            در حال حذف
          </span>
        </Activity>
      </div>

      <div
        className={cn(
          "flex items-center gap-3 transition-all duration-300",
          isDisabled && "blur-[1.5px] pointer-events-none opacity-60",
        )}
      >
        {isBuiltIn ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-muted text-muted-foreground border">
            <Sparkles className="size-3 text-amber-500" />
            {factor.metric ? METRIC_LABELS[factor.metric] : "آماده"}
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border">
            {typeLabel}
          </span>
        )}

        <Select
          dir="rtl"
          value={Number(factor.weight).toFixed(1)}
          onValueChange={(value) => onWeightChange(factor.id, Number(value))}
        >
          <SelectTrigger className="w-fit min-w-24 h-9 text-xs">
            <SelectValue placeholder="وزن" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {weightOptions.map((opt) => (
                <SelectItem key={opt} value={opt.toFixed(1)}>
                  وزن {opt.toFixed(1)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <IconButton
          type="button"
          icon={Trash2}
          color={[220, 38, 38]}
          onClick={() => onDelete(factor.id)}
          disabled={isDisabled}
          title="حذف وزن"
          aria-label="حذف این مقدار وزن"
        />
      </div>
    </div>
  );
}
