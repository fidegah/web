import type { Route } from "./+types";
import { z } from "zod";
import { createPostSchema } from "~/schemas/dashboard/post";
import { createResponse } from "~/lib/create-response";
import { getFormBoolean, getZodErrorMessages } from "~/lib/utils";
import { MESSAGES } from "~/constants/messages";
import { invalidatePostVotesCache } from "~/lib/cache.utils.server";
import { createPost, updatePost } from "~/services/post.service";
import { getCurrentWorkspace } from "~/services/workspace.service";
import { apiClientContext, type ApiClient } from "~/context";
import { createPortalPost } from "~/services/portal.service";
import { createSdkPost } from "~/services/sdk.service";

const UpdatePostSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  boardId: z.string().optional(),
  categoryId: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  statusId: z.string().optional(),
  sessionId: z.string().optional(),
});

type ActionContextParams = {
  formData: FormData;
  api: ApiClient;
};

const actionHandlers = {
  POST: async ({ formData, api }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = createPostSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    const { boardId, categoryId, title, description } = result.data;
    const sessionId = formData.get("sessionId")?.toString();
    const sdkToken = formData.get("sdkToken")?.toString();
    const isPortal = getFormBoolean(formData, "isPortal");

    let post;

    if (sessionId && sdkToken) {
      post = await createSdkPost(api, sdkToken, sessionId, {
        boardId,
        categoryId,
        title,
        description: description ?? undefined,
        visibility: "public",
      });
    } else if (isPortal) {
      post = await createPortalPost(api, {
        boardId,
        categoryId,
        title,
        description: description ?? undefined,
        visibility: "public",
      });
    } else {
      const workspace = await getCurrentWorkspace(api);
      post = await createPost(api, workspace.id, {
        boardId,
        categoryId,
        title,
        description: description ?? undefined,
        visibility: "public",
      });
    }

    invalidatePostVotesCache(null);

    return createResponse({
      status: "OK",
      showAlert: true,
      data: post,
      message: MESSAGES.POST.CREATED,
    });
  },

  PATCH: async ({ formData, api }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = UpdatePostSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    const { postId, boardId, categoryId, title, description, statusId } =
      result.data;

    const workspace = await getCurrentWorkspace(api);

    await updatePost(api, workspace.id, postId, {
      boardId,
      categoryId,
      title,
      description,
      statusId,
    });

    if (statusId) {
      return createResponse({
        status: "OK",
        showAlert: true,
        message: MESSAGES.POST_STATUS.UPDATED,
      });
    }

    invalidatePostVotesCache(postId);

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.POST.UPDATED,
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

    return await handler({
      formData,
      api,
    });
  } catch (err) {
    console.error(`Post operation (${request.method}) failed:`, err);

    const errorMessages: Record<string, string> = {
      POST: MESSAGES.POST.CREATION_ERROR,
      PATCH: MESSAGES.POST.UPDATE_ERROR,
    };

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: errorMessages[request.method] || MESSAGES.GENERAL.ERROR,
    });
  }
}
