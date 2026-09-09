import type { ApiClient } from "~/context";
import { apiRoutes } from "~/lib/api/routes";
import { CACHE_KEYS, getOrSetCache } from "~/lib/cache.server";
import { cleanObject } from "~/lib/utils";
import type { Changelog, ChangelogTag } from "~/types";

type GetChangelogsParams = Partial<{
  search: string;
  tagId: string;
  limit: number;
}>;

type CreateChangelogInput = {
  title: string;
  content: string;
  tagIds: string[];
};

type UpdateChangelogInput = Partial<{
  title: string;
  content: Record<string, unknown>;
  tagIds: string[];
}>;

export async function getChangelogs(
  api: ApiClient,
  workspaceId: string,
  params: GetChangelogsParams = {},
) {
  const cleanedParams = cleanObject(params);
  const search = cleanedParams.search ?? "";
  const tagId = cleanedParams.tagId ?? "";

  const { data, pagination } = await getOrSetCache(
    `${CACHE_KEYS.CHANGELOGS}:${search}:${tagId}`,
    () =>
      api.get<Changelog[]>(apiRoutes.workspaces.changelogs.base(workspaceId), {
        params: cleanedParams,
      }),
  );

  return {
    data,
    pagination,
  };
}

export async function getChangelog(
  api: ApiClient,
  workspaceId: string,
  id: string,
): Promise<Changelog> {
  const response = await getOrSetCache(`${CACHE_KEYS.CHANGELOGS}:${id}`, () =>
    api.get<Changelog>(apiRoutes.workspaces.changelogs.byId(workspaceId, id)),
  );

  return response.data;
}

export async function createChangelog(
  api: ApiClient,
  workspaceId: string,
  body: CreateChangelogInput,
): Promise<void> {
  await api.post<void, CreateChangelogInput>(
    apiRoutes.workspaces.changelogs.base(workspaceId),
    body,
  );
}

export async function updateChangelog(
  api: ApiClient,
  workspaceId: string,
  changelogId: string,
  body: UpdateChangelogInput,
): Promise<void> {
  const cleanedBody = cleanObject(body);

  await api.patch<void, typeof cleanedBody>(
    apiRoutes.workspaces.changelogs.byId(workspaceId, changelogId),
    cleanedBody,
  );
}

export async function deleteChangelog(
  api: ApiClient,
  workspaceId: string,
  changelogId: string,
): Promise<void> {
  await api.del(apiRoutes.workspaces.changelogs.byId(workspaceId, changelogId));
}

export async function toggleChangelogLike(
  api: ApiClient,
  workspaceId: string,
  changelogId: string,
): Promise<void> {
  await api.post(
    apiRoutes.workspaces.changelogs.like(workspaceId, changelogId),
  );
}

export async function getChangelogTags(
  api: ApiClient,
  workspaceId: string,
): Promise<ChangelogTag[]> {
  const cacheKey = `${CACHE_KEYS.CHANGELOGS}:tags:${workspaceId}`;

  const response = await getOrSetCache(cacheKey, () =>
    api.get<ChangelogTag[]>(apiRoutes.workspaces.changelogs.tags(workspaceId)),
  );

  return response.data;
}
