import type { ApiClient } from "~/context";
import type { Announcement } from "~/types";
import { CACHE_KEYS, getOrSetCache } from "~/lib/cache.server";
import { apiRoutes } from "~/lib/api/routes";

export async function getAnnouncements(api: ApiClient, page: string) {
  const { data, pagination } = await getOrSetCache(
    `${CACHE_KEYS.ANNOUNCEMENTS}:${page}`,
    () =>
      api.get<Announcement[]>(apiRoutes.announcements.base, {
        params: {
          page,
        },
      }),
  );

  return {
    data,
    pagination,
  };
}

export async function markAnnouncementAsViewed(
  api: ApiClient,
  announcementId: string,
): Promise<void> {
  await api.post(apiRoutes.announcements.view(announcementId));
}
