import { Activity } from "react";

interface StepPreviewProps {
  selectedStep: number;
}

export default function StepPreview({
  selectedStep,
}: Readonly<StepPreviewProps>) {
  return (
    <div className="flex-1 flex flex-col justify-center">
      <Activity mode={selectedStep === 1 ? "visible" : "hidden"}>
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            پورتال ارسال بازخورد کاربران:
          </div>
          <div className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-2">
            <div className="h-3 w-1/3 bg-zinc-900/10 dark:bg-white/10 rounded-sm" />
            <div className="h-8 w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 flex items-center text-xs text-zinc-400">
              مثال: «امکان دارک‌مود را به ادیتور اضافه کنید...»
            </div>
            <div className="flex justify-between items-center pt-1">
              <div className="h-4 w-16 bg-blue-500/10 rounded-full" />
              <div className="h-6 w-20 bg-blue-600 text-[10px] text-white font-medium rounded-md flex items-center justify-center shadow-sm">
                ارسال دیدگاه
              </div>
            </div>
          </div>
        </div>
      </Activity>

      <Activity mode={selectedStep === 2 ? "visible" : "hidden"}>
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            فیلتر بر اساس دسته‌بندی و برچسب‌ها:
          </div>
          <div className="flex flex-wrap gap-1.5 pb-1">
            <span className="text-[10px] px-2 py-1 rounded-md bg-blue-600 text-white font-medium">
              دسته: قابلیت جدید ×
            </span>
            <span className="text-[10px] px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
              وضعیت: بررسی شده
            </span>
          </div>
          <div className="space-y-2">
            {[
              { title: "افزودن خروجی Excel به گزارشات", count: "۷۴ رای" },
              { title: "امکان دسته‌بندی چندگانه بوردها", count: "۴۳ رای" },
            ].map((row) => (
              <div
                key={row.title}
                className="p-2 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-45">
                    {row.title}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {row.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Activity>

      <Activity mode={selectedStep === 3 ? "visible" : "hidden"}>
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            نقشه راه محصول (Product Roadmap):
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-center space-y-1.5">
              <span className="text-[10px] font-bold text-zinc-400">
                بررسی شده
              </span>
              <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            </div>
            <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/20 text-center space-y-1.5 ring-2 ring-blue-500/10">
              <span className="text-[10px] font-bold text-blue-500">
                در حال توسعه
              </span>
              <div className="h-1.5 w-full bg-blue-500/20 rounded-full animate-pulse" />
            </div>
            <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/10 text-center space-y-1.5">
              <span className="text-[10px] font-bold text-blue-400">
                انجام شده
              </span>
              <div className="h-1.5 w-full bg-blue-500/20 rounded-full" />
            </div>
          </div>
        </div>
      </Activity>

      <Activity mode={selectedStep === 4 ? "visible" : "hidden"}>
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            سیستم اطلاع‌رسانی خودکار فیدگاه:
          </div>
          <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-blue-500" />
            <div className="p-2 rounded-lg bg-blue-600 text-white mt-0.5">
              <svg
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-zinc-900 dark:text-white">
                ویژگی درخواستی شما منتشر شد!
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                پیشنهاد شما مبنی بر «بهبود فیلترهای جستجو» با موفقیت پیاده‌سازی
                شد.
              </p>
            </div>
          </div>
        </div>
      </Activity>
    </div>
  );
}
