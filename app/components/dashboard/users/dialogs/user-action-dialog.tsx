import { useEffect } from "react";
import { useFetcher, useNavigate } from "react-router";
import ConfirmDialog from "../../../ui/confirm-dialog";
import type { HTMLFormMethod } from "react-router";
import { useActionAlert } from "~/hooks/use-action-alert";

interface UserActionDialogProps {
  actionType: "ban" | "unban" | "delete";
  selectedUsers: string[];
  onSuccess?: () => void;
  children: React.ReactNode;
}

export default function UserActionDialog({
  actionType,
  selectedUsers,
  onSuccess,
  children,
}: Readonly<UserActionDialogProps>) {
  const fetcher = useFetcher();
  useActionAlert(fetcher.data);
  const navigate = useNavigate();

  const isLoading = fetcher.state !== "idle";

  useEffect(() => {
    if (!isLoading && fetcher.data?.status === "OK") {
      onSuccess?.();
      fetcher.reset();
      if (actionType === "delete") {
        navigate("/dashboard/users");
      }
    }
  }, [fetcher.data, isLoading, actionType, navigate, onSuccess]);

  const config = {
    ban: {
      method: "POST",
      action: "/proxy/users/toggle-user-ban",
      title: "آیا از مسدودسازی این کاربر اطمینان دارید؟",
      confirmText: "مسدودسازی کاربر",
      description: [
        "تمام دیدگاه‌ها و رأی‌های ثبت‌شده حذف می‌شوند.",
        "کاربر امکان ورود و ثبت محتوا را نخواهد داشت.",
      ],
    },
    unban: {
      method: "DELETE",
      action: "/proxy/users/toggle-user-ban",
      title: "آیا از رفع مسدودسازی این کاربر اطمینان دارید؟",
      confirmText: "رفع مسدودسازی",
      description: ["کاربر دوباره می‌تواند وارد پورتال شود و محتوا ثبت کند."],
    },
    delete: {
      method: "DELETE",
      action: "/proxy/users",
      title: `آیا از حذف ${selectedUsers.length} کاربر مطمئن هستید؟`,
      confirmText: "حذف",
      description: [
        "تمام دیدگاه‌ها و رأی‌ها حذف می‌شوند.",
        "پست‌های بدون دیدگاه یا رأی نیز حذف می‌شوند.",
        "این عمل غیرقابل بازگشت است!",
      ],
    },
  };

  const currentConfig = config[actionType];

  async function handleAction() {
    const formData = new FormData();
    selectedUsers.forEach((userId) => {
      formData.append("user_id", userId);
    });
    fetcher.submit(formData, {
      method: currentConfig.method as HTMLFormMethod,
      action: currentConfig.action,
    });
  }

  return (
    <ConfirmDialog
      title={currentConfig.title}
      description={currentConfig.description}
      confirmText={currentConfig.confirmText}
      onConfirm={handleAction}
      isLoading={isLoading}
    >
      {children}
    </ConfirmDialog>
  );
}
