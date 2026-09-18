import type { MiddlewareFunction } from "react-router";
import { getSession } from "~/sessions.server";
import { apiClientContext } from "~/context";
import { createApiClient } from "~/lib/api/index.server";
import { isTokenExpired, refreshSession } from "~/lib/auth-utils.server";

export const optionalAuthMiddleware: MiddlewareFunction = async (
  { request, context, url },
  next,
) => {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  let accessToken = session.get("accessToken") as string | undefined;
  let newCookieHeader: string | null = null;

  if (accessToken) {
    if (isTokenExpired(accessToken)) {
      const refreshResult = await refreshSession(cookieHeader);

      if (refreshResult) {
        accessToken = refreshResult.accessToken;
        newCookieHeader = refreshResult.cookieHeader;
      } else {
        accessToken = undefined;
      }
    }
  }

  const apiClient = createApiClient(accessToken ?? null, request, url);
  context.set(apiClientContext, apiClient);

  const response = (await next()) as Response;

  if (newCookieHeader) {
    response.headers.append("Set-Cookie", newCookieHeader);
  }

  return response;
};
