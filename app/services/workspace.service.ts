import type { ApiClient } from "~/context";
import { apiRoutes } from "~/lib/api/routes";
import { CACHE_KEYS, getOrSetCache } from "~/lib/cache.server";
import { cleanObject } from "~/lib/utils";
import type {
  UserActivityStatus,
  Workspace,
  WorkspaceCredentials,
  WorkspaceUser,
} from "~/types";

type CreateWorkspaceInput = {
  name: string;
  subdomain: string;
};

type UpdateWorkspaceInput = Partial<{
  name: string;
}>;

type GetWorkspaceUsersParams = Partial<{
  search: string;
  page: number;
  limit: number;
}>;

type GetUserActivityStatusParams = Partial<{
  page: number;
  limit: number;
  search: string;
  filter: string;
}>;

type UpdateAllowedDomainsInput = {
  allowedDomains: string[];
};

type UpdateSecureIdentifyInput = {
  enforce: boolean;
};

export async function getWorkspaces(api: ApiClient): Promise<Workspace[]> {
  const response = await getOrSetCache(CACHE_KEYS.WORKSPACES_LIST, () =>
    api.get<Workspace[]>(apiRoutes.workspaces.base),
  );

  return response.data;
}

export async function getCurrentWorkspace(api: ApiClient): Promise<Workspace> {
  const response = await getOrSetCache(CACHE_KEYS.WORKSPACE_CURRENT, () =>
    api.get<Workspace>(apiRoutes.workspaces.current),
  );

  return response.data;
}

export async function getWorkspaceMembership(
  api: ApiClient,
  workspaceId: string,
): Promise<WorkspaceUser> {
  const response = await getOrSetCache(CACHE_KEYS.WORKSPACE_MEMBERSHIP, () =>
    api.get<WorkspaceUser>(apiRoutes.workspaces.me(workspaceId)),
  );

  return response.data;
}

export async function createWorkspace(
  api: ApiClient,
  body: CreateWorkspaceInput,
): Promise<Workspace> {
  const cleanedBody = cleanObject(body);

  const { data } = await api.post<Workspace, typeof cleanedBody>(
    apiRoutes.workspaces.base,
    cleanedBody,
  );

  return data;
}

export async function updateWorkspace(
  api: ApiClient,
  workspaceId: string,
  body: UpdateWorkspaceInput,
): Promise<Workspace> {
  const cleanedBody = cleanObject(body);

  const { data } = await api.patch<Workspace, typeof cleanedBody>(
    apiRoutes.workspaces.byId(workspaceId),
    cleanedBody,
  );

  return data;
}

export async function deleteWorkspace(
  api: ApiClient,
  workspaceId: string,
): Promise<void> {
  await api.del(apiRoutes.workspaces.byId(workspaceId));
}

export async function getWorkspaceUsers(
  api: ApiClient,
  workspaceId: string,
  params: GetWorkspaceUsersParams = {},
) {
  const cleanedParams = cleanObject(params);
  const search = cleanedParams.search ?? "";
  const page = cleanedParams.page ?? 1;
  const limit = cleanedParams.limit ?? 30;

  const cacheKey = `${CACHE_KEYS.WORKSPACE_USERS}:${search}:${page}:${limit}`;

  const { data, pagination } = await getOrSetCache(cacheKey, () =>
    api.get<WorkspaceUser[]>(apiRoutes.workspaces.users.base(workspaceId), {
      params: cleanedParams,
    }),
  );

  return { data, pagination };
}

export async function getWorkspaceUser(
  api: ApiClient,
  workspaceId: string,
  userId: string,
) {
  const cacheKey = `${CACHE_KEYS.WORKSPACE_USERS}:${userId}`;

  const response = await getOrSetCache(cacheKey, () =>
    api.get<WorkspaceUser>(
      apiRoutes.workspaces.users.byId(workspaceId, userId),
    ),
  );

  return response.data;
}

export async function deleteWorkspaceUser(
  api: ApiClient,
  workspaceId: string,
  userId: string,
): Promise<void> {
  await api.del(apiRoutes.workspaces.users.byId(workspaceId, userId));
}

export async function getUserActivityStatus(
  api: ApiClient,
  workspaceId: string,
  userId: string,
  params: GetUserActivityStatusParams = {},
) {
  const cleanedParams = cleanObject(params);
  const page = cleanedParams.page ?? 1;
  const limit = cleanedParams.limit ?? 30;
  const search = cleanedParams.search ?? "";
  const filter = cleanedParams.filter ?? "";

  const cacheKey = [
    CACHE_KEYS.USER_ACTIVITY_STATUS,
    userId,
    page,
    limit,
    search,
    filter,
  ].join(":");

  const { data, pagination } = await getOrSetCache(cacheKey, () =>
    api.get<UserActivityStatus>(
      apiRoutes.workspaces.users.activity(workspaceId, userId),
      {
        params: cleanedParams,
      },
    ),
  );

  return { data, pagination };
}

export async function banWorkspaceUser(
  api: ApiClient,
  workspaceId: string,
  userId: string,
): Promise<WorkspaceUser> {
  const { data } = await api.post<WorkspaceUser>(
    apiRoutes.workspaces.users.ban(workspaceId, userId),
  );

  return data;
}

export async function unbanWorkspaceUser(
  api: ApiClient,
  workspaceId: string,
  userId: string,
): Promise<WorkspaceUser> {
  const { data } = await api.del<WorkspaceUser>(
    apiRoutes.workspaces.users.ban(workspaceId, userId),
  );

  return data;
}

export async function getWorkspaceCredentials(
  api: ApiClient,
  workspaceId: string,
): Promise<WorkspaceCredentials> {
  const { data } = await api.get<WorkspaceCredentials>(
    apiRoutes.workspaces.credentials(workspaceId),
  );

  return data;
}

export async function updateAllowedDomains(
  api: ApiClient,
  workspaceId: string,
  body: UpdateAllowedDomainsInput,
): Promise<void> {
  const cleanedBody = cleanObject(body);

  await api.patch<void, typeof cleanedBody>(
    apiRoutes.workspaces.allowedDomains(workspaceId),
    cleanedBody,
  );
}

export async function updateSecureIdentify(
  api: ApiClient,
  workspaceId: string,
  body: UpdateSecureIdentifyInput,
): Promise<void> {
  const cleanedBody = cleanObject(body);

  await api.patch<void, typeof cleanedBody>(
    apiRoutes.workspaces.secureIdentify(workspaceId),
    cleanedBody,
  );
}
