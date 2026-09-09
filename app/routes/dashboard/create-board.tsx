import { Folder, FolderDot, FolderSymlink } from "lucide-react";
import { redirect, useFetcher } from "react-router";
import Input from "~/components/ui/input-custom";
import { PageHeader } from "~/components/ui/page-header";
import SubmitButton from "~/components/ui/submit-button";
import type { Route } from "./+types/create-board";
import { getSubdomain, getZodErrorMessages } from "~/lib/utils";
import ErrorMessage from "~/components/ui/error-message";
import { useActionAlert } from "~/hooks/use-action-alert";
import { SEO_CONFIG } from "~/constants/seo";
import { Card, CardContent } from "~/components/ui/card";
import { createResponse } from "~/lib/create-response";
import { createBoardSchema } from "~/schemas/dashboard/board";
import { MESSAGES } from "~/constants/messages";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { createBoard } from "~/services/board.service";
import { getCurrentWorkspace } from "~/services/workspace.service";
import { ApiError } from "~/lib/api/client";
import { apiClientContext } from "~/context";
import { invalidateBoardCache } from "~/lib/cache.utils.server";

export function meta() {
  return [{ title: SEO_CONFIG.dashboard.createBoard.title }];
}

export async function loader({ request }: Route.LoaderArgs) {
  return { subdomain: getSubdomain(request) };
}

export async function action({ request, context }: Route.ActionArgs) {
  const api = context.get(apiClientContext);

  const formData = await request.formData();
  const title = formData.get("title")?.toString().trim() as string;
  const url = formData.get("url")?.toString() as string;

  const isPrivate = formData.get("private") === "on";
  const result = createBoardSchema.safeParse({ title, url, isPrivate });

  if (result.error) {
    return createResponse({
      status: "ERR",
      message: getZodErrorMessages(result.error),
    });
  }

  try {
    const workspace = await getCurrentWorkspace(api);
    const board = await createBoard(api, workspace.id, {
      title,
      url: `${workspace.subdomain}.${process.env.VITE_APP_DOMAIN}/${url}`,
      isPrivate,
    });

    invalidateBoardCache(null);

    return redirect(`/dashboard/settings/boards/${board.id}`);
  } catch (err) {
    const errorMessages: Record<string, string> = {
      ALREADY_EXISTS: MESSAGES.BOARD.EXISTS_ERROR,
    };

    const message =
      err instanceof ApiError
        ? errorMessages[err.code] || MESSAGES.GENERAL.ERROR
        : MESSAGES.GENERAL.ERROR;

    return createResponse({
      status: "ERR",
      showAlert: true,
      message,
    });
  }
}

export default function CreateBoard({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher();
  useActionAlert(fetcher.data);

  return (
    <div className="w-full mt-16 md:mt-0 p-3">
      <PageHeader
        icon={Folder}
        title="ایجاد بخش جدید"
        description="بخش‌ها به شما امکان می‌دهند بازخورد کاربران را در موضوعات مختلف به‌صورت جداگانه دریافت و مدیریت کنید."
      />

      <Card className="w-full mt-6">
        <CardContent className="flex flex-col gap-6">
          <fetcher.Form
            method="POST"
            className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Input
              icon={FolderDot}
              id="title"
              label="عنوان"
              placeholder="عنوان بخش جدید را وارد نمایید."
            />
            <Input
              icon={FolderSymlink}
              id="url"
              label="آدرس (URL)"
              placeholder=""
              prefixText={`${loaderData.subdomain}.${
                import.meta.env.VITE_APP_DOMAIN
              }`}
              ltr
            />

            <ErrorMessage data={fetcher.data} />

            <div className="mt-3 flex flex-col gap-2 lg:col-span-2">
              <div className="flex gap-4 items-center">
                <Label htmlFor="private">دسترسی خصوصی</Label>
                <Switch id="private" name="private" />
              </div>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
                بخش‌های عمومی برای همه قابل مشاهده‌اند، در حالی که بخش‌های خصوصی
                فقط برای اعضای داخلی نمایش داده می‌شوند.
              </p>
            </div>

            <SubmitButton
              label="ایجاد بخش"
              className="lg:col-span-2 lg:w-1/4 mt-3"
              isLoading={fetcher.state !== "idle"}
            />
          </fetcher.Form>
        </CardContent>
      </Card>
    </div>
  );
}
