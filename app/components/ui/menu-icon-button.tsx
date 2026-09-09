import { IconButton } from "./animate-ui/buttons/icon";

interface MenuIconButtonProps extends React.ComponentProps<typeof IconButton> {
  icon: React.ElementType;
}

export default function MenuIconButton({
  icon,
  ...props
}: Readonly<MenuIconButtonProps>) {
  return (
    <IconButton
      icon={icon}
      className="
        size-9 lg:size-8 
        rounded-full
        bg-slate-100/70 text-slate-700 
        dark:bg-slate-800/60 dark:text-slate-300 
        border border-slate-200/50 dark:border-slate-700/50 
        hover:bg-slate-200/80 hover:text-slate-900 
        dark:hover:bg-slate-700/80 dark:hover:text-slate-100 
        active:scale-95
        focus-visible:ring-2 focus-visible:ring-blue-500/50
        transition-all duration-200
      "
      aria-label="باز کردن منو"
      {...props}
    />
  );
}
