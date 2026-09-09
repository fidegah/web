import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { UpvoteButton } from "../../feedback/upvote-button";
import type { Post } from "~/types";
import { Activity } from "react";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { DataEmptyState } from "~/components/ui/empty-state";

interface PostsByRecencyCardProps {
  title: string;
  description: string;
  emptyText: string;
  posts: Post[];
  loadMore: {
    handleLoadMore: () => void;
    isLoading: boolean;
    hasNext: boolean;
  };
}

export default function PostsByRecencyCard({
  posts,
  title,
  description,
  emptyText,
  loadMore,
}: Readonly<PostsByRecencyCardProps>) {
  const { handleLoadMore, isLoading, hasNext } = loadMore;

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="max-h-80 overflow-y-auto scrollbar-thin grid grid-cols-1 lg:grid-cols-2">
        <Activity mode={posts.length > 0 ? "visible" : "hidden"}>
          {posts.map((post) => (
            <div key={post.id} className="grid grid-cols-1 lg:grid-cols-2">
              <div key={post.id} className="flex items-center p-1 gap-3">
                <UpvoteButton post={post} isAuthenticated={true} />
                <b className="text-sm line-clamp-1">{post.title}</b>
              </div>
            </div>
          ))}
        </Activity>

        <Activity mode={posts.length === 0 ? "visible" : "hidden"}>
          <DataEmptyState
            title=""
            description={emptyText}
            size="sm"
            className="h-fit col-span-full"
          />
        </Activity>

        <Activity mode={hasNext ? "visible" : "hidden"}>
          <div className="w-full flex justify-center mt-6 col-span-full">
            <Button
              size="sm"
              variant="outline"
              disabled={isLoading}
              onClick={handleLoadMore}
            >
              {isLoading && <Spinner />}
              {isLoading ? "در حال بارگذاری" : " بار‌گذاری بیشتر"}
            </Button>
          </div>
        </Activity>
      </CardContent>
    </Card>
  );
}
