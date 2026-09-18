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
  categoryId: string | undefined;
  title: string;
  description: string | undefined;
  visibility: "public" | "private";
};

type CreateCommentInput = {
  content: string;
  parentId?: string;
};

type UpdateCommentInput = Partial<{
  content: string;
}>;

// ==========================================
// Helper
// ==========================================

function getHeaders(sdkToken: string, sessionId?: string) {
  return {
    "x-sdk-token": sdkToken,
    ...(sessionId ? { "x-sdk-session-id": sessionId } : {}),
  };
}

// ==========================================
// Users
// ==========================================

export async function getSdkCurrentUser(
  api: ApiClient,
  sdkToken: string,
  sessionId: string,
): Promise<ExternalUser | null> {
  const cacheKey = `${CACHE_KEYS.USER_PROFILE}:sdk:${sdkToken}:${sessionId}`;

  const response = await getOrSetCache(cacheKey, () =>
    api.get<ExternalUser | null>(apiRoutes.sdk.users.me, {
      headers: getHeaders(sdkToken, sessionId),
    }),
  );

  return response.data;
}

// ==========================================
// Workspaces
// ==========================================

export async function getSdkCurrentWorkspace(
  api: ApiClient,
  sdkToken: string,
): Promise<Workspace> {
  const cacheKey = `${CACHE_KEYS.WORKSPACE_CURRENT}:sdk:${sdkToken}`;

  const response = await getOrSetCache(cacheKey, () =>
    api.get<Workspace>(apiRoutes.sdk.workspaces.current, {
      headers: getHeaders(sdkToken),
    }),
  );

  return response.data;
}

// ==========================================
// Boards
// ==========================================

export async function getSdkBoards(
  api: ApiClient,
  sdkToken: string,
): Promise<Board[]> {
  const cacheKey = `${CACHE_KEYS.BOARDS_LIST}:sdk:${sdkToken}`;

  const response = await getOrSetCache(cacheKey, () =>
    api.get<Board[]>(apiRoutes.sdk.boards.base, {
      headers: getHeaders(sdkToken),
    }),
  );

  return response.data;
}

export async function getSdkBoard(
  api: ApiClient,
  sdkToken: string,
  boardId: string,
): Promise<Board> {
  const cacheKey = `${CACHE_KEYS.BOARD_DETAIL(boardId)}:sdk:${sdkToken}`;

  const response = await getOrSetCache(cacheKey, () =>
    api.get<Board>(apiRoutes.sdk.boards.byId(boardId), {
      headers: getHeaders(sdkToken),
    }),
  );

  return response.data;
}

export async function getSdkDefaultBoard(
  api: ApiClient,
  sdkToken: string,
): Promise<Board> {
  const cacheKey = `${CACHE_KEYS.BOARD_DEFAULT}:sdk:${sdkToken}`;

  const response = await getOrSetCache(cacheKey, () =>
    api.get<Board>(apiRoutes.sdk.boards.default, {
      headers: getHeaders(sdkToken),
    }),
  );

  return response.data;
}

// ==========================================
// Posts
// ==========================================

export async function getSdkPosts(
  api: ApiClient,
  sdkToken: string,
  params: GetSdkPostsParams = {},
  sessionId?: string,
) {
  const cleanedParams = cleanObject(params);
  const cacheKey = `${CACHE_KEYS.POSTS_LIST}:sdk:${sdkToken}:${sessionId ?? "guest"}:${JSON.stringify(cleanedParams)}`;

  const { data, pagination } = await getOrSetCache(cacheKey, () =>
    api.get<Post[]>(apiRoutes.sdk.posts.base, {
      params: cleanedParams,
      headers: getHeaders(sdkToken, sessionId),
    }),
  );

  return { data, pagination };
}

export async function getSdkPost(
  api: ApiClient,
  sdkToken: string,
  postId: string,
  sessionId?: string,
): Promise<Post> {
  const cacheKey = `${CACHE_KEYS.POSTS_LIST}:sdk:${sdkToken}:${postId}:${sessionId ?? "guest"}`;

  const response = await getOrSetCache(cacheKey, () =>
    api.get<Post>(apiRoutes.sdk.posts.byId(postId), {
      headers: getHeaders(sdkToken, sessionId),
    }),
  );

  return response.data;
}

export async function getSdkPostTags(
  api: ApiClient,
  sdkToken: string,
  postId: string,
): Promise<Tag[]> {
  const cacheKey = `${CACHE_KEYS.POSTS_LIST}:sdk:${sdkToken}:${postId}:tags`;

  const response = await getOrSetCache(cacheKey, () =>
    api.get<Tag[]>(apiRoutes.sdk.posts.tags(postId), {
      headers: getHeaders(sdkToken),
    }),
  );

  return response.data;
}

export async function getSdkPostVoters(
  api: ApiClient,
  sdkToken: string,
  postId: string,
  params: GetSdkPaginationParams = {},
) {
  const cleanedParams = cleanObject(params);
  const cacheKey = `${CACHE_KEYS.POSTS_LIST}:sdk:${sdkToken}:${postId}:voters:${JSON.stringify(cleanedParams)}`;

  const { data, pagination } = await getOrSetCache(cacheKey, () =>
    api.get<PostVoter[]>(apiRoutes.sdk.posts.voters(postId), {
      params: cleanedParams,
      headers: getHeaders(sdkToken),
    }),
  );

  return { data, pagination };
}

export async function voteSdkPost(
  api: ApiClient,
  sdkToken: string,
  sessionId: string,
  postId: string,
) {
  return api.post(
    apiRoutes.sdk.posts.vote(postId),
    {},
    {
      headers: getHeaders(sdkToken, sessionId),
    },
  );
}

export async function createSdkPost(
  api: ApiClient,
  sdkToken: string,
  sessionId: string,
  body: CreatePostInput,
) {
  const { data } = await api.post(apiRoutes.sdk.posts.base, body, {
    headers: getHeaders(sdkToken, sessionId),
  });

  return data;
}

// ==========================================
// Comments
// ==========================================

export async function getSdkPostComments(
  api: ApiClient,
  sdkToken: string,
  postId: string,
  params: GetSdkPaginationParams = {},
  sessionId?: string,
) {
  const cleanedParams = cleanObject(params);
  const cacheKey = `${CACHE_KEYS.POSTS_LIST}:sdk:${sdkToken}:${postId}:comments:${sessionId ?? "guest"}:${JSON.stringify(cleanedParams)}`;

  const { data, pagination } = await getOrSetCache(cacheKey, () =>
    api.get<PostComment[]>(apiRoutes.sdk.posts.comments.base(postId), {
      params: cleanedParams,
      headers: getHeaders(sdkToken, sessionId),
    }),
  );

  return { data, pagination };
}

export async function getSdkCommentReplies(
  api: ApiClient,
  sdkToken: string,
  postId: string,
  commentId: string,
  params: GetSdkPaginationParams = {},
  sessionId?: string,
) {
  const cleanedParams = cleanObject(params);
  const cacheKey = `${CACHE_KEYS.POSTS_LIST}:sdk:${sdkToken}:comments:${commentId}:replies:${sessionId ?? "guest"}:${JSON.stringify(cleanedParams)}`;

  const { data, pagination } = await getOrSetCache(cacheKey, () =>
    api.get<PostComment[]>(
      apiRoutes.sdk.posts.comments.replies(postId, commentId),
      {
        params: cleanedParams,
        headers: getHeaders(sdkToken, sessionId),
      },
    ),
  );

  return { data, pagination };
}

export async function toggleSdkCommentLike(
  api: ApiClient,
  sdkToken: string,
  sessionId: string,
  postId: string,
  commentId: string,
) {
  return api.post(
    apiRoutes.sdk.posts.comments.like(postId, commentId),
    {},
    {
      headers: getHeaders(sdkToken, sessionId),
    },
  );
}

export async function createSdkPostComment(
  api: ApiClient,
  sdkToken: string,
  sessionId: string,
  postId: string,
  data: CreateCommentInput,
) {
  return api.post(apiRoutes.sdk.posts.comments.base(postId), data, {
    headers: getHeaders(sdkToken, sessionId),
  });
}

export async function updateSdkPostComment(
  api: ApiClient,
  sdkToken: string,
  sessionId: string,
  postId: string,
  commentId: string,
  body: UpdateCommentInput,
): Promise<PostComment> {
  const cleanedBody = cleanObject(body);

  const { data } = await api.patch<PostComment, typeof cleanedBody>(
    apiRoutes.sdk.posts.comments.byId(postId, commentId),
    cleanedBody,
    { headers: getHeaders(sdkToken, sessionId) },
  );

  return data;
}

export async function deleteSdkPostComment(
  api: ApiClient,
  sdkToken: string,
  sessionId: string,
  postId: string,
  commentId: string,
): Promise<void> {
  await api.del(apiRoutes.sdk.posts.comments.byId(postId, commentId), {
    headers: getHeaders(sdkToken, sessionId),
  });
}

// ==========================================
// Categories
// ==========================================

export async function getSdkCategories(
  api: ApiClient,
  sdkToken: string,
  params: { boardId?: string } = {},
) {
  const cleanedParams = cleanObject(params);
  const cacheKey = `${CACHE_KEYS.CATEGORIES_LIST}:sdk:${sdkToken}:${JSON.stringify(cleanedParams)}`;

  const response = await getOrSetCache(cacheKey, () =>
    api.get<PostCategory[]>(apiRoutes.sdk.postCategories.base, {
      params: cleanedParams,
      headers: getHeaders(sdkToken),
    }),
  );

  return response.data;
}

export async function getSdkCategory(
  api: ApiClient,
  sdkToken: string,
  categoryId: string,
): Promise<PostCategory> {
  const cacheKey = `${CACHE_KEYS.CATEGORIES_LIST}:sdk:${sdkToken}:${categoryId}`;

  const response = await getOrSetCache(cacheKey, () =>
    api.get<PostCategory>(apiRoutes.sdk.postCategories.byId(categoryId), {
      headers: getHeaders(sdkToken),
    }),
  );

  return response.data;
}
