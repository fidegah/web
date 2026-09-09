import type { Route } from "./+types/verify";
import { getZodErrorMessages } from "~/lib/utils";
import { verifyOtpSchema } from "~/schemas/auth.schema";
import { createResponse } from "~/lib/create-response";
import { commitSession, getSession } from "~/sessions.server";
import { MESSAGES } from "~/constants/messages";
import { verifyOtp } from "~/services/auth.service";
import { api } from "~/lib/api/client";
import { apiRoutes } from "~/lib/api/routes";
import type { User } from "~/types";

type ActionParams = {
  request: Request;
  formData: FormData;
};

const actionHandlers = {
  POST: async ({ request, formData }: ActionParams) => {
    const rawPayload = Object.fromEntries(formData);
    const result = verifyOtpSchema.safeParse(rawPayload);

    if (!result.success) {
      return createResponse({
        status: "ERR",
        message: getZodErrorMessages(result.error),
      });
    }

    const tokens = await verifyOtp({
      email: result.data.email,
      code: result.data.code,
    });

    const { accessToken, refreshToken } = tokens;

    const session = await getSession(request.headers.get("Cookie"));
    session.set("accessToken", accessToken);
    session.set("refreshToken", refreshToken);
    session.set("authStage", "portal_only");

    const user = await api.get<User>(apiRoutes.users.me, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const isNewUser = !user.data.fullName;

    return createResponse({
      status: "OK",
      data: { isNewUser },
      headers: {
        "Set-Cookie": await commitSession(session),
      },
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
    return await handler({ request, formData });
  } catch (err) {
    console.error(`Verify OTP operation (${request.method}) failed:`, err);

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: MESSAGES.GENERAL.ERROR,
    });
  }
}
