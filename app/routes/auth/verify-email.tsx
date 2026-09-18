import { Link, isRouteErrorResponse, useRouteError } from "react-router";
import { SEO_CONFIG } from "~/constants/seo";
import { AuthActionCard } from "~/components/auth/action-card";
import {
  MailCheck,
  ShieldCheck,
  ArrowLeft,
  Mail,
  AlertTriangle,
} from "lucide-react";
import type { Route } from "./+types/verify-email";
import { MESSAGES } from "~/constants/messages";
import { Spinner } from "~/components/ui/spinner";
import { Activity } from "react";
import { verifyEmail } from "~/services/auth.service";

export function meta({ loaderData }: Route.MetaArgs) {
  const isSuccess = loaderData?.mode === "success";
  const config = SEO_CONFIG.auth.verify(isSuccess);
  return [
    { title: config.title },
    { name: "description", content: config.description },
  ];
}

export async function loader({ url }: Route.LoaderArgs) {
  const token = url.searchParams.get("token");
  const email = url.searchParams.get("email");

  if (!token) {
    return { mode: "waiting" as const, email };
  }

  try {
    await verifyEmail(token);
    return { mode: "success" as const, email, isError: false };
  } catch (error) {
    console.error("Email verification failed:", error);

    throw new Response(MESSAGES.AUTH.INVALID_VERIFICATION_LINK, {
      status: 400,
    });
  }
}

export default function VerifyEmail({ loaderData }: Route.ComponentProps) {
  const { email, mode } = loaderData;

  const getEmailProviderLink = (emailStr: string | null) => {
    if (!emailStr) return null;
    if (emailStr.includes("gmail.com")) return "https://mail.google.com";
    if (emailStr.includes("yahoo.com")) return "https://mail.yahoo.com";
    if (emailStr.includes("outlook.com") || emailStr.includes("hotmail.com"))
      return "https://outlook.live.com";
    return null;
  };

  const emailProviderLink = getEmailProviderLink(email);

  const pageState = {
    success: {
      title: "حساب شما فعال شد!",
      description: "ایمیل شما تایید شد. اکنون می‌توانید وارد حساب خود شوید.",
      icon: ShieldCheck,
      showFooter: true,
    },
    waiting: {
      title: "تایید حساب کاربری",
      description: "یک ایمیل حاوی لینک فعال‌سازی برای شما ارسال شد.",
      icon: MailCheck,
      showFooter: true,
    },
  };

  return (
    <AuthActionCard
      title={pageState[mode].title}
      description={pageState[mode].description}
      icon={pageState[mode].icon}
      showFooter={pageState[mode].showFooter}
      footerLinkText="رفتن به صفحه ورود"
    >
      <div className="w-full flex flex-col gap-4 animate-in fade-in duration-300">
        <Activity mode={mode === "success" ? "visible" : "hidden"}>
          <Link
            to="/auth/login"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm shadow-sm"
          >
            ورود به حساب کاربری
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </Activity>

        <Activity mode={mode === "waiting" ? "visible" : "hidden"}>
          <div className="w-full flex flex-col gap-5 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              لطفاً صندوق ورودی (Inbox) یا پوشه Spam ایمیل خود{" "}
              {email && (
                <span className="font-semibold text-slate-900 dark:text-slate-100 dir-ltr inline-block bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md text-xs">
                  {email}
                </span>
              )}{" "}
              را بررسی کرده و روی لینک فعال‌سازی کلیک کنید.
            </p>

            {emailProviderLink && (
              <a
                href={emailProviderLink}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-transparent dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium py-2.5 px-4 rounded-xl transition-colors text-sm shadow-sm"
              >
                <Mail className="w-4 h-4" />
                ورود مستقیم به صندوق ایمیل
              </a>
            )}

            <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2">
              لینک را دریافت نکردید؟{" "}
              <Link
                to="/auth/signup"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                ثبت‌نام مجدد
              </Link>
            </div>
          </div>
        </Activity>
      </div>
    </AuthActionCard>
  );
}

export function HydrateFallback() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center gap-4 min-h-75">
      <Spinner className="size-8 text-blue-600 dark:text-blue-400" />
      <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
        در حال تایید حساب کاربری، لطفاً شکیبا باشید...
      </p>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let message = MESSAGES.GENERAL.ERROR;

  if (isRouteErrorResponse(error)) {
    message = error.data || message;
  }

  return (
    <AuthActionCard
      title="خطا در تایید حساب"
      description={message}
      icon={AlertTriangle}
      footerLinkText="ثبت‌نام مجدد"
      footerLinkHref="/auth/signup"
      status="error"
    >
      <div className="w-full text-center text-sm text-muted-foreground py-2">
        متاسفانه لینک فعال‌سازی شما معتبر نیست یا منقضی شده است.
      </div>
    </AuthActionCard>
  );
}
