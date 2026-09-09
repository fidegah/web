import { LRUCache } from "lru-cache";

export const cache = new LRUCache<string, any>({
  max: 500,
  ttl: 1000 * 60 * 5,
});

export const CACHE_KEYS = {
  // Auth & Profile
  USER_PROFILE: "user:profile",

  // Workspace Users & Activity
  WORKSPACES_LIST: "workspaces:list",
  WORKSPACE_CURRENT: "workspace:current",
  WORKSPACE_MEMBERSHIP: "workspace:membership",
  WORKSPACE_PUBLIC_CURRENT: "workspace:public:current",
  WORKSPACE_USERS: "workspace:users",
  USER_ACTIVITY_STATUS: "user:activity-status",

  // Notifications
  NOTIFICATIONS_LIST: "notifications:list",

  // Boards
  BOARDS_LIST: "boards:list",
  BOARD_DEFAULT: "boards:default",
  BOARD_DETAIL: (id: string) => `board:${id}`,

  // Posts & Interactions
  POSTS_LIST: "posts:list",
  POST_DETAIL: (id: string) => `post:${id}`,
  POST_VOTES: (id: string) => `post:votes:${id}`,
  POST_COMMENTS: (postId: string) => `posts:${postId}:comments`,
  POST_STATUSES: "posts:statuses",

  // Taxonomies
  CATEGORIES_LIST: "categories:list",
  CATEGORY_DETAIL: (id: string) => `category:${id}`,
  TAGS_LIST: "tags:list",
  TAG_DETAIL: (id: string) => `tag:${id}`,

  // Home Dashboard
  HOME_ACTIVITY_OVERVIEW: "home:activity-overview",
  HOME_HEALTH_SCORE: "home:health-score",
  HOME_POPULAR_ITEMS: "home:popular-items",

  // Roadmap
  ROADMAP_LIST: "roadmap:list",
  ROADMAP_ITEMS: "roadmap:items",

  // SDK Widget
  SDK_WIDGET: "sdk-widget",

  // Others
  CHANGELOGS: "changelogs",
  POLLS: "polls",
  ANNOUNCEMENTS: "announcements",
} as const;

export async function getOrSetCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number,
): Promise<T> {
  const cached = cache.get(key);
  if (cached) return cached as T;

  const fresh = await fetcher();
  cache.set(key, fresh, { ttl });
  return fresh;
}
