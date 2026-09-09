import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/animate-ui/radix/dropdown-menu";
import InfoItem from "~/components/ui/dashboard/info-item";
import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import {
  Ban,
  Calendar,
  EllipsisVertical,
  Globe,
  Mail,
  MonitorCog,
  MonitorSmartphone,
  Trash,
  Undo2,
  UserRound,
} from "lucide-react";
import dayjs from "dayjs";
import { cn, getInitials } from "~/lib/utils";
import { Fragment } from "react/jsx-runtime";
import jalaliday from "jalali-plugin-dayjs";
import type { ActivitySummary, WorkspaceUser } from "~/types";
import UserActionDialog from "../dialogs/user-action-dialog";

dayjs.extend(jalaliday);
dayjs.calendar("jalali");
dayjs.locale("fa");

interface UserInfoProps {
  currentUserId: string;
  isUserBanned: boolean;
  userInfo: WorkspaceUser | null;
  activitySummary: ActivitySummary;
  className?: string;
}

export default function UserInfo({
  currentUserId,
  isUserBanned,
  userInfo,
  activitySummary,
  className,
}: Readonly<UserInfoProps>) {
  if (!userInfo) return null;

  const {
    userId: profileId,
    createdAt,
    fullName,
    email,
    avatarUrl,
    bannedAt,
    browserName,
    osName,
    deviceModel,
  } = userInfo;

  const { postsCreated, commentsWritten, votesGiven } = activitySummary;

  const infoItemData = [
    {
      id: 1,
      label: "تاریخ ساخت حساب کاربری",
      value: dayjs(createdAt).format("YYYY/M/D"),
      icon: Calendar,
    },
    { id: 2, label: "نام کامل", value: fullName, icon: UserRound },
    { id: 3, label: "ایمیل", value: email, icon: Mail },
    { id: 4, label: "مرورگر", value: browserName, icon: Globe },
    { id: 5, label: "سیستم عامل", value: osName, icon: MonitorCog },
    { id: 6, label: "دستگاه", value: deviceModel, icon: MonitorSmartphone },
    {
      id: 7,
      label: "تاریخ مسدود شدن",
      value: bannedAt ? dayjs(bannedAt).format("YYYY/M/D") : "-",
      icon: Ban,
    },
  ];

  const isSelf = profileId === currentUserId;

  return (
    <div className={cn("w-full lg:w-[35%] flex flex-col h-screen", className)}>
      <div className="w-full p-3 flex flex-col border-b">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage src={avatarUrl || undefined} />
            <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
          </Avatar>

          <div className="w-full flex flex-col gap-1">
            <div className="w-full flex justify-between items-center">
              <b>{fullName}</b>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconButton
                    icon={EllipsisVertical}
                    title="مدیریت کاربر"
                    aria-label={`عملیات مدیریت برای کاربر ${fullName}`}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent dir="rtl" align="end">
                  <DropdownMenuGroup>
                    <UserActionDialog
                      actionType="delete"
                      selectedUsers={[profileId]}
                    >
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={(e) => e.preventDefault()}
                        disabled={isSelf}
                      >
                        <Trash className="text-red-500" />
                        <span className="text-red-500">حذف کاربر</span>
                      </DropdownMenuItem>
                    </UserActionDialog>

                    <DropdownMenuSeparator />

                    <UserActionDialog
                      actionType={isUserBanned ? "unban" : "ban"}
                      selectedUsers={[profileId]}
                    >
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={(e) => e.preventDefault()}
                        disabled={isSelf}
                      >
                        {isUserBanned ? (
                          <Undo2 className="text-[rgb(34,197,94)]" />
                        ) : (
                          <Ban className="text-red-500" />
                        )}
                        <span
                          className={cn(
                            isUserBanned
                              ? "text-[rgb(34,197,94)]"
                              : "text-red-500",
                          )}
                        >
                          {isUserBanned
                            ? "رفع مسدودی کاربر"
                            : "مسدود کردن کاربر"}
                        </span>
                      </DropdownMenuItem>
                    </UserActionDialog>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-3 text-muted-foreground">
              {[
                { label: "پست", value: postsCreated },
                { label: "دیدگاه", value: commentsWritten },
                { label: "رأی", value: votesGiven },
              ].map((item, index, arr) => (
                <Fragment key={item.label}>
                  <small>
                    <b className="text-black dark:text-white">{item.value}</b>{" "}
                    {item.label}
                  </small>
                  {index < arr.length - 1 && (
                    <span className="text-gray-400">•</span>
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full p-3 flex flex-col">
        <b className="text-sm">اطلاعات کاربر</b>

        <div className="mt-4 flex flex-col gap-3">
          {infoItemData.map((item) => (
            <InfoItem key={item.id} icon={item.icon} label={item.label}>
              <span>{item.value || "-"}</span>
            </InfoItem>
          ))}
        </div>
      </div>
    </div>
  );
}
