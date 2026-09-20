import { useActionAlert } from "~/hooks/use-action-alert";
import { data, replace, useNavigate } from "react-router";
import { ERROR_CODE } from "~/constants/errors";
import { getCanonicalUrl, SEO_CONFIG } from "~/constants/seo";
import type { Route } from "./+types";
import PortalFeedbackLayout from "~/components/website/portal/layouts";
import { apiClientContext } from "~/context";
import {
  getPortalBoard,
  getPortalBoards,
  getPortalCurrentWorkspace,
  getPortalDefaultBoard,
  getPortalPosts,
} from "~/services/portal.service";

export function meta({ loaderData, location }: Route.MetaArgs) {
  const { workspace, board } = loaderData;
  const workspaceName = workspace.name;
  const boardTitle = board?.id;
  const canonicalUrl = getCanonicalUrl(location.pathname);

  const title = boardTitle
    ? `${board.title} | ${workspaceName}`
    : SEO_CONFIG.portal.home(workspaceName).title;

  const description = boardTitle
    ? `لیست بازخوردها و پیشنهادات بخش ${boardTitle} در ${workspaceName}`
    : SEO_CONFIG.portal.home(workspaceName).description;

  return [
    { title: title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
  ];
}

export async function loader({ params, context, url }: Route.LoaderArgs) {
  const { boardId } = params;
  const api = context.get(apiClientContext);

  if (!boardId) {
    let defaultBoardId: string;

    const defaultBoard = await getPortalDefaultBoard(api);
    defaultBoardId = defaultBoard.id;

    return replace(`/feedback/board/${defaultBoardId}`);
  }

  const postsSearch = url.searchParams.get("postSearch") || "";
  const postsPage = url.searchParams.get("postPage") || "1";

  try {
    const [workspace, board, boards, boardPosts] = await Promise.all([
      getPortalCurrentWorkspace(api),
      getPortalBoard(api, boardId),
      getPortalBoards(api),
      getPortalPosts(api, {
        page: Number(postsPage),
        boardId: boardId,
        search: postsSearch,
        limit: 20,
      }),
    ]);

    return { workspace, boards, board, boardPosts };
  } catch (error) {
    console.error(
      `Failed to fetch boards or posts data (Board ID: ${boardId || "all"}, Search: "${postsSearch}"):`,
      error,
    );

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export default function PortalFeedback({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const navigate = useNavigate();
  useActionAlert(actionData);

  const { boards, board, boardPosts } = loaderData;

  return (
    <PortalFeedbackLayout
      boards={boards}
      board={board}
      posts={boardPosts}
      onBoardClick={(bId) => navigate(`/feedback/board/${bId}`)}
      onPostClick={(pId) => navigate(`post/${pId}`)}
    />
  );
}
