import { Scale } from "lucide-react";
import BasePublicPageLayout from "~/components/website/public/base-layout";
import { TERMS_SECTIONS } from "~/constants/public-page/terms";
import { SEO_CONFIG } from "~/constants/seo";

export function meta() {
  const config = SEO_CONFIG.publicPage.terms;
  const { title, description, ogTitle } = config;
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: ogTitle },
    { property: "og:type", content: "website" },
  ];
}

export default function TermsOfService() {
  return (
    <BasePublicPageLayout
      title="شرایط و ضوابط استفاده از فیدگاه"
      headerIcon={Scale}
      description="ورود به وب‌سایت فیدگاه و استفاده از پنل مدیریتی، ابزارها و خدمات نرم‌افزار به معنای پذیرش کامل و بدون قید و شرط این شرایط است. لطفاً این سند را به دقت مطالعه فرمایید."
      sections={TERMS_SECTIONS}
      footerTitle="سوالی درباره قوانین فیدگاه دارید؟"
      footerDescription="اگر در خصوص بندهای حقوقی بالا ابهام یا سوالی دارید، تیم پشتیبانی ما آماده پاسخگویی و شفاف‌سازی است."
      footerBtnText="ارتباط با ما"
      lastUpdated="خرداد ۱۴۰۵ (ژوئن ۲۰۲۶)"
    />
  );
}
