import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Checkbox } from "~/components/ui/checkbox";
import { cn } from "~/lib/utils";

interface FilterItemProps {
  paramName: string;
  paramValue: string;
  title: string;
  count?: number;
}

export default function FilterItem({
  paramName,
  paramValue,
  title,
  count,
}: Readonly<FilterItemProps>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isActive, setIsActive] = useState(false);

  const currentSearchParam = searchParams.get(paramName);
  const values = currentSearchParam ? currentSearchParam.split(",") : [];

  useEffect(() => {
    setIsActive(values.includes(paramValue));
  }, [searchParams, paramName, paramValue]);

  const toggleSearchParamValue = () => {
    let updatedValues = [...values];

    if (updatedValues.includes(paramValue)) {
      updatedValues = updatedValues.filter((v) => v !== paramValue);
    } else {
      updatedValues.push(paramValue);
    }

    const updatedParams = {
      ...Object.fromEntries(searchParams.entries()),
      [paramName]: updatedValues.join(","),
    };

    if (updatedValues.length === 0) {
      delete updatedParams[paramName];
    }

    setSearchParams(updatedParams);
  };

  return (
    <button
      onClick={toggleSearchParamValue}
      className={cn(
        "w-full flex items-center justify-between p-3 border border-input rounded-xl gap-3 cursor-pointer select-none transition-all duration-200",
        "hover:bg-muted/50 hover:border-muted-foreground/30",
        isActive &&
          "border-primary/50 bg-primary/4 dark:bg-primary/2 shadow-sm",
      )}
    >
      <div className="flex items-center gap-2.5">
        <p
          className={cn(
            "text-sm font-medium line-clamp-1 transition-colors text-muted-foreground",
            isActive && "text-foreground font-semibold",
          )}
        >
          {title}
        </p>
        {count !== undefined && (
          <span className="px-1.5 py-0.5 text-[11px] font-mono text-muted-foreground bg-muted border border-border rounded-md">
            {count}
          </span>
        )}
      </div>
      <Checkbox
        className={cn(
          "rounded-md border-muted-foreground/40 transition-all",
          isActive && "bg-primary! border-primary!",
        )}
        checked={isActive}
      />
    </button>
  );
}
