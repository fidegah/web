import type { ApiClient } from "~/context";
import { apiRoutes } from "~/lib/api/routes";
import { CACHE_KEYS, getOrSetCache } from "~/lib/cache.server";
import { cleanObject } from "~/lib/utils";
import type { User } from "~/types";

type UpdateCurrentUserInput = Partial<{
  fullName: string;
  onboardingMeta: Record<string, unknown>;
}>;

type UpdateUserAvatarInput = {
  avatar: File;
};

export async function getCurrentUser(api: ApiClient): Promise<User> {
  const response = await getOrSetCache(CACHE_KEYS.USER_PROFILE, () =>
    api.get<User>(apiRoutes.users.me),
  );

  return response.data;
}

export async function updateCurrentUser(
  api: ApiClient,
  body: UpdateCurrentUserInput,
): Promise<User> {
  const cleanedBody = cleanObject(body);

  const { data } = await api.patch<User, typeof cleanedBody>(
    apiRoutes.users.me,
    cleanedBody,
  );

  return data;
}

export async function updateCurrentUserAvatar(
  api: ApiClient,
  body: UpdateUserAvatarInput,
): Promise<User> {
  const formData = new FormData();
  formData.append("avatar", body.avatar);

  const { data } = await api.patch<User, FormData>(
    apiRoutes.users.meAvatar,
    formData,
    {
      isFormData: true,
    },
  );

  return data;
}
