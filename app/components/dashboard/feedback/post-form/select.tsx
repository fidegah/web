import { Activity, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Spinner } from "~/components/ui/spinner";
import type { SelectionDataType } from "~/types";

interface PostFormSelectProps {
  options: SelectionDataType[];
  id: string;
  isError?: boolean;
  isLoading?: boolean;
  onValueChange?: (value: string) => void;
  noDataMessage: string;
}

export default function PostFormSelect({
  options,
  id,
  isError = false,
  isLoading = false,
  onValueChange,
  noDataMessage,
}: Readonly<PostFormSelectProps>) {
  const [selected, setSelected] = useState("");

  return (
    <>
      <Activity
        mode={
          !isLoading && options && options.length > 0 ? "visible" : "hidden"
        }
      >
        <>
          <Select
            onValueChange={(val) => {
              setSelected(val);
              onValueChange?.(val);
            }}
          >
            <SelectTrigger className="w-full rtl shadow-none" id={id}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rtl">
              {options.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <input type="hidden" name={id} id={id} value={selected} />
        </>
      </Activity>

      <Activity
        mode={
          !isLoading && options?.length === 0 ? "visible" : "hidden"
        }
      >
        <p className="text-xs lg:text-sm text-muted-foreground">
          {noDataMessage}
        </p>
      </Activity>

      <Activity mode={isLoading ? "visible" : "hidden"}>
        <div className="flex items-center gap-2">
          <Spinner className="text-blue-600 size-5" />
          <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
            در حال دریافت اطلاعات
          </p>
        </div>
      </Activity>

      <Activity mode={isError && !isLoading ? "visible" : "hidden"}>
        <p className="text-xs lg:text-sm text-red-600">
          در دریافت اطلاعات مشکلی پیش آمد.
        </p>
      </Activity>
    </>
  );
}
