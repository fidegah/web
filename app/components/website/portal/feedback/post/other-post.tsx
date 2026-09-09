import { Activity } from "react";
import { useNavigate } from "react-router";
import PostCard from "~/components/post-card";
import { CustomPagination } from "~/components/ui/custom-pagination";
import { DataEmptyState } from "~/components/ui/empty-state";
import { MESSAGES } from "~/constants/messages";
import type { Paginated, Post } from "~/types";

interface PortalOtherPostsProps {
  postId: string;
  posts: Paginated<Post[]>;
}

export default function PortalOtherPosts({
  posts,
  postId,
}: Readonly<PortalOtherPostsProps>) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar">
      <Activity mode={posts.data?.length > 0 ? "visible" : "hidden"}>
        {posts.data.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onClick={() => navigate(`/feedback/board/5/post/${post.id}`)}
            isActive={post.id === postId}
          />
        ))}

        <CustomPagination
          pagination={posts.pagination}
          maxVisiblePages={0}
          queryParamName="postsPage"
        />
      </Activity>

      <Activity mode={posts.data?.length === 0 ? "visible" : "hidden"}>
        <DataEmptyState title={MESSAGES.POST.EMPTY.TITLE} size="sm" />
      </Activity>
    </div>
  );
}
