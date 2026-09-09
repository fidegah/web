import { ChevronDown } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { RippleButton } from "~/components/ui/animate-ui/buttons/ripple";
import { HERO_SECTION } from "~/constants/public-page/home";
import { Link } from "react-router";

export default function HeroSection() {
  return (
    <div className="relative min-h-[calc(100dvh-4rem)] w-full px-4 md:py-4 flex flex-col items-center justify-center gap-8 overflow-hidden">
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, black 50%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 50%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-6 md:gap-8 text-center animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out">
        <Badge
          variant="outline"
          className="rounded-full px-4 py-2 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium tracking-wide shadow-xs"
        >
          <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 ml-2 animate-pulse" />
          {HERO_SECTION.announcement}
        </Badge>

        <h1 className="bg-clip-text text-transparent bg-linear-to-b from-zinc-900 via-zinc-800 to-zinc-600 dark:from-white dark:via-zinc-200 dark:to-zinc-500 text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight md:leading-[1.2]">
          {HERO_SECTION.title}
        </h1>

        <div className="max-w-2xl mx-auto">
          <p className="text-base md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
            {HERO_SECTION.description}
          </p>
        </div>

        <div className="w-full flex justify-center">
          <div className="flex flex-wrap items-center justify-center gap-3 p-2 md:p-3 bg-zinc-100/50 dark:bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 max-w-2xl shadow-inner">
            {HERO_SECTION.features.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.text}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 text-sm font-medium border border-zinc-100 dark:border-zinc-900 shadow-xs hover:scale-105 transition-transform duration-200"
                >
                  <IconComponent className="size-5 text-blue-600 dark:text-blue-400" />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full max-w-md mt-4 grid grid-cols-2 gap-4 px-4 pb-6">
          <Link to="/auth/signup" className="w-full">
            <RippleButton
              className="w-full rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold shadow-lg hover:shadow-xl dark:shadow-white/5 transition-all h-11 md:h-12 lg:text-base!"
              size="lg"
            >
              {HERO_SECTION.buttons.primary}
            </RippleButton>
          </Link>
          <Link to="/contact" className="w-full">
            <RippleButton
              variant="outline"
              className="w-full rounded-xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm text-zinc-900 dark:text-white border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium h-11 md:h-12 lg:text-base!"
              size="lg"
            >
              {HERO_SECTION.buttons.secondary}
            </RippleButton>
          </Link>
        </div>
      </div>

      <div className="flex justify-center text-zinc-400 dark:text-zinc-600 cursor-pointer hover:text-zinc-900 dark:hover:text-white transition-colors z-10 animate-bounce md:hidden">
        <ChevronDown className="size-6" />
      </div>
    </div>
  );
}
