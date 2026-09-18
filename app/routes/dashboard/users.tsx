import { Activity, useEffect, useState } from "react";
import { data, Link, replace, useNavigate, useFetcher } from "react-router";
import { SquareArrowOutUpRight, UsersRound } from "lucide-react";
import UserItem from "~/components/dashboard/users/user-item";
import SelectedUsersBox from "~/components/dashboard/users/selected-users-box";
import UserInfo from "~/components/dashboard/users/user-info/user-info";
import UserActivity from "~/components/dashboard/users/user-activity/user-activity";
import UserActivityDialogCompact from "~/components/dashboard/users/user-activity/user-activity-dialog-compact";
import UserInfoDialogCompact from "~/components/dashboard/users/user-info/user-info-dialog-compact";
import UserActivityFilterDialog from "~/components/dashboard/users/dialogs/user-activity-filter";
import SideList from "~/components/dashboard/side-list";
import { DataEmptyState } from "~/components/ui/empty-state";
import { PageHeader } from "~/components/ui/page-header";
import { MESSAGES } from "~/constants/messages";
import { useDevice } from "~/hooks/use-device";
import type { Route } from "./+types/users";
import { SEO_CONFIG } from "~/constants/seo";
import { ERROR_CODE } from "~/constants/errors";
import type { WorkspaceUser } from "~/types";
import {
  getCurrentWorkspace,
  getUserActivityStatus,
  getWorkspaceUser,
  getWorkspaceUsers,
} from "~/services/workspace.service";
import { getCurrentUser } from "~/services/user.service";
import { apiClientContext } from "~/context";

export function meta() {
  return [{ title: SEO_CONFIG.dashboard.users.title }];
}

export async function loader({ params, context, url }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);
  const { userId } = params;

  if (!userId) {
    const currentUser = await getCurrentUser(api);
    return replace(`/dashboard/users/${currentUser.id}`);
  }

  const usersSearch = url.searchParams.get("users-search") || "";
  const userActivitySearch = url.searchParams.get("user-activity-search") || "";
  const activity = url.searchParams.get("activity") || "";
  const userActivityPage = url.searchParams.get("user-activity-page") || "1";
  const usersPage = url.searchParams.get("users-page") || "1";

  const isFiltering =
    usersSearch.trim().length > 0 ||
    userActivitySearch.trim().length > 0 ||
    activity.trim().length > 0;

  const USERS_LIMIT = 30;
  const ACTIVITY_LIMIT = 30;

  try {
    const workspace = await getCurrentWorkspace(api);

    const [currentUser, workspaceUsers, member, activityStatus] =
      await Promise.all([
        getCurrentUser(api),
        getWorkspaceUsers(api, workspace.id, {
          search: usersSearch,
          page: Number(usersPage),
          limit: USERS_LIMIT,
        }),
        getWorkspaceUser(api, workspace.id, userId),
        getUserActivityStatus(api, workspace.id, userId, {
          page: Number(userActivityPage),
          limit: ACTIVITY_LIMIT,
          search: userActivitySearch,
          filter: activity,
        }),
      ]);

    if (!member && !isFiltering) {
      throw data(null, {
        status: 400,
        statusText: ERROR_CODE.GENERAL.FAILED_TO_FIND,
      });
    }

    return {
      isUserBanned: member?.isBanned ?? false,
      isFiltering,
      currentUserId: currentUser.id,
      workspace,
      userInfo: member,
      users: workspaceUsers,
      activityStatus,
      USERS_LIMIT,
      ACTIVITY_LIMIT,
    };
  } catch (error) {
    console.error("Failed to fetch workspaces users from API:", error);

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export default function Users({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { isMobile, isTablet } = useDevice();
  const loadMoreUsersFetcher = useFetcher();

  const {
    isFiltering,
    isUserBanned,
    currentUserId,
    workspace,
    userInfo,
    USERS_LIMIT,
    ACTIVITY_LIMIT,
    activityStatus,
    users,
  } = loaderData;

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isUserActivityDialogOpen, setIsUserActivityDialogOpen] =
    useState(false);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [isOpenUserActivityFilterDialog, setIsOpenUserActivityFilterDialog] =
    useState(false);
  const [localUsers, setLocalUsers] = useState(() => users);

  useEffect(() => {
    if (users) {
      setLocalUsers(users);
    }
  }, [users]);

  useEffect(() => {
    const response = loadMoreUsersFetcher.data?.workspaceUsers;
    if (response && loadMoreUsersFetcher.state === "idle") {
      setLocalUsers((prev) => {
        const existingIds = new Set(prev.data.map((u) => u.userId));
        const newUsers = (response.data || []).filter(
          (u: WorkspaceUser) => !existingIds.has(u.userId),
        );
        return {
          data: [...prev.data, ...newUsers],
          pagination: response.pagination,
        };
      });
    }
  }, [loadMoreUsersFetcher.data, loadMoreUsersFetcher.state]);

  const showEmptyState = localUsers.data.length === 0 && !isFiltering;

  const handleLoadMoreUsers = () => {
    const nextRealPage = Math.floor(localUsers.data.length / USERS_LIMIT) + 1;

    const currentUrl = new URL(globalThis.location.href);
    currentUrl.searchParams.set("users-page", String(nextRealPage));

    loadMoreUsersFetcher.load(currentUrl.search + currentUrl.hash);
  };

  const toggleUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id],
    );
  };

  if (showEmptyState) {
    return (
      <div className="w-full h-full flex flex-col gap-6 p-3">
        <PageHeader
          icon={UsersRound}
          title="کاربران"
          description="در این بخش می‌توانید لیست کاربران را مشاهده و مدیریت کنید، شامل مسدودسازی، حذف یا ویرایش اطلاعات هر کاربر."
        />
        <DataEmptyState
          title={MESSAGES.POST.EMPTY.TITLE}
          description={MESSAGES.POST.EMPTY.DESCRIPTION}
          actionText="رفتن به ایجاد پست"
          actionIcon={SquareArrowOutUpRight}
          onActionClick={() => navigate("/dashboard/feedback")}
        />
      </div>
    );
  }
  return (
    <div className="w-full flex overflow-hidden p-3 lg:p-0">
      <SideList
        items={localUsers.data}
        search={{
          showBox: true,
          placeholder: "برای جستجو نام کاربر را وارد نمایید.",
          queryKey: "users-search",
        }}
        activeId={userInfo?.userId}
        getItemKey={(item) => item.userId}
        renderItem={(workspaceUser) => (
          <Link
            key={workspaceUser.id}
            className="w-full"
            to={`/dashboard/users/${workspaceUser.userId}`}
          >
            <UserItem
              member={userInfo}
              user={{
                id: workspaceUser.userId,
                fullName: workspaceUser.fullName,
                avatarUrl: workspaceUser.avatarUrl,
              }}
              isUserBanned={workspaceUser.isBanned}
              cardOnClick={() => isMobile && setIsUserActivityDialogOpen(true)}
              checkboxOnClick={() => toggleUser(workspaceUser.userId)}
              infoButtonOnClick={() => setIsInfoDialogOpen(true)}
              checked={selectedUsers.includes(workspaceUser.userId)}
            />
          </Link>
        )}
        header={
          <SelectedUsersBox
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            workspaceUsers={localUsers.data}
          />
        }
        emptyState={{ title: "کاربری یافت نشد." }}
        pagination={{
          hasNextPage: localUsers.pagination.hasNext,
          isLoadingMore: loadMoreUsersFetcher.state !== "idle",
          onLoadMore: handleLoadMoreUsers,
        }}
      />

      <Activity mode={isMobile ? "visible" : "hidden"}>
        <UserActivityDialogCompact
          selectedUserId={userInfo?.userId}
          isUserActivityDialogOpen={isUserActivityDialogOpen}
          setIsUserActivityDialogOpen={setIsUserActivityDialogOpen}
          activityStatus={activityStatus}
          ACTIVITY_LIMIT={ACTIVITY_LIMIT}
        />
      </Activity>

      <UserActivity
        activityStatus={activityStatus}
        selectedUserId={userInfo?.userId}
        setIsOpenFilterDialog={setIsOpenUserActivityFilterDialog}
        ACTIVITY_LIMIT={ACTIVITY_LIMIT}
        className="hidden md:flex"
      />

      <Activity mode={isMobile || isTablet ? "visible" : "hidden"}>
        <UserInfoDialogCompact
          currentUserId={currentUserId}
          activitySummary={activityStatus.data.summary}
          userInfo={userInfo}
          isInfoDialogOpen={isInfoDialogOpen}
          setIsInfoDialogOpen={setIsInfoDialogOpen}
          isUserBanned={isUserBanned}
        />
      </Activity>

      <UserInfo
        isUserBanned={isUserBanned}
        currentUserId={currentUserId}
        activitySummary={activityStatus.data.summary}
        userInfo={userInfo}
        className="hidden lg:flex"
      />

      <UserActivityFilterDialog
        isOpen={isOpenUserActivityFilterDialog}
        setIsOpen={setIsOpenUserActivityFilterDialog}
      />
    </div>
  );
}
