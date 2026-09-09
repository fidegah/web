import { LayoutGrid } from "lucide-react";
import { data, replace, useFetcher } from "react-router";
import { useState } from "react";
import CreateWorkspaceFields from "~/components/craete-workspace-fields";
import SettingPageHeader from "~/components/dashboard/settings/setting-page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import ErrorMessage from "~/components/ui/error-message";
import { createResponse } from "~/lib/create-response";
import SubmitButton from "~/components/ui/submit-button";
import { workspaceSchema } from "~/schemas/dashboard/workspace";
import { getZodErrorMessages } from "~/lib/utils";
import { invalidateWorkspacesCache } from "~/lib/cache.utils.server";
import { MESSAGES } from "~/constants/messages";
import { useActionAlert } from "~/hooks/use-action-alert";
import SettingsItemCard from "~/components/dashboard/settings/item-card";
import type { CreateResponse } from "~/types";
import { ERROR_CODE } from "~/constants/errors";
import { SEO_CONFIG } from "~/constants/seo";
import type { Route } from "./+types";
import {
  createWorkspace,
  deleteWorkspace,
  getWorkspaces,
  updateWorkspace,
} from "~/services/workspace.service";
import { apiClientContext } from "~/context";

export function meta() {
  return [{ title: SEO_CONFIG.dashboard.setting.workspaces.title }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);

  try {
    const workspaces = await getWorkspaces(api);
    return { workspaces };
  } catch (error) {
    console.error("Failed to fetch workspaces from API:", error);
    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export async function action({ request, context }: Route.ActionArgs) {
  const api = context.get(apiClientContext);

  const method = request.method;
  const formData = await request.formData();

  const name = formData.get("name") as string;
  const subdomain = formData.get("subdomain") as string;
  const workspaceId =
    (formData.get("workspaceId") as string) || (formData.get("id") as string);

  try {
    switch (method) {
      case "POST": {
        const result = workspaceSchema.safeParse({ name, subdomain });
        if (result.error) {
          return createResponse({
            status: "ERR",
            message: getZodErrorMessages(result.error),
          });
        }

        await createWorkspace(api, { name, subdomain });
        invalidateWorkspacesCache();

        return createResponse({
          status: "OK",
          showAlert: true,
          message: MESSAGES.WORKSPACE.CREATION,
        });
      }

      case "PATCH": {
        await updateWorkspace(api, workspaceId, { name });
        invalidateWorkspacesCache();

        if (subdomain) {
          const currentUrl = new URL(request.url);
          const hostParts = currentUrl.hostname.split(".");
          hostParts.shift();

          const newHostname = `${subdomain}.${hostParts.join(".")}`;
          const targetUrl = `${currentUrl.protocol}//${newHostname}${currentUrl.port ? ":" + currentUrl.port : ""}${currentUrl.pathname}${currentUrl.search}`;

          return replace(targetUrl);
        }

        return createResponse({
          status: "OK",
          showAlert: true,
          message: MESSAGES.WORKSPACE.UPDATE_ERROR,
        });
      }

      case "DELETE": {
        const workspaces = await getWorkspaces(api);

        if (workspaces.length === 1) {
          return createResponse({
            status: "ERR",
            showAlert: true,
            message: MESSAGES.WORKSPACE.DELETE_LAST_ERROR,
          });
        }

        await deleteWorkspace(api, workspaceId);
        invalidateWorkspacesCache();

        return createResponse({
          status: "OK",
          showAlert: true,
          message: MESSAGES.WORKSPACE.DELETED,
        });
      }
    }
  } catch (err) {
    const errorMessages: Record<string, string> = {
      POST: MESSAGES.WORKSPACE.CREATION_ERROR,
      PATCH: MESSAGES.WORKSPACE.UPDATE_ERROR,
      DELETE: MESSAGES.WORKSPACE.DELETION_ERROR,
    };

    return createResponse({
      status: "ERR",
      message: errorMessages[method] || MESSAGES.WORKSPACE.CREATION_ERROR,
    });
  }
}

export default function WorkspacesSettings({
  loaderData,
}: Route.ComponentProps) {
  const fetcher = useFetcher<CreateResponse>();
  useActionAlert(fetcher.data);

  const { workspaces } = loaderData;

  const [editingWorkspace, setEditingWorkspace] = useState<{
    id: string;
    name: string;
    subdomain: string;
  } | null>(null);

  const handleEditClick = (id: string) => {
    const workspace = workspaces.find((w) => w.id === id);
    if (workspace) {
      setEditingWorkspace(workspace);
    }
  };

  const handleDelete = (workspaceId: string) => {
    fetcher.submit({ workspaceId, id: workspaceId }, { method: "DELETE" });
  };

  const handleUpdate = (id: string, newName: string) => {
    fetcher.submit({ workspaceId: id, id, name: newName }, { method: "PATCH" });
  };

  const isDeleteMethod = fetcher.formMethod === "DELETE";
  const isPatchMethod = fetcher.formMethod === "PATCH";
  const currentFormId =
    fetcher.formData?.get("workspaceId") || fetcher.formData?.get("id");
  const activeId = currentFormId ? String(currentFormId) : null;

  const deleteLoadingId = isDeleteMethod ? activeId : null;
  const editLoadingId = isPatchMethod ? activeId : null;

  return (
    <div className="w-full flex flex-col gap-5">
      <SettingPageHeader
        icon={LayoutGrid}
        title="مدیریت فضاهای کاری"
        description="در این بخش همه فضای‌کاری‌هایی که عضو آن هستید را مشاهده می‌کنید. می‌توانید بین آن‌ها جابه‌جا شوید، فضای جدید ایجاد کنید و تنظیمات هر فضا را جداگانه مدیریت نمایید."
      />

      <SettingsItemCard
        listTitle="فضاهای کاری ایجاد شده"
        items={workspaces.map((w) => ({ id: w.id, name: w.name }))}
        emptyMessage=""
        icon={LayoutGrid}
        onEditClick={handleEditClick}
        activeEditingId={editingWorkspace?.id}
        onCancelEditClick={() => setEditingWorkspace(null)}
        editLoadingId={editLoadingId}
        onEdit={handleUpdate}
        deleteLoadingId={deleteLoadingId}
        deleteConfirmDialog={{
          title: "حذف فضای کاری",
          description: [
            "آیا از حذف این فضای کاری مطمئن هستید؟ این عملیات قابل بازگشت نیست.",
            "توجه داشته باشید که با حذف فضای کاری، تمام اطلاعات مربوط به آن اعم از پست‌ها، نظرات، نظرسنجی‌ها، و گزارش‌تغییرات و... به طور کامل حذف خواهند شد.",
          ],
          confirmText: "حذف فضای کاری",
          onConfirm(itemId) {
            handleDelete(itemId);
          },
        }}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle>
              {editingWorkspace ? "ویرایش فضای‌کاری" : "ایجاد فضای‌کاری"}
            </CardTitle>

            {editingWorkspace && (
              <span className="animate-pulse bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-medium px-2.5 py-0.5 rounded-full">
                حالت ویرایش فعال است
              </span>
            )}
          </div>
          <CardDescription>
            {editingWorkspace
              ? "در این بخش می‌توانید اطلاعات فضای‌کاری انتخاب شده را ویرایش کنید."
              : "بدون یک فضای‌کاری منظم، تیم شما پراکنده و بی‌هدف است. فضای‌کاری جایی است که همه فعالیت‌ها در آن جریان دارد"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <fetcher.Form
            className="w-full flex flex-col gap-6"
            method={editingWorkspace ? "PATCH" : "POST"}
          >
            {editingWorkspace && (
              <>
                <input type="hidden" name="id" value={editingWorkspace.id} />
                <input
                  type="hidden"
                  name="workspaceId"
                  value={editingWorkspace.id}
                />
              </>
            )}

            <CreateWorkspaceFields
              key={editingWorkspace ? editingWorkspace.id : "create"}
              defaultValue={{
                name: editingWorkspace?.name || "",
                subdomain: editingWorkspace?.subdomain || "",
              }}
            />

            <ErrorMessage data={fetcher.data} />

            <div className="flex gap-2 lg:w-1/2">
              <SubmitButton
                className="w-full lg:w-1/2"
                label={editingWorkspace ? "ثبت تغییرات" : "ایجاد فضای‌کاری"}
                isLoading={
                  fetcher.state !== "idle" && fetcher.formMethod !== "DELETE"
                }
              />
              {editingWorkspace && (
                <button
                  type="button"
                  className="px-4 py-2 text-sm border rounded-md hover:bg-secondary"
                  onClick={() => setEditingWorkspace(null)}
                >
                  انصراف
                </button>
              )}
            </div>
          </fetcher.Form>
        </CardContent>
      </Card>
    </div>
  );
}
