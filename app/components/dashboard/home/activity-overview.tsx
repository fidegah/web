import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import StatCard from "./stat-card";
import dayjs from "dayjs";
import jalaliday from "jalali-plugin-dayjs";
import type { HomeActivityOverview } from "~/types";
import HomeFilterSelect from "./filter-select";
import { TIME_RANGES } from "~/constants/time-ranges";

dayjs.extend(jalaliday);
dayjs.calendar("jalali");
dayjs.locale("fa");

interface ActivityOverviewProps {
  data: HomeActivityOverview;
}

export default function ActivityOverview({
  data,
}: Readonly<ActivityOverviewProps>) {
  const timeSearchParamKey = "activity-overview-time-range";
  const { overview, period, timeRange } = data;

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="w-full flex justify-between items-center">
          <CardTitle>نمای کلی فعالیت</CardTitle>
          <HomeFilterSelect
            label="بازه های زمانی"
            item={TIME_RANGES}
            defaultValue={timeRange}
            searchParamKey={timeSearchParamKey}
          />
        </div>

        <CardDescription>
          اطلاعات، بازه زمانی {dayjs(period.start).format("YYYY/MM/DD")} تا{" "}
          {dayjs(period.end).format("YYYY/MM/DD")} نمایش داده میشود.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <StatCard
            title="تعداد پست ها"
            count={overview.posts.current}
            growth={overview.posts.growthRate}
            currentTimeRange={timeRange}
          />

          <StatCard
            title="تعداد دیدگاه ها"
            count={overview.comments.current}
            growth={overview.comments.growthRate}
            currentTimeRange={timeRange}
          />

          <StatCard
            title="تعداد رای ها"
            count={overview.votes.current}
            growth={overview.votes.growthRate}
            currentTimeRange={timeRange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
