import { Globe, Trash2, Code, ListPlus } from "lucide-react";
import { Activity, useEffect, useState } from "react";
import SettingPageHeader from "~/components/dashboard/settings/setting-page-header";
import SecretKeyViewer from "~/components/dashboard/settings/workspaces/ecret-key-viewer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { SEO_CONFIG } from "~/constants/seo";
import type { Route } from "./+types";
import { data, useFetcher } from "react-router";
import { ERROR_CODE } from "~/constants/errors";
import { useActionAlert } from "~/hooks/use-action-alert";
import type { CreateResponse } from "~/types";
import Input from "~/components/ui/input-custom";
import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import { Spinner } from "~/components/ui/spinner";
import { updateAllowedDomainsSchema } from "~/schemas/dashboard/workspace";
import { getZodErrorMessages } from "~/lib/utils";
import { createResponse } from "~/lib/create-response";
import { MESSAGES } from "~/constants/messages";
import ErrorMessage from "~/components/ui/error-message";
import { useAlert } from "~/components/alert-context";
import {
  getCurrentWorkspace,
  getWorkspaceCredentials,
  updateAllowedDomains,
} from "~/services/workspace.service";
import { apiClientContext } from "~/context";

export function meta() {
  return [{ title: SEO_CONFIG.dashboard.setting.sdk.title }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);

  try {
    const workspace = await getCurrentWorkspace(api);
    const credentials = await getWorkspaceCredentials(api, workspace.id);

    return { credentials };
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
  const allowed_domains_raw = formData.get("allowed_domains") as string;

  const allowedDomains = allowed_domains_raw
    ? (JSON.parse(allowed_domains_raw) as string[])
    : [];

  const result = updateAllowedDomainsSchema.safeParse({
    allowedDomains,
  });

  if (result?.error) {
    return createResponse({
      status: "ERR",
      message: getZodErrorMessages(result.error),
    });
  }

  try {
    const workspace = await getCurrentWorkspace(api);

    await updateAllowedDomains(api, workspace.id, {
      allowedDomains,
    });

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.ALLOWED_DOMAINS.UPDATE_SUCCESS,
    });
  } catch (error) {
    console.error("Update allowed domains action error:", error);

    return createResponse({
      status: "ERR",
      message: MESSAGES.ALLOWED_DOMAINS.UPDATE_ERROR,
    });
  }
}

export default function SdkSettings({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher<CreateResponse>();
  useActionAlert(fetcher.data);

  const { showAlert } = useAlert();

  const { credentials } = loaderData;
  const [newDomain, setNewDomain] = useState("");
  const [deletingDomain, setDeletingDomain] = useState<string | null>(null);

  const isSubmitting = fetcher.state !== "idle";
  const isAdding = isSubmitting && !deletingDomain;

  const handleAddDomain = () => {
    if (!newDomain.trim()) return;

    if (credentials.allowedDomains.length >= 10) {
      showAlert({ title: MESSAGES.ALLOWED_DOMAINS.MAX_LIMIT, type: "warning" });
      return;
    }

    setDeletingDomain(null);
    const updatedDomains = [
      ...credentials.allowedDomains,
      newDomain.trim().toLowerCase(),
    ];
    const formData = new FormData();
    formData.append("allowed_domains", JSON.stringify(updatedDomains));

    fetcher.submit(formData, { method: "PATCH" });
  };

  const handleRemoveDomain = (domainToRemove: string) => {
    setDeletingDomain(domainToRemove);
    const updatedDomains = credentials.allowedDomains.filter(
      (d) => d !== domainToRemove,
    );
    const formData = new FormData();
    formData.append("allowed_domains", JSON.stringify(updatedDomains));

    fetcher.submit(formData, { method: "PATCH" });
  };

  useEffect(() => {
    if (isSubmitting) return;

    if (fetcher.data?.status === "OK") {
      setNewDomain("");
    }
    setDeletingDomain(null);
  }, [isSubmitting, fetcher.data]);

  return (
    <div className="w-full flex flex-col gap-5">
      <SettingPageHeader
        icon={Code}
        title="تنظیمات پلتفرم و توکن SDK"
        description="مدیریت توکن اختصاصی ابزارک فیدگاه و تعیین دامنه‌های مجاز برای جلوگیری از درخواست‌های غیرمجاز (CORS)."
      />

      <div className="flex flex-col gap-5 max-w-4xl">
        <Card>
          <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <CardTitle>توکن اختصاصی SDK</CardTitle>
            <CardDescription>
              از این توکن برای راه‌اندازی و احراز هویت ویدجت فیدگاه در فرانت‌اند
              خود استفاده کنید.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-5">
            <SecretKeyViewer
              value={credentials.sdkToken}
              label="توکن SDK (SDK Token)"
              description="این توکن در اسکریپت فرانت‌اند شما قرار می‌گیرد."
              disabled={false}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-5">
            <CardTitle>دامنه‌های مجاز (Allowed Origins)</CardTitle>
            <CardDescription>
              لیست دامنه‌هایی که اجازه دارند با این توکن به ابزارک فیدگاه متصل
              شوند را وارد کنید.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6 pt-5">
            <div className="w-full flex items-center gap-3">
              <div className="flex-1">
                <Input
                  id="domain-input"
                  name="domain"
                  placeholder="https://example.com"
                  icon={Globe}
                  className="w-full h-full"
                  ltr
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddDomain()}
                />
              </div>

              <IconButton
                icon={isAdding ? Spinner : ListPlus}
                disabled={isSubmitting || !newDomain.trim()}
                onClick={handleAddDomain}
                size="md"
                title="افزودن دامنه"
                aria-label={
                  newDomain.trim()
                    ? `افزودن دامنه ${newDomain}`
                    : "افزودن دامنه جدید"
                }
              />
            </div>

            <div className="flex items-start gap-2.5 p-3.5 border border-amber-500/20 bg-amber-500/5 rounded-lg text-xs leading-5 text-amber-900 dark:text-amber-200/90">
              <span className="font-bold shrink-0 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded px-1.5 py-0.5 scale-90">
                نکته
              </span>
              <span>
                شما می‌توانید آدرس‌های محلی مانند{" "}
                <code className="font-mono bg-amber-500/10 px-1.5 py-0.5 rounded text-[11px] dir-ltr inline-block text-amber-800 dark:text-amber-300">
                  http://localhost:3000
                </code>{" "}
                را نیز برای محیط توسعه (Development) خود اضافه کنید.
              </span>
            </div>

            <ErrorMessage data={fetcher.data} />

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                دامنه‌های ثبت شده ({credentials.allowedDomains.length})
              </span>

              <Activity
                mode={
                  credentials.allowedDomains.length === 0 ? "visible" : "hidden"
                }
              >
                <div className="text-center p-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-400">
                  هنوز هیچ دامنه‌ای اضافه نشده است. درخواست‌ها از تمام دامنه‌ها
                  مسدود خواهند شد.
                </div>
              </Activity>

              <Activity
                mode={
                  credentials.allowedDomains.length > 0 ? "visible" : "hidden"
                }
              >
                <div className="border border-zinc-100 dark:border-zinc-800 rounded-lg divide-y divide-zinc-100 dark:divide-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30">
                  {credentials.allowedDomains.map((domain) => {
                    const isCurrentDeleting =
                      isSubmitting && deletingDomain === domain;
                    return (
                      <div
                        key={domain}
                        className="flex items-center justify-between p-3"
                      >
                        <span className="font-mono text-sm text-zinc-600 dark:text-zinc-400 dir-ltr select-all">
                          {domain}
                        </span>

                        <IconButton
                          icon={isCurrentDeleting ? Spinner : Trash2}
                          color={[220, 38, 38]}
                          disabled={isSubmitting}
                          onClick={() => handleRemoveDomain(domain)}
                          title="حذف دامنه"
                          aria-label={`حذف دامنه ${domain}`}
                        />
                      </div>
                    );
                  })}
                </div>
              </Activity>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
