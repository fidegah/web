import { Activity } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import type { Board } from "~/types";
import { RippleButton } from "~/components/ui/animate-ui/buttons/ripple";

interface BoardsListProps {
  boards: Board[];
  boardId: string;
}

export default function SettingBoardsList({
  boards,
  boardId,
}: Readonly<BoardsListProps>) {
  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>بخش های ایجاد شده</CardTitle>
          <Link to="/dashboard/create-board">
            <RippleButton size="sm" className="shadow-sm">
              ایجاد بخش جدید
            </RippleButton>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        <Activity mode={boards && boards.length > 0 ? "visible" : "hidden"}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {boards?.map((board) => {
              const isActive = board.id === boardId;
              return (
                <Link
                  key={board.id}
                  to={`/dashboard/settings/boards/${board.id}`}
                  className={cn(
                    "p-3.5 flex items-center justify-between rounded-xl border text-sm font-medium transition-all duration-200 ease-in-out shadow-sm",
                    "hover:shadow-md hover:-translate-y-0.5",
                    "bg-card text-card-foreground border-border/80 hover:bg-accent/50",
                    isActive &&
                      "border-blue-500 bg-blue-50/50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-400 shadow-blue-100/50 dark:shadow-none",
                  )}
                >
                  <span className="line-clamp-1 truncate pl-2">
                    {board.title}
                  </span>
                  <span
                    className={cn(
                      "flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold transition-colors",
                      isActive
                        ? "bg-blue-500 text-white dark:bg-blue-400 dark:text-slate-950"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {board.postsCount}
                  </span>
                </Link>
              );
            })}
          </div>
        </Activity>

        <Activity mode={boards.length === 0 ? "visible" : "hidden"}>
          <div className="p-6 text-center border-2 border-dashed rounded-xl border-muted-foreground/20 bg-muted/10">
            <p className="text-sm text-muted-foreground">
              شما هنوز هیچ "بخشی" را ایجاد نکرده‌اید. برای شروع روی دکمه ایجاد
              بخش جدید کلیک کنید.
            </p>
          </div>
        </Activity>
      </CardContent>
    </Card>
  );
}
