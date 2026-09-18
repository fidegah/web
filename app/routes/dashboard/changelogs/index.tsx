import { CircleFadingPlus, Megaphone } from "lucide-react";
import { data, useNavigate } from "react-router";
import ChangelogCard from "~/components/changelog/changelog-card";
import { PageHeader } from "~/components/ui/page-header";
import SearchBox from "~/components/search-box";
import { Activity, useState } from "react";
import { ERROR_CODE } from "~/constants/errors";
import { DataEmptyState } from "~/components/ui/empty-state";
import { MESSAGES } from "~/constants/messages";
import Fab from "~/components/ui/fab";
import { SEO_CONFIG } from "~/constants/seo";
import type { Route } from "./+types";
import FilterDialog from "~/components/dashboard/filters/filter-dialog";
import FilterSection from "~/components/dashboard/filters/ filter-section";
import { CustomPagination } from "~/components/ui/custom-pagination";
import { getChangelogs, getChangelogTags } from "~/services/changelog.service";
import { getCurrentWorkspace } from "~/services/workspace.service";
import { apiClientContext } from "~/context";

export function meta() {
  return [{ title: SEO_CONFIG.dashboard.changelog.list.title }];
}

export async function loader({ context, url }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);

  const searchParam = url.searchParams.get("search") || "";
  const tagIdsParam = url.searchParams.get("tagIds") || "";

  const isFiltering = searchParam.trim().length > 0 || tagIdsParam;

  try {
    const workspace = await getCurrentWorkspace(api);
    const { data: changelogs, pagination } = await getChangelogs(
      api,
      workspace.id,
      {
        search: searchParam,
        tagId: tagIdsParam,
        limit: 30,
      },
    );
    const changelogTags = await getChangelogTags(api, workspace.id);

    return {
      changelogs: { data: changelogs, pagination },
      changelogTags,
      isFiltering,
    };
  } catch (error) {
    console.error("Failed to fetch changelogs from API:", error);

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export default function Changelog({ loaderData }: Route.ComponentProps) {
  const { changelogs, changelogTags, isFiltering } = loaderData;
  const navigate = useNavigate();
  const [isOpenFilterDialog, setIsOpenFilterDialog] = useState(false);

  const hasData = changelogs.data.length > 0;
  const hasFilterOrSearch = isFiltering;
  const showEmptyState = !hasData && !hasFilterOrSearch;
  const showNoResults = !hasData && hasFilterOrSearch;
  const showData = hasData;

  return (
    <div className="w-full h-full flex flex-col gap-6 p-3">
      <PageHeader
        icon={Megaphone}
        title="اطلاعیه‌های بروزرسانی"
        description="در این بخش می‌توانید لیست بروزرسانی‌ها و تغییرات ثبت‌شده را مشاهده، مدیریت و ویرایش کنید."
      />

      <Activity mode={showEmptyState ? "visible" : "hidden"}>
        <DataEmptyState
          title={MESSAGES.CHANGELOGS.EMPTY.TITLE}
          description={MESSAGES.CHANGELOGS.EMPTY.DESCRIPTION}
          actionText="ایجاد گزارش تغییرات"
          actionIcon={CircleFadingPlus}
          onActionClick={() => navigate("manage")}
        />
      </Activity>

      <Activity mode={hasData || hasFilterOrSearch ? "visible" : "hidden"}>
        <SearchBox
          filterButtonOnClick={() => setIsOpenFilterDialog(true)}
          className="lg:w-1/2"
          inputClassName="lg:text-base"
          filterBtnClassName="lg:size-10"
        />
      </Activity>

      <FilterDialog
        isLoading={false}
        isOpen={isOpenFilterDialog}
        setIsOpen={setIsOpenFilterDialog}
      >
        <FilterSection
          title="تگ‌ها"
          items={changelogTags.map((tag) => ({
            id: tag.id,
            label: tag.name,
            value: String(tag.id),
          }))}
          paramName="tagIds"
        />
      </FilterDialog>

      <Activity mode={showNoResults ? "visible" : "hidden"}>
        <DataEmptyState
          title="نتیجه‌ای یافت نشد"
          description="هیچ اطلاعیه‌ای با معیارهای جستجوی شما پیدا نشد. لطفاً فیلترهای دیگری را امتحان کنید."
          actionText="پاک کردن فیلترها"
          actionIcon={CircleFadingPlus}
          onActionClick={() => navigate(".")}
        />
      </Activity>

      <Activity mode={showData ? "visible" : "hidden"}>
        <Fab tooltipText="ایجاد اطلاعیه" onClick={() => navigate("manage")} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {changelogs.data.map((changelog) => (
            <ChangelogCard
              key={changelog.id}
              changelog={changelog}
              onEdit={() => navigate(`manage/${changelog.id}`)}
              changelogTags={changelogTags}
              isAdmin
            />
          ))}
        </div>

        <div className="pb-6">
          <CustomPagination pagination={changelogs.pagination} />
        </div>
      </Activity>
    </div>
  );
}
