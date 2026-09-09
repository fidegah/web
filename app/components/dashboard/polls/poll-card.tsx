import { RippleButton } from "~/components/ui/animate-ui/buttons/ripple";
import type { Poll } from "~/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fa";
import jalaliday from "jalali-plugin-dayjs";
import { cn } from "~/lib/utils";
import ResultPollDialog from "./result-poll-dialog";
import { Activity, useState } from "react";
import { useAlert } from "~/components/alert-context";
import { useFetcher, useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import ConfirmDialog from "../../ui/confirm-dialog";
import {
  ClockIcon,
  PlayIcon,
  Trash2Icon,
  BarChart3Icon,
  VoteIcon,
  CalendarIcon,
  ListChecksIcon,
  UsersIcon,
  HashIcon,
  EyeIcon,
  ClockAlert,
} from "lucide-react";
import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import { useActionAlert } from "~/hooks/use-action-alert";
import InfoCard from "~/components/ui/info-card";

dayjs.extend(relativeTime);
dayjs.locale("fa");
dayjs.extend(jalaliday);
dayjs.calendar("jalali");

interface PollCardProps {
  poll: Poll;
  isAdmin?: boolean;
}

export default function PollCard({
  poll,
  isAdmin = false,
}: Readonly<PollCardProps>) {
  const fetcher = useFetcher();
  useActionAlert(fetcher.data);
  const {
    id,
    title,
    description,
    startAt,
    endAt,
    createdAt,
    type,
    options,
    totalVotes,
  } = poll;

  const pollStatus = poll.status;

  const [isOpenResultPollDialog, setIsOpenResultPollDialog] = useState(false);
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const isDeleting = fetcher.state !== "idle";

  const pollTypeMap = {
    single: "تک گزینه‌ای",
    multiple: "چند گزینه‌ای",
    ranked: "رتبه‌بندی",
  };

  const pollTypeIconMap = {
    single: <HashIcon className="w-3.5 h-3.5" />,
    multiple: <ListChecksIcon className="w-3.5 h-3.5" />,
    ranked: <BarChart3Icon className="w-3.5 h-3.5" />,
  };

  const typeText = pollTypeMap[type];
  const typeIcon = pollTypeIconMap[type] || (
    <HashIcon className="w-3.5 h-3.5" />
  );

  const handleDelete = async () => {
    fetcher.submit(
      { pollId: id },
      { method: "DELETE", action: "/proxy/polls" },
    );
  };

  const isExpired = pollStatus === "expired";

  const getStatusBadge = () => {
    if (isExpired) {
      return {
        text: "پایان یافته",
        icon: <ClockIcon className="w-3.5 h-3.5" />,
        className:
          "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400 border-red-200 dark:border-red-800",
      };
    } else if (pollStatus === "active") {
      return {
        text: "فعال",
        icon: <PlayIcon className="w-3.5 h-3.5" />,
        className:
          "bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400 border-green-200 dark:border-green-800",
      };
    } else {
      return {
        text: "شروع نشده",
        icon: <ClockIcon className="w-3.5 h-3.5" />,
        className:
          "bg-gray-50 text-gray-700 dark:bg-gray-900/50 dark:text-gray-400 border-gray-200 dark:border-gray-700",
      };
    }
  };

  const status = getStatusBadge();

  return (
    <>
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-border/50 bg-linear-to-br from-background to-background/80">
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5",
            isExpired
              ? "bg-linear-to-r from-red-500 to-red-600"
              : "bg-linear-to-r from-green-500 to-emerald-600",
          )}
        />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all",
                  status.className,
                )}
              >
                {status.icon}
                <span>{status.text}</span>
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full bg-muted/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground border border-border/50">
                {typeIcon}
                <span>{typeText}</span>
              </div>
            </div>

            <Activity mode={isAdmin ? "visible" : "hidden"}>
              <ConfirmDialog
                title={`آیا از حذف نظرسنجی «${poll?.title}» مطمئن هستید؟`}
                description="این اقدام نظرسنجی را به طور دائم حذف می‌کند. آیا ادامه می‌دهید؟"
                confirmText="حذف نظرسنجی"
                onConfirm={handleDelete}
                isLoading={isDeleting}
              >
                <IconButton
                  icon={Trash2Icon}
                  color={[220, 38, 38]}
                  title="حذف نظرسنجی"
                  aria-label={`حذف نظرسنجی ${poll?.title}`}
                />
              </ConfirmDialog>
            </Activity>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pb-4">
          <div className="space-y-2">
            <CardTitle className="text-xl font-bold leading-tight line-clamp-1">
              {title}
            </CardTitle>

            {description && (
              <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </CardDescription>
            )}

            {!description && (
              <div
                className="**:opacity-0 **:pointer-events-none"
                aria-hidden="true"
              >
                <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                  <span className="select-none">hidden content for layout</span>
                </CardDescription>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <InfoCard
              icon={<CalendarIcon className="w-3.5 h-3.5" />}
              label="شروع"
              value={dayjs(startAt).format("YYYY/MM/DD")}
            />
            <InfoCard
              icon={<CalendarIcon className="w-3.5 h-3.5" />}
              label="پایان"
              value={dayjs(endAt).format("YYYY/MM/DD")}
            />
            <InfoCard icon={typeIcon} label="نوع" value={typeText} />
            <InfoCard
              icon={<HashIcon className="w-3.5 h-3.5" />}
              label="گزینه‌ها"
              value={String(options.length)}
            />
            <InfoCard
              icon={<UsersIcon className="w-3.5 h-3.5" />}
              label="کل رأی‌ها"
              value={String(totalVotes)}
              highlight
            />
            <InfoCard
              icon={<ClockIcon className="w-3.5 h-3.5" />}
              label="ایجاد شده"
              value={dayjs(createdAt).fromNow()}
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 w-full">
            <RippleButton
              variant="outline"
              size="default"
              className="gap-2 border-2 hover:bg-muted/50 transition-all duration-300"
              onClick={() => {
                poll.totalVotes > 0
                  ? setIsOpenResultPollDialog(true)
                  : showAlert({
                      title: "هنوز هیچ رأی‌ ثبت نشده است.",
                      type: "info",
                    });
              }}
            >
              <EyeIcon className="size-5" />
              مشاهده نتایج
            </RippleButton>

            <RippleButton
              variant="outline"
              size="default"
              className="gap-2 border-2 hover:bg-muted/50 transition-all duration-300"
              onClick={() => navigate(`/polls/${poll.id}`)}
            >
              <EyeIcon className="size-5" />
              مشاهده
            </RippleButton>
          </div>

          <RippleButton
            size="default"
            className="w-full max-w-md mx-auto gap-2 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => navigate(`/polls/${poll.id}`)}
            disabled={isExpired}
          >
            {isExpired ? (
              <ClockAlert className="size-5" />
            ) : (
              <VoteIcon className="size-5" />
            )}
            {isExpired ? "امکان ثبت رأی وجود ندارد." : "ثبت رأی"}
          </RippleButton>
        </CardFooter>
      </Card>

      <ResultPollDialog
        isOpen={isOpenResultPollDialog}
        setIsOpen={setIsOpenResultPollDialog}
        poll={poll}
      />
    </>
  );
}
