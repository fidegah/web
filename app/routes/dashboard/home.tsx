import type { Route } from "./+types/home";
import ActivityOverview from "~/components/dashboard/home/activity-overview";
import { SEO_CONFIG } from "~/constants/seo";
import { data } from "react-router";
import { ERROR_CODE } from "~/constants/errors";
import HealthScore from "~/components/dashboard/home/health-score";
import PostsByRecency from "~/components/dashboard/home/posts-by-recency/posts-by-recency";
import PopularItems from "~/components/dashboard/home/popular-items";
import PostsByStatus from "~/components/dashboard/home/posts-by-status";
import {
  getActivityOverview,
  getHealthScore,
  getPopularItems,
} from "~/services/dashboard.service";
import { getCurrentWorkspace } from "~/services/workspace.service";
import { getPosts, getPostStatuses } from "~/services/post.service";
import { apiClientContext } from "~/context";

export function meta() {
  return [{ title: SEO_CONFIG.dashboard.home.title }];
}

export async function loader({ context, url }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);

  const activityOverviewTimeRange =
    url.searchParams.get("activity-overview-time-range") || "monthly";
  const healthScoreTimeRange =
    url.searchParams.get("health-score-time-range") || "monthly";
  const popularItemsTimeRange =
    url.searchParams.get("popular-items-time-range") || "monthly";

  const activePostsPage = url.searchParams.get("active-posts-page") || "1";
  const oldPostsPage = url.searchParams.get("old-posts-page") || "1";

  try {
    const workspace = await getCurrentWorkspace(api);

    const [
      activityOverview,
      healthScore,
      activePosts,
      oldPosts,
      popularItems,
      postStatuses,
      roadmapPosts,
    ] = await Promise.all([
      getActivityOverview(api, workspace.id, activityOverviewTimeRange),
      getHealthScore(api, workspace.id, healthScoreTimeRange),
      getPosts(api, workspace.id, {
        status: "active",
        limit: 25,
        page: Number(activePostsPage),
      }),
      getPosts(api, workspace.id, {
        status: "old",
        limit: 25,
        page: Number(oldPostsPage),
      }),
      getPopularItems(api, workspace.id, popularItemsTimeRange),
      getPostStatuses(api),
      getPosts(api, workspace.id, {
        statusValue: "open,in_progress,completed",
      }),
    ]);

    return {
      activityOverview,
      healthScore,
      activePosts,
      oldPosts,
      popularItems,
      postStatuses,
      roadmapPosts,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard home from API:", error);

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const {
    activityOverview,
    healthScore,
    activePosts,
    oldPosts,
    popularItems,
    postStatuses,
    roadmapPosts,
  } = loaderData;

  return (
    <div className="flex flex-col gap-10 p-3">
      <ActivityOverview data={activityOverview} />
      <HealthScore data={healthScore} />
      <PostsByRecency activePosts={activePosts} oldPosts={oldPosts} />
      <PopularItems data={popularItems} />
      <PostsByStatus postStatuses={postStatuses} posts={roadmapPosts} />
    </div>
  );
}
