import { Activity } from "react";
import RoadmapCard from "~/components/roadmap-card";
import { Card, CardTitle, CardHeader, CardContent } from "~/components/ui/card";
import { DataEmptyState } from "~/components/ui/empty-state";
import type { Paginated, Post, PostStatus } from "~/types";

interface PostsByStatusProps {
  postStatuses: PostStatus[];
  posts: Paginated<Post[]>;
}

export default function PostsByStatus({
  postStatuses,
  posts,
}: Readonly<PostsByStatusProps>) {
  return (
    <Card className="flex flex-col shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>وضعیت پست‌ها</CardTitle>
      </CardHeader>

      <CardContent>
        <Activity mode={posts.data.length > 0 ? "visible" : "hidden"}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {postStatuses.map((status) => (
              <RoadmapCard
                key={status.id}
                status={status}
                posts={posts.data.filter((item) => item.statusId === status.id)}
              />
            ))}
          </div>
        </Activity>

        <Activity mode={posts.data.length === 0 ? "visible" : "hidden"}>
          <DataEmptyState
            title="هنوز پستی ایجاد نکرده اید."
            size="sm"
            className="h-fit"
          />
        </Activity>
      </CardContent>
    </Card>
  );
}
