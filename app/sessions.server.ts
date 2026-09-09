import { createCookieSessionStorage } from "react-router";

type SessionData = {
  accessToken: string;
  refreshToken: string;
  authStage: "portal_only" | "completed";
};

const isProduction = process.env.NODE_ENV === "production";
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret && isProduction) {
  throw new Error("SESSION_SECRET must be set in production environment");
}

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData>({
    cookie: {
      name: "__auth",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      domain: `.${process.env.VITE_APP_DOMAIN}`,
      secrets: [sessionSecret || "dev-secret-key"],
    },
  });
