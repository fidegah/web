import type { Route } from "./+types";
import { z } from "zod";
import { apiClientContext, type ApiClient } from "~/context";
import { MESSAGES } from "~/constants/messages";
import { createResponse } from "~/lib/create-response";
import { getZodErrorMessages } from "~/lib/utils";
import { invalidatePostCache } from "~/lib/cache.utils.server";
import {
  createPostComment,
  deletePostComment,
  updatePostComment,
} from "~/services/post-comment.service";
import { getCurrentWorkspace } from "~/services/workspace.service";
import {
  createPortalPostComment,
  deletePortalPostComment,
  updatePortalPostComment,
} from "~/services/portal.service";

const CreateCommentSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  content: z.string().min(1, "Content is required"),
  parentId: z.string().optional(),
  sessionId: z.string().optional(),
  isPortal: z
    .string()
    .optional()
    .transform((value) => value === "true"),
});

const UpdateCommentSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  commentId: z.string().min(1, "Comment ID is required"),
  content: z.string().min(1, "Content is required"),
  isPortal: z
    .string()
    .optional()
    .transform((value) => value === "true"),
});

const DeleteCommentSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  commentId: z.string().min(1, "Comment ID is required"),
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
    const result = CreateCommentSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    const { postId, content, parentId, sessionId, isPortal } = result.data;

    const newComment = isPortal
      ? await createPortalPostComment(api, postId, {
          content,
          parentId,
          sessionId,
        })
      : await createPostComment(api, workspaceId, postId, {
          content,
          parentId,
          sessionId,
        });

    invalidatePostCache(postId);

    return createResponse({
      status: "OK",
      data: newComment,
    });
  },

  PATCH: async ({ formData, api, workspaceId }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = UpdateCommentSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    const { postId, commentId, content, isPortal } = result.data;

    const comment = isPortal
      ? await updatePortalPostComment(api, commentId, {
          content,
        })
      : await updatePostComment(api, workspaceId, postId, commentId, {
          content,
        });

    invalidatePostCache(postId);

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.COMMENT.UPDATED,
      data: comment,
    });
  },

  DELETE: async ({ formData, api, workspaceId }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = DeleteCommentSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    const { postId, commentId, isPortal } = result.data;

    if (isPortal) {
      await deletePortalPostComment(api, commentId);
    } else {
      await deletePostComment(api, workspaceId, postId, commentId);
    }

    invalidatePostCache(postId);

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.COMMENT.DELETED,
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
    console.error(`Post comment operation (${request.method}) failed:`, err);

    const errorMessages: Record<string, string> = {
      POST: MESSAGES.COMMENT.CREATION_ERROR,
      PATCH: MESSAGES.COMMENT.UPDATE_ERROR,
      DELETE: MESSAGES.COMMENT.DELETION_ERROR,
    };

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: errorMessages[request.method] || MESSAGES.GENERAL.ERROR,
    });
  }
}
