import { Skeleton } from "~/components/ui/skeleton";
import FilterItem from "./filter-item";

interface FilterSectionProps {
  title: string;
  items: readonly { id: string; label: string; value: string }[];
  paramName: string;
  isLoading?: boolean;
  skeletonCount?: number;
  gridCols?: string;
}

export default function FilterSection({
  items,
  paramName,
  title,
  gridCols = "grid-cols-1 sm:grid-cols-2",
  isLoading = false,
  skeletonCount = 2,
}: Readonly<FilterSectionProps>) {
  return (
    <div className="flex flex-col gap-3">
      <div className="w-full flex items-center justify-between border-r-2 border-primary/70 pr-2 my-1">
        <h3 className="text-sm font-bold text-foreground/90">{title}</h3>
      </div>

      <div className={`grid ${gridCols} gap-2.5`}>
        {isLoading &&
          Array.from(
            { length: skeletonCount },
            (_, index) => `skeleton-${index}`,
          ).map((id) => (
            <Skeleton
              key={id}
              className="rounded-xl h-12 w-full architecture-skeleton"
            />
          ))}

        {!isLoading &&
          items.length > 0 &&
          items.map((item) => (
            <FilterItem
              key={item.id}
              paramName={paramName}
              paramValue={item.value}
              title={item.label}
            />
          ))}

        {!isLoading && items.length === 0 && (
          <div className="col-span-full py-4 text-center border border-dashed border-border rounded-xl bg-muted/20">
            <span className="text-muted-foreground text-xs md:text-sm">
              گزینه‌ای برای نمایش وجود ندارد.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
