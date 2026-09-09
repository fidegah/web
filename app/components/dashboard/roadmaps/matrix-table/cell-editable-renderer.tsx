import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Star } from "lucide-react";
import { cn } from "~/lib/utils";
import type { RoadmapFactor } from "~/types";
import { useId } from "react";
import { Checkbox } from "~/components/ui/checkbox";

interface CellEditableRendererProps {
  value: number | boolean | string | undefined;
  type: RoadmapFactor["type"];
  isEffort: boolean;
  onChange: (val: number | boolean | string) => void;
}

const FIBONACCI_NUMBERS = [
  "1",
  "2",
  "3",
  "5",
  "8",
  "13",
  "21",
  "34",
  "55",
  "89",
  "144",
];

export default function CellEditableRenderer({
  value,
  onChange,
  isEffort,
  type,
}: Readonly<CellEditableRendererProps>) {
  const starIdPrefix = useId();

  const textColor = isEffort
    ? "text-destructive"
    : "text-emerald-600 dark:text-emerald-400";

  const isSelectType =
    type === "0-10" || type === "0-100" || type === "fibonacci";

  if (isSelectType) {
    let options: string[] = [];
    let minWidthClass = "min-w-25";
    let triggerWidthClass = "w-24";

    if (type === "0-10") {
      options = Array.from({ length: 11 }, (_, i) => String(i));
    } else if (type === "0-100") {
      options = Array.from({ length: 101 }, (_, i) => String(i));
      minWidthClass = "min-w-27.5";
      triggerWidthClass = "w-28";
    } else if (type === "fibonacci") {
      options = FIBONACCI_NUMBERS;
    }

    const defaultValue = type === "fibonacci" ? "1" : "0";

    return (
      <div className={cn("flex justify-center", minWidthClass)}>
        <Select
          value={String(value ?? defaultValue)}
          onValueChange={(val) => onChange(Number(val))}
          dir="rtl"
        >
          <SelectTrigger
            className={cn(
              "h-10 text-center font-bold text-sm",
              triggerWidthClass,
              textColor,
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={type === "0-100" ? "max-h-56" : undefined}>
            {options.map((opt) => (
              <SelectItem
                key={opt}
                value={opt}
                className="text-center font-medium"
              >
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (type === "stars") {
    const starsCount = Number(value) || 0;

    return (
      <div className="flex items-center justify-center gap-1 min-w-30">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={`${starIdPrefix}-${i}`}
            type="button"
            onClick={() => onChange(i + 1)}
            className="cursor-pointer transition-transform hover:scale-125 focus:outline-hidden"
          >
            <Star
              className={cn(
                "size-5",
                i < starsCount
                  ? "fill-amber-500 text-amber-500"
                  : "text-muted dark:text-zinc-700",
              )}
            />
          </button>
        ))}
      </div>
    );
  }

  if (type === "boolean") {
    return (
      <div className="flex justify-center items-center h-10">
        <Checkbox
          checked={Boolean(value)}
          onCheckedChange={(checked) => onChange(Boolean(checked))}
          className="size-5 rounded-md border-zinc-400 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
        />
      </div>
    );
  }

  const inputValue = typeof value === "boolean" ? "" : (value ?? 0);

  return (
    <div className="flex justify-center min-w-22.5">
      <Input
        type="number"
        value={inputValue}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn("h-10 w-20 text-center font-bold text-sm", textColor)}
      />
    </div>
  );
}
