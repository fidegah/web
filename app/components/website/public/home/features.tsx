import SectionHeader from "../../../ui/website/public/section-header";
import { FEATURES_GRID_SECTION } from "~/constants/public-page/home";
import BaseStepCard from "./base-step-card";

export default function Features() {
  return (
    <div className="w-full px-4 max-w-7xl mx-auto">
      <SectionHeader
        title={FEATURES_GRID_SECTION.header.title}
        description={FEATURES_GRID_SECTION.header.description}
        className="mt-0 lg:mt-16"
      >
        <div className="w-full mt-8 gap-6 grid grid-cols-1 md:grid-cols-2 md:mt-12 lg:grid-cols-3">
          {FEATURES_GRID_SECTION.items.map((item, index) => (
            <div
              key={item.title}
              className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-backwards"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <BaseStepCard
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            </div>
          ))}
        </div>
      </SectionHeader>
    </div>
  );
}
