import { useState } from "react";
import { Ellipsis, Files, Info } from "lucide-react";
import FeedbackThread from "~/components/discussion/feedback-thread";
import PostCard from "~/components/post-card";
import { Badge } from "~/components/ui/badge";
import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/animate-ui/radix/dropdown-menu";
import PortalDialog from "~/components/website/portal/dialog";
import PortalPostInfo from "~/components/website/portal/feedback/post/info";
import PortalOtherPosts from "~/components/website/portal/feedback/post/other-post";
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

interface PortalPostProps {
  user: User | null;
  workspace: Workspace;
  currentUserRole: WorkspaceRole | null;
  posts: Paginated<Post[]>;
  post: Post;
  postCategory: PostCategory | undefined;
  postComments: Paginated<PostComment[]>;
  postVoters: Paginated<PostVoter[]>;
  onRequireAuth?: () => void;
  sessionId?: string;
  sdkToken?: string;
}

export default function PortalPost({
  user,
  workspace,
  currentUserRole,
  posts,
  post,
  postCategory,
  postComments,
  postVoters,
  onRequireAuth,
  sessionId,
  sdkToken,
}: Readonly<PortalPostProps>) {
  const [isOpenPostInfoDialog, setIsOpenPostInfoDialog] =
    useState<boolean>(false);
  const [isOpenOtherPostDialog, setIsOpenOtherPostDialog] =
    useState<boolean>(false);

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen lg:h-full max-h-screen lg:max-h-none overflow-hidden lg:overflow-visible relative">
      <div className="w-full lg:flex-2 flex flex-col border-l lg:border h-full max-h-screen lg:max-h-none overflow-hidden relative shrink-0 lg:shrink">
        <div className="shrink-0 pt-3 px-3 mt-2">
          <PostCard
            post={post}
            className="cursor-default w-full"
            titleClassName="text-sm lg:text-base"
            isAuthenticated={!!user}
            onRequireAuth={onRequireAuth}
            isPortal
            sessionId={sessionId}
            sdkToken={sdkToken}
            leftSection={
              <div className="flex items-center justify-center lg:hidden">
                <DropdownMenu dir="rtl">
                  <DropdownMenuTrigger asChild>
                    <IconButton
                      icon={Ellipsis}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center size-8 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
                      size="sm"
                      title="گزینه‌های بیشتر"
                      aria-label={`گزینه‌های بیشتر برای پست ${post?.title || ""}`}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 z-50">
                    <DropdownMenuItem
                      onClick={() => setIsOpenPostInfoDialog(true)}
                      className="flex items-center gap-2 cursor-pointer text-right justify-start"
                    >
                      <Info className="size-4" />
                      <span>نمایش اطلاعات</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setIsOpenOtherPostDialog(true)}
                      className="flex items-center gap-2 cursor-pointer text-right justify-start"
                    >
                      <Files className="size-4" />
                      <span>نمایش دیگر پست‌ها</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            }
          />
        </div>

        <div className="flex-1 relative min-h-0 w-full">
          <FeedbackThread
            user={user}
            currentUserRole={currentUserRole}
            postId={post.id}
            workspaceId={workspace.id}
            postComments={postComments}
            onRequireAuth={onRequireAuth}
            isPortal
            sessionId={sessionId}
            sdkToken={sdkToken}
          />
        </div>
      </div>

      <div className="hidden lg:block p-3 flex-1 lg:border overflow-y-auto">
        <PortalPostInfo
          post={post}
          postCategory={postCategory}
          postVoters={postVoters}
        />
      </div>

      <div className="hidden lg:flex flex-col gap-6 flex-1 p-3 border overflow-y-auto">
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

      <PortalDialog
        isOpen={isOpenPostInfoDialog}
        setIsOpen={setIsOpenPostInfoDialog}
        title="جزئیات پست"
        description="در این بخش جزئیات کامل پست به همراه اطلاعات مرتبط ارائه شده است."
      >
        <PortalPostInfo
          post={post}
          postCategory={postCategory}
          postVoters={postVoters}
        />
      </PortalDialog>

      <PortalDialog
        isOpen={isOpenOtherPostDialog}
        setIsOpen={setIsOpenOtherPostDialog}
        title="دیگر پست‌ها"
        description="لیست پست‌های مرتبط با این بخش"
      >
        <PortalOtherPosts posts={posts} postId={post.id} />
      </PortalDialog>
    </div>
  );
}
