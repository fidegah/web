// Step 2
export const ROLE_OPTIONS = [
  { value: "product-manager", label: "مدیر محصول (Product Manager)" },
  { value: "developer", label: "توسعه‌دهنده (Developer / CTO)" },
  { value: "designer", label: "طراح محصول / یوایکس (UI/UX Designer)" },
  { value: "support", label: "پشتیبانی و ارتباط با مشتریان" },
  { value: "founder", label: "بنیان‌گذار / مدیرعامل (Founder / CEO)" },
  { value: "other", label: "سایر موارد" },
] as const;

export const TEAM_SIZE_OPTIONS = [
  { value: "only-me", label: "فقط خودم" },
  { value: "2-5", label: "۲ تا ۵ نفر" },
  { value: "6-20", label: "۶ تا ۲۰ نفر" },
  { value: "21-50", label: "۲۱ تا ۵۰ نفر" },
  { value: "50+", label: "بیشتر از ۵۰ نفر" },
] as const;

export const EXPERTISE_OPTIONS = [
  { value: "tech", label: "فنی و تکنولوژی" },
  { value: "marketing", label: "بازاریابی و رشد" },
  { value: "sales", label: "فروش و کسب درآمد" },
  { value: "product", label: "توسعه محصول" },
  { value: "operations", label: "عملیات و اجرا" },
  { value: "design", label: "طراحی و تجربه کاربری" },
  { value: "support", label: "پشتیبانی و خدمات مشتریان" },
] as const;

export const USAGE_FREQUENCY_OPTIONS = [
  { value: "daily", label: "روزانه" },
  { value: "weekly", label: "چند بار در هفته" },
  { value: "monthly", label: "چند بار در ماه" },
  { value: "rarely", label: "به ندرت" },
  { value: "first-time", label: "اولین بار است که استفاده می‌کنم" },
] as const;

// Step 3
export const PLATFORM_TYPE_OPTIONS = [
  { value: "web", label: "وب (Web)" },
  { value: "mobile", label: "موبایل (iOS/Android)" },
  { value: "both", label: "هر دو (وب و موبایل)" },
  { value: "desktop", label: "دسکتاپ (Windows/Mac/Linux)" },
  { value: "pwa", label: "PWA (برنامه وب پیشرفته)" },
] as const;

export const USER_COUNT_OPTIONS = [
  { value: "0-100", label: "کمتر از ۱۰۰ کاربر" },
  { value: "100-1000", label: "۱۰۰ تا ۱,۰۰۰ کاربر" },
  { value: "1000-10000", label: "۱,۰۰۰ تا ۱۰,۰۰۰ کاربر" },
  { value: "10000-100000", label: "۱۰,۰۰۰ تا ۱۰۰,۰۰۰ کاربر" },
  { value: "100000-plus", label: "بیشتر از ۱۰۰,۰۰۰ کاربر" },
] as const;

export const INTEGRATION_NEED_OPTIONS = [
  { value: "yes", label: "بله، نیاز دارم" },
  { value: "no", label: "نه، فعلاً نیاز ندارم" },
  { value: "maybe", label: "شاید در آینده" },
] as const;

export const PRIORITY_OPTIONS = [
  { value: "ease-of-use", label: "سهولت استفاده و سادگی" },
  { value: "price", label: "قیمت مناسب / مقرون به صرفه" },
  { value: "features", label: "امکانات و قابلیت‌های متنوع" },
  { value: "support", label: "پشتیبانی قوی و سریع" },
  { value: "integration", label: "امکان اتصال به ابزارهای دیگر" },
  { value: "security", label: "امنیت و حریم خصوصی" },
] as const;

export const INDUSTRY_OPTIONS = [
  { value: "ecommerce", label: "فروشگاهی / تجارت الکترونیک" },
  { value: "saas", label: "نرم‌افزار خدماتی (SaaS)" },
  { value: "edtech", label: "آموزش آنلاین (EdTech)" },
  { value: "fintech", label: "مالی و بانکی (FinTech)" },
  { value: "healthcare", label: "سلامت و پزشکی" },
  { value: "entertainment", label: "سرگرمی و رسانه" },
  { value: "social", label: "شبکه اجتماعی" },
  { value: "marketplace", label: "بازارگاه آنلاین (Marketplace)" },
  { value: "logistics", label: "حمل و نقل و لجستیک" },
  { value: "other", label: "سایر موارد" },
] as const;

export const REVENUE_MODEL_OPTIONS = [
  { value: "subscription", label: "اشتراک ماهانه/سالیانه (Subscription)" },
  { value: "freemium", label: "رایگان با امکانات ویژه (Freemium)" },
  { value: "one-time", label: "فروش یکباره (One-time purchase)" },
  { value: "ads", label: "درآمد از طریق تبلیغات" },
  { value: "commission", label: "کمیسیون از تراکنش‌ها" },
  { value: "enterprise", label: "فروش سازمانی (Enterprise)" },
  { value: "hybrid", label: "ترکیبی (چند مدل درآمدی)" },
  { value: "not-yet", label: "هنوز به درآمد نرسیدیم" },
  { value: "non-profit", label: "غیرانتفاعی (Non-profit)" },
] as const;
