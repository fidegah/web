import type { Post } from "~/types";
import { UpvoteButton } from "./dashboard/feedback/upvote-button";
import { cn } from "~/lib/utils";
import { MessageSquareIcon, ChevronRightIcon } from "lucide-react";
import { Activity } from "react";

interface PostCardProps {
  post: Post;
  leftSection?: React.ReactNode;
  titleClassName?: string;
  onClick?: () => void;
  className?: string;
  isActive?: boolean;
  isAuthenticated?: boolean;
  onRequireAuth?: () => void;
  showUpvoteButton?: boolean;
  isPortal?: boolean;
  sessionId?: string;
  sdkToken?: string;
}

export default function PostCard({
  post,
  leftSection,
  titleClassName,
  onClick,
  className,
  isActive = false,
  isAuthenticated,
  onRequireAuth,
  showUpvoteButton = true,
  isPortal = false,
  sessionId,
  sdkToken,
}: Readonly<PostCardProps>) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between gap-2 rounded-lg px-3 py-2 cursor-pointer transition-all duration-300 hover:shadow-sm hover:-translate-y-0.5 w-full",
        isActive
          ? "border border-blue-400 bg-blue-50/50 hover:bg-blue-50/70 hover:border-blue-400 dark:bg-blue-950/30 dark:border-blue-700"
          : "border border-border/50 bg-muted/30 hover:bg-muted/60 hover:border-border",
        className,
      )}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-all duration-300",
            isActive
              ? "border-blue-300 bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:border-blue-600 dark:text-blue-300"
              : "border-border/50 bg-background text-muted-foreground group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-950/50 dark:group-hover:text-blue-400 dark:group-hover:border-blue-800",
          )}
        >
          <MessageSquareIcon className="w-3 h-3" />
        </div>

        <div className="flex flex-col gap-0.5 min-w-0 flex-1 text-right">
          <b
            className={cn(
              "text-sm truncate",
              isActive && "text-blue-700 dark:text-blue-300",
              titleClassName,
            )}
          >
            {post.title}
          </b>
          {post.description && (
            <span className="text-[11px] text-muted-foreground line-clamp-1 wrap-break-word leading-tight">
              {post.description}
            </span>
          )}
        </div>
      </div>

      <Activity mode={showUpvoteButton ? "visible" : "hidden"}>
        <div className="flex items-center gap-1.5 shrink-0">
          <UpvoteButton
            post={post}
            isAuthenticated={isAuthenticated}
            onRequireAuth={onRequireAuth}
            isPortal={isPortal}
            sessionId={sessionId}
            sdkToken={sdkToken}
          />

          <ChevronRightIcon
            className={cn(
              "w-3.5 h-3.5 text-muted-foreground transition-all duration-300",
              "group-hover:translate-x-0.5 group-hover:text-blue-500",
              isActive && "text-blue-500 translate-x-0.5",
            )}
          />
        </div>
      </Activity>

      {leftSection && <div className="shrink-0 ml-1">{leftSection}</div>}
    </button>
  );
}
