import type { Route } from "./+types/factors";
import { z } from "zod";
import { apiClientContext, type ApiClient } from "~/context";
import { MESSAGES } from "~/constants/messages";
import { createResponse } from "~/lib/create-response";
import { getZodErrorMessages } from "~/lib/utils";
import { invalidateRoadmapItemsCache } from "~/lib/cache.utils.server";
import {
  createRoadmapFactor,
  deleteRoadmapFactor,
  updateRoadmapFactor,
} from "~/services/roadmap.service";
import { getCurrentWorkspace } from "~/services/workspace.service";

const CreateFactorSchema = z.object({
  roadmapId: z.string().min(1, "Roadmap ID is required"),
  name: z.string().min(1, "Name is required"),
  source: z.string().min(1, "Source is required"),
  type: z.string().optional(),
  metric: z.string().optional(),
  weight: z.coerce.number(),
  isEffort: z.preprocess((val) => val === "true" || val === true, z.boolean()),
});

const UpdateFactorSchema = z.object({
  factorId: z.string().min(1, "Factor ID is required"),
  weight: z.coerce.number().optional(),
});

const DeleteFactorSchema = z.object({
  factorId: z.string().min(1, "Factor ID is required"),
});

type ActionContextParams = {
  formData: FormData;
  api: ApiClient;
  workspaceId: string;
};

const actionHandlers = {
  POST: async ({ formData, api, workspaceId }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = CreateFactorSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        showAlert: true,
        message: getZodErrorMessages(result.error),
      });
    }

    const { roadmapId, name, source, type, metric, weight, isEffort } =
      result.data;

    const newFactor = await createRoadmapFactor(api, workspaceId, roadmapId, {
      name,
      source,
      type: source === "custom" ? type : undefined,
      metric: source === "built_in" ? metric : undefined,
      weight,
      isEffort,
    });

    invalidateRoadmapItemsCache(null);

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.ROADMAPS.FACTOR_CREATE_SUCCESS,
      data: newFactor,
    });
  },

  PATCH: async ({ formData, api, workspaceId }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = UpdateFactorSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        showAlert: true,
        message: getZodErrorMessages(result.error),
      });
    }

    const { factorId, weight } = result.data;

    if (weight === undefined) {
      return createResponse({
        status: "ERR",
        showAlert: true,
        message: MESSAGES.VALIDATION.ERROR,
      });
    }

    const factor = await updateRoadmapFactor(api, workspaceId, factorId, {
      weight,
    });

    invalidateRoadmapItemsCache(null);

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.ROADMAPS.FACTOR_UPDATE_SUCCESS,
      data: factor,
    });
  },

  DELETE: async ({ formData, api, workspaceId }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = DeleteFactorSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        showAlert: true,
        message: getZodErrorMessages(result.error),
      });
    }

    const { factorId } = result.data;

    await deleteRoadmapFactor(api, workspaceId, factorId);

    invalidateRoadmapItemsCache(null);

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.ROADMAPS.FACTOR_DELETE_SUCCESS,
      data: { id: factorId },
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
    console.error(`Roadmap factors operation (${request.method}) failed:`, err);

    const errorMessages: Record<string, string> = {
      POST: MESSAGES.ROADMAPS.FACTOR_CREATE_ERROR,
      PATCH: MESSAGES.ROADMAPS.FACTOR_UPDATE_ERROR,
      DELETE: MESSAGES.ROADMAPS.FACTOR_DELETE_ERROR,
    };

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: errorMessages[request.method] || MESSAGES.GENERAL.ERROR,
    });
  }
}
