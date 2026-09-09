import { Ban, Trash, Undo2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import type { WorkspaceUser } from "~/types";
import UserActionDialog from "./dialogs/user-action-dialog";

interface SelectedUsersBoxProps {
  selectedUsers: string[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<string[]>>;
  workspaceUsers: WorkspaceUser[];
}

export default function SelectedUsersBox({
  workspaceUsers,
  selectedUsers,
  setSelectedUsers,
}: Readonly<SelectedUsersBoxProps>) {
  const selectedUsersData = workspaceUsers.filter((u) =>
    selectedUsers.includes(u.userId),
  );

  const hasAdminOrManager = selectedUsersData.some(
    (user) => user.role !== "contributor",
  );

  const hasActiveUser = selectedUsersData.some((user) => !user.isBanned);
  const hasBannedUser = selectedUsersData.some((user) => user.isBanned);

  const hasMixedStatus = hasActiveUser && hasBannedUser;
  const hasSelectedUsers = selectedUsers.length > 0;

  const renderUserSelectionMessage = () => {
    if (hasAdminOrManager) {
      return (
        <span className="text-destructive font-medium">
          شما نمیتوانید مدیر یا ادمین را انتخاب کنید.
        </span>
      );
    }
    if (hasMixedStatus) {
      return (
        <span className="font-medium text-amber-600">
          تغییر وضعیت فقط برای کاربران هم‌وضعیت امکان‌پذیر است.
        </span>
      );
    }
    return <span>{selectedUsers.length} کاربر انتخاب شده است.</span>;
  };

  return (
    <AnimatePresence>
      {hasSelectedUsers && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20, height: 0 }}
          animate={{ opacity: 1, scale: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, scale: 0.8, y: 20, height: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full flex border rounded-md p-2 items-center justify-between overflow-hidden mt-4"
        >
          <div className="w-full flex items-center justify-between gap-1">
            <div className="text-xs text-muted-foreground">
              {renderUserSelectionMessage()}
            </div>

            <div className="flex items-center gap-2">
              <UserActionDialog
                actionType="delete"
                selectedUsers={selectedUsers}
                onSuccess={() => setSelectedUsers([])}
              >
                <IconButton
                  icon={Trash}
                  color={[220, 38, 38]}
                  disabled={hasAdminOrManager}
                  title="حذف کاربران انتخاب شده"
                  aria-label={`حذف ${selectedUsers.length} کاربر انتخاب شده`}
                />
              </UserActionDialog>

              <UserActionDialog
                actionType={hasActiveUser ? "ban" : "unban"}
                selectedUsers={selectedUsers}
                onSuccess={() => setSelectedUsers([])}
              >
                <IconButton
                  icon={hasActiveUser ? Ban : Undo2}
                  color={hasActiveUser ? [220, 38, 38] : [34, 197, 94]}
                  disabled={hasAdminOrManager || hasMixedStatus}
                  title={
                    hasActiveUser ? "مسدود کردن کاربران" : "رفع مسدودیت کاربران"
                  }
                  aria-label={
                    hasActiveUser
                      ? `مسدود کردن ${selectedUsers.length} کاربر انتخاب شده`
                      : `رفع مسدودیت ${selectedUsers.length} کاربر انتخاب شده`
                  }
                />
              </UserActionDialog>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
