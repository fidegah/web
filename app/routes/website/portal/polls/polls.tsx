import type { Route } from "./+types/polls";
import { data } from "react-router";
import { ERROR_CODE } from "~/constants/errors";
import { getCanonicalUrl, SEO_CONFIG } from "~/constants/seo";
import PollsListPage from "~/components/polls-list-page";
import { apiClientContext } from "~/context";
import {
  getPortalCurrentWorkspace,
  getPortalPolls,
} from "~/services/portal.service";

export async function loader({ context, url }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);

  const searchParam = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";

  const isFiltering = !!(searchParam.trim().length > 0 || status);

  try {
    const workspace = await getPortalCurrentWorkspace(api);
    const polls = await getPortalPolls(api, {
      search: searchParam,
      status,
    });

    return { workspace, polls, isFiltering };
  } catch (error) {
    console.error(
      `Failed to fetch polls data (Search: "${searchParam}", Status: "${status}"):`,
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
  const seo = SEO_CONFIG.portal.pollsList(workspace.name);
  const canonicalUrl = getCanonicalUrl(location.pathname);

  return [
    { title: seo.title },
    { name: "description", content: seo.description },
    { property: "og:title", content: seo.title },
    { property: "og:description", content: seo.description },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
  ];
}

export default function PortalPolls({ loaderData }: Route.ComponentProps) {
  const { polls, isFiltering } = loaderData;

  return (
    <div className="p-3 md:px-6 lg:px-10">
      <PollsListPage
        polls={polls}
        isFiltering={isFiltering}
        isAdmin={false}
        showFab={false}
      />
    </div>
  );
}
