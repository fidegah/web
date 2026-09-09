import PublicContent from "~/components/website/public/public-content";
import PortalContent from "~/components/website/portal/content";
import { getSubdomain } from "~/lib/utils";
import type { Route } from "./+types";
import { data } from "react-router";
import { ERROR_CODE } from "~/constants/errors";
import { Activity } from "react";
import { DataEmptyState } from "~/components/ui/empty-state";
import { SEO_CONFIG } from "~/constants/seo";
import {
  getPortalPosts,
  getPortalPostStatuses,
  getPortalPolls,
  getPortalChangelogs,
  getPortalBoards,
  getPortalChangelogTags,
  getPortalCurrentWorkspace,
} from "~/services/portal.service";
import { apiClientContext } from "~/context";

export async function loader({ request, context }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);
  const isSubdomainExist = !!getSubdomain(request);

  const url = new URL(request.url);
  const postPageParam = url.searchParams.get("postPage") || "1";

  try {
    if (isSubdomainExist) {
      const [
        workspace,
        boards,
        posts,
        changelogs,
        polls,
        postStatuses,
        changelogTags,
      ] = await Promise.all([
        getPortalCurrentWorkspace(api),
        getPortalBoards(api),
        getPortalPosts(api, {
          limit: 20,
          page: Number(postPageParam),
        }),
        getPortalChangelogs(api, { limit: 10 }),
        getPortalPolls(api, {
          limit: 10,
        }),
        getPortalPostStatuses(api),
        getPortalChangelogTags(api),
      ]);

      return {
        workspace,
        boards,
        posts,
        changelogs,
        polls,
        postStatuses,
        changelogTags,
        isSubdomainExist: true,
      };
    }

    return { isSubdomainExist: false };
  } catch (error) {
    console.error(
      `Failed to fetch dashboard main data (Post Page: ${postPageParam}):`,
      error,
    );

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { workspace, isSubdomainExist } = loaderData;

  if (isSubdomainExist) {
    const config = SEO_CONFIG.portal.home(workspace?.name || "");
    return [
      { title: config.title },
      { name: "description", content: config.description },
      { property: "og:title", content: config.title },
    ];
  }

  return [
    { title: SEO_CONFIG.publicPage.home.title },
    { name: "description", content: SEO_CONFIG.publicPage.home.description },
    { property: "og:title", content: SEO_CONFIG.publicPage.home.ogTitle },
  ];
}

export default function Index({ loaderData }: Route.ComponentProps) {
  const {
    boards,
    posts,
    changelogs,
    polls,
    postStatuses,
    changelogTags,
    isSubdomainExist,
  } = loaderData;

  return (
    <>
      {isSubdomainExist && (
        <>
          <Activity mode={boards?.length === 0 ? "visible" : "hidden"}>
            <div className="h-full overflow-hidden">
              <DataEmptyState
                title="هیچ بخشی ایجاد نشده است."
                description="در حال حاضر محتوایی برای نمایش در این بخش وجود ندارد."
              />
            </div>
          </Activity>

          <Activity mode={boards && boards?.length > 0 ? "visible" : "hidden"}>
            <PortalContent
              boards={boards ?? []}
              latestChangelogs={changelogs?.data ?? []}
              posts={posts!}
              postStatuses={postStatuses ?? []}
              latestPolls={polls?.data ?? []}
              changelogTags={changelogTags ?? []}
            />
          </Activity>
        </>
      )}

      {!isSubdomainExist && <PublicContent />}
    </>
  );
}
