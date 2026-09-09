import {
  Eye,
  Heart,
  Link2,
  SquarePen,
  Trash,
  CalendarIcon,
  EyeIcon,
  FileTextIcon,
} from "lucide-react";
import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fa";
import { useDevice } from "~/hooks/use-device";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Activity } from "react";
import ConfirmDialog from "../ui/confirm-dialog";
import { cn } from "~/lib/utils";
import type { Changelog, ChangelogTag } from "~/types";
import { useFetcher, useNavigate } from "react-router";
import { useActionAlert } from "~/hooks/use-action-alert";
import InfoCard from "../ui/info-card";
import { RippleButton } from "../ui/animate-ui/buttons/ripple";
import { Spinner } from "../ui/spinner";
import { useCopyToClipboard } from "~/hooks/use-copy-to-clipboard";
import ChangelogBadge from "../ui/changelog-badge";

dayjs.extend(relativeTime);
dayjs.locale("fa");

interface ChangelogCardProps {
  changelog: Changelog;
  changelogTags: ChangelogTag[];
  onEdit?: () => void;
  isAdmin?: boolean;
  isAuthenticated?: boolean;
  onRequireAuth?: () => void;
  isPortal?: boolean;
}

export default function ChangelogCard({
  changelog,
  changelogTags,
  onEdit,
  isAdmin = false,
  isAuthenticated = true,
  onRequireAuth,
  isPortal = false,
}: Readonly<ChangelogCardProps>) {
  const deleteFetcher = useFetcher();
  const likeFetcher = useFetcher();
  useActionAlert(likeFetcher.data);
  useActionAlert(deleteFetcher.data);
  const { isDesktop } = useDevice();
  const { copy } = useCopyToClipboard();
  const navigate = useNavigate();

  const {
    id,
    createdAt,
    tagIds,
    title,
    content,
    viewsCount,
    isLiked,
    likesCount,
    link,
  } = changelog;

  const isLiking = likeFetcher.state !== "idle";

  const stripHtml = (html: string): string => {
    const parts = html.split("<");
    return parts
      .map((part, i) => {
        if (i === 0) return part;
        const gtIndex = part.indexOf(">");
        return gtIndex === -1 ? "" : part.slice(gtIndex + 1);
      })
      .join(" ");
  };

  const cleanText = stripHtml(String(content))
    .split(/\s/)
    .filter(Boolean)
    .join(" ")
    .trim();

  const description =
    cleanText.length > 200 ? `${cleanText.substring(0, 200)}...` : cleanText;

  const handleDelete = async () => {
    deleteFetcher.submit(
      { changelogId: id },
      {
        method: "DELETE",
        action: "/proxy/changelogs",
      },
    );
  };

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      onRequireAuth?.();
      return;
    }

    likeFetcher.submit(
      { changelogId: changelog.id, isPortal },
      {
        method: changelog.isLiked ? "DELETE" : "POST",
        action: "/proxy/changelogs/toggle-like",
      },
    );
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-border/50 bg-linear-to-br from-background to-background/80">
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-indigo-600 transition-all duration-300 group-hover:h-1.5" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <Activity mode={isAdmin ? "visible" : "hidden"}>
            <div className="flex items-center">
              <IconButton
                icon={SquarePen}
                size={isDesktop ? "default" : "sm"}
                onClick={onEdit}
                title="ویرایش"
                aria-label="ویرایش آیتم"
              />

              <ConfirmDialog
                title={`آیا از حذف گزارش تغییرات «${title}» مطمئن هستید؟`}
                description="این اقدام گزارش تغییرات را به طور دائم حذف می‌کند. آیا ادامه می‌دهید؟"
                confirmText="حذف گزارش تغییرات"
                onConfirm={handleDelete}
                isLoading={deleteFetcher.state !== "idle"}
              >
                <IconButton
                  icon={Trash}
                  color={[220, 38, 38]}
                  title="حذف گزارش تغییرات"
                  aria-label={`حذف گزارش تغییرات ${title}`}
                />
              </ConfirmDialog>
            </div>
          </Activity>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          {tagIds.map((tagId) => {
            const tag = changelogTags.find((t) => t.id === tagId);
            if (!tag) return null;
            return (
              <ChangelogBadge key={tag.id} name={tag.name} icon={tag.icon} />
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-4">
        <div className="space-y-2">
          <CardTitle className="text-xl font-bold leading-tight line-clamp-1">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-sm text-muted-foreground line-clamp-3">
              {description}
            </CardDescription>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <InfoCard
            icon={<CalendarIcon className="w-3.5 h-3.5" />}
            label="تاریخ ایجاد"
            value={dayjs(createdAt).format("YYYY/MM/DD")}
          />
          <InfoCard
            icon={<CalendarIcon className="w-3.5 h-3.5" />}
            label="تعداد پسندها"
            value={String(likesCount)}
          />
          <InfoCard
            icon={<EyeIcon className="w-3.5 h-3.5" />}
            label="تعداد بازدید"
            value={String(viewsCount || 0)}
            highlight
          />
          <InfoCard
            icon={<FileTextIcon className="w-3.5 h-3.5" />}
            label="تعداد تگ‌ها"
            value={String(tagIds.length)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 w-full">
          <RippleButton
            variant="outline"
            onClick={handleToggleLike}
            disabled={isLiking}
            className={cn(
              "gap-2 transition-all duration-200 hover:shadow-sm",
              isLiked && "border-primary/30 bg-primary/5",
            )}
          >
            {isLiking ? (
              <Spinner />
            ) : (
              <>
                <Heart
                  className={cn(
                    "size-4 transition-all duration-300",
                    isLiked
                      ? "fill-rose-500 text-rose-500 scale-110"
                      : "text-muted-foreground",
                  )}
                />
                <span className="font-medium">
                  {isLiked ? "پسندیدم" : "پسندیدن"}
                </span>
              </>
            )}
          </RippleButton>

          <RippleButton
            variant="secondary"
            className="flex-1 gap-2 border-2 hover:bg-muted/50 transition-all duration-300"
            onClick={() => copy(link)}
          >
            <Link2 />
            کپی لینک
          </RippleButton>
        </div>

        <RippleButton
          variant="default"
          className="w-full max-w-md mx-auto gap-2"
          onClick={() => navigate(`/changelogs/${changelog.id}`)}
        >
          <Eye className="size-4" />
          مشاهده جزئیات
        </RippleButton>
      </CardFooter>
    </Card>
  );
}
