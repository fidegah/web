import SideList from "../../side-list";
import FeedbackCard from "../../feedback/post-item";
import { ArrowUp, MessageCircle, Pencil } from "lucide-react";
import { Link, useFetcher } from "react-router";
import { cn } from "~/lib/utils";
import type { Paginated, UserActivityStatus } from "~/types";
import { Activity, useEffect, useState } from "react";

interface UserActivityProps {
  selectedUserId: string | undefined;
  activityStatus: Paginated<UserActivityStatus>;
  setIsOpenFilterDialog: (val: boolean) => void;
  ACTIVITY_LIMIT: number;
  className?: string;
}

export default function UserActivity({
  activityStatus,
  selectedUserId,
  setIsOpenFilterDialog,
  ACTIVITY_LIMIT,
  className,
}: Readonly<UserActivityProps>) {
  const loadMoreActivityFetcher = useFetcher();

  const [localActivity, setLocalActivity] = useState(() => activityStatus);

  useEffect(() => {
    if (activityStatus) {
      setLocalActivity(activityStatus);
    }
  }, [activityStatus]);

  useEffect(() => {
    const loaderResult = loadMoreActivityFetcher.data;
    const response = loaderResult?.activityStatus as
      | typeof activityStatus
      | undefined;

    if (response && loadMoreActivityFetcher.state === "idle") {
      setLocalActivity((prev) => {
        const existingIds = new Set(prev.data.posts.map((p) => p.postId));
        const newPosts = (response.data.posts || []).filter(
          (p) => !existingIds.has(p.postId),
        );

        return {
          data: {
            ...prev.data,
            posts: [...prev.data.posts, ...newPosts],
          },
          pagination: response.pagination,
        };
      });
    }
  }, [loadMoreActivityFetcher.data, loadMoreActivityFetcher.state]);

  const handleLoadMoreActivity = () => {
    const nextRealPage =
      Math.floor(localActivity.data.posts.length / ACTIVITY_LIMIT) + 1;

    const currentUrl = new URL(globalThis.location.href);
    currentUrl.searchParams.set("user-activity-page", String(nextRealPage));

    loadMoreActivityFetcher.load(currentUrl.search + currentUrl.hash);
  };

  const isLoadingMore = loadMoreActivityFetcher.state !== "idle";

  return (
    <SideList
      search={{
        showBox: true,
        queryKey: "user-activity-search",
      }}
      filter={{
        showButton: true,
        onFilterClick() {
          setIsOpenFilterDialog(true);
        },
      }}
      items={localActivity.data.posts}
      className={cn("lg:w-[35%]", className)}
      activeId={selectedUserId}
      getItemKey={(item) => item.postId}
      renderItem={(item) => (
        <div className="w-full flex">
          <Link
            className="w-full"
            to={`/dashboard/feedback/${item.title}/${item.postId}`}
          >
            <FeedbackCard
              commentsCount={item.comments_count}
              votesCount={item.votesCount}
              title={item.title}
              description={item.description}
            />
          </Link>

          <div className="border-r p-2 cursor-default flex flex-col justify-center gap-6 text-blue-600">
            <Activity mode={item.hasPosted ? "visible" : "hidden"}>
              <Pencil className="size-4.5" />
            </Activity>

            <Activity mode={item.hasCommented ? "visible" : "hidden"}>
              <MessageCircle className="size-4.5" />
            </Activity>

            <Activity mode={item.hasVoted ? "visible" : "hidden"}>
              <ArrowUp className="size-4.5" />
            </Activity>
          </div>
        </div>
      )}
      pagination={{
        hasNextPage: localActivity.pagination.hasNext,
        isLoadingMore: isLoadingMore,
        onLoadMore: handleLoadMoreActivity,
      }}
      emptyState={{
        title: "فعالیتی برای نمایش موجود نمیباشد.",
      }}
    />
  );
}
