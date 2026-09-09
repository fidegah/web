import type { ReactNode } from "react";
import { useSearchParams } from "react-router";
import { RippleButton } from "~/components/ui/animate-ui/buttons/ripple";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Skeleton } from "~/components/ui/skeleton";

interface FilterDialogProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  isLoading: boolean;
  children: ReactNode;
}

export default function FilterDialog({
  isOpen,
  setIsOpen,
  isLoading,
  children,
}: Readonly<FilterDialogProps>) {
  const [_, setSearchParams] = useSearchParams();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>فیلترها</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6">{children}</div>

        <DialogFooter className="mt-8 pt-4 border-t border-border flex gap-3">
          {isLoading ? (
            <Skeleton className="rounded-lg h-10 w-28" />
          ) : (
            <RippleButton
              onClick={() => {
                setSearchParams({});
                setIsOpen(false);
              }}
              className="bg-muted hover:bg-muted/85 text-muted-foreground hover:text-foreground px-5 py-2 rounded-lg text-sm font-medium transition-all"
            >
              بازنشانی فیلترها
            </RippleButton>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
