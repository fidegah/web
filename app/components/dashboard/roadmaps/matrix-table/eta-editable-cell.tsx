import { useState } from "react";
import { Check, X, Pencil } from "lucide-react";
import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface EtaEditableCellProps {
  initialValue: string;
  onSave: (newValue: string) => void;
}

export function EtaEditableCell({
  initialValue,
  onSave,
}: Readonly<EtaEditableCellProps>) {
  const [isEditing, setIsEditing] = useState(false);
  const normalizedInitial = initialValue === "—" ? "" : initialValue;
  const [value, setValue] = useState(normalizedInitial);

  const handleConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (value !== normalizedInitial) {
      onSave(value);
      setIsEditing(false);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue(normalizedInitial);
    setIsEditing(false);
  };

  const isUnchanged = value === normalizedInitial;

  if (!isEditing) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setIsEditing(true)}
            className="group/btn w-full flex items-center justify-center gap-1.5 py-1 px-2 text-muted-foreground hover:text-foreground text-sm font-medium border border-dashed border-muted-foreground/30 hover:border-muted-foreground/60 rounded-md transition-all cursor-pointer bg-muted/10 hover:bg-muted/40"
          >
            <span>{initialValue}</span>
            <Pencil className="w-3 h-3 opacity-30 group-hover/btn:opacity-70 transition-opacity shrink-0" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>ویرایش زمان تحویل</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="flex items-center justify-between gap-1 min-w-40 h-9 px-2 border border-input rounded-lg bg-background focus-within:ring-1 focus-within:ring-ring focus-within:border-ring">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="مثال: آخر پاییز"
        className="w-full h-full text-sm bg-transparent border-0 outline-none focus:outline-none p-0"
        autoFocus
      />

      <div className="flex items-center gap-0.5 shrink-0 h-full">
        <div
          className="flex items-center justify-center h-full"
          style={{
            opacity: isUnchanged ? 0.3 : 1,
            pointerEvents: isUnchanged ? "none" : "auto",
          }}
        >
          <IconButton
            icon={Check}
            size="sm"
            color={[34, 197, 94]}
            onClick={handleConfirm}
            title="تایید"
            aria-label="تایید ویرایش زمان تحویل"
            disabled={isUnchanged}
          />
        </div>

        <div className="flex items-center justify-center h-full">
          <IconButton
            icon={X}
            size="sm"
            color={[239, 68, 68]}
            onClick={handleCancel}
            title="لغو"
            aria-label="لغو ویرایش زمان تحویل"
          />
        </div>
      </div>
    </div>
  );
}
