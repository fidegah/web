import { redirect } from "react-router";
import type { Route } from "./+types/sign-out";
import { MESSAGES } from "~/constants/messages";
import { createResponse } from "~/lib/create-response";
import { destroySession, getSession } from "~/sessions.server";
import { logout } from "~/services/auth.service";

type ActionParams = {
  request: Request;
};

const actionHandlers = {
  POST: async ({ request }: ActionParams) => {
    const cookieHeader = request.headers.get("Cookie");
    const session = await getSession(cookieHeader);
    const refreshToken = session.get("refreshToken");

    if (refreshToken) {
      await logout(refreshToken);
    }

    const currentUrl = new URL(request.url);
    const hostParts = currentUrl.hostname.split(".");

    let mainHostname = currentUrl.hostname;
    if (hostParts.length > 2) {
      hostParts.shift();
      mainHostname = hostParts.join(".");
    }

    const portSuffix = currentUrl.port ? `:${currentUrl.port}` : "";
    const targetUrl = `${currentUrl.protocol}//${mainHostname}${portSuffix}/`;

    return redirect(targetUrl, {
      headers: {
        "Set-Cookie": await destroySession(session),
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
    return await handler({ request });
  } catch (error) {
    console.error("Failed to process sign-out session destruction:", error);

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: MESSAGES.AUTH.LOGOUT_ERROR,
    });
  }
}
