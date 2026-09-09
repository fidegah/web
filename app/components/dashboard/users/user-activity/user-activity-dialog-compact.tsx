import UserActivity from "./user-activity";
import type { Paginated, UserActivityStatus } from "~/types";
import { Dialog, DialogContent } from "~/components/ui/dialog";

interface UserActivityDialogCompactProps {
  selectedUserId: string | undefined;
  activityStatus: Paginated<UserActivityStatus>;
  isUserActivityDialogOpen: boolean;
  setIsUserActivityDialogOpen: (val: boolean) => void;
  ACTIVITY_LIMIT: number;
}

export default function UserActivityDialogCompact({
  isUserActivityDialogOpen,
  setIsUserActivityDialogOpen,
  selectedUserId,
  activityStatus,
  ACTIVITY_LIMIT,
}: Readonly<UserActivityDialogCompactProps>) {
  return (
    <Dialog
      open={isUserActivityDialogOpen}
      onOpenChange={(open) => setIsUserActivityDialogOpen(open)}
    >
      <DialogContent>
        <UserActivity
          setIsOpenFilterDialog={setIsUserActivityDialogOpen}
          className="border-none"
          activityStatus={activityStatus}
          selectedUserId={selectedUserId}
          ACTIVITY_LIMIT={ACTIVITY_LIMIT}
        />
      </DialogContent>
    </Dialog>
  );
}
