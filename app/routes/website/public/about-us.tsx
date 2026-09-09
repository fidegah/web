import { Info } from "lucide-react";
import BasePublicPageLayout from "~/components/website/public/base-layout";
import { ABOUT_SECTIONS } from "~/constants/public-page/about";
import { SEO_CONFIG } from "~/constants/seo";

export function meta() {
  const config = SEO_CONFIG.publicPage.about;
  const { title, description, ogTitle } = config;
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: ogTitle },
    { property: "og:type", content: "website" },
  ];
}

export default function AboutUs() {
  return (
    <BasePublicPageLayout
      title="ما صدای مشتریان شما را شفاف می‌کنیم"
      headerIcon={Info}
      description="فیدگاه به عنوان پلتفرم هوشمند مدیریت بازخورد، ابزاری تخصصی برای کسب‌وکارهای موفق است تا بدون ابزارهای متفرقه، دیدگاه‌های واقعی مخاطبان خود را بشنوند."
      sections={ABOUT_SECTIONS}
      footerTitle="تمایل به همکاری یا گفت‌وگو دارید؟"
      footerDescription="اگر سوالی درباره اهداف فیدگاه دارید، یا پیشنهادی برای بهبود سیستم دارید، تیم پشتیبانی ما همیشه پاسخگوی شماست."
      footerBtnText="ارتباط با ما"
    >
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-900 bg-linear-to-b from-white/20 to-transparent dark:from-zinc-950/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right mt-6 backdrop-blur-xs group hover:border-blue-500/20 transition-colors duration-300">
        <div className="space-y-1 relative z-10">
          <p className="text-[10px] text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-wider">
            Founder & Developer
          </p>
          <p className="text-base font-black text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            نریمان فلاحی
          </p>
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed relative z-10 font-normal">
          طراحی و توسعه‌یافته با تمرکز بر سادگی، هوشمندی و پایداری برای تیم‌های
          موفق ایرانی.
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-linear-to-r from-blue-500/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right" />
      </div>
    </BasePublicPageLayout>
  );
}
