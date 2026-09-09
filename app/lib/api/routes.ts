export const apiRoutes = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    verifyEmail: "/auth/verify-email",
    sendOtp: "/auth/send-otp",
    verifyOtp: "/auth/verify-otp",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
    google: "/auth/google",
    exchangeCode: "/auth/exchange-code",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },

  users: {
    me: "/users/me",
    meAvatar: "/users/me/avatar",
  },

  workspaces: {
    base: "/workspaces",
    current: "/workspaces/current",
    me: (workspaceId: string) => `/workspaces/${workspaceId}/me`,
    byId: (workspaceId: string) => `/workspaces/${workspaceId}`,
    credentials: (workspaceId: string) =>
      `/workspaces/${workspaceId}/credentials`,
    allowedDomains: (workspaceId: string) =>
      `/workspaces/${workspaceId}/allowed-domains`,
    secureIdentify: (workspaceId: string) =>
      `/workspaces/${workspaceId}/secure-identify`,
    users: {
      base: (workspaceId: string) => `/workspaces/${workspaceId}/users`,
      byId: (workspaceId: string, userId: string) =>
        `/workspaces/${workspaceId}/users/${userId}`,
      ban: (workspaceId: string, userId: string) =>
        `/workspaces/${workspaceId}/users/${userId}/ban`,
      activity: (workspaceId: string, userId: string) =>
        `/workspaces/${workspaceId}/users/${userId}/activity`,
    },

    apiKeys: {
      base: (workspaceId: string) => `/workspaces/${workspaceId}/api-keys`,
      byId: (workspaceId: string, apiKeyId: string) =>
        `/workspaces/${workspaceId}/api-keys/${apiKeyId}`,
    },

    boards: {
      base: (workspaceId: string) => `/workspaces/${workspaceId}/boards`,
      byId: (workspaceId: string, boardId: string) =>
        `/workspaces/${workspaceId}/boards/${boardId}`,
      default: (workspaceId: string) =>
        `/workspaces/${workspaceId}/boards/default`,
      setDefault: (workspaceId: string, boardId: string) =>
        `/workspaces/${workspaceId}/boards/${boardId}/set-default`,
    },

    posts: {
      base: (workspaceId: string) => `/workspaces/${workspaceId}/posts`,
      byId: (workspaceId: string, postId: string) =>
        `/workspaces/${workspaceId}/posts/${postId}`,
      voters: (workspaceId: string, postId: string) =>
        `/workspaces/${workspaceId}/posts/${postId}/voters`,
      vote: (workspaceId: string, postId: string) =>
        `/workspaces/${workspaceId}/posts/${postId}/vote`,
      tags: (workspaceId: string, postId: string) =>
        `/workspaces/${workspaceId}/posts/${postId}/tags`,
      tag: (workspaceId: string, postId: string, tagId: string) =>
        `/workspaces/${workspaceId}/posts/${postId}/tags/${tagId}`,

      comments: {
        base: (workspaceId: string, postId: string) =>
          `/workspaces/${workspaceId}/posts/${postId}/comments`,
        byId: (workspaceId: string, postId: string, commentId: string) =>
          `/workspaces/${workspaceId}/posts/${postId}/comments/${commentId}`,
        replies: (workspaceId: string, postId: string, commentId: string) =>
          `/workspaces/${workspaceId}/posts/${postId}/comments/${commentId}/replies`,
        pin: (workspaceId: string, postId: string, commentId: string) =>
          `/workspaces/${workspaceId}/posts/${postId}/comments/${commentId}/pin`,
        spam: (workspaceId: string, postId: string, commentId: string) =>
          `/workspaces/${workspaceId}/posts/${postId}/comments/${commentId}/spam`,
        like: (workspaceId: string, postId: string, commentId: string) =>
          `/workspaces/${workspaceId}/posts/${postId}/comments/${commentId}/like`,
        summary: (workspaceId: string, postId: string) =>
          `/workspaces/${workspaceId}/posts/${postId}/comments/summary`,
      },
    },

    postCategories: {
      base: (workspaceId: string) =>
        `/workspaces/${workspaceId}/post-categories`,
      byId: (workspaceId: string, categoryId: string) =>
        `/workspaces/${workspaceId}/post-categories/${categoryId}`,
    },

    tags: {
      base: (workspaceId: string) => `/workspaces/${workspaceId}/tags`,
      byId: (workspaceId: string, tagId: string) =>
        `/workspaces/${workspaceId}/tags/${tagId}`,
    },

    dashboard: {
      activityOverview: (workspaceId: string) =>
        `/workspaces/${workspaceId}/dashboard/activity-overview`,
      healthScore: (workspaceId: string) =>
        `/workspaces/${workspaceId}/dashboard/health-score`,
      popularItems: (workspaceId: string) =>
        `/workspaces/${workspaceId}/dashboard/popular-items`,
    },

    changelogs: {
      base: (workspaceId: string) => `/workspaces/${workspaceId}/changelogs`,
      tags: (workspaceId: string) =>
        `/workspaces/${workspaceId}/changelogs/tags`,
      byId: (workspaceId: string, changelogId: string) =>
        `/workspaces/${workspaceId}/changelogs/${changelogId}`,
      like: (workspaceId: string, changelogId: string) =>
        `/workspaces/${workspaceId}/changelogs/${changelogId}/like`,
    },

    polls: {
      base: (workspaceId: string) => `/workspaces/${workspaceId}/polls`,
      byId: (workspaceId: string, pollId: string) =>
        `/workspaces/${workspaceId}/polls/${pollId}`,
    },

    roadmaps: {
      base: (workspaceId: string) => `/workspaces/${workspaceId}/roadmaps`,
      byId: (workspaceId: string, roadmapId: string) =>
        `/workspaces/${workspaceId}/roadmaps/${roadmapId}`,

      factors: {
        base: (workspaceId: string, roadmapId: string) =>
          `/workspaces/${workspaceId}/roadmaps/${roadmapId}/factors`,
        byId: (workspaceId: string, factorId: string) =>
          `/workspaces/${workspaceId}/roadmap-factors/${factorId}`,
      },

      items: {
        base: (workspaceId: string, roadmapId: string) =>
          `/workspaces/${workspaceId}/roadmaps/${roadmapId}/items`,
        byId: (workspaceId: string, itemId: string) =>
          `/workspaces/${workspaceId}/roadmap-items/${itemId}`,
      },
    },

    notifications: {
      base: (workspaceId: string) => `/workspaces/${workspaceId}/notifications`,
      byId: (workspaceId: string, notificationId: string) =>
        `/workspaces/${workspaceId}/notifications/${notificationId}`,
      markAsRead: (workspaceId: string) =>
        `/workspaces/${workspaceId}/notifications/mark-as-read`,
    },

    tickets: {
      base: (workspaceId: string) => `/workspaces/${workspaceId}/tickets`,
    },
  },

  portal: {
    workspaces: {
      current: "portal/workspaces/current",
      me: `portal/workspaces/me`,
    },

    boards: {
      base: "portal/boards",
      default: "portal/boards/default",
      byId: (boardId: string) => `portal/boards/${boardId}`,
    },

    polls: {
      base: "/portal/polls",
      byId: (pollId: string) => `/portal/polls/${pollId}`,
      vote: (pollId: string) => `/portal/polls/${pollId}/vote`,
    },

    posts: {
      base: "/portal/posts",
      byId: (postId: string) => `/portal/posts/${postId}`,
      voters: (postId: string) => `/portal/posts/${postId}/voters`,
      vote: (postId: string) => `/portal/posts/${postId}/vote`,

      comments: {
        base: (postId: string) => `/portal/posts/${postId}/comments`,
        byId: (commentId: string) => `/portal/posts/comments/${commentId}`,
        replies: (commentId: string) =>
          `/portal/posts/comments/${commentId}/replies`,
        like: (commentId: string) => `/portal/posts/comments/${commentId}/like`,
      },
    },

    changelogs: {
      base: "/portal/changelogs",
      byId: (changelogId: string) => `/portal/changelogs/${changelogId}`,
      like: (changelogId: string) => `/portal/changelogs/${changelogId}/like`,
      tags: "/portal/changelogs/tags",
    },

    postStatuses: "/portal/post-statuses",

    postCategories: {
      base: "portal/post-categories",
      byId: (categoryId: string) => `portal/post-categories/${categoryId}`,
    },
  },

  sdk: {
    initSession: "/sdk/init-session",
    identify: "/sdk/identify",

    users: {
      me: "/sdk/users/me",
    },

    workspaces: {
      current: "/sdk/workspaces/current",
    },

    boards: {
      base: "/sdk/boards",
      default: "/sdk/boards/default",
      byId: (boardId: string) => `/sdk/boards/${boardId}`,
    },

    posts: {
      base: "/sdk/posts",
      byId: (postId: string) => `/sdk/posts/${postId}`,
      vote: (postId: string) => `/sdk/posts/${postId}/vote`,
      tags: (postId: string) => `/sdk/posts/${postId}/tags`,
      voters: (postId: string) => `/sdk/posts/${postId}/voters`,

      comments: {
        base: (postId: string) => `/sdk/posts/${postId}/comments`,
        byId: (postId: string, commentId: string) =>
          `/sdk/posts/${postId}/comments/${commentId}`,
        replies: (postId: string, commentId: string) =>
          `/sdk/posts/${postId}/comments/${commentId}/replies`,
        like: (postId: string, commentId: string) =>
          `/sdk/posts/${postId}/comments/${commentId}/like`,
      },
    },

    postCategories: {
      base: "/sdk/post-categories",
      byId: (categoryId: string) => `/sdk/post-categories/${categoryId}`,
    },
  },

  postStatuses: "/post-statuses",

  announcements: {
    base: "/announcements",
    view: (announcementId: string) => `/announcements/${announcementId}/view`,
  },

  contact: "/contact",

  newsletter: {
    subscribe: "/newsletter/subscribe",
  },
} as const;
