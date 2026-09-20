import ChangelogCard from "~/components/changelog/changelog-card";
import SearchBox from "~/components/search-box";
import { PageHeader } from "~/components/ui/page-header";
import { Activity, useState } from "react";
import type { Route } from "./+types/changelogs";
import { DataEmptyState } from "~/components/ui/empty-state";
import { MESSAGES } from "~/constants/messages";
import { cn } from "~/lib/utils";
import { data, useNavigate } from "react-router";
import { ERROR_CODE } from "~/constants/errors";
import { getCanonicalUrl, SEO_CONFIG } from "~/constants/seo";
import FilterDialog from "~/components/dashboard/filters/filter-dialog";
import FilterSection from "~/components/dashboard/filters/ filter-section";
import { CustomPagination } from "~/components/ui/custom-pagination";
import { Megaphone } from "lucide-react";
import { useOtpAuthDialog } from "~/contexts/otp-auth-dialog-context";
import { isAuthenticated } from "~/lib/auth-utils.server";
import { apiClientContext } from "~/context";
import {
  getPortalChangelogs,
  getPortalChangelogTags,
  getPortalCurrentWorkspace,
} from "~/services/portal.service";

export async function loader({ request, context, url }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);
  const isAuth = await isAuthenticated(request);

  const searchParam = url.searchParams.get("search") || "";
  const tagIdParam = url.searchParams.get("tagIds") || "";

  const isFiltering = searchParam.trim().length > 0 || tagIdParam;

  try {
    const workspace = await getPortalCurrentWorkspace(api);
    const changelogs = await getPortalChangelogs(api, {
      limit: 20,
      search: searchParam,
      tagId: tagIdParam,
    });
    const changelogTags = await getPortalChangelogTags(api);

    return {
      workspace,
      changelogs,
      changelogTags,
      isFiltering,
      isAuthenticated: isAuth,
    };
  } catch (error) {
    console.error(
      `Failed to fetch changelogs (Search: "${searchParam}", Tag IDs: "${tagIdParam}"):`,
      error,
    );

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export function meta({ loaderData, location }: Route.MetaArgs) {
  const { workspace } = loaderData;
  const canonicalUrl = getCanonicalUrl(location.pathname);

  const config = SEO_CONFIG.portal.changelogs(workspace.name);
  return [
    { title: config.title },
    { name: "description", content: config.description },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
  ];
}

export default function PortalChangelogs({ loaderData }: Route.ComponentProps) {
  const [isOpenFilterDialog, setIsOpenFilterDialog] = useState(false);
  const navigate = useNavigate();
  const { openAuthDialog } = useOtpAuthDialog();

  const { changelogs, changelogTags, isFiltering, isAuthenticated } =
    loaderData;
  const hasData = changelogs.data.length > 0;
  const hasFilterOrSearch = isFiltering;
  const showEmptyState = !hasData && !hasFilterOrSearch;
  const showNoResults = !hasData && hasFilterOrSearch;
  const showData = hasData;

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col gap-6 p-3 md:px-6 lg:px-10",
        !hasData && "h-full",
      )}
    >
      <PageHeader
        icon={Megaphone}
        title="گزارش تغییرات"
        description="در این بخش می‌توانید آخرین تغییرات و به‌روزرسانی‌های سیستم (Changelog) را مشاهده کنید."
      />

      <Activity mode={showEmptyState ? "visible" : "hidden"}>
        <DataEmptyState
          title={MESSAGES.CHANGELOGS.EMPTY.TITLE}
          description={MESSAGES.CHANGELOGS.EMPTY.DESCRIPTION}
          className="h-full"
        />
      </Activity>

      <Activity mode={hasData || hasFilterOrSearch ? "visible" : "hidden"}>
        <SearchBox
          className="md:w-2/3 lg:w-1/2 xl:w-1/3"
          filterButtonOnClick={() => setIsOpenFilterDialog(true)}
          inputClassName="lg:text-base"
          filterBtnClassName="lg:size-10"
        />
      </Activity>

      <Activity mode={showNoResults ? "visible" : "hidden"}>
        <DataEmptyState
          title="نتیجه‌ای یافت نشد"
          description="هیچ گزارش تغییری با معیارهای جستجوی شما پیدا نشد. لطفاً فیلترهای دیگری را امتحان کنید."
          actionText="پاک کردن فیلترها"
          onActionClick={() => navigate(".")}
        />
      </Activity>

      <Activity mode={showData ? "visible" : "hidden"}>
        <>
          <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {changelogs.data.map((changelog) => (
              <ChangelogCard
                key={changelog.id}
                changelog={changelog}
                isAdmin={false}
                isAuthenticated={isAuthenticated}
                onRequireAuth={openAuthDialog}
                changelogTags={changelogTags}
                isPortal
              />
            ))}
          </div>

          <div className="pb-6">
            <CustomPagination pagination={changelogs.pagination} />
          </div>
        </>
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
    </div>
  );
}
