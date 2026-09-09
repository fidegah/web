import { Mail, Send } from "lucide-react";
import { Link } from "react-router";

const socialLinks = [
  { icon: <Mail className="size-4" />, href: "narimanfallahi.ir@gmail.com" },
  { icon: <Send className="size-4" />, href: "https://t.me/narimanfallahi" },
];

const footerLinks = [
  {
    title: "محصول",
    links: [
      { name: "امکانات و ابزارها", href: "/features" },
      { name: "تور", href: "/product-tour" },
      {
        name: "مستندات",
        href: `https://doc.${import.meta.env.VITE_APP_DOMAIN}`,
      },
    ],
  },
  {
    title: "شرکت",
    links: [
      { name: "درباره ما", href: "/about-us" },
      { name: "تماس با ما", href: "/contact" },
    ],
  },
];

export default function PublicFooterMenu() {
  return (
    <footer className="w-full border-t border-zinc-200/60 bg-zinc-50/30 px-6 pt-16 pb-8 dark:border-zinc-900 dark:bg-zinc-950/20">
      <div className="mx-auto max-w-7xl w-full flex flex-col lg:flex-row lg:justify-between gap-12 lg:gap-6">
        <div className="flex flex-col gap-4 lg:w-1/3">
          <h2 className="bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-2xl font-extrabold tracking-tight">
            فیدگاه
          </h2>
          <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
            پلتفرم هوشمند مدیریت دیدگاه برای تیم‌های موفق
          </p>

          <div className="flex items-center gap-2.5 mt-2">
            {socialLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50 hover:text-blue-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-blue-400"
              >
                {item.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:w-2/3 lg:gap-12">
          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold tracking-wider text-zinc-900 dark:text-zinc-200 uppercase">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-3 text-sm text-zinc-500 dark:text-zinc-400">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="inline-block transition-all duration-200 hover:text-blue-600 hover:-translate-x-1 dark:hover:text-blue-400"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl w-full border-t border-zinc-200/60 dark:border-zinc-900 pt-8 mt-16 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-zinc-400 dark:text-zinc-500 text-center sm:text-right">
          © ۲۰۲۶ فیدگاه. تمام حقوق این وب‌سایت محفوظ است.
        </p>
        <div className="flex gap-6 text-xs text-zinc-400 dark:text-zinc-500">
          <Link
            to="/privacy"
            className="hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            حریم خصوصی
          </Link>
          <Link
            to="/terms"
            className="hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            شرایط استفاده
          </Link>
        </div>
      </div>
    </footer>
  );
}
