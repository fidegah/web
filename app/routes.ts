import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  ...prefix("proxy", [
    layout("./layouts/proxy-layout.ts", [
      route("boards", "routes/proxy/boards.ts"),
      ...prefix("posts", [
        index("routes/proxy/posts/index.ts"),
        route("similar", "routes/proxy/posts/similar.ts"),
        route("tags", "routes/proxy/posts/tags.ts"),
        route("vote", "routes/proxy/posts/vote.ts"),
        ...prefix("comments", [
          index("routes/proxy/posts/comments/index.ts"),
          route("toggle-like", "routes/proxy/posts/comments/toggle-like.ts"),
          route("toggle-pin", "routes/proxy/posts/comments/toggle-pin.ts"),
          route("summary", "routes/proxy/posts/comments/summary.ts"),
          route("replies", "routes/proxy/posts/comments/replies.ts"),
        ]),
      ]),
      ...prefix("users", [
        index("routes/proxy/users/index.ts"),
        route("toggle-user-ban", "routes/proxy/users/toggle-user-ban.ts"),
      ]),
      ...prefix("changelogs", [
        index("routes/proxy/changelogs/index.ts"),
        route("toggle-like", "routes/proxy/changelogs/toggle-like.ts"),
      ]),
      ...prefix("polls", [
        index("routes/proxy/polls/index.ts"),
        route("vote", "routes/proxy/polls/vote.ts"),
      ]),
      ...prefix("notifications", [
        index("routes/proxy/notifications/index.ts"),
        route("mark-as-read", "routes/proxy/notifications/mark-as-read.ts"),
      ]),
      ...prefix("auth", [
        route("sign-out", "routes/proxy/auth/sign-out.ts"),

        ...prefix("otp", [
          route("send", "routes/proxy/auth/otp/send.ts"),
          route("verify", "routes/proxy/auth/otp/verify.ts"),
        ]),
      ]),
      ...prefix("roadmaps", [
        index("routes/proxy/roadmaps/index.ts"),
        route("factors", "routes/proxy/roadmaps/factors.ts"),
        route("items", "routes/proxy/roadmaps/items.ts"),
      ]),
      route("categories", "routes/proxy/categories.ts"),
      route("announcements/view", "routes/proxy/announcements/view.ts"),
      route("newsletter/subscribe", "routes/proxy/newsletter-subscribe.ts"),
    ]),
  ]),

  layout("./layouts/auth-layout.tsx", [
    ...prefix("auth", [
      route("login", "routes/auth/login.tsx"),
      route("signup", "routes/auth/signup.tsx"),
      route("verify-email", "routes/auth/verify-email.tsx"),
      route("forgot-password", "routes/auth/forgot-password.tsx"),
      route("reset-password", "routes/auth/reset-password.tsx"),
      route("callback", "routes/auth/callback.tsx"),
    ]),
  ]),

  route("onboarding", "routes/onboarding.tsx"),
  route("workspaces", "routes/workspaces.tsx"),

  layout("./layouts/website-layout.tsx", [
    // Public
    index("routes/website/index.tsx"),
    route("contact", "routes/website/public/contact.tsx"),
    route("features", "routes/website/public/features.tsx"),
    route("product-tour", "routes/website/public/product-tour.tsx"),
    route("about-us", "routes/website/public/about-us.tsx"),
    route("privacy", "routes/website/public/privacy.tsx"),
    route("terms", "routes/website/public/terms.tsx"),

    // Portal
    ...prefix("feedback/board/:boardId?", [
      index("routes/website/portal/feedback/index.tsx"),
      route("post/:postId", "routes/website/portal/feedback/post.tsx"),
    ]),

    ...prefix("changelogs", [
      index("routes/website/portal/changelogs/changelogs.tsx"),
      route(":changelogId", "routes/website/portal/changelogs/changelog.tsx"),
    ]),

    ...prefix("polls", [
      index("routes/website/portal/polls/polls.tsx"),
      route(":pollId", "routes/website/portal/polls/poll.tsx"),
    ]),
  ]),

  ...prefix("dashboard", [
    layout("./layouts/dashboard-layout.tsx", [
      index("routes/dashboard/home.tsx"),
      route(
        "feedback/board?/:boardId?/post?/:postId?",
        "routes/dashboard/feedback.tsx",
      ),
      route("create-board", "routes/dashboard/create-board.tsx"),
      route("users/:userId?", "routes/dashboard/users.tsx"),
      route("announcements", "routes/dashboard/announcements.tsx"),
      route("ticket", "routes/dashboard/ticket.tsx"),
      route("api-key", "routes/dashboard/api-key.tsx"),

      route("roadmaps/:roadmapId?", "routes/dashboard/roadmaps.tsx"),

      ...prefix("changelogs", [
        index("routes/dashboard/changelogs/index.tsx"),
        route(
          "manage/:id?",
          "routes/dashboard/changelogs/manage-changelogs.tsx",
        ),
      ]),

      ...prefix("polls", [
        index("routes/dashboard/polls/index.tsx"),
        route("create", "routes/dashboard/polls/create-poll.tsx"),
      ]),

      ...prefix("settings", [
        layout("./layouts/setting-layout.tsx", [
          route("account", "routes/dashboard/settings/account-setting.tsx"),
          ...prefix("workspaces", [
            index("routes/dashboard/settings/workspaces/index.tsx"),
            ...prefix("sdk", [
              index("routes/dashboard/settings/workspaces/sdk/index.tsx"),
              route(
                "enforce-secure-identify",
                "routes/dashboard/settings/workspaces/sdk/enforce-secure-identify.tsx",
              ),
            ]),
          ]),
          ...prefix("boards", [
            route(":boardId?", "routes/dashboard/settings/boards/index.tsx"),
            route(
              ":boardId?/categories",
              "routes/dashboard/settings/boards/categories.tsx",
            ),
            route(
              ":boardId?/tags",
              "routes/dashboard/settings/boards/tags.tsx",
            ),
          ]),
        ]),
      ]),
    ]),
  ]),

  layout("./layouts/sdk-layout.ts", [
    ...prefix("sdk/widget/feedback/board/:boardId?", [
      index("routes/sdk/widget/feedback.tsx"),
      route("post/:postId?", "routes/sdk/widget/post.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
