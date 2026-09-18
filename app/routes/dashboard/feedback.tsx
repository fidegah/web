import type { Route } from "./+types/feedback";
import FeedbackPostItem from "~/components/dashboard/feedback/post-item";
import CreatePostDialog from "~/components/dashboard/feedback/dialogs/create-post";
import FeedbackPostDetail from "~/components/dashboard/feedback/post-detail";
import { Activity, useEffect, useState } from "react";
import { useDevice } from "~/hooks/use-device";
import PostCardDialogsCompact from "~/components/dashboard/feedback/dialogs/post-card-compact";
import FeedbackFilterDialog from "~/components/dashboard/feedback/dialogs/filter";
import { CircleFadingPlus, MessageCircle } from "lucide-react";
import {
  data,
  Link,
  redirect,
  useSearchParams,
  useFetcher,
} from "react-router";
import SideList from "~/components/dashboard/side-list";
import Fab from "~/components/ui/fab";
import { DataEmptyState } from "~/components/ui/empty-state";
import { MESSAGES } from "~/constants/messages";
import { PageHeader } from "~/components/ui/page-header";
import ErrorPage from "~/components/ui/error-page";
import { SEO_CONFIG } from "~/constants/seo";
import type { Post } from "~/types";
import { ERROR_CODE } from "~/constants/errors";
import { getBoard, getDefaultBoard } from "~/services/board.service";
import {
  getCurrentWorkspace,
  getWorkspaceMembership,
} from "~/services/workspace.service";
import {
  getLatestPosts,
  getPost,
  getPostCategory,
  getPosts,
  getPostStatuses,
  getPostTags,
  getPostVoters,
} from "~/services/post.service";
import { getCurrentUser } from "~/services/user.service";
import { getBoardTags } from "~/services/tag.service";
import { getPostComments } from "~/services/post-comment.service";
import { apiClientContext } from "~/context";

export function meta() {
  return [{ title: SEO_CONFIG.dashboard.feedbacks.title }];
}

export async function loader({ params, context, url }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);
  const { boardId, postId } = params;

  if (!boardId || !postId) {
    try {
      const workspace = await getCurrentWorkspace(api);
      const [latestPosts, defaultBoard] = await Promise.all([
        getLatestPosts(api, workspace.id),
        getDefaultBoard(api, workspace.id),
      ]);

      const targetBoardId = defaultBoard?.id;
      const targetPostId = latestPosts?.[0]?.id;

      if (targetBoardId && targetPostId) {
        return redirect(
          `/dashboard/feedback/${targetBoardId}/post/${targetPostId}`,
        );
      }

      return {
        uiState: {
          isSearching: false,
          hasFilters: false,
          isPostExist: false,
        },
        content: null,
      };
    } catch (error) {
      console.error(
        "Failed to fetch fallback data for dashboard feedback redirect:",
        error,
      );

      throw data(null, {
        status: 500,
        statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
      });
    }
  }

  const searchParam = url.searchParams.get("search") || "";
  const boardIdsParam = url.searchParams.get("boardIds") || "";
  const tagIdsParam = url.searchParams.get("tagIds") || "";
  const postStatusIdsParam = url.searchParams.get("postStatusIds") || "";
  const postsPageParam = url.searchParams.get("postsPage") || "1";
  const commentsPageParam = url.searchParams.get("commentsPage") || "1";
  const postVotesPage = url.searchParams.get("postVotesPage") || "1";

  const POSTS_LIMIT = 20;
  const COMMENTS_LIMIT = 20;
  const POST_VOTES_LIMIT = 30;

  try {
    const workspace = await getCurrentWorkspace(api);

    const [
      user,
      board,
      posts,
      post,
      boardTags,
      postTags,
      postComments,
      postVoters,
      postStatuses,
      workspaceMember,
    ] = await Promise.all([
      getCurrentUser(api),
      getBoard(api, workspace.id, boardId),
      getPosts(api, workspace.id, {
        page: Number(postsPageParam),
        limit: POSTS_LIMIT,
        search: searchParam,
        boardId: boardIdsParam,
        tagId: tagIdsParam,
        statusId: postStatusIdsParam,
      }),
      getPost(api, workspace.id, postId),
      getBoardTags(api, workspace.id, boardId),
      getPostTags(api, workspace.id, postId),

      getPostComments(api, workspace.id, postId, {
        page: Number(commentsPageParam),
        limit: COMMENTS_LIMIT,
      }),
      getPostVoters(api, workspace.id, postId, {
        page: Number(postVotesPage),
        limit: POST_VOTES_LIMIT,
      }),
      getPostStatuses(api),
      getWorkspaceMembership(api, workspace.id),
    ]);

    let postCategory;

    if (post.categoryId) {
      postCategory = await getPostCategory(api, workspace.id, post.categoryId);
    }

    return {
      uiState: {
        isSearching: !!searchParam,
        hasFilters:
          searchParam.trim().length > 0 ||
          !!boardIdsParam ||
          !!tagIdsParam ||
          !!postStatusIdsParam,
        isPostExist: posts.data.length > 0,
      },
      content: {
        user,
        workspace,
        workspaceMember,
        board,
        post,
        posts,
        boardTags,
        postTags,
        postCategory,
        postComments,
        postVoters,
        postStatuses,
        POSTS_LIMIT,
      },
    };
  } catch (err) {
    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export default function Feedback({ params, loaderData }: Route.ComponentProps) {
  const { boardId, postId } = params;
  const { isMobile, isTablet } = useDevice();
  const [searchParams] = useSearchParams();

  const loadMorePostsFetcher = useFetcher();

  const [activeMobileStep, setActiveMobileStep] = useState<
    "chat" | "info" | null
  >(null);
  const [isOpenCratePostDialog, setIsOpenCratePostDialog] = useState(false);
  const [isOpenFilterDialog, setIsOpenFilterDialog] = useState(false);

  const [allPosts, setAllPosts] = useState(() => loaderData.content?.posts);

  useEffect(() => {
    const isOpen = searchParams.get("open-dialog") === "true";

    if (isOpen && (isMobile || isTablet)) {
      setActiveMobileStep("chat");
    } else {
      setActiveMobileStep(null);
    }
  }, [searchParams, isMobile, isTablet]);

  useEffect(() => {
    const response = loadMorePostsFetcher.data?.content?.posts;
    if (response && loadMorePostsFetcher.state === "idle") {
      setAllPosts((prev) => {
        if (!prev) return response;
        const existingIds = new Set(prev.data.map((p) => p.id));
        const newPosts = (response.data || []).filter(
          (p: Post) => !existingIds.has(p.id),
        );

        return {
          data: [...prev.data, ...newPosts],
          pagination: response.pagination,
        };
      });
    }
  }, [loadMorePostsFetcher.data, loadMorePostsFetcher.state]);

  const { isPostExist, hasFilters, isSearching } = loaderData.uiState;

  if (isPostExist === false && !hasFilters && !isSearching) {
    return (
      <div className="w-full h-full flex flex-col gap-6">
        <PageHeader
          icon={MessageCircle}
          title="بازخورد"
          description="در این بخش می‌توانید پست‌های ایجادشده را مدیریت کنید و همچنین دیدگاه‌های هر پست را مشاهده، ویرایش، حذف یا دیدگاه جدید ثبت کنید."
        />
        <DataEmptyState
          title={MESSAGES.POST.EMPTY.TITLE}
          description={MESSAGES.POST.EMPTY.DESCRIPTION}
          actionText="ایجاد پست"
          actionIcon={CircleFadingPlus}
          onActionClick={() => setIsOpenCratePostDialog(true)}
        />
        <Activity mode={isOpenCratePostDialog ? "visible" : "hidden"}>
          <CreatePostDialog
            isOpenDialog={isOpenCratePostDialog}
            setIsOpenDialog={setIsOpenCratePostDialog}
          />
        </Activity>
      </div>
    );
  }

  const { content } = loaderData;
  if (!content) return <ErrorPage />;

  const {
    user,
    workspace,
    workspaceMember,
    board,
    boardTags,
    post,
    postCategory,
    postComments,
    postTags,
    postVoters,
    postStatuses,
    POSTS_LIMIT,
  } = content;

  const handleLoadMorePosts = () => {
    if (!allPosts) return;
    const nextRealPage = Math.floor(allPosts.data.length / POSTS_LIMIT) + 1;

    const currentUrl = new URL(globalThis.location.href);
    currentUrl.searchParams.set("postsPage", String(nextRealPage));

    loadMorePostsFetcher.load(currentUrl.search + currentUrl.hash);
  };

  const isLoadingMorePosts = loadMorePostsFetcher.state !== "idle";

  let emptyDescription = "";
  if (hasFilters) {
    emptyDescription = MESSAGES.POST.EMPTY.FILTERED;
  } else if (isSearching) {
    emptyDescription = MESSAGES.POST.EMPTY.SEARCHED;
  }

  useEffect(() => {
    setAllPosts(loaderData.content?.posts);
  }, [loaderData.content?.posts]);

  return (
    <main className="w-full h-screen flex p-3 lg:p-0">
      <Fab
        tooltipText="ایجاد پست"
        onClick={() => setIsOpenCratePostDialog(true)}
      />

      <CreatePostDialog
        isOpenDialog={isOpenCratePostDialog}
        setIsOpenDialog={setIsOpenCratePostDialog}
      />

      <SideList
        items={allPosts?.data || []}
        search={{ showBox: true }}
        filter={{
          showButton: true,
          onFilterClick() {
            setIsOpenFilterDialog(true);
          },
        }}
        getItemKey={(item) => item.id}
        activeId={Number(postId)}
        renderItem={(item) => (
          <Link
            className="w-full"
            key={item.id}
            to={`/dashboard/feedback/board/${boardId}/post/${item.id}${isMobile ? "?open-dialog=true" : ""}`}
            onClick={() =>
              (isMobile || isTablet) && setActiveMobileStep("chat")
            }
          >
            <FeedbackPostItem
              title={item.title}
              description={item.description}
              votesCount={item.votesCount}
              commentsCount={item.commentsCount}
            />
          </Link>
        )}
        emptyState={{
          title: MESSAGES.POST.EMPTY.TITLE,
          description: emptyDescription,
        }}
        pagination={{
          hasNextPage:
            allPosts?.pagination.hasNext ||
            loaderData.content.posts.pagination.hasNext,
          isLoadingMore: isLoadingMorePosts,
          onLoadMore: handleLoadMorePosts,
        }}
      />

      <div className="lg:hidden">
        <PostCardDialogsCompact
          activeView={activeMobileStep}
          setActiveView={setActiveMobileStep}
          data={{
            workspace,
            currentUserRole: workspaceMember.role,
            post,
            postStatuses,
            postComments,
            postVoters,
            user,
            board,
            postCategory,
            boardTags,
            initialPostTags: postTags,
          }}
        />
      </div>

      <div className="hidden lg:flex w-[70%] p-2">
        <FeedbackPostDetail
          key={post.id}
          data={{
            currentUserRole: workspaceMember.role,
            workspace,
            post,
            postStatuses,
            postComments,
            postVoters,
            user,
            board,
            postCategory,
            boardTags,
            initialPostTags: postTags,
          }}
        />
      </div>

      <FeedbackFilterDialog
        isOpenDialog={isOpenFilterDialog}
        setIsOpenDialog={setIsOpenFilterDialog}
        data={{ boardTags, postStatuses, boardId: Number(boardId) }}
      />
    </main>
  );
}
