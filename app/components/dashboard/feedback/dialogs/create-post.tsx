import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { RippleButton } from "~/components/ui/animate-ui/buttons/ripple";
import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import { useFetcher, useNavigate } from "react-router";
import { FormField } from "../post-form/form-field";
import PostFormSelect from "../post-form/select";
import ErrorMessage from "~/components/ui/error-message";
import type { Board, PostCategory, Post, SelectionDataType } from "~/types";
import SimilarPost from "../similar-post";
import Input from "~/components/ui/input-custom";
import Textarea from "~/components/ui/textarea";
import { Spinner } from "~/components/ui/spinner";
import { useActionAlert } from "~/hooks/use-action-alert";
import { Dialog, DialogContent, DialogFooter } from "~/components/ui/dialog";

interface CreatePostDialogProps {
  isOpenDialog: boolean;
  setIsOpenDialog: (val: boolean) => void;
}

export default function CreatePostDialog({
  isOpenDialog,
  setIsOpenDialog,
}: Readonly<CreatePostDialogProps>) {
  const fetcher = useFetcher();
  useActionAlert(fetcher.data);

  const navigate = useNavigate();
  const boardsFetcher = useFetcher();
  const categoriesFetcher = useFetcher();

  const [postData, setPostData] = useState<{
    title?: string;
    boardId?: string;
  }>();

  useEffect(() => {
    if (isOpenDialog) {
      boardsFetcher.load("/proxy/boards");
    }
  }, [isOpenDialog]);

  useEffect(() => {
    if (postData?.boardId) {
      categoriesFetcher.load(`/proxy/categories?boardId=${postData.boardId}`);
    }
  }, [postData?.boardId]);

  useEffect(() => {
    if (fetcher.data?.status === "OK") {
      const post = fetcher.data.data as Post;
      setIsOpenDialog(false);
      fetcher.reset();

      navigate(`/dashboard/feedback/board/${post.boardId}/post/${post.id}`);
    }
  }, [fetcher.data]);

  const boardsData: Board[] = boardsFetcher?.data;
  const boardsOptions: SelectionDataType[] = Array.isArray(boardsData)
    ? boardsData.map((board: Board) => ({
        value: board.id.toString(),
        label: board.title,
      }))
    : [];

  const categoriesData: PostCategory[] = categoriesFetcher?.data;
  const categoriesOptions: SelectionDataType[] = Array.isArray(categoriesData)
    ? categoriesData.map((category: PostCategory) => ({
        value: category.id.toString(),
        label: category.name,
      }))
    : [];

  const isLoadingBoards = boardsFetcher.state === "loading";
  const isLoadingCategories = categoriesFetcher.state === "loading";
  const isSubmitting = fetcher.state === "submitting";

  return (
    <Dialog open={isOpenDialog}>
      <DialogContent
        showCloseButton={false}
        className="md:min-w-3/4 lg:min-w-2/3"
      >
        <div className="flex flex-col">
          <div className="flex justify-start gap-3 items-center">
            <IconButton
              icon={ArrowRight}
              className="text-black dark:text-white"
              onClick={() => setIsOpenDialog(false)}
              title="بازگشت"
              aria-label="بستن دیالوگ ایجاد پست و بازگشت"
            />

            <b className="lg:text-lg">ایجاد پست</b>
          </div>

          <fetcher.Form
            method="POST"
            action="/proxy/posts"
            className="mt-6 flex flex-col lg:p-2"
          >
            <div className="flex flex-col md:flex-row gap-10 md:gap-4">
              <div className="w-full flex flex-col gap-6">
                <FormField
                  label="بخش"
                  actionLink={{
                    label: "ایجاد بخش",
                    link: "/dashboard/create-board",
                  }}
                >
                  <PostFormSelect
                    id="boardId"
                    options={boardsOptions}
                    isLoading={isLoadingBoards}
                    onValueChange={(value) => {
                      setPostData((prev) => ({
                        ...prev,
                        boardId: value,
                      }));
                    }}
                    isError={boardsFetcher?.data?.status === "ERR"}
                    noDataMessage="بخشی برای نمایش وجود ندارد. لطفا یک بخش ایجاد کنید."
                  />
                </FormField>

                <FormField
                  label="دسته بندی"
                  actionLink={{
                    label: "ایجاد دسته بندی",
                    link: "/dashboard/settings/boards/categories",
                  }}
                >
                  {postData?.boardId ? (
                    <PostFormSelect
                      id="categoryId"
                      options={categoriesOptions}
                      isLoading={isLoadingCategories}
                      isError={categoriesFetcher?.data?.status === "ERR"}
                      noDataMessage="دسته بندی برای نمایش وجود ندارد. لطفا یک دسته بندی ایجاد کنید."
                    />
                  ) : (
                    <span className="mt-1 text-xs lg:text-sm text-muted-foreground">
                      لطفا ابتدا یک "بخش" را انتخاب کنید.
                    </span>
                  )}
                </FormField>

                <FormField label="عنوان">
                  <Input
                    id="title"
                    placeholder="عنوان پست را وارد نمایید."
                    onChange={(e) =>
                      setPostData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    value={postData?.title}
                    className="lg:text-sm"
                  />
                </FormField>

                <FormField label="توضیحات">
                  <Textarea
                    id="description"
                    placeholder="توضیحات پست را وارد نمایید."
                    className="lg:text-sm"
                  />
                </FormField>

                <ErrorMessage data={fetcher.data} />
              </div>

              <SimilarPost title={postData?.title || ""} />
            </div>

            <DialogFooter className="mt-6">
              <RippleButton
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <p>در حال ایجاد پست</p>
                    <Spinner />
                  </span>
                ) : (
                  "ایجاد پست جدید"
                )}
              </RippleButton>
              <RippleButton
                type="button"
                variant="outline"
                onClick={() => setIsOpenDialog(false)}
              >
                لغو
              </RippleButton>
            </DialogFooter>
          </fetcher.Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
