import { AlertCircle, RefreshCw, Sparkles } from "lucide-react";
import { Activity, useEffect } from "react";
import { useFetcher } from "react-router";
import { RippleButton } from "~/components/ui/animate-ui/buttons/ripple";
import { TypingText } from "~/components/ui/animate-ui/typing";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useActionAlert } from "~/hooks/use-action-alert";
import type { CreateResponse } from "~/types";

interface AiSummaryDialogProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  postId: string;
}

export default function AiSummaryDialog({
  isOpen,
  setIsOpen,
  postId,
}: Readonly<AiSummaryDialogProps>) {
  const fetcher = useFetcher<CreateResponse<{ summary: string }>>();
  useActionAlert(fetcher.data);

  useEffect(() => {
    if (isOpen && postId) {
      fetcher.load(`/proxy/posts/comments/summary?postId=${postId}`);
    }
  }, [isOpen, postId]);

  useEffect(() => {
    if (!isOpen) {
      fetcher.reset();
    }
  }, [isOpen]);

  const isLoading = fetcher.state !== "idle";
  const hasData = fetcher.state === "idle" && fetcher.data?.data?.summary;
  const hasError = fetcher.data?.status === "ERR" && !isLoading;

  return (
    <Dialog open={isOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="text-purple-500 drop-shadow" /> نتیجه خلاصه
            هوشمند
          </DialogTitle>

          <DialogDescription>
            خلاصه‌ای از دیدگاه‌های کاربران با کمک هوش مصنوعی
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1">
          <Activity
            mode={isLoading || (!hasData && !hasError) ? "visible" : "hidden"}
          >
            <AiSummaryLoading />
          </Activity>

          <Activity mode={hasData ? "visible" : "hidden"}>
            <TypingText
              text={fetcher.data?.data?.summary || ""}
              className="text-sm md:text-base"
            />
          </Activity>

          <Activity mode={hasError ? "visible" : "hidden"}>
            <ErrorDisplay
              title="خطا در دریافت خلاصه"
              onRetry={() =>
                fetcher.load(`/proxy/posts/comments/summary?postId=${postId}`)
              }
              error="مشکلی در ارتباط با سرور پیش آمده"
            />
          </Activity>
        </div>

        <DialogFooter className="md:mt-2 lg:mt-3">
          <RippleButton
            variant="outline"
            size="sm"
            className="w-full "
            onClick={() => setIsOpen(false)}
          >
            بستن
          </RippleButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AiSummaryLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-6">
      <div className="relative">
        <div className="absolute inset-0 h-16 w-16 rounded-full bg-linear-to-r from-purple-500 to-pink-500 blur-xl opacity-70 animate-pulse" />
        <div className="absolute inset-2 h-12 w-12 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 blur-lg opacity-80 animate-ping" />
        <div className="relative h-8 w-8 rounded-full bg-linear-to-r from-purple-400 to-blue-400 animate-spin" />
      </div>

      <div className="text-center space-y-3">
        <h3 className="text-lg font-medium text-foreground">
          هوش مصنوعی در حال تحلیل دیدگاه‌ها...
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          در حال خواندن و خلاصه‌سازی نظرات کاربران با دقت بالا
        </p>
      </div>

      <div className="flex gap-1.5">
        <div
          className="h-2 w-2 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <div
          className="h-2 w-2 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="h-2 w-2 rounded-full bg-primary animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}

interface ErrorDisplaySimpleProps {
  error?: string | null;
  onRetry?: () => void;
  title?: string;
}

export function ErrorDisplay({
  error,
  onRetry,
  title = "خطا در دریافت اطلاعات",
}: ErrorDisplaySimpleProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center space-y-4 max-w-sm">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-500/10 p-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-medium text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {error || "مشکلی پیش آمده. لطفاً دوباره تلاش کنید."}
          </p>
        </div>

        <Activity mode={onRetry ? "visible" : "hidden"}>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-accent transition-colors duration-200 text-sm text-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            تلاش مجدد
          </button>
        </Activity>
      </div>
    </div>
  );
}
