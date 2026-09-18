import type { Route } from "./+types/send";
import { sendOtpSchema } from "~/schemas/auth.schema";
import { createResponse } from "~/lib/create-response";
import { getZodErrorMessages } from "~/lib/utils";
import { MESSAGES } from "~/constants/messages";
import { sendOtp } from "~/services/auth.service";
import { getErrorMessage } from "~/lib/get-error-message";

type ActionParams = {
  formData: FormData;
};

const actionHandlers = {
  POST: async ({ formData }: ActionParams) => {
    const payload = Object.fromEntries(formData);
    const result = sendOtpSchema.safeParse(payload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    await sendOtp({
      email: result.data.email,
    });

    return createResponse({
      status: "OK",
    });
  },
};

export async function action({ request }: Route.ActionArgs) {
  const method = request.method as keyof typeof actionHandlers;
  const handler = actionHandlers[method];

  if (!handler) {
    return createResponse({
      status: "ERR",
      message: MESSAGES.GENERAL.ERROR,
    });
  }

  try {
    const formData = await request.formData();
    return await handler({ formData });
  } catch (err) {
    console.error(`Auth operation (${request.method}) failed:`, err);

    return createResponse({
      status: "ERR",
      message: getErrorMessage(err),
    });
  }
}
