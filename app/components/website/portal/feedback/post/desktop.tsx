import { Files } from "lucide-react";
import FeedbackThread from "~/components/discussion/feedback-thread";
import PostCard from "~/components/post-card";
import { Badge } from "~/components/ui/badge";
import PortalPostInfo from "~/components/website/portal/feedback/post/info";
import PortalOtherPosts from "~/components/website/portal/feedback/post/other-post";
import type {
  Board,
  Paginated,
  Pagination,
  Post,
  PostCategory,
  PostComment,
  PostVoter,
  User,
  Workspace,
  WorkspaceRole,
} from "~/types";

interface PortalPostDesktopProps {
  user: User | null;
  workspace: Workspace;
  currentUserRole: WorkspaceRole | null;
  posts: Paginated<Post[]>;
  post: Post;
  postCategory: PostCategory | undefined;
  postComments: Paginated<PostComment[]>;
  postVoters: Paginated<PostVoter[]>;
  onRequireAuth?: () => void;
}

export default function PortalPostDesktop({
  user,
  workspace,
  currentUserRole,
  posts,
  post,
  postCategory,
  postComments,
  postVoters,
  onRequireAuth,
}: Readonly<PortalPostDesktopProps>) {
  return (
    <div className="h-full flex relative">
      <div className="w-full lg:flex-2 flex flex-col gap-3 border-l lg:border">
        <div className="pt-3 px-3 mt-2">
          <PostCard
            post={post}
            className="cursor-default w-full"
            titleClassName="lg:text-base"
            isAuthenticated={!!user}
            onRequireAuth={onRequireAuth}
            isPortal
          />
        </div>
        <FeedbackThread
          user={user}
          currentUserRole={currentUserRole}
          postId={post.id}
          workspaceId={workspace.id}
          postComments={postComments}
          onRequireAuth={onRequireAuth}
          isPortal
        />
      </div>

      <div className="hidden lg:block p-3 flex-1 lg:border">
        <PortalPostInfo
          post={post}
          postCategory={postCategory}
          postVoters={postVoters}
        />
      </div>

      <div className="hidden lg:flex flex-col gap-6 flex-1 p-3 border">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Files className="h-4 w-4 text-muted-foreground" />
              <b className="text-sm font-semibold text-foreground">پست‌ها</b>
            </div>
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-0.5 text-xs font-medium"
            >
              {posts.data.length} عدد
            </Badge>
          </div>
        </div>
        <PortalOtherPosts posts={posts} postId={post.id} />
      </div>
    </div>
  );
}
