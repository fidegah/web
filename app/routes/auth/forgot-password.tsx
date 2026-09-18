import { AuthActionCard } from "~/components/auth/action-card";
import { useFetcher, Link } from "react-router";
import Input from "~/components/ui/input-custom";
import ErrorMessage from "~/components/ui/error-message";
import SubmitButton from "~/components/ui/submit-button";
import { SEO_CONFIG } from "~/constants/seo";
import { Info, Mail, MailCheck, ArrowLeft } from "lucide-react";
import type { Route } from "./+types/forgot-password";
import { createResponse } from "~/lib/create-response";
import { forgotPassword } from "~/services/auth.service";
import { getErrorMessage } from "~/lib/get-error-message";
import type { CreateResponse } from "~/types";
import { Activity } from "react";

export function meta() {
  const config = SEO_CONFIG.auth.forgotPassword;
  return [
    { title: config.title },
    {
      name: "description",
      content: config.description,
    },
    { name: "robots", content: config.robots },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;

  try {
    await forgotPassword({ email });

    return createResponse({
      status: "OK",
      data: { email },
    });
  } catch (err) {
    console.error("Forgot password error:", err);

    return createResponse({
      status: "ERR",
      message: getErrorMessage(err),
    });
  }
}

export default function ForgotPassword() {
  const fetcher = useFetcher<CreateResponse<{ email: string }>>();

  const isSuccess = fetcher.data?.status === "OK";
  const email = fetcher.data?.data?.email;

  const getEmailProviderLink = (emailStr?: string) => {
    if (!emailStr) return null;
    if (emailStr.includes("gmail.com")) return "https://mail.google.com";
    if (emailStr.includes("yahoo.com")) return "https://mail.yahoo.com";
    if (emailStr.includes("outlook.com") || emailStr.includes("hotmail.com"))
      return "https://outlook.live.com";
    return null;
  };

  const emailProviderLink = getEmailProviderLink(email);

  return (
    <AuthActionCard
      title={isSuccess ? "ایمیل بازیابی ارسال شد" : "فراموشی رمزعبور"}
      description={
        isSuccess
          ? "لینک بازیابی رمز عبور با موفقیت به ایمیل شما ارسال شد."
          : "برای بازیابی رمز عبور، ایمیل مربوط به حساب کاربری خود را وارد کنید."
      }
      icon={isSuccess ? MailCheck : undefined}
      showFooter={!isSuccess}
    >
      <Activity mode={isSuccess ? "visible" : "hidden"}>
        <div className="w-full flex flex-col gap-5 text-center animate-in fade-in duration-300">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            لطفاً صندوق ورودی (Inbox) یا پوشه Spam ایمیل خود{" "}
            {email && (
              <span className="font-semibold text-slate-900 dark:text-slate-100 dir-ltr inline-block bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md text-xs">
                {email}
              </span>
            )}{" "}
            را بررسی کرده و روی لینک بازیابی کلیک کنید.
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

          <Link
            to="/auth/login"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-xl transition-colors text-sm shadow-sm"
          >
            ورود به حساب کاربری
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>
      </Activity>

      <Activity mode={!isSuccess ? "visible" : "hidden"}>
        <fetcher.Form className="gap-4 lg:gap-6 flex flex-col" method="POST">
          <Input
            id="forgot-password-email"
            name="email"
            label="ایمیل"
            type="email"
            autoComplete="email"
            placeholder="test@gmail.com"
            icon={Mail}
            required
          />

          <div className="flex items-start gap-3 rounded-lg border border-blue-500/20 bg-blue-500/10 p-3.5 text-xs leading-relaxed text-blue-600 dark:text-blue-400">
            <Info className="size-4 shrink-0 mt-0.5" />
            <p>
              در صورت صحت ایمیل و وجود حساب کاربری، کد بازیابی برای شما ارسال
              خواهد شد. در غیر این صورت، پیامدی رخ نخواهد داد.
            </p>
          </div>

          <ErrorMessage data={fetcher.data} />

          <SubmitButton
            className="w-full md:w-1/3 lg:w-1/3"
            label="ارسال لینک بازیابی"
            isLoading={fetcher.state !== "idle"}
          />
        </fetcher.Form>
      </Activity>
    </AuthActionCard>
  );
}
