import { Settings } from "lucide-react";
import { SidebarTrigger } from "~/components/ui/animate-ui/radix/sidebar";
import { PageHeader } from "~/components/ui/page-header";

interface SettingPageHeaderProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

export default function SettingPageHeader({
  icon,
  title,
  description,
}: Readonly<SettingPageHeaderProps>) {
  return (
    <PageHeader icon={icon} title={title} description={description}>
      <div className="md:hidden">
        <SidebarTrigger
          icon={Settings}
          className="group p-2 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-200"
        />
      </div>
    </PageHeader>
  );
}
