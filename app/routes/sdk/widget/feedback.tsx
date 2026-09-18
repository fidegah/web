import { data, useNavigate, useSearchParams } from "react-router";
import { ERROR_CODE } from "~/constants/errors";
import PortalFeedbackLayout from "~/components/website/portal/layouts";
import type { Route } from "./+types/feedback";
import { SEO_CONFIG } from "~/constants/seo";
import {
  getSdkBoard,
  getSdkBoards,
  getSdkCurrentWorkspace,
  getSdkDefaultBoard,
  getSdkPosts,
} from "~/services/sdk.service";
import { apiClientContext } from "~/context";
import { redirect } from "react-router";

export function meta() {
  const config = SEO_CONFIG.sdk.feedbackWidget;

  return [
    { title: config.title },
    { name: "description", content: config.description },
    { name: "robots", content: config.robots },
  ];
}

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);
  const { boardId } = params;
  const url = new URL(request.url);

  const sessionId = url.searchParams.get("sessionId");
  const sdkToken = url.searchParams.get("sdkToken");
  const theme = url.searchParams.get("theme") as "dark" | "light";

  if (!sessionId || !sdkToken) {
    throw data(null, {
      status: 400,
    });
  }

  if (!boardId) {
    const defaultBoard = await getSdkDefaultBoard(api, sdkToken);

    return redirect(
      `/sdk/widget/feedback/board/${defaultBoard.id}${url.search}`,
    );
  }

  const board = await getSdkBoard(api, sdkToken, boardId);
  const workspace = await getSdkCurrentWorkspace(api, sdkToken);

  if (board.isPrivate) {
    throw data(null, {
      status: 403,
    });
  }

  const postsSearch = url.searchParams.get("postSearch") || "";
  const postsPage = url.searchParams.get("postPage") || "1";

  try {
    const [boards, posts] = await Promise.all([
      getSdkBoards(api, sdkToken),
      getSdkPosts(api, sdkToken, {
        page: Number(postsPage),
        boardId: boardId,
        search: postsSearch,
        limit: 20,
      }),
    ]);

    return { sessionId, sdkToken, workspace, boards, board, posts, theme };
  } catch (error) {
    console.error("SDK Widget data fetch failed:", error);

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export default function SdkFeedbackWidget({
  loaderData,
}: Readonly<Route.MetaArgs>) {
  const [_, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { sessionId, sdkToken, board, boards, posts, theme } = loaderData;

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

      <PortalFeedbackLayout
        boards={boards}
        board={board}
        posts={posts}
        className="h-screen overflow-y-auto custom-scrollbar"
        sessionId={sessionId}
        sdkToken={sdkToken}
        onBoardClick={(newBoardId) => {
          setSearchParams((prev) => {
            prev.set("boardId", String(newBoardId));
            return prev;
          });
        }}
        onPostClick={(newPostdId) => {
          navigate(
            `post/${newPostdId}?sessionId=${sessionId}&sdkToken=${sdkToken}`,
          );
        }}
      />
    </>
  );
}
