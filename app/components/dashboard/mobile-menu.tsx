import ToggleTheme from "../toggle-theme";
import { SidebarTrigger } from "../ui/animate-ui/radix/sidebar";

export default function MobileMenu() {
  return (
    <div className="fixed top-2.5 inset-x-3 z-50 md:hidden">
      <nav className="flex items-center justify-between px-3.5 py-1.5 rounded-xl border border-zinc-200/60 dark:border-zinc-700/40 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md shadow-xs">
        <div className="flex items-center gap-1.5">
          <SidebarTrigger />
          <div className="w-px h-4.5 bg-zinc-200 dark:bg-zinc-600 mx-1" />
          <ToggleTheme variant="icon" />
        </div>

        <img
          src="/logo/fidegah_logo_text.webp"
          alt="FideGah Logo"
          className="h-6 w-auto object-contain select-none dark:brightness-110"
        />
      </nav>
    </div>
  );
}
