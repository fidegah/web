import { useId, useState, useEffect, useRef, Activity } from "react";
import { RippleButton } from "./animate-ui/buttons/ripple";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Spinner } from "./spinner";

interface ConfirmDialogProps {
  children?: React.ReactNode;
  title: string;
  description?: string | string[];
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function ConfirmDialog({
  children,
  title,
  description,
  cancelText = "لغو",
  confirmText,
  onConfirm,
  isLoading,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: Readonly<ConfirmDialogProps>) {
  const baseId = useId();
  const [internalOpen, setInternalOpen] = useState(false);
  const wasLoading = useRef(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (value: boolean) => {
    if (!isControlled) {
      setInternalOpen(value);
    }
    controlledOnOpenChange?.(value);
  };

  useEffect(() => {
    if (isLoading) {
      wasLoading.current = true;
    }

    if (!isLoading && wasLoading.current) {
      handleOpenChange(false);
      wasLoading.current = false;
    }
  }, [isLoading]);

  const handleConfirm = () => {
    if (isLoading) return;
    onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <Activity mode={children ? "visible" : "hidden"}>
        <DialogTrigger asChild>{children}</DialogTrigger>
      </Activity>

      <DialogContent
        showCloseButton={false}
        className="max-h-2/3 w-4/5 md:w-1/3 lg:w-1/4 rounded-2xl"
      >
        <DialogHeader>
          <DialogTitle className="leading-7">{title}</DialogTitle>
        </DialogHeader>

        {Array.isArray(description) && (
          <ul className="text-muted-foreground text-xs lg:text-sm space-y-1 list-disc pr-4">
            {description.map((item, index) => (
              <li key={`${baseId}-${index}`}>{item}</li>
            ))}
          </ul>
        )}
        {typeof description === "string" && (
          <p className="text-muted-foreground text-xs lg:text-sm">
            {description}
          </p>
        )}
        <DialogFooter className="mt-6 gap-3">
          <RippleButton
            variant="destructive"
            type="button"
            disabled={isLoading}
            onClick={handleConfirm}
          >
            {isLoading ? <Spinner /> : confirmText}
          </RippleButton>
          <RippleButton
            disabled={isLoading}
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            {cancelText}
          </RippleButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
