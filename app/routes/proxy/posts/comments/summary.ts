import type { Route } from "./+types/summary";
import { z } from "zod";
import { createResponse } from "~/lib/create-response";
import { getZodErrorMessages } from "~/lib/utils";
import { MESSAGES } from "~/constants/messages";
import { getPostCommentsSummary } from "~/services/post-comment.service";
import { getCurrentWorkspace } from "~/services/workspace.service";
import { apiClientContext, type ApiClient } from "~/context";

const PostCommentsSummaryQuerySchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
});

export async function loader({ context, url }: Route.LoaderArgs) {
  const api = context.get(apiClientContext) as ApiClient;

  const rawPostId = url.searchParams.get("postId");

  const result = PostCommentsSummaryQuerySchema.safeParse({
    postId: rawPostId,
  });

  if (!result.success) {
    return createResponse({
      status: "ERR",
      showAlert: true,
      message: getZodErrorMessages(result.error) || MESSAGES.VALIDATION.ERROR,
    });
  }

  const { postId } = result.data;

  try {
    const workspace = await getCurrentWorkspace(api);

    const summary = await getPostCommentsSummary(api, workspace.id, postId);

    return createResponse({ status: "OK", data: { summary } });
  } catch (error) {
    console.error(
      `Failed to fetch comments summary for Post ID ${postId}:`,
      error,
    );

    return createResponse({
      status: "ERR",
      message: MESSAGES.AI.SUMMARY_GENERATION_ERROR,
      showAlert: true,
    });
  }
}
