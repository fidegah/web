import { ImagePlus, Mail, UserPen, UserRound } from "lucide-react";
import { useRef, useState } from "react";
import { data, useFetcher } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Input from "~/components/ui/input-custom";
import SubmitButton from "~/components/ui/submit-button";
import type { Route } from "./+types/account-setting";
import { useActionAlert } from "~/hooks/use-action-alert";
import SettingPageHeader from "~/components/dashboard/settings/setting-page-header";
import { Card, CardContent } from "~/components/ui/card";
import { SEO_CONFIG } from "~/constants/seo";
import { ERROR_CODE } from "~/constants/errors";
import { getCurrentUser } from "~/services/user.service";
import { apiClientContext } from "~/context";

export function meta() {
  return [{ title: SEO_CONFIG.dashboard.setting.account.title }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);

  try {
    const user = await getCurrentUser(api);
    return { user };
  } catch (error) {
    console.error("Failed to fetch profile from API:", error);

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export default function AccountSettings({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const fetcher = useFetcher();
  useActionAlert(fetcher.data);

  const [fullName, setFullName] = useState<string>(user?.fullName ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isNameChanged = fullName.trim() !== (user?.fullName ?? "").trim();
  const isAvatarChanged = previewUrl !== null;
  const isButtonDisabled = !isNameChanged && !isAvatarChanged;

  return (
    <div className="w-full">
      <SettingPageHeader
        icon={UserPen}
        title="ویرایش اطلاعات حساب کاربری"
        description="در این بخش می‌توانید اطلاعات حساب کاربری خود را به‌روزرسانی و مدیریت کنید."
      />

      <Card className="w-full mt-6">
        <CardContent className="flex flex-col gap-6">
          <fetcher.Form
            className="w-full flex flex-col"
            method="PATCH"
            action="/proxy/users"
            encType="multipart/form-data"
          >
            <div className="w-full flex justify-center lg:justify-start">
              <input
                type="file"
                id="avatar"
                name="avatar"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setPreviewUrl(URL.createObjectURL(file));
                }}
                accept="image/*"
              />

              <button
                type="button"
                className="relative group size-20 rounded-xl overflow-hidden border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg"
                onClick={() => fileInputRef.current?.click()}
              >
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage
                    src={previewUrl || user?.avatarUrl || ""}
                    alt={`${user?.fullName} Avatar`}
                    className="object-cover w-full h-full group-hover:scale-105 transition-all duration-300"
                  />
                  <AvatarFallback className="w-full h-full rounded-none bg-muted flex items-center justify-center">
                    <ImagePlus className="text-muted-foreground size-8 group-hover:opacity-0 transition-opacity duration-300" />
                  </AvatarFallback>
                </Avatar>

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs text-white font-medium px-2 py-1 rounded-md">
                    تغییر عکس
                  </span>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4 lg:mt-8">
              <Input
                icon={UserRound}
                id="fullName"
                name="fullName"
                label="نام کامل"
                placeholder="لطفا نام کامل خود را وارد نمایید."
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <Input
                isDisabled
                icon={Mail}
                id="email"
                label="ایمیل"
                placeholder="لطفا ایمیل خود را وارد کنید."
                value={user?.email ?? ""}
              />

              <SubmitButton
                label="ثبت تغییرات"
                className="mt-3"
                isLoading={fetcher.state !== "idle"}
                isDisabled={isButtonDisabled}
              />
            </div>
          </fetcher.Form>
        </CardContent>
      </Card>
    </div>
  );
}
