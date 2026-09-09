import {
  CheckCircle,
  CirclePlus,
  ListChecks,
  ListOrdered,
  Logs,
  X,
  Hourglass,
  CalendarDays,
} from "lucide-react";
import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import Input from "~/components/ui/input-custom";
import { Label } from "~/components/ui/label";
import ExpireSelect from "./expire-select";
import RangeSelect from "./range-select";
import SubmitButton from "~/components/ui/submit-button";
import { RippleButton } from "~/components/ui/animate-ui/buttons/ripple";
import type { PollType } from "~/types";
import { useNavigate, useFetcher } from "react-router";
import ErrorMessage from "~/components/ui/error-message";
import { useState, useEffect, useCallback, useMemo, memo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useActionAlert } from "~/hooks/use-action-alert";

const pollTypes = [
  { value: "single", label: "تک‌گزینه‌ای", icon: CheckCircle },
  { value: "multiple", label: "چندگزینه‌ای", icon: ListChecks },
  { value: "ranking", label: "رتبه‌بندی", icon: ListOrdered },
];

const timingTypes = [
  { value: "duration", label: "مدت اعتبار", icon: Hourglass },
  { value: "range", label: "بازه زمانی", icon: CalendarDays },
];

const OptionItem = memo(
  ({
    id,
    value,
    index,
    onUpdate,
    onRemove,
  }: {
    id: string;
    value: string;
    index: number;
    onUpdate: (id: string, value: string) => void;
    onRemove: (id: string) => void;
  }) => {
    return (
      <div className="flex items-center gap-2 border-b pb-1">
        <Logs className="size-4 shrink-0" />
        <input
          type="text"
          className="w-full p-1 outline-none text-sm lg:text-base bg-transparent"
          placeholder="توضیحات گزینه را وارد نمایید."
          value={value}
          onChange={(e) => onUpdate(id, e.target.value)}
        />
        <IconButton
          icon={X}
          color={[220, 38, 38]}
          onClick={() => onRemove(id)}
          size="sm"
          title="حذف گزینه"
          aria-label={`حذف گزینه ${index + 1}`}
        />
      </div>
    );
  },
);

OptionItem.displayName = "OptionItem";

export default function PollForm() {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  useActionAlert(fetcher.data);
  const maxOptions = 10;

  const [timingType, setTimingType] = useState<"duration" | "range">(
    "duration",
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<PollType>("single");
  const [startAt, setStartAt] = useState<Date | null>(null);
  const [endAt, setEndAt] = useState<Date | null>(null);
  type OptionField = { id: string; value: string };

  const [options, setOptions] = useState<OptionField[]>([
    { id: crypto.randomUUID(), value: "" },
  ]);

  const remainingOptions = useMemo(
    () => maxOptions - options.length,
    [options.length],
  );

  const formattedOptions = useMemo(
    () =>
      options
        .filter((option) => option.value.trim())
        .map((option, index) => ({
          title: option.value,
          order: index,
        })),
    [options],
  );

  const addItem = useCallback(() => {
    setOptions((prev) => [...prev, { id: crypto.randomUUID(), value: "" }]);
  }, []);

  const updateItem = useCallback((id: string, value: string) => {
    setOptions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value } : item)),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setOptions((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleExpireChange = useCallback(
    ({ startAtISO, endAtISO }: { startAtISO: string; endAtISO: string }) => {
      setStartAt(startAtISO ? new Date(startAtISO) : null);
      setEndAt(endAtISO ? new Date(endAtISO) : null);
    },
    [],
  );

  const handleRangeChange = useCallback(
    ({ startAtISO, endAtISO }: { startAtISO: string; endAtISO: string }) => {
      setStartAt(startAtISO ? new Date(startAtISO) : null);
      setEndAt(endAtISO ? new Date(endAtISO) : null);
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    fetcher.submit(
      {
        title,
        description,
        type,
        options: JSON.stringify(formattedOptions),
        startAtISO: startAt ? startAt.toISOString() : "",
        endAtISO: endAt ? endAt.toISOString() : "",
      },
      { method: "POST", action: "/proxy/polls" },
    );
  }, [title, description, type, formattedOptions, startAt, endAt, fetcher]);

  const handleTimingTypeChange = useCallback((value: "duration" | "range") => {
    setTimingType(value);
    setStartAt(null);
    setEndAt(null);
  }, []);

  const handleTypeChange = useCallback((value: PollType) => {
    setType(value);
  }, []);

  const isSubmitting = fetcher.state !== "idle";

  useEffect(() => {
    if (isSubmitting) return;

    if (fetcher.data?.status === "OK") {
      navigate("/dashboard/polls");
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <Card className="w-full shadow-sm border-border/50 overflow-hidden">
      <CardHeader className="border-b bg-muted/5">
        <CardTitle className="text-xl">ایجاد نظرسنجی جدید</CardTitle>
        <CardDescription>
          اطلاعات مورد نیاز برای ایجاد نظرسنجی را وارد کنید
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="flex flex-col gap-6 xl:gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Input
              icon={ListChecks}
              label="عنوان"
              id="title"
              name="title"
              placeholder="عنوان نظرسنجی خود را وارد نمایید."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Input
              icon={ListChecks}
              label="توضیحات (اختیاری)"
              id="description"
              name="description"
              placeholder="توضیحات نظرسنجی خود را وارد نمایید."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <Label className="lg:text-base">نوع نظرسنجی</Label>
              <div className="flex w-full border border-border/60 rounded-md p-1 bg-muted/20">
                {pollTypes.map((pollType) => {
                  const Icon = pollType.icon;
                  const isActive = type === pollType.value;
                  return (
                    <button
                      key={pollType.value}
                      type="button"
                      onClick={() =>
                        handleTypeChange(pollType.value as PollType)
                      }
                      className={`flex-1 flex items-center justify-center gap-1 lg:gap-2 py-2 px-3 text-xs lg:text-sm font-medium rounded-sm transition-all duration-200 ${
                        isActive
                          ? "bg-background text-foreground shadow-sm border border-border/40"
                          : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                      }`}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{pollType.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Label className="lg:text-base">تنظیم زمان پایان</Label>
              <div className="flex w-full border border-border/60 rounded-md p-1 bg-muted/20">
                {timingTypes.map((timing) => {
                  const Icon = timing.icon;
                  const isActive = timingType === timing.value;
                  return (
                    <button
                      key={timing.value}
                      type="button"
                      onClick={() =>
                        handleTimingTypeChange(
                          timing.value as "duration" | "range",
                        )
                      }
                      className={`flex-1 flex items-center justify-center gap-1 lg:gap-2 py-2 px-3 text-xs lg:text-sm font-medium rounded-sm transition-all duration-200 ${
                        isActive
                          ? "bg-background text-foreground shadow-sm border border-border/40"
                          : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                      }`}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{timing.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="w-full transition-all">
            {timingType === "duration" ? (
              <ExpireSelect onExpireChange={handleExpireChange} />
            ) : (
              <RangeSelect onRangeChange={handleRangeChange} />
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Label className="lg:text-base">گزینه‌ها</Label>
            {options.length === 0 && (
              <p className="text-xs text-muted-foreground lg:text-sm">
                هیچ گزینه‌ای اضافه نشده است.
              </p>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6">
              {options.map((option, index) => (
                <OptionItem
                  key={option.id}
                  id={option.id}
                  value={option.value}
                  index={index}
                  onUpdate={updateItem}
                  onRemove={removeItem}
                />
              ))}

              {remainingOptions > 0 && (
                <RippleButton
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit text-blue-600 dark:text-blue-400"
                  onClick={addItem}
                >
                  <CirclePlus className="size-4" />
                  <span className="text-sm">افزودن گزینه</span>
                </RippleButton>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {remainingOptions > 0
                ? `شما میتوانید ${remainingOptions} گزینه دیگر اضافه کنید.`
                : "شما بیشترین تعداد گزینه را اضافه کردید."}
            </p>
          </div>

          <ErrorMessage data={fetcher.data} />
        </div>
      </CardContent>

      <CardFooter className="border-t bg-muted/5 flex flex-col md:flex-row items-center gap-3 pt-6">
        <SubmitButton
          label={isSubmitting ? "در حال ایجاد..." : "ایجاد نظرسنجی"}
          className="lg:w-1/4"
          isLoading={isSubmitting}
          onClick={handleSubmit}
        />
        <RippleButton
          type="button"
          variant="outline"
          className="w-full md:w-1/6"
          onClick={() => navigate(-1)}
        >
          برگشت
        </RippleButton>
      </CardFooter>
    </Card>
  );
}
