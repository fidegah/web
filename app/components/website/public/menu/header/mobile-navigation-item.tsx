import type { LucideIcon } from "lucide-react";
import { Link, useMatch } from "react-router";
import { SidebarMenuButton } from "~/components/ui/animate-ui/radix/sidebar";
import { sidebarMenuButtonClassName } from "~/lib/utils";

interface MobileNavigationItemProps {
  path: {
    title: string;
    url: string;
    icon: LucideIcon;
  };
  onClose: () => void;
}

export default function MobileNavigationItem({
  path,
  onClose,
}: Readonly<MobileNavigationItemProps>) {
  const Icon = path.icon;
  const isExternal = path.url.startsWith("http");

  const match = useMatch({ path: isExternal ? "" : path.url, end: true });
  const isActive = !isExternal && !!match;

  const content = (
    <>
      <span>{path.title}</span>
      <Icon
        className={`size-5 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-400"}`}
      />
    </>
  );

  return (
    <SidebarMenuButton
      onClick={onClose}
      className={`${sidebarMenuButtonClassName({ isActive })} rounded-xl p-4 text-right`}
    >
      {isExternal ? (
        <a
          href={path.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full justify-between items-center text-base font-medium"
        >
          {content}
        </a>
      ) : (
        <Link
          to={path.url}
          className="flex w-full justify-between items-center text-base font-medium"
        >
          {content}
        </Link>
      )}
    </SidebarMenuButton>
  );
}
