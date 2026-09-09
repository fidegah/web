import type { RoadmapFactor, RoadmapNewFactorState } from "~/types";
import RoadmapFactorItem from "./factor-item";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ROADMAP_FACTOR_TYPES } from "~/constants/roadmap/factors";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { Spinner } from "~/components/ui/spinner";

const BUILT_IN_METRICS = [
  { value: "votes", label: "تعداد رأی‌ها" },
  { value: "comments", label: "تعداد دیدگاه‌ها" },
  { value: "age", label: "قدمت پست" },
] as const;

interface FactorSectionProps {
  factors: RoadmapFactor[];
  weightOptions: number[];
  formState: RoadmapNewFactorState;
  inputPlaceholder: string;
  containerClassName: string;
  onWeightChange: (id: string, weight: number) => void;
  onDelete: (id: string) => void;
  onFormChange: (updates: Partial<RoadmapNewFactorState>) => void;
  onAdd: () => void;
  isAdding: boolean;
  updatingId: string | null;
  deletingId: string | null;
}

export default function RoadmapFactorSection({
  factors,
  weightOptions,
  formState,
  inputPlaceholder,
  containerClassName,
  onWeightChange,
  onDelete,
  onFormChange,
  onAdd,
  isAdding,
  updatingId,
  deletingId,
}: Readonly<FactorSectionProps>) {
  const isCustom = formState.source === "custom";

  return (
    <div className={`space-y-4 p-4 rounded-lg border ${containerClassName}`}>
      {factors.map((factor) => (
        <RoadmapFactorItem
          key={factor.id}
          factor={factor}
          weightOptions={weightOptions}
          onWeightChange={onWeightChange}
          onDelete={onDelete}
          isUpdating={updatingId === factor.id}
          isDeleting={deletingId === factor.id}
        />
      ))}

      <div className="grid grid-cols-2 md:flex md:items-center gap-2 mt-2">
        <Input
          placeholder={inputPlaceholder}
          value={formState.name}
          onChange={(e) => onFormChange({ name: e.target.value })}
          className="h-9 text-sm col-span-2 md:flex-1"
        />

        <Select
          dir="rtl"
          value={formState.source}
          onValueChange={(val: "custom" | "built_in") => {
            if (val === "custom") {
              onFormChange({
                source: "custom",
                type: "0-10",
                metric: undefined,
              });
            } else {
              onFormChange({
                source: "built_in",
                metric: "votes",
                type: undefined,
              });
            }
          }}
        >
          <SelectTrigger className="w-full md:w-fit h-9 text-xs">
            <SelectValue placeholder="منبع فاکتور" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="custom">سفارشی</SelectItem>
              <SelectItem value="built_in">آماده (سیستمی)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {isCustom ? (
          <Select
            dir="rtl"
            value={formState.type ?? undefined}
            onValueChange={(val) =>
              onFormChange({
                type: (val as RoadmapFactor["type"]) ?? undefined,
              })
            }
          >
            <SelectTrigger className="w-full md:w-fit h-9 text-xs">
              <SelectValue placeholder="نوع فاکتور" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {ROADMAP_FACTOR_TYPES.filter((opt) => opt.value !== null).map(
                  (opt) => (
                    <SelectItem key={opt.value!} value={opt.value!}>
                      {opt.label}
                    </SelectItem>
                  ),
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : (
          <Select
            dir="rtl"
            value={formState.metric}
            onValueChange={(val) =>
              onFormChange({
                metric: val as RoadmapNewFactorState["metric"],
              })
            }
          >
            <SelectTrigger className="w-full md:w-fit h-9 text-xs">
              <SelectValue placeholder="متریک سیستمی" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {BUILT_IN_METRICS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        <Select
          dir="rtl"
          value={formState.weight.toFixed(1)}
          onValueChange={(val) => onFormChange({ weight: Number(val) })}
        >
          <SelectTrigger className="w-full md:w-fit md:min-w-24 h-9 text-xs">
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

        <Button
          type="button"
          size="sm"
          className="gap-1 h-9 col-span-2 md:shrink-0 w-full md:w-auto"
          onClick={onAdd}
          disabled={!formState.name.trim()}
        >
          {isAdding ? <Spinner /> : <Plus className="size-4" />}
          {isAdding ? "در حال افزودن" : "افزودن"}
        </Button>
      </div>
    </div>
  );
}
