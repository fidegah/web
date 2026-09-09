import dayjs from "dayjs";
import { Calendar, Eye, Heart } from "lucide-react";
import InfoItem from "~/components/ui/dashboard/info-item";
import jalaliday from "jalali-plugin-dayjs";
import CreatorInfo from "~/components/ui/creator-info";
import type { Changelog } from "~/types";

dayjs.extend(jalaliday);

interface PortalChangelogInfoProps {
  changelog: Changelog;
}

export default function PortalChangelogInfo({
  changelog,
}: Readonly<PortalChangelogInfoProps>) {
  return (
    <div className="flex flex-col gap-3">
      <InfoItem icon={Calendar} label="تاریخ ایجاد">
        {dayjs(changelog.createdAt).calendar("jalali").format("YYYY/M/D")}
      </InfoItem>

      <CreatorInfo
        avatarUrl={changelog.creator.avatarUrl || undefined}
        fullName={changelog.creator.fullName || ""}
      />

      <InfoItem icon={Heart} label="تعداد پسندها">
        {changelog.likesCount}
      </InfoItem>

      <InfoItem icon={Eye} label="تعداد بازدیدها">
        {changelog.viewsCount}
      </InfoItem>
    </div>
  );
}
