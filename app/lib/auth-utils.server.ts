import { commitSession, getSession } from "~/sessions.server";
import { api } from "~/lib/api/client";
import { apiRoutes } from "~/lib/api/routes";
import type { AuthTokens } from "~/types";

export interface RefreshResult {
  accessToken: string;
  cookieHeader: string;
}

const pendingRefreshes = new Map<string, Promise<RefreshResult | null>>();

export const isTokenExpired = (token: string | null | undefined): boolean => {
  if (!token) return true;

  try {
    const [, payloadBase64] = token.split(".");
    if (!payloadBase64) return true;

    const payloadJson = atob(
      payloadBase64.replace(/-/g, "+").replace(/_/g, "/"),
    );
    const payload = JSON.parse(payloadJson) as { exp?: number };

    if (!payload.exp) return false;

    return Date.now() >= payload.exp * 1000 - 10000;
  } catch {
    return true;
  }
};

export const refreshSession = async (
  cookieHeader: string | null | undefined,
): Promise<RefreshResult | null> => {
  const session = await getSession(cookieHeader);
  const refreshToken = session.get("refreshToken") as string | undefined;

  if (!refreshToken) {
    return null;
  }

  const existingPromise = pendingRefreshes.get(refreshToken);
  if (existingPromise) {
    return existingPromise;
  }

  const refreshPromise = (async (): Promise<RefreshResult | null> => {
    try {
      const { data } = await api.post<AuthTokens>(apiRoutes.auth.refresh, {
        refreshToken,
      });

      session.set("accessToken", data.accessToken);
      session.set("refreshToken", data.refreshToken);

      const newCookieHeader = await commitSession(session);

      return {
        accessToken: data.accessToken,
        cookieHeader: newCookieHeader,
      };
    } catch (error) {
      console.error("Refresh token request failed:", error);
      return null;
    } finally {
      pendingRefreshes.delete(refreshToken);
    }
  })();

  pendingRefreshes.set(refreshToken, refreshPromise);
  return refreshPromise;
};

export async function isAuthenticated(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);
  const accessToken = session.get("accessToken") as string | undefined;

  if (!accessToken) {
    return false;
  }

  return !isTokenExpired(accessToken);
}
