import type { Route } from "./+types/tags";
import { z } from "zod";
import { apiClientContext, type ApiClient } from "~/context";
import { MESSAGES } from "~/constants/messages";
import { createResponse } from "~/lib/create-response";
import { getZodErrorMessages } from "~/lib/utils";
import { addPostTag, removePostTag } from "~/services/post.service";
import { getCurrentWorkspace } from "~/services/workspace.service";

const PostTagSchema = z.object({
  boardId: z.string().min(1, "Board ID is required"),
  postId: z.string().min(1, "Post ID is required"),
  tagId: z.string().min(1, "Tag ID is required"),
});

type ActionContextParams = {
  formData: FormData;
  api: ApiClient;
  workspaceId: string;
};

const actionHandlers = {
  POST: async ({ formData, api, workspaceId }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = PostTagSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        showAlert: true,
        message: getZodErrorMessages(result.error),
      });
    }

    const { postId, tagId } = result.data;
    const data = await addPostTag(api, workspaceId, postId, tagId);

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.TAG.ADDITION,
      data: { action: "create-tag", postTag: data, tagId },
    });
  },

  DELETE: async ({ formData, api, workspaceId }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = PostTagSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        showAlert: true,
        message: getZodErrorMessages(result.error),
      });
    }

    const { postId, tagId } = result.data;
    await removePostTag(api, workspaceId, postId, tagId);

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.TAG.DELETED,
      data: { action: "delete-tag", tagId },
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
    console.error(`Post tag operation (${request.method}) failed:`, err);

    const errorMessages: Record<string, string> = {
      POST: MESSAGES.TAG.ADDITION_ERROR,
      DELETE: MESSAGES.TAG.DELETION_ERROR,
    };

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: errorMessages[request.method] || MESSAGES.TAG.ADDITION_ERROR,
    });
  }
}
