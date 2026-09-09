import type { ApiClient } from "~/context";
import { apiRoutes } from "~/lib/api/routes";
import { CACHE_KEYS, getOrSetCache } from "~/lib/cache.server";
import { cleanObject } from "~/lib/utils";
import type {
  Board,
  ExternalUser,
  Post,
  PostCategory,
  PostComment,
  PostVoter,
  Tag,
  Workspace,
} from "~/types";

// ==========================================
// Types
// ==========================================

type GetSdkPaginationParams = Partial<{
  page: number;
  limit: number;
}>;

type GetSdkPostsParams = GetSdkPaginationParams & {
  search?: string;
  boardId?: string;
  statusId?: string;
  tagId?: string;
};

type CreatePostInput = {
  boardId: string;
  categoryId: string;
  title: string;
  description: string;
  visibility: "public" | "private";
};

// ==========================================
// Users
// ==========================================

export async function getSdkCurrentUser(
  api: ApiClient,
  sessionId: string,
): Promise<ExternalUser | null> {
  const cacheKey = `${CACHE_KEYS.USER_PROFILE}:sdk:${sessionId}`;

  const response = await getOrSetCache(cacheKey, () =>
    api.get<ExternalUser | null>(apiRoutes.sdk.users.me),
  );

  return response.data;
}

// ==========================================
// Workspaces
// ==========================================

export async function getSdkCurrentWorkspace(
  api: ApiClient,
): Promise<Workspace> {
  const response = await getOrSetCache(
    `${CACHE_KEYS.WORKSPACE_CURRENT}:sdk`,
    () => api.get<Workspace>(apiRoutes.sdk.workspaces.current),
  );

  return response.data;
}

// ==========================================
// Boards
// ==========================================

export async function getSdkBoards(api: ApiClient): Promise<Board[]> {
  const response = await getOrSetCache(`${CACHE_KEYS.BOARDS_LIST}:sdk`, () =>
    api.get<Board[]>(apiRoutes.sdk.boards.base),
  );

  return response.data;
}

export async function getSdkBoard(
  api: ApiClient,
  boardId: string,
): Promise<Board> {
  const response = await getOrSetCache(
    `${CACHE_KEYS.BOARD_DETAIL(boardId)}:sdk`,
    () => api.get<Board>(apiRoutes.sdk.boards.byId(boardId)),
  );

  return response.data;
}

export async function getSdkDefaultBoard(api: ApiClient): Promise<Board> {
  const response = await getOrSetCache(`${CACHE_KEYS.BOARD_DEFAULT}:sdk`, () =>
    api.get<Board>(apiRoutes.sdk.boards.default),
  );

  return response.data;
}

// ==========================================
// Posts
// ==========================================

export async function getSdkPosts(
  api: ApiClient,
  params: GetSdkPostsParams = {},
) {
  const cleanedParams = cleanObject(params);
  const cacheKey = `${CACHE_KEYS.POSTS_LIST}:sdk:${JSON.stringify(cleanedParams)}`;

  const { data, pagination } = await getOrSetCache(cacheKey, () =>
    api.get<Post[]>(apiRoutes.sdk.posts.base, {
      params: cleanedParams,
    }),
  );

  return { data, pagination };
}

export async function getSdkPost(
  api: ApiClient,
  postId: string,
): Promise<Post> {
  const response = await getOrSetCache(
    `${CACHE_KEYS.POSTS_LIST}:sdk:${postId}`,
    () => api.get<Post>(apiRoutes.sdk.posts.byId(postId)),
  );

  return response.data;
}

export async function getSdkPostTags(
  api: ApiClient,
  postId: string,
): Promise<Tag[]> {
  const response = await getOrSetCache(
    `${CACHE_KEYS.POSTS_LIST}:sdk:${postId}:tags`,
    () => api.get<Tag[]>(apiRoutes.sdk.posts.tags(postId)),
  );

  return response.data;
}

export async function getSdkPostVoters(
  api: ApiClient,
  postId: string,
  params: GetSdkPaginationParams = {},
) {
  const cleanedParams = cleanObject(params);
  const cacheKey = `${CACHE_KEYS.POSTS_LIST}:sdk:${postId}:voters:${JSON.stringify(cleanedParams)}`;

  const { data, pagination } = await getOrSetCache(cacheKey, () =>
    api.get<PostVoter[]>(apiRoutes.sdk.posts.voters(postId), {
      params: cleanedParams,
    }),
  );

  return { data, pagination };
}

export async function voteSdkPost(api: ApiClient, postId: string) {
  return api.post(apiRoutes.sdk.posts.vote(postId));
}

export async function createSdkPost(api: ApiClient, body: CreatePostInput) {
  return api.post(apiRoutes.sdk.posts.base, body);
}

// ==========================================
// Comments
// ==========================================

export async function getSdkPostComments(
  api: ApiClient,
  postId: string,
  params: GetSdkPaginationParams = {},
) {
  const cleanedParams = cleanObject(params);
  const cacheKey = `${CACHE_KEYS.POSTS_LIST}:sdk:${postId}:comments:${JSON.stringify(cleanedParams)}`;

  const { data, pagination } = await getOrSetCache(cacheKey, () =>
    api.get<PostComment[]>(apiRoutes.sdk.posts.comments.base(postId), {
      params: cleanedParams,
    }),
  );

  return { data, pagination };
}

export async function getSdkCommentReplies(
  api: ApiClient,
  postId: string,
  commentId: string,
  params: GetSdkPaginationParams = {},
) {
  const cleanedParams = cleanObject(params);
  const cacheKey = `${CACHE_KEYS.POSTS_LIST}:sdk:comments:${commentId}:replies:${JSON.stringify(cleanedParams)}`;

  const { data, pagination } = await getOrSetCache(cacheKey, () =>
    api.get(apiRoutes.sdk.posts.comments.replies(postId, commentId), {
      params: cleanedParams,
    }),
  );

  return { data, pagination };
}

export async function likeSdkComment(
  api: ApiClient,
  postId: string,
  commentId: string,
) {
  return api.post(apiRoutes.sdk.posts.comments.like(postId, commentId));
}

export async function createSdkComment(
  api: ApiClient,
  postId: string,
  data: any,
) {
  return api.post(apiRoutes.sdk.posts.comments.base(postId), data);
}

// ==========================================
// Categories
// ==========================================

export async function getSdkCategories(
  api: ApiClient,
  params: { boardId?: string } = {},
) {
  const cleanedParams = cleanObject(params);
  const cacheKey = `${CACHE_KEYS.CATEGORIES_LIST}:sdk:${JSON.stringify(cleanedParams)}`;

  const response = await getOrSetCache(cacheKey, () =>
    api.get<PostCategory[]>(apiRoutes.sdk.postCategories.base, {
      params: cleanedParams,
    }),
  );

  return response.data;
}

export async function getSdkCategory(
  api: ApiClient,
  categoryId: string,
): Promise<PostCategory> {
  const response = await getOrSetCache(
    `${CACHE_KEYS.CATEGORIES_LIST}:sdk:${categoryId}`,
    () => api.get<PostCategory>(apiRoutes.sdk.postCategories.byId(categoryId)),
  );

  return response.data;
}
