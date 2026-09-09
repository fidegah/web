import { useFetcher, useSearchParams } from "react-router";
import { useEffect } from "react";
import type { Board, PostCategory, PostStatus, Tag } from "~/types";
import FilterSection from "../../filters/ filter-section";
import FilterDialog from "../../filters/filter-dialog";

interface FeedbackFilterDialogProps {
  isOpenDialog: boolean;
  setIsOpenDialog: (val: boolean) => void;
  data: {
    boardId: number;
    boardTags: Tag[];
    postStatuses: PostStatus[];
  };
}

export default function FeedbackFilterDialog({
  isOpenDialog,
  setIsOpenDialog,
  data,
}: Readonly<FeedbackFilterDialogProps>) {
  const boardsFetcher = useFetcher();
  const categoriesFetcher = useFetcher();

  const boardsIsLoading = boardsFetcher.state !== "idle";
  const categoriesIsLoading = categoriesFetcher.state !== "idle";

  const [searchParams] = useSearchParams();

  const { boardId, boardTags, postStatuses } = data;

  useEffect(() => {
    if (isOpenDialog && !boardsFetcher.data && !categoriesFetcher.data) {
      boardsFetcher.load("/proxy/boards");
      categoriesFetcher.load(`/proxy/categories?boardId=${boardId}`);
    }
  }, [isOpenDialog, boardsFetcher.data]);

  const boardIds = searchParams.get("boards")?.split(",").filter(Boolean) || [];

  const allBoards = boardsFetcher.data as Board[] | null;
  const allCategories = categoriesFetcher.data as PostCategory[] | null;

  const selectedBoards =
    boardIds.length === 0
      ? allBoards
      : allBoards?.filter((board) => boardIds.includes(String(board.id)));

  const availableCategories = allCategories?.filter(
    (category) =>
      boardIds.length === 0 ||
      selectedBoards?.some((board) => board.id === category.boardId),
  );

  const filteredTags = boardTags?.filter(
    (tag) =>
      boardIds.length === 0 ||
      selectedBoards?.some((board) => board.id === tag.boardId),
  );

  const isLoading = boardsIsLoading || categoriesIsLoading;

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
        paramName="boardIds"
        isLoading={boardsIsLoading}
        skeletonCount={2}
      />

      <FilterSection
        title="دسته بندی"
        items={(availableCategories || []).map((category: PostCategory) => ({
          id: category.id,
          label: category.name,
          value: String(category.id),
        }))}
        paramName="categories"
        isLoading={categoriesIsLoading}
      />

      <FilterSection
        title="تگ"
        items={(filteredTags || []).map((tag) => ({
          id: tag.id,
          label: tag.name,
          value: String(tag.id),
        }))}
        paramName="tagIds"
      />

      <FilterSection
        title="وضعیت"
        items={postStatuses}
        paramName="postStatusIds"
        gridCols="grid-cols-2 lg:grid-cols-3"
        skeletonCount={6}
      />
    </FilterDialog>
  );
}
