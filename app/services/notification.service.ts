import type { ApiClient } from "~/context";
import { apiRoutes } from "~/lib/api/routes";
import type { Notification } from "~/types";

type MarkNotificationsAsReadInput = {
  notificationIds: string[];
};

export async function getNotifications(api: ApiClient, workspaceId: string) {
  const { data, pagination } = await api.get<Notification[]>(
    apiRoutes.workspaces.notifications.base(workspaceId),
  );

  return { data, pagination };
}

export async function deleteNotification(
  api: ApiClient,
  workspaceId: string,
  notificationId: string,
): Promise<void> {
  await api.del(
    apiRoutes.workspaces.notifications.byId(workspaceId, notificationId),
  );
}

export async function markNotificationsAsRead(
  api: ApiClient,
  workspaceId: string,
  body: MarkNotificationsAsReadInput,
): Promise<void> {
  await api.post<void, MarkNotificationsAsReadInput>(
    apiRoutes.workspaces.notifications.markAsRead(workspaceId),
    body,
  );
}
