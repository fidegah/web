import { REGEXP_ONLY_DIGITS } from "input-otp";
import { RefreshCw } from "lucide-react";
import { Activity, type RefObject } from "react";
import type { FetcherWithComponents } from "react-router";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { Spinner } from "~/components/ui/spinner";
import type { CreateResponse } from "~/types";

interface OtpStepProps {
  fetcher: FetcherWithComponents<CreateResponse<{ isNewUser?: boolean }>>;
  formRef: RefObject<HTMLFormElement | null>;
  email: string;
  otpValue: string;
  hasInvalidOtp: boolean;
  isLoading: boolean;
  timer: number;
  onOtpChange: (value: string) => void;
  onResendCode: () => void;
}

export default function OtpStep({
  fetcher,
  formRef,
  email,
  otpValue,
  hasInvalidOtp,
  isLoading,
  timer,
  onOtpChange,
  onResendCode,
}: OtpStepProps) {
  const slotClass = "h-11 w-10 text-base md:h-12 md:w-11 md:text-lg";

  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <fetcher.Form
      ref={formRef}
      method="POST"
      action="/proxy/auth/otp/verify"
      className="w-full flex flex-col items-center justify-center gap-5 py-2 ltr"
    >
      <input type="hidden" name="email" value={email} />

      <InputOTP
        maxLength={6}
        name="code"
        value={otpValue}
        autoFocus
        pattern={REGEXP_ONLY_DIGITS}
        dir="ltr"
        onChange={onOtpChange}
        disabled={isLoading}
      >
        <InputOTPGroup dir="ltr">
          {[0, 1, 2].map((index: number) => (
            <InputOTPSlot
              key={index}
              index={index}
              className={slotClass}
              aria-invalid={hasInvalidOtp}
            />
          ))}
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup dir="ltr">
          {[3, 4, 5].map((index: number) => (
            <InputOTPSlot
              key={index}
              index={index}
              className={slotClass}
              aria-invalid={hasInvalidOtp}
            />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <div className="flex items-center justify-center w-full mt-1 rtl">
        <Activity mode={isLoading ? "visible" : "hidden"}>
          <div className="flex items-center gap-2.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 backdrop-blur-md shadow-sm transition-all duration-300 dark:border-cyan-500/30 dark:bg-cyan-500/10">
            <div className="relative flex items-center justify-center">
              <span className="absolute h-2.5 w-2.5 animate-ping rounded-full bg-cyan-400 opacity-75" />
              <Spinner className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <span className="text-xs font-medium tracking-tight text-cyan-700 dark:text-cyan-300">
              در حال پردازش...
            </span>
          </div>
        </Activity>

        <Activity mode={!isLoading && timer > 0 ? "visible" : "hidden"}>
          <div className="flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 backdrop-blur-md shadow-sm transition-all duration-300 dark:border-cyan-500/30 dark:bg-cyan-500/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
            </span>
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              ارسال مجدد کد تا
            </span>
            <span className="font-mono text-xs font-bold tracking-wider text-cyan-600 dark:text-cyan-400">
              {formatTimer(timer)}
            </span>
          </div>
        </Activity>

        <Activity mode={!isLoading && timer === 0 ? "visible" : "hidden"}>
          <button
            type="button"
            onClick={onResendCode}
            className="group flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-300 shadow-sm transition-all duration-300 hover:border-cyan-500/50 hover:bg-cyan-500/20 hover:shadow-cyan-500/10 active:scale-95 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180 text-cyan-500 dark:text-cyan-400" />
            <span>ارسال مجدد کد تایید</span>
          </button>
        </Activity>
      </div>
    </fetcher.Form>
  );
}
