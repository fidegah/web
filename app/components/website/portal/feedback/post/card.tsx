import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, useState } from "react";
import SearchBox from "~/components/search-box";
import PostCard from "~/components/post-card";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { DataEmptyState } from "~/components/ui/empty-state";
import { cn } from "~/lib/utils";
import type { Paginated, Post } from "~/types";
import { CustomPagination } from "~/components/ui/custom-pagination";

interface PortalPostCardProps {
  posts: Paginated<Post[]>;
  handlePostClick: (pId: string) => void;
}

export default function PortalPostsCard({
  posts,
  handlePostClick,
}: Readonly<PortalPostCardProps>) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-3">
        {/* Fixed-height header row — no layout shift */}
        <div className="relative flex items-center h-10">
          {/* Title + search-open button */}
          <AnimatePresence mode="popLayout">
            {!showSearch && (
              <motion.div
                key="title-row"
                className="absolute inset-0 flex items-center justify-between"
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <span className="font-semibold text-base">پست‌ها</span>

                <button
                  onClick={() => setShowSearch(true)}
                  className={cn(
                    "flex items-center justify-center size-5 rounded-lg",
                    "text-muted-foreground transition-all duration-200",
                    "hover:text-foreground hover:bg-muted/60 active:scale-90 ",
                  )}
                  aria-label="جستجو"
                >
                  <Search />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search bar */}
          <AnimatePresence mode="popLayout">
            {showSearch && (
              <motion.div
                key="search-row"
                className="absolute inset-0 flex items-center gap-2"
                initial={{
                  opacity: 0,
                  scaleX: 0.92,
                  transformOrigin: "right center",
                }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0.92 }}
                transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
              >
                <div className="flex-1">
                  <SearchBox
                    showFilterBtn={false}
                    placeholder="جستجو ..."
                    autoFocus
                    queryKey="postsSearch"
                  />
                </div>

                {/* Close button */}
                <motion.button
                  onClick={() => setShowSearch(false)}
                  className={cn(
                    "flex items-center justify-center size-5 rounded-lg shrink-0",
                    "text-muted-foreground transition-all duration-200",
                    "hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40",
                    "active:scale-90 cursor-pointer",
                  )}
                  initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: -45, scale: 0.7 }}
                  transition={{ duration: 0.2, delay: 0.1, ease: "easeOut" }}
                  aria-label="بستن جستجو"
                >
                  <X />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardHeader>

      <Activity mode={posts.data.length > 0 ? "visible" : "hidden"}>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {posts.data.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={() => handlePostClick(post.id)}
              isPortal
            />
          ))}
        </CardContent>

        <CardFooter>
          <CustomPagination
            pagination={posts.pagination}
            queryParamName="postsPage"
            scrollToTop={false}
          />
        </CardFooter>
      </Activity>

      <Activity mode={posts.data.length === 0 ? "visible" : "hidden"}>
        <DataEmptyState
          title="هیچ پستی برای نمایش وجود ندارد."
          description="شما میتوانید اولین پست را ایجاد کنید."
          className="h-fit"
        />
      </Activity>
    </Card>
  );
}
