import { ClipboardX, Copy, Loader2, Search } from "lucide-react";
import { Activity, useEffect, useRef } from "react";
import type { CreateResponse, Paginated, Pagination, Post } from "~/types";
import { UpvoteButton } from "./upvote-button";
import { useFetcher } from "react-router";

interface SimilarPostProps {
  title: string;
}

type SimilarPostsResponse = CreateResponse<Paginated<Post[]>>;

export default function SimilarPost({ title }: Readonly<SimilarPostProps>) {
  const fetcher = useFetcher<SimilarPostsResponse>();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!title.trim()) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      fetcher.load(`/proxy/posts/similar?title=${encodeURIComponent(title)}`);
    }, 1200);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [title]);

  const posts = fetcher.data?.data?.data ?? [];
  const isLoading = fetcher.state === "loading";
  const isIdle = fetcher.state === "idle";
  const hasSearched = Boolean(fetcher.data);

  return (
    <div className="w-full md:border-r px-2 flex flex-col gap-3 rounded md:px-4">
      <div className="flex items-center gap-2">
        <Copy className="size-4" />
        <b className="text-sm lg:text-[15px]">پست‌های مشابه</b>
      </div>

      {posts.length > 0 && (
        <p className="text-sm text-muted-foreground">
          این موضوع پیش‌تر ثبت شده است. جهت جلوگیری از تکرار، می‌توانید به پست
          مربوطه رأی دهید.
        </p>
      )}

      <div className="w-full h-full flex flex-col mt-3 gap-3 overflow-y-auto">
        <Activity mode={isLoading ? "visible" : "hidden"}>
          <div className="w-full h-full flex justify-center items-center">
            <div className="flex flex-col items-center gap-3 lg:gap-5">
              <div className="animate-spin">
                <Loader2 className="text-muted-foreground" />
              </div>
              <p className="text-xs lg:text-sm text-center text-muted-foreground">
                در حال جستجوی پست‌های مشابه...
              </p>
            </div>
          </div>
        </Activity>

        <Activity
          mode={
            isIdle && hasSearched && posts.length === 0 ? "visible" : "hidden"
          }
        >
          <div className="w-full h-full flex justify-center items-center">
            <div className="flex flex-col items-center gap-3 lg:gap-5">
              <div className="p-2 border rounded-full">
                <ClipboardX className="text-muted-foreground" />
              </div>
              <p className="text-xs lg:text-sm text-center text-muted-foreground">
                هیچ پست مشابهی یافت نشد. می‌توانید ادامه دهید.
              </p>
            </div>
          </div>
        </Activity>

        <Activity mode={isIdle && posts.length > 0 ? "visible" : "hidden"}>
          <div className="flex flex-col gap-3">
            {posts.map((item) => (
              <div
                key={item.id}
                className="w-full flex justify-between p-2 border rounded items-center cursor-pointer hover:border-gray-300 gap-2"
              >
                <div className="flex flex-col gap-2">
                  <b className="text-sm">{item.title}</b>

                  {item.description && (
                    <p className="text-xs lg:text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>

                <UpvoteButton post={item} isAuthenticated={true} />
              </div>
            ))}
          </div>
        </Activity>

        <Activity mode={isIdle && !hasSearched ? "visible" : "hidden"}>
          <div className="w-full h-full flex justify-center items-center">
            <div className="flex flex-col items-center gap-3 lg:gap-5">
              <div className="p-2 border rounded-full">
                <Search className="text-muted-foreground" />
              </div>
              <p className="text-xs lg:text-sm text-center text-muted-foreground">
                برای مشاهده پست‌های مشابه، عنوان خود را وارد کنید
              </p>
            </div>
          </div>
        </Activity>
      </div>
    </div>
  );
}
