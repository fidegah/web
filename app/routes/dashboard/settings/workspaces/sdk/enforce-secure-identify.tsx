import { ShieldCheck, AlertTriangle } from "lucide-react";
import { useState } from "react";
import SettingPageHeader from "~/components/dashboard/settings/setting-page-header";
import { Switch } from "~/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { SEO_CONFIG } from "~/constants/seo";
import { data, useFetcher } from "react-router";
import { ERROR_CODE } from "~/constants/errors";
import { getFormBoolean } from "~/lib/utils";
import { MESSAGES } from "~/constants/messages";
import { createResponse } from "~/lib/create-response";
import { useActionAlert } from "~/hooks/use-action-alert";
import SecretKeyViewer from "~/components/dashboard/settings/workspaces/ecret-key-viewer";
import type { Route } from "./+types/enforce-secure-identify";
import {
  getCurrentWorkspace,
  getWorkspaceCredentials,
  updateSecureIdentify,
} from "~/services/workspace.service";
import { apiClientContext } from "~/context";

export function meta() {
  return [{ title: SEO_CONFIG.dashboard.setting.enforceSecureIdentify.title }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);

  try {
    const workspace = await getCurrentWorkspace(api);
    const credentials = await getWorkspaceCredentials(api, workspace.id);

    return {
      secretKey: credentials.secretKey,
      enforceSecureIdentify: workspace.enforceSecureIdentify,
    };
  } catch (error) {
    console.error("Failed to fetch workspaceCredentials from API:", error);

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export async function action({ request, context }: Route.ActionArgs) {
  const api = context.get(apiClientContext);
  const formData = await request.formData();

  const enforce = getFormBoolean(formData, "enforce") as boolean;

  try {
    const workspace = await getCurrentWorkspace(api);

    await updateSecureIdentify(api, workspace.id, {
      enforce,
    });

    const successMessage = enforce
      ? MESSAGES.SECURE_IDENTIFY.ACTIVATED
      : MESSAGES.SECURE_IDENTIFY.DEACTIVATED;

    return createResponse({
      status: "OK",
      showAlert: true,
      message: successMessage,
    });
  } catch (error) {
    console.error(
      `Secure Identify ${enforce ? "activation" : "deactivation"} failed:`,
      error,
    );

    const errorMessage = enforce
      ? MESSAGES.SECURE_IDENTIFY.ACTIVATION_ERROR
      : MESSAGES.SECURE_IDENTIFY.DEACTIVATION_ERROR;

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: errorMessage,
    });
  }
}

export default function EnforceSecureIdentify({
  loaderData,
}: Route.ComponentProps) {
  const fetcher = useFetcher();
  useActionAlert(fetcher.data);

  const { secretKey, enforceSecureIdentify } = loaderData;

  const [isEnabled, setIsEnabled] = useState(enforceSecureIdentify);

  const isSubmitting = fetcher.state !== "idle";

  const renderStatus = () => {
    if (isSubmitting) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
          <span>در حال به‌روزرسانی...</span>
        </div>
      );
    }

    if (isEnabled) {
      return (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
          <span>فعال</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
        <span>غیرفعال</span>
      </div>
    );
  };

  const handleToggleEnforce = (checked: boolean) => {
    setIsEnabled(checked);

    const formData = new FormData();
    formData.append("enforce", String(checked));

    fetcher.submit(formData, { method: "post" });
  };

  return (
    <div className="w-fullmax-w-full overflow-hidden flex flex-col gap-5">
      <SettingPageHeader
        icon={ShieldCheck}
        title="الزامی کردن شناسایی امن (Enforce Secure Identify)"
        description="جلوگیری از جعل هویت کاربران در فرانت‌آند و فعال‌سازی تایید اصالت درخواست‌ها با امضای دیجیتال HMAC-SHA256."
      />

      <div className="flex flex-col gap-5 max-w-4xl">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <div className="flex flex-col gap-1">
              <CardTitle>وضعیت شناسایی امن</CardTitle>
              <CardDescription>
                الزامی کردن شناسایی امن (Enforce Secure Identify)
              </CardDescription>
            </div>

            <div className="flex items-center gap-4 self-start sm:self-center">
              {renderStatus()}

              <div className="flex items-center gap-2 border-r border-zinc-200 dark:border-zinc-800 pr-4">
                <Switch
                  id="secure-identify-toggle"
                  checked={isEnabled}
                  disabled={isSubmitting}
                  onCheckedChange={handleToggleEnforce}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent pt-5>
            <SecretKeyViewer
              value={secretKey}
              label="کلید مخفی (Secret Key)"
              description="از این کلید اختصاصی برای امضای دیجیتال استفاده کنید."
              disabled={isSubmitting ?? !isEnabled}
            />
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 bg-amber-500/5 text-amber-900 dark:text-amber-200/90">
          <CardHeader className="flex flex-row items-start gap-3 space-y-0">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 mt-0.5">
              <AlertTriangle size={18} />
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle className="text-sm font-semibold tracking-wide text-amber-800 dark:text-amber-300">
                مواظب باشید؛ این کلید حساس است!
              </CardTitle>
              <CardDescription className="text-xs text-amber-700/80 dark:text-amber-400/70">
                این کلید به منزله رمز عبور سیستم شماست. لطفاً نکات زیر را هنگام
                قرار دادن آن رعایت کنید:
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <ul className="list-disc list-inside text-xs leading-relaxed space-y-2 opacity-90 pr-7 text-amber-800 dark:text-amber-300/90">
              <li>
                <strong className="font-semibold">کجا قرار ندهید:</strong> هرگز
                این کلید را در کدهای فرانت‌اند (کامپوننت‌های سمت کلاینت) یا
                مخازن عمومی گیت‌هاب قرار ندهید.
              </li>
              <li>
                <strong className="font-semibold">کجا قرار دهید:</strong> این
                کلید باید صرفاً در محیط سرور (Backend) و در فایل تنظیمات محیطی{" "}
                <code className="font-mono bg-amber-500/10 px-1.5 py-0.5 rounded text-[11px]">
                  .env
                </code>{" "}
                ذخیره شود.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
