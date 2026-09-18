import { Heart, Pencil, Reply } from "lucide-react";
import { Activity } from "react";
import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import IconTooltipButton from "~/components/ui/dashboard/icon-tooltip-button";
import type { CommentActionState, PostComment } from "~/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fa";

dayjs.extend(relativeTime);
dayjs.locale("fa");

interface CommentActionsProps {
  comment: PostComment;
  isLiking: boolean;
  isLiked: boolean;
  toggleCommentLike: () => void;
  setCommentActionState: React.Dispatch<
    React.SetStateAction<CommentActionState>
  >;
  setMessageText: React.Dispatch<React.SetStateAction<string>>;
  hideReply: boolean;
  isOwner: boolean;
}

export default function CommentActions({
  comment,
  isLiking,
  isLiked,
  toggleCommentLike,
  setCommentActionState,
  setMessageText,
  hideReply,
  isOwner,
}: Readonly<CommentActionsProps>) {
  return (
    <div className="mt-2.5 flex items-center text-xs gap-2 text-gray-500 dark:text-gray-400 w-full flex-wrap">
      <IconButton
        size="sm"
        icon={Heart}
        className={isLiking ? "opacity-50 pointer-events-none" : ""}
        color={[220, 38, 38]}
        active={isLiked}
        onClick={toggleCommentLike}
        disabled={isLiking}
        title={isLiked ? "برداشتن پسندیدن" : "پسندیدن دیدگاه"}
        aria-label={isLiked ? "برداشتن پسندیدن دیدگاه" : "پسندیدن دیدگاه"}
      />
      <span>•</span>
      <span>{dayjs(comment.createdAt).fromNow()}</span>

      <Activity mode={isOwner ? "visible" : "hidden"}>
        <>
          <span>•</span>
          <IconTooltipButton
            label="ویرایش"
            icon={Pencil}
            size="sm"
            onClick={() => {
              setCommentActionState({ mode: "editing", commentId: comment.id });
              setMessageText(comment.content);
            }}
          />
        </>
      </Activity>

      <Activity mode={hideReply ? "hidden" : "visible"}>
        <>
          <span>•</span>
          <IconTooltipButton
            label="پاسخ"
            icon={Reply}
            size="sm"
            onClick={() => {
              setCommentActionState({
                mode: "replying",
                commentId: comment.id,
                content: comment.content,
              });
            }}
          />
        </>
      </Activity>
    </div>
  );
}
