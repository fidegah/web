import type React from "react";
import { Activity } from "react";
import dayjs from "dayjs";
import jalaliday from "jalali-plugin-dayjs";
import {
  AlertTriangle,
  CircleAlert,
  Info,
  Sparkles,
  ThumbsUp,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import CircularProgress from "~/components/ui/circular-progress";
import HomeFilterSelect from "./filter-select";
import StatCard from "./stat-card";
import { TIME_RANGES } from "~/constants/time-ranges";
import { cn } from "~/lib/utils";
import type { HealthScoreStatus, HomeHealthScore } from "~/types";

dayjs.extend(jalaliday);
dayjs.calendar("jalali");
dayjs.locale("fa");

type HealthStatusMeta = {
  status: HealthScoreStatus;
  icon: React.ElementType;
  message_fa: string;
  label_fa: string;
  colorClass: string;
};

const HEALTH_STATUS_META: Record<HealthScoreStatus, HealthStatusMeta> = {
  excellent: {
    status: "excellent",
    icon: Sparkles,
    label_fa: "عالی",
    message_fa: "وضعیت فضای کاری عالیه! به کار عالی ادامه بدید.",
    colorClass: "stroke-green-500",
  },
  good: {
    status: "good",
    icon: ThumbsUp,
    label_fa: "خوب",
    message_fa: "اوضاع خوب پیش میره. چند بخش می‌تونه بهتر بشه.",
    colorClass: "stroke-blue-500",
  },
  fair: {
    status: "fair",
    icon: AlertTriangle,
    label_fa: "متوسط",
    message_fa: "نیاز به توجه داره. روی بهبود تعاملات تمرکز کنید.",
    colorClass: "stroke-yellow-500",
  },
  poor: {
    status: "poor",
    icon: CircleAlert,
    label_fa: "ضعیف",
    message_fa: "فضای کاری نیاز به توجه فوری داره. بازخورد جمع‌آوری کنید.",
    colorClass: "stroke-red-500",
  },
  not_enough_data: {
    status: "not_enough_data",
    icon: Info,
    label_fa: "داده ناکافی",
    message_fa: "هنوز فعالیت کافی برای محاسبه سلامت فضای کاری ثبت نشده است.",
    colorClass: "stroke-slate-400",
  },
};

function getHealthStatusMeta(status: HealthScoreStatus) {
  return HEALTH_STATUS_META[status] ?? HEALTH_STATUS_META.not_enough_data;
}

interface HealthScoreProps {
  data: HomeHealthScore;
}

export default function HealthScore({ data }: Readonly<HealthScoreProps>) {
  const timeSearchParamKey = "health-score-time-range";
  const {
    healthScore,
    changes,
    metrics,
    period,
    recommendations,
    status,
    timeRange,
  } = data;
  const meta = getHealthStatusMeta(status);
  const Icon = meta.icon;

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex w-full items-center justify-between">
          <CardTitle>سلامت محیط کاری</CardTitle>
          <HomeFilterSelect
            defaultValue={timeRange}
            item={TIME_RANGES}
            label="بازه های زمانی"
            searchParamKey={timeSearchParamKey}
          />
        </div>

        <CardDescription>
          نمایش امتیاز کلی سلامت محیط کاری شما و جزئیات کلیدی مرتبط با عملکرد
          آن.
        </CardDescription>

        <CardDescription>
          <span className="font-bold">توجه: </span>
          این گزارش آمار های از تاریخ{" "}
          {dayjs(period.current.start).format("YYYY/MM/DD")} تا تاریخ{" "}
          {dayjs(period.current.end).format("YYYY/MM/DD")} را با{" "}
          {dayjs(period.previous.start).format("YYYY/MM/DD")} تا{" "}
          {dayjs(period.previous.end).format("YYYY/MM/DD")} مقایسه میکند.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col">
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="mx-auto flex w-full max-w-xs flex-col items-center lg:border-l">
            <CircularProgress
              labelClassName="text-xl font-bold"
              progressClassName={meta.colorClass}
              showLabel
              size={200}
              strokeWidth={15}
              value={status === "not_enough_data" ? 0 : healthScore}
            />

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-md border bg-background px-2.5 py-1 text-sm">
              <Icon className={cn("size-4", meta.colorClass)} />
              <span className="text-muted-foreground">وضعیت:</span>
              <span
                className={cn(
                  "font-medium",
                  meta.colorClass?.replace("stroke", "text"),
                )}
              >
                {meta.label_fa}
              </span>
            </div>

            <p className="mt-2 text-center text-xs text-muted-foreground md:text-sm line-clamp-2 lg:pl-4">
              {meta.message_fa}
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-4 lg:gap-6">
            <StatCard
              count={metrics.responseRate}
              currentTimeRange={timeRange}
              growth={changes.responseRate}
              title="نرخ پاسخگویی"
              unit="%"
            />

            <StatCard
              count={metrics.avgResponseTime}
              currentTimeRange={timeRange}
              growth={changes.avgResponseTime}
              title="میانگین زمان پاسخ"
              unit="h"
            />

            <StatCard
              count={metrics.engagementRate}
              currentTimeRange={timeRange}
              growth={changes.engagementRate}
              title="نرخ تعامل"
              unit="%"
            />

            <StatCard
              count={metrics.resolutionRate}
              currentTimeRange={timeRange}
              growth={changes.resolutionRate}
              title="نرخ تکمیل"
              unit="%"
            />
          </div>
        </div>

        <div className="mt-10">
          <Activity mode={recommendations.length > 0 ? "visible" : "hidden"}>
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="text-sm lg:text-base">
                  پیشنهادات
                </CardTitle>
                <CardDescription>
                  بر اساس فعالیت اخیر شما، این موارد پیشنهاد می‌شوند.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-2">
                {recommendations.map((item) => (
                  <span key={item} className="text-sm text-muted-foreground">
                    {item}
                  </span>
                ))}
              </CardContent>
            </Card>
          </Activity>
        </div>
      </CardContent>
    </Card>
  );
}
