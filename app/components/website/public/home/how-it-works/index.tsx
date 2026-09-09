import { useState, type ComponentType } from "react";
import { Badge } from "~/components/ui/badge";
import { HOW_IT_WORKS_SECTION } from "~/constants/public-page/home";
import StepPreview from "./step-preview";
import SectionHeader from "~/components/ui/website/public/section-header";
import BaseStepCard from "../base-step-card";

interface StepItem {
  step: number;
  title: string;
  description: string;
  detailDescription: string;
  icon: ComponentType<{ className?: string }>;
}

export default function HowItWorks() {
  const [selectedStep, setSelectedStep] = useState<number>(1);

  const selectedItem =
    HOW_IT_WORKS_SECTION.steps.find((item) => item.step === selectedStep) ??
    HOW_IT_WORKS_SECTION.steps[0];

  return (
    <SectionHeader
      title={HOW_IT_WORKS_SECTION.header.title}
      description={HOW_IT_WORKS_SECTION.header.description}
    >
      <div className="w-full max-w-7xl mx-auto py-8 space-y-12">
        <div className="w-full mt-3 flex overflow-x-auto gap-4 p-3 px-4 md:px-0 no-scrollbar md:grid md:grid-cols-2 md:mt-10 lg:grid-cols-4">
          {HOW_IT_WORKS_SECTION.steps.map((item) => (
            <div
              key={item.step}
              className="min-w-[280px] sm:min-w-[320px] md:min-w-0"
            >
              <BaseStepCard
                title={item.title}
                description={item.description}
                icon={item.icon}
                badgeText={String(item.step).padStart(2, "0")}
                isSelected={selectedStep === item.step}
                onClick={() => setSelectedStep(item.step)}
              />
            </div>
          ))}
        </div>

        {/* Cinematic Dashboard Showcase Box */}
        <div className="mx-4 md:mx-0 relative overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md p-6 md:p-10 shadow-xl">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="space-y-6 lg:col-span-6 xl:col-span-7">
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  className="px-3 py-1 border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400 rounded-full font-medium"
                >
                  مرحله {selectedItem.step} از{" "}
                  {HOW_IT_WORKS_SECTION.steps.length}
                </Badge>
                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
              </div>

              <h3 className="text-2xl md:text-3xl font-black tracking-tight text-zinc-900 dark:text-white transition-all duration-300">
                {selectedItem.title}
              </h3>

              <p className="text-base md:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-2xl min-h-25">
                {selectedItem.detailDescription}
              </p>
            </div>

            {/* Simulated Live Window Frame */}
            <div className="lg:col-span-6 xl:col-span-5 w-full min-h-72.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-800" />
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-800" />
                  </div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mr-2">
                    مدیریت دیدگاه‌ها
                  </span>
                </div>
                <Badge className="text-[10px] px-2 py-0 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 border-none font-sans">
                  Active Filter
                </Badge>
              </div>

              {/* Fragmented Preview Component */}
              <StepPreview selectedStep={selectedStep} />

              <div className="mt-4 pt-2.5 border-t border-zinc-100 dark:border-zinc-900 flex justify-between items-center text-[10px] text-zinc-400">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
                  <span>یکپارچه با سیستم هسته فیدگاه</span>
                </div>
                <span className="font-mono">Fidegah OS v1.0.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionHeader>
  );
}
