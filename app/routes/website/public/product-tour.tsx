import { Target, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import BasePublicPageLayout from "~/components/website/public/base-layout";
import { TourStepRow } from "~/components/website/public/tour-step";
import { PRODUCT_TOUR_STEPS } from "~/constants/public-page/product-tour";
import { getCanonicalUrl, SEO_CONFIG } from "~/constants/seo";
import type { Route } from "./+types/product-tour";

export function meta({ location }: Route.MetaArgs) {
  const config = SEO_CONFIG.publicPage.productTour;
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

export default function ProductTourPage() {
  return (
    <BasePublicPageLayout
      title="تور محصول؛ فیدگاه را ببینید"
      headerIcon={Target}
      description="قبل از ثبت‌نام، نگاهی به داخل پنل فیدگاه بیندازید. ما فضایی ساده، مدرن و قدرتمند برای مدیریت صدای کاربران شما ساخته‌ایم."
      maxWidthClass="max-w-5xl"
    >
      <div className="space-y-16 md:space-y-20">
        {PRODUCT_TOUR_STEPS.map((step, index) => (
          <TourStepRow key={step.id} step={step} index={index} />
        ))}

        {/* Call To Action Box */}
        <div className="mt-16 text-center p-8 md:p-12 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-6 max-w-4xl mx-auto shadow-xl relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          <h3 className="font-black text-xl md:text-2xl text-zinc-900 dark:text-zinc-50 relative z-10 flex items-center justify-center gap-2">
            <Sparkles className="size-5 text-blue-500 animate-spin animation-duration-[4s]" />
            حالا نوبت شماست که صدای کاربران را مدیریت کنید
          </h3>
          <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed relative z-10">
            به صورت کاملاً رایگان ثبت‌نام کنید و در کمتر از ۲ دقیقه، ویجت هوشمند
            فیدگاه را روی سایت خود فعال کنید.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center pt-4 relative z-10">
            <Link to="/auth/signup" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-extrabold px-8 py-5 shadow-md hover:bg-zinc-900 dark:hover:bg-zinc-50 transition-all">
                شروع رایگان در فیدگاه
              </Button>
            </Link>
            <Link to="/contact" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-xl bg-white/60 dark:bg-zinc-900/40 text-zinc-800 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 font-bold px-8 py-5 transition-all"
              >
                تماس با تیم توسعه
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </BasePublicPageLayout>
  );
}
