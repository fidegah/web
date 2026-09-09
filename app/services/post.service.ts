import type { ApiClient } from "~/context";
import { apiRoutes } from "~/lib/api/routes";
import { CACHE_KEYS, getOrSetCache } from "~/lib/cache.server";
import { cleanObject } from "~/lib/utils";
import type {
  Post,
  PostCategory,
  PostStatus,
  PostVoter,
  Tag,
  ToggleVoteResponse,
} from "~/types";

type GetPostsParams = Partial<{
  page: number;
  limit: number;
  search: string;
  boardId: string;
  tagId: string;
  statusValue: string;
  statusId: string;
  status: "active" | "old";
}>;

type GetPostVotesParams = Partial<{
  page: number;
  limit: number;
}>;

type CreatePostInput = {
  boardId: string;
  categoryId?: string;
  title: string;
  description?: string;
  visibility: "public" | "private";
};

type UpdatePostInput = Partial<{
  boardId: string;
  categoryId: string;
  title: string;
  description: string;
  statusId: string;
}>;

type CreatePostPayload = {
  boardId: string;
  categoryId?: string;
  title: string;
  description?: string;
};

export async function getPosts(
  api: ApiClient,
  workspaceId: string,
  params: GetPostsParams = {},
) {
  const cleanedParams = cleanObject(params);

  const page = cleanedParams.page ?? 1;
  const limit = cleanedParams.limit ?? 30;
  const search = cleanedParams.search ?? "";
  const boardId = cleanedParams.boardId ?? "";
  const tagId = cleanedParams.tagId ?? "";
  const statusValue = cleanedParams.statusValue ?? "";
  const statusId = cleanedParams.statusId ?? "";
  const status = cleanedParams.status ?? "";

  const cacheKey = [
    CACHE_KEYS.POSTS_LIST,
    page,
    limit,
    search,
    boardId,
    tagId,
    statusValue,
    statusId,
    status,
  ].join(":");

  const { data, pagination } = await getOrSetCache(cacheKey, () =>
    api.get<Post[]>(apiRoutes.workspaces.posts.base(workspaceId), {
      params: cleanedParams,
    }),
  );

  return {
    data,
    pagination,
  };
}

export async function getPost(
  api: ApiClient,
  workspaceId: string,
  postId: string,
): Promise<Post> {
  const response = await getOrSetCache(CACHE_KEYS.POST_DETAIL(postId), () =>
    api.get<Post>(apiRoutes.workspaces.posts.byId(workspaceId, postId)),
  );

  return response.data;
}

export async function getLatestPosts(
  api: ApiClient,
  workspaceId: string,
): Promise<Post[]> {
  const { data } = await api.get<Post[]>(
    apiRoutes.workspaces.posts.base(workspaceId),
    {
      params: {
        limit: 1,
      },
    },
  );

  return data;
}

export async function createPost(
  api: ApiClient,
  workspaceId: string,
  body: CreatePostInput,
): Promise<Post> {
  const { data } = await api.post<Post, CreatePostPayload>(
    apiRoutes.workspaces.posts.base(workspaceId),
    body,
  );

  return data;
}

export async function updatePost(
  api: ApiClient,
  workspaceId: string,
  postId: string,
  body: UpdatePostInput,
): Promise<void> {
  const cleanedBody = cleanObject(body);

  await api.patch<void, typeof cleanedBody>(
    apiRoutes.workspaces.posts.byId(workspaceId, postId),
    cleanedBody,
  );
}

export async function getPostTags(
  api: ApiClient,
  workspaceId: string,
  postId: string,
): Promise<Tag[]> {
  const response = await getOrSetCache(
    `${CACHE_KEYS.TAGS_LIST}:post:${postId}`,
    () => api.get<Tag[]>(apiRoutes.workspaces.posts.tags(workspaceId, postId)),
  );

  return response.data;
}

export async function addPostTag(
  api: ApiClient,
  workspaceId: string,
  postId: string,
  tagId: string,
): Promise<Tag> {
  const { data } = await api.post<Tag>(
    apiRoutes.workspaces.posts.tag(workspaceId, postId, tagId),
  );

  return data;
}

export async function removePostTag(
  api: ApiClient,
  workspaceId: string,
  postId: string,
  tagId: string,
): Promise<void> {
  await api.del(apiRoutes.workspaces.posts.tag(workspaceId, postId, tagId));
}

export async function getPostCategory(
  api: ApiClient,
  workspaceId: string,
  categoryId: string,
): Promise<PostCategory> {
  const response = await getOrSetCache(
    `${CACHE_KEYS.CATEGORIES_LIST}:category:${categoryId}`,
    () =>
      api.get<PostCategory>(
        apiRoutes.workspaces.postCategories.byId(workspaceId, categoryId),
      ),
  );

  return response.data;
}

export async function getPostVoters(
  api: ApiClient,
  workspaceId: string,
  postId: string,
  params: GetPostVotesParams = {},
) {
  const cleanedParams = cleanObject(params);
  const page = cleanedParams.page ?? 1;
  const limit = cleanedParams.limit ?? 30;

  const cacheKey = [CACHE_KEYS.POST_VOTES(postId), page, limit].join(":");

  const { data, pagination } = await getOrSetCache(cacheKey, () =>
    api.get<PostVoter[]>(
      apiRoutes.workspaces.posts.voters(workspaceId, postId),
      {
        params: cleanedParams,
      },
    ),
  );

  return {
    data,
    pagination,
  };
}

export async function toggleVotePost(
  api: ApiClient,
  workspaceId: string,
  postId: string,
): Promise<ToggleVoteResponse> {
  const response = await api.post<ToggleVoteResponse>(
    apiRoutes.workspaces.posts.vote(workspaceId, postId),
    undefined,
  );

  return response.data;
}

export async function getPostStatuses(api: ApiClient): Promise<PostStatus[]> {
  const response = await getOrSetCache(CACHE_KEYS.POST_STATUSES, () =>
    api.get<PostStatus[]>(apiRoutes.postStatuses),
  );

  return response.data;
}
