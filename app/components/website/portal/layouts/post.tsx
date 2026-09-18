import type {
  Paginated,
  Post,
  PostCategory,
  PostComment,
  PostVoter,
  User,
  Workspace,
  WorkspaceRole,
} from "~/types";
import { cn } from "~/lib/utils";
import PortalPost from "../feedback/post";

interface PortalFeedbackPostLayoutProps {
  user: User | null;
  workspace: Workspace;
  currentUserRole: WorkspaceRole | null;
  posts: Paginated<Post[]>;
  post: Post;
  postCategory: PostCategory | undefined;
  postComments: Paginated<PostComment[]>;
  postVoters: Paginated<PostVoter[]>;
  onRequireAuth?: () => void;
  isWidget?: boolean;
  sessionId?: string;
  sdkToken?: string;
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
  onRequireAuth,
  isWidget = false,
  sessionId,
  sdkToken,
}: Readonly<PortalFeedbackPostLayoutProps>) {
  return (
    <div className={cn(!isWidget && "w-full h-full")}>
      <PortalPost
        currentUserRole={currentUserRole}
        user={user}
        workspace={workspace}
        posts={posts}
        post={post}
        postCategory={postCategory}
        postComments={postComments}
        postVoters={postVoters}
        onRequireAuth={onRequireAuth}
        sessionId={sessionId}
        sdkToken={sdkToken}
      />
    </div>
  );
}
