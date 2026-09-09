import PostsByRecencyCard from "./posts-by-recency-card";
import type { Paginated, Pagination, Post } from "~/types";
import { useFetcher } from "react-router";
import { useEffect, useState } from "react";

interface PostsByRecencyProps {
  activePosts: Paginated<Post[]>;
  oldPosts: Paginated<Post[]>;
}

export default function PostsByRecency({
  activePosts,
  oldPosts,
}: Readonly<PostsByRecencyProps>) {
  const loadMoreFetcher = useFetcher();
  const [allActivePosts, setAllActivePosts] = useState<Post[]>(
    activePosts.data,
  );
  const [allOldPosts, setAllOldPosts] = useState<Post[]>(oldPosts.data);
  const [lastRequestType, setLastRequestType] = useState<
    "active" | "old" | null
  >(null);

  const loadMoreFetcherData = loadMoreFetcher.data;

  const handleLoadMore = (
    pageParamName: "active-posts-page" | "old-posts-page",
  ) => {
    setLastRequestType(
      pageParamName === "active-posts-page" ? "active" : "old",
    );

    const currentPage =
      pageParamName === "active-posts-page"
        ? (loadMoreFetcherData?.activePosts?.pagination.page ??
          activePosts.pagination.page)
        : (loadMoreFetcherData?.oldPosts?.pagination.page ??
          oldPosts.pagination.page);

    loadMoreFetcher.submit(
      { [pageParamName]: (currentPage + 1).toString() },
      { method: "get", defaultShouldRevalidate: false },
    );
  };

  useEffect(() => {
    if (loadMoreFetcher.state !== "idle") return;
    if (loadMoreFetcherData) {
      if (
        lastRequestType === "active" &&
        loadMoreFetcherData.activePosts?.data
      ) {
        setAllActivePosts((prev) => [
          ...prev,
          ...loadMoreFetcherData.activePosts.data,
        ]);
      }

      if (lastRequestType === "old" && loadMoreFetcherData.oldPosts?.data) {
        setAllOldPosts((prev) => [
          ...prev,
          ...loadMoreFetcherData.oldPosts.data,
        ]);
      }
    }
  }, [loadMoreFetcherData, lastRequestType]);

  const hasNextActivePage =
    loadMoreFetcherData?.activePosts?.pagination.hasNext ??
    activePosts.pagination.hasNext;

  const hasNextOldPage =
    loadMoreFetcherData?.oldPosts?.pagination.hasNext ??
    oldPosts.pagination.hasNext;

  const isLoadingActive =
    loadMoreFetcher.state !== "idle" && lastRequestType === "active";
  const isLoadingOld =
    loadMoreFetcher.state !== "idle" && lastRequestType === "old";

  return (
    <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
      <PostsByRecencyCard
        posts={allOldPosts}
        title="پست های قدیمی"
        description="این پست‌ها در یک ماه گذشته هیچ دیدگاه یا رای دریافت نکرده‌اند و بنابراین فعلاً کم‌تعامل محسوب می‌شوند."
        emptyText="هیچ پست قدیمی‌ای وجود ندارد."
        loadMore={{
          handleLoadMore() {
            handleLoadMore("old-posts-page");
          },
          isLoading: isLoadingOld,
          hasNext: hasNextOldPage,
        }}
      />
      <PostsByRecencyCard
        posts={allActivePosts}
        title="پست های فعال"
        description="این پست‌ها در یک ماه گذشته فعالیت خوبی داشته‌اند و دیدگاه‌ها یا رای‌هایی برای آن‌ها ثبت شده است."
        emptyText="هیچ پست فعالی وجود ندارد."
        loadMore={{
          handleLoadMore() {
            handleLoadMore("active-posts-page");
          },
          isLoading: isLoadingActive,
          hasNext: hasNextActivePage,
        }}
      />
    </div>
  );
}
