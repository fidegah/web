import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fa";
import { Bell, CheckCheck } from "lucide-react";
import { Activity } from "react";
import { useFetcher } from "react-router";
import { Badge } from "../../ui/badge";
import { DataEmptyState } from "../../ui/empty-state";
import MenuIconButton from "../../ui/menu-icon-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/animate-ui/radix/dropdown-menu";
import { NotificationSection } from "./notification-section";
import { useActionAlert } from "~/hooks/use-action-alert";
import type { Notification, Paginated } from "~/types";

dayjs.extend(relativeTime);
dayjs.locale("fa");

interface NotificationDropdownProps {
  notifications: Paginated<Notification[]>;
}

export default function NotificationDropdown({
  notifications,
}: Readonly<NotificationDropdownProps>) {
  const markAsReadFetcher = useFetcher();
  const deleteFetcher = useFetcher();
  useActionAlert(markAsReadFetcher.data);
  useActionAlert(deleteFetcher.data);

  const readNotifications = notifications.data.filter((n) => n.isRead);
  const unreadNotifications = notifications.data.filter((n) => !n.isRead);

  const isEmpty =
    readNotifications.length === 0 && unreadNotifications.length === 0;

  const handleMarkAsRead = (notificationId?: string) => {
    const formData = new FormData();
    if (notificationId) {
      formData.append("notificationId", notificationId);
    } else {
      unreadNotifications.forEach((n) => {
        formData.append("notificationId", n.id);
      });
    }

    markAsReadFetcher.submit(formData, {
      method: "POST",
      action: "/proxy/notifications/mark-as-read",
    });
  };

  const handleDelete = (notificationId: string) => {
    deleteFetcher.submit(
      { notificationId },
      {
        method: "DELETE",
        action: "/proxy/notifications",
      },
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="relative inline-flex items-center justify-center outline-none cursor-pointer">
          <MenuIconButton icon={Bell} />
          <Activity
            mode={unreadNotifications.length > 0 ? "visible" : "hidden"}
          >
            <Badge
              className="absolute -top-1 -right-1 h-5 min-w-5 justify-center rounded-full px-1.5 font-mono text-xs tabular-nums bg-blue-600 text-white shadow-sm ring-2 ring-background dark:bg-blue-500"
              variant="default"
            >
              {unreadNotifications.length > 99
                ? "+99"
                : unreadNotifications.length}
            </Badge>
          </Activity>
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-85 md:w-96 lg:w-120 max-h-125 overflow-y-auto rounded-xl p-2 shadow-xl border border-border/40 bg-background/95 backdrop-blur-md mr-3 md:mr-0"
        align="end"
        dir="rtl"
      >
        <DropdownMenuLabel>
          <div className="flex justify-between items-center px-1 py-1.5">
            <span className="font-semibold text-sm lg:text-base text-foreground">
              اعلان‌ها
            </span>

            <Activity
              mode={
                !isEmpty && unreadNotifications.length > 0
                  ? "visible"
                  : "hidden"
              }
            >
              <button
                type="button"
                onClick={() => handleMarkAsRead()}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
              >
                <span>علامت‌گذاری همه</span>
                <CheckCheck className="size-4" />
              </button>
            </Activity>

            <Activity mode={isEmpty ? "visible" : "hidden"}>
              <span className="text-muted-foreground font-normal text-xs">
                اعلان خوانده‌نشده‌ای ندارید!
              </span>
            </Activity>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1.5" />

        <Activity mode={isEmpty ? "visible" : "hidden"}>
          <div className="py-8">
            <DataEmptyState
              title="هیچ اعلانی موجود نمی‌باشد."
              description="اعلان‌های جدید شما در این بخش نمایش داده خواهند شد."
              className="h-fit"
              size="sm"
            />
          </div>
        </Activity>

        <DropdownMenuGroup className="space-y-1">
          <Activity
            mode={unreadNotifications.length > 0 ? "visible" : "hidden"}
          >
            <div className="px-2 py-1 text-[11px] font-medium text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20 rounded-md mb-1 text-right">
              خوانده نشده‌ها
            </div>
            {unreadNotifications.map((item, index) => (
              <NotificationSection
                key={item.id}
                isRead={false}
                notification={item}
                onDelete={() => handleDelete(String(item.id))}
                onMarkAsRead={() => handleMarkAsRead(String(item.id))}
                isLast={index === unreadNotifications.length - 1}
              />
            ))}
          </Activity>

          <Activity mode={readNotifications.length > 0 ? "visible" : "hidden"}>
            <div className="px-2 py-1 text-[11px] font-medium text-muted-foreground mt-2 mb-1 text-right">
              خوانده شده‌های قبلی
            </div>
            {readNotifications.map((item, index) => (
              <NotificationSection
                key={item.id}
                isRead={true}
                notification={item}
                onDelete={() => handleDelete(String(item.id))}
                isDeleting={deleteFetcher.state !== "idle"}
                isMarkingAsRead={markAsReadFetcher.state !== "idle"}
                isLast={index === readNotifications.length - 1}
              />
            ))}
          </Activity>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
