import { data, Outlet } from "react-router";
import { SidebarProvider } from "~/components/ui/animate-ui/radix/sidebar";
import type { Route } from "./+types/website-layout";
import { cn, getSubdomain } from "~/lib/utils";
import PortalMenu from "~/components/website/portal/menu";
import { ERROR_CODE } from "~/constants/errors";
import PublicHeaderMenu from "~/components/website/public/menu/header";
import PublicFooterMenu from "~/components/website/public/menu/footer";
import {
  OtpAuthDialogProvider,
  useOtpAuthDialog,
} from "~/contexts/otp-auth-dialog-context";
import OtpAuthDialog from "~/components/auth/otp/auth-dialog";
import { getWorkspaces } from "~/services/workspace.service";
import { getCurrentUser } from "~/services/user.service";
import { getNotifications } from "~/services/notification.service";
import { apiClientContext } from "~/context";
import { isAuthenticated } from "~/lib/auth-utils.server";
import { optionalAuthMiddleware } from "~/middleware/optional-auth.server";
import { getPortalCurrentWorkspace } from "~/services/portal.service";

export const middleware = [optionalAuthMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);
  const isSubdomainExists = !!getSubdomain(request);
  const url = new URL(request.url);

  const portalPaths = ["feedback", "changelogs", "polls"];

  if (!isSubdomainExists) {
    const path = url.pathname.split("/")[1];

    if (portalPaths.includes(path)) {
      throw data(null, { status: 404 });
    }

    return {
      user: null,
      workspace: null,
      workspaces: null,
      notifications: null,
      isSubdomainExists: false,
      isAuthenticated: false,
    };
  }

  const isAuth = await isAuthenticated(request);

  try {
    const workspace = await getPortalCurrentWorkspace(api);

    if (isAuth) {
      // const workspaceMember = await getPortalWorkspaceMembership(api);

      // if (workspaceMember.isBanned) {
      //   throw data(null, {
      //     status: 403,
      //     statusText: ERROR_CODE.PORTAL_HOME.USER_BANNED,
      //   });
      // }

      const [user, workspaces, notifications] = await Promise.all([
        getCurrentUser(api),
        getWorkspaces(api),
        getNotifications(api, workspace.id),
      ]);

      return {
        user,
        workspace,
        workspaces,
        notifications,
        isSubdomainExists: true,
        isAuthenticated: true,
      };
    }

    return {
      user: null,
      workspace,
      workspaces: null,
      notifications: null,
      isSubdomainExists: true,
      isAuthenticated: false,
    };
  } catch (error) {
    console.error("Failed to fetch portal layout core data:", error);

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export default function WebsiteLayout({ loaderData }: Route.ComponentProps) {
  const { isSubdomainExists, user } = loaderData ?? {};

  return (
    <SidebarProvider>
      <OtpAuthDialogProvider user={user}>
        {isSubdomainExists && loaderData?.workspace && (
          <PortalMenu
            user={loaderData.user ?? null}
            workspaceName={loaderData.workspace.name}
            workspaces={loaderData.workspaces}
            notifications={loaderData.notifications}
          />
        )}

        {!isSubdomainExists && <PublicHeaderMenu />}

        <main
          className={cn(
            "w-full h-screen flex flex-col",
            isSubdomainExists
              ? "h-[calc(100vh-64px)] md:h-[calc(100vh-88px)] mt-16 md:mt-22"
              : "h-screen dark:bg-black",
          )}
        >
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <Outlet />
            {!isSubdomainExists && <PublicFooterMenu />}
          </div>
        </main>

        {isSubdomainExists && <OtpAuthDialog />}
      </OtpAuthDialogProvider>
    </SidebarProvider>
  );
}
