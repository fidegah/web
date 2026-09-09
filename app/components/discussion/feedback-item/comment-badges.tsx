import { Activity } from "react";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import type { WorkspaceRole } from "~/types";

interface CommentBadgesProps {
  isAdmin: boolean;
  currentUserRole: WorkspaceRole;
  isSpam?: boolean;
}

export default function CommentBadges({
  isAdmin,
  currentUserRole,
  isSpam,
}: Readonly<CommentBadgesProps>) {
  return (
    <>
      <Activity mode={isAdmin ? "visible" : "hidden"}>
        <Badge
          className={cn(
            "backdrop-blur-sm border border-white/20 shadow-lg font-medium py-0 px-1.5 text-xs shrink-0",
            currentUserRole === "owner"
              ? "bg-purple-500/20 text-purple-700 dark:text-purple-300 dark:bg-purple-500/30"
              : "bg-blue-500/20 text-blue-700 dark:text-blue-300 dark:bg-blue-500/30",
          )}
        >
          {currentUserRole === "owner" ? "مدیر" : "ادمین"}
        </Badge>
      </Activity>
      <Activity mode={isSpam ? "visible" : "hidden"}>
        <span className="text-[10px] pb-0.5 py-0.5 px-2 rounded-full border border-red-600 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 shrink-0">
          هرزنامه
        </span>
      </Activity>
    </>
  );
}
