import {
  BookOpen,
  Compass,
  Home,
  Info,
  Menu as MenuIcon,
  Phone,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import ToggleTheme from "~/components/toggle-theme";
import { MobileSidebar } from "~/components/ui/animate-ui/radix/mobile-sidebar";
import MobileNavigationItem from "./mobile-navigation-item";
import DesktopNavigationItem from "./desktop-navigation-item";
import MenuIconButton from "~/components/ui/menu-icon-button";

const paths = [
  { title: "خانه", url: "/", icon: Home },
  { title: "امکانات و ابزارها", url: "/features", icon: Sparkles },
  { title: "تور محصول", url: "/product-tour", icon: Compass },
  {
    title: "مستندات",
    url: `https://docs.${import.meta.env.VITE_APP_DOMAIN}`,
    icon: BookOpen,
  },
  { title: "ارتباط با ما", url: "/contact", icon: Phone },
  { title: "درباره ما", url: "/about-us", icon: Info },
];

export default function PublicHeaderMenu() {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 p-3 lg:hidden">
        <nav className="w-full px-4 py-2 border border-white/20 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-xl shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MenuIconButton
              icon={MenuIcon}
              onClick={() => setIsOpenMenu(true)}
            />
            <ToggleTheme variant="icon" />
          </div>

          <Link to="/" className="transition-transform active:scale-95">
            <img
              src="/logos/fidegah_logo_text.webp"
              alt="Fidegah Logo"
              className="w-13"
            />
          </Link>
        </nav>
      </div>

      <MobileSidebar
        open={isOpenMenu}
        setOpen={setIsOpenMenu}
        side="right"
        animateOnHover
      >
        <div className="w-full h-full flex flex-col p-4">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3 mb-2">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">
              فهرست منو
            </span>
            <Badge variant="outline" className="rounded-full">
              v1.0.0
            </Badge>
          </div>

          <div className="flex flex-col gap-3">
            {paths.map((path) => (
              <MobileNavigationItem
                key={path.url}
                path={path}
                onClose={() => setIsOpenMenu(false)}
              />
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2.5">
            <Link
              to="/auth/signup"
              className="w-full"
              onClick={() => setIsOpenMenu(false)}
            >
              <Button className="w-full rounded-xl h-11 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 shadow-sm font-semibold">
                ایجاد حساب کاربری
              </Button>
            </Link>

            <Link
              to="/auth/login"
              className="w-full"
              onClick={() => setIsOpenMenu(false)}
            >
              <Button
                variant="outline"
                className="w-full rounded-xl h-11 border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 font-medium"
              >
                ورود به حساب کاربری
              </Button>
            </Link>
          </div>
        </div>
      </MobileSidebar>

      <div className="hidden lg:block fixed top-3 left-0 right-0 z-50 max-w-7xl mx-auto px-6">
        <nav className="w-full px-6 py-2 border border-white/40 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.3)] flex items-center justify-between transition-all duration-300">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2 transition-transform active:scale-95"
            >
              <img
                src="/logos/fidegah_logo_text.webp"
                alt="Fidegah Logo"
                className="w-16 object-contain"
              />
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 rounded-full font-mono opacity-70"
              >
                v1.0.0
              </Badge>
            </Link>

            <ul className="flex gap-7 mr-2">
              {paths.map((path) => (
                <DesktopNavigationItem key={path.url} path={path} />
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3">
            <ToggleTheme variant="icon" />

            <div className="flex items-center gap-1.5">
              <Link to="/auth/login">
                <Button
                  variant="ghost"
                  className="rounded-lg h-9 px-4 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/70 dark:hover:bg-zinc-900/70 text-sm font-medium"
                >
                  ورود
                </Button>
              </Link>

              <Link to="/auth/signup">
                <Button className="rounded-lg h-9 px-4 bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200 shadow-sm text-sm font-medium">
                  ایجاد حساب کاربری
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
