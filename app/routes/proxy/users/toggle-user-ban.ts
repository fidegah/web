import type { Route } from "./+types/toggle-user-ban";
import { z } from "zod";
import { apiClientContext, type ApiClient } from "~/context";
import { MESSAGES } from "~/constants/messages";
import { createResponse } from "~/lib/create-response";
import { getZodErrorMessages } from "~/lib/utils";
import { invalidateWorkspaceUsersCache } from "~/lib/cache.utils.server";
import {
  banWorkspaceUser,
  getCurrentWorkspace,
  unbanWorkspaceUser,
} from "~/services/workspace.service";

const ToggleUserBanSchema = z.object({
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
  POST: async ({ formData, api, workspaceId }: ActionContextParams) => {
    const rawUserIds = formData
      .getAll("userId")
      .map((id) => id.toString())
      .filter(Boolean);

    const result = ToggleUserBanSchema.safeParse({
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

    const results = await Promise.allSettled(
      userIds.map((userId) => banWorkspaceUser(api, workspaceId, userId)),
    );

    const failed = results.filter((r) => r.status === "rejected");

    if (failed.length > 0) {
      const errorMessage =
        failed.length === userIds.length
          ? MESSAGES.USERS.BAN_ERROR
          : `در مسدود کردن ${failed.length} از ${userIds.length} مشکلی پیش آمد.`;

      return createResponse({
        status: "ERR",
        showAlert: true,
        message: errorMessage,
      });
    }

    invalidateWorkspaceUsersCache();

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.USERS.BANNED,
    });
  },

  DELETE: async ({ formData, api, workspaceId }: ActionContextParams) => {
    const rawUserIds = formData
      .getAll("userId")
      .map((id) => id.toString())
      .filter(Boolean);

    const result = ToggleUserBanSchema.safeParse({
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

    const results = await Promise.allSettled(
      userIds.map((userId) => unbanWorkspaceUser(api, workspaceId, userId)),
    );

    const failed = results.filter((r) => r.status === "rejected");

    if (failed.length > 0) {
      const errorMessage =
        failed.length === userIds.length
          ? MESSAGES.USERS.UNBANNED_ERROR
          : `در رفع مسدود کردن ${failed.length} از ${userIds.length} مشکلی پیش آمد.`;

      return createResponse({
        status: "ERR",
        showAlert: true,
        message: errorMessage,
      });
    }

    invalidateWorkspaceUsersCache();

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.USERS.UNBANNED,
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
  } catch (err) {
    console.error(
      `Workspace user ban operation (${request.method}) failed:`,
      err,
    );

    const errorMessages: Record<string, string> = {
      POST: MESSAGES.USERS.BAN_ERROR,
      DELETE: MESSAGES.USERS.UNBANNED_ERROR,
    };

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: errorMessages[request.method] || MESSAGES.GENERAL.ERROR,
    });
  }
}
