import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "~/components/ui/button";
import { Sigma } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import type {
  CreateResponse,
  RoadmapFactor,
  Roadmap,
  RoadmapNewFactorState,
} from "~/types";
import { useFetcher } from "react-router";
import RoadmapFactorSection from "./factor-section";
import { useActionAlert } from "~/hooks/use-action-alert";

const WEIGHT_OPTIONS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4];

interface ScoreFormulaDialogProps {
  roadmap: Roadmap;
  factors: RoadmapFactor[];
  setFactors: Dispatch<SetStateAction<RoadmapFactor[]>>;
}

export default function RoadmapScoreFormulaDialog({
  roadmap,
  factors,
  setFactors,
}: Readonly<ScoreFormulaDialogProps>) {
  const addFetcher = useFetcher<CreateResponse<RoadmapFactor>>();
  const updateFetcher = useFetcher<CreateResponse<RoadmapFactor>>();
  const deleteFetcher = useFetcher<CreateResponse<{ id: string }>>();

  useActionAlert(addFetcher.data);
  useActionAlert(updateFetcher.data);
  useActionAlert(deleteFetcher.data);

  useEffect(() => {
    if (addFetcher.data?.status === "OK" && addFetcher.data.data) {
      const newFactor = addFetcher.data.data;
      setFactors((prev) => {
        if (prev.some((f) => f.id === newFactor.id)) return prev;
        return [...prev, newFactor];
      });
    }
  }, [addFetcher.data, setFactors]);

  useEffect(() => {
    if (updateFetcher.data?.status === "OK" && updateFetcher.data.data) {
      const updatedFactor = updateFetcher.data.data;
      setFactors((prev) =>
        prev.map((f) => (f.id === updatedFactor.id ? updatedFactor : f)),
      );
    }
  }, [updateFetcher.data, setFactors]);

  useEffect(() => {
    if (deleteFetcher.data?.status === "OK" && deleteFetcher.data.data?.id) {
      const deletedId = deleteFetcher.data.data.id;
      setFactors((prev) => prev.filter((f) => f.id !== deletedId));
    }
  }, [deleteFetcher.data, setFactors]);

  const [newImpact, setNewImpact] = useState<RoadmapNewFactorState>({
    name: "",
    source: "custom",
    type: "0-10",
    weight: 1,
    isEffort: false,
  });
  const [newEffort, setNewEffort] = useState<RoadmapNewFactorState>({
    name: "",
    source: "custom",
    type: "fibonacci",
    weight: 1,
    isEffort: true,
  });

  const handleWeightChange = (id: string, value: number) => {
    setFactors((prev) =>
      prev.map((f) => (f.id === id ? { ...f, weight: value } : f)),
    );

    updateFetcher.submit(
      { factorId: id, weight: value },
      {
        method: "PATCH",
        action: "/proxy/roadmaps/factors",
        defaultShouldRevalidate: false,
      },
    );
  };

  const deleteFactor = (id: string) => {
    deleteFetcher.submit(
      { factorId: id },
      {
        method: "DELETE",
        action: "/proxy/roadmaps/factors",
        defaultShouldRevalidate: false,
      },
    );
  };

  const addFactor = (isEffort: boolean) => {
    const currentForm = isEffort ? newEffort : newImpact;

    if (!currentForm.name.trim()) return;

    const formData = new FormData();
    formData.append("roadmapId", roadmap.id);
    formData.append("name", currentForm.name.trim());
    formData.append("source", currentForm.source);

    if (currentForm.source === "custom" && currentForm.type) {
      formData.append("type", currentForm.type);
    } else if (currentForm.source === "built_in" && currentForm.metric) {
      formData.append("metric", currentForm.metric);
    }

    formData.append("weight", String(currentForm.weight));
    formData.append("isEffort", String(isEffort));

    addFetcher.submit(formData, {
      method: "POST",
      action: "/proxy/roadmaps/factors",
      defaultShouldRevalidate: false,
    });

    if (isEffort) {
      setNewEffort({
        name: "",
        source: "custom",
        type: "fibonacci",
        weight: 1,
        isEffort: true,
      });
    } else {
      setNewImpact({
        name: "",
        source: "custom",
        type: "0-10",
        weight: 1,
        isEffort: false,
      });
    }
  };

  const impactFactors = factors.filter((f) => !f.isEffort);
  const effortFactors = factors.filter((f) => f.isEffort);

  const isAdding = addFetcher.state !== "idle";

  const deletingFactorId =
    deleteFetcher.state !== "idle"
      ? ((deleteFetcher.formData?.get("factorId") as string) ?? null)
      : null;

  const updatingFactorId =
    updateFetcher.state !== "idle"
      ? ((updateFetcher.formData?.get("factorId") as string) ?? null)
      : null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="gap-2 h-9 font-medium border"
        >
          <Sigma className="h-4 w-4 text-primary" />
          فرمول امتیازدهی
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle>فرمول امتیازدهی نقشه‌راه</DialogTitle>
          <DialogDescription>
            وزن فاکتورهای موثر در اولویت‌بندی پست‌ها را تعیین کنید
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <h3 className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
            فاکتورهای تاثیر (صورت کسر / بالا برنده امتیاز)
          </h3>

          <RoadmapFactorSection
            factors={impactFactors}
            weightOptions={WEIGHT_OPTIONS}
            formState={newImpact}
            inputPlaceholder="نام فاکتور تاثیر جدید..."
            containerClassName="bg-emerald-500/30 dark:bg-emerald-950/30 border-emerald-500/20"
            onWeightChange={handleWeightChange}
            onDelete={deleteFactor}
            onFormChange={(updates) =>
              setNewImpact((prev) => ({ ...prev, ...updates }))
            }
            onAdd={() => addFactor(false)}
            updatingId={updatingFactorId}
            deletingId={deletingFactorId}
            isAdding={
              isAdding && addFetcher.formData?.get("isEffort") === "false"
            }
          />
        </div>

        <div className="space-y-4 mt-3">
          <div className="border-b pb-2">
            <h3 className="font-bold text-sm text-destructive">
              فاکتورهای هزینه (مخرج کسر / پایین آورنده امتیاز)
            </h3>
          </div>

          <RoadmapFactorSection
            factors={effortFactors}
            weightOptions={WEIGHT_OPTIONS}
            formState={newEffort}
            inputPlaceholder="نام فاکتور هزینه جدید..."
            containerClassName="bg-destructive/5 border-destructive/10"
            onWeightChange={handleWeightChange}
            onDelete={deleteFactor}
            onFormChange={(updates) =>
              setNewEffort((prev) => ({ ...prev, ...updates }))
            }
            onAdd={() => addFactor(true)}
            updatingId={updatingFactorId}
            deletingId={deletingFactorId}
            isAdding={
              isAdding && addFetcher.formData?.get("isEffort") === "true"
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
