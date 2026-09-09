import { z } from "zod";
import { apiClientContext, type ApiClient } from "~/context";
import { createResponse } from "~/lib/create-response";
import { getZodErrorMessages } from "~/lib/utils";
import { invalidateAnnouncementCache } from "~/lib/cache.utils.server";
import { markAnnouncementAsViewed } from "~/services/announcement.service";
import type { Route } from "./+types/view";

const MarkAnnouncementAsViewedSchema = z.object({
  announcementId: z.string().min(1, "Announcement ID is required"),
});

type ActionContextParams = {
  formData: FormData;
  api: ApiClient;
};

const actionHandlers = {
  POST: async ({ formData, api }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = MarkAnnouncementAsViewedSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    const { announcementId } = result.data;

    await markAnnouncementAsViewed(api, announcementId);

    invalidateAnnouncementCache(null);

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
    });
  }

  try {
    const formData = await request.formData();

    return await handler({
      formData,
      api,
    });
  } catch (error) {
    console.error(
      `Announcement mark viewed operation (${request.method}) failed:`,
      error,
    );

    return createResponse({
      status: "ERR",
    });
  }
}
