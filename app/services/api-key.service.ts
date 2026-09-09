import type { ApiClient } from "~/context";
import { apiRoutes } from "~/lib/api/routes";
import type { ApiKey } from "~/types";

type CreateApiKeyInput = {
  name: string;
};

type UpdateApiKeyInput = {
  name: string;
};

export async function getApiKeys(
  api: ApiClient,
  workspaceId: string,
  page: string,
) {
  const { data, pagination } = await api.get<ApiKey[]>(
    apiRoutes.workspaces.apiKeys.base(workspaceId),
    {
      params: {
        page,
      },
    },
  );

  return {
    data,
    pagination,
  };
}

export async function createApiKey(
  api: ApiClient,
  workspaceId: string,
  body: CreateApiKeyInput,
) {
  const { data } = await api.post<ApiKey & { key: string }, CreateApiKeyInput>(
    apiRoutes.workspaces.apiKeys.base(workspaceId),
    body,
  );

  return data;
}

export async function updateApiKey(
  api: ApiClient,
  workspaceId: string,
  keyId: string,
  body: UpdateApiKeyInput,
) {
  await api.patch(apiRoutes.workspaces.apiKeys.byId(workspaceId, keyId), body);
}

export async function deleteApiKey(
  api: ApiClient,
  workspaceId: string,
  keyId: string,
) {
  await api.del(apiRoutes.workspaces.apiKeys.byId(workspaceId, keyId));
}
