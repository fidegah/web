import { Outlet, replace } from "react-router";
import { Card } from "~/components/ui/card";
import type { Route } from "./+types/auth-layout";
import { getSession } from "~/sessions.server";

export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const session = await getSession(cookieHeader);

  const accessToken = session.get("accessToken");
  const refreshToken = session.get("refreshToken");
  const authStage = session.get("authStage");

  if (accessToken && refreshToken && authStage === "completed") {
    return replace("/dashboard");
  }

  const currentUrl = new URL(request.url);
  const hostParts = currentUrl.hostname.split(".");

  if (hostParts.length > 2) {
    hostParts.shift();
    const mainHostname = hostParts.join(".");

    const targetUrl = `${currentUrl.protocol}//${mainHostname}${currentUrl.port ? ":" + currentUrl.port : ""}${currentUrl.pathname}${currentUrl.search}`;

    return replace(targetUrl);
  }

  return {};
}

export default function AuthLayout() {
  return (
    <div className="w-full h-screen overflow-y-hidden flex justify-center items-center">
      <div className="absolute top-0 left-0 p-6">
        <img
          src="/logo/fidegah_logo_text.webp"
          alt="Fidegah Logo"
          className="w-auto h-8 md:h-10"
        />
      </div>
      <div className="hidden md:block pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <Card className="w-full md:w-lg lg-w-xl xl:w-2xl max-h-full md:max-h-[95%] overflow-y-auto border-0 md:border rounded-none md:rounded-md md:h-auto backdrop-blur-3xl bg-transparent custom-scrollbar">
        <Outlet />
      </Card>
    </div>
  );
}
