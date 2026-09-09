import type { Route } from "./+types/mark-as-read";
import { z } from "zod";
import { apiClientContext, type ApiClient } from "~/context";
import { MESSAGES } from "~/constants/messages";
import { createResponse } from "~/lib/create-response";
import { getZodErrorMessages } from "~/lib/utils";
import { markNotificationsAsRead } from "~/services/notification.service";
import { getCurrentWorkspace } from "~/services/workspace.service";

const MarkAsReadSchema = z.object({
  notificationIds: z
    .array(z.string().min(1))
    .min(1, "At least one Notification ID is required"),
});

type ActionContextParams = {
  formData: FormData;
  api: ApiClient;
  workspaceId: string;
};

const actionHandlers = {
  POST: async ({ formData, api, workspaceId }: ActionContextParams) => {
    const rawIds = formData
      .getAll("notificationId")
      .map((id) => id.toString())
      .filter(Boolean);

    const result = MarkAsReadSchema.safeParse({
      notificationIds: rawIds,
    });

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    const { notificationIds } = result.data;

    await markNotificationsAsRead(api, workspaceId, {
      notificationIds,
    });

    return createResponse({
      status: "OK",
      showAlert: true,
      message:
        notificationIds.length > 1
          ? MESSAGES.NOTIFICATION.MARK_ALL.SUCCESS
          : MESSAGES.NOTIFICATION.MARK_SINGLE.SUCCESS,
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
      message: MESSAGES.GENERAL.ERROR,
    });
  }

  let isMultiple = false;

  try {
    const workspace = await getCurrentWorkspace(api);
    const formData = await request.formData();

    const rawIds = formData.getAll("notificationId");
    isMultiple = rawIds.length > 1;

    return await handler({
      formData,
      api,
      workspaceId: workspace.id,
    });
  } catch (error) {
    console.error("Failed to mark notifications as read:", error);

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: isMultiple
        ? MESSAGES.NOTIFICATION.MARK_ALL.ERROR
        : MESSAGES.NOTIFICATION.MARK_SINGLE.ERROR,
    });
  }
}
