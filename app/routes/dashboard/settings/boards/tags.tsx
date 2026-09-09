import { Tag } from "lucide-react";
import { createResponse } from "~/lib/create-response";
import { MESSAGES } from "~/constants/messages";
import { data, replace, useFetcher } from "react-router";
import { ERROR_CODE } from "~/constants/errors";
import { SEO_CONFIG } from "~/constants/seo";
import { invalidateTagsCache } from "~/lib/cache.utils.server";
import type { Route } from "./+types/tags";
import SettingPageHeader from "~/components/dashboard/settings/setting-page-header";
import SettingsItemCard from "~/components/dashboard/settings/item-card";
import EntityCreateCard from "~/components/dashboard/settings/boards/board/entity-create-card";
import { useActionAlert } from "~/hooks/use-action-alert";
import { getFormNumber } from "~/lib/utils";
import { getDefaultBoard } from "~/services/board.service";
import { getCurrentWorkspace } from "~/services/workspace.service";
import {
  createBoardTag,
  deleteBoardTag,
  getBoardTags,
  updateBoardTag,
} from "~/services/tag.service";
import { apiClientContext } from "~/context";

export function meta() {
  return [{ title: SEO_CONFIG.dashboard.setting.tags.title }];
}

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);
  const { boardId } = params;

  try {
    const workspace = await getCurrentWorkspace(api);

    if (!boardId) {
      const defaultBoard = await getDefaultBoard(api, workspace.id);

      return replace(`/dashboard/settings/boards/${defaultBoard.id}/tags`);
    }

    const tags = await getBoardTags(api, workspace.id, boardId);

    return { tags };
  } catch (error) {
    console.error("Failed to fetch boardTags from API:", error);

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export async function action({ request, params, context }: Route.ActionArgs) {
  const api = context.get(apiClientContext);
  const method = request.method;
  const { boardId } = params;

  const formData = await request.formData();
  const name = formData.get("name") as string;
  const tagId = formData.get("tag_id") as string;

  if (!boardId)
    throw data(null, {
      status: 404,
    });

  if ((method === "POST" || method === "PATCH") && !name?.toString().trim()) {
    return createResponse({
      status: "ERR",
      message: MESSAGES.VALIDATION.FIELDS.TAG.TITLE_REQUIRED,
    });
  }

  try {
    const workspace = await getCurrentWorkspace(api);

    switch (method) {
      case "POST":
        await createBoardTag(api, workspace.id, boardId, {
          name,
        });

        invalidateTagsCache(null);

        return createResponse({
          status: "OK",
          showAlert: true,
          message: MESSAGES.TAG.UPDATED,
        });

      case "PATCH":
        if (!tagId) throw new Error("Tag ID is required for PATCH requests");

        await updateBoardTag(api, workspace.id, tagId, {
          name,
        });

        invalidateTagsCache(tagId);

        return createResponse({
          status: "OK",
          showAlert: true,
          message: MESSAGES.TAG.UPDATED,
        });

      case "DELETE":
        if (!tagId) throw new Error("Tag ID is required for DELETE requests");

        await deleteBoardTag(api, workspace.id, tagId);
        invalidateTagsCache(null);

        return createResponse({
          status: "OK",
          showAlert: true,
          message: MESSAGES.TAG.DELETED,
        });
    }
  } catch (err) {
    const errorMessages: Record<string, string> = {
      POST: MESSAGES.TAG.CREATION_ERROR,
      PATCH: MESSAGES.TAG.UPDATE_ERROR,
      DELETE: MESSAGES.TAG.DELETION_ERROR,
    };

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: errorMessages[method] || MESSAGES.GENERAL.ERROR,
    });
  }
}

export default function TagsSettings({ loaderData }: Route.ComponentProps) {
  const deleteFetcher = useFetcher();
  const editFetcher = useFetcher();
  useActionAlert(deleteFetcher.data);
  useActionAlert(editFetcher.data);

  const handleDelete = (tagId: string) => {
    const formData = new FormData();
    formData.append("tag_id", String(tagId));

    deleteFetcher.submit(formData, {
      method: "DELETE",
    });
  };

  const handleEdit = (id: string, name: string) => {
    const formData = new FormData();
    formData.append("tag_id", String(id));
    formData.append("name", name);

    editFetcher.submit(formData, {
      method: "PATCH",
    });
  };

  const deleteIdRaw = deleteFetcher.formData?.get("tag_id");
  const deleteLoadingId = deleteIdRaw ? String(deleteIdRaw) : null;

  const editIdRaw = editFetcher.formData?.get("tag_id");
  const editLoadingId = editIdRaw ? String(editIdRaw) : null;

  return (
    <div className="flex flex-col gap-6">
      <SettingPageHeader
        icon={Tag}
        title="مدیریت تگ‌ها"
        description="در این بخش می‌توانید تگ‌ها را ایجاد، ویرایش و بروزرسانی کنید."
      />

      <SettingsItemCard
        listTitle="تگ‌های ایجاد شده"
        emptyMessage='شما هنوز هیچ "تگی" را ایجاد نکرده‌اید.'
        icon={Tag}
        items={loaderData.tags}
        onEdit={handleEdit}
        editLoadingId={editLoadingId}
        deleteLoadingId={deleteLoadingId}
        deleteConfirmDialog={{
          title: "حذف تگ",
          description: [
            "آیا از حذف این تگ مطمئن هستید؟ این عملیات قابل بازگشت نیست.",
            "همچنین توجه داشته باشد با حذف تگ پست های مربوط به آن پاک نخواهد شد و فقط تگ حذف میشود.",
          ],
          confirmText: "حذف تگ",
          onConfirm(itemId) {
            handleDelete(itemId);
          },
        }}
      />

      <EntityCreateCard
        createTitle="ایجاد تگ"
        inputPlaceholder="عنوان تگ جدید را وارد کنید"
        submitLabel="ایجاد تگ"
        icon={Tag}
      />
    </div>
  );
}
