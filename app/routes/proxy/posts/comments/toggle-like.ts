import type { Route } from "./+types/toggle-like";
import { z } from "zod";
import { apiClientContext, type ApiClient } from "~/context";
import { MESSAGES } from "~/constants/messages";
import { createResponse } from "~/lib/create-response";
import { getFormBoolean, getZodErrorMessages } from "~/lib/utils";
import { invalidatePostCache } from "~/lib/cache.utils.server";
import { toggleCommentLike } from "~/services/post-comment.service";
import { getCurrentWorkspace } from "~/services/workspace.service";
import { togglePortalCommentLike } from "~/services/portal.service";

const ToggleCommentLikeSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  commentId: z.string().min(1, "Comment ID is required"),
  sessionId: z.string().optional(),
  isPortal: z
    .string()
    .optional()
    .transform((value) => value === "true"),
});

type ActionContextParams = {
  formData: FormData;
  api: ApiClient;
  workspaceId: string;
};

const actionHandlers = {
  POST: async ({ formData, api, workspaceId }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = ToggleCommentLikeSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    const { postId, commentId, isPortal } = result.data;
    if (isPortal) {
      await togglePortalCommentLike(api, commentId);
    } else {
      await toggleCommentLike(api, workspaceId, postId, commentId);
    }

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
    const formData = await request.formData();
    const isPortal = getFormBoolean(formData, "isPortal");
    let workspace;
    if (isPortal) workspace = await getCurrentWorkspace(api);

    return await handler({
      formData,
      api,
      workspaceId: workspace?.id ?? "",
    });
  } catch (error) {
    console.error(`Comment like operation (${request.method}) failed:`, error);

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: MESSAGES.GENERAL.ERROR,
    });
  }
}
