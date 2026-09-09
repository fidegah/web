import { Shapes } from "lucide-react";
import { createResponse } from "~/lib/create-response";
import { MESSAGES } from "~/constants/messages";
import { data, replace, useFetcher } from "react-router";
import { ERROR_CODE } from "~/constants/errors";
import { SEO_CONFIG } from "~/constants/seo";
import { invalidateCategoriesCache } from "~/lib/cache.utils.server";
import type { Route } from "./+types/categories";
import SettingPageHeader from "~/components/dashboard/settings/setting-page-header";
import SettingsItemCard from "~/components/dashboard/settings/item-card";
import EntityCreateCard from "~/components/dashboard/settings/boards/board/entity-create-card";
import { useActionAlert } from "~/hooks/use-action-alert";
import { getCurrentWorkspace } from "~/services/workspace.service";
import {
  createBoardCategory,
  deleteBoardCategory,
  getBoardCategories,
  getDefaultBoard,
  updateBoardCategory,
} from "~/services/board.service";
import { apiClientContext } from "~/context";

export function meta() {
  return [{ title: SEO_CONFIG.dashboard.setting.categories.title }];
}

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);
  const { boardId } = params;

  try {
    const workspace = await getCurrentWorkspace(api);

    if (!boardId) {
      const defaultBoard = await getDefaultBoard(api, workspace.id);

      if (!defaultBoard.id) {
        return {
          categories: [],
        };
      }

      return replace(
        `/dashboard/settings/boards/${defaultBoard.id}/categories`,
      );
    }

    const categories = await getBoardCategories(api, workspace.id, boardId);

    return { categories };
  } catch (error) {
    console.error("Failed to fetch Categories from API:", error);

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
  const categorieId = formData.get("categorie_id") as string;

  if ((method === "POST" || method === "PATCH") && !name?.toString().trim()) {
    return createResponse({
      status: "ERR",
      message: MESSAGES.VALIDATION.FIELDS.CATEGORY.TITLE_REQUIRED,
    });
  }

  if (!boardId)
    throw data(null, {
      status: 404,
    });

  try {
    const workspace = await getCurrentWorkspace(api);

    switch (method) {
      case "POST":
        await createBoardCategory(api, workspace.id, boardId, {
          name,
        });

        invalidateCategoriesCache(null);

        return createResponse({
          status: "OK",
          showAlert: true,
          message: MESSAGES.CATEGORY.UPDATED,
        });

      case "PATCH":
        if (!categorieId)
          throw new Error("Category ID is required for PATCH requests");

        await updateBoardCategory(api, workspace.id, categorieId, {
          name,
        });

        invalidateCategoriesCache(categorieId);

        return createResponse({
          status: "OK",
          showAlert: true,
          message: MESSAGES.CATEGORY.UPDATED,
        });

      case "DELETE":
        if (!categorieId)
          throw new Error("Category ID is required for DELETE requests");

        await deleteBoardCategory(api, workspace.id, categorieId);

        invalidateCategoriesCache(null);

        return createResponse({
          status: "OK",
          showAlert: true,
          message: MESSAGES.CATEGORY.DELETED,
        });
    }
  } catch (err) {
    const errorMessages: Record<string, string> = {
      POST: MESSAGES.CATEGORY.CREATION_ERROR,
      PATCH: MESSAGES.CATEGORY.UPDATE_ERROR,
      DELETE: MESSAGES.CATEGORY.DELETION_ERROR,
    };

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: errorMessages[method] || MESSAGES.GENERAL.ERROR,
    });
  }
}

export default function CategoriesSettings({
  loaderData,
}: Route.ComponentProps) {
  const deleteFetcher = useFetcher();
  const editFetcher = useFetcher();
  useActionAlert(deleteFetcher.data);
  useActionAlert(editFetcher.data);

  const handleDelete = (categoryId: string) => {
    const formData = new FormData();
    formData.append("categorie_id", String(categoryId));

    deleteFetcher.submit(formData, {
      method: "DELETE",
    });
  };

  const handleEdit = (id: string, name: string) => {
    const formData = new FormData();
    formData.append("categorie_id", String(id));
    formData.append("name", name);

    editFetcher.submit(formData, {
      method: "PATCH",
    });
  };

  const deleteIdRaw = deleteFetcher.formData?.get("categorie_id");
  const deleteLoadingId = deleteIdRaw ? String(deleteIdRaw) : null;

  const editIdRaw = editFetcher.formData?.get("categorie_id");
  const editLoadingId = editIdRaw ? String(editIdRaw) : null;

  return (
    <div className="flex flex-col gap-6">
      <SettingPageHeader
        icon={Shapes}
        title="مدیریت دسته‌بندی‌ها"
        description="در این بخش می‌توانید دسته‌بندی‌ها را ایجاد، ویرایش و بروزرسانی کنید."
      />

      <SettingsItemCard
        listTitle="دسته‌بندی‌های ایجاد شده"
        emptyMessage='شما هنوز هیچ "دسته‌بندی" را ایجاد نکرده‌اید.'
        icon={Shapes}
        items={loaderData.categories}
        deleteLoadingId={deleteLoadingId}
        editLoadingId={editLoadingId}
        onEdit={handleEdit}
        deleteConfirmDialog={{
          title: "حذف دسته بندی",
          description: [
            "با این اقدام تمامی پست های مربوط به این دسته بندی حذف خواهند شد و این عمل غیرقابل برگشت خواهد بود.",
            "برای مشاهده پست های مربوط به این دسته بندی میتوانید به صفحه بازخورد مراجعه و فیلتر پست هارا بر روی دسته بندی مربوطه قرار دهید.",
          ],
          confirmText: "حذف دسته بندی",
          onConfirm(itemId) {
            handleDelete(itemId);
          },
        }}
      />

      <EntityCreateCard
        createTitle="ایجاد دسته‌بندی"
        inputPlaceholder="عنوان دسته‌بندی جدید را وارد کنید"
        submitLabel="ایجاد دسته‌بندی"
        icon={Shapes}
      />
    </div>
  );
}
