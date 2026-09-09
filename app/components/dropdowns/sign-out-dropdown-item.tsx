import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "../ui/animate-ui/radix/dropdown-menu";
import { useFetcher } from "react-router";
import { useActionAlert } from "~/hooks/use-action-alert";

export default function SignOutDropdownItem() {
  const fetcher = useFetcher();
  useActionAlert(fetcher.data);

  return (
    <DropdownMenuItem
      className="justify-between"
      onClick={() =>
        fetcher.submit({}, { action: "/proxy/auth/sign-out", method: "POST" })
      }
    >
      <span className="text-red-600 dark:text-red-500">
        خروج از حساب کاربری
      </span>
      <LogOut className="text-red-600 dark:text-red-500" />
    </DropdownMenuItem>
  );
}
