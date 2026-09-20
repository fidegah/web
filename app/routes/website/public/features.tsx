import { Sparkles } from "lucide-react";
import BasePublicPageLayout from "~/components/website/public/base-layout";
import { FEATURES_DATA } from "~/constants/public-page/features";
import { getCanonicalUrl, SEO_CONFIG } from "~/constants/seo";
import type { Route } from "./+types/features";

export function meta({ location }: Route.MetaArgs) {
  const config = SEO_CONFIG.publicPage.features;
  const { title, description, ogTitle } = config;
  const canonicalUrl = getCanonicalUrl(location.pathname);

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: ogTitle },
    { property: "og:type", content: "website" },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
  ];
}

export default function FeaturesPage() {
  return (
    <BasePublicPageLayout
      title="امکانات و ابزارهای فیدگاه"
      headerIcon={Sparkles}
      description="ما زیرساختی قدرتمند و مدرن را برای جمع‌آوری، تحلیل و مدیریت بازخوردهای کاربران فراهم کرده‌ایم تا محصول شما بر اساس دیتای واقعی رشد کند."
      maxWidthClass="max-w-5xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {FEATURES_DATA.map((feature) => {
          const FeatureIcon = feature.icon;
          return (
            <div
              key={feature.id}
              className="p-6 md:p-8 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs flex flex-col justify-between group hover:border-blue-500/30 dark:hover:border-blue-500/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/50 dark:border-zinc-800 shadow-xs group-hover:scale-105 group-hover:border-blue-500/30 group-hover:bg-blue-500/5 transition-all duration-300">
                    <FeatureIcon className="size-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h2>
                </div>

                <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed text-right">
                  {feature.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </BasePublicPageLayout>
  );
}
