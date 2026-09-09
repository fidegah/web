import { data, redirect, useFetcher } from "react-router";
import { AuthActionCard } from "~/components/auth/action-card";
import ErrorMessage from "~/components/ui/error-message";
import Input from "~/components/ui/input-custom";
import SubmitButton from "~/components/ui/submit-button";
import type { Route } from "./+types/reset-password";
import { SEO_CONFIG } from "~/constants/seo";
import { KeyRound } from "lucide-react";
import { createResponse } from "~/lib/create-response";
import { getZodErrorMessages } from "~/lib/utils";
import { MESSAGES } from "~/constants/messages";
import { updatePasswordSchema } from "~/schemas/auth.schema";
import { resetPassword } from "~/services/auth.service";

export function meta() {
  const config = SEO_CONFIG.auth.updatePassword;
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
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  const formData = await request.formData();
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const result = updatePasswordSchema.safeParse({
    newPassword,
    confirmPassword,
  });

  if (result?.error) {
    return createResponse({
      status: "ERR",
      message: getZodErrorMessages(result.error),
    });
  }

  try {
    if (!token)
      throw data(null, {
        status: 404,
      });

    await resetPassword({
      token,
      newPassword,
    });

    return redirect("/auth/login?success=password-updated");
  } catch (error) {
    console.error("Password reset flow failed:", error);

    return createResponse({
      status: "ERR",
      message: MESSAGES.AUTH.PASSWORD_UPDATE_ERROR,
    });
  }
}

export default function ResetPassword() {
  const fetcher = useFetcher();

  return (
    <AuthActionCard
      title="تغییر رمز عبور"
      description="لطفاً رمز عبور جدید خود را وارد کنید. (حداقل ۸ کاراکتر ترکیبی)"
    >
      <fetcher.Form className="grid gap-4 lg:gap-6 grid-cols-1" method="POST">
        <Input
          id="update-password-new"
          name="newPassword"
          label="رمز عبور جدید"
          autoComplete="new-password"
          placeholder="رمز عبور جدید را وارد کنید."
          icon={KeyRound}
          isPassword
        />
        <Input
          id="update-password-confirm"
          name="confirmPassword"
          label="تکرار رمز عبور جدید"
          autoComplete="new-password"
          placeholder="تکرار رمز عبور جدید را وارد کنید."
          icon={KeyRound}
          isPassword
        />
        <ErrorMessage data={fetcher.data} />
        <SubmitButton
          className="w-full md:w-1/3 lg:w-1/3"
          label="ذخیره رمز عبور جدید"
          isLoading={fetcher.state !== "idle"}
        />
      </fetcher.Form>
    </AuthActionCard>
  );
}
