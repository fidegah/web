import {
  LayoutDashboard,
  MessageSquareText,
  BarChart3,
  Megaphone,
  Code2,
  Users,
  KanbanSquare,
} from "lucide-react";

export const PRODUCT_TOUR_STEPS = [
  {
    id: 1,
    title: "داشبورد؛ دید کلی در یک نگاه",
    description:
      "به محض ورود به فیدگاه، خلاصه‌ای از آخرین بازخوردها، وضعیت کلی رضایت کاربران و آمارهای کلیدی تعامل را در یک داشبورد مدرن و مینیمال مشاهده کنید.",
    icon: LayoutDashboard,
    iconColor: "text-blue-500",
    bgIcon: "bg-blue-500/10",
    image: "/image/product-tour/dashboard-home.webp",
  },
  {
    id: 2,
    title: "مدیریت بازخوردها و خلاصه‌سازی با هوش مصنوعی",
    description:
      "تمام نظرات، گزارش‌های خطا و ایده‌ها در یک صندوق ورودی یکپارچه جمع می‌شوند. هوش مصنوعی فیدگاه متن‌های طولانی کاربران را به صورت خودکار خلاصه‌سازی می‌کند تا در کمترین زمان، جانِ کلام مشتری را درک کنید.",
    icon: MessageSquareText,
    iconColor: "text-rose-500",
    bgIcon: "bg-rose-500/10",
    image: "/image/product-tour/dashboard-feedback.webp",
  },
  {
    id: 3,
    title: "مدیریت نقشه‌راه و موتور امتیازدهی پویا (Roadmaps)",
    description:
      "در این بخش، بازخوردها به پست‌های ساختاریافته تبدیل می‌شوند. فیدگاه به شما امکان می‌دهد سیستم اولویت‌بندی کاملاً اختصاصی خود را بر پایه فرمول‌های شخصی‌سازی‌شده خلق کنید. شما محدود به یک مدل ثابت نیستید؛ می‌توانید شاخص‌های خود را با انواع مقادیر مختلف از جمله اعداد دلخواه، دنباله فیبوناچی، فیلدهای منطقی (True/False) و گزینه‌های سفارشی تعریف کنید تا سیستم بر اساس ماتریس اختصاصی شما، امتیاز نهایی هر پست را محاسبه و اولویت‌ها را تفکیک کند.",
    icon: KanbanSquare,
  },
  {
    id: 4,
    icon: Users,
    title: "مدیریت و لیست کاربران",
    description:
      "با تعامل کاربران (ثبت پست، رای یا کامنت)، سیستم فیدگاه به طور خودکار آن‌ها را به لیست کاربران شما اضافه می‌کند. در این بخش می‌توانید جزئیاتی مثل مشخصات دستگاه، تعداد پست‌های ایجاد شده، کامنت‌ها و مجموع رای‌های هر کاربر را برای تحلیل دقیق‌تر رفتار آن‌ها رصد کنید.",
    iconColor: "text-emerald-500",
    bgIcon: "bg-emerald-500/10",
    image: "/image/product-tour/dashboard-users.webp",
  },
  {
    id: 5,
    title: "سنجش رضایت با نظرسنجی‌های هدفمند (Surveys)",
    description:
      "فرم‌های نظرسنجی کاستومایز شده بسازید تا در نقاط کلیدی محصول، میزان رضایت کاربران را بسنجید و نقاط ضعف تجربه کاربری پلتفرمتان را به سرعت شناسایی کنید.",
    icon: BarChart3,
    iconColor: "text-amber-500",
    bgIcon: "bg-amber-500/10",
    image: "/image/product-tour/dashboard-poll.webp",
  },
  {
    id: 6,
    title: "مرکز گزارش تغییرات (Changelogs)",
    description:
      "ویژگی‌های جدید، بهبودها و نسخه‌های تازه محصول خود را مستقیماً از طریق فیدگاه به گوش کاربران برسانید و آن‌ها را از روند رو به رشد پلتفرمتان باخبر نگه دارید.",
    icon: Megaphone,
    iconColor: "text-purple-500",
    bgIcon: "bg-purple-500/10",
    image: "/image/product-tour/dashboard-changelog.webp",
  },
  {
    id: 7,
    title: "ویجت و SDK اختصاصی",
    description:
      "بدون کدنویسی‌های پیچیده، ویجت تعاملی فیدگاه را با هویت بصری برند خود هماهنگ کرده و با یک خط کد یا از طریق SDK اختصاصی، آن را به راحتی درون اپلیکیشن یا وب‌سایت خود تزریق کنید.",
    icon: Code2,
    iconColor: "text-indigo-500",
    bgIcon: "bg-indigo-500/10",
    image: "/image/product-tour/sdk-feedback.webp",
  },
] as const;
