import { Activity, useState } from "react";
import { data, useFetcher } from "react-router";
import { ClockFading, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import jalaliday from "jalali-plugin-dayjs";
import { RippleButton } from "~/components/ui/animate-ui/buttons/ripple";
import PortalDialog from "~/components/website/portal/dialog";
import PortalPollInfo from "~/components/website/portal/poll/info";
import PollOption from "~/components/website/portal/poll/option";
import { useDevice } from "~/hooks/use-device";
import { getCanonicalUrl, SEO_CONFIG } from "~/constants/seo";
import { ERROR_CODE } from "~/constants/errors";
import type { Route } from "./+types/poll";
import { useActionAlert } from "~/hooks/use-action-alert";
import { Spinner } from "~/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import ConfirmDialog from "~/components/ui/confirm-dialog";
import { useOtpAuthDialog } from "~/contexts/otp-auth-dialog-context";
import { apiClientContext } from "~/context";
import { isAuthenticated } from "~/lib/auth-utils.server";
import {
  getPortalCurrentWorkspace,
  getPortalPoll,
} from "~/services/portal.service";

dayjs.extend(jalaliday);

export async function loader({ request, params, context }: Route.LoaderArgs) {
  const { pollId } = params;
  const api = context.get(apiClientContext);
  const isAuth = await isAuthenticated(request);

  try {
    const workspace = await getPortalCurrentWorkspace(api);
    const poll = await getPortalPoll(api, pollId);

    return {
      workspace,
      poll,
      isAuthenticated: isAuth,
    };
  } catch (err) {
    throw data(null, {
      status: 500,
      statusText: ERROR_CODE.GENERAL.FAILED_TO_FETCH_DATA,
    });
  }
}

export function meta({ loaderData, location }: Route.MetaArgs) {
  const { workspace, poll } = loaderData;
  const seo = SEO_CONFIG.portal.pollDetail(workspace.name, poll.title);
  const canonicalUrl = getCanonicalUrl(location.pathname);

  return [
    { title: seo.title },
    { name: "description", content: seo.description },
    { property: "og:title", content: seo.title },
    { property: "og:description", content: seo.description },
    { tagName: "link", rel: "canonical", href: canonicalUrl },
  ];
}

export default function PortalPoll({ loaderData }: Route.ComponentProps) {
  const submitFetcher = useFetcher();
  const deleteFetcher = useFetcher();
  useActionAlert(submitFetcher.data);
  useActionAlert(deleteFetcher.data);
  const { isMobile } = useDevice();
  const { openAuthDialog } = useOtpAuthDialog();

  const { poll, isAuthenticated } = loaderData;
  const { title, description, options, status, endAt, isVoted, type } = poll;

  const [isOpenPollInfoDialog, setIsOpenPollInfoDialog] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(() => {
    if (!poll.options) return [];

    return poll.options
      .filter((opt) => opt.isVoted && opt.userRank !== null)
      .sort((a, b) => (a.userRank as number) - (b.userRank as number))
      .map((opt) => opt.id);
  });

  const handleSetSelectedOptions: typeof setSelectedOptions = (value) => {
    if (!isAuthenticated) {
      openAuthDialog();
      return;
    }
    setSelectedOptions(value);
  };

  const isSubmitting = submitFetcher.state !== "idle";
  const isDeleting = deleteFetcher.state !== "idle";
  const isActive = status === "active";
  const isExpired = status === "expired";

  const hasChangedSelection = () => {
    if (!options) return false;

    const initialVotedOptions = options
      .filter((opt) => opt.isVoted)
      .sort((a, b) => (a.userRank || 0) - (b.userRank || 0));

    const initialVotedIds = initialVotedOptions.map((opt) => opt.id);

    if (initialVotedIds.length !== selectedOptions.length) return true;

    if (type === "ranked") {
      return !selectedOptions.every(
        (id, index) => id === initialVotedIds[index],
      );
    }

    return !selectedOptions.every((id) => initialVotedIds.includes(id));
  };

  const isShowSubmitButton =
    isActive &&
    selectedOptions.length > 0 &&
    (!isVoted || hasChangedSelection());

  const handleSubmitVote = async () => {
    if (selectedOptions.length === 0) return;

    if (!isAuthenticated) {
      openAuthDialog();
      return;
    }

    const formData = new FormData();
    formData.append("pollId", String(poll.id));
    selectedOptions.forEach((optionId) => {
      formData.append("optionId", optionId.toString());
    });

    submitFetcher.submit(formData, {
      method: "POST",
      action: "/proxy/polls/vote",
    });
  };

  const handleDeleteVote = () => {
    deleteFetcher.submit(
      { pollId: poll.id },
      {
        method: "DELETE",
        action: "/proxy/polls/vote",
      },
    );
  };

  const formattedEndDate = endAt
    ? dayjs(endAt).locale("fa").format("YYYY/M/D")
    : "-";

  const getButtonText = () => {
    if (isSubmitting) return "در حال ثبت";
    if (isVoted) return "ثبت تغییرات";
    return "ثبت رای";
  };

  return (
    <div className="w-full h-full flex gap-6 bg-background p-3 md:px-6 lg:px-10">
      <div className="w-full flex md:flex-2 flex-col gap-6">
        <Activity mode={isExpired ? "visible" : "hidden"}>
          <Card>
            <CardContent className="flex p-4 gap-3 items-center">
              <ClockFading className="size-5 shrink-0" />
              <p className="text-xs lg:text-sm font-medium">
                این نظرسنجی در تاریخ {formattedEndDate} به پایان رسیده است.
              </p>
            </CardContent>
          </Card>
        </Activity>

        <Card>
          <CardHeader>
            <CardTitle className="lg:text-lg">{title}</CardTitle>
            <CardDescription className="lg:text-base">
              {description}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-6">
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <b className="text-sm lg:text-base tracking-tight text-foreground/80">
                  گزینه‌ها
                </b>

                <Activity mode={isActive && isVoted ? "visible" : "hidden"}>
                  <ConfirmDialog
                    title="آیا از حذف کامل رای خود اطمینان دارید؟"
                    description="این اقدام رأی شما را به طور کامل حذف می‌کند و قابل بازگشت نیست. شما می‌توانید پس از حذف، دوباره رأی جدیدی ثبت کنید."
                    confirmText="حذف رأی‌"
                    onConfirm={handleDeleteVote}
                    isLoading={isDeleting}
                  >
                    <button
                      disabled={isDeleting}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50 rounded-xl transition-all duration-200 border border-red-200/50 dark:border-red-900/30 active:scale-95 disabled:opacity-50 cursor-pointer"
                      title="پاک کردن کامل رای"
                    >
                      <Trash2 className="size-3.5" />
                      <span className="cursor-pointer">پس گرفتن رای</span>
                    </button>
                  </ConfirmDialog>
                </Activity>
              </div>

              {options?.map((option) => (
                <PollOption
                  key={option.id}
                  poll={poll}
                  option={option}
                  isActive={isActive}
                  selectedOptions={selectedOptions}
                  setSelectedOptions={handleSetSelectedOptions}
                />
              ))}
            </div>

            <Activity mode={isShowSubmitButton ? "visible" : "hidden"}>
              <RippleButton
                size={isMobile ? "sm" : "default"}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-xl md:w-1/3 lg:w-1/4 transition-all shadow-md"
                onClick={handleSubmitVote}
                disabled={isSubmitting}
              >
                {isSubmitting && <Spinner />}
                <span>{getButtonText()}</span>
              </RippleButton>
            </Activity>
          </CardContent>
        </Card>
      </div>

      <Card className="hidden md:flex md:flex-1 h-fit">
        <CardHeader>
          <CardTitle>جزئیات نظرسنجی</CardTitle>
          <CardDescription>مشخصات و زمان‌بندی کل</CardDescription>
        </CardHeader>
        <CardContent>
          <PortalPollInfo poll={poll} />
        </CardContent>
      </Card>

      <PortalDialog
        title="جزئیات نظرسنجی"
        description="مشخصات و زمان‌بندی کل"
        isOpen={isOpenPollInfoDialog}
        setIsOpen={setIsOpenPollInfoDialog}
      >
        <div className="pt-4">
          <PortalPollInfo poll={poll} />
        </div>
      </PortalDialog>
    </div>
  );
}
