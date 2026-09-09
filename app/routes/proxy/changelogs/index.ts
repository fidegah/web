import type { Route } from "./+types";
import { getZodErrorMessages } from "~/lib/utils";
import { createResponse } from "~/lib/create-response";
import { MESSAGES } from "~/constants/messages";
import { createChangelogSchema } from "~/schemas/dashboard/changelogs";
import { invalidateChangelogCache } from "~/lib/cache.utils.server";
import {
  createChangelog,
  deleteChangelog,
  updateChangelog,
} from "~/services/changelog.service";
import { getCurrentWorkspace } from "~/services/workspace.service";
import { apiClientContext, type ApiClient } from "~/context";

type ActionContextParams = {
  formData: FormData;
  api: ApiClient;
  workspaceId: string;
};

const actionHandlers = {
  POST: async ({ formData, api, workspaceId }: ActionContextParams) => {
    const title = formData.get("title")?.toString() || "";
    const content = formData.get("content")?.toString() || "";
    const tagIds = formData.getAll("tagIds").map((id) => id.toString());

    const result = createChangelogSchema.safeParse({
      title,
      content,
      tagIds,
    });

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    await createChangelog(api, workspaceId, {
      title: result.data.title,
      content: result.data.content,
      tagIds: result.data.tagIds,
    });

    invalidateChangelogCache(null);

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.CHANGELOGS.CREATED,
    });
  },

  PATCH: async ({ formData, api, workspaceId }: ActionContextParams) => {
    const changelogId = formData.get("changelogId")?.toString();

    if (!changelogId) {
      throw new Error("Changelog ID is required for PATCH requests");
    }

    const title = formData.get("title")?.toString();
    const contentStr = formData.get("content")?.toString();
    const tagIds = formData.getAll("tagIds").map((id) => id.toString());

    const contentObject = contentStr ? JSON.parse(contentStr) : undefined;

    await updateChangelog(api, workspaceId, changelogId, {
      title,
      content: contentObject,
      tagIds,
    });

    invalidateChangelogCache(changelogId);

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.CHANGELOGS.UPDATED,
    });
  },

  DELETE: async ({ formData, api, workspaceId }: ActionContextParams) => {
    const changelogId = formData.get("changelogId")?.toString();

    if (!changelogId) {
      throw new Error("Changelog ID is required for DELETE requests");
    }

    await deleteChangelog(api, workspaceId, changelogId);

    invalidateChangelogCache(null);

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.CHANGELOGS.DELETED,
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
    console.error(`Changelog operation (${request.method}) failed:`, err);

    const errorMessages: Record<string, string> = {
      POST: MESSAGES.CHANGELOGS.CREATION_ERROR,
      PATCH: MESSAGES.CHANGELOGS.UPDATE_ERROR,
      DELETE: MESSAGES.CHANGELOGS.DELETION_ERROR,
    };

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: errorMessages[request.method] || MESSAGES.GENERAL.ERROR,
    });
  }
}
