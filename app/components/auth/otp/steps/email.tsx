import { Mail } from "lucide-react";
import React, { type ChangeEvent } from "react";
import type { FetcherWithComponents } from "react-router";
import { RippleButton } from "~/components/ui/animate-ui/buttons/ripple";
import ErrorMessage from "~/components/ui/error-message";
import Input from "~/components/ui/input-custom";
import SubmitButton from "~/components/ui/submit-button";
import type { CreateResponse } from "~/types";

interface EmailStepProps {
  fetcher: FetcherWithComponents<CreateResponse<{ isNewUser?: boolean }>>;
  email: string;
  setEmail: (value: string) => void;
  isLoading: boolean;
  onClose: () => void;
}

export default function EmailStep({
  fetcher,
  email,
  setEmail,
  isLoading,
  onClose,
}: EmailStepProps) {
  return (
    <fetcher.Form
      method="POST"
      action="/proxy/auth/otp/send"
      className="w-full flex flex-col gap-4"
    >
      <Input
        label="ایمیل"
        id="email"
        name="email"
        placeholder="example@gmail.com"
        icon={Mail}
        type="email"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
      />

      <ErrorMessage data={fetcher.data} />

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1">
        <SubmitButton
          type="submit"
          label="ارسال کد تایید"
          isLoading={isLoading}
          className="w-full md:w-full lg:w-full"
        />
        <RippleButton
          variant="outline"
          type="button"
          onClick={onClose}
          className="w-full border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
        >
          لغو
        </RippleButton>
      </div>
    </fetcher.Form>
  );
}
