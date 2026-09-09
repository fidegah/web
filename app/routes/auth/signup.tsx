import { Link, redirect, useFetcher } from "react-router";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { KeyRound, Mail, User, Lock } from "lucide-react";
import Input from "~/components/ui/input-custom";
import SubmitButton from "~/components/ui/submit-button";
import ErrorMessage from "~/components/ui/error-message";
import GoogleAuth from "~/components/auth/google";
import type { Route } from "./+types/signup";
import { SEO_CONFIG } from "~/constants/seo";
import { createResponse } from "~/lib/create-response";
import { getZodErrorMessages } from "~/lib/utils";
import { MESSAGES } from "~/constants/messages";
import { useActionAlert } from "~/hooks/use-action-alert";
import { signUpSchema } from "~/schemas/auth.schema";
import DividerWithText from "~/components/ui/divider-with-text";
import { ApiError } from "~/lib/api/client";
import { register } from "~/services/auth.service";

export function meta() {
  const config = SEO_CONFIG.auth.signUp;
  return [
    { title: config.title },
    { name: "description", content: config.description },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const result = signUpSchema.safeParse({
    fullName,
    email,
    password,
    confirmPassword,
  });

  if (result?.error) {
    return createResponse({
      status: "ERR",
      message: getZodErrorMessages(result.error),
    });
  }

  try {
    await register(request, {
      fullName,
      email,
      password,
    });

    return redirect(`/auth/verify-email?email=${email}`);
  } catch (err) {
    const errorMessages: Record<string, string> = {
      AUTH_EMAIL_ALREADY_REGISTERED: MESSAGES.AUTH.USER_ALREADY_EXISTS,
      AUTH_OTP_RATE_LIMITED: MESSAGES.GENERAL.TOO_MANY_REQUESTS,
      AUTH_RESET_PASSWORD_RATE_LIMITED: MESSAGES.GENERAL.TOO_MANY_REQUESTS,
    };

    const message =
      err instanceof ApiError
        ? errorMessages[err.code] || MESSAGES.GENERAL.ERROR
        : MESSAGES.GENERAL.ERROR;

    return createResponse({
      status: "ERR",
      showAlert: true,
      message,
    });
  }
}

export default function SignUp() {
  const fetcher = useFetcher();
  useActionAlert(fetcher.data);

  const isLoading = fetcher.state !== "idle";

  return (
    <>
      <CardHeader>
        <CardTitle className="lg:text-lg">
          ایجاد حساب کاربری در فیدگاه
        </CardTitle>
        <CardDescription>
          برای ثبت‌نام، اطلاعات زیر را وارد کنید.
        </CardDescription>
      </CardHeader>

      <CardContent className="w-full flex flex-col gap-5">
        <fetcher.Form method="POST" className="w-full flex flex-col gap-5">
          <Input
            label="نام و نام خانوادگی"
            placeholder="مهدی کریمی"
            icon={User}
            id="register-name"
            name="fullName"
          />

          <Input
            label="ایمیل"
            placeholder="example@gmail.com"
            icon={Mail}
            id="register-email"
            name="email"
            type="email"
          />

          <div className="flex flex-col gap-2">
            <label
              htmlFor="registerPassword"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              رمز عبور
            </label>
            <Input
              isPassword
              placeholder="••••••••"
              icon={KeyRound}
              id="registerPassword"
              name="password"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="registerConfirmPassword"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              تکرار رمز عبور
            </label>
            <Input
              isPassword
              placeholder="••••••••"
              icon={Lock}
              id="registerConfirmPassword"
              name="confirmPassword"
            />
          </div>

          <ErrorMessage data={fetcher.data} />

          <div className="w-full flex justify-center">
            <SubmitButton
              type="submit"
              label="ثبت‌نام در فیدگاه"
              isLoading={isLoading}
            />
          </div>
        </fetcher.Form>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          قبلاً حساب کاربری دارید؟{" "}
          <Link
            to="/auth/login"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            وارد شوید
          </Link>
        </div>

        <DividerWithText label="یا" />

        <GoogleAuth isLoading={isLoading} redirectTo="/dashboard" />
      </CardContent>
    </>
  );
}
