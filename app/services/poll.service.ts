import type { ApiClient } from "~/context";
import { apiRoutes } from "~/lib/api/routes";
import { CACHE_KEYS, getOrSetCache } from "~/lib/cache.server";
import { cleanObject } from "~/lib/utils";
import type { Poll } from "~/types";

type GetPollsParams = Partial<{
  search: string;
  status: string;
  limit: number;
}>;

type CreatePollInput = {
  title: string;
  description?: string;
  options: {
    title: string;
    order: number;
  }[];
  type: string;
  startAt: string;
  endAt: string;
};

export async function getPolls(
  api: ApiClient,
  workspaceId: string,
  params: GetPollsParams = {},
) {
  const cleanedParams = cleanObject(params);
  const cacheKey = `${CACHE_KEYS.POLLS}:${workspaceId}:${JSON.stringify(cleanedParams)}`;

  const { data, pagination } = await getOrSetCache(cacheKey, () =>
    api.get<Poll[]>(apiRoutes.workspaces.polls.base(workspaceId), {
      params: cleanedParams,
    }),
  );

  return {
    data,
    pagination,
  };
}

export async function getPoll(
  api: ApiClient,
  workspaceId: string,
  pollId: string,
): Promise<Poll> {
  const response = await getOrSetCache(`${CACHE_KEYS.POLLS}:${pollId}`, () =>
    api.get<Poll>(apiRoutes.workspaces.polls.byId(workspaceId, pollId)),
  );

  return response.data;
}

export async function createPoll(
  api: ApiClient,
  workspaceId: string,
  body: CreatePollInput,
): Promise<void> {
  await api.post<void, CreatePollInput>(
    apiRoutes.workspaces.polls.base(workspaceId),
    body,
  );
}

export async function deletePoll(
  api: ApiClient,
  workspaceId: string,
  pollId: string,
): Promise<void> {
  await api.del(apiRoutes.workspaces.polls.byId(workspaceId, pollId));
}
