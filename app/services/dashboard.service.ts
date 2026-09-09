import type { ApiClient } from "~/context";
import type {
  HomeActivityOverview,
  HomeHealthScore,
  HomePopularItems,
} from "~/types";

import { CACHE_KEYS, getOrSetCache } from "~/lib/cache.server";
import { apiRoutes } from "~/lib/api/routes";

type TimeRange = string;

export async function getActivityOverview(
  api: ApiClient,
  workspaceId: string,
  timeRange: TimeRange,
): Promise<HomeActivityOverview> {
  const response = await getOrSetCache(
    `${CACHE_KEYS.HOME_ACTIVITY_OVERVIEW}:${timeRange}`,
    () =>
      api.get<HomeActivityOverview>(
        apiRoutes.workspaces.dashboard.activityOverview(workspaceId),
        {
          params: {
            timeRange,
          },
        },
      ),
  );

  return response.data;
}

export async function getHealthScore(
  api: ApiClient,
  workspaceId: string,
  timeRange: TimeRange,
): Promise<HomeHealthScore> {
  const response = await getOrSetCache(
    `${CACHE_KEYS.HOME_HEALTH_SCORE}:${timeRange}`,
    () =>
      api.get<HomeHealthScore>(
        apiRoutes.workspaces.dashboard.healthScore(workspaceId),
        {
          params: {
            timeRange,
          },
        },
      ),
  );

  return response.data;
}

export async function getPopularItems(
  api: ApiClient,
  workspaceId: string,
  timeRange: TimeRange,
): Promise<HomePopularItems> {
  const response = await getOrSetCache(
    `${CACHE_KEYS.HOME_POPULAR_ITEMS}:${timeRange}`,
    () =>
      api.get<HomePopularItems>(
        apiRoutes.workspaces.dashboard.popularItems(workspaceId),
        {
          params: {
            timeRange,
          },
        },
      ),
  );

  return response.data;
}
