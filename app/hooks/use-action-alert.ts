import { useEffect } from "react";
import { useAlert } from "~/components/alert-context";
import type { CreateResponse } from "~/types";

export function useActionAlert(
  actionData: CreateResponse | { errorMessage: string } | undefined,
) {
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!actionData || "errorMessage" in actionData) return;

    if (actionData?.showAlert && actionData.message) {
      showAlert({
        title: actionData.message,
        description: actionData.description || undefined,
        type: actionData.status === "ERR" ? "error" : "success",
      });
    }
  }, [actionData, showAlert]);
}
