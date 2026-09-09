import { ChevronDown } from "lucide-react";

interface CommentReplyHeaderProps {
  userFullName: string;
  content: string;
}

export default function CommentReplyHeader({
  userFullName,
  content,
}: Readonly<CommentReplyHeaderProps>) {
  return (
    <div className="mt-2 mb-1 w-full">
      <div className="flex items-start gap-2 text-[11px] bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border border-gray-100 dark:border-gray-700/50 shadow-sm w-full">
        <div className="mt-0.5 text-gray-400 shrink-0">
          <ChevronDown size={12} />
        </div>
        <div className="flex items-center gap-1 min-w-0 w-full">
          <div className="text-gray-500 whitespace-nowrap shrink-0 flex items-center gap-1">
            <span>در پاسخ به</span>
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              {userFullName ?? "کاربر"}
            </span>
            <span>:</span>
          </div>
          <span className="text-gray-600 dark:text-gray-400 italic truncate flex-1 min-w-0">
            "{content}"
          </span>
        </div>
      </div>
    </div>
  );
}
