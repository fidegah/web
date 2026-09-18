import { data } from "react-router";
import { ERROR_CODE } from "~/constants/errors";
import { SEO_CONFIG } from "~/constants/seo";
import type { Route } from "./+types";
import PollsListPage from "~/components/polls-list-page";
import { getPolls } from "~/services/poll.service";
import { getCurrentWorkspace } from "~/services/workspace.service";
import { apiClientContext } from "~/context";

export function meta() {
  return [{ title: SEO_CONFIG.dashboard.poll.list.title }];
}

export async function loader({ request, context, url }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);

  const searchParam = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";

  const isFiltering = !!(searchParam.trim().length > 0 || status);

  try {
    const workspace = await getCurrentWorkspace(api);
    const { data: polls, pagination } = await getPolls(api, workspace.id, {
      search: searchParam,
      status,
    });

    return { polls: { data: polls, pagination }, isFiltering };
  } catch (error) {
    console.error("Failed to fetch polls from API:", error);

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export default function Polls({ loaderData }: Route.ComponentProps) {
  const { polls, isFiltering } = loaderData;

  return (
    <PollsListPage
      polls={polls}
      isFiltering={isFiltering}
      isAdmin
      gridCols={2}
    />
  );
}
