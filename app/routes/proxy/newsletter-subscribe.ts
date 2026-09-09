import type { Route } from "./+types/newsletter-subscribe";
import { z } from "zod";
import { MESSAGES } from "~/constants/messages";
import { createResponse } from "~/lib/create-response";
import { getZodErrorMessages } from "~/lib/utils";
import { subscribeNewsletter } from "~/services/newsletter.service";
import { ApiError } from "~/lib/api/client";

const NewsletterSubscribeSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
});

type ActionContextParams = {
  formData: FormData;
};

const actionHandlers = {
  POST: async ({ formData }: ActionContextParams) => {
    const payload = Object.fromEntries(formData);
    const result = NewsletterSubscribeSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        showAlert: true,
        message: getZodErrorMessages(result.error),
      });
    }

    const { email } = result.data;

    await subscribeNewsletter({ email });

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.NEWSLETTER.SUCCESS,
    });
  },
};

export async function action({ request }: Route.ActionArgs) {
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

    return await handler({ formData });
  } catch (err) {
    console.error(
      `Newsletter subscription operation (${request.method}) failed:`,
      err,
    );

    const errorMessages: Record<string, string> = {
      NEWSLETTER_EMAIL_ALREADY_SUBSCRIBED:
        MESSAGES.NEWSLETTER?.EXISTS_ERROR ?? MESSAGES.GENERAL.ERROR,
      HTTP_429: MESSAGES.GENERAL.TOO_MANY_REQUESTS,
    };

    const message =
      err instanceof ApiError
        ? (errorMessages[err.code] ?? MESSAGES.GENERAL.ERROR)
        : MESSAGES.GENERAL.ERROR;

    return createResponse({
      status: "ERR",
      showAlert: true,
      message,
    });
  }
}
