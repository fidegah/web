import { AlertCircle } from "lucide-react";
import type { CreateResponse } from "~/types";

interface ErrorMessageProps {
  data: CreateResponse | undefined;
}
export default function ErrorMessage({ data }: ErrorMessageProps) {
  const message = data?.message;

  return !data?.showAlert && message ? (
    <div className="col-span-full w-full animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="flex items-start gap-3 p-3 rounded-lg shadow-sm text-red-800 bg-red-50 border-r-4 border-red-500 dark:text-red-400 dark:bg-red-950/30 dark:border-red-500">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />

        <p className="text-[13px] leading-6 font-medium flex-1 text-right whitespace-normal">
          {message}
        </p>
      </div>
    </div>
  ) : null;
}
