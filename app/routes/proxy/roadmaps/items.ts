import type { Route } from "./+types/items";
import { z } from "zod";
import { MESSAGES } from "~/constants/messages";
import { createResponse } from "~/lib/create-response";
import { invalidateRoadmapItemsCache } from "~/lib/cache.utils.server";
import {
  createRoadmapItem,
  deleteRoadmapItem,
  updateRoadmapItem,
} from "~/services/roadmap.service";
import { getCurrentWorkspace } from "~/services/workspace.service";
import { apiClientContext, type ApiClient } from "~/context";

const CreateItemSchema = z.object({
  roadmapId: z.string().min(1),
  postId: z.string().min(1),
});

const UpdateItemSchema = z.object({
  itemId: z.string().min(1),
  eta: z.string().optional(),
  factorId: z.string().optional(),
  rawValue: z.string().optional(),
});

const DeleteItemSchema = z.object({
  itemId: z.string().min(1),
});

type UpdatePayload = {
  eta?: string;
  factorValues?: Record<string, string | number | boolean>;
};

function parsePrimitiveValue(value?: string): string | number | boolean | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  const num = Number(trimmed);
  return Number.isFinite(num) ? num : trimmed;
}

type ActionContextParams = {
  formData: FormData;
  api: ApiClient;
  workspaceId: string;
};

const actionHandlers = {
  POST: async ({
    formData,
    api,
    workspaceId,
  }: ActionContextParams): Promise<string> => {
    const { roadmapId, postId } = CreateItemSchema.parse(
      Object.fromEntries(formData),
    );
    await createRoadmapItem(api, workspaceId, roadmapId, { postId });
    invalidateRoadmapItemsCache(null);
    return MESSAGES.ROADMAPS.ITEM_CREATE_SUCCESS;
  },

  PATCH: async ({
    formData,
    api,
    workspaceId,
  }: ActionContextParams): Promise<string> => {
    const { itemId, eta, factorId, rawValue } = UpdateItemSchema.parse(
      Object.fromEntries(formData),
    );
    const processedValue = parsePrimitiveValue(rawValue);

    const payload: UpdatePayload = {};
    if (eta) payload.eta = eta;
    if (factorId && processedValue !== null) {
      payload.factorValues = { [factorId]: processedValue };
    }

    if (eta) {
      return MESSAGES.ROADMAPS.ETA_UPDATE_SUCCESS;
    }

    await updateRoadmapItem(api, workspaceId, itemId, payload);
    invalidateRoadmapItemsCache(itemId);
    return MESSAGES.ROADMAPS.VALUE_UPDATE_SUCCESS;
  },

  DELETE: async ({
    formData,
    api,
    workspaceId,
  }: ActionContextParams): Promise<string> => {
    const { itemId } = DeleteItemSchema.parse(Object.fromEntries(formData));
    await deleteRoadmapItem(api, workspaceId, itemId);
    invalidateRoadmapItemsCache(null);
    return MESSAGES.ROADMAPS.ITEM_DELETE_SUCCESS;
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
    const workspace = await getCurrentWorkspace(api);
    const formData = await request.formData();

    const successMessage = await handler({
      formData,
      api,
      workspaceId: workspace.id,
    });

    return createResponse({
      status: "OK",
      showAlert: true,
      message: successMessage,
    });
  } catch (err) {
    console.error(`Roadmap items operation (${request.method}) failed:`, err);

    const errorMessages: Record<string, string> = {
      POST: MESSAGES.ROADMAPS.ITEM_CREATE_ERROR,
      DELETE: MESSAGES.ROADMAPS.ITEM_DELETE_ERROR,
    };

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: errorMessages[request.method] || MESSAGES.GENERAL.ERROR,
    });
  }
}
