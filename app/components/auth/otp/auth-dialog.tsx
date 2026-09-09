import { Activity, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import ErrorMessage from "~/components/ui/error-message";
import DividerWithText from "~/components/ui/divider-with-text";
import { useActionAlert } from "~/hooks/use-action-alert";
import { useOtpAuthDialog } from "~/contexts/otp-auth-dialog-context";
import type { CreateResponse } from "~/types";

import EmailStep from "./steps/email";
import OtpStep from "./steps/otp";
import ProfileStep from "./steps/profile";
import GoogleAuth from "../google";

const INITIAL_TIMER_SECONDS = 120;

export default function OtpAuthDialog() {
  const { isOpen, step, setStep, isProfileLocked, closeAuthDialog } =
    useOtpAuthDialog();

  const [email, setEmail] = useState<string>("");
  const [otpValue, setOtpValue] = useState<string>("");
  const [hasInvalidOtp, setHasInvalidOtp] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(INITIAL_TIMER_SECONDS);

  const fetcher = useFetcher<CreateResponse<{ isNewUser?: boolean }>>();
  useActionAlert(fetcher.data);

  const isLoading = fetcher.state !== "idle";
  const formRef = useRef<HTMLFormElement>(null);
  const handledDataRef = useRef<unknown>(null);

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setOtpValue("");
      setHasInvalidOtp(false);
      handledDataRef.current = null;
    }
  }, [isOpen]);

  useEffect(() => {
    if (step !== "otp" || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [step, timer]);

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (handledDataRef.current === fetcher.data) return;

    handledDataRef.current = fetcher.data;

    if (fetcher.data.status === "OK") {
      if (step === "email") {
        setStep("otp");
        setTimer(INITIAL_TIMER_SECONDS);
        setOtpValue("");
      } else if (step === "otp") {
        const isNewUser = fetcher.data.data?.isNewUser;
        if (isNewUser) {
          setStep("profile");
        } else {
          closeAuthDialog();
        }
      } else if (step === "profile") {
        closeAuthDialog();
      }
    }

    if (fetcher.data.status === "ERR" && step === "otp") {
      setHasInvalidOtp(true);
      setOtpValue("");
    }
  }, [fetcher.state, fetcher.data, step, setStep, closeAuthDialog]);

  const handleOtpChange = (value: string): void => {
    setOtpValue(value);
    if (hasInvalidOtp) setHasInvalidOtp(false);

    if (value.length === 6 && formRef.current) {
      fetcher.submit(formRef.current);
    }
  };

  const handleResendCode = (): void => {
    if (timer > 0 || isLoading) return;
    setHasInvalidOtp(false);
    setOtpValue("");
    setTimer(INITIAL_TIMER_SECONDS);

    fetcher.submit(
      { email },
      { method: "POST", action: "/proxy/auth/otp/send" },
    );
  };

  const handleEmailChangeClick = (): void => {
    setHasInvalidOtp(false);
    setOtpValue("");
    setStep("email");
  };

  const handleOpenChange = (open: boolean): void => {
    if (!open) closeAuthDialog();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        dir="rtl"
        showCloseButton={!isProfileLocked}
        onEscapeKeyDown={(e) => isProfileLocked && e.preventDefault()}
        onPointerDownOutside={(e) => isProfileLocked && e.preventDefault()}
        className="min-w-[calc(100%-2rem)] max-h-[60vh] rounded-2xl overflow-hidden md:min-w-2/3"
      >
        <DialogHeader className="text-right">
          <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {step === "email" && "ورود یا ایجاد حساب کاربری"}
            {step === "otp" && "تایید کد ارسال شده"}
            {step === "profile" && "تکمیل اطلاعات حساب"}
          </DialogTitle>

          <DialogDescription className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 lg:text-sm">
            {step === "email" && "برای ادامه، ایمیل خود را وارد کنید."}
            {step === "otp" && (
              <span className="flex items-center gap-1.5 flex-wrap">
                <span>
                  کد ۶ رقمی ارسال شده به{" "}
                  <strong
                    className="font-mono text-zinc-700 dark:text-zinc-200"
                    dir="ltr"
                  >
                    {email}
                  </strong>{" "}
                  را وارد کنید.
                </span>
                <button
                  type="button"
                  onClick={handleEmailChangeClick}
                  className="cursor-pointer font-medium text-cyan-600 transition-colors hover:underline dark:text-cyan-400"
                >
                  (تغییر ایمیل)
                </button>
              </span>
            )}
            {step === "profile" && "لطفاً نام و نام خانوادگی خود را وارد کنید."}
          </DialogDescription>
        </DialogHeader>

        <div className="w-full">
          <Activity mode={step === "email" ? "visible" : "hidden"}>
            <div>
              <EmailStep
                fetcher={fetcher}
                email={email}
                setEmail={setEmail}
                isLoading={isLoading}
                onClose={closeAuthDialog}
              />
              <DividerWithText label="یا" className="mt-6" />
              <GoogleAuth isLoading={isLoading} />
            </div>
          </Activity>

          <Activity mode={step === "otp" ? "visible" : "hidden"}>
            <OtpStep
              fetcher={fetcher}
              formRef={formRef}
              email={email}
              otpValue={otpValue}
              hasInvalidOtp={hasInvalidOtp}
              isLoading={isLoading}
              timer={timer}
              onOtpChange={handleOtpChange}
              onResendCode={handleResendCode}
            />
          </Activity>

          <Activity mode={step === "profile" ? "visible" : "hidden"}>
            <ProfileStep fetcher={fetcher} isLoading={isLoading} />
          </Activity>
        </div>

        <DialogFooter className="sm:justify-start">
          <ErrorMessage data={fetcher.data} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
