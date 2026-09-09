import { Info, Sparkles, RefreshCw, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/animate-ui/radix/dropdown-menu";
import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import { Spinner } from "~/components/ui/spinner";

interface MobileMenuProps {
  isShowChat: boolean;
  infoBtnOnClick?: () => void;
  isLoading: boolean;
  revalidator: { revalidate: () => void };
  onGenerateSummary: () => void;
}

export default function MobileMenu({
  isShowChat,
  infoBtnOnClick,
  isLoading,
  revalidator,
  onGenerateSummary,
}: Readonly<MobileMenuProps>) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <IconButton
          icon={MoreVertical}
          size="sm"
          title="گزینه‌های بیشتر"
          aria-label="باز کردن منوی گزینه‌های بیشتر"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent dir="rtl" side="bottom" align="end">
        {isShowChat && (
          <DropdownMenuItem onSelect={infoBtnOnClick}>
            <Info className="mr-2 h-4 w-4" /> اطلاعات پست
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onSelect={onGenerateSummary}>
          <Sparkles className="mr-2 h-4 w-4" /> خلاصه دیدگاه‌ها با هوش مصنوعی
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => {
            revalidator.revalidate();
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          بروزرسانی اطلاعات
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
