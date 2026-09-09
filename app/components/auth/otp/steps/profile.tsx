import { User } from "lucide-react";
import type { FetcherWithComponents } from "react-router";
import Input from "~/components/ui/input-custom";
import SubmitButton from "~/components/ui/submit-button";
import type { CreateResponse } from "~/types";

interface ProfileStepProps {
  fetcher: FetcherWithComponents<CreateResponse<{ isNewUser?: boolean }>>;
  isLoading: boolean;
}

export default function ProfileStep({ fetcher, isLoading }: ProfileStepProps) {
  return (
    <fetcher.Form
      method="PATCH"
      action="/proxy/users"
      className="w-full flex flex-col gap-4"
    >
      <Input
        label="نام و نام خانوادگی"
        id="fullName"
        name="fullName"
        placeholder="مثلاً: علی محمدی"
        icon={User}
        autoFocus
        required
      />

      <SubmitButton
        type="submit"
        label="تکمیل حساب‌کاربری"
        isLoading={isLoading}
        className="lg:w-1/3"
      />
    </fetcher.Form>
  );
}
