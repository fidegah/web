import type { Route } from "./+types";
import { z } from "zod";
import { redirect, replace } from "react-router";
import { apiClientContext, type ApiClient } from "~/context";
import { MESSAGES } from "~/constants/messages";
import { createResponse } from "~/lib/create-response";
import { getZodErrorMessages } from "~/lib/utils";
import { roadmapSchema } from "~/schemas/dashboard/roadmap";
import { invalidateRoadmapCache } from "~/lib/cache.utils.server";
import {
  createRoadmap,
  deleteRoadmap,
  updateRoadmap,
} from "~/services/roadmap.service";
import { getCurrentWorkspace } from "~/services/workspace.service";

const UpdateRoadmapSchema = roadmapSchema.extend({
  roadmapId: z.string().min(1, "Roadmap ID is required"),
});

const DeleteRoadmapSchema = z.object({
  roadmapId: z.string().min(1, "Roadmap ID is required"),
});

type ActionContextParams = {
  formData: FormData;
  api: ApiClient;
  workspaceId: string;
};

const actionHandlers = {
  POST: async ({ formData, api, workspaceId }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = roadmapSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    const { name } = result.data;
    const newRoadmap = await createRoadmap(api, workspaceId, { name });

    invalidateRoadmapCache(null);

    return redirect(`/dashboard/roadmaps/${newRoadmap.id}`);
  },

  PATCH: async ({ formData, api, workspaceId }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = UpdateRoadmapSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    const { roadmapId, name } = result.data;

    await updateRoadmap(api, workspaceId, roadmapId, { name });

    invalidateRoadmapCache(roadmapId);

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.ROADMAPS.UPDATED,
    });
  },

  DELETE: async ({ formData, api, workspaceId }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = DeleteRoadmapSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        showAlert: true,
        message: getZodErrorMessages(result.error),
      });
    }

    const { roadmapId } = result.data;

    await deleteRoadmap(api, workspaceId, roadmapId);

    invalidateRoadmapCache(roadmapId);

    return replace("/dashboard/roadmaps");
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
    console.error(`Roadmap operation (${request.method}) failed:`, err);

    const errorMessages: Record<string, string> = {
      POST: MESSAGES.ROADMAPS.CREATION_ERROR,
      PATCH: MESSAGES.ROADMAPS.UPDATE_ERROR,
      DELETE: MESSAGES.ROADMAPS.DELETION_ERROR,
    };

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: errorMessages[request.method] || MESSAGES.GENERAL.ERROR,
    });
  }
}
