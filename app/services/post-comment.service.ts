import type { ApiClient } from "~/context";
import { apiRoutes } from "~/lib/api/routes";
import { CACHE_KEYS, getOrSetCache } from "~/lib/cache.server";
import { cleanObject } from "~/lib/utils";
import type { PostComment } from "~/types";

type GetCommentsParams = Partial<{
  page: number;
  limit: number;
}>;

type CreateCommentInput = {
  content: string;
  parentId?: string;
  sessionId?: string;
};

type UpdateCommentInput = Partial<{
  content: string;
  isSpam: boolean;
  isPinned: boolean;
}>;

export async function getPostComments(
  api: ApiClient,
  workspaceId: string,
  postId: string,
  params: GetCommentsParams = {},
) {
  const cleanedParams = cleanObject(params);
  const page = cleanedParams.page ?? 1;
  const limit = cleanedParams.limit ?? 30;

  const cacheKey = `${CACHE_KEYS.POST_COMMENTS(postId)}:${page}:${limit}`;

  const { data, pagination } = await getOrSetCache(cacheKey, () =>
    api.get<PostComment[]>(
      apiRoutes.workspaces.posts.comments.base(workspaceId, postId),
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

export async function createPostComment(
  api: ApiClient,
  workspaceId: string,
  postId: string,
  body: CreateCommentInput,
): Promise<PostComment> {
  const payload = cleanObject({
    content: body.content,
    parentId: body.parentId,
    sessionId: body.sessionId,
  });

  const { data } = await api.post<PostComment, typeof payload>(
    apiRoutes.workspaces.posts.comments.base(workspaceId, postId),
    payload,
  );

  return data;
}

export async function updatePostComment(
  api: ApiClient,
  workspaceId: string,
  postId: string,
  commentId: string,
  body: UpdateCommentInput,
): Promise<PostComment> {
  const cleanedBody = cleanObject(body);

  const { data } = await api.patch<PostComment, typeof cleanedBody>(
    apiRoutes.workspaces.posts.comments.byId(workspaceId, postId, commentId),
    cleanedBody,
  );

  return data;
}

export async function deletePostComment(
  api: ApiClient,
  workspaceId: string,
  postId: string,
  commentId: string,
): Promise<void> {
  await api.del(
    apiRoutes.workspaces.posts.comments.byId(workspaceId, postId, commentId),
  );
}

export async function getPostCommentReplies(
  api: ApiClient,
  workspaceId: string,
  postId: string,
  commentId: string,
) {
  const response = await api.get<PostComment>(
    apiRoutes.workspaces.posts.comments.replies(workspaceId, postId, commentId),
  );

  return response.data;
}

export async function getPostCommentsSummary(
  api: ApiClient,
  workspaceId: string,
  postId: string,
) {
  const response = await api.post<{ summary: string }>(
    apiRoutes.workspaces.posts.comments.summary(workspaceId, postId),
  );

  return response.data;
}

export async function toggleCommentLike(
  api: ApiClient,
  workspaceId: string,
  postId: string,
  commentId: string,
): Promise<void> {
  await api.post(
    apiRoutes.workspaces.posts.comments.like(workspaceId, postId, commentId),
  );
}

export async function toggleCommentPin(
  api: ApiClient,
  workspaceId: string,
  postId: string,
  commentId: string,
) {
  await api.post(
    apiRoutes.workspaces.posts.comments.pin(workspaceId, postId, commentId),
  );
}

export async function toggleCommentSpam(
  api: ApiClient,
  workspaceId: string,
  postId: string,
  commentId: string,
) {
  await api.post(
    apiRoutes.workspaces.posts.comments.spam(workspaceId, postId, commentId),
  );
}
