import type {
  CommentActionState,
  Paginated,
  Pagination,
  PostComment,
  User,
  WorkspaceRole,
} from "~/types";
import FeedbackItem from "./feedback-item";
import FeedbackInput from "./feedback-input";
import { Activity, useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";
import { useFetcher } from "react-router";
import { useActionAlert } from "~/hooks/use-action-alert";
import { DataEmptyState } from "../ui/empty-state";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

interface FeedbackThreadProps {
  workspaceId: string;
  currentUserRole: WorkspaceRole | null;
  user: User | null;
  postId: string;
  postComments: Paginated<PostComment[]>;
  onRequireAuth?: () => void;
  className?: string;
  isPortal?: boolean;
  sessionId?: string;
  sdkToken?: string;
}

function updateRootComment(
  list: PostComment[],
  newComment: PostComment,
): PostComment[] {
  return list.map((c) =>
    c.id === newComment.id ? { ...c, ...newComment } : c,
  );
}

function bumpRepliesCount(
  list: PostComment[],
  parentId: string,
): PostComment[] {
  return list.map((c) =>
    c.id === parentId ? { ...c, repliesCount: (c.repliesCount || 0) + 1 } : c,
  );
}

export default function FeedbackThread({
  user,
  postId,
  workspaceId,
  currentUserRole,
  postComments,
  onRequireAuth,
  className,
  isPortal = false,
  sessionId,
  sdkToken,
}: Readonly<FeedbackThreadProps>) {
  const createCommentFetcher = useFetcher();
  const loadMoreFetcher = useFetcher();
  useActionAlert(createCommentFetcher.data);

  const [allComments, setAllComments] = useState(postComments);
  const [messageText, setMessageText] = useState("");
  const [commentActionState, setCommentActionState] =
    useState<CommentActionState>(null);

  const handledCreateData = useRef<typeof createCommentFetcher.data>(undefined);

  const isAuthenticated = !!user;
  const isSending = createCommentFetcher.state !== "idle";
  const isLoadingMore = loadMoreFetcher.state !== "idle";

  const submittingFormData = createCommentFetcher.formData as
    | FormData
    | undefined;
  const submittingEditCommentId =
    isSending && submittingFormData?.get("action_type") === "edit"
      ? (submittingFormData?.get("comment_id") as string)
      : null;

  useEffect(() => {
    setAllComments(postComments);
  }, [postComments]);

  useEffect(() => {
    if (createCommentFetcher.state !== "idle" || !createCommentFetcher.data) {
      return;
    }

    if (createCommentFetcher.data === handledCreateData.current) return;
    handledCreateData.current = createCommentFetcher.data;

    const response = createCommentFetcher.data;
    const tempId = (createCommentFetcher.formData as FormData | undefined)?.get(
      "tempId",
    ) as string | null;

    if (response.status === "OK" || response.data) {
      const newComment = (response.data ?? response) as PostComment;

      if (newComment && newComment.id) {
        const isEditing = commentActionState?.mode === "editing";

        setAllComments((prev) => {
          if (isEditing) {
            return {
              ...prev,
              data: updateRootComment(prev.data, newComment),
            };
          }

          const hasTemp = tempId && prev.data.some((c) => c.id === tempId);
          if (hasTemp) {
            return {
              ...prev,
              data: prev.data.map((c) => (c.id === tempId ? newComment : c)),
            };
          }

          const existingIds = new Set(prev.data.map((c) => c.id));
          if (existingIds.has(newComment.id)) return prev;

          if (newComment.parentId) {
            return {
              ...prev,
              data: bumpRepliesCount(prev.data, newComment.parentId),
            };
          }

          return {
            ...prev,
            data: [newComment, ...prev.data],
            pagination: {
              ...prev.pagination,
              total: (prev.pagination.total || 0) + 1,
            },
          };
        });
      }
    } else if (tempId) {
      setAllComments((prev) => ({
        ...prev,
        data: prev.data.filter((c) => c.id !== tempId),
        pagination: {
          ...prev.pagination,
          total: Math.max(0, (prev.pagination.total || 0) - 1),
        },
      }));
    }

    setMessageText("");
    setCommentActionState(null);
  }, [
    createCommentFetcher.state,
    createCommentFetcher.data,
    commentActionState,
  ]);

  const handleSubmitMessage = async () => {
    if (!messageText.trim()) return;

    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }

    const isEditing = commentActionState?.mode === "editing";
    const isReplying = commentActionState?.mode === "replying";

    const formData = new FormData();
    formData.append("postId", postId);
    formData.append("content", messageText);

    if (isPortal) formData.append("isPortal", String(isPortal));

    if (sessionId && sdkToken) {
      formData.append("sessionId", sessionId);
      formData.append("sdkToken", sdkToken);
    }

    if (isEditing && commentActionState?.commentId) {
      formData.append("actionType", "edit");
      formData.append("commentId", commentActionState.commentId);
    } else if (isReplying && commentActionState?.commentId) {
      formData.append("actionType", "reply");
      formData.append("parentId", commentActionState.commentId);
    } else {
      formData.append("actionType", "create");
    }

    if (!isEditing && !isReplying) {
      const tempId = `temp-${Date.now()}`;
      formData.append("tempId", tempId);

      const optimisticComment: PostComment = {
        id: tempId,
        postId,
        userId: user?.id ?? null,
        externalUserId: sessionId ?? null,
        content: messageText,
        parentId: "",
        isSpam: false,
        isPinned: false,
        isLiked: false,
        workspace_Id: Number(workspaceId),
        likesCount: 0,
        repliesCount: 0,
        createdAt: new Date(),
        updatedAt: new Date().toISOString(),
        creator: {
          id: user?.id ?? "",
          fullName: user?.fullName ?? null,
          avatarUrl: user?.avatarUrl ?? null,
        },
      };

      setAllComments((prev) => ({
        ...prev,
        data: [optimisticComment, ...prev.data],
        pagination: {
          ...prev.pagination,
          total: (prev.pagination.total || 0) + 1,
        },
      }));
    }

    const method = isEditing ? "PATCH" : "POST";

    setMessageText("");
    setCommentActionState(null);

    createCommentFetcher.submit(formData, {
      method,
      action: "/proxy/posts/comments",
    });
  };

  const handleLoadMore = () => {
    const PAGE_LIMIT = 20;
    const nextRealPage = Math.floor(allComments.data.length / PAGE_LIMIT) + 1;

    loadMoreFetcher.load(`?commentsPage=${nextRealPage}`);
  };

  useEffect(() => {
    if (isLoadingMore) return;
    const response = loadMoreFetcher.data?.content?.postComments;
    if (response) {
      setAllComments((prev) => {
        const existingIds = new Set(prev.data.map((c) => c.id));
        const newComments = (response.data || []).filter(
          (c: PostComment) => !existingIds.has(c.id),
        );
        return {
          data: [...prev.data, ...newComments],
          pagination: response.pagination,
        };
      });
    }
  }, [loadMoreFetcher.data, isLoadingMore]);

  const handleDeleteComment = (commentId: string) => {
    setAllComments((prev) => {
      const updatedData = prev.data.filter((c) => c.id !== commentId);
      const totalItemsRemaining = Math.max(0, (prev.pagination.total || 0) - 1);

      return {
        ...prev,
        data: updatedData,
        pagination: { ...prev.pagination, total: totalItemsRemaining },
      };
    });
  };

  const handlePinComment = (commentId: string, isPinned: boolean) => {
    setAllComments((prev) => {
      const updatedData = prev.data.map((comment) =>
        comment.id === commentId ? { ...comment, isPinned } : comment,
      );
      updatedData.sort((a, b) => Number(b.isPinned) - Number(a.isPinned));
      return { ...prev, data: updatedData };
    });
  };

  const hasComments = allComments.data.length > 0;

  return (
    <div className={cn("w-full h-full relative!", className)}>
      <Activity mode={hasComments ? "visible" : "hidden"}>
        <div className="absolute inset-0 flex flex-col p-3 gap-6 overflow-y-auto overflow-x-hidden pb-20 no-scrollbar">
          {allComments.data.map((comment) => (
            <FeedbackItem
              key={comment.id}
              isRoot={true}
              setMessageText={setMessageText}
              comment={comment}
              isPending={comment.id.startsWith("temp-")}
              submittingEditCommentId={submittingEditCommentId}
              commentActionState={commentActionState}
              setCommentActionState={setCommentActionState}
              currentUserId={user?.id ?? null}
              currentUserRole={currentUserRole}
              workspaceId={workspaceId}
              postId={postId}
              onDeleteSuccess={handleDeleteComment}
              onPinSuccess={handlePinComment}
              isAuthenticated={isAuthenticated}
              onRequireAuth={onRequireAuth}
              isPortal={isPortal}
              sdkToken={sdkToken}
              sessionId={sessionId}
            />
          ))}

          <div className="flex justify-center py-4">
            <Activity
              mode={allComments.pagination.hasNext ? "visible" : "hidden"}
            >
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <Spinner />
                    <span>در حال بارگذاری...</span>
                  </>
                ) : (
                  "بارگذاری بیشتر"
                )}
              </Button>
            </Activity>
          </div>
        </div>
      </Activity>

      <Activity mode={hasComments ? "hidden" : "visible"}>
        <DataEmptyState
          title="هیچ دیدگاهی ثبت نشده است."
          illustrationType="chat"
          size="sm"
          className="h-full"
        />
      </Activity>

      <FeedbackInput
        isEdit={commentActionState?.mode === "editing"}
        isReply={commentActionState?.mode === "replying"}
        messageText={messageText}
        setMessageText={setMessageText}
        onCancelEdit={() => {
          setCommentActionState(null);
          setMessageText("");
        }}
        onCancelReply={() => setCommentActionState(null)}
        onSubmitMessage={handleSubmitMessage}
        user={user}
        isSending={isSending}
        commentActionState={commentActionState}
      />
    </div>
  );
}
