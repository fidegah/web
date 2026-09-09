import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import MenuIconButton from "./ui/menu-icon-button";
import { Skeleton } from "./ui/skeleton";
import { Switch } from "./ui/switch";

interface ToggleThemeProps {
  variant?: "switch" | "icon";
}

export default function ToggleTheme({
  variant = "switch",
}: Readonly<ToggleThemeProps>) {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  const toggleDarkClass = (event: "add" | "remove") => {
    document.documentElement.classList[event]("dark");
    setIsDarkMode(event === "add");
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const systemPrefersDark = globalThis.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (theme === "dark" || (!theme && systemPrefersDark)) {
      toggleDarkClass("add");
    } else {
      toggleDarkClass("remove");
    }
  }, []);

  const changeTheme = () => {
    if (isDarkMode) {
      toggleDarkClass("remove");
      localStorage.setItem("theme", "light");
    } else {
      toggleDarkClass("add");
      localStorage.setItem("theme", "dark");
    }
  };

  if (variant === "icon") {
    if (isDarkMode === null) {
      return (
        <Skeleton className="size-9 lg:size-8 rounded-full bg-slate-200/60 dark:bg-slate-800/60" />
      );
    }

    return (
      <MenuIconButton icon={isDarkMode ? Sun : Moon} onClick={changeTheme} />
    );
  }

  if (isDarkMode === null) {
    return (
      <Skeleton className="w-11 h-6 rounded-full bg-slate-200/60 dark:bg-slate-800/60" />
    );
  }

  return (
    <Switch
      checked={isDarkMode}
      onCheckedChange={changeTheme}
      id="switch-theme"
    />
  );
}
