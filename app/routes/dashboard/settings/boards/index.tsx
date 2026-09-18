import { Folder } from "lucide-react";
import EditInfomationForm from "~/components/dashboard/settings/boards/board/edit-infomation-form";
import SettingBoardsList from "../../../../components/dashboard/settings/boards";
import { useActionAlert } from "~/hooks/use-action-alert";
import { data, replace } from "react-router";
import SettingPageHeader from "~/components/dashboard/settings/setting-page-header";
import { ERROR_CODE } from "~/constants/errors";
import { SEO_CONFIG } from "~/constants/seo";
import { createResponse } from "~/lib/create-response";
import { MESSAGES } from "~/constants/messages";
import { invalidateBoardCache } from "~/lib/cache.utils.server";
import type { Route } from "./+types";
import {
  getBoard,
  getBoards,
  getDefaultBoard,
  updateBoard,
} from "~/services/board.service";
import { getCurrentWorkspace } from "~/services/workspace.service";
import { apiClientContext } from "~/context";

export function meta() {
  return [{ title: SEO_CONFIG.dashboard.setting.boards.title }];
}

export async function loader({ params, context }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);
  const { boardId } = params;

  try {
    const workspace = await getCurrentWorkspace(api);

    if (!boardId) {
      const defaultBoard = await getDefaultBoard(api, workspace.id);
      return replace(`/dashboard/settings/boards/${defaultBoard.id}`);
    }

    const [boards, board] = await Promise.all([
      getBoards(api, workspace.id),
      getBoard(api, workspace.id, boardId),
    ]);

    return { boards, board, boardId };
  } catch (error) {
    console.error("Failed to fetch boards from API:", error);

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export async function action({ request, params, context }: Route.ActionArgs) {
  const api = context.get(apiClientContext);

  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const url = formData.get("url") as string;
  const isPrivate = formData.get("private") === "on";

  const { boardId } = params;

  if (!boardId)
    throw data(null, {
      status: 404,
    });

  try {
    const workspace = await getCurrentWorkspace(api);

    await updateBoard(api, workspace.id, boardId, {
      title,
      description,
      url,
      isPrivate,
    });

    invalidateBoardCache(boardId ?? null);

    return createResponse({
      status: "OK",
      showAlert: true,
      message: MESSAGES.BOARD.UPDATED,
    });
  } catch (error) {
    console.error(`Failed to update board ${boardId}:`, error);

    return createResponse({
      status: "ERR",
      showAlert: true,
      message: MESSAGES.BOARD.UPDATE_ERROR,
    });
  }
}

export default function BoardsSettings({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const { board, boards, boardId } = loaderData;
  useActionAlert(actionData);

  return (
    <>
      <SettingPageHeader
        icon={Folder}
        title="مدیریت بخش‌ها"
        description="در این بخش می‌توانید بخش‌ها (boards) را ایجاد، ویرایش و بروزرسانی کنید."
      />

      <div className="flex flex-col gap-6">
        <SettingBoardsList boards={boards} boardId={boardId} />

        <EditInfomationForm key={board.id} board={board} />
      </div>
    </>
  );
}
