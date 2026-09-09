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
import PortalPostDesktop from "../feedback/post/desktop";
import PortalPostMobile from "../feedback/post/mobile";
import { cn } from "~/lib/utils";
import { useOtpAuthDialog } from "~/contexts/otp-auth-dialog-context";

interface PortalFeedbackPostLayoutProps {
  user: User | null;
  workspace: Workspace;
  currentUserRole: WorkspaceRole | null;
  posts: Paginated<Post[]>;
  post: Post;
  postCategory: PostCategory | undefined;
  postComments: Paginated<PostComment[]>;
  postVoters: Paginated<PostVoter[]>;
  isWidget?: boolean;
}

export default function PortalFeedbackPostLayout({
  user,
  workspace,
  currentUserRole,
  posts,
  post,
  postCategory,
  postComments,
  postVoters,
  isWidget = false,
}: Readonly<PortalFeedbackPostLayoutProps>) {
  const { openAuthDialog } = useOtpAuthDialog();

  return (
    <div className={cn(!isWidget && "w-full h-full")}>
      <div className="hidden md:block h-full">
        <PortalPostDesktop
          currentUserRole={currentUserRole}
          user={user}
          workspace={workspace}
          posts={posts}
          post={post}
          postCategory={postCategory}
          postComments={postComments}
          postVoters={postVoters}
          onRequireAuth={openAuthDialog}
        />
      </div>

      <div className="block md:hidden h-screen">
        <PortalPostMobile
          currentUserRole={currentUserRole}
          user={user}
          workspace={workspace}
          posts={posts}
          post={post}
          postCategory={postCategory}
          postComments={postComments}
          postVoters={postVoters}
          onRequireAuth={openAuthDialog}
        />
      </div>
    </div>
  );
}
