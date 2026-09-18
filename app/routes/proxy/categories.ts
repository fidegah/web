import type { Route } from "./+types/categories";
import { data } from "react-router";
import { z } from "zod";
import { ERROR_CODE } from "~/constants/errors";
import { apiClientContext, type ApiClient } from "~/context";
import { getBoardCategories } from "~/services/board.service";
import { getCurrentWorkspace } from "~/services/workspace.service";

const CategoriesQuerySchema = z.object({
  boardId: z.string().min(1, "Board ID is required"),
});

export async function loader({ request, context, url }: Route.LoaderArgs) {
  const api = context.get(apiClientContext) as ApiClient;

  const rawBoardId = url.searchParams.get("boardId");
  const result = CategoriesQuerySchema.safeParse({ boardId: rawBoardId });

  if (!result.success) {
    throw data(null, { status: 400 });
  }

  const { boardId } = result.data;

  try {
    const workspace = await getCurrentWorkspace(api);
    const categories = await getBoardCategories(api, workspace.id, boardId);

    return categories;
  } catch (error) {
    console.error(
      `Failed to fetch categories for Board ID "${boardId}":`,
      error,
    );

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}
