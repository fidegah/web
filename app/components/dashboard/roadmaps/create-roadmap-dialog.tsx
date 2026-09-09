import { Milestone } from "lucide-react";
import { useEffect } from "react";
import { useFetcher, useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import ErrorMessage from "~/components/ui/error-message";
import Input from "~/components/ui/input-custom";
import SubmitButton from "~/components/ui/submit-button";
import type { CreateResponse, Roadmap } from "~/types";

interface CreateRoadmapDialogProps {
  open: boolean;
  onOpenChange(open: boolean): void;
}

export default function CreateRoadmapDialog({
  open,
  onOpenChange,
}: Readonly<CreateRoadmapDialogProps>) {
  const fetcher = useFetcher<CreateResponse<Roadmap>>();

  useEffect(() => {
    if (fetcher.state !== "idle" && fetcher.data?.status === "OK") {
      onOpenChange(false);
    }
  }, [fetcher.state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-1/2 min-w-[calc(100%-2rem)] rounded-2xl">
        <DialogHeader>
          <DialogTitle>ایجاد نقشه‌راه جدید</DialogTitle>
          <DialogDescription>
            یک نقشه‌راه جدید برای محصول خود بسازید تا بتوانید فیچرها و
            بازخوردهای کاربران را بر اساس اولویت، ارزش توسعه و زمان‌بندی.
          </DialogDescription>
        </DialogHeader>

        <fetcher.Form
          method="POST"
          action="/proxy/roadmaps"
          className="flex flex-col gap-6"
        >
          <Input
            icon={Milestone}
            id="name"
            label="عنوان نقشه راه"
            placeholder="مثال: برنامه توسعه سال ۱۴۰۵"
          />

          <ErrorMessage data={fetcher.data} />

          <SubmitButton
            label="ایجاد نقشه راه"
            className="lg:col-span-2 lg:w-1/4 mt-3"
            isLoading={fetcher.state !== "idle"}
          />
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
