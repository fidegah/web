import { Calendar, ClockFading, List, Type, Vote } from "lucide-react";
import InfoItem from "~/components/ui/dashboard/info-item";
import type { Poll } from "~/types";

import dayjs from "dayjs";
import jalaliday from "jalali-plugin-dayjs";
dayjs.extend(jalaliday);
dayjs.locale("fa");

interface PortalPollInfoProps {
  poll: Poll;
}

export default function PortalPollInfo({
  poll,
}: Readonly<PortalPollInfoProps>) {
  const { startAt, endAt, status, type, options, totalVotes } = poll;

  const start_jalali = startAt
    ? dayjs(startAt).format("HH:mm - YYYY/M/D")
    : "-";
  const end_jalali = endAt ? dayjs(endAt).format("HH:mm - YYYY/M/D") : "-";

  const statusMap: Record<string, string> = {
    active: "فعال",
    expired: "منقضی شده",
    not_started: "شروع نشده",
  };
  const status_fa = statusMap[status] || "نامشخص";

  const typeMap: Record<string, string> = {
    single: "تک گزینه‌ای",
    multiple: "چند گزینه‌ای",
    ranking: "رتبه‌بندی",
  };
  const type_fa = typeMap[type] || "نامشخص";

  return (
    <div className="w-full flex flex-col gap-3">
      <InfoItem icon={Calendar} label="تاریخ شروع">
        {start_jalali}
      </InfoItem>

      <InfoItem icon={Calendar} label="تاریخ پایان">
        {end_jalali}
      </InfoItem>

      <InfoItem icon={ClockFading} label="وضعیت">
        {status_fa}
      </InfoItem>

      <InfoItem icon={Type} label="نوع">
        {type_fa}
      </InfoItem>

      <InfoItem icon={List} label="تعداد گزینه‌ها">
        {options?.length || 0}
      </InfoItem>

      <InfoItem icon={Vote} label="تعداد رأی‌ها">
        {totalVotes || 0}
      </InfoItem>
    </div>
  );
}
