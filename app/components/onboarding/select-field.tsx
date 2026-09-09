import type { ComponentPropsWithoutRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SelectFieldProps extends ComponentPropsWithoutRef<typeof Select> {
  label: string;
  name: string;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
}

export default function SelectField({
  label,
  name,
  options,
  placeholder = "انتخاب کنید...",
  ...props
}: Readonly<SelectFieldProps>) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-foreground">{label}</label>

      <Select name={name} {...props} dir="rtl">
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
