import type { Route } from "./+types/vote";
import { z } from "zod";
import { apiClientContext, type ApiClient } from "~/context";
import { MESSAGES } from "~/constants/messages";
import { createResponse } from "~/lib/create-response";
import { getZodErrorMessages } from "~/lib/utils";
import { invalidatePostVotesCache } from "~/lib/cache.utils.server";
import { toggleVotePost } from "~/services/post.service";
import { getCurrentWorkspace } from "~/services/workspace.service";
import { togglePortalVotePost } from "~/services/portal.service";

const ToggleVotePostSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
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
    const result = ToggleVotePostSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        showAlert: true,
        message: getZodErrorMessages(result.error),
      });
    }

    const { postId, isPortal } = result.data;
    const voteData = isPortal
      ? await togglePortalVotePost(api, postId)
      : await toggleVotePost(api, workspaceId, postId);

    invalidatePostVotesCache(postId);

    return createResponse({
      status: "OK",
      data: voteData,
      showAlert: true,
      message: MESSAGES.VOTE.VOTED,
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
      message: MESSAGES.VOTE.VOTE_ERROR,
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
    console.error(`Post vote operation (${request.method}) failed:`, error);

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: MESSAGES.VOTE.VOTE_ERROR,
    });
  }
}
