import type { Route } from "./+types/changelog";
import { useState } from "react";
import PortalDialog from "~/components/website/portal/dialog";
import PortalChangelogInfo from "~/components/website/portal/changelog-info";
import type { Changelog } from "~/types";
import { getCanonicalUrl, SEO_CONFIG } from "~/constants/seo";
import { data } from "react-router";
import { ERROR_CODE } from "~/constants/errors";
import ChangelogBadge from "~/components/ui/changelog-badge";
import TiptapEditor from "~/components/tiptap-editor";
import { InfoIcon } from "lucide-react";
import { apiClientContext } from "~/context";
import {
  getPortalChangelog,
  getPortalChangelogTags,
  getPortalCurrentWorkspace,
} from "~/services/portal.service";

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);
  const { changelogId } = params;

  if (!changelogId)
    throw data(null, {
      status: 500,
    });

  try {
    const workspace = await getPortalCurrentWorkspace(api);
    const changelog = await getPortalChangelog(api, changelogId);
    const changelogTags = await getPortalChangelogTags(api);

    return { workspace, changelog, changelogTags };
  } catch (err) {
    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export function meta({ loaderData, location }: Route.MetaArgs) {
  const { changelog, workspace } = loaderData;
  const canonicalUrl = getCanonicalUrl(location.pathname);

  const config = SEO_CONFIG.portal.singleChangelog(
    workspace.name,
    changelog.title,
  );
  return [
    { title: config.title },
    { name: "description", content: config.description },
    { property: "og:title", content: config.title },
    { property: "og:description", content: config.description },
    { property: "og:type", content: "article" },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
  ];
}

export default function Changelog({ loaderData }: Route.ComponentProps) {
  const { changelog, changelogTags } = loaderData;
  const [isOpenChangelogInfoDialog, setIsOpenChangelogInfoDialog] =
    useState(false);

  return (
    <div className="flex h-full flex-col gap-3 p-3 md:px-6 lg:px-10">
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        <div className="flex flex-col gap-3 flex-3">
          <div className="relative w-full border rounded-md p-3 gap-3 flex items-center">
            <span className="absolute -top-3 right-3 bg-white dark:bg-[#1f1f1f] px-2 text-muted-foreground text-xs md:text-sm">
              تگ‌های اضافه شده
            </span>

            <div className="w-full flex items-center gap-3 overflow-x-auto no-scrollbar">
              {changelog?.tagIds?.map((tagId) => {
                const tagData = changelogTags.find((t) => t.id === tagId);
                if (!tagData) return null;

                return (
                  <ChangelogBadge
                    key={tagData.id}
                    name={tagData.name}
                    icon={tagData.icon}
                  />
                );
              })}
            </div>

            <button
              onClick={() => setIsOpenChangelogInfoDialog(true)}
              className="lg:hidden flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border border-border rounded-md bg-muted/50 hover:bg-muted text-muted-foreground shrink-0 transition-colors"
              type="button"
            >
              <InfoIcon className="w-3.5 h-3.5" />
              اطلاعات
            </button>
          </div>

          <TiptapEditor readOnly content={changelog?.content} />
        </div>

        <div className="hidden lg:flex flex-col flex-1 border rounded-md p-3 gap-6">
          <b className="text-sm">اطلاعات گزارش تغییرات</b>

          <PortalChangelogInfo changelog={changelog} />
        </div>
      </div>

      <PortalDialog
        isOpen={isOpenChangelogInfoDialog}
        setIsOpen={setIsOpenChangelogInfoDialog}
        title="اطلاعات اطلاعیه گزارش"
      >
        <PortalChangelogInfo changelog={changelog} />
      </PortalDialog>
    </div>
  );
}
