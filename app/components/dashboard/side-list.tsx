import { Activity, type ReactNode } from "react";
import SearchBox from "../search-box";
import { cn } from "~/lib/utils";
import { DataEmptyState } from "../ui/empty-state";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

interface SideListProps<T> {
  items: T[] | undefined | null;
  renderItem: (item: T) => ReactNode;
  getItemKey: (item: T) => string | number | undefined;
  activeId: string | number | undefined;

  search?: {
    showBox: boolean;
    placeholder?: string;
    queryKey?: string;
  };

  filter?: {
    showButton?: boolean;
    onFilterClick?: () => void;
  };

  pagination?: {
    hasNextPage: boolean;
    onLoadMore: () => void;
    isLoadingMore?: boolean;
    loadMoreText?: string;
  };

  emptyState?: {
    title?: string;
    description?: string;
  };

  header?: ReactNode;
  className?: string;
}

export default function SideList<T>({
  search,
  filter,
  items,
  renderItem,
  emptyState,
  header,
  getItemKey,
  activeId,
  className,
  pagination,
}: Readonly<SideListProps<T>>) {
  return (
    <div
      className={cn(
        "w-full lg:w-[30%] h-screen lg:border-l flex flex-col",
        className,
      )}
    >
      <Activity mode={search?.showBox ? "visible" : "hidden"}>
        <div className="lg:p-2 lg:border-b lg:pb-4">
          <SearchBox
            showFilterBtn={!!filter?.showButton}
            filterButtonOnClick={filter?.onFilterClick}
            placeholder={search?.placeholder}
            queryKey={search?.queryKey}
          />

          {header}
        </div>
      </Activity>

      <div className="flex flex-col gap-4 mt-4 lg:mt-0 lg:gap-0 flex-1 min-h-0 overflow-y-auto no-scrollbar">
        <Activity mode={items && items.length > 0 ? "visible" : "hidden"}>
          {items?.map((item) => {
            const key = getItemKey(item);
            const isActive = key === activeId;

            return (
              <div
                key={key}
                className={cn(
                  "flex gap-3 border rounded-md lg:rounded-none lg:border-t-0 lg:border-x-0 lg:border-b hover:border-gray-300 dark:hover:border-gray-600 dark:bg-transparent transition-all duration-300 cursor-pointer relative",
                )}
              >
                {isActive && (
                  <div className="h-full hidden md:block absolute w-1 bg-blue-500 dark:bg-blue-800 right-0 top-0 rounded"></div>
                )}
                {renderItem(item)}
              </div>
            );
          })}

          <Activity mode={pagination?.hasNextPage ? "visible" : "hidden"}>
            <div className="p-4 flex justify-center border-b lg:border-b-0">
              <Button
                variant="outline"
                size="sm"
                className="w-full max-w-50"
                onClick={pagination?.onLoadMore}
                disabled={pagination?.isLoadingMore}
              >
                {pagination?.isLoadingMore ? (
                  <>
                    <Spinner />
                    <span>در حال بارگذاری...</span>
                  </>
                ) : (
                  (pagination?.loadMoreText ?? "بارگذاری بیشتر")
                )}
              </Button>
            </div>
          </Activity>
        </Activity>

        <Activity
          mode={
            (!items || items.length === 0) && !!emptyState
              ? "visible"
              : "hidden"
          }
        >
          <div className="w-full p-2">
            <DataEmptyState
              title={emptyState?.title ?? ""}
              description={emptyState?.description ?? ""}
              size="sm"
            />
          </div>
        </Activity>
      </div>
    </div>
  );
}
