import type { ApiClient } from "~/context";
import { apiRoutes } from "~/lib/api/routes";
import { CACHE_KEYS, getOrSetCache } from "~/lib/cache.server";
import type { Tag } from "~/types";

type CreateBoardTagInput = {
  name: string;
};

type UpdateBoardTagInput = {
  name: string;
};

export async function getBoardTags(
  api: ApiClient,
  workspaceId: string,
  boardId: string,
): Promise<Tag[]> {
  const response = await getOrSetCache(
    `${CACHE_KEYS.TAGS_LIST}:${boardId}`,
    () =>
      api.get<Tag[]>(apiRoutes.workspaces.tags.base(workspaceId), {
        params: { boardId },
      }),
  );

  return response.data;
}

export async function createBoardTag(
  api: ApiClient,
  workspaceId: string,
  boardId: string,
  body: CreateBoardTagInput,
): Promise<Tag> {
  const { data } = await api.post<
    Tag,
    { boardId: string } & CreateBoardTagInput
  >(apiRoutes.workspaces.tags.base(workspaceId), { boardId, ...body });

  return data;
}

export async function updateBoardTag(
  api: ApiClient,
  workspaceId: string,
  tagId: string,
  body: UpdateBoardTagInput,
): Promise<Tag> {
  const { data } = await api.patch<Tag, UpdateBoardTagInput>(
    apiRoutes.workspaces.tags.byId(workspaceId, tagId),
    body,
  );

  return data;
}

export async function deleteBoardTag(
  api: ApiClient,
  workspaceId: string,
  tagId: string,
): Promise<void> {
  await api.del(apiRoutes.workspaces.tags.byId(workspaceId, tagId));
}
