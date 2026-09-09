import type { Route } from "./+types/toggle-pin";
import { z } from "zod";
import { apiClientContext, type ApiClient } from "~/context";
import { MESSAGES } from "~/constants/messages";
import { createResponse } from "~/lib/create-response";
import { getZodErrorMessages } from "~/lib/utils";
import { invalidatePostCache } from "~/lib/cache.utils.server";
import { toggleCommentPin } from "~/services/post-comment.service";
import { getCurrentWorkspace } from "~/services/workspace.service";

const ToggleCommentPinSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  commentId: z.string().min(1, "Comment ID is required"),
});

type ActionContextParams = {
  formData: FormData;
  api: ApiClient;
  workspaceId: string;
};

const actionHandlers = {
  PATCH: async ({ formData, api, workspaceId }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = ToggleCommentPinSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    const { postId, commentId } = result.data;

    await toggleCommentPin(api, workspaceId, postId, commentId);

    invalidatePostCache(postId);

    return createResponse({
      status: "OK",
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
  } catch (error) {
    console.error(
      `Comment toggle pin operation (${request.method}) failed:`,
      error,
    );

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: MESSAGES.GENERAL.ERROR,
    });
  }
}
