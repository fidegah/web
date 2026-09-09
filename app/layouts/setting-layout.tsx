import { Outlet } from "react-router";
import { SidebarProvider } from "~/components/ui/animate-ui/radix/sidebar";
import SettingSidebar from "~/components/dashboard/settings/setting-sidebar";

export default function SettingsLayout() {
  return (
    <div className="w-full flex">
      <SidebarProvider>
        <div className="w-0 md:w-1/4 lg:w-1/5">
          <SettingSidebar />
        </div>

        <div className="w-full h-screen p-3 overflow-y-auto scrollbar-thin">
          <Outlet />
        </div>
      </SidebarProvider>
    </div>
  );
}
