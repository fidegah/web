import { Plus, Check } from "lucide-react";
import { Activity, useEffect, useState } from "react";
import { useFetcher } from "react-router";
import PostCard from "~/components/post-card";
import { Button } from "~/components/ui/button";
import { CustomPagination } from "~/components/ui/custom-pagination";
import { DataEmptyState } from "~/components/ui/empty-state";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "~/components/ui/sheet";
import { Spinner } from "~/components/ui/spinner";
import { useActionAlert } from "~/hooks/use-action-alert";
import { cn } from "~/lib/utils";
import type { Paginated, Post } from "~/types";

interface RoadmapAddPostSheetProps {
  isOpen: boolean;
  onOpenChange(open: boolean): void;
  posts: Paginated<Post[]> | undefined;
  addedPostIds?: string[];
  roadmapId: string | undefined;
}

export function RoadmapAddPostSheet({
  isOpen,
  onOpenChange,
  posts,
  addedPostIds = [],
  roadmapId,
}: RoadmapAddPostSheetProps) {
  const fetcher = useFetcher();
  useActionAlert(fetcher.data);

  const [addingPostId, setAddingPostId] = useState<string | null>(null);

  const hasPosts = posts && posts?.data?.length > 0;
  const isSubmitting = fetcher.state !== "idle";

  const handleAddPost = (postId: string) => {
    if (!roadmapId) return;

    setAddingPostId(postId);

    fetcher.submit(
      {
        roadmapId,
        postId,
      },
      {
        method: "POST",
        action: "/proxy/roadmaps/items",
      },
    );
  };

  useEffect(() => {
    if (fetcher.state === "idle") {
      setAddingPostId(null);
      onOpenChange(false);
    }
  }, [fetcher.state]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        showCloseButton={false}
        className="flex flex-col h-full sm:max-w-md w-full"
      >
        <SheetHeader className="text-right border-b pb-4 dark:border-border/50">
          <SheetTitle className="text-lg font-bold">
            افزودن پست به نقشه راه
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground leading-relaxed mt-1">
            برای افزودن هر یک از پست‌های زیر به نقشه راه، کافی است روی علامت ثبت
            (
            <span className="inline-flex items-center justify-center size-4 rounded-full bg-muted text-foreground mx-0.5">
              +
            </span>
            ) کلیک کنید.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto  px-1 py-2 space-y-2.5 no-scrollbar">
          <Activity mode={hasPosts ? "visible" : "hidden"}>
            {posts?.data.map((post) => {
              const isAdded = addedPostIds.includes(post.id);
              const isAdding = addingPostId === post.id;

              return (
                <PostCard
                  key={post.id}
                  post={post}
                  className="w-full"
                  showUpvoteButton={false}
                  leftSection={
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      disabled={isSubmitting || isAdded}
                      className={cn(
                        "size-8 rounded-full shrink-0 transition-all duration-300",
                        isAdded
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                          : "bg-background border border-border/60 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-400",
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isAdded) handleAddPost(post.id);
                      }}
                      title={isAdded ? "افزوده شده" : "افزودن به نقشه راه"}
                    >
                      {isAdding ? (
                        <Spinner />
                      ) : isAdded ? (
                        <Check className="size-4 animate-in zoom-in-50" />
                      ) : (
                        <Plus className="size-4 transition-transform duration-200 group-hover:rotate-90" />
                      )}
                    </Button>
                  }
                />
              );
            })}
          </Activity>
        </div>

        <CustomPagination
          pagination={posts?.pagination}
          maxVisiblePages={3}
          queryParamName="postsPage"
        />

        <Activity mode={!hasPosts ? "visible" : "hidden"}>
          <DataEmptyState title="پستی برای نمایش وجود ندارد." size="sm" />
        </Activity>

        <SheetFooter className="border-t pt-3 mt-auto dark:border-border/50">
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              بستن
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
