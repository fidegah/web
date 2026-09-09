import { cache, CACHE_KEYS } from "./cache.server";

export function invalidateCacheByPrefix(prefix: string) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

export function invalidateCacheByKey(key: string) {
  cache.delete(key);
}

export function invalidateWorkspacesCache() {
  invalidateCacheByKey(CACHE_KEYS.WORKSPACES_LIST);
  invalidateCacheByPrefix(CACHE_KEYS.WORKSPACE_CURRENT);
}

export function invalidateWorkspaceUsersCache() {
  invalidateCacheByPrefix(CACHE_KEYS.WORKSPACE_USERS);
}

export function invalidateBoardCache(boardId: string | null) {
  invalidateCacheByPrefix(CACHE_KEYS.BOARDS_LIST);

  if (boardId !== null) {
    invalidateCacheByKey(CACHE_KEYS.BOARD_DETAIL(boardId));
  }
}

export function invalidatePostCache(postId: string | null) {
  invalidateCacheByPrefix(CACHE_KEYS.POSTS_LIST);

  if (postId !== null) {
    invalidateCacheByPrefix(CACHE_KEYS.POST_COMMENTS(postId));
    invalidateCacheByKey(CACHE_KEYS.POST_DETAIL(postId));
  }
}

export function invalidatePostVotesCache(postId: string | null) {
  invalidateCacheByPrefix(CACHE_KEYS.POSTS_LIST);

  if (postId !== null) {
    invalidateCacheByKey(CACHE_KEYS.POST_DETAIL(postId));
    invalidateCacheByKey(CACHE_KEYS.POST_VOTES(postId));
  }
}

export function invalidateCategoriesCache(categoryId: string | null) {
  invalidateCacheByPrefix(CACHE_KEYS.CATEGORIES_LIST);

  if (categoryId !== null) {
    invalidateCacheByKey(CACHE_KEYS.CATEGORY_DETAIL(categoryId));
  }
}

export function invalidateTagsCache(tagId: string | null) {
  invalidateCacheByPrefix(CACHE_KEYS.TAGS_LIST);

  if (tagId !== null) {
    invalidateCacheByKey(CACHE_KEYS.TAG_DETAIL(tagId));
  }
}

export function invalidateChangelogCache(changelogId: string | null) {
  invalidateCacheByPrefix(CACHE_KEYS.CHANGELOGS);

  if (changelogId !== null) {
    invalidateCacheByKey(`${CACHE_KEYS.CHANGELOGS}:${changelogId}`);
  }
}

export function invalidatePollCache(pollId: string | null) {
  invalidateCacheByPrefix(CACHE_KEYS.POLLS);

  if (pollId !== null) {
    invalidateCacheByKey(`${CACHE_KEYS.POLLS}:${pollId}`);
  }
}

export function invalidateAnnouncementCache(announcementId: string | null) {
  invalidateCacheByPrefix(CACHE_KEYS.ANNOUNCEMENTS);
  if (announcementId !== null) {
    invalidateCacheByKey(`${CACHE_KEYS.ANNOUNCEMENTS}:${announcementId}`);
  }
}

export function invalidateRoadmapCache(roadmapId: string | null) {
  invalidateCacheByPrefix(CACHE_KEYS.ROADMAP_LIST);
  if (roadmapId !== null) {
    invalidateCacheByKey(`${CACHE_KEYS.ROADMAP_LIST}:${roadmapId}`);
  }
}

export function invalidateRoadmapItemsCache(roadmapItemId: string | null) {
  invalidateCacheByPrefix(CACHE_KEYS.ROADMAP_ITEMS);
  if (roadmapItemId !== null) {
    invalidateCacheByKey(`${CACHE_KEYS.ROADMAP_ITEMS}:${roadmapItemId}`);
  }
}

export function invalidateAllCache() {
  cache.clear();
}
