import { AuthActionCard } from "~/components/auth/action-card";
import { useFetcher } from "react-router";
import Input from "~/components/ui/input-custom";
import ErrorMessage from "~/components/ui/error-message";
import SubmitButton from "~/components/ui/submit-button";
import { SEO_CONFIG } from "~/constants/seo";
import { Info, Mail } from "lucide-react";
import type { Route } from "./+types/forgot-password";
import { createResponse } from "~/lib/create-response";
import { MESSAGES } from "~/constants/messages";
import { useActionAlert } from "~/hooks/use-action-alert";
import { forgotPassword } from "~/services/auth.service";

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
      message: MESSAGES.AUTH.PASSWORD_RESET_EMAIL_SENT,
      showAlert: true,
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return createResponse({
      status: "ERR",
      message: MESSAGES.AUTH.PASSWORD_RESET_EMAIL_ERROR,
    });
  }
}

export default function ForgotPassword() {
  const fetcher = useFetcher();
  useActionAlert(fetcher.data);

  return (
    <AuthActionCard
      title="فراموشی رمزعبور"
      description="برای بازیابی رمز عبور، ایمیل مربوط به حساب کاربری خود را وارد کنید."
    >
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
    </AuthActionCard>
  );
}
