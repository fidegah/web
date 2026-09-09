import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { CountingNumber } from "~/components/ui/animate-ui/text/counting-number";
import { TIME_RANGES } from "~/constants/time-ranges";
import { cn } from "~/lib/utils";
import type { TimeRange } from "~/types";

interface StatCardProps {
  title: string;
  count: number | null;
  growth: number | null;
  currentTimeRange: TimeRange;
  unit?: string;
}

export default function StatCard({
  title,
  count,
  growth,
  currentTimeRange,
  unit,
}: Readonly<StatCardProps>) {
  const range = TIME_RANGES.find((r) => r.value === currentTimeRange);
  const periodText = range?.periodLabel ?? "";

  const getGrowthMeta = () => {
    if (growth && growth > 0) {
      return {
        badgeColor: "text-green-700 bg-green-50/50 dark:bg-green-950/20",
        textColor: "text-green-600 dark:text-green-700",
        text: `رشد صعودی در ${periodText}`,
        Icon: TrendingUp,
        iconColor: "text-green-700",
      };
    }
    if (growth && growth < 0) {
      return {
        badgeColor: "text-red-600 bg-red-50/50 dark:bg-red-950/20",
        textColor: "text-red-600",
        text: `رشد نزولی در ${periodText}`,
        Icon: TrendingDown,
        iconColor: "text-red-700",
      };
    }
    return {
      badgeColor: "text-muted-foreground",
      textColor: "text-muted-foreground",
      text: "بدون تغییر",
      Icon: Minus,
      iconColor: "text-muted-foreground",
    };
  };

  const meta = getGrowthMeta();
  const StatusIcon = meta.Icon;

  return (
    <div className="p-3 flex flex-col border rounded-xl">
      <div className="flex items-center justify-between">
        <span className="text-[12.5px] text-gray-600 dark:text-gray-400 lg:text-sm">
          {title}
        </span>
        <div
          className={cn("p-1 rounded-lg px-2 border text-xs", meta.badgeColor)}
        >
          {`${Math.floor(growth || 0)}%`}
        </div>
      </div>

      <div className="flex items-center">
        {unit && <span className="ml-1">{unit}</span>}
        <CountingNumber
          number={count || 0}
          className="font-bold text-2xl lg:text-3xl lg:mt-1"
        />
      </div>

      <div className="flex items-center gap-3 mt-2">
        <p className={cn("text-xs lg:text-sm", meta.textColor)}>{meta.text}</p>

        <StatusIcon className={cn("size-4", meta.iconColor)} />
      </div>
    </div>
  );
}
