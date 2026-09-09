import InfoItem from "./dashboard/info-item";
import { UserRoundPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { getInitials } from "~/lib/utils";

interface CreatorInfoProps {
  avatarUrl: string | undefined;
  fullName: string;
}

export default function CreatorInfo({
  avatarUrl,
  fullName,
}: Readonly<CreatorInfoProps>) {
  return (
    <InfoItem icon={UserRoundPlus} label="ایجاد کننده">
      <div className="flex flex-col items-center gap-2">
        <Avatar>
          <AvatarImage src={avatarUrl}></AvatarImage>
          <AvatarFallback>{getInitials(fullName)}</AvatarFallback>
        </Avatar>
        <span className="max-w-full truncate">{fullName}</span>
      </div>
    </InfoItem>
  );
}
