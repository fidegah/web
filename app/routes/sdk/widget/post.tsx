import type { Route } from "./+types/post";
import { data } from "react-router";
import { ERROR_CODE } from "~/constants/errors";
import type { User } from "~/types";
import PortalFeedbackPostLayout from "~/components/website/portal/layouts/post";
import { SEO_CONFIG } from "~/constants/seo";
import { apiClientContext } from "~/context";
import {
  getSdkCategory,
  getSdkCurrentUser,
  getSdkCurrentWorkspace,
  getSdkPost,
  getSdkPostComments,
  getSdkPosts,
  getSdkPostVoters,
} from "~/services/sdk.service";

export function meta() {
  const config = SEO_CONFIG.sdk.postWidget;

  return [
    { title: config.title },
    { name: "description", content: config.description },
    { name: "robots", content: config.robots },
  ];
}

export async function loader({ params, context, url }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);
  const { postId, boardId } = params;

  const sessionId = url.searchParams.get("sessionId");
  const sdkToken = url.searchParams.get("sdkToken");
  const theme = url.searchParams.get("theme") as "dark" | "light";

  if (!sessionId || !sdkToken || !postId || !boardId) {
    throw data(null, {
      status: 400,
    });
  }

  const postsPage = url.searchParams.get("postPage") || "1";
  const commentsPageParam = url.searchParams.get("commentsPage") || "1";
  const postVotesPage = url.searchParams.get("postVotesPage") || "1";

  try {
    const [externalUser, workspace, posts, post, postComments, postVoters] =
      await Promise.all([
        getSdkCurrentUser(api, sdkToken, sessionId),
        getSdkCurrentWorkspace(api, sdkToken),
        getSdkPosts(
          api,
          sdkToken,
          { page: Number(postsPage), limit: 20 },
          sessionId,
        ),
        getSdkPost(api, sdkToken, postId, sessionId),
        getSdkPostComments(api, sdkToken, postId, {
          page: Number(commentsPageParam),
          limit: 20,
        }),
        getSdkPostVoters(api, sdkToken, postId, {
          page: Number(postVotesPage),
          limit: 30,
        }),
      ]);

    let postCategory;

    if (post.categoryId) {
      postCategory = await getSdkCategory(api, sdkToken, post.categoryId);
    }

    return {
      sessionId,
      sdkToken,
      externalUser,
      workspace,
      posts,
      post,
      postCategory,
      postComments,
      postVoters,
      theme,
    };
  } catch (error) {
    console.error(
      `SDK Post details fetch failed (Post ID: ${postId}, Board ID: ${boardId || "unknown"}):`,
      error,
    );

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export default function SdkPostWidget({ loaderData }: Route.ComponentProps) {
  const {
    sessionId,
    sdkToken,
    externalUser,
    workspace,
    posts,
    post,
    postCategory,
    postComments,
    postVoters,
    theme,
  } = loaderData;

  const currentUser: User = externalUser
    ? {
        id: String(externalUser.id),
        createdAt: externalUser.createdAt,
        updatedAt: externalUser.createdAt,
        deletedAt: null,
        email: externalUser.email ?? "",
        emailVerified: false,
        fullName: externalUser.fullName ?? "",
        avatarUrl: externalUser.avatarUrl,
        onboardingMeta: null,
      }
    : {
        id: sessionId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        email: "",
        emailVerified: false,
        fullName: "کاربر مهمان",
        avatarUrl: null,
        onboardingMeta: null,
      };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (() => {
              const theme = ${JSON.stringify(theme)};
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            })();
          `,
        }}
      />

      <PortalFeedbackPostLayout
        user={currentUser}
        workspace={workspace}
        currentUserRole={null}
        posts={posts}
        post={post}
        postCategory={postCategory}
        postComments={postComments}
        postVoters={postVoters}
        isWidget={true}
        sessionId={sessionId}
        sdkToken={sdkToken}
      />
    </>
  );
}
