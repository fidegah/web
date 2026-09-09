import { BadgeInfo } from "lucide-react";
import { Activity } from "react";
import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Checkbox } from "~/components/ui/checkbox";
import { getInitials } from "~/lib/utils";
import type { WorkspaceUser } from "~/types";

interface UserCardProps {
  member: WorkspaceUser;
  user: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
  checked: boolean;
  isUserBanned: boolean;
  cardOnClick: () => void;
  checkboxOnClick: () => void;
  infoButtonOnClick: () => void;
}

export default function UserItem({
  member,
  user,
  checked,
  isUserBanned,
  cardOnClick,
  checkboxOnClick,
  infoButtonOnClick,
}: Readonly<UserCardProps>) {
  if (!user) return;

  const { avatarUrl, fullName } = user;

  return (
    <button
      className="flex items-center justify-between w-full p-3"
      onClick={cardOnClick}
    >
      <div className="flex items-center gap-3">
        <Avatar className="rounded-full">
          <AvatarImage
            src={avatarUrl || undefined}
            alt={`${fullName} Avatar`}
          />
          <AvatarFallback className="rounded-md">
            {getInitials(fullName)}
          </AvatarFallback>
        </Avatar>
        <p className="text-sm">{fullName}</p>

        <Activity mode={isUserBanned ? "visible" : "hidden"}>
          <Badge className="bg-red-100 text-red-700 border-red-200 border rounded-full font-medium dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50">
            مسدود شده
          </Badge>
        </Activity>
      </div>

      <div className="flex items-center gap-3">
        <IconButton
          className="lg:hidden"
          icon={BadgeInfo}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            infoButtonOnClick();
          }}
          title="اطلاعات کاربر"
          aria-label={`نمایش اطلاعات ${fullName}`}
        />
        <Activity
          mode={
            member.role === "admin" || member.role === "owner"
              ? "visible"
              : "hidden"
          }
        >
          <Checkbox
            checked={checked}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              checkboxOnClick();
            }}
            className="rounded-full cursor-pointer"
          />
        </Activity>
      </div>
    </button>
  );
}
