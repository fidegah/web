import { ArrowUp, MessageCircle } from "lucide-react";
import { Activity } from "react";

interface FeedbackCardProps {
  title: string;
  description?: string;
  votesCount: number | undefined;
  commentsCount: number | undefined;
  onClick?: () => void;
}

export default function FeedbackPostItem({
  onClick,
  title,
  description,
  votesCount,
  commentsCount,
}: Readonly<FeedbackCardProps>) {
  return (
    <button
      onClick={onClick}
      className="size-full text-start flex flex-col justify-between p-3 gap-3 relative"
    >
      <div className="flex flex-col gap-3 ">
        <b className="text-sm line-clamp-1 lg:text-[14.5px] dark:text-gray-300">
          {title}
        </b>

        <Activity mode={description ? "visible" : "hidden"}>
          <p className="text-xs text-muted-foreground line-clamp-2 lg:text-[13px]">
            {description}
          </p>
        </Activity>
      </div>

      <div className="flex items-center text-muted-foreground gap-3 mt-1 text-xs lg:text-sm">
        <div className="flex items-center gap-1">
          <ArrowUp className="size-4 lg:size-4.5" />
          <span>{votesCount}</span>
        </div>

        <div className="flex items-center gap-1">
          <MessageCircle className="size-4 lg:size-4.5" />
          <span>{commentsCount}</span>
        </div>
      </div>
    </button>
  );
}
