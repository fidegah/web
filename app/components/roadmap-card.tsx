import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import PostCard from "./post-card";
import { Activity } from "react";
import type { Post, PostStatus } from "~/types";
import { DataEmptyState } from "./ui/empty-state";

interface RoadmapCardProps {
  status: PostStatus;
  posts: Post[];
}

export default function RoadmapCard({
  posts,
  status,
}: Readonly<RoadmapCardProps>) {
  return (
    <Card
      className="flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200 h-full border-t-4 overflow-hidden"
      style={{ borderTopColor: status.color }}
    >
      <CardHeader className="pb-3 pt-4 px-4">
        <div className="flex items-center gap-2">
          <div
            className="size-2.5 rounded-full ring-2 ring-offset-1"
            style={{ backgroundColor: status.color }}
          />
          <CardTitle className="text-base font-semibold tracking-tight">
            {status.label}
          </CardTitle>
          <div className="mr-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {posts.length} پست
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 px-4 pb-4">
        <div
          className="min-h-75 max-h-70 overflow-y-auto space-y-3 pr-1"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#cbd5e1 transparent",
          }}
        >
          <Activity mode={posts.length > 0 ? "visible" : "hidden"}>
            <div className="grid grid-cols-1 gap-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </Activity>

          <Activity mode={posts.length === 0 ? "visible" : "hidden"}>
            <DataEmptyState
              title="پستی با این وضعیت ثبت نشده است."
              size="sm"
              className="h-fit overflow-x-hidden"
            />
          </Activity>
        </div>
      </CardContent>
    </Card>
  );
}
