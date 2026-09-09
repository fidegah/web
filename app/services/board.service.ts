import type { ApiClient } from "~/context";
import { apiRoutes } from "~/lib/api/routes";
import { CACHE_KEYS, getOrSetCache } from "~/lib/cache.server";
import { cleanObject } from "~/lib/utils";
import type { Board, PostCategory } from "~/types";

type CreateBoardInput = {
  title: string;
  url: string;
  isPrivate: boolean;
};

type UpdateBoardInput = Partial<{
  title: string;
  description: string;
  url: string;
  isPrivate: boolean;
}>;

type CreateBoardCategoryInput = {
  name: string;
};

type UpdateBoardCategoryInput = Partial<{
  name: string;
}>;

export async function getBoards(
  api: ApiClient,
  workspaceId: string,
): Promise<Board[]> {
  const response = await getOrSetCache(CACHE_KEYS.BOARDS_LIST, () =>
    api.get<Board[]>(apiRoutes.workspaces.boards.base(workspaceId)),
  );

  return response.data;
}

export async function getBoard(
  api: ApiClient,
  workspaceId: string,
  boardId: string,
): Promise<Board> {
  const response = await getOrSetCache(CACHE_KEYS.BOARD_DETAIL(boardId), () =>
    api.get<Board>(apiRoutes.workspaces.boards.byId(workspaceId, boardId)),
  );

  return response.data;
}

export async function getDefaultBoard(
  api: ApiClient,
  workspaceId: string,
): Promise<Board> {
  const response = await getOrSetCache(CACHE_KEYS.BOARD_DEFAULT, () =>
    api.get<Board>(apiRoutes.workspaces.boards.default(workspaceId)),
  );

  return response.data;
}

export async function updateBoard(
  api: ApiClient,
  workspaceId: string,
  boardId: string,
  body: UpdateBoardInput,
): Promise<void> {
  const cleanedBody = cleanObject(body);

  await api.patch<void, typeof cleanedBody>(
    apiRoutes.workspaces.boards.byId(workspaceId, boardId),
    cleanedBody,
  );
}

export async function createBoard(
  api: ApiClient,
  workspaceId: string,
  body: CreateBoardInput,
): Promise<Board> {
  const response = await api.post<Board, CreateBoardInput>(
    apiRoutes.workspaces.boards.base(workspaceId),
    body,
  );

  return response.data;
}

export async function getBoardCategories(
  api: ApiClient,
  workspaceId: string,
  boardId: string,
): Promise<PostCategory[]> {
  const { data } = await api.get<PostCategory[]>(
    apiRoutes.workspaces.postCategories.base(workspaceId),
    { params: { boardId } },
  );

  return data;
}

export async function createBoardCategory(
  api: ApiClient,
  workspaceId: string,
  boardId: string,
  body: CreateBoardCategoryInput,
): Promise<PostCategory> {
  const { data } = await api.post<
    PostCategory,
    { boardId: string } & CreateBoardCategoryInput
  >(apiRoutes.workspaces.postCategories.base(workspaceId), {
    boardId,
    ...body,
  });

  return data;
}

export async function updateBoardCategory(
  api: ApiClient,
  workspaceId: string,
  categoryId: string,
  body: UpdateBoardCategoryInput,
): Promise<PostCategory> {
  const cleanedBody = cleanObject(body);

  const { data } = await api.patch<PostCategory, typeof cleanedBody>(
    apiRoutes.workspaces.postCategories.byId(workspaceId, categoryId),
    cleanedBody,
  );

  return data;
}

export async function deleteBoardCategory(
  api: ApiClient,
  workspaceId: string,
  categoryId: string,
): Promise<void> {
  await api.del(
    apiRoutes.workspaces.postCategories.byId(workspaceId, categoryId),
  );
}
