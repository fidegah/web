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
import {
  createSdkPostComment,
  deleteSdkPostComment,
  updateSdkPostComment,
} from "~/services/sdk.service";

const CreateCommentSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  content: z.string().min(1, "Content is required"),
  parentId: z.string().optional(),
  sessionId: z.string().optional(),
  sdkToken: z.string().optional(),
  isPortal: z
    .string()
    .optional()
    .transform((value) => value === "true"),
});

const UpdateCommentSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  commentId: z.string().min(1, "Comment ID is required"),
  content: z.string().min(1, "Content is required"),
  sessionId: z.string().optional(),
  sdkToken: z.string().optional(),
  isPortal: z
    .string()
    .optional()
    .transform((value) => value === "true"),
});

const DeleteCommentSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  commentId: z.string().min(1, "Comment ID is required"),
  sessionId: z.string().optional(),
  sdkToken: z.string().optional(),
  isPortal: z
    .string()
    .optional()
    .transform((value) => value === "true"),
});

type ActionContextParams = {
  formData: FormData;
  api: ApiClient;
};

const actionHandlers = {
  POST: async ({ formData, api }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = CreateCommentSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    const { postId, content, parentId, sessionId, sdkToken, isPortal } =
      result.data;

    let newComment;

    if (sessionId && sdkToken) {
      newComment = await createSdkPostComment(
        api,
        sdkToken,
        sessionId,
        postId,
        {
          content,
          parentId,
        },
      );
    } else if (isPortal) {
      newComment = await createPortalPostComment(api, postId, {
        content,
        parentId,
      });
    } else {
      const workspace = await getCurrentWorkspace(api);
      newComment = await createPostComment(api, workspace.id, postId, {
        content,
        parentId,
      });
    }

    invalidatePostCache(postId);

    return createResponse({
      status: "OK",
      data: newComment,
    });
  },

  PATCH: async ({ formData, api }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = UpdateCommentSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    const { postId, commentId, content, sessionId, sdkToken, isPortal } =
      result.data;

    let comment;

    if (sessionId && sdkToken) {
      comment = await updateSdkPostComment(
        api,
        sdkToken,
        sessionId,
        postId,
        commentId,
        {
          content,
        },
      );
    } else if (isPortal) {
      comment = await updatePortalPostComment(api, commentId, {
        content,
      });
    } else {
      const workspace = await getCurrentWorkspace(api);
      comment = await updatePostComment(api, workspace.id, postId, commentId, {
        content,
      });
    }

    invalidatePostCache(postId);

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.COMMENT.UPDATED,
      data: comment,
    });
  },

  DELETE: async ({ formData, api }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = DeleteCommentSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    const { postId, commentId, sessionId, sdkToken, isPortal } = result.data;

    if (sessionId && sdkToken) {
      await deleteSdkPostComment(api, sdkToken, sessionId, postId, commentId);
    } else if (isPortal) {
      await deletePortalPostComment(api, commentId);
    } else {
      const workspace = await getCurrentWorkspace(api);
      await deletePostComment(api, workspace.id, postId, commentId);
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
    const formData = await request.formData();

    return await handler({
      formData,
      api,
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
