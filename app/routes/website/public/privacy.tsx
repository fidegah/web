import { Shield } from "lucide-react";
import BasePublicPageLayout from "~/components/website/public/base-layout";
import { PRIVACY_SECTIONS } from "~/constants/public-page/privacy";
import { SEO_CONFIG } from "~/constants/seo";

export function meta() {
  const config = SEO_CONFIG.publicPage.privacy;
  const { title, description, ogTitle } = config;
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: ogTitle },
    { property: "og:type", content: "website" },
  ];
}

export default function PrivacyPolicy() {
  return (
    <BasePublicPageLayout
      title="سیاست حریم خصوصی فیدگاه (Fidegah)"
      headerIcon={Shield}
      description="فیدگاه به عنوان نرم‌افزار هوشمند مدیریت بازخورد و ارتباط با مشتریان، متعهد است که از داده‌های شخصی شما و مشتریانتان با بالاترین استانداردهای امنیتی محافظت کند. در این صفحه به طور شفاف توضیح می‌دهیم چه اطلاعاتی را جمع‌آوری می‌کنیم و چگونه از آن‌ها مراقبت می‌شود."
      sections={PRIVACY_SECTIONS}
      footerTitle="نیاز به راهنمایی بیشتری دارید؟"
      footerDescription="اگر سوال یا ابهامی درباره بندهای حریم خصوصی فیدگاه دارید یا تمایل به درخواست حذف حساب کاربری خود دارید، با ما در ارتباط باشید."
      footerBtnText="ارتباط با پشتیبانی"
      lastUpdated="خرداد ۱۴۰۵ (ژوئن ۲۰۲۶)"
    />
  );
}
