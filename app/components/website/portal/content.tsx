import ChangelogCard from "~/components/changelog/changelog-card";
import PollCard from "~/components/dashboard/polls/poll-card";
import RoadmapCard from "~/components/roadmap-card";
import { SectionTitle } from "~/components/ui/page-header";
import PortalBoardCard from "./board-card";
import { Activity } from "react";
import { useNavigate } from "react-router";
import type {
  Board,
  Changelog,
  ChangelogTag,
  Paginated,
  Pagination,
  Poll,
  Post,
  PostStatus,
} from "~/types";
import { CustomPagination } from "~/components/ui/custom-pagination";

interface PortalContentProps {
  boards: Board[];
  latestChangelogs: Changelog[];
  latestPolls: Poll[];
  posts: Paginated<Post[]>;
  postStatuses: PostStatus[];
  changelogTags: ChangelogTag[];
}

export default function PortalContent({
  boards,
  latestChangelogs,
  latestPolls,
  posts,
  postStatuses,
  changelogTags,
}: Readonly<PortalContentProps>) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8 p-3 md:px-6 lg:px-10">
      <Activity mode={boards.length > 0 ? "visible" : "hidden"}>
        <div className="flex flex-col gap-4">
          <SectionTitle>بخش‌ها</SectionTitle>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {boards.map((board) => (
              <PortalBoardCard
                key={board.id}
                title={board.title}
                postCount={board.postsCount}
                onClick={() => navigate(`feedback/board/${board.id}`)}
              />
            ))}
          </div>
        </div>
      </Activity>

      <Activity mode={latestChangelogs.length > 0 ? "visible" : "hidden"}>
        <div className="flex flex-col gap-4">
          <SectionTitle>تازه‌ترین گزارش تغییرات</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {latestChangelogs.map((changelog) => (
              <ChangelogCard
                key={changelog.id}
                changelogTags={changelogTags}
                changelog={changelog}
                isAdmin={false}
              />
            ))}
          </div>
        </div>
      </Activity>

      <Activity mode={latestPolls.length > 0 ? "visible" : "hidden"}>
        <div className="flex flex-col gap-4">
          <SectionTitle>تازه‌ترین نظرسنجی‌ها</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {latestPolls.map((poll) => (
              <PollCard key={poll.id} poll={poll} isAdmin={false} />
            ))}
          </div>
        </div>
      </Activity>

      <div className="flex flex-col gap-4">
        <SectionTitle>نقشه راه</SectionTitle>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {postStatuses.map((status) => (
            <RoadmapCard
              key={status.id}
              posts={posts.data.filter((post) => post.statusId === status.id)}
              status={status}
            />
          ))}
        </div>
      </div>

      <CustomPagination
        pagination={posts.pagination}
        queryParamName="postPage"
        scrollToTop={false}
      />
    </div>
  );
}
