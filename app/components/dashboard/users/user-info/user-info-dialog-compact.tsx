import { Dialog, DialogContent } from "~/components/ui/dialog";
import UserInfo from "./user-info";
import type { ActivitySummary, WorkspaceUser } from "~/types";

interface UserInfoDialogCompactProps {
  currentUserId: string;
  userInfo: WorkspaceUser | null;
  activitySummary: ActivitySummary;
  isInfoDialogOpen: boolean;
  setIsInfoDialogOpen: (val: boolean) => void;
  isUserBanned: boolean;
}

export default function UserInfoDialogCompact({
  currentUserId,
  userInfo,
  activitySummary,
  isInfoDialogOpen,
  setIsInfoDialogOpen,
  isUserBanned,
}: Readonly<UserInfoDialogCompactProps>) {
  return (
    <Dialog
      open={isInfoDialogOpen}
      onOpenChange={(open) => setIsInfoDialogOpen(open)}
    >
      <DialogContent>
        <UserInfo
          currentUserId={currentUserId}
          activitySummary={activitySummary}
          userInfo={userInfo}
          isUserBanned={isUserBanned}
        />
      </DialogContent>
    </Dialog>
  );
}
