import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import InfoItem from "~/components/ui/dashboard/info-item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useActionAlert } from "~/hooks/use-action-alert";
import type { Post, PostStatus } from "~/types";

interface StatusMenagerProps {
  postStatuses: PostStatus[];
  post: Post;
}

export default function StatusMenager({
  postStatuses,
  post,
}: Readonly<StatusMenagerProps>) {
  const fetcher = useFetcher();
  useActionAlert(fetcher.data);

  const [value, setValue] = useState<string | undefined>(undefined);

  const handleChangeStatus = async (statusId: string) => {
    setValue(statusId);

    fetcher.submit(
      { postId: post.id, statusId },
      {
        method: "PATCH",
        action: "/proxy/posts",
        defaultShouldRevalidate: false,
      },
    );
  };

  useEffect(() => {
    if (fetcher.data?.status === "ERR") setValue(String(post.statusId));
  }, [fetcher.data]);

  return (
    <InfoItem label="وضعیت" icon={Loader}>
      <Select
        value={value}
        onValueChange={(value) => handleChangeStatus(value)}
        defaultValue={String(
          postStatuses.find((item) => item.id === post?.statusId)?.id,
        )}
      >
        <SelectTrigger dir="rtl" size="sm" className="rounded-md shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent dir="rtl">
          {postStatuses.map((item) => (
            <SelectItem
              key={String(item.id)}
              value={String(item.id)}
              style={{ color: item.color }}
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </InfoItem>
  );
}
