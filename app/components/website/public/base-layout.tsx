import { type ComponentType, type ReactNode } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { useId } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";

interface LegalSection {
  id: number;
  title: string;
  icon: ComponentType<{ className?: string }>;
  iconColor: string;
  description: string;
  items?: readonly string[];
  gridItems?: readonly { label: string; desc: string }[];
  alert?: string;
}

interface BasePublicPageLayoutProps {
  title: string;
  description: string;
  headerIcon: ComponentType<{ className?: string }>;
  sections?: readonly LegalSection[];
  footerTitle?: string;
  footerDescription?: string;
  footerBtnText?: string;
  lastUpdated?: string;
  maxWidthClass?: string;
  children?: ReactNode;
}

export default function BasePublicPageLayout({
  title,
  description,
  headerIcon: HeaderIcon,
  sections = [],
  footerTitle,
  footerDescription,
  footerBtnText,
  lastUpdated,
  maxWidthClass = "max-w-4xl",
  children,
}: Readonly<BasePublicPageLayoutProps>) {
  const baseId = useId();

  return (
    <div
      className="min-h-screen w-full bg-zinc-50/50 dark:bg-zinc-950/50 pt-28 pb-20 px-4 md:px-8 overflow-hidden relative text-right"
      dir="rtl"
    >
      {/* Modern Blue/Indigo Ambient Light */}
      <div className="absolute top-0 right-1/4 w-100 h-100 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-75 h-75 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className={`${maxWidthClass} mx-auto relative z-10`}>
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/">
            <Button
              variant="ghost"
              className="rounded-xl text-zinc-600 dark:text-zinc-400 gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-sm"
            >
              <ArrowRight className="size-4" />
              بازگشت به خانه
            </Button>
          </Link>
        </div>

        {/* Global Page Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 mb-8 border-b border-zinc-200/60 dark:border-zinc-900 pb-6 text-center md:text-right">
          {/* Icon Wrapper */}
          <div className="inline-flex p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-2xl mx-auto md:mx-0 shrink-0">
            <HeaderIcon className="size-8" />
          </div>

          {/* Text Wrapper */}
          <div className="space-y-2 flex-1">
            <div className="flex flex-col md:flex-row md:items-baseline md:gap-3 justify-center md:justify-start">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                {title}
              </h1>

              {lastUpdated && (
                <span className="text-zinc-400 dark:text-zinc-500 text-xs md:text-sm font-medium mt-1 md:mt-0">
                  (آخرین به‌روزرسانی: {lastUpdated})
                </span>
              )}
            </div>

            <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-3xl mx-auto md:mx-0">
              {description}
            </p>
          </div>
        </div>

        {/* Layout Body Content */}
        <div className="space-y-6">
          {sections.map((section) => {
            const SectionIcon = section.icon;
            return (
              <div
                key={section.id}
                className="p-6 md:p-8 bg-linear-to-br from-zinc-50/50 to-white dark:from-zinc-900/10 dark:to-zinc-900/40 backdrop-blur-md rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-xs"
              >
                <div className="flex items-center gap-3 mb-4 text-zinc-900 dark:text-zinc-100">
                  <div className="p-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/50 dark:border-zinc-800 shadow-xs">
                    <SectionIcon className={`size-5 ${section.iconColor}`} />
                  </div>
                  <h2 className="text-xl font-bold">{section.title}</h2>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed mb-4 text-justify md:text-right">
                  {section.description}
                </p>

                {section.items && (
                  <ul className="list-disc list-inside space-y-2 text-zinc-600 dark:text-zinc-400 text-sm md:text-base mr-4 mb-4">
                    {section.items.map((item, idx) => (
                      <li
                        key={`${baseId}-item-${section.id}-${idx}`}
                        className="leading-relaxed"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.gridItems && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {section.gridItems.map((grid, idx) => (
                      <div
                        key={`${baseId}-grid-${section.id}-${idx}`}
                        className="p-3 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200/20 dark:border-zinc-800/30"
                      >
                        <strong>{grid.label}</strong> {grid.desc}
                      </div>
                    ))}
                  </div>
                )}

                {section.alert && (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 rounded-xl text-sm md:text-base font-medium">
                    🔒 <strong>{section.alert}</strong>
                  </div>
                )}
              </div>
            );
          })}

          {children}

          {/* Call To Action Footer Frame */}
          {footerTitle && footerDescription && footerBtnText && (
            <div className="p-6 md:p-8 bg-white/60 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md rounded-2xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-right">
                <h3 className="text-lg font-bold flex items-center justify-center md:justify-start gap-2 text-zinc-900 dark:text-zinc-100">
                  <Mail className="size-5 text-blue-500 dark:text-blue-400" />
                  {footerTitle}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl">
                  {footerDescription}
                </p>
              </div>
              <Link to="/contact">
                <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-5 shadow-xs transition-colors">
                  {footerBtnText}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
