import { Paperclip, X } from "lucide-react";
import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { useAlert } from "~/components/alert-context";
import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import { MESSAGES } from "~/constants/messages";

interface FilesSectionProps {
  selectedFiles: File[];
  setSelectedFiles: Dispatch<SetStateAction<File[]>>;
}

const MAX_FILES = 5;

export default function FilesSection({
  selectedFiles,
  setSelectedFiles,
}: Readonly<FilesSectionProps>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (hiddenInputRef.current) {
      const dt = new DataTransfer();
      selectedFiles.forEach((f) => dt.items.add(f));
      hiddenInputRef.current.files = dt.files;

      if (selectedFiles.length === 0) {
        hiddenInputRef.current.value = "";
      }
    }
  }, [selectedFiles]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];

    const validTypes = new Set([
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/zip",
    ]);

    const newFiles: File[] = [];

    files.forEach((file) => {
      const isValid = file.size <= 5 * 1024 * 1024 && validTypes.has(file.type);

      const isDuplicate = selectedFiles.some(
        (f) => f.name === file.name && f.size === file.size,
      );

      if (!isValid) {
        showAlert({ title: MESSAGES.GENERAL.FILE_INVALID, type: "error" });
        return;
      }

      if (!isDuplicate) newFiles.push(file);
    });

    if (newFiles.length) setSelectedFiles((prev) => [...prev, ...newFiles]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles((files) =>
      files.filter((_, idx) => idx !== indexToRemove),
    );
  };

  const isMaxFilesReached = selectedFiles.length >= MAX_FILES;

  return (
    <div className="md:col-span-2 flex flex-col gap-2">
      <label
        htmlFor="file-upload-input"
        className="font-medium text-sm lg:text-base text-slate-700 dark:text-white/90 mb-1"
      >
        پیوست فایل (اختیاری)
      </label>

      <button
        type="button"
        className={`relative lg:w-1/2 flex items-center gap-3 px-4 py-3 border-2 border-dashed rounded-lg transition bg-gray-50 dark:bg-gray-800 ${
          isMaxFilesReached
            ? "opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-600"
            : "cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 border-gray-300 dark:border-gray-700"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <Paperclip
          className={`size-4 md:size-6 ${isMaxFilesReached ? "text-gray-400" : "text-blue-500"}`}
        />
        <span
          className={`text-sm lg:text-base ${isMaxFilesReached ? "text-gray-400 dark:text-gray-500" : "text-slate-600 dark:text-white"}`}
        >
          {isMaxFilesReached
            ? `حداکثر ${MAX_FILES} فایل انتخاب شده است.`
            : "انتخاب فایل"}
        </span>
        <input
          id="file-upload-input"
          ref={fileInputRef}
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          style={{ zIndex: 2 }}
          multiple
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png,.zip"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
          disabled={isMaxFilesReached}
        />
        <input
          ref={hiddenInputRef}
          type="file"
          name="attachments"
          multiple
          style={{ display: "none" }}
          tabIndex={-1}
          readOnly
        />
      </button>

      <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
        حداکثر {MAX_FILES} فایل، حجم هر فایل حداکثر ۲ مگابایت | فرمت‌های مجاز:
        pdf، jpg، png، zip
      </span>

      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-2">
          {selectedFiles.map((file, idx) => (
            <span
              key={file.name}
              className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-100 py-1 px-3 rounded-full text-xs font-medium gap-2"
            >
              {file.name}
              <IconButton
                type="button"
                size="sm"
                icon={X}
                color={[220, 38, 38]}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(idx);
                }}
                title={`حذف فایل ${file.name}`}
                aria-label={`حذف فایل ${file.name}`}
              />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
