import { useAlert } from "~/components/alert-context";

export function useCopyToClipboard() {
  const { showAlert } = useAlert();

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showAlert({
        title: "متن با موفقیت کپی شد.",
        type: "success",
      });
    } catch (err) {
      console.error("Failed to copy text to clipboard:", err);

      showAlert({
        title: "در انجام کپی مشکلی پیش آمد.",
        type: "error",
      });
    }
  };

  return { copy };
}
