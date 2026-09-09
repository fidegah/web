import type { Route } from "./+types";
import { z } from "zod";
import { getZodErrorMessages } from "~/lib/utils";
import { createPollSchema } from "~/schemas/dashboard/poll";
import { createResponse } from "~/lib/create-response";
import { MESSAGES } from "~/constants/messages";
import { invalidatePollCache } from "~/lib/cache.utils.server";
import { createPoll, deletePoll } from "~/services/poll.service";
import { getCurrentWorkspace } from "~/services/workspace.service";
import { apiClientContext, type ApiClient } from "~/context";

const DeletePollSchema = z.object({
  pollId: z.string().min(1, "Poll ID is required"),
});

type ActionContextParams = {
  formData: FormData;
  api: ApiClient;
  workspaceId: string;
};

const actionHandlers = {
  POST: async ({ formData, api, workspaceId }: ActionContextParams) => {
    const rawPayload = Object.fromEntries(formData);

    let options: unknown = rawPayload.options;
    if (typeof rawPayload.options === "string") {
      try {
        options = JSON.parse(rawPayload.options);
      } catch {
        options = rawPayload.options;
      }
    }

    const payloadToValidate = {
      ...rawPayload,
      options,
    };

    const result = createPollSchema.safeParse(payloadToValidate);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    const { title, description, type, startAtISO, endAtISO } = result.data;

    await createPoll(api, workspaceId, {
      title,
      description: description ?? undefined,
      options: options as typeof result.data.options,
      type,
      startAt: startAtISO,
      endAt: endAtISO,
    });

    invalidatePollCache(null);

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.POLL.CREATED,
    });
  },

  DELETE: async ({ formData, api, workspaceId }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = DeletePollSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    await deletePoll(api, workspaceId, result.data.pollId);

    invalidatePollCache(null);

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.POLL.DELETED,
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
    console.error(`Poll operation (${request.method}) failed:`, err);

    const errorMessages: Record<string, string> = {
      POST: MESSAGES.POLL.CREATION_ERROR,
      DELETE: MESSAGES.POLL.DELETED,
    };

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: errorMessages[request.method] || MESSAGES.GENERAL.ERROR,
    });
  }
}
