// ==========================================
// 1. Auth & User
// ==========================================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  onboardingMeta: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  emailVerified: boolean;
}

export interface ExternalUser {
  id: string;
  workspaceId: string;
  externalId: string;
  fullName: string | null;
  email: string | null;
  avatarUrl: string | null;
  isBanned: boolean;
  bannedAt: string | null;
  createdAt: string;
}

// ==========================================
// 2. Workspace
// ==========================================

export type WorkspaceRole = "owner" | "admin" | "contributor";

export interface Workspace {
  id: string;
  userId: string;
  name: string;
  subdomain: string;
  enforceSecureIdentify: boolean;
  sdkToken: string;
  allowedDomains: string[];
  createdAt: Date;
}

export interface WorkspaceUser {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  isBanned: boolean;
  bannedAt: Date | null;
  createdAt: Date;
  browserName: string | null;
  engineName: string | null;
  deviceModel: string | null;
  osName: string | null;
  fullName: string;
  avatarUrl: string | null;
  email: string;
}

export interface WorkspaceCredentials {
  secretKey: string;
  sdkToken: string;
  allowedDomains: string[];
  enforceSecureIdentify: boolean;
}

// ==========================================
// 3. Board
// ==========================================

export interface Board {
  id: string;
  workspaceId: string;
  title: string;
  description: string | undefined;
  isPrivate: boolean;
  url: string;
  isDefault: boolean;
  postsCount: number;
  createdAt: string;
}

// ==========================================
// 4. Category & Tags
// ==========================================

export interface PostCategory {
  id: string;
  boardId: string;
  name: string;
  workspaceId: string;
  postsCount: string;
  userId: string;
  createdAt: Date;
}

export interface Tag {
  id: string;
  boardId: string;
  name: string;
  workspaceId: number;
  postsCount: number;
  userId: string;
  createdAt: Date;
}

// ==========================================
// 5. Post
// ==========================================

export type PostVisibility = "public" | "private";

export interface Post {
  id: string;
  title: string;
  description?: string;
  statusId: string;
  workspaceId: string;
  boardId: string;
  votesCount: number;
  commentsCount: number;
  categoryId: string;
  visibility: PostVisibility;
  isVoted: boolean;
  updated_at: Date;
  lastInteractionAt: Date;
  createdAt: Date;
  creator: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
  };
}

export interface PostVoter {
  id: string;
  fullName: string;
  avatarUrl: string;
  votedAt: Date;
  isExternal: boolean;
}

export type ToggleVoteResponse = {
  voted: boolean;
  votesCount: number;
};

export interface PostStatus {
  id: string;
  value: string;
  label: string;
  color: string;
  order: number;
  createdAt: Date;
}

export interface PostDetailData {
  user: User;
  workspace: Workspace;
  currentUserRole: WorkspaceRole | null;
  board: Board;
  post: Post;
  postComments: Paginated<PostComment[]>;
  postStatuses: PostStatus[];
  postVoters: Paginated<PostVoter[]>;
  initialPostTags: Tag[];
  postCategory: PostCategory | undefined;
  boardTags: Tag[];
}

// ==========================================
// 6. Comments
// ==========================================

export interface PostComment {
  id: string;
  postId: string;
  userId: string | null;
  externalUserId: string | null;
  content: string;
  parentId: string;
  isSpam: boolean;
  isPinned: boolean;
  isLiked: boolean;
  workspace_Id: number;
  likesCount: number;
  repliesCount: number;
  createdAt: Date;
  updatedAt: string;
  creator: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
  };
}

export type CommentActionState =
  | { mode: "editing"; commentId: string }
  | { mode: "replying"; commentId: string; content: string }
  | null;

// ==========================================
// 7. Roadmap
// ==========================================

export interface Roadmap {
  id: string;
  workspaceId: string;
  userId: string;
  name: string;
  createdAt: Date;
}

export type RoadmapFactorType =
  | "fibonacci"
  | "0-10"
  | "0-100"
  | "stars"
  | "boolean";
export type RoadmapFactorSource = "custom" | "built_in";
export type RoadmapBuiltInMetric = "votes" | "comments" | "age";

export interface RoadmapItem {
  id: string;
  postId: string;
  title: string;
  board: string;
  statusId: string | null;
  votes: number;
  eta: string | null;
  factorValues: Record<string, number>;
  score: number;
}

export interface RoadmapFactor {
  id: string;
  roadmapId: string;
  name: string;
  weight: number;
  isEffort: boolean;
  source: RoadmapFactorSource;
  type: RoadmapFactorType | null;
  metric: RoadmapBuiltInMetric | null;
  createdAt: string;
}

export interface RoadmapItemsResponse {
  items: RoadmapItem[];
  columns: RoadmapFactor[];
}

export interface RoadmapNewFactorState {
  name: string;
  source: RoadmapFactorSource;
  type?: RoadmapFactorType;
  metric?: RoadmapBuiltInMetric;
  weight: number;
  isEffort: boolean;
}

// ==========================================
// 8. Poll
// ==========================================

export type PollType = "single" | "multiple" | "ranked";
export type PollStatus = "not_started" | "active" | "expired";

export interface PollOption {
  id: string;
  createdAt: string;
  pollId: string;
  title: string;
  order: number;
  votesCount: number;
  percentage: number;
  isVoted: boolean;
  userRank: number | null;
}

export interface Poll {
  id: string;
  createdAt: string;
  title: string;
  description: string | null;
  startAt: string;
  endAt: string;
  workspaceId: string;
  type: PollType;
  userId: string;
  options: PollOption[];
  totalVotes: number;
  isVoted: boolean;
  status: PollStatus;
}

// ==========================================
// 9. Changelog
// ==========================================

export interface Changelog {
  id: string;
  title: string;
  content: string;
  tagIds: string[];
  workspaceId: number;
  link: string;
  isLiked: boolean;
  likesCount: number;
  viewsCount: number;
  createdAt: string;
  creator: {
    id: string;
    fullName: string | null;
    avatarUrl: string | null;
  };
}

export interface ChangelogTag {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  color: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 10. Notifications & Support
// ==========================================

export type MessageType = "general" | "info" | "warning" | "error" | "success";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  description: string;
  link: string | null;
  isRead: boolean;
  type: MessageType;
  createdAt: Date;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  type: MessageType;
  isViewed: boolean;
  createdAt: string;
}

export interface Ticket {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  description: string;
}

// ==========================================
// 11. User Activities & Stats
// ==========================================

export interface PostActivity {
  postId: number;
  title: string;
  description: string;
  comments_count: number;
  votesCount: number;
  createdAt: Date;
  hasPosted: boolean;
  hasVoted: boolean;
  hasCommented: boolean;
}

export interface ActivitySummary {
  totalPosts: number;
  postsCreated: number;
  votesGiven: number;
  commentsWritten: number;
}

export interface UserActivityStatus {
  posts: PostActivity[];
  summary: ActivitySummary;
}

// ==========================================
// 12. Analytics & Metrics
// ==========================================

export type MetricType = "posts" | "comments" | "votes";
export type TimeRange = "daily" | "weekly" | "monthly" | "quarterly";

export type PeriodDate = {
  start: string;
  end: string;
};

export type ActivityMetric = {
  current: number;
  previous: number;
  growthRate: number;
};

export interface HomeActivityOverview {
  timeRange: TimeRange;
  period: PeriodDate;
  overview: {
    posts: ActivityMetric;
    comments: ActivityMetric;
    votes: ActivityMetric;
  };
  summary: {
    totalActivity: number;
    averageGrowthRate: number;
  };
}

export type HealthScoreMetrics = {
  responseRate: number;
  avgResponseTime: number | null;
  engagementRate: number;
  resolutionRate: number;
};

export type HealthScoreStatus =
  | "excellent"
  | "good"
  | "fair"
  | "poor"
  | "not_enough_data";

export interface HomeHealthScore {
  healthScore: number;
  status: HealthScoreStatus;
  timeRange: TimeRange;
  metrics: HealthScoreMetrics;
  changes: HealthScoreMetrics & { healthScore: number };
  previousPeriod: HealthScoreMetrics & { healthScore: number };
  recommendations: string[];
  period: {
    current: PeriodDate;
    previous: PeriodDate;
  };
}

export interface PopularPostItem {
  total: number;
  items: {
    id: string;
    title: string;
    boardName: string;
    categoryName: string;
    votesCount: number;
    commentsCount: number;
    popularityScore: number;
    createdAt: string;
  }[];
}

export interface PopularBoardItem {
  total: number;
  items: {
    id: string;
    title: string;
    postsCount: number;
    isPrivate: boolean;
    popularityScore: number;
  }[];
}

export interface PopularStatsItem {
  total: number;
  items: {
    id: string;
    name: string;
    postsCount: number;
    boardCount: number;
    popularityScore: number;
  }[];
}

export type PopularCategoryItem = PopularStatsItem;
export type PopularTagItem = PopularStatsItem;

export interface HomePopularItems {
  timeRange: TimeRange;
  limit: number;
  period: PeriodDate;
  posts: PopularPostItem;
  boards: PopularBoardItem;
  categories: PopularCategoryItem;
  tags: PopularTagItem;
}

export interface SelectionDataType {
  value: string;
  label: string;
}

export interface ApiKey {
  id: number;
  name: string;
  isActive: boolean;
  lastUsedAt: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Paginated<T> {
  data: T;
  pagination: Pagination;
}

export interface CreateResponse<T = unknown> {
  status: "OK" | "ERR";
  showAlert?: boolean;
  message?: string;
  description?: string;
  data?: T;
}
