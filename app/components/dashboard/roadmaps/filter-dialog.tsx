import type { Board, PostStatus } from "~/types";
import FilterDialog from "../filters/filter-dialog";
import { useEffect } from "react";
import { useFetcher } from "react-router";
import FilterSection from "../filters/ filter-section";

interface RoadmapFilterDialogProps {
  isOpenDialog: boolean;
  setIsOpenDialog: (val: boolean) => void;
  data: {
    boards: Board[];
    postStatuses: PostStatus[];
  };
}

export default function RoadmapFilterDialog({
  isOpenDialog,
  setIsOpenDialog,
  data,
}: Readonly<RoadmapFilterDialogProps>) {
  const boardsFetcher = useFetcher<Board[]>();
  const boardsIsLoading = boardsFetcher.state !== "idle";
  const { postStatuses } = data;

  useEffect(() => {
    if (isOpenDialog && !boardsFetcher.data) {
      boardsFetcher.load("/proxy/boards");
    }
  }, [isOpenDialog, boardsFetcher]);

  const isLoading = boardsIsLoading;

  return (
    <FilterDialog
      isOpen={isOpenDialog}
      setIsOpen={setIsOpenDialog}
      isLoading={isLoading}
    >
      <FilterSection
        title="بخش"
        items={(boardsFetcher.data || []).map((board: Board) => ({
          id: board.id,
          label: board.title,
          value: String(board.id),
        }))}
        paramName="boardId"
        gridCols="grid-cols-2 lg:grid-cols-3"
        isLoading={boardsIsLoading}
        skeletonCount={3}
      />

      <FilterSection
        title="وضعیت"
        items={postStatuses.map((status: PostStatus) => ({
          id: status.id,
          label: status.label,
          value: status.id,
        }))}
        paramName="postStatusId"
        gridCols="grid-cols-2 lg:grid-cols-3"
        skeletonCount={6}
      />
    </FilterDialog>
  );
}
