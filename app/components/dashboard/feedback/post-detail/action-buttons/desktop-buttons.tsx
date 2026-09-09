import { PanelBottomOpen, RefreshCw, Sparkles } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import IconTooltipButton from "~/components/ui/dashboard/icon-tooltip-button";
import { Spinner } from "~/components/ui/spinner";
import { cn } from "~/lib/utils";

interface DesktopButtonsProps {
  isLoading: boolean;
  revalidator: { revalidate: () => void };
  onGenerateSummary: () => void;
  isShowPostCardInfo: boolean;
  setShowPostCardInfo: Dispatch<SetStateAction<boolean>>;
}

export default function DesktopButtons({
  isLoading,
  revalidator,
  onGenerateSummary,
  isShowPostCardInfo,
  setShowPostCardInfo,
}: Readonly<DesktopButtonsProps>) {
  return (
    <div className="hidden lg:flex items-center gap-4">
      <IconTooltipButton
        label="خلاصه دیدگاه‌ها با هوش مصنوعی"
        icon={Sparkles}
        animate
        color={[168, 85, 247]}
        className="bg-linear-to-tr from-violet-500/10 via-sky-500/10 to-fuchsia-500/10 dark:from-violet-400/15 dark:via-sky-400/15 dark:to-fuchsia-400/15 hover:from-violet-500/20 hover:via-sky-500/20 hover:to-fuchsia-500/20 dark:hover:from-violet-400/25 dark:hover:via-sky-400/25 dark:hover:to-fuchsia-400/25 ring-1 ring-violet-500/20 dark:ring-violet-400/25 hover:ring-violet-500/40 dark:hover:ring-violet-400/40 transition-all"
        onClick={onGenerateSummary}
      />

      <IconTooltipButton
        label="بروزسانی اطلاعات"
        icon={isLoading ? Spinner : RefreshCw}
        onClick={revalidator.revalidate}
        className="bg-muted/40 hover:bg-muted/70 dark:bg-muted/30 dark:hover:bg-muted/60 ring-1 ring-border/40 hover:ring-border-70 transition-all"
        disabled={isLoading}
      />

      <IconTooltipButton
        label={
          isShowPostCardInfo
            ? "پنهان کردن اطلاعات بازخورد"
            : "نمایش اطلاعات بازخورد"
        }
        icon={PanelBottomOpen}
        onClick={() => setShowPostCardInfo(!isShowPostCardInfo)}
        className={cn(
          "bg-muted/40 hover:bg-muted/70 dark:bg-muted/30 dark:hover:bg-muted/60 ring-1 ring-border/40 hover:ring-border-70 transition-all",
          isShowPostCardInfo ? "rotate-270" : "rotate-90",
        )}
      />
    </div>
  );
}
