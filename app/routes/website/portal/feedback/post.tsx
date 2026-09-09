import type { Route } from "./+types/post";
import { data } from "react-router";
import { SEO_CONFIG } from "~/constants/seo";
import { ERROR_CODE } from "~/constants/errors";
import PortalFeedbackPostLayout from "~/components/website/portal/layouts/post";
import { getCurrentUser } from "~/services/user.service";
import { apiClientContext } from "~/context";
import { isAuthenticated } from "~/lib/auth-utils.server";
import {
  getPortalCurrentWorkspace,
  getPortalPost,
  getPortalPostCategory,
  getPortalPostComments,
  getPortalPosts,
  getPortalPostVoters,
} from "~/services/portal.service";

export function meta({ loaderData }: Route.MetaArgs) {
  const { workspace, post, postCategory } = loaderData;

  const config = SEO_CONFIG.portal.postDetail(
    workspace.name,
    post.title,
    postCategory?.name,
  );

  return [
    { title: config.title },
    { name: "description", content: config.description },
    { property: "og:title", content: config.title },
    { property: "og:description", content: config.description },
    { name: "robots", content: config.robots },
  ];
}

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const { postId, boardId } = params;

  if (!postId || !boardId)
    throw data(null, {
      status: 400,
    });

  const api = context.get(apiClientContext);
  const isAuth = await isAuthenticated(request);

  const url = new URL(request.url);
  const postsPage = url.searchParams.get("postPage") || "1";
  const commentsPageParam = url.searchParams.get("commentsPage") || "1";
  const postVotesPage = url.searchParams.get("postVotesPage") || "1";

  try {
    let user = null;

    if (isAuth) {
      user = await getCurrentUser(api);
    }

    const workspace = await getPortalCurrentWorkspace(api);

    const [posts, post, postComments, postVoters] = await Promise.all([
      getPortalPosts(api, {
        page: Number(postsPage),
        limit: 20,
      }),
      getPortalPost(api, postId),
      getPortalPostComments(api, postId, {
        page: Number(commentsPageParam),
        limit: 20,
      }),
      getPortalPostVoters(api, postId, {
        limit: 30,
        page: Number(postVotesPage),
      }),
    ]);

    let postCategory;
    if (post.categoryId) {
      postCategory = await getPortalPostCategory(api, post.categoryId);
    }

    return {
      user,
      workspace,
      posts,
      post,
      postCategory,
      postComments,
      postVoters,
    };
  } catch (error) {
    console.error(
      `Failed to fetch post dashboard details (Post ID: ${postId}, Board ID: ${boardId || "unknown"}):`,
      error,
    );

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export default function PortalPost({ loaderData }: Route.ComponentProps) {
  const {
    user,
    workspace,
    posts,
    post,
    postCategory,
    postComments,
    postVoters,
  } = loaderData;

  return (
    <PortalFeedbackPostLayout
      user={user}
      workspace={workspace}
      currentUserRole={null}
      posts={posts}
      post={post}
      postCategory={postCategory}
      postComments={postComments}
      postVoters={postVoters}
    />
  );
}
