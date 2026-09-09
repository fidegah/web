import type { Route } from "./+types/vote";
import { z } from "zod";
import { createResponse } from "~/lib/create-response";
import { getZodErrorMessages } from "~/lib/utils";
import { MESSAGES } from "~/constants/messages";
import { invalidatePollCache } from "~/lib/cache.utils.server";
import { apiClientContext, type ApiClient } from "~/context";
import {
  PortalVotePoll,
  removePortalPollVote,
} from "~/services/portal.service";

const VotePollSchema = z.object({
  pollId: z.string().min(1, "Poll ID is required"),
  optionIds: z
    .array(z.string().min(1))
    .min(1, "At least one Option ID is required"),
});

const RemoveVoteSchema = z.object({
  pollId: z.string().min(1, "Poll ID is required"),
});

type ActionContextParams = {
  formData: FormData;
  api: ApiClient;
};

const actionHandlers = {
  POST: async ({ formData, api }: ActionContextParams) => {
    const pollId = formData.get("pollId")?.toString();
    const rawOptionIds = formData
      .getAll("optionId")
      .map((id) => id.toString())
      .filter(Boolean);

    const result = VotePollSchema.safeParse({
      pollId,
      optionIds: rawOptionIds,
    });

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    await PortalVotePoll(api, result.data.pollId, {
      optionIds: result.data.optionIds,
    });

    invalidatePollCache(result.data.pollId);

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.VOTE.VOTED,
    });
  },

  DELETE: async ({ formData, api }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = RemoveVoteSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    await removePortalPollVote(api, result.data.pollId);

    invalidatePollCache(result.data.pollId);

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.VOTE.VOTE_REMOVED,
    });
  },
};

export async function action({ request, context }: Route.ActionArgs) {
  const api = context.get(apiClientContext);
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
  } catch (error) {
    console.error(`Poll vote operation (${request.method}) failed:`, error);

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: MESSAGES.VOTE.VOTE_ERROR,
    });
  }
}
