import { useState } from "react";
import { Eye, EyeOff, Copy } from "lucide-react";
import { useCopyToClipboard } from "~/hooks/use-copy-to-clipboard";

interface SecretKeyViewerProps {
  value: string;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export default function SecretKeyViewer({
  value,
  label,
  description,
  disabled = false,
}: Readonly<SecretKeyViewerProps>) {
  const [showKey, setShowKey] = useState(false);
  const { copy } = useCopyToClipboard();

  return (
    <div
      className={`flex flex-col gap-4 transition-all duration-200 ${disabled ? "opacity-40 pointer-events-none select-none" : ""}`}
    >
      {(label || description) && (
        <div className="flex flex-col gap-2">
          {label && (
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {label}
            </span>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <div className="relative flex items-center mt-1">
        <div className="w-full font-mono text-sm tracking-wider p-3 pl-24 rounded-lg bg-zinc-50 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 overflow-x-auto select-all min-h-11.5 flex items-center justify-start dir-ltr">
          <span
            className={
              showKey
                ? ""
                : "blur-[5px] select-none pointer-events-none opacity-60"
            }
          >
            {value}
          </span>
        </div>

        <div className="absolute left-2 flex items-center gap-1.5 dir-ltr">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setShowKey(!showKey)}
            className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title={showKey ? "پنهان کردن" : "نمایش"}
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>

          <button
            type="button"
            disabled={disabled}
            className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 cursor-pointer"
            title="کپی کردن"
            onClick={() => copy(value)}
          >
            <Copy size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
