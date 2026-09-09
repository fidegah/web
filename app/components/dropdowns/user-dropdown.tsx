import { ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/animate-ui/radix/dropdown-menu";
import { SidebarMenuButton } from "../ui/animate-ui/radix/sidebar";
import { useDevice } from "~/hooks/use-device";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "~/lib/utils";
import type { User } from "~/types";

const UserProfile = ({
  avatarURL,
  fullName,
  email,
}: {
  avatarURL: string | undefined;
  fullName: string;
  email: string;
}) => {
  return (
    <>
      <Avatar className="size-8 rounded-md">
        <AvatarImage src={avatarURL} alt={`${fullName} Avatar`} />
        <AvatarFallback className="rounded-md">
          {getInitials(fullName)}
        </AvatarFallback>
      </Avatar>
      <div className="w-full mr-1 flex flex-col gap-2 text-right text-sm leading-tight">
        <span className="truncate font-semibold">{fullName}</span>
        <span className="truncate text-xs text-muted-foreground">{email}</span>
      </div>
    </>
  );
};

interface UserDropdownProps {
  user: User;
  children: React.ReactNode;
}

export default function UserDropdown({
  user,
  children,
}: Readonly<UserDropdownProps>) {
  const { isMobile } = useDevice();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg">
          <UserProfile
            avatarURL={user.avatarUrl || undefined}
            email={user.email}
            fullName={user.fullName}
          />
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg rtl"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
