import { Folder, Shapes, Unlink2 } from "lucide-react";
import InfoItem from "~/components/ui/dashboard/info-item";
import PostTagManager from "./tag-manager";
import StatusMenager from "./status-menager";
import type {
  Board,
  PostCategory,
  Post,
  PostStatus,
  Tag,
  Workspace,
} from "~/types";
import CreatorInfo from "~/components/ui/creator-info";

interface PostCardInfoProps {
  workspace: Workspace;
  board: Board;
  postStatuses: PostStatus[];
  post: Post;
  postCategory: PostCategory | undefined;
  boardTags: Tag[];
  initialPostTags: Tag[];
}

export default function PostCardInfo({
  workspace,
  board,
  post,
  postStatuses,
  postCategory,
  boardTags,
  initialPostTags,
}: Readonly<PostCardInfoProps>) {
  const postAddress = `https://${workspace?.subdomain}.${
    import.meta.env.VITE_APP_DOMAIN
  }/feedback/board/${board.id}/post/${post?.id}`;

  return (
    <div className="w-full flex flex-col gap-3 lg:px-1">
      <b className="text-sm">جزئیات</b>
      <InfoItem label="آدرس" icon={Unlink2}>
        <a
          href={postAddress}
          target="_blank"
          className="w-full text-blue-500 hover:text-blue-600 line-clamp-1 break-all ltr"
        >
          {postAddress}
        </a>
      </InfoItem>

      <InfoItem label="بخش" icon={Folder}>
        <span>{board.title}</span>
      </InfoItem>

      <StatusMenager post={post} postStatuses={postStatuses} />

      <CreatorInfo
        avatarUrl={post.creator?.avatarUrl ?? undefined}
        fullName={post.creator?.fullName || "-"}
      />

      <InfoItem label="دسته بندی" icon={Shapes}>
        <span>{postCategory?.name ?? "-"}</span>
      </InfoItem>

      <PostTagManager
        key={initialPostTags.length}
        board={board}
        boardTags={boardTags}
        post={post}
        initialPostTags={initialPostTags}
      />
    </div>
  );
}
