import type { Route } from "./+types/boards";
import { data } from "react-router";
import { ERROR_CODE } from "~/constants/errors";
import { apiClientContext } from "~/context";
import { getBoards } from "~/services/board.service";
import { getCurrentWorkspace } from "~/services/workspace.service";

export async function loader({ context }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);

  try {
    const workspace = await getCurrentWorkspace(api);
    const boards = await getBoards(api, workspace.id);

    return boards;
  } catch (error) {
    console.error("Failed to fetch boards from API:", error);

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}
