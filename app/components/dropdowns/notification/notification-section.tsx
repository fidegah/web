import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fa";
import { Bell, CheckCheck, Trash } from "lucide-react";
import { Activity } from "react";
import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import { DropdownMenuSeparator } from "~/components/ui/animate-ui/radix/dropdown-menu";
import { Spinner } from "~/components/ui/spinner";
import { messageTypeConfig } from "~/constants/message-types";
import { cn } from "~/lib/utils";
import type { Notification } from "~/types";

dayjs.extend(relativeTime);
dayjs.locale("fa");

interface NotificationSectionProps {
  isRead: boolean;
  notification: Notification;
  onDelete: () => void;
  onMarkAsRead?: () => void;
  isDeleting?: boolean;
  isMarkingAsRead?: boolean;
  isLast?: boolean;
}

const defaultConfig = {
  icon: Bell,
  color: "text-blue-600 dark:text-blue-400",
  bg: "bg-blue-100 dark:bg-blue-900/30",
};

export const NotificationSection = ({
  isRead,
  notification,
  onDelete,
  onMarkAsRead,
  isDeleting,
  isMarkingAsRead,
  isLast = false,
}: NotificationSectionProps) => {
  type MessageType = keyof typeof messageTypeConfig;

  const rawType = (notification as { type?: string }).type;
  const isKnownType = (type?: string): type is MessageType =>
    Boolean(type && type in messageTypeConfig);

  const typeConfig = isKnownType(rawType)
    ? messageTypeConfig[rawType]
    : defaultConfig;

  const { icon: Icon, color, bg } = typeConfig;

  const createdAtDate = notification.createdAt;

  return (
    <>
      <div
        className={cn(
          "w-full flex flex-col items-stretch rounded-md p-2 transition-all duration-300 select-none text-right cursor-pointer",
          "hover:bg-slate-100/80 dark:hover:bg-slate-800/50 ready-to-separate",
          isRead
            ? "bg-transparent"
            : "bg-blue-50/40 dark:bg-blue-950/10 hover:bg-blue-50/80 dark:hover:bg-blue-950/20",
        )}
        dir="rtl"
      >
        <div className="w-full flex items-center gap-2.5">
          <div
            className={cn(
              "flex items-center justify-center rounded-lg p-1.5 shrink-0 size-8",
              color,
              bg,
            )}
          >
            <Icon className="size-4" />
          </div>

          <div className="flex-1 min-w-0 flex flex-col text-right items-stretch">
            <div className="w-full flex items-center justify-between gap-2">
              <h4
                className={cn(
                  "font-medium line-clamp-1 text-foreground text-right",
                  !isRead && "font-semibold text-blue-900 dark:text-blue-300",
                )}
              >
                {notification.title}
              </h4>

              {!isRead && (
                <span className="size-1.5 rounded-full bg-blue-600 dark:bg-blue-500 shrink-0" />
              )}
            </div>

            {notification.description && (
              <p className="text-sm text-muted-foreground line-clamp-1 text-right mt-0.5">
                {notification.description}
              </p>
            )}
          </div>
        </div>

        <div className="w-full flex justify-between items-center mt-1.5 pt-1 border-t border-muted/40">
          <span className="text-xs text-muted-foreground/85 font-light">
            {dayjs(createdAtDate).fromNow()}
          </span>

          <div className="flex items-center gap-1">
            <Activity mode={!isRead && onMarkAsRead ? "visible" : "hidden"}>
              <IconButton
                icon={isMarkingAsRead ? Spinner : CheckCheck}
                onClick={onMarkAsRead}
                disabled={isMarkingAsRead}
                title="علامت‌گذاری به عنوان خوانده شده"
                aria-label="علامت‌گذاری این اعلان به عنوان خوانده شده"
              />
            </Activity>

            <IconButton
              icon={isDeleting ? Spinner : Trash}
              color={[220, 38, 38]}
              onClick={onDelete}
              disabled={isDeleting}
              title="حذف اعلان"
              aria-label="حذف این اعلان"
            />
          </div>
        </div>
      </div>

      {!isLast && <DropdownMenuSeparator className="my-1 opacity-30" />}
    </>
  );
};
