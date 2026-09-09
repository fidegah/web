import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import dayjs from "dayjs";
import jalaliday from "jalali-plugin-dayjs";
import { getInitials } from "~/lib/utils";
import type { Paginated, Pagination, PostVoter } from "~/types";
import { CustomPagination } from "./ui/custom-pagination";

dayjs.extend(jalaliday);
dayjs.locale("fa");

interface VotedUsersTableProps {
  voters: Paginated<PostVoter[]>;
}

export default function VotedUsersTable({
  voters,
}: Readonly<VotedUsersTableProps>) {
  return (
    <div className="flex flex-col">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead>رأی دهندگان</TableHead>
            <TableHead>تاریخ ثبت</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="rtl w-full h-full overflow-y-auto">
          {voters.data.map((vote) => (
            <TableRow key={vote?.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="rounded-full">
                    <AvatarImage
                      src={vote.avatarUrl || undefined}
                      alt={`${vote.fullName} Avatar`}
                    />
                    <AvatarFallback className="rounded-md">
                      {getInitials(vote.fullName)}
                    </AvatarFallback>
                  </Avatar>

                  <span>{vote.fullName}</span>
                </div>
              </TableCell>
              <TableCell>
                {dayjs(vote.votedAt).calendar("jalali").format("YYYY/M/D")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CustomPagination
        pagination={voters.pagination}
        maxVisiblePages={0}
        queryParamName="postVotesPage"
      />
    </div>
  );
}
