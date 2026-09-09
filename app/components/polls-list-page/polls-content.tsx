import { Activity } from "react";
import type { Poll } from "~/types";
import { DataEmptyState } from "../ui/empty-state";
import { CircleFadingPlus } from "lucide-react";
import PollCard from "../dashboard/polls/poll-card";
import { cn } from "~/lib/utils";

interface PollsContentProps {
  polls: Poll[];
  isAdmin: boolean;
  isFiltering: boolean;
  onNavigate: (to: string) => void;
  gridCols?: 2 | 3;
}

export default function PollsContent({
  polls,
  isAdmin,
  isFiltering,
  onNavigate,
  gridCols = 3,
}: Readonly<PollsContentProps>) {
  const hasData = polls.length > 0;
  const showEmptyState = !hasData && !isFiltering;
  const showNoResults = !hasData && isFiltering;

  const gridColsClass = {
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
  };

  return (
    <>
      <Activity mode={showEmptyState ? "visible" : "hidden"}>
        <DataEmptyState
          title={
            isAdmin
              ? "هیچ نظرسنجی وجود ندارد."
              : "در حال حاضر نظرسنجی‌ای موجود نیست."
          }
          description={
            isAdmin
              ? "برای شروع، اولین نظرسنجی خود را ایجاد کنید و نظرات دیگران را جمع‌آوری نمایید."
              : "هنوز نظرسنجی‌ای ایجاد نشده است. لطفاً بعداً مراجعه کنید."
          }
          actionText={isAdmin ? "ایجاد نظرسنجی" : undefined}
          actionIcon={isAdmin ? CircleFadingPlus : undefined}
          onActionClick={isAdmin ? () => onNavigate("create") : undefined}
          className="h-fit"
        />
      </Activity>

      <Activity mode={showNoResults ? "visible" : "hidden"}>
        <DataEmptyState
          title="نظرسنجی‌ای یافت نشد"
          description="هیچ نظرسنجی با معیارهای جستجوی شما پیدا نشد. لطفاً فیلترهای دیگری را امتحان کنید یا یک نظرسنجی جدید ایجاد کنید."
          actionText="پاک کردن فیلترها"
          actionIcon={CircleFadingPlus}
          onActionClick={() => onNavigate(".")}
        />
      </Activity>

      <Activity mode={hasData ? "visible" : "hidden"}>
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 gap-6",
            gridColsClass[gridCols],
          )}
        >
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} isAdmin={isAdmin} />
          ))}
        </div>
      </Activity>
    </>
  );
}
