import { FolderPen, Link2 } from "lucide-react";
import Input from "./ui/input-custom";
import { useState } from "react";

interface CreateWorkspaceFieldsProps {
  defaultValue?: {
    name?: string;
    subdomain?: string;
  };
  onValueChange?: (value: { name: string; subdomain: string }) => void;
}

export default function CreateWorkspaceFields({
  defaultValue = { name: "", subdomain: "" },
  onValueChange,
}: Readonly<CreateWorkspaceFieldsProps>) {
  const [value, setValue] = useState({
    name: defaultValue.name || "",
    subdomain: defaultValue.subdomain || "",
  });

  const updateValue = (
    newValue: Partial<{ name: string; subdomain: string }>,
  ) => {
    const updated = { ...value, ...newValue };
    setValue(updated);
    onValueChange?.(updated);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Input
        icon={FolderPen}
        id="name"
        label="نام فضای کاری"
        placeholder="سازمان / اسم برنامه"
        value={value.name}
        onChange={(e) =>
          updateValue({
            name: e.target.value,
            subdomain: e.target.value,
          })
        }
      />

      <Input
        icon={Link2}
        id="subdomain"
        label="ساب دامین (subdomain)"
        placeholder="subdomain"
        ltr
        suffixText={`.${import.meta.env.VITE_APP_DOMAIN}`}
        value={value.subdomain}
        onChange={(e) => updateValue({ subdomain: e.target.value })}
      />
    </div>
  );
}
