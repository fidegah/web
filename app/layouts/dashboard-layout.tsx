import { data, Outlet, redirect, replace } from "react-router";

import { SidebarProvider } from "~/components/ui/animate-ui/radix/sidebar";
import { AppSidebar } from "~/components/dashboard/app-sidebar";
import MobileMenu from "~/components/dashboard/mobile-menu";

import type { Route } from "./+types/dashboard-layout";
import type { User, Workspace, WorkspaceUser } from "~/types";

import { ERROR_CODE } from "~/constants/errors";
import { getSubdomain } from "~/lib/utils";
import { getWorkspaceUrl } from "~/lib/get-workspace-url.server";
import { getSession } from "~/sessions.server";

import {
  getCurrentWorkspace,
  getWorkspaceMembership,
  getWorkspaces,
} from "~/services/workspace.service";
import { getCurrentUser } from "~/services/user.service";
import { authMiddleware } from "~/middleware/auth.server";
import { apiClientContext } from "~/context";

export function meta() {
  return [{ name: "robots", content: "noindex, nofollow" }];
}

export const middleware = [authMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);
  const subdomain = getSubdomain(request);

  const session = await getSession(request.headers.get("Cookie"));
  if (session.get("authStage") === "portal_only") {
    return redirect("/auth/login");
  }

  let workspaces: Workspace[];

  try {
    workspaces = await getWorkspaces(api);
  } catch (error: unknown) {
    if (error instanceof Response && error.status === 401) {
      return redirect("/auth/login");
    }

    console.error("Workspaces Fetch Error:", error);

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }

  if (!subdomain) {
    if (workspaces.length === 1) {
      return replace(getWorkspaceUrl(workspaces[0].subdomain, request));
    }

    if (workspaces.length > 1) {
      return redirect("/workspaces");
    }

    return redirect("/onboarding");
  }

  const hasAccess = workspaces.some(
    (workspace) => workspace.subdomain === subdomain,
  );

  if (!hasAccess) {
    throw data(null, { status: 403 });
  }

  let workspace: Workspace;
  let user: User;
  let membership: WorkspaceUser;

  try {
    [workspace, user] = await Promise.all([
      getCurrentWorkspace(api),
      getCurrentUser(api),
    ]);

    membership = await getWorkspaceMembership(api, workspace.id);
  } catch (error: unknown) {
    if (error instanceof Response && error.status === 401) {
      return redirect("/auth/login");
    }

    console.error("Dashboard Data Fetch Error:", error);

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }

  const allowedRoles = ["owner", "admin"];

  if (membership.isBanned || !allowedRoles.includes(membership.role)) {
    throw data(null, { status: 403 });
  }

  return {
    workspaces,
    user,
  };
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  const { workspaces, user } = loaderData;

  return (
    <SidebarProvider>
      <AppSidebar user={user} workspaces={workspaces} />

      <MobileMenu />

      <div className="w-full overflow-y-auto custom-scrollbar mt-18 md:mt-0 h-[calc(100vh-72px)] md:h-screen">
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
