import FeedbackThread from "~/components/discussion/feedback-thread";
import PostCard from "~/components/post-card";
import { Ellipsis, Files, Info } from "lucide-react";
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
import { useState } from "react";
import type {
  Board,
  PostCategory,
  Pagination,
  Post,
  PostComment,
  PostVoter,
  User,
  Workspace,
  WorkspaceRole,
  Paginated,
} from "~/types";

interface PortalPostMobileProps {
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

export default function PortalPostMobile({
  user,
  workspace,
  currentUserRole,
  posts,
  post,
  postCategory,
  postComments,
  postVoters,
  onRequireAuth,
}: Readonly<PortalPostMobileProps>) {
  const [isOpenPostInfoDialog, setIsOpenPostInfoDialog] = useState(false);
  const [isOpenOtherPostDialog, setIsOpenOtherPostDialog] = useState(false);

  return (
    <div className="flex flex-col h-full max-h-screen overflow-hidden relative">
      <div className="shrink-0 pt-3 px-3 mt-2">
        <PostCard
          post={post}
          className="cursor-default"
          titleClassName="text-sm"
          onRequireAuth={onRequireAuth}
          isPortal
          leftSection={
            <div className="flex items-center justify-center">
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

      <div className="flex-1 overflow-y-auto">
        <FeedbackThread
          user={user}
          postId={post.id}
          workspaceId={workspace.id}
          currentUserRole={currentUserRole}
          postComments={postComments}
          onRequireAuth={onRequireAuth}
          isPortal
        />
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
