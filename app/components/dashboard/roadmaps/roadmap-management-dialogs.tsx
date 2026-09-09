import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import type { CreateResponse, Roadmap } from "~/types";
import Input from "~/components/ui/input-custom";
import { useActionAlert } from "~/hooks/use-action-alert";
import ConfirmDialog from "~/components/ui/confirm-dialog";
import SubmitButton from "~/components/ui/submit-button";
import { RippleButton } from "~/components/ui/animate-ui/buttons/ripple";

interface RoadmapManagementDialogsProps {
  roadmap: Roadmap;
  isOpenEdit: boolean;
  setIsOpenEdit: (open: boolean) => void;
  isOpenDelete: boolean;
  setIsOpenDelete: (open: boolean) => void;
  onRoadmapRename: (id: string, newName: string) => void;
  onRoadmapDelete: (id: string) => void;
}

export default function RoadmapManagementDialogs({
  roadmap,
  isOpenEdit,
  setIsOpenEdit,
  isOpenDelete,
  setIsOpenDelete,
  onRoadmapRename,
  onRoadmapDelete,
}: Readonly<RoadmapManagementDialogsProps>) {
  const [roadmapName, setRoadmapName] = useState(roadmap?.name ?? "");
  const fetcher = useFetcher<CreateResponse>();
  const lastMethodRef = useRef<"PATCH" | "DELETE" | null>(null);

  useActionAlert(fetcher.data);

  const isLoading = fetcher.state !== "idle";

  useEffect(() => {
    if (roadmap?.name) {
      setRoadmapName(roadmap.name);
    }
  }, [roadmap?.name, isOpenEdit]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.status === "OK") {
      if (lastMethodRef.current === "PATCH") {
        onRoadmapRename(roadmap.id, roadmapName.trim());
        setIsOpenEdit(false);
      } else if (lastMethodRef.current === "DELETE") {
        onRoadmapDelete(roadmap.id);
        setIsOpenDelete(false);
      }
      lastMethodRef.current = null;
    }
  }, [
    fetcher.state,
    fetcher.data,
    roadmap?.id,
    roadmapName,
    setIsOpenEdit,
    setIsOpenDelete,
    onRoadmapRename,
    onRoadmapDelete,
  ]);

  if (!roadmap) return null;

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = roadmapName.trim();
    if (!trimmedName || trimmedName === roadmap.name) return;

    lastMethodRef.current = "PATCH";

    const formData = new FormData();
    formData.append("roadmapId", roadmap.id);
    formData.append("name", trimmedName);

    fetcher.submit(formData, {
      method: "PATCH",
      action: "/proxy/roadmaps",
    });
  };

  const handleDelete = () => {
    lastMethodRef.current = "DELETE";
    fetcher.submit(
      { roadmapId: roadmap.id },
      {
        method: "DELETE",
        action: "/proxy/roadmaps",
      },
    );
  };

  return (
    <>
      <Dialog open={isOpenEdit} onOpenChange={setIsOpenEdit}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>ویرایش نقشه‌راه</DialogTitle>
            <DialogDescription>
              نام جدیدی برای نقشه‌راه خود انتخاب کنید.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              label="نام جدید نقشه‌راه"
              id="name"
              name="name"
              placeholder="نام‌ جدید نقشه‌راه را وارد نمایید."
              value={roadmapName}
              onChange={(e) => setRoadmapName(e.target.value)}
            />

            <DialogFooter className="gap-2">
              <SubmitButton
                isLoading={isLoading}
                label="ذخیره تغییرات"
                isDisabled={
                  isLoading ||
                  roadmapName.trim() === roadmap.name ||
                  !roadmapName.trim()
                }
                className="lg:col-span-2 lg:w-1/4"
              />
              <RippleButton
                type="button"
                variant="outline"
                onClick={() => setIsOpenEdit(false)}
                disabled={isLoading}
              >
                انصراف
              </RippleButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        title={`آیا از حذف نقشه‌راه «${roadmap.name}» مطمئن هستید؟`}
        description="این اقدام نقشه‌راه را به طور دائم حذف می‌کند. آیا ادامه می‌دهید؟"
        confirmText="حذف نقشه‌راه"
        onConfirm={handleDelete}
        isLoading={isLoading && lastMethodRef.current === "DELETE"}
        open={isOpenDelete}
        onOpenChange={setIsOpenDelete}
      />
    </>
  );
}
