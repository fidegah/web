import {
  Code,
  Folders,
  FolderTree,
  LayoutGrid,
  ShieldCheck,
  Tags,
  UserRoundPen,
} from "lucide-react";
import { Activity } from "react";
import { Link, useLocation } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/animate-ui/radix/sidebar";

interface SidebarItem {
  path: string;
  label: string;
  icon: React.ElementType;
  subItems?: {
    path: string;
    label: string;
    icon: React.ElementType;
  }[];
}

interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

type SidebarPaths = SidebarSection[];

const sidebarPaths: SidebarPaths = [
  {
    label: "حساب کاربری",
    items: [
      {
        path: "account",
        label: "ویرایش اطلاعات کاربری",
        icon: UserRoundPen,
      },
    ],
  },
  {
    label: "فضاهای کاری",
    items: [
      {
        path: "workspaces",
        label: "مدیریت فضاهای کاری",
        icon: LayoutGrid,
      },
      {
        path: "workspaces/sdk",
        label: "تنطیمات SDK",
        icon: Code,
        subItems: [
          {
            path: "enforce-secure-identify",
            label: "شناسایی امن",
            icon: ShieldCheck,
          },
        ],
      },
    ],
  },
  {
    label: "بخش ها",
    items: [
      {
        path: "boards",
        label: "مدیریت بخش‌ها",
        icon: FolderTree,
        subItems: [
          {
            path: "categories",
            label: "دسته‌بندی‌ها",
            icon: Folders,
          },
          {
            path: "tags",
            label: "تگ‌ها",
            icon: Tags,
          },
        ],
      },
    ],
  },
];

export default function SettingSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Sidebar className="w-full">
      <SidebarContent className="bg-background pt-4">
        {sidebarPaths.map((section) => (
          <SidebarGroup key={section.label} className="py-1">
            <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground/70 mb-1.5 h-auto pb-0">
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const baseParentPath = `/dashboard/settings/${item.path}`;
                  const hasSubItems = !!item.subItems?.length;

                  const isParentActive = hasSubItems
                    ? currentPath.includes(baseParentPath)
                    : currentPath === baseParentPath;

                  return (
                    <SidebarMenuItem
                      key={item.path}
                      className="flex flex-col gap-1"
                    >
                      <SidebarMenuButton asChild>
                        <Link
                          to={baseParentPath}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                            isParentActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "hover:bg-muted text-foreground/80"
                          }`}
                        >
                          <Icon className="size-4" />
                          <span className="text-sm line-clamp-1">
                            {item.label}
                          </span>
                        </Link>
                      </SidebarMenuButton>

                      <Activity
                        mode={
                          hasSubItems && item.subItems ? "visible" : "hidden"
                        }
                      >
                        <div className="mr-4 pr-2 border-r border-border/60 flex flex-col gap-1 mt-0.5">
                          {item.subItems?.map((subItem) => {
                            const SubIcon = subItem.icon;

                            const isSubActive = currentPath.includes(
                              `/${subItem.path}`,
                            );

                            return (
                              <SidebarMenuButton key={subItem.path} asChild>
                                <Link
                                  to={`${baseParentPath}/${subItem.path}`}
                                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors duration-200 ${
                                    isSubActive
                                      ? "bg-muted text-foreground font-semibold"
                                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                  }`}
                                >
                                  <SubIcon className="size-3.5" />
                                  <span className="text-xs line-clamp-1">
                                    {subItem.label}
                                  </span>
                                </Link>
                              </SidebarMenuButton>
                            );
                          })}
                        </div>
                      </Activity>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
