import { CalendarDays, Newspaper } from "lucide-react";
import { PageHeader } from "~/components/ui/page-header";
import type { Route } from "./+types/announcements";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { ERROR_CODE } from "~/constants/errors";
import { data, useFetcher } from "react-router";
import { Activity } from "react";
import { DataEmptyState } from "~/components/ui/empty-state";
import { cn } from "~/lib/utils";
import dayjs from "dayjs";
import jalaliday from "jalali-plugin-dayjs";
import { messageTypeConfig } from "~/constants/message-types";
import { SEO_CONFIG } from "~/constants/seo";
import { CustomPagination } from "~/components/ui/custom-pagination";
import { getAnnouncements } from "~/services/announcement.service";
import { apiClientContext } from "~/context";

dayjs.extend(jalaliday);
dayjs.locale("fa");

export function meta() {
  return [{ title: SEO_CONFIG.dashboard.home.title }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
  const api = context.get(apiClientContext);
  const url = new URL(request.url);

  const pageParam = url.searchParams.get("page") || "1";

  try {
    const { data, pagination } = await getAnnouncements(api, pageParam);

    return { announcements: { data, pagination } };
  } catch (error) {
    console.error("Failed to fetch announcements from API:", error);

    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export default function Announcements({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher();
  const { announcements } = loaderData;

  const isAnnouncementsEmpty =
    !announcements?.data || announcements.data.length === 0;

  const markAsRead = async (announcementId: number) => {
    fetcher.submit(
      { announcementId },
      {
        method: "POST",
        action: "/proxy/announcements/view",
        defaultShouldRevalidate: false,
      },
    );
  };

  return (
    <div className="w-full h-full flex flex-col p-3">
      <PageHeader
        icon={Newspaper}
        title="اخبار و اطلاعیه ها"
        description="در این بخش، تمام اخبار مهم، اطلاعیه‌های رسمی و به‌روزرسانی‌های وبسایت را دنبال کنید."
      />

      <Activity mode={isAnnouncementsEmpty ? "visible" : "hidden"}>
        <DataEmptyState
          title="اطلاعیه‌ای موجود نیست"
          description="در حال حاضر هیچ اطلاعیه رسمی منتشر نشده است. لطفاً در آینده مجدداً مراجعه فرمایید."
          className="h-full"
        />
      </Activity>

      <Activity mode={isAnnouncementsEmpty ? "hidden" : "visible"}>
        <Accordion
          type="single"
          collapsible
          className="mt-6 flex flex-col gap-6"
        >
          {announcements.data.map((announcement) => {
            const createdAt = dayjs(announcement.createdAt)
              .calendar("jalali")
              .format("D MMMM YYYY");

            const {
              icon: Icon,
              color,
              bg,
            } = messageTypeConfig[announcement.type];

            return (
              <AccordionItem
                key={announcement.id}
                value={String(announcement.id)}
                className="px-3 bg-card border rounded-lg"
                onClick={() =>
                  announcement.isViewed ? null : markAsRead(announcement.id)
                }
              >
                <AccordionTrigger className="cursor-pointer">
                  <div className="flex justify-between w-full items-center">
                    <div className="flex items-start gap-4">
                      <div className={cn("p-2 rounded-lg", bg, color)}>
                        <Icon className="size-5" />
                      </div>

                      <div className="flex flex-col items-start">
                        <b className="lg:text-base">{announcement.title}</b>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <CalendarDays className="h-4 w-4" />
                          <span>{createdAt}</span>
                        </div>
                      </div>
                    </div>

                    <Activity
                      mode={announcement.isViewed ? "hidden" : "visible"}
                    >
                      <span className="p-1 text-xs rounded-full bg-green-500/10 dark:bg-green-400/20 text-green-600 dark:text-green-200 border border-green-500/20 dark:border-green-300/40">
                        خوانده نشده
                      </span>
                    </Activity>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="border-t border-gray-100 dark:border-gray-700/50 pt-4"></div>
                  {announcement.content}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </Activity>
      <CustomPagination pagination={announcements.pagination} />
    </div>
  );
}
