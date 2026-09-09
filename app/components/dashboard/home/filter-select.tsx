import { useSearchParams } from "react-router";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

interface HomeFilterSelectProps {
  label: string;
  item: readonly { value: string; label: string; icon?: React.ElementType }[];
  placeholder?: string;
  defaultValue: string;
  searchParamKey: string;
  align?: "center" | "end" | "start";
  icon?: React.ElementType;
  disabled?: boolean;
}

export default function HomeFilterSelect({
  label,
  item,
  placeholder,
  defaultValue,
  searchParamKey,
  align,
  disabled,
}: Readonly<HomeFilterSelectProps>) {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <Select
      defaultValue={searchParams.get(searchParamKey) || defaultValue}
      onValueChange={(value) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set(searchParamKey, value);
        setSearchParams(newParams);
      }}
    >
      <SelectTrigger className="shadow-none" disabled={disabled}>
        <SelectValue placeholder={placeholder || label} />
      </SelectTrigger>
      <SelectContent dir="rtl" align={align || "end"}>
        <SelectGroup>
          {item && item?.length > 0 && (
            <>
              {label && <SelectLabel>{label}</SelectLabel>}

              {item?.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  <div
                    className={cn(
                      "w-full flex items-center",
                      item.icon && "gap-3",
                    )}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.label}</span>
                  </div>
                </SelectItem>
              ))}
            </>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
