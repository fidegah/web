import type { Route } from "./+types";
import { z } from "zod";
import { apiClientContext, type ApiClient } from "~/context";
import { MESSAGES } from "~/constants/messages";
import { createResponse } from "~/lib/create-response";
import { getZodErrorMessages } from "~/lib/utils";
import { deleteNotification } from "~/services/notification.service";
import { getCurrentWorkspace } from "~/services/workspace.service";

const DeleteNotificationSchema = z.object({
  notificationId: z.string().min(1, "Notification ID is required"),
});

type ActionContextParams = {
  formData: FormData;
  api: ApiClient;
  workspaceId: string;
};

const actionHandlers = {
  DELETE: async ({ formData, api, workspaceId }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = DeleteNotificationSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    await deleteNotification(api, workspaceId, result.data.notificationId);

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.NOTIFICATION.DELETE.SUCCESS,
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

  try {
    const workspace = await getCurrentWorkspace(api);
    const formData = await request.formData();

    return await handler({
      formData,
      api,
      workspaceId: workspace.id,
    });
  } catch (err) {
    console.error(`Notification operation (${request.method}) failed:`, err);

    const errorMessages: Record<string, string> = {
      DELETE: MESSAGES.NOTIFICATION.DELETE.ERROR,
    };

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: errorMessages[request.method] || MESSAGES.GENERAL.ERROR,
    });
  }
}
