import React, { Activity } from "react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DataEmptyState } from "~/components/ui/empty-state";

interface InfoItem {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
}

interface PopularItem {
  id: string | number;
  rank: number;
  title: string;
  infoItems: InfoItem[];
  score: number;
}

interface PopularItemCardProps {
  title: string;
  itemCount: number;
  items: PopularItem[];
}

const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return `#${rank}`;
  }
};

export default function PopularItemCard({
  title,
  itemCount,
  items,
}: Readonly<PopularItemCardProps>) {
  return (
    <Card className="bg-background border-none shadow-lg overflow-hidden">
      <CardHeader className="pb-4 border-b border-border/40">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <CardTitle className="font-bold">{title}</CardTitle>
          </div>
          <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
            {itemCount} مورد
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0 max-h-80 overflow-y-auto scrollbar-thin">
        <Activity mode={items.length === 0 ? "visible" : "hidden"}>
          <DataEmptyState
            title="آیتمی برای نمایش وجود ندارد."
            size="sm"
            className="h-fit"
          />
        </Activity>

        <Activity mode={items.length > 0 ? "visible" : "hidden"}>
          <div className="divide-y divide-border/30">
            {items.map((item) => (
              <div
                key={item.id}
                className="group flex items-center justify-between px-6 py-4 hover:bg-muted/30 transition-all duration-200"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Rank Badge */}
                  <Badge
                    className="w-10 h-10 text-lg shrink-0"
                    variant="outline"
                  >
                    {getRankBadge(item.rank)}
                  </Badge>

                  {/* Content */}
                  <div className="flex flex-col gap-2 min-w-0 flex-1">
                    <p className="font-bold text-sm truncate group-hover:text-primary transition-colors">
                      {item.title}
                    </p>

                    {/* Dynamic Info Items */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.infoItems.map((info, index) => (
                        <React.Fragment key={`${info.label}-${index}`}>
                          {index > 0 && (
                            <span className="text-gray-400">•</span>
                          )}
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            {info.icon}
                            <span>
                              {info.value} {info.label}
                            </span>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Score */}
                <div className="px-2 md:px-4 flex items-center gap-1 shrink-0">
                  <span className="font-bold text-amber-500 text-sm md:text-base">
                    {item.score} امتیاز
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Activity>
      </CardContent>
    </Card>
  );
}
