import type { ApiClient } from "~/context";
import { apiRoutes } from "~/lib/api/routes";
import { CACHE_KEYS, getOrSetCache } from "~/lib/cache.server";
import type { Roadmap, RoadmapFactor, RoadmapItemsResponse } from "~/types";

type CreateRoadmapInput = {
  name: string;
};

type UpdateRoadmapInput = {
  name: string;
};

type CreateRoadmapFactorInput = {
  name: string;
  source: string;
  type?: string;
  metric?: string;
  weight: number;
  isEffort: boolean;
};

type UpdateRoadmapFactorInput = Partial<{
  weight: number;
}>;

type CreateRoadmapItemInput = {
  postId: string;
};

type UpdateRoadmapItemInput = Record<string, unknown>;

export async function getRoadmaps(
  api: ApiClient,
  workspaceId: string,
): Promise<Roadmap[]> {
  const response = await getOrSetCache(CACHE_KEYS.ROADMAP_LIST, () =>
    api.get<Roadmap[]>(apiRoutes.workspaces.roadmaps.base(workspaceId)),
  );

  return response.data;
}

export async function createRoadmap(
  api: ApiClient,
  workspaceId: string,
  body: CreateRoadmapInput,
): Promise<Roadmap> {
  const response = await api.post<Roadmap, CreateRoadmapInput>(
    apiRoutes.workspaces.roadmaps.base(workspaceId),
    body,
  );

  return response.data;
}

export async function updateRoadmap(
  api: ApiClient,
  workspaceId: string,
  roadmapId: string,
  body: UpdateRoadmapInput,
): Promise<void> {
  await api.patch<void, UpdateRoadmapInput>(
    apiRoutes.workspaces.roadmaps.byId(workspaceId, roadmapId),
    body,
  );
}

export async function deleteRoadmap(
  api: ApiClient,
  workspaceId: string,
  roadmapId: string,
): Promise<void> {
  await api.del(apiRoutes.workspaces.roadmaps.byId(workspaceId, roadmapId));
}

export async function createRoadmapFactor(
  api: ApiClient,
  workspaceId: string,
  roadmapId: string,
  body: CreateRoadmapFactorInput,
): Promise<RoadmapFactor> {
  const { data } = await api.post<RoadmapFactor, CreateRoadmapFactorInput>(
    apiRoutes.workspaces.roadmaps.factors.base(workspaceId, roadmapId),
    body,
  );

  return data;
}

export async function updateRoadmapFactor(
  api: ApiClient,
  workspaceId: string,
  factorId: string,
  body: UpdateRoadmapFactorInput,
): Promise<RoadmapFactor> {
  const { data } = await api.patch<RoadmapFactor, UpdateRoadmapFactorInput>(
    apiRoutes.workspaces.roadmaps.factors.byId(workspaceId, factorId),
    body,
  );

  return data;
}

export async function deleteRoadmapFactor(
  api: ApiClient,
  workspaceId: string,
  factorId: string,
): Promise<void> {
  await api.del(
    apiRoutes.workspaces.roadmaps.factors.byId(workspaceId, factorId),
  );
}

export async function getRoadmapItems(
  api: ApiClient,
  workspaceId: string,
  roadmapId: string,
  params: {
    search?: string;
    statusId?: string;
  } = {},
): Promise<RoadmapItemsResponse> {
  const { search = "", statusId = "" } = params;

  const response = await getOrSetCache(
    `${CACHE_KEYS.ROADMAP_ITEMS}:${roadmapId}:${search}:${statusId}`,
    () =>
      api.get<RoadmapItemsResponse>(
        apiRoutes.workspaces.roadmaps.items.base(workspaceId, roadmapId),
        {
          params: {
            search,
            statusId,
          },
        },
      ),
  );

  return response.data;
}

export async function createRoadmapItem(
  api: ApiClient,
  workspaceId: string,
  roadmapId: string,
  body: CreateRoadmapItemInput,
): Promise<void> {
  await api.post<void, UpdateRoadmapItemInput>(
    apiRoutes.workspaces.roadmaps.items.base(workspaceId, roadmapId),
    body,
  );
}

export async function updateRoadmapItem(
  api: ApiClient,
  workspaceId: string,
  itemId: string,
  body: UpdateRoadmapItemInput,
): Promise<void> {
  await api.patch<void, UpdateRoadmapItemInput>(
    apiRoutes.workspaces.roadmaps.items.byId(workspaceId, itemId),
    body,
  );
}

export async function deleteRoadmapItem(
  api: ApiClient,
  workspaceId: string,
  itemId: string,
): Promise<void> {
  await api.del(apiRoutes.workspaces.roadmaps.items.byId(workspaceId, itemId));
}
