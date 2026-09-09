import { type ComponentType } from "react";
import { Sparkles, CheckCircle2, ThumbsUp } from "lucide-react";

function DashboardMock() {
  return (
    <div className="w-full bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 space-y-4 shadow-lg text-right">
      <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-900 pb-2">
        <span className="text-xs font-extrabold text-zinc-700 dark:text-zinc-300">
          خلاصه وضعیت پلتفرم
        </span>
        <span className="size-2 rounded-full bg-blue-500 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800/40">
          <p className="text-[10px] text-zinc-400">کل بازخوردها</p>
          <p className="text-lg font-black mt-1 text-zinc-800 dark:text-zinc-100">
            ۱,۲۴۰
          </p>
        </div>
        <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800/40">
          <p className="text-[10px] text-zinc-400">رضایت کاربران</p>
          <p className="text-lg font-black mt-1 text-blue-600 dark:text-blue-400">
            %۹۴.2
          </p>
        </div>
      </div>
    </div>
  );
}

function FeedbackAIMock() {
  return (
    <div className="w-full bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 space-y-3 shadow-lg text-right">
      <div className="p-2.5 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800/40">
        <p className="text-[11px] text-zinc-400 line-through truncate">
          سلام خسته نباشید دکمه پرداخت در صفحه کاربری خطای ۵۰۰ میده...
        </p>
      </div>
      <div className="p-3 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-xl space-y-1.5 relative overflow-hidden">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
          <Sparkles className="size-3" />
          خلاصه هوش مصنوعی
        </div>
        <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 leading-relaxed">
          خطای ۵۰۰ در گیت‌وی پرداخت دسکتاپ هنگام تراکنش‌های بالای ۱۰ میلیون.
        </p>
      </div>
    </div>
  );
}

function RoadmapMock() {
  return (
    <div className="w-full bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 space-y-4 shadow-lg text-right">
      <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-900 pb-2.5">
        <span className="text-xs font-extrabold text-zinc-700 dark:text-zinc-300">
          ماتریس اولویت‌بندی پویا
        </span>
        <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md font-mono font-bold">
          Custom Formula
        </span>
      </div>

      <div className="p-3 bg-zinc-50/70 dark:bg-zinc-900/40 rounded-xl border border-zinc-100 dark:border-zinc-800/60 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <p className="text-xs font-black text-zinc-800 dark:text-zinc-200 leading-relaxed">
            افزودن درگاه پرداخت تتر (Crypto Gateway)
          </p>
          <div className="bg-blue-600 text-white rounded-lg p-1.5 px-2.5 text-center shrink-0 shadow-sm">
            <p className="text-[8px] opacity-80 font-medium">امتیاز</p>
            <p className="text-sm font-black font-mono mt-0.5">۱۱۵</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-200/40 dark:border-zinc-800/40 text-center">
          <div>
            <p className="text-[9px] text-zinc-400">تأثیر (فیبوناچی)</p>
            <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-0.5 font-mono">
              ۱۳
            </p>
          </div>
          <div>
            <p className="text-[9px] text-zinc-400">سهولت پیاده سازی</p>
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5 font-mono">
              5
            </p>
          </div>
          <div>
            <p className="text-[9px] text-zinc-400">استراتژیک؟</p>
            <span className="inline-block text-[9px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-sm mt-0.5">
              TRUE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersMock() {
  return (
    <div className="w-full bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 space-y-2.5 shadow-lg text-right">
      {[
        { name: "سهراب علوی", desc: "Chrome - Windows", count: "۱۲ دیدگاه" },
        { name: "مریم حسینی", desc: "Safari - iOS", count: "۸ دیدگاه" },
      ].map((user, i) => (
        <div
          key={i}
          className="p-2.5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800/40 flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              {user.name}
            </p>
            <p className="text-[10px] text-zinc-400 mt-0.5" dir="ltr">
              {user.desc}
            </p>
          </div>
          <span className="text-[10px] bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-1 rounded-md font-medium">
            {user.count}
          </span>
        </div>
      ))}
    </div>
  );
}

function SurveysMock() {
  return (
    <div className="w-full bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 space-y-4 shadow-lg text-right">
      <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-900 pb-2">
        <span className="text-xs font-extrabold text-zinc-700 dark:text-zinc-300">
          طراح نظرسنجی پویا
        </span>
        <span className="text-[9px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-md font-bold">
          نوع: چندگزینه‌ای
        </span>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 leading-relaxed">
          کدام ویژگی فیدگاه برای کسب‌وکار شما حیاتی‌تر است؟
        </p>

        <div className="space-y-2">
          {[
            {
              id: "a",
              text: "خلاصه‌سازی دیدگاه‌ها با هوش مصنوعی",
              selected: true,
            },
            { id: "b", text: "ویجت اختصاصی بدون کدنویسی", selected: false },
            {
              id: "c",
              text: "اتصال به نقشه‌راه و سیستم رای‌دهی",
              selected: false,
            },
          ].map((option) => (
            <div
              key={option.id}
              className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all duration-200 ${
                option.selected
                  ? "bg-blue-500/5 border-blue-500 text-blue-600 dark:text-blue-400"
                  : "bg-zinc-50/50 dark:bg-zinc-900/40 border-zinc-200/60 dark:border-zinc-800/60 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <span>{option.text}</span>
              <div
                className={`size-4 rounded-full border flex items-center justify-center shrink-0 ${
                  option.selected
                    ? "border-blue-500"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
              >
                {option.selected && (
                  <div className="size-2 rounded-full bg-blue-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChangelogsMock() {
  return (
    <div className="w-full bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 space-y-3 shadow-lg text-right">
      <div className="flex items-center gap-2">
        <span className="text-[9px] bg-blue-500 text-white px-2 py-0.5 rounded-md font-bold">
          نسخه ۲.۴.۰
        </span>
        <span className="text-[10px] text-zinc-400">امروز</span>
      </div>
      <p className="text-xs font-extrabold text-zinc-800 dark:text-zinc-200">
        رونمایی از سیستم لاگین یکپارچه OAuth2
      </p>
      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
        <CheckCircle2 className="size-3.5 text-blue-500 shrink-0" />
        <span>افزودن ورود با گوگل و گیت‌هاب</span>
      </div>
    </div>
  );
}

function SdkMock() {
  return (
    <div
      className="w-full bg-zinc-950 rounded-2xl border border-zinc-800 p-4 shadow-lg text-left select-none"
      dir="ltr"
    >
      <div className="flex items-center gap-1.5 pb-3 border-b border-zinc-900">
        <div className="size-2 rounded-full bg-red-500/80" />
        <div className="size-2 rounded-full bg-yellow-500/80" />
        <div className="size-2 rounded-full bg-green-500/80" />
      </div>

      <code className="text-[10px] md:text-[11px] font-mono text-zinc-400 block pt-3 leading-relaxed whitespace-pre-wrap">
        {/* Inject Script Segment */}
        <span className="text-zinc-600">
          &lt;!-- تزریق ویجت هوشمند فیدگاه --&gt;
        </span>
        {"\n"}
        <span className="text-pink-500">&lt;script</span>
        {"\n"}
        {"  "}
        <span className="text-cyan-400">src</span>=
        <span className="text-amber-300">"https://api.feedgah.ir/sdk.js"</span>
        {"\n"}
        {"  "}
        <span className="text-cyan-400">data-sdk-token</span>=
        <span className="text-amber-300">"fd_a6975f..."</span>
        {"\n"}
        {"  "}
        <span className="text-cyan-400">data-theme</span>=
        <span className="text-amber-300">"dark"</span>
        {"\n"}
        <span className="text-pink-500">&gt;&lt;/script&gt;</span>
        {"\n\n"}
        {/* User Identification Segment */}
        <span className="text-zinc-600">
          &lt;!-- احراز هویت خودکار کاربر شما --&gt;
        </span>
        {"\n"}
        <span className="text-pink-500">&lt;script&gt;</span>
        {"\n"}
        {"  "}
        <span className="text-purple-400">Fidegah</span>.
        <span className="text-blue-400">identify</span>({"{"}
        {"\n"}
        {"    "}id: <span className="text-amber-300">"user_reza_123"</span>,
        {"\n"}
        {"    "}name: <span className="text-amber-300">"رضا احمدی"</span>,{"\n"}
        {"    "}email: <span className="text-amber-300">"reza@gmail.com"</span>
        {"\n"}
        {"  "}${"}"}$);{"\n"}
        <span className="text-pink-500">&lt;/script&gt;</span>
      </code>
    </div>
  );
}

interface StepItem {
  id: number;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

interface TourStepRowProps {
  step: StepItem;
  index: number;
}

export function TourStepRow({ step, index }: Readonly<TourStepRowProps>) {
  const StepIcon = step.icon;
  const isEven = index % 2 === 0;

  const renderMockUI = (id: number) => {
    switch (id) {
      case 1:
        return <DashboardMock />;
      case 2:
        return <FeedbackAIMock />;
      case 3:
        return <RoadmapMock />;
      case 4:
        return <UsersMock />;
      case 5:
        return <SurveysMock />;
      case 6:
        return <ChangelogsMock />;
      case 7:
        return <SdkMock />;
      default:
    }
  };

  return (
    <div
      className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-14 group`}
    >
      <div className="flex-1 space-y-4 text-center md:text-right">
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <div className="p-2 bg-blue-500/10 dark:bg-blue-500/5 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-500/10 shrink-0 shadow-xs">
            <StepIcon className="size-5" />
          </div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
            {step.title}
          </h2>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed text-justify md:text-right font-normal">
          {step.description}
        </p>
      </div>

      <div className="w-full md:w-[45%] shrink-0 max-w-sm mx-auto md:mx-0">
        <div className="relative p-6 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-linear-to-b from-zinc-100/40 to-transparent dark:from-zinc-900/10 backdrop-blur-md shadow-md group-hover:shadow-xl group-hover:border-blue-500/20 transition-all duration-500 transform group-hover:-translate-y-1">
          {renderMockUI(step.id)}
          <div className="absolute -top-1 -right-1 size-3 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-xs group-hover:bg-blue-500/40 transition-colors pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
