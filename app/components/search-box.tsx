import { Filter, Search, X } from "lucide-react";
import { Activity, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { cn } from "~/lib/utils";

interface SearchBoxProps {
  filterButtonOnClick?: () => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  filterBtnClassName?: string;
  showFilterBtn?: boolean;
  queryKey?: string;
  autoFocus?: boolean;
}

export default function SearchBox({
  filterButtonOnClick,
  placeholder = "برای جستجو عنوان را وارد نمایید.",
  className,
  inputClassName,
  filterBtnClassName,
  showFilterBtn = true,
  queryKey = "search",
  autoFocus,
}: Readonly<SearchBoxProps>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get(queryKey);
  const [searchText, setSearchText] = useState<string | null>(search);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (searchText === null) return;

    const timeoutId = setTimeout(() => {
      if (searchText && searchText.trim() !== "") {
        setSearchParams({ [queryKey]: searchText });
      } else {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete(queryKey);
        setSearchParams(newParams);
      }
    }, 600);
    return () => clearTimeout(timeoutId);
  }, [searchText, queryKey]);

  return (
    <div className="w-full flex gap-2 items-center">
      <div
        className={cn(
          "flex items-center gap-2 w-full border rounded-lg px-3",
          "bg-background transition-all duration-200 ease-out",
          isFocused
            ? "border-foreground/30 shadow-sm"
            : "border-border hover:border-foreground/20",
          className,
        )}
      >
        <Search
          className={cn(
            "size-4 shrink-0 transition-colors duration-200",
            isFocused ? "text-foreground/60" : "text-muted-foreground",
          )}
        />

        <input
          type="text"
          name={queryKey}
          id={queryKey}
          autoFocus={autoFocus}
          className={cn(
            "w-full py-2 outline-none text-sm bg-transparent",
            "placeholder:text-muted-foreground/50",
            inputClassName,
          )}
          value={searchText || ""}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
        />

        <Activity mode={searchText ? "visible" : "hidden"}>
          <button
            type="button"
            onClick={() => setSearchText("")}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors duration-150"
            aria-label="پاک کردن"
          >
            <X className="size-3.5" />
          </button>
        </Activity>
      </div>

      <Activity mode={showFilterBtn ? "visible" : "hidden"}>
        <button
          type="button"
          onClick={filterButtonOnClick}
          className={cn(
            "flex items-center justify-center size-9 rounded-lg border shrink-0",
            "text-muted-foreground bg-background",
            "transition-all duration-200",
            "hover:text-foreground hover:border-foreground/30 hover:bg-muted/50",
            "active:scale-95",
            filterBtnClassName,
          )}
          aria-label="فیلتر"
        >
          <Filter className="size-4" />
        </button>
      </Activity>
    </div>
  );
}
