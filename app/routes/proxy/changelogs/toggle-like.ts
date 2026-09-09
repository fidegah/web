import type { Route } from "./+types/toggle-like";
import { z } from "zod";
import { createResponse } from "~/lib/create-response";
import { getZodErrorMessages } from "~/lib/utils";
import { MESSAGES } from "~/constants/messages";
import { invalidateChangelogCache } from "~/lib/cache.utils.server";
import { toggleChangelogLike } from "~/services/changelog.service";
import { getCurrentWorkspace } from "~/services/workspace.service";
import { apiClientContext, type ApiClient } from "~/context";
import { togglePortalChangelogLike } from "~/services/portal.service";

const ToggleLikeSchema = z.object({
  changelogId: z.string().min(1),
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
    const result = ToggleLikeSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    const { changelogId, isPortal } = result.data;

    if (isPortal) {
      await togglePortalChangelogLike(api, changelogId);
    } else {
      await toggleChangelogLike(api, workspaceId, changelogId);
    }

    invalidateChangelogCache(changelogId);

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
      `Changelog like operation (${request.method}) failed:`,
      error,
    );

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: MESSAGES.GENERAL.ERROR,
    });
  }
}
