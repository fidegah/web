import type { ApiClient } from "~/context";
import { apiRoutes } from "~/lib/api/routes";
import { CACHE_KEYS, getOrSetCache } from "~/lib/cache.server";
import { cleanObject } from "~/lib/utils";
import type {
  Board,
  Changelog,
  ChangelogTag,
  Poll,
  Post,
  PostCategory,
  PostComment,
  PostStatus,
  PostVoter,
  ToggleVoteResponse,
  Workspace,
  WorkspaceUser,
} from "~/types";

type GetPortalPostsParams = Partial<{
  search: string;
  boardId: string;
  statusId: string;
  tagId: string;
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

type CreatePostPayload = {
  boardId: string;
  categoryId?: string;
  title: string;
  description?: string;
};

type CreateCommentInput = {
  content: string;
  parentId?: string;
};

type UpdateCommentInput = Partial<{
  content: string;
  isSpam: boolean;
  isPinned: boolean;
}>;

type GetPortalPaginationParams = Partial<{
  page: number;
  limit: number;
}>;

type GetPortalChangelogsParams = GetPortalPaginationParams & {
  search?: string;
  tagId?: string;
};

type GetPortalPollsParams = GetPortalPaginationParams & {
  search?: string;
  status?: string;
};

type VotePollInput = {
  optionIds: string[];
};

// ==========================================
// Workspaces
// ==========================================

export async function getPortalCurrentWorkspace(
  api: ApiClient,
): Promise<Workspace> {
  const response = await getOrSetCache(CACHE_KEYS.WORKSPACE_CURRENT, () =>
    api.get<Workspace>(apiRoutes.portal.workspaces.current),
  );

  return response.data;
}

export async function getPortalWorkspaceMembership(
  api: ApiClient,
): Promise<WorkspaceUser> {
  const response = await getOrSetCache(CACHE_KEYS.WORKSPACE_MEMBERSHIP, () =>
    api.get<WorkspaceUser>(apiRoutes.portal.workspaces.me),
  );

  return response.data;
}

// ==========================================
// Boards
// ==========================================

export async function getPortalBoards(api: ApiClient): Promise<Board[]> {
  const response = await getOrSetCache(CACHE_KEYS.BOARDS_LIST, () =>
    api.get<Board[]>(apiRoutes.portal.boards.base),
  );

  return response.data;
}

export async function getPortalBoard(
  api: ApiClient,
  boardId: string,
): Promise<Board> {
  const response = await getOrSetCache(CACHE_KEYS.BOARD_DETAIL(boardId), () =>
    api.get<Board>(apiRoutes.portal.boards.byId(boardId)),
  );

  return response.data;
}

export async function getPortalDefaultBoard(api: ApiClient): Promise<Board> {
  const response = await getOrSetCache(CACHE_KEYS.BOARD_DEFAULT, () =>
    api.get<Board>(apiRoutes.portal.boards.default),
  );

  return response.data;
}

// ==========================================
// Polls
// ==========================================

export async function getPortalPolls(
  api: ApiClient,
  params: GetPortalPollsParams = {},
) {
  const cleanedParams = cleanObject(params);
  const cacheKey = `${CACHE_KEYS.POLLS}:portal:${JSON.stringify(cleanedParams)}`;

  const { data, pagination } = await getOrSetCache(cacheKey, () =>
    api.get<Poll[]>(apiRoutes.portal.polls.base, {
      params: cleanedParams,
    }),
  );

  return {
    data,
    pagination,
  };
}

export async function getPortalPoll(
  api: ApiClient,
  pollId: string,
): Promise<Poll> {
  const response = await getOrSetCache(
    `${CACHE_KEYS.POLLS}:portal:${pollId}`,
    () => api.get<Poll>(apiRoutes.portal.polls.byId(pollId)),
  );

  return response.data;
}

export async function PortalVotePoll(
  api: ApiClient,
  pollId: string,
  body: VotePollInput,
): Promise<void> {
  await api.post<void, VotePollInput>(
    apiRoutes.portal.polls.vote(pollId),
    body,
  );
}

export async function removePortalPollVote(
  api: ApiClient,
  pollId: string,
): Promise<void> {
  await api.del(apiRoutes.portal.polls.vote(pollId));
}

// ==========================================
// Posts
// ==========================================

export async function getPortalPosts(
  api: ApiClient,
  params: GetPortalPostsParams = {},
) {
  const cleanedParams = cleanObject(params);
  const cacheKey = `${CACHE_KEYS.POSTS_LIST}:portal:${JSON.stringify(cleanedParams)}`;

  const { data, pagination } = await getOrSetCache(cacheKey, () =>
    api.get<Post[]>(apiRoutes.portal.posts.base, {
      params: cleanedParams,
    }),
  );

  return {
    data,
    pagination,
  };
}

export async function getPortalPost(
  api: ApiClient,
  postId: string,
): Promise<Post> {
  const response = await getOrSetCache(
    `${CACHE_KEYS.POSTS_LIST}:portal:${postId}`,
    () => api.get<Post>(apiRoutes.portal.posts.byId(postId)),
  );

  return response.data;
}

export async function createPortalPost(
  api: ApiClient,
  body: CreatePostInput,
): Promise<Post> {
  const { data } = await api.post<Post, CreatePostPayload>(
    apiRoutes.portal.posts.base,
    body,
  );

  return data;
}

export async function getPortalPostVoters(
  api: ApiClient,
  postId: string,
  params: GetPortalPaginationParams = {},
) {
  const cleanedParams = cleanObject(params);
  const cacheKey = `${CACHE_KEYS.POSTS_LIST}:portal:${postId}:voters:${JSON.stringify(cleanedParams)}`;

  const { data, pagination } = await getOrSetCache(cacheKey, () =>
    api.get<PostVoter[]>(apiRoutes.portal.posts.voters(postId), {
      params: cleanedParams,
    }),
  );

  return {
    data,
    pagination,
  };
}

export async function togglePortalVotePost(
  api: ApiClient,
  postId: string,
): Promise<ToggleVoteResponse> {
  const response = await api.post<ToggleVoteResponse>(
    apiRoutes.portal.posts.vote(postId),
  );

  return response.data;
}

export async function getPortalPostCategory(
  api: ApiClient,
  categoryId: string,
): Promise<PostCategory> {
  const response = await getOrSetCache(
    `${CACHE_KEYS.CATEGORIES_LIST}:category:${categoryId}`,
    () =>
      api.get<PostCategory>(apiRoutes.portal.postCategories.byId(categoryId)),
  );

  return response.data;
}

// ==========================================
// Comments
// ==========================================

export async function getPortalPostComments(
  api: ApiClient,
  postId: string,
  params: GetPortalPaginationParams = {},
) {
  const cleanedParams = cleanObject(params);
  const cacheKey = `${CACHE_KEYS.POSTS_LIST}:portal:${postId}:comments:${JSON.stringify(cleanedParams)}`;

  const { data, pagination } = await getOrSetCache(cacheKey, () =>
    api.get<PostComment[]>(apiRoutes.portal.posts.comments.base(postId), {
      params: cleanedParams,
    }),
  );

  return {
    data,
    pagination,
  };
}

export async function getPortalCommentReplies(
  api: ApiClient,
  commentId: string,
  params: GetPortalPaginationParams = {},
) {
  const cleanedParams = cleanObject(params);
  const cacheKey = `${CACHE_KEYS.POSTS_LIST}:portal:comments:${commentId}:replies:${JSON.stringify(cleanedParams)}`;

  const { data, pagination } = await getOrSetCache(cacheKey, () =>
    api.get(apiRoutes.portal.posts.comments.replies(commentId), {
      params: cleanedParams,
    }),
  );

  return {
    data,
    pagination,
  };
}

export async function createPortalPostComment(
  api: ApiClient,
  postId: string,
  body: CreateCommentInput,
): Promise<PostComment> {
  const payload = cleanObject({
    content: body.content,
    parentId: body.parentId,
  });

  const { data } = await api.post<PostComment, typeof payload>(
    apiRoutes.portal.posts.comments.base(postId),
    payload,
  );

  return data;
}

export async function updatePortalPostComment(
  api: ApiClient,
  commentId: string,
  body: UpdateCommentInput,
): Promise<PostComment> {
  const cleanedBody = cleanObject(body);

  const { data } = await api.patch<PostComment, typeof cleanedBody>(
    apiRoutes.portal.posts.comments.byId(commentId),
    cleanedBody,
  );

  return data;
}

export async function deletePortalPostComment(
  api: ApiClient,
  commentId: string,
): Promise<void> {
  await api.del(apiRoutes.portal.posts.comments.byId(commentId));
}

export async function togglePortalCommentLike(
  api: ApiClient,
  commentId: string,
): Promise<void> {
  await api.post(apiRoutes.portal.posts.comments.like(commentId));
}

// ==========================================
// Post Statuses
// ==========================================

export async function getPortalPostStatuses(
  api: ApiClient,
): Promise<PostStatus[]> {
  const response = await getOrSetCache(
    `${CACHE_KEYS.POSTS_LIST}:portal:statuses`,
    () => api.get<PostStatus[]>(apiRoutes.portal.postStatuses),
  );

  return response.data;
}

// ==========================================
// Changelogs
// ==========================================

export async function getPortalChangelogs(
  api: ApiClient,
  params: GetPortalChangelogsParams = {},
) {
  const cleanedParams = cleanObject(params);
  const cacheKey = `${CACHE_KEYS.CHANGELOGS}:portal:${JSON.stringify(cleanedParams)}`;

  const { data, pagination } = await getOrSetCache(cacheKey, () =>
    api.get<Changelog[]>(apiRoutes.portal.changelogs.base, {
      params: cleanedParams,
    }),
  );

  return {
    data,
    pagination,
  };
}

export async function getPortalChangelog(
  api: ApiClient,
  changelogId: string,
): Promise<Changelog> {
  const response = await getOrSetCache(
    `${CACHE_KEYS.CHANGELOGS}:portal:${changelogId}`,
    () => api.get<Changelog>(apiRoutes.portal.changelogs.byId(changelogId)),
  );

  return response.data;
}

export async function getPortalChangelogTags(
  api: ApiClient,
): Promise<ChangelogTag[]> {
  const cacheKey = `${CACHE_KEYS.CHANGELOGS}:tags`;

  const response = await getOrSetCache(cacheKey, () =>
    api.get<ChangelogTag[]>(apiRoutes.portal.changelogs.tags),
  );

  return response.data;
}

export async function togglePortalChangelogLike(
  api: ApiClient,
  changelogId: string,
): Promise<void> {
  await api.post(apiRoutes.portal.changelogs.like(changelogId));
}
