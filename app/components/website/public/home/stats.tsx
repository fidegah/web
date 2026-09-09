import SectionHeader from "../../../ui/website/public/section-header";
import { STATS_SECTION } from "~/constants/public-page/home";
import BaseStepCard from "./base-step-card";

export default function Stats() {
  return (
    <div className="w-full px-4 max-w-7xl mx-auto">
      <SectionHeader
        title={STATS_SECTION.header.title}
        description={STATS_SECTION.header.description}
      >
        <div className="w-full mt-8 gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {STATS_SECTION.items.map((item) => (
            <BaseStepCard
              key={item.title}
              title={item.title}
              description={item.description}
              customHeader={
                <div className="flex items-baseline gap-1 text-blue-600 dark:text-blue-400 transition-all duration-500 group-hover:scale-105 origin-right">
                  <span className="text-4xl font-black tracking-tight font-sans bg-clip-text text-transparent bg-linear-to-b from-zinc-950 to-zinc-700 dark:from-white dark:to-zinc-400 group-hover:from-blue-600 group-hover:to-blue-400 transition-all duration-500">
                    {item.number}
                  </span>
                  <span className="text-lg font-bold opacity-90">
                    {item.unit}
                  </span>
                </div>
              }
            />
          ))}
        </div>
      </SectionHeader>
    </div>
  );
}
