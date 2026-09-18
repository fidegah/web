import { Pin, Trash, ChevronDown, Clock, Loader2 } from "lucide-react";
import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn, getInitials } from "~/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/animate-ui/radix/collapsible";
import type {
  CommentActionState,
  CreateResponse,
  Paginated,
  PostComment,
  WorkspaceRole,
} from "~/types";
import { Button } from "~/components/ui/button";
import ConfirmDialog from "../../ui/confirm-dialog";
import { Activity, useEffect, useRef, useState } from "react";
import { Spinner } from "../../ui/spinner";
import { useFetcher } from "react-router";
import { useActionAlert } from "~/hooks/use-action-alert";
import CommentBadges from "./comment-badges";
import CommentActions from "./commen-actions";
import CommentReplyHeader from "./comment-reply-header";
import { useAlert } from "~/components/alert-context";
import { MESSAGES } from "~/constants/messages";

interface FeedbackItemProps {
  setMessageText: React.Dispatch<React.SetStateAction<string>>;
  isRoot: boolean;
  isPending: boolean;
  submittingEditCommentId?: string | null;
  comment: PostComment;
  commentActionState: CommentActionState;
  setCommentActionState: React.Dispatch<
    React.SetStateAction<CommentActionState>
  >;
  currentUserId: string | null;
  currentUserRole: WorkspaceRole | null;
  workspaceId: string;
  postId: string;
  depth?: number;
  hideReply?: boolean;
  onDeleteSuccess?: (commentId: string) => void;
  onPinSuccess?: (commentId: string, isPinned: boolean) => void;
  isAuthenticated?: boolean;
  onRequireAuth?: () => void;
  isPortal: boolean;
  sessionId?: string;
  sdkToken?: string;
}

export default function FeedbackItem({
  setMessageText,
  isRoot,
  isPending,
  submittingEditCommentId,
  comment,
  commentActionState,
  setCommentActionState,
  currentUserId,
  currentUserRole,
  workspaceId,
  postId,
  depth = 0,
  hideReply = false,
  onDeleteSuccess,
  onPinSuccess,
  isAuthenticated,
  onRequireAuth,
  isPortal,
  sessionId,
  sdkToken,
}: Readonly<FeedbackItemProps>) {
  const deleteFetcher = useFetcher<CreateResponse>();
  const pinFetcher = useFetcher<CreateResponse>();
  const likeFetcher = useFetcher<CreateResponse>();
  const repliesFetcher = useFetcher<CreateResponse<Paginated<PostComment[]>>>();

  useActionAlert(deleteFetcher.data);
  useActionAlert(likeFetcher.data);
  const { showAlert } = useAlert();

  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [isPinned, setIsPinned] = useState(comment.isPinned);
  const [replies, setReplies] = useState<Paginated<PostComment[]>>();
  const [repliesLoaded, setRepliesLoaded] = useState(false);

  const handledPinData = useRef<typeof pinFetcher.data>(undefined);
  const handledLikeData = useRef<typeof likeFetcher.data>(undefined);
  const handledDeleteData = useRef<typeof deleteFetcher.data>(undefined);

  const isDeleting = deleteFetcher.state !== "idle";
  const isPinning = pinFetcher.state !== "idle";
  const isLiking = likeFetcher.state !== "idle";
  const isLoadingReplies = repliesFetcher.state !== "idle";

  const isSubmittingEdit = submittingEditCommentId === comment.id;

  const MAX_DEPTH = 2;
  const shouldIndent = depth < MAX_DEPTH;

  const userFullName = comment.creator?.fullName ?? "کاربر مهمان";
  const userAvatarURL = comment.creator?.avatarUrl ?? undefined;
  const isAdmin = currentUserRole === "owner" || currentUserRole === "admin";
  const isOwner =
    currentUserId !== null &&
    (comment.userId === currentUserId ||
      comment.externalUserId === currentUserId);

  const handleDeleteComment = () => {
    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }

    deleteFetcher.submit(
      {
        postId,
        commentId: comment.id,
        isPortal,
        sessionId: sessionId ?? null,
        sdkToken: sdkToken ?? null,
      },
      {
        method: "DELETE",
        action: "/proxy/posts/comments",
        defaultShouldRevalidate: false,
      },
    );
  };

  const togglePinComment = () => {
    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }

    if (isPortal) return;

    pinFetcher.submit(
      { postId, commentId: comment.id },
      {
        method: "PATCH",
        action: "/proxy/posts/comments/toggle-pin",
        defaultShouldRevalidate: false,
      },
    );
  };

  const toggleCommentLike = () => {
    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }

    likeFetcher.submit(
      {
        postId,
        commentId: comment.id,
        isPortal,
        sessionId: sessionId ?? null,
        sdkToken: sdkToken ?? null,
      },
      {
        method: "POST",
        action: "/proxy/posts/comments/toggle-like",
        defaultShouldRevalidate: false,
      },
    );
  };

  const loadReplies = () => {
    if (repliesLoaded) return;
    repliesFetcher.load(
      `/proxy/posts/comments/replies?postId=${postId}&commentId=${comment.id}&isPortal=${isPortal}`,
    );
  };

  useEffect(() => {
    if (repliesFetcher.state === "idle" && repliesFetcher.data) {
      setReplies(repliesFetcher.data.data);
      setRepliesLoaded(true);
    }
  }, [repliesFetcher.state, repliesFetcher.data]);

  useEffect(() => {
    if (pinFetcher.state !== "idle" || !pinFetcher.data) return;
    if (pinFetcher.data === handledPinData.current) return;
    handledPinData.current = pinFetcher.data;

    if (pinFetcher.data.status === "OK") {
      const newIsPinned = !isPinned;
      setIsPinned(newIsPinned);
      showAlert({
        title: newIsPinned
          ? MESSAGES.COMMENT.PINNED
          : MESSAGES.COMMENT.UNPINNED,
        type: "success",
      });
      onPinSuccess?.(comment.id, newIsPinned);
    }
  }, [pinFetcher.state, pinFetcher.data, comment.id, onPinSuccess, showAlert]);

  useEffect(() => {
    if (likeFetcher.state !== "idle" || !likeFetcher.data) return;
    if (likeFetcher.data === handledLikeData.current) return;
    handledLikeData.current = likeFetcher.data;

    if (likeFetcher.data.status === "OK") {
      setIsLiked((prev) => !prev);
    }
  }, [likeFetcher.state, likeFetcher.data]);

  useEffect(() => {
    if (deleteFetcher.state !== "idle" || !deleteFetcher.data) return;
    if (deleteFetcher.data === handledDeleteData.current) return;
    handledDeleteData.current = deleteFetcher.data;

    if (deleteFetcher.data.status === "OK") {
      onDeleteSuccess?.(comment.id);
    }
  }, [deleteFetcher.state, deleteFetcher.data, comment.id, onDeleteSuccess]);

  return (
    <div
      className={cn(
        "w-full flex flex-col transition-opacity duration-300",
        (isPending || isSubmittingEdit) && "opacity-60",
      )}
    >
      <div className={cn("flex gap-2 w-full", !isRoot && "mt-4")}>
        <Avatar className="h-8 w-8 lg:h-9 lg:w-9 shrink-0">
          <AvatarImage src={userAvatarURL} />
          <AvatarFallback>{getInitials(userFullName)}</AvatarFallback>
        </Avatar>

        <div className="w-full flex flex-col min-w-0">
          <div className="w-full flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 lg:gap-3 flex-wrap min-w-0">
              <span className="font-bold text-sm text-black dark:text-gray-200 truncate min-w-0">
                {userFullName}
              </span>
              <CommentBadges
                isAdmin={isAdmin}
                currentUserRole={currentUserRole ?? "contributor"}
                isSpam={comment.isSpam}
              />

              <Activity
                mode={isPending || isSubmittingEdit ? "visible" : "hidden"}
              >
                <div
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border shrink-0 transition-colors",
                    isSubmittingEdit
                      ? "bg-amber-50 text-amber-600 border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                      : "bg-blue-50 text-blue-600 border-blue-200/50 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
                  )}
                >
                  <Spinner className="size-3" />
                  <span className="animate-pulse">
                    {isSubmittingEdit ? "در حال ویرایش..." : "در حال ارسال..."}
                  </span>
                </div>
              </Activity>
            </div>

            <div className="flex items-center shrink-0">
              <Activity
                mode={
                  isAdmin && !isPortal && !isPending && !isSubmittingEdit
                    ? "visible"
                    : "hidden"
                }
              >
                <IconButton
                  icon={isPinning ? Spinner : Pin}
                  onClick={togglePinComment}
                  active={isPinned}
                  disabled={isPinning}
                  title={isPinned ? "برداشتن سنجاق" : "سنجاق کردن دیدگاه"}
                  aria-label={
                    isPinned ? "برداشتن سنجاق دیدگاه" : "سنجاق کردن دیدگاه"
                  }
                />
              </Activity>

              <Activity mode={isPinned && isPortal ? "visible" : "hidden"}>
                پین شده
              </Activity>

              <Activity
                mode={
                  (isOwner || isAdmin) && !isPending && !isSubmittingEdit
                    ? "visible"
                    : "hidden"
                }
              >
                <ConfirmDialog
                  title="آیا از حذف این دیدگاه مطمئن هستید؟"
                  description="با حذف این دیدگاه، تمام پاسخ‌های مرتبط نیز حذف خواهند شد. آیا ادامه می‌دهید؟"
                  confirmText="حذف"
                  onConfirm={handleDeleteComment}
                  isLoading={isDeleting}
                >
                  <IconButton
                    icon={isDeleting ? Spinner : Trash}
                    color={[220, 38, 38]}
                    disabled={isDeleting}
                    title="حذف دیدگاه"
                    aria-label="حذف این دیدگاه و پاسخ‌های مرتبط آن"
                  />
                </ConfirmDialog>
              </Activity>
            </div>
          </div>

          <p className="text-sm mt-1.5 text-gray-800 dark:text-gray-300 wrap-break-word [word-break:break-word] whitespace-normal w-full">
            {comment.content}
          </p>

          <Activity mode={isPending || isSubmittingEdit ? "hidden" : "visible"}>
            <CommentActions
              comment={comment}
              isLiking={isLiking}
              isLiked={isLiked}
              toggleCommentLike={toggleCommentLike}
              setCommentActionState={setCommentActionState}
              setMessageText={setMessageText}
              hideReply={hideReply}
              isOwner={isOwner}
            />
          </Activity>
        </div>
      </div>

      <Activity mode={comment.repliesCount > 0 ? "visible" : "hidden"}>
        <div
          className={cn(
            "w-full mt-3",
            shouldIndent
              ? "pr-3 border-r-2 border-gray-200 dark:border-gray-800"
              : "pr-0 border-r-0",
          )}
        >
          <Collapsible
            className="w-full group/collapsible"
            onOpenChange={(open) => open && loadReplies()}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 h-7 text-[11px] text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <span className="flex items-center gap-1 cursor-pointer">
                  {isLoadingReplies ? (
                    <Spinner className="size-3" />
                  ) : (
                    <ChevronDown className="size-3" />
                  )}
                  {comment.repliesCount} پاسخ
                </span>
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="w-full">
              <div className="flex flex-col mt-2 w-full">
                {replies?.data.map((reply) => (
                  <div key={reply.id} className="w-full mb-1">
                    <Activity mode={shouldIndent ? "hidden" : "visible"}>
                      <CommentReplyHeader
                        userFullName={userFullName}
                        content={comment.content}
                      />
                    </Activity>

                    <FeedbackItem
                      isRoot={false}
                      comment={reply}
                      isPending={reply.id.startsWith("temp-")}
                      submittingEditCommentId={submittingEditCommentId}
                      setMessageText={setMessageText}
                      commentActionState={commentActionState}
                      setCommentActionState={setCommentActionState}
                      currentUserId={currentUserId}
                      currentUserRole={currentUserRole}
                      workspaceId={workspaceId}
                      postId={postId}
                      depth={depth + 1}
                      isAuthenticated={isAuthenticated}
                      onRequireAuth={onRequireAuth}
                      isPortal={isPortal}
                    />
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </Activity>
    </div>
  );
}
