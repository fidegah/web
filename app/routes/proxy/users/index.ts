import type { Route } from "./+types";
import { z } from "zod";
import { apiClientContext, type ApiClient } from "~/context";
import { MESSAGES } from "~/constants/messages";
import { createResponse } from "~/lib/create-response";
import { getZodErrorMessages } from "~/lib/utils";
import {
  invalidateAllCache,
  invalidateWorkspaceUsersCache,
} from "~/lib/cache.utils.server";
import {
  deleteWorkspaceUser,
  getCurrentWorkspace,
} from "~/services/workspace.service";
import {
  updateCurrentUser,
  updateCurrentUserAvatar,
} from "~/services/user.service";

const UpdateUserProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required").optional(),
});

const DeleteWorkspaceUsersSchema = z.object({
  userIds: z
    .array(z.string().min(1))
    .min(1, "At least one User ID is required"),
});

type ActionContextParams = {
  formData: FormData;
  api: ApiClient;
  workspaceId: string;
};

const actionHandlers = {
  PATCH: async ({ formData, api }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = UpdateUserProfileSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        showAlert: true,
        message: getZodErrorMessages(result.error),
      });
    }

    const { fullName } = result.data;
    const avatar = formData.get("avatar") as File | null;

    if (avatar && avatar.size > 0) {
      await updateCurrentUserAvatar(api, { avatar });
    }

    if (fullName) {
      await updateCurrentUser(api, { fullName });
    }

    invalidateAllCache();

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.AUTH.PROFILE_UPDATED,
    });
  },

  DELETE: async ({ formData, api, workspaceId }: ActionContextParams) => {
    const rawUserIds = formData
      .getAll("userId")
      .map((id) => id.toString())
      .filter(Boolean);

    const result = DeleteWorkspaceUsersSchema.safeParse({
      userIds: rawUserIds,
    });

    if (!result.success) {
      return createResponse({
        status: "ERR",
        showAlert: true,
        message: getZodErrorMessages(result.error) || MESSAGES.VALIDATION.ERROR,
      });
    }

    const { userIds } = result.data;

    await Promise.all(
      userIds.map((userId) => deleteWorkspaceUser(api, workspaceId, userId)),
    );

    invalidateWorkspaceUsersCache();

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.USERS.DELETED,
    });
  },
};

export async function action({ request, context }: Route.ActionArgs) {
  const api = context.get(apiClientContext) as ApiClient;
  const method = request.method as keyof typeof actionHandlers;
  const handler = actionHandlers[method];

  if (!handler) {
    return createResponse({
      status: "ERR",
      showAlert: true,
      message: MESSAGES.VALIDATION.ERROR,
    });
  }

  try {
    const workspace = await getCurrentWorkspace(api);
    const formData = await request.formData();

    return await handler({
      formData,
      api,
      workspaceId: workspace.id,
    });
  } catch (error) {
    console.error(`Workspace operation (${request.method}) failed:`, error);

    const errorMessages: Record<string, string> = {
      PATCH: MESSAGES.AUTH.PROFILE_UPDATE_ERROR,
      DELETE: MESSAGES.USERS.DELETION_ERROR,
    };

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: errorMessages[request.method] || MESSAGES.GENERAL.ERROR,
    });
  }
}
