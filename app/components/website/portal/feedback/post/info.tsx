import { Calendar, Shapes, Users, Info } from "lucide-react";
import type {
  PostCategory,
  Pagination,
  Post,
  PostVoter,
  Paginated,
} from "~/types";
import dayjs from "dayjs";
import jalaliday from "jalali-plugin-dayjs";
import CreatorInfo from "~/components/ui/creator-info";
import InfoItem from "~/components/ui/dashboard/info-item";
import VotedUsersTable from "~/components/voted-users-table";
import CustomTabs from "~/components/ui/custom-tabs";
import { Activity } from "react";
import { DataEmptyState } from "~/components/ui/empty-state";

dayjs.extend(jalaliday);

interface PortalPostInfoProps {
  post: Post;
  postCategory: PostCategory | undefined;
  postVoters: Paginated<PostVoter[]>;
}

export default function PortalPostInfo({
  post,
  postCategory,
  postVoters,
}: Readonly<PortalPostInfoProps>) {
  const postTabs = [
    {
      id: "info",
      label: "اطلاعات پست",
      icon: Info,
      content: (
        <div className="space-y-6 py-2">
          <CreatorInfo
            avatarUrl={post.creator?.avatarUrl ?? undefined}
            fullName={post.creator?.fullName ?? ""}
          />
          <InfoItem icon={Shapes} label="دسته بندی">
            {postCategory?.name ?? "-"}
          </InfoItem>
          <InfoItem icon={Calendar} label="تاریخ ایجاد">
            {dayjs(post.createdAt).calendar("jalali").format("YYYY/M/D")}
          </InfoItem>
        </div>
      ),
    },
    {
      id: "votes",
      label: `رأی‌دهندگان (${post.votesCount})`,
      icon: Users,
      content: (
        <div className="py-2">
          <Activity mode={postVoters.data.length > 0 ? "visible" : "hidden"}>
            <VotedUsersTable voters={postVoters} />
          </Activity>

          <Activity mode={postVoters.data.length === 0 ? "visible" : "hidden"}>
            <DataEmptyState
              title="در حال حاضر رأی ثبت نشده است."
              size="sm"
              className="h-fit"
            />
          </Activity>
        </div>
      ),
    },
  ];

  return <CustomTabs tabs={postTabs} defaultValue="info" />;
}
