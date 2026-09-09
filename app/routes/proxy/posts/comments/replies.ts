import { data, type LoaderFunctionArgs } from "react-router";
import { z } from "zod";
import { apiClientContext, type ApiClient } from "~/context";
import { ERROR_CODE } from "~/constants/errors";
import { getCurrentWorkspace } from "~/services/workspace.service";
import { getPostCommentReplies } from "~/services/post-comment.service";
import { createResponse } from "~/lib/create-response";
import { getPortalCommentReplies } from "~/services/portal.service";

const CommentRepliesQuerySchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  commentId: z.string().min(1, "Comment ID is required"),
  isPortal: z
    .string()
    .optional()
    .transform((value) => value === "true"),
});

export async function loader({ request, context }: LoaderFunctionArgs) {
  const api = context.get(apiClientContext) as ApiClient;
  const url = new URL(request.url);

  const queryParams = {
    postId: url.searchParams.get("postId"),
    commentId: url.searchParams.get("commentId"),
    isPortal: url.searchParams.get("isPortal"),
  };

  const result = CommentRepliesQuerySchema.safeParse(queryParams);

  if (!result.success) {
    throw data(null, { status: 400 });
  }

  const { postId, commentId, isPortal } = result.data;

  try {
    if (isPortal) {
      const replies = await getPortalCommentReplies(api, commentId);

      return createResponse({ status: "OK", data: replies });
    }

    const workspace = await getCurrentWorkspace(api);
    const replies = await getPostCommentReplies(
      api,
      workspace.id,
      postId,
      commentId,
    );

    return createResponse({ status: "OK", data: replies });
  } catch (error) {
    console.error("Failed to fetch replies:", error);
    throw data(
      { message: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA },
      { status: 500 },
    );
  }
}
