import type { LucideIcon } from "lucide-react";
import { Link, useMatch } from "react-router";

interface DesktopNavigationItemProps {
  path: {
    title: string;
    url: string;
    icon: LucideIcon;
  };
}

export default function DesktopNavigationItem({
  path,
}: Readonly<DesktopNavigationItemProps>) {
  const isExternal = path.url.startsWith("http");
  const match = useMatch({ path: isExternal ? "" : path.url, end: true });
  const isActive = !isExternal && !!match;

  return (
    <li className="relative group py-1">
      {isExternal ? (
        <a
          href={path.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors duration-200"
        >
          {path.title}
        </a>
      ) : (
        <Link
          to={path.url}
          className={`text-base font-medium transition-colors duration-200 ${
            isActive
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : "text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100"
          }`}
        >
          {path.title}
        </Link>
      )}
      <span
        className={`absolute bottom-0 right-0 h-0.5 bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-300 ${
          isActive ? "w-full" : "w-0 group-hover:w-full"
        }`}
      />
    </li>
  );
}
