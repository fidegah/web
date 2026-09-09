import type { LucideIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

interface TabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  content: ReactNode;
}

interface CustomTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
}

export default function CustomTabs({ tabs, defaultValue }: Readonly<CustomTabsProps>) {
  const [activeTab, setActiveTab] = useState(defaultValue ?? tabs[0]?.id);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex border-b border-border mb-4 w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-0.5 ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}
