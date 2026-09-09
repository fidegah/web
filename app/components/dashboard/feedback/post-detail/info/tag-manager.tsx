import { CirclePlus, X } from "lucide-react";
import { Activity, useEffect, useState } from "react";
import { Link, useFetcher } from "react-router";
import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/animate-ui/radix/dropdown-menu";
import { Badge } from "~/components/ui/badge";
import { Spinner } from "~/components/ui/spinner";
import { useActionAlert } from "~/hooks/use-action-alert";
import type { Board, Post, Tag } from "~/types";

interface PostTagManagerProps {
  board: Board;
  post: Post;
  boardTags: Tag[];
  initialPostTags: Tag[];
}

export default function PostTagManager({
  board,
  boardTags,
  post,
  initialPostTags,
}: Readonly<PostTagManagerProps>) {
  const fetcher = useFetcher();
  useActionAlert(fetcher.data);

  const [tags, setTags] = useState<Tag[]>(initialPostTags);
  const [deletingTagId, setDeletingTagId] = useState<string | null>(null);

  const availableTags = boardTags.filter(
    (tag) => !tags.some((t) => String(t.id) === String(tag.id)),
  );

  const handleTagAction = (tagId: string, method: "POST" | "DELETE") => {
    if (method === "DELETE") setDeletingTagId(tagId);

    fetcher.submit(
      {
        boardId: board.id,
        postId: post.id,
        tagId,
      },
      {
        method,
        action: "/proxy/posts/tags",
        defaultShouldRevalidate: false,
      },
    );
  };

  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;

    setDeletingTagId(null);

    const responseData = fetcher.data as {
      status: string;
      data?: {
        action: "create-tag" | "delete-tag";
        postTag?: Tag;
        tagId?: string;
      };
    };

    if (responseData?.status === "OK" && responseData.data) {
      const { action, postTag, tagId } = responseData.data;

      if (action === "create-tag") {
        const targetId = tagId ?? postTag?.id;
        const newTag =
          boardTags.find((t) => String(t.id) === String(targetId)) || postTag;

        if (newTag) {
          setTags((prev) => {
            const exists = prev.some((t) => String(t.id) === String(newTag.id));
            return exists ? prev : [newTag, ...prev];
          });
        }
      } else if (action === "delete-tag" && tagId) {
        setTags((prev) =>
          prev.filter((tag) => String(tag.id) !== String(tagId)),
        );
      }
    }
  }, [fetcher.data, fetcher.state, boardTags]);

  const isLoading =
    fetcher.state === "submitting" || fetcher.state === "loading";

  return (
    <div className="flex flex-col gap-3 mt-6 w-full">
      <div className="w-full flex justify-between items-center">
        <b className="text-sm">تگ ها</b>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <IconButton
              icon={isLoading && !deletingTagId ? Spinner : CirclePlus}
              disabled={isLoading}
              title="افزودن تگ"
              aria-label="افزودن تگ جدید"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent dir="rtl" align="end">
            {availableTags.length > 0 ? (
              availableTags.map((tag) => (
                <DropdownMenuItem
                  key={tag.id}
                  onSelect={() => handleTagAction(String(tag.id), "POST")}
                >
                  {tag.name}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>
                تگی برای انتخاب وجود ندارد.
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link
                to={`/dashboard/settings/boards/${board.id}/tags`}
                className="w-full cursor-pointer flex items-center gap-2"
              >
                <CirclePlus className="size-4" />
                ایجاد تگ جدید
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Activity mode={tags.length > 0 ? "visible" : "hidden"}>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag.id} variant="outline" className="gap-3">
              <span className="text-sm line-clamp-1">{tag.name}</span>
              {deletingTagId === String(tag.id) ? (
                <Spinner className="text-red-600 size-5!" />
              ) : (
                <IconButton
                  icon={X}
                  size="sm"
                  color={[220, 38, 38]}
                  onClick={() => handleTagAction(String(tag.id), "DELETE")}
                  title={`حذف تگ ${tag.name}`}
                  aria-label={`حذف تگ ${tag.name}`}
                />
              )}
            </Badge>
          ))}
        </div>
      </Activity>

      <Activity mode={tags.length === 0 ? "visible" : "hidden"}>
        <p className="w-full text-muted-foreground text-sm">
          هیچ تگی برای این پست اضافه نشده است.
        </p>
      </Activity>
    </div>
  );
}
