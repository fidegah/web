import type { Paginated, Pagination, Poll } from "~/types";
import { PageHeader } from "../ui/page-header";
import { ListChecks } from "lucide-react";
import { Activity, useState } from "react";
import { useNavigate } from "react-router";
import SearchBox from "../search-box";
import Fab from "../ui/fab";
import { CustomPagination } from "../ui/custom-pagination";
import { cn } from "~/lib/utils";
import PollsContent from "./polls-content";
import PollsFilter from "./polls-filter";

interface PollsListPageProps {
  polls: Paginated<Poll[]>;
  isFiltering: boolean;
  isAdmin: boolean;
  gridCols?: 2 | 3;
  showFab?: boolean;
}

export default function PollsListPage({
  isAdmin,
  polls,
  isFiltering,
  gridCols,
  showFab = true,
}: Readonly<PollsListPageProps>) {
  const navigate = useNavigate();
  const [isOpenFilterDialog, setIsOpenFilterDialog] = useState(false);

  const hasData = polls.data.length > 0;

  return (
    <div className={cn("w-full h-full flex flex-col gap-6", isAdmin && "p-3")}>
      <PageHeader
        icon={ListChecks}
        title="نظرسنجی ها"
        description={
          "در این بخش می‌توانید تمام نظرسنجی‌های ایجادشده را مشاهده " +
          (isAdmin ? "و مدیریت" : "") +
          " کنید."
        }
      />

      <Activity mode={hasData || isFiltering ? "visible" : "hidden"}>
        <Activity mode={showFab ? "visible" : "hidden"}>
          <Fab tooltipText="ایجاد نظرسنجی" onClick={() => navigate("create")} />
        </Activity>

        <SearchBox
          filterButtonOnClick={() => setIsOpenFilterDialog(true)}
          showFilterBtn
          className="lg:w-1/2"
          inputClassName="lg:text-base"
          filterBtnClassName="lg:size-10"
        />
      </Activity>

      <PollsContent
        polls={polls.data}
        isAdmin={isAdmin}
        isFiltering={isFiltering}
        onNavigate={navigate}
        gridCols={gridCols}
      />

      <PollsFilter
        isOpen={isOpenFilterDialog}
        setIsOpen={setIsOpenFilterDialog}
      />

      <div className="py-4">
        <CustomPagination pagination={polls.pagination} />
      </div>
    </div>
  );
}
