import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import { ArrowRight } from "lucide-react";
import { UpvoteButton } from "../upvote-button";
import FeedbackThread from "../../../discussion/feedback-thread";
import { useFetcher, useRevalidator } from "react-router";
import DesktopButtons from "./action-buttons/desktop-buttons";
import MobileMenu from "./action-buttons/mobile-menu";
import AiSummaryDialog from "../dialogs/ai-summary";
import { Activity, useState } from "react";
import { useAlert } from "~/components/alert-context";
import { cn } from "~/lib/utils";
import type {
  Board,
  Pagination,
  Post,
  PostCategory,
  PostComment,
  PostStatus,
  Tag,
  PostVoter,
  User,
  Workspace,
  WorkspaceRole,
  Paginated,
  PostDetailData,
} from "~/types";
import { useActionAlert } from "~/hooks/use-action-alert";
import CustomTabs from "~/components/ui/custom-tabs";
import PostCardInfo from "./info/info";
import VotedUsersTable from "~/components/voted-users-table";
import { DataEmptyState } from "~/components/ui/empty-state";

interface PostCardProps {
  backBtnOnClick?: () => void;
  infoBtnOnClick?: () => void;
  isShowPostCardInfo?: boolean;
  isShowChat?: boolean;
  data: PostDetailData;
}

export default function FeedbackPostDetail({
  backBtnOnClick,
  infoBtnOnClick,
  isShowPostCardInfo = true,
  isShowChat = true,
  data,
}: Readonly<PostCardProps>) {
  const {
    user,
    workspace,
    board,
    post,
    postComments,
    postVoters,
    postStatuses,
    postCategory,
    boardTags,
    initialPostTags,
    currentUserRole,
  } = data;

  const { showAlert } = useAlert();
  const upvoteFeacher = useFetcher();
  useActionAlert(upvoteFeacher.data);
  const revalidator = useRevalidator();

  const [showPostCardInfo, setShowPostCardInfo] =
    useState<boolean>(isShowPostCardInfo);
  const [isOpenAiSummaryDialog, setIsOpenAiSummaryDialog] = useState(false);

  const isPageReloading = revalidator.state === "loading";

  const handleGenerateSummary = () => {
    if (postComments.data.length < 10) {
      showAlert({
        title: "دیدگاه‌های کافی برای تحلیل وجود ندارد.",
        type: "warning",
      });
    } else {
      setIsOpenAiSummaryDialog(true);
    }
  };

  return (
    <div className="w-full h-full lg:border rounded-md flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <IconButton
            icon={ArrowRight}
            className="text-black dark:text-white lg:hidden"
            onClick={backBtnOnClick}
            title="بازگشت"
            aria-label="بازگشت به صفحه قبل"
          />
          <UpvoteButton post={post} isAuthenticated={Boolean(user)} />
          <b className="text-base mr-2 text-foreground">{post.title}</b>
        </div>

        <div className="flex items-center gap-4 ltr">
          <div className="hidden lg:block">
            <DesktopButtons
              isLoading={isPageReloading}
              revalidator={revalidator}
              onGenerateSummary={handleGenerateSummary}
              isShowPostCardInfo={showPostCardInfo}
              setShowPostCardInfo={setShowPostCardInfo}
            />
          </div>

          <div className="lg:hidden">
            <MobileMenu
              isShowChat={isShowChat}
              infoBtnOnClick={infoBtnOnClick}
              isLoading={isPageReloading}
              revalidator={revalidator}
              onGenerateSummary={handleGenerateSummary}
            />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 w-full min-h-0 relative">
        {/* Chat / Feedback Thread */}
        <Activity mode={isShowChat && postComments ? "visible" : "hidden"}>
          <div
            className={cn(
              "h-full flex flex-col lg:border-l transition-all duration-300",
              showPostCardInfo ? "w-full lg:w-[60%] shrink-0" : "w-full",
            )}
          >
            <FeedbackThread
              currentUserRole={currentUserRole}
              postId={post.id}
              workspaceId={workspace.id}
              user={user}
              postComments={postComments}
            />
          </div>
        </Activity>

        {/* Sidebar Tabs (Info & Votes) */}
        <div
          className={cn(
            "hidden lg:block h-full flex-1 p-4 overflow-y-auto",
            !showPostCardInfo && "lg:hidden",
          )}
        >
          <Activity mode={showPostCardInfo ? "visible" : "hidden"}>
            <CustomTabs
              defaultValue="info"
              tabs={[
                {
                  id: "info",
                  label: "اطلاعات پست",
                  content: (
                    <div className="space-y-6 py-4">
                      <PostCardInfo
                        board={board}
                        post={post}
                        postCategory={postCategory}
                        workspace={workspace}
                        boardTags={boardTags}
                        initialPostTags={initialPostTags}
                        postStatuses={postStatuses}
                      />
                    </div>
                  ),
                },
                {
                  id: "votes",
                  label: `رای‌دهندگان (${post.votesCount})`,
                  content: (
                    <div className="py-4">
                      <Activity
                        mode={postVoters.data.length > 0 ? "visible" : "hidden"}
                      >
                        <VotedUsersTable voters={postVoters} />
                      </Activity>

                      <Activity
                        mode={
                          postVoters.data.length === 0 ? "visible" : "hidden"
                        }
                      >
                        <div className="flex items-center justify-center py-8 overflow-hidden">
                          <DataEmptyState
                            title="در حال حاضر رأی ثبت نشده است."
                            size="sm"
                            className="h-fit"
                          />
                        </div>
                      </Activity>
                    </div>
                  ),
                },
              ]}
            />
          </Activity>
        </div>
      </div>

      {/* Dialogs */}
      {isOpenAiSummaryDialog && (
        <AiSummaryDialog
          isOpen={isOpenAiSummaryDialog}
          setIsOpen={setIsOpenAiSummaryDialog}
          postId={post.id}
        />
      )}
    </div>
  );
}
