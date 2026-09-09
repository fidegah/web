import dayjs from "dayjs";
import { useEffect, useState, useMemo, Activity } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import jalaliday from "jalali-plugin-dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/fa";
import { cn } from "~/lib/utils";
import { MESSAGES } from "~/constants/messages";

dayjs.extend(utc);
dayjs.extend(jalaliday);
dayjs.extend(timezone);
dayjs.locale("fa");

interface CustomSelectProps {
  onChange: (value: number) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  className?: string;
}

const CustomSelect = ({
  onChange,
  options,
  placeholder,
  className,
}: CustomSelectProps) => {
  return (
    <Select onValueChange={(val) => onChange(Number(val))}>
      <SelectTrigger
        dir="rtl"
        className={cn(
          "border-y-0 border-r-0 rounded-none w-1/2 border-l h-11 lg:h-10.5 lg:p-5 bg-transparent focus:ring-0 focus:ring-offset-0",
          className,
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent dir="rtl" className="max-h-80">
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

interface RangeSelectProps {
  onRangeChange: (rangeData: { startAtISO: string; endAtISO: string }) => void;
}

export default function RangeSelect({ onRangeChange }: Readonly<RangeSelectProps>) {
  const [startDayOffset, setStartDayOffset] = useState<number | null>(null);
  const [endDayOffset, setEndDayOffset] = useState<number | null>(null);

  const startOptions = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const date = dayjs().locale("fa").calendar("jalali").add(i, "day");
      const label =
        i === 0 ? "شروع: (امروز)" : `شروع: (${date.format("DD MMMM")})`;
      return { value: String(i), label };
    });
  }, []);

  const endOptions = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => {
      const date = dayjs().locale("fa").calendar("jalali").add(i, "day");
      const label =
        i === 0 ? "پایان: (امروز)" : `پایان: (${date.format("DD MMMM")})`;
      return { value: String(i), label };
    });
  }, []);

  useEffect(() => {
    if (startDayOffset !== null && endDayOffset !== null) {
      const startAtISO = dayjs()
        .utc()
        .add(startDayOffset, "day")
        .startOf("day")
        .toISOString();
      const endAtISO = dayjs()
        .utc()
        .add(endDayOffset, "day")
        .endOf("day")
        .toISOString();

      onRangeChange({ startAtISO, endAtISO });
    }
  }, [startDayOffset, endDayOffset]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex border rounded-md bg-background w-full">
        <CustomSelect
          placeholder="انتخاب تاریخ شروع"
          options={startOptions}
          onChange={(val) => setStartDayOffset(val)}
        />
        <CustomSelect
          placeholder="انتخاب تاریخ پایان"
          options={endOptions}
          onChange={(val) => setEndDayOffset(val)}
          className="border-l-0"
        />
      </div>

      <Activity
        mode={
          startDayOffset !== null &&
          endDayOffset !== null &&
          startDayOffset > endDayOffset
            ? "visible"
            : "hidden"
        }
      >
        <p className="text-xs text-red-500 px-1">
          {MESSAGES.POLL.END_DATE_MUST_BE_AFTER_START}
        </p>
      </Activity>
    </div>
  );
}
