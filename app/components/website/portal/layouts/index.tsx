import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import PortalBoardCard from "~/components/website/portal/board-card";
import PortalPostsCard from "~/components/website/portal/feedback/post/card";
import PortalPostFormCard from "~/components/website/portal/feedback/post/form-card";
import type { Board, Paginated, Post } from "~/types";
import { cn } from "~/lib/utils";

interface PortalFeedbackLayoutProps {
  boards: Board[];
  board: Board;
  posts: Paginated<Post[]>;
  onBoardClick: (boardId: string) => void;
  onPostClick: (postId: string) => void;
  className?: string;
}

export default function PortalFeedbackLayout({
  boards,
  board,
  posts,
  onBoardClick,
  onPostClick,
  className,
}: Readonly<PortalFeedbackLayoutProps>) {
  return (
    <div className={cn("p-3 md:px-6 lg:px-10", className)}>
      <div className="w-full grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="order-1 lg:order-1 lg:col-span-2 flex flex-col">
          <PortalPostFormCard boardId={board.id} />

          <div className="mt-3 md:mt-6">
            <PortalPostsCard posts={posts} handlePostClick={onPostClick} />
          </div>
        </div>

        <Card className="order-2 lg:order-2 lg:col-span-1 max-h-fit">
          <CardHeader>
            <CardTitle>بخش‌ها</CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4 lg:max-h-1/2 overflow-y-auto scrollbar-thin">
            {boards?.map((b) => (
              <PortalBoardCard
                key={b.id}
                title={b.title}
                postCount={b.postsCount}
                isActive={b.id === board.id}
                onClick={() => onBoardClick(b.id)}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
