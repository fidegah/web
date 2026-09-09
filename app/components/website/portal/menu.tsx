import {
  BookOpen,
  ListChecks,
  Megaphone,
  MenuIcon,
  MessageCircle,
  Sparkles,
  X,
} from "lucide-react";
import { useState, useEffect, Activity } from "react";
import { Link, useLocation } from "react-router";
import { RippleButton } from "~/components/ui/animate-ui/buttons/ripple";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/animate-ui/radix/dropdown-menu";
import { MobileSidebar } from "~/components/ui/animate-ui/radix/mobile-sidebar";
import { SidebarMenuButton } from "~/components/ui/animate-ui/radix/sidebar";
import ToggleTheme from "~/components/toggle-theme";
import MenuIconButton from "~/components/ui/menu-icon-button";
import WorkspaceDropdown from "~/components/dropdowns/workspaces-dropdown";
import { cn, getInitials, sidebarMenuButtonClassName } from "~/lib/utils";
import type { Notification, Paginated, User, Workspace } from "~/types";
import UserDropdown from "~/components/dropdowns/user-dropdown";
import NotificationDropdown from "~/components/dropdowns/notification/notification-dropdown";
import SignOutDropdownItem from "~/components/dropdowns/sign-out-dropdown-item";
import { useOtpAuthDialog } from "~/contexts/otp-auth-dialog-context";

const paths = [
  { title: "نقشه راه", url: "/", icon: BookOpen, description: "مسیر پیشرفت" },
  {
    title: "دیدگاه‌ها",
    url: "/feedback/board/",
    icon: MessageCircle,
    description: "نظرات و پیشنهادات",
  },
  {
    title: "گزارش تغییرات",
    url: "/changelogs",
    icon: Megaphone,
    description: "آخرین به‌روزرسانی‌ها",
  },
  {
    title: "نظرسنجی‌ها",
    url: "/polls",
    icon: ListChecks,
    description: "نظر سنجی‌ها",
  },
];

interface PortalMenuProps {
  user: User | null;
  workspaceName: string;
  workspaces: Workspace[] | null;
  notifications: Paginated<Notification[]> | null;
}

export default function PortalMenu({
  user,
  workspaceName,
  workspaces,
  notifications,
}: Readonly<PortalMenuProps>) {
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { openAuthDialog } = useOtpAuthDialog();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActivePage = (url: string) => {
    if (url === "/") return location.pathname === "/";
    return location.pathname.startsWith(url);
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 z-50 w-full p-4 flex items-center justify-between md:hidden transition-all duration-500",
          scrolled
            ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-900 shadow-sm"
            : "bg-transparent",
        )}
      >
        <div className="flex items-center gap-2">
          <MenuIconButton icon={MenuIcon} onClick={() => setIsOpenMenu(true)} />
          <ToggleTheme variant="icon" />
          {notifications && notifications.data.length > 0 && (
            <NotificationDropdown notifications={notifications} />
          )}
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100/60 dark:bg-gray-900/60 backdrop-blur-md">
          <Sparkles className="size-4 text-amber-500 animate-pulse" />
          <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
            {workspaceName}
          </span>
        </div>
      </nav>

      <MobileSidebar
        open={isOpenMenu}
        setOpen={setIsOpenMenu}
        side={"right"}
        containerClassName="w-full max-w-none bg-white dark:bg-gray-950"
        animateOnHover={true}
        transition={{ type: "spring", stiffness: 350, damping: 35 }}
        className="w-full"
      >
        <div
          className="w-full h-screen flex flex-col p-6 justify-between overflow-y-auto"
          dir="rtl"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-900">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50">
                  <Sparkles className="size-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-bold text-base text-gray-900 dark:text-white">
                  {workspaceName}
                </span>
              </div>
              <button
                onClick={() => setIsOpenMenu(false)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-900 hover:scale-105 active:scale-95 transition-transform text-gray-500 dark:text-gray-400"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {paths.map((path) => {
                const isActive = isActivePage(path.url);
                return (
                  <SidebarMenuButton
                    key={path.url}
                    className={cn(
                      sidebarMenuButtonClassName({ isActive }),
                      "transition-all duration-300 hover:-translate-x-1 rounded-xl h-auto p-4",
                      isActive
                        ? "bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold shadow-none"
                        : "hover:bg-gray-50 dark:hover:bg-gray-900/50",
                    )}
                    onClick={() => setIsOpenMenu(false)}
                  >
                    <Link
                      to={path.url}
                      className="flex w-full justify-between items-center"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "p-2 rounded-xl transition-colors",
                            isActive
                              ? "bg-blue-100/50 dark:bg-blue-900/30"
                              : "bg-gray-50 dark:bg-gray-900",
                          )}
                        >
                          <path.icon
                            className={cn(
                              "size-5",
                              isActive
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-500",
                            )}
                          />
                        </div>
                        <div className="flex flex-col items-start gap-0.5">
                          <span className="text-base cursor-pointer">
                            {path.title}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-gray-500 font-normal cursor-pointer">
                            {path.description}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                );
              })}
            </div>
          </div>

          <Activity mode={user?.email ? "visible" : "hidden"}>
            <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-900 mt-auto">
              <UserDropdown user={user!}>
                <div className="w-full">
                  {workspaces && workspaces.length > 0 && (
                    <WorkspaceDropdown workspaces={workspaces} />
                  )}
                  <DropdownMenuSeparator className="my-1" />
                  <SignOutDropdownItem />
                </div>
              </UserDropdown>
            </div>
          </Activity>

          <Activity mode={!user?.email ? "visible" : "hidden"}>
            <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <Button
                onClick={openAuthDialog}
                className="w-full rounded-xl h-11 border border-zinc-300 dark:border-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-500 font-semibold text-sm transition-all duration-200 active:scale-95 cursor-pointer shadow-none"
              >
                ورود / ثبت‌نام
              </Button>
            </div>
          </Activity>
        </div>
      </MobileSidebar>

      <nav
        className={cn(
          "hidden md:flex fixed top-0 z-50 w-full items-center justify-between px-8 lg:px-16 transition-all duration-500",
          scrolled
            ? "py-3 bg-white/60 dark:bg-gray-950/60 backdrop-blur-xl saturate-150 border-b border-gray-200/40 dark:border-gray-800/40 shadow-sm"
            : "py-6 bg-transparent",
        )}
        dir="rtl"
      >
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3 group cursor-pointer select-none">
            <div className="relative p-2 rounded-xl bg-linear-to-tr from-blue-500/10 to-purple-500/10 border border-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="size-5 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform" />
            </div>
            <span className="text-lg font-black bg-linear-to-l from-gray-900 via-gray-800 to-gray-600 dark:from-white dark:via-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
              {workspaceName}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-gray-100/50 dark:bg-gray-900/40 p-1 rounded-full border border-gray-200/20">
            {paths.map((path) => {
              const isActive = isActivePage(path.url);
              return (
                <Link
                  key={path.url}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 group",
                    isActive
                      ? "text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 shadow-sm font-semibold"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
                  )}
                  to={path.url}
                >
                  <div className="flex items-center gap-2 relative z-10">
                    <path.icon
                      className={cn(
                        "size-4 transition-transform duration-300 group-hover:scale-110",
                        isActive
                          ? "text-blue-500"
                          : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300",
                      )}
                    />
                    <span>{path.title}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-gray-100/50 dark:bg-gray-900/50 border border-gray-200/20">
            {notifications && notifications.data.length > 0 && (
              <>
                <NotificationDropdown notifications={notifications} />
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-0.5" />
              </>
            )}
            <ToggleTheme variant="icon" />
          </div>

          <Activity mode={user?.email ? "visible" : "hidden"}>
            <DropdownMenu dir="rtl">
              <DropdownMenuTrigger asChild>
                <RippleButton
                  variant="outline"
                  className="rounded-full size-9 p-0 overflow-hidden hover:scale-105 active:scale-95 transition-all duration-300 border border-gray-200 dark:border-gray-800 focus-visible:ring-1 focus-visible:ring-blue-500"
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="size-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(user?.fullName)}
                    </div>
                  )}
                </RippleButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-900 backdrop-blur-xl bg-white/95 dark:bg-gray-950/95 p-1.5 mt-2"
              >
                <DropdownMenuGroup>
                  <div className="flex items-center gap-3 p-3 mb-1.5 bg-gray-50/50 dark:bg-gray-900/30 rounded-xl">
                    {user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName}
                        className="size-9 rounded-full object-cover border border-gray-200 dark:border-gray-800 shadow-sm"
                      />
                    ) : (
                      <div className="size-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {getInitials(user?.fullName)}
                      </div>
                    )}
                    <div className="flex flex-col truncate">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white truncate text-start">
                        {user?.fullName}
                      </span>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 truncate">
                        {user?.email}
                      </span>
                    </div>
                  </div>
                  {workspaces && workspaces.length > 0 && (
                    <div className="px-1 py-0.5">
                      <WorkspaceDropdown workspaces={workspaces} />
                    </div>
                  )}
                  <DropdownMenuSeparator className="my-1.5 bg-gray-100 dark:bg-gray-900" />
                  <div className="px-1 py-0.5">
                    <SignOutDropdownItem />
                  </div>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </Activity>

          <Activity mode={!user?.email ? "visible" : "hidden"}>
            <Button
              onClick={() => {
                setIsOpenMenu(false);
                openAuthDialog();
              }}
              className="rounded-full px-6 font-semibold text-sm transition-all duration-200 active:scale-95 cursor-pointer border border-zinc-300 dark:border-zinc-700 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-500"
            >
              ورود / ثبت‌نام
            </Button>
          </Activity>
        </div>
      </nav>
    </>
  );
}
