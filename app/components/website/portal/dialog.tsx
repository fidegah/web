import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "~/components/ui/dialog";

interface PortalPostDialogProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function PortalDialog({
  isOpen,
  setIsOpen,
  title,
  description,
  children,
}: Readonly<PortalPostDialogProps>) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent className="h-full w-full rounded-none flex flex-col md:max-h-[80%] md:rounded-md">
        <DialogHeader className="border-gray-100 dark:border-gray-800 shrink-0">
          <DialogTitle className="text-right">{title}</DialogTitle>

          {description && (
            <DialogDescription className="text-start mt-1.5 pb-3">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
}
