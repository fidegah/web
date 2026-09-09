import { data, Link } from "react-router";
import { ChevronLeft, Plus, LayoutGrid, Globe } from "lucide-react";
import { ERROR_CODE } from "~/constants/errors";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import type { Route } from "./+types/workspaces";
import { SEO_CONFIG } from "~/constants/seo";
import { getWorkspaces } from "~/services/workspace.service";
import { apiClientContext } from "~/context";
import { authMiddleware } from "~/middleware/auth.server";

export function meta() {
  const config = SEO_CONFIG.chooseWorkspace;

  return [
    { title: config.title },
    { name: "description", content: config.description },
    { name: "robots", content: config.robots },
  ];
}

export const middleware = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);

  try {
    const workspaces = await getWorkspaces(api);

    return { workspaces };
  } catch (error) {
    console.error("Failed to fetch workspaces list from API:", error);

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export default function ChooseWorkspace({ loaderData }: Route.ComponentProps) {
  const { workspaces } = loaderData;

  return (
    <div
      className="w-full h-screen flex justify-center items-center bg-zinc-50/50 dark:bg-zinc-950 p-4"
      dir="rtl"
    >
      <div className="w-full md:w-1/2 xl:w-xl flex flex-col items-center text-center h-full md:h-fit">
        <div className="size-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-zinc-50 dark:text-zinc-900 shadow-sm mb-4">
          <LayoutGrid className="size-5" />
        </div>
        <h1 className="text-lg md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          انتخاب فضای کاری
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">
          لطفاً برای ورود به داشبورد یکی از فضاهای کاری خود را انتخاب کنید.
        </p>

        <Card className="mt-6 w-full border-zinc-200 dark:border-zinc-800 bg-background shadow-xl shadow-zinc-200/20 dark:shadow-none overflow-hidden rounded-2xl">
          <CardContent className="w-full p-4 flex flex-col gap-2 max-h-70 overflow-y-auto custom-scrollbar">
            {workspaces?.map((space) => {
              return (
                <a
                  key={space.id}
                  href={
                    globalThis.window === undefined
                      ? "#"
                      : `${globalThis.window.location.protocol}//${space.subdomain}.${globalThis.window.location.host
                          .replace(/^www\./, "")
                          .split(".")
                          .slice(-2)
                          .join(".")}/dashboard`
                  }
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3.5 rounded-xl border border-zinc-100 dark:border-zinc-800/60 bg-background hover:bg-zinc-50 dark:hover:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 cursor-pointer text-right"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 rounded-xl border border-zinc-200 dark:border-zinc-800">
                      <AvatarFallback className="rounded-xl font-bold text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {space.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-sm text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-zinc-50 transition-colors">
                        {space.name}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                        <Globe className="w-3.5 h-3.5" />
                        <span className="translate-y-px font-mono">
                          {space.subdomain}.{import.meta.env.VITE_APP_DOMAIN}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-50 transition-all duration-200 transform group-hover:-translate-x-1">
                    <ChevronLeft className="w-4 h-4" />
                  </div>
                </a>
              );
            })}
          </CardContent>

          <div className="px-5 py-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col gap-4 md:gap-0 md:flex-row items-center justify-between">
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              فضای کاری دیگری مد نظر دارید؟
            </span>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-8 rounded-xl border-zinc-200 text-zinc-700 dark:text-zinc-300 dark:border-zinc-800 hover:bg-background gap-1.5 shadow-sm text-xs"
            >
              <Link to="/dashboard/settings/workspaces">
                <Plus className="size-3.5" />
                ساخت فضای کاری جدید
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
