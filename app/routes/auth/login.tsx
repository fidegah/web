import { Link, redirect, useFetcher } from "react-router";
import { createResponse } from "~/lib/create-response";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { SEO_CONFIG } from "~/constants/seo";

import { CheckCircle2, KeyRound, Mail } from "lucide-react";
import Input from "~/components/ui/input-custom";
import SubmitButton from "~/components/ui/submit-button";
import ErrorMessage from "~/components/ui/error-message";
import GoogleAuth from "~/components/auth/google";
import type { Route } from "./+types/login";
import { getZodErrorMessages } from "~/lib/utils";
import { useActionAlert } from "~/hooks/use-action-alert";
import type { User, Workspace } from "~/types";
import { commitSession, getSession } from "~/sessions.server";
import { Activity } from "react";
import { loginSchema } from "~/schemas/auth.schema";
import DividerWithText from "~/components/ui/divider-with-text";
import { api } from "~/lib/api/client";
import { login } from "~/services/auth.service";
import { apiRoutes } from "~/lib/api/routes";
import { getErrorMessage } from "~/lib/get-error-message";

export function meta() {
  const config = SEO_CONFIG.auth.login;
  return [
    { title: config.title },
    { name: "description", content: config.description },
  ];
}

export async function loader({ url }: Route.LoaderArgs) {
  const isPasswordUpdated =
    url.searchParams.get("success") === "password-updated";

  return { isPasswordUpdated };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const result = loginSchema.safeParse({
    email,
    password,
  });

  if (result?.error) {
    return createResponse({
      status: "ERR",
      message: getZodErrorMessages(result.error),
    });
  }

  try {
    const tokens = await login({
      email,
      password,
    });

    const { accessToken, refreshToken } = tokens;

    const session = await getSession(request.headers.get("Cookie"));
    session.set("accessToken", accessToken);
    session.set("refreshToken", refreshToken);
    session.set("authStage", "completed");

    const commonHeaders = {
      Authorization: `Bearer ${accessToken}`,
    };

    const [user, workspaces] = await Promise.all([
      api
        .get<User>(apiRoutes.users.me, {
          headers: commonHeaders,
        })
        .then((res) => res.data),

      api
        .get<Workspace[]>(apiRoutes.workspaces.base, {
          headers: commonHeaders,
        })
        .then((res) => res.data),
    ]);

    let redirectUrl: string;

    if (!user.onboardingMeta || workspaces.length === 0) {
      redirectUrl = "/onboarding";
    } else {
      redirectUrl = "/dashboard";
    }

    return redirect(redirectUrl, {
      headers: {
        "Set-Cookie": await commitSession(session, {
          maxAge: 30 * 60 * 24 * 30,
        }),
      },
    });
  } catch (err) {
    return createResponse({
      status: "ERR",
      message: getErrorMessage(err),
    });
  }
}

export default function Login({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher();
  useActionAlert(fetcher.data);

  const { isPasswordUpdated } = loaderData;
  const isLoading = fetcher.state !== "idle";

  return (
    <>
      <CardHeader>
        <CardTitle className="lg:text-lg">ورود به حساب فیدگاه</CardTitle>
        <CardDescription>جهت ورود، اطلاعات خود را وارد کنید.</CardDescription>

        <Activity mode={isPasswordUpdated ? "visible" : "hidden"}>
          <div className="mt-2 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-50/50 p-4 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div className="text-sm font-medium leading-relaxed">
              رمز عبور شما با موفقیت تغییر کرد. اکنون می‌توانید وارد شوید.
            </div>
          </div>
        </Activity>
      </CardHeader>

      <CardContent className="w-full flex flex-col gap-5">
        <fetcher.Form method="POST" className="w-full flex flex-col gap-5">
          <Input
            label="ایمیل"
            placeholder="example@gmail.com"
            icon={Mail}
            id="login-email"
            name="email"
          />

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <label
                htmlFor="login-password"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                رمز عبور
              </label>
              <Link
                to="/auth/forgot-password"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                رمز عبور را فراموش کرده‌اید؟
              </Link>
            </div>
            <Input
              isPassword
              placeholder="••••••••"
              icon={KeyRound}
              id="login-password"
              name="password"
            />
          </div>

          <ErrorMessage data={fetcher.data} />

          <div className="w-full flex justify-center">
            <SubmitButton
              type="submit"
              label="ورود به فیدگاه"
              isLoading={isLoading}
              className="md:w-full"
            />
          </div>
        </fetcher.Form>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          حساب کاربری ندارید؟{" "}
          <Link
            to="/auth/signup"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            ثبت‌نام کنید
          </Link>
        </div>

        <DividerWithText label="یا" />

        <GoogleAuth isLoading={isLoading} redirectTo="/dashboard" />
      </CardContent>
    </>
  );
}
