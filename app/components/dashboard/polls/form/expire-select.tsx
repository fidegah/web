import dayjs from "dayjs";
import { useEffect, useState, useCallback, useRef } from "react";
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
import { cn } from "~/lib/utils";

dayjs.extend(utc);
dayjs.extend(jalaliday);
dayjs.extend(timezone);

interface NumberSelectProps {
  onChange: (value: number) => void;
  max: number;
  label: string;
  className?: string;
}

const NumberSelect = ({
  onChange,
  max,
  label,
  className,
}: NumberSelectProps) => {
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const handleValueChange = useCallback((val: string) => {
    onChangeRef.current(Number(val));
  }, []);

  return (
    <Select onValueChange={handleValueChange}>
      <SelectTrigger
        dir="rtl"
        className={cn(
          "border-y-0 border-r-0 rounded-none w-1/3 border-l h-11 lg:h-10.5 lg:p-5 bg-transparent focus:ring-0 focus:ring-offset-0",
          className,
        )}
      >
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent dir="rtl" className="max-h-80 max-w-30">
        {Array.from({ length: max + 1 }).map((_, i) => {
          const itemValue = String(i);

          return (
            <SelectItem key={`select-item-${itemValue}`} value={itemValue}>
              {i} {label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

interface ExpireSelectProps {
  onExpireChange: (expireData: {
    startAtISO: string;
    endAtISO: string;
    days: number;
    hours: number;
    minutes: number;
  }) => void;
}

export default function ExpireSelect({
  onExpireChange,
}: Readonly<ExpireSelectProps>) {
  const [expireTime, setExpireTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
  });
  const { days, minutes, hours } = expireTime;

  const onExpireChangeRef = useRef(onExpireChange);

  useEffect(() => {
    onExpireChangeRef.current = onExpireChange;
  }, [onExpireChange]);

  const handleDaysChange = useCallback((val: number) => {
    setExpireTime((prev) => ({ ...prev, days: val }));
  }, []);

  const handleHoursChange = useCallback((val: number) => {
    setExpireTime((prev) => ({ ...prev, hours: val }));
  }, []);

  const handleMinutesChange = useCallback((val: number) => {
    setExpireTime((prev) => ({ ...prev, minutes: val }));
  }, []);

  useEffect(() => {
    if (days === 0 && hours === 0 && minutes === 0) {
      return;
    }

    const nowUtc = dayjs().utc();
    const expireAt = nowUtc
      .add(days, "day")
      .add(hours, "hour")
      .add(minutes, "minute");

    onExpireChangeRef.current({
      startAtISO: nowUtc.toISOString(),
      endAtISO: expireAt.toISOString(),
      days,
      hours,
      minutes,
    });
  }, [days, hours, minutes]);

  const getEndAtISO = useCallback(() => {
    return dayjs()
      .utc()
      .add(days, "day")
      .add(hours, "hour")
      .add(minutes, "minute")
      .toISOString();
  }, [days, hours, minutes]);

  const displayExpire =
    days > 0 || hours > 0 || minutes > 0
      ? dayjs(getEndAtISO()).tz("Asia/Tehran")
      : null;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex border rounded-md bg-background w-full">
        <NumberSelect label="روز" max={20} onChange={handleDaysChange} />
        <NumberSelect label="ساعت" max={23} onChange={handleHoursChange} />
        <NumberSelect
          label="دقیقه"
          max={59}
          onChange={handleMinutesChange}
          className="border-l-0"
        />
      </div>
      {displayExpire && (
        <p className="text-xs text-muted-foreground px-1">
          {`این نظرسنجی از هم‌اکنون تا ${displayExpire.format("HH:mm")} - ${displayExpire.calendar("jalali").format("YYYY/MM/DD")} فعال خواهد بود.`}
        </p>
      )}
    </div>
  );
}
