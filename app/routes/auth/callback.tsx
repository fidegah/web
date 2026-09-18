import { data, Link, redirect, useRouteError } from "react-router";
import { MESSAGES } from "~/constants/messages";
import type { Route } from "./+types/callback";
import { commitSession, getSession } from "~/sessions.server";
import { exchangeCode } from "~/services/auth.service";

type StepStatus = "success" | "error" | "loading" | "pending";

interface StepCardProps {
  label: string;
  status: StepStatus;
  stepNumber?: number;
}

function StepCard({ label, status, stepNumber }: StepCardProps) {
  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 py-2 text-center">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-sm shadow-emerald-500/30">
          ✓
        </div>
        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          {label}
        </span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/5 py-2 text-center">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm shadow-rose-500/30">
          ✕
        </div>
        <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
          {label}
        </span>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="relative flex flex-col items-center gap-1.5 overflow-hidden rounded-xl border border-indigo-500/40 bg-indigo-500/10 py-2 text-center shadow-sm shadow-indigo-500/10">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent dark:via-white/10" />
        <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white dark:bg-indigo-500">
          <span className="h-2 w-2 animate-ping rounded-full bg-white" />
        </div>
        <span className="relative text-[11px] font-bold text-indigo-600 dark:text-indigo-300">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border border-zinc-200/60 bg-zinc-100/50 py-2 text-center opacity-40 dark:border-zinc-800 dark:bg-zinc-800/40">
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 text-[10px] font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
        {stepNumber}
      </div>
      <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
    </div>
  );
}

export async function loader({ request, url }: Route.LoaderArgs) {
  const DEFAULT_AUTH_ERROR = MESSAGES.AUTH.GOOGLE_AUTH_FAILED;

  const code = url.searchParams.get("code");
  const rawRedirectTo = url.searchParams.get("redirectTo");

  let targetRedirect = "/";
  if (rawRedirectTo) {
    const decodedPath = decodeURIComponent(rawRedirectTo);
    if (decodedPath.startsWith("/")) {
      targetRedirect = decodedPath;
    }
  }

  if (!code) {
    return redirect("/auth/login");
  }

  try {
    const tokens = await exchangeCode(code);

    if (!tokens.accessToken) {
      throw data(null, {
        status: 500,
      });
    }

    const { accessToken, refreshToken } = tokens;

    const session = await getSession(request.headers.get("Cookie"));
    session.set("accessToken", accessToken);
    session.set("refreshToken", refreshToken);
    session.set("authStage", "completed");

    return redirect(targetRedirect, {
      headers: {
        "Set-Cookie": await commitSession(session, {
          maxAge: 30 * 60 * 24 * 30,
        }),
      },
    });
  } catch (error: unknown) {
    console.error("Authentication Error:", error);
    throw new Error(DEFAULT_AUTH_ERROR);
  }
}

export function ErrorBoundary() {
  const error = useRouteError();
  const errorMessage =
    error instanceof Error ? error.message : "مشکلی در ورود پیش آمد.";

  return (
    <div className="relative flex flex-col items-center justify-center gap-8 p-6 sm:p-10">
      <div className="pointer-events-none absolute h-44 w-44 animate-pulse rounded-full bg-rose-500/10 blur-3xl dark:bg-rose-500/5" />

      <div className="relative flex items-center justify-center">
        <div className="absolute h-24 w-24 rounded-full border border-rose-500/20 dark:border-rose-500/10" />
        <div className="absolute h-20 w-20 rounded-full border border-dashed border-rose-500/30 dark:border-rose-400/20" />

        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-200/80 bg-white/90 shadow-xl shadow-rose-500/5 backdrop-blur-xl dark:border-rose-900/40 dark:bg-zinc-900/90">
          <svg
            className="h-7 w-7 text-rose-500 dark:text-rose-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5 text-center">
        <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          خطا در احراز هویت
        </h3>
        <p className="max-w-xs text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {errorMessage}
        </p>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-3.5 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/40">
        <div className="grid grid-cols-3 gap-2">
          <StepCard label="اعتبارسنجی" status="success" />
          <StepCard label="ایجاد نشست" status="error" />
          <StepCard label="ورود به برنامه" status="pending" stepNumber={3} />
        </div>
      </div>

      <div className="w-full max-w-sm">
        <Link
          to="/auth/login"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-zinc-950/10 transition-all duration-200 hover:bg-zinc-800 active:scale-[0.98] dark:border-zinc-700/60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          بازگشت به صفحه ورود
        </Link>
      </div>
    </div>
  );
}

export default function GoogleCallback() {
  return (
    <div className="relative flex flex-col items-center justify-center gap-8 p-6 sm:p-10">
      <div className="pointer-events-none absolute h-44 w-44 animate-pulse rounded-full bg-indigo-500/15 blur-3xl" />

      <div className="relative flex items-center justify-center">
        <div className="absolute h-24 w-24 animate-[spin_6s_linear_infinite] rounded-full border border-indigo-500/20" />
        <div className="absolute h-20 w-20 animate-spin rounded-full border-2 border-transparent border-t-indigo-600 border-r-indigo-500/40 dark:border-t-indigo-400 dark:border-r-indigo-400/30" />

        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white/90 shadow-xl shadow-indigo-500/5 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/90">
          <svg className="h-7 w-7" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5 text-center">
        <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          تکمیل ورود با گوگل
        </h3>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          در حال پردازش نشست کاربری و انتقال
        </p>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-3.5 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/40">
        <div className="grid grid-cols-3 gap-2">
          <StepCard label="اعتبارسنجی" status="success" />
          <StepCard label="ایجاد نشست" status="loading" />
          <StepCard label="ورود به برنامه" status="pending" stepNumber={3} />
        </div>
      </div>
    </div>
  );
}
