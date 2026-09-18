import { motion, useAnimation } from "motion/react";
import { ChevronUp } from "lucide-react";
import { CountingNumber } from "~/components/ui/animate-ui/text/counting-number";
import { cn } from "~/lib/utils";
import { useFetcher } from "react-router";
import { Spinner } from "~/components/ui/spinner";
import type { CreateResponse, Post, ToggleVoteResponse } from "~/types";
import { useEffect, useState } from "react";
import { useActionAlert } from "~/hooks/use-action-alert";

interface UpvoteButtonProps {
  post: Post;
  isAuthenticated?: boolean;
  onRequireAuth?: () => void;
  isPortal?: boolean;
  sessionId?: string;
  sdkToken?: string;
}

export const UpvoteButton = ({
  post,
  isAuthenticated,
  onRequireAuth,
  isPortal = false,
  sessionId,
  sdkToken,
}: Readonly<UpvoteButtonProps>) => {
  const upvoteFetcher = useFetcher<CreateResponse<ToggleVoteResponse>>();
  const iconControls = useAnimation();

  useActionAlert(upvoteFetcher.data);

  const [isVoted, setIsVoted] = useState(post.isVoted);
  const [votesCount, setVotesCount] = useState(post.votesCount);

  const isLoading = upvoteFetcher.state !== "idle";

  useEffect(() => {
    setIsVoted(post.isVoted);
    setVotesCount(post.votesCount);
  }, [post.isVoted, post.votesCount]);

  useEffect(() => {
    if (upvoteFetcher.state !== "idle") return;

    const response = upvoteFetcher.data;

    if (response?.status === "OK" && response.data) {
      setIsVoted(response.data.voted);
      setVotesCount(response.data.votesCount);
    }
  }, [upvoteFetcher.data, upvoteFetcher.state]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isLoading) return;

    const animateIcon = async () => {
      await iconControls.start({
        y: -6,
        scale: 1.2,
        transition: {
          duration: 0.12,
          ease: "easeOut",
        },
      });

      await iconControls.start({
        y: 0,
        scale: 1,
        transition: {
          duration: 0.18,
          ease: "easeIn",
        },
      });
    };

    animateIcon();

    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }

    upvoteFetcher.submit(
      {
        postId: post.id,
        sessionId: sessionId ?? null,
        sdkToken: sdkToken ?? null,
        isPortal,
      },
      {
        method: "POST",
        action: "/proxy/posts/vote",
        defaultShouldRevalidate: false,
      },
    );
  };

  return (
    <motion.div
      whileHover={{
        scale: 0.96,
        transition: {
          duration: 0.15,
          ease: "easeOut",
        },
      }}
      whileTap={{ scale: 0.92 }}
      onClick={handleClick}
      className={cn(
        "relative flex flex-col items-center justify-center",
        "px-1 py-1 min-h-10 w-8",
        "rounded-lg border cursor-pointer select-none",
        "transition-all duration-200 ease-in-out",
        isVoted
          ? "bg-blue-50 border-blue-200 shadow-[0_0_0_3px_rgba(59,130,246,0.1)] dark:bg-blue-950/40 dark:border-blue-800"
          : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-700 dark:hover:bg-neutral-800",
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center gap-0.5",
          isLoading && "invisible",
        )}
      >
        <motion.div
          animate={iconControls}
          className={cn(isLoading && "hidden")}
        >
          <ChevronUp
            strokeWidth={isVoted ? 2.5 : 2}
            className={cn(
              "size-4 transition-all duration-200",
              isVoted ? "text-blue-500" : "text-gray-400",
            )}
          />
        </motion.div>

        <CountingNumber
          number={votesCount}
          className={cn(
            "text-xs font-medium leading-none cursor-pointer transition-colors duration-200",
            isVoted ? "text-blue-500" : "text-gray-500",
          )}
        />
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner className="size-4 text-blue-400" />
        </div>
      )}
    </motion.div>
  );
};
