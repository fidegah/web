import {
  Book,
  Eye,
  Home,
  KeyRound,
  LayoutGrid,
  ListChecks,
  Map,
  Megaphone,
  MessageCircle,
  MessageCirclePlus,
  Newspaper,
  Settings,
  UsersRound,
} from "lucide-react";
import { Link, useMatch } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/animate-ui/radix/sidebar";
import { sidebarMenuButtonClassName } from "~/lib/utils";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/animate-ui/radix/dropdown-menu";
import ToggleTheme from "../toggle-theme";
import type { User, Workspace } from "~/types";
import WorkspacesDropdown from "../dropdowns/workspaces-dropdown";
import SignOutDropdownItem from "../dropdowns/sign-out-dropdown-item";
import UserDropdown from "../dropdowns/user-dropdown";

const sidebarSections = [
  {
    label: "مسیرها",
    items: [
      { title: "خانه", url: "/", icon: Home },
      { title: "بازخورد", url: "feedback", icon: MessageCircle },
      { title: "نقشه‌راه", url: "roadmaps", icon: Map },
      { title: "کاربران", url: "users", icon: UsersRound },
      { title: "گزارش تغییرات", url: "changelogs", icon: Megaphone },
      { title: "نظرسنجی ها", url: "polls", icon: ListChecks },
    ],
  },
  {
    label: "ابزارها و منابع",
    items: [
      { title: "تنظیمات", url: "settings/account", icon: Settings },
      { title: "اخبار و اطلاعیه‌ها", url: "announcements", icon: Newspaper },
      { title: "نمای عمومی", url: "./", icon: Eye },
    ],
  },
  {
    label: "وب سرویس",
    items: [
      {
        title: "کلید API",
        url: "api-key",
        icon: KeyRound,
      },
      { title: "مستندات", url: "web-service/docs/api", icon: Book },
    ],
  },
  {
    label: "راهنما و پشتیبانی",
    items: [{ title: "ارسال تیکت", url: "ticket", icon: MessageCirclePlus }],
  },
];

interface MenuItemProps {
  url: string;
  label: string;
  icon: React.ElementType;
}

const MenuItem = ({ url, label, icon: Icon }: MenuItemProps) => {
  const { setOpenMobile } = useSidebar();
  const match = useMatch(
    url.includes("/") ? `/dashboard/${url}` : `/dashboard/${url}/*`,
  );

  const isActive = !!match;

  const path = url.startsWith("./") ? url : `/dashboard/${url}`;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className={sidebarMenuButtonClassName({
          isActive,
        })}
        onClick={() => setOpenMobile(false)}
      >
        <Link to={path}>
          <span className="text-[14.5px] md:text-[14.8px] cursor-pointer">
            {label}
          </span>
          <Icon className="size-5!" />
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

interface AppSidebarProps {
  user: User | null | undefined;
  workspaces: Workspace[];
}

export function AppSidebar({ user, workspaces }: Readonly<AppSidebarProps>) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center w-full justify-center pt-2 pb-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-center justify-center gap-0.5 pb-2 overflow-hidden -m-2">
              <img
                src="/logos/fidegah_logo_text.webp"
                alt="FideGah Logo"
                className="w-auto h-8 object-contain"
              />
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                نرم‌افزار مدیریت بازخورد و ارتباط با مشتریان
              </span>
            </div>
          </div>
          {sidebarSections.map((section) => (
            <div key={section.label}>
              <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <MenuItem
                      key={item.url}
                      url={item.url}
                      label={item.title}
                      icon={item.icon}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </div>
          ))}
        </SidebarGroup>
      </SidebarContent>

      {user && (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem className="mt-3">
              <UserDropdown user={user}>
                <DropdownMenuGroup>
                  <div className="hidden md:flex w-full justify-between p-2">
                    <span className="text-sm">حالت تاریک</span>
                    <ToggleTheme />
                  </div>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link
                      to="/dashboard/settings/workspaces"
                      className="w-full flex items-center justify-between"
                    >
                      <span>ایجاد فضای کاری جدید</span>
                      <LayoutGrid />
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <WorkspacesDropdown workspaces={workspaces} />
                  <DropdownMenuSeparator />
                  <SignOutDropdownItem />
                </DropdownMenuGroup>
              </UserDropdown>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
