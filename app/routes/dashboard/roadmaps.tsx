import { CircleFadingPlus, Map, SearchX, FilterX } from "lucide-react";
import RoadmapMatrixTable from "~/components/dashboard/roadmaps/matrix-table";
import SearchBox from "~/components/search-box";
import { PageHeader } from "~/components/ui/page-header";
import { data, replace, useNavigate, useSearchParams } from "react-router";
import { ERROR_CODE } from "~/constants/errors";
import RoadmapScoreFormulaDialog from "~/components/dashboard/roadmaps/score-formula-dialog";
import RoadmapExportButton from "~/components/dashboard/roadmaps/export-button";
import RoadmapSwitcher from "~/components/dashboard/roadmaps/roadmap-switcher";
import RoadmapFilterDialog from "~/components/dashboard/roadmaps/filter-dialog";
import { Activity, useEffect, useState } from "react";
import { DataEmptyState } from "~/components/ui/empty-state";
import { SEO_CONFIG } from "~/constants/seo";
import CreateRoadmapDialog from "~/components/dashboard/roadmaps/create-roadmap-dialog";
import type { Route } from "./+types/roadmaps";
import { useAlert } from "~/components/alert-context";
import { MESSAGES } from "~/constants/messages";
import RoadmapActions from "~/components/dashboard/roadmaps/roadmap-actions";
import RoadmapManagementDialogs from "~/components/dashboard/roadmaps/roadmap-management-dialogs";
import { getRoadmapItems, getRoadmaps } from "~/services/roadmap.service";
import { getCurrentWorkspace } from "~/services/workspace.service";
import { getBoards } from "~/services/board.service";
import { getPosts, getPostStatuses } from "~/services/post.service";
import { apiClientContext } from "~/context";
import { RoadmapAddPostSheet } from "~/components/dashboard/roadmaps/add-post-sheet";
import Fab from "~/components/ui/fab";
import type { RoadmapFactor } from "~/types";

export function meta() {
  return [{ title: SEO_CONFIG.dashboard.roadmap.list.title }];
}

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);
  const { roadmapId } = params;

  const url = new URL(request.url);
  const searchParam = url.searchParams.get("search") || "";
  const postStatusIdParam = url.searchParams.get("postStatusId") || "";
  const postsPageParam = url.searchParams.get("postsPage") || "1";

  try {
    const workspace = await getCurrentWorkspace(api);
    const roadmaps = await getRoadmaps(api, workspace.id);

    if (!roadmaps || roadmaps.length === 0) {
      return {
        roadmaps: [],
        roadmap: null,
        roadmapItems: { columns: [], items: [] },
        boards: [],
        postStatuses: [],
        isSearching: false,
        isEmptyFiltered: false,
        isRoadmapItemsExist: false,
      };
    }

    if (!roadmapId) {
      return replace(`/dashboard/roadmaps/${roadmaps[0].id}`);
    }

    const [roadmapItems, boards, posts, postStatuses] = await Promise.all([
      getRoadmapItems(api, workspace.id, roadmapId, {
        search: searchParam,
        statusId: postStatusIdParam,
      }),
      getBoards(api, workspace.id),
      getPosts(api, workspace.id, { page: Number(postsPageParam) }),
      getPostStatuses(api),
    ]);

    const roadmap = roadmaps.find((item) => item.id === roadmapId);

    if (!roadmap) {
      return replace(`/dashboard/roadmaps/${roadmaps[0].id}`);
    }

    const isFiltered = !!(searchParam.trim() || postStatusIdParam);

    return {
      roadmaps,
      roadmap,
      roadmapItems,
      boards,
      posts,
      postStatuses,
      isSearching: searchParam.trim().length > 0,
      isEmptyFiltered: isFiltered && roadmapItems.items.length === 0,
      isRoadmapItemsExist: roadmapItems.items.length > 0,
    };
  } catch (error) {
    console.error("Failed to fetch roadmaps from API:", error);

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export default function Roadmap({ loaderData, params }: Route.ComponentProps) {
  const navigate = useNavigate();

  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isOpenAddPostSheet, setIsOpenAddPostSheet] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const { showAlert } = useAlert();

  const { roadmapId } = params;
  const {
    roadmaps,
    roadmap,
    roadmapItems,
    boards,
    posts,
    postStatuses,
    isSearching,
    isEmptyFiltered,
    isRoadmapItemsExist,
  } = loaderData;

  const [currentRoadmap, setCurrentRoadmap] = useState(roadmap);
  const [allRoadmaps, setAllRoadmaps] = useState(roadmaps);
  const [factors, setFactors] = useState<RoadmapFactor[]>(roadmapItems.columns);

  useEffect(() => {
    setFactors(roadmapItems.columns);
  }, [roadmapItems.columns]);

  useEffect(() => {
    setCurrentRoadmap(roadmap);
  }, [roadmap]);

  useEffect(() => {
    setAllRoadmaps(roadmaps);
  }, [roadmaps]);

  const handleRoadmapRename = (id: string, newName: string) => {
    setCurrentRoadmap((prev) =>
      prev && prev.id === id ? { ...prev, name: newName } : prev,
    );
    setAllRoadmaps((prev) =>
      prev.map((r) => (r.id === id ? { ...r, name: newName } : r)),
    );
  };

  const handleRoadmapDelete = (id: string) => {
    const remainingRoadmaps = allRoadmaps.filter((r) => r.id !== id);
    setAllRoadmaps(remainingRoadmaps);

    if (currentRoadmap?.id === id) {
      if (remainingRoadmaps.length > 0) {
        navigate(`/dashboard/roadmaps/${remainingRoadmaps[0].id}`, {
          replace: true,
        });
      } else {
        navigate("/dashboard/roadmaps", { replace: true });
      }
    }
  };

  const [isOpenFilterDialog, setIsOpenFilterDialog] = useState(false);
  const [isOpenCreateRoamapDialog, setIsOpenCreateRoamapDialog] =
    useState(false);

  const getEmptyStateProps = () => {
    if (isSearching) {
      return {
        title: "پستی با این مشخصات پیدا نشد",
        description:
          "عنوان یا عبارت جستجوی خود را تغییر دهید یا فیلترها را بررسی کنید.",
        actionText: "پاک کردن جستجو",
        actionIcon: SearchX,
        onActionClick: () => {
          searchParams.delete("search");
          setSearchParams(searchParams);
        },
      };
    }

    if (isEmptyFiltered) {
      return {
        title: "نتیجه‌ای برای فیلترهای انتخابی یافت نشد",
        description:
          "هیچ پستی در این نقشه‌راه با وضعیت یا مشخصات فیلتر شده همخوانی ندارد.",
        actionText: "حذف فیلترها",
        actionIcon: FilterX,
        onActionClick: () => {
          searchParams.delete("postStatusId");
          setSearchParams(searchParams);
        },
      };
    }

    return {
      title: currentRoadmap
        ? "این نقشه‌راه هنوز خالی است"
        : "هیچ نقشه‌راهی وجود ندارد",
      description: currentRoadmap
        ? "برای اولویت‌بندی، اعمال فاکتورهای تاثیر و هزینه و رتبه‌بندی ایده‌ها، اولین پست را اضافه کنید."
        : "برای شروع، لطفا اولین نقشه‌راه خود را ایجاد کنید.",
      actionText: currentRoadmap ? "افزودن پست به نقشه‌راه" : "ایجاد نقشه‌راه",
      actionIcon: CircleFadingPlus,
      onActionClick: () => {
        setIsOpenAddPostSheet(true);
      },
    };
  };

  const emptyStateProps = getEmptyStateProps();

  return (
    <main className="w-full h-full flex flex-col gap-6 p-3">
      <PageHeader
        icon={Map}
        title="نقشه‌راه"
        description="فاکتورهای تأثیر و هزینه را مدیریت کنید، به ایده‌ها امتیاز دهید و اولویت‌بندی پست‌ها را بر اساس فرمول اختصاصی خود ارزیابی کنید."
      />

      <Fab
        tooltipText="اضافه کردن پست"
        onClick={() => setIsOpenAddPostSheet(true)}
      />

      <div className="flex flex-col lg:flex-row lg:items-center gap-6">
        <Activity
          mode={
            currentRoadmap &&
            (isRoadmapItemsExist || isEmptyFiltered || isSearching)
              ? "visible"
              : "hidden"
          }
        >
          <SearchBox
            filterButtonOnClick={() => setIsOpenFilterDialog(true)}
            className="lg:w-2/3"
            inputClassName="lg:text-base"
            filterBtnClassName="lg:size-10"
            placeholder="برای جستجو عنوان‌ مشخصات پست‌‌ها را بنویسید."
          />
        </Activity>

        <div className="flex items-center md:justify-start gap-3 select-none ml-auto lg:ml-0">
          <Activity
            mode={currentRoadmap && isRoadmapItemsExist ? "visible" : "hidden"}
          >
            {currentRoadmap && (
              <>
                <RoadmapExportButton
                  columns={factors}
                  items={roadmapItems.items}
                  postStatuses={postStatuses}
                  roadmap={currentRoadmap}
                />

                <RoadmapScoreFormulaDialog
                  factors={factors}
                  setFactors={setFactors}
                  roadmap={currentRoadmap}
                />
              </>
            )}
          </Activity>

          <div className="flex items-center gap-2">
            {allRoadmaps.length > 0 && (
              <RoadmapSwitcher
                currentRoadmapId={roadmapId}
                roadmaps={allRoadmaps}
                onCreateClick={() =>
                  allRoadmaps.length >= 3
                    ? showAlert({
                        title: MESSAGES.ROADMAPS.LIMIT_ERROR,
                        type: "warning",
                      })
                    : setIsOpenCreateRoamapDialog(true)
                }
              />
            )}

            {currentRoadmap && (
              <RoadmapActions
                onEditClick={() => setIsOpenEditDialog(true)}
                onDeleteClick={() => setIsOpenDeleteDialog(true)}
              />
            )}
          </div>
        </div>
      </div>

      <Activity
        mode={currentRoadmap && isRoadmapItemsExist ? "visible" : "hidden"}
      >
        {currentRoadmap && (
          <RoadmapMatrixTable
            columns={factors}
            items={roadmapItems.items}
            postStatuses={postStatuses}
          />
        )}
      </Activity>

      <Activity
        mode={currentRoadmap && isRoadmapItemsExist ? "hidden" : "visible"}
      >
        <DataEmptyState
          title={emptyStateProps.title}
          description={emptyStateProps.description}
          actionText={emptyStateProps.actionText}
          actionIcon={emptyStateProps.actionIcon}
          onActionClick={emptyStateProps.onActionClick}
        />
      </Activity>

      <RoadmapFilterDialog
        isOpenDialog={isOpenFilterDialog}
        setIsOpenDialog={setIsOpenFilterDialog}
        data={{ boards, postStatuses }}
      />

      <CreateRoadmapDialog
        open={isOpenCreateRoamapDialog}
        onOpenChange={(val) => setIsOpenCreateRoamapDialog(val)}
      />

      {currentRoadmap && (
        <RoadmapManagementDialogs
          roadmap={currentRoadmap}
          isOpenEdit={isOpenEditDialog}
          setIsOpenEdit={setIsOpenEditDialog}
          isOpenDelete={isOpenDeleteDialog}
          setIsOpenDelete={setIsOpenDeleteDialog}
          onRoadmapRename={handleRoadmapRename}
          onRoadmapDelete={handleRoadmapDelete}
        />
      )}

      <RoadmapAddPostSheet
        isOpen={isOpenAddPostSheet}
        onOpenChange={setIsOpenAddPostSheet}
        posts={posts}
        roadmapId={currentRoadmap?.id}
        addedPostIds={roadmapItems.items.map((item) => item.postId)}
      />
    </main>
  );
}
