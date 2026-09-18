import type { MiddlewareFunction } from "react-router";

import { apiClientContext } from "~/context";
import { createApiClient } from "~/lib/api/index.server";

export const sdkMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const url = new URL(request.url);

  const sessionId =
    url.searchParams.get("sessionId") ?? request.headers.get("x-session-id");

  const sdkToken =
    url.searchParams.get("sdkToken") ?? request.headers.get("x-sdk-token");

  const headers = new Headers(request.headers);

  if (sessionId) {
    headers.set("x-session-id", sessionId);
  }

  if (sdkToken) {
    headers.set("x-sdk-token", sdkToken);
  }

  const modifiedRequest = new Request(request, {
    headers,
    // @ts-expect-error duplex required for cloning requests with body in Node.js
    duplex: "half",
  });

  const apiClient = createApiClient(null, modifiedRequest);

  context.set(apiClientContext, apiClient);

  return next();
};
