import { Activity } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import CellEditableRenderer from "./cell-editable-renderer";
import type {
  CreateResponse,
  PostStatus,
  RoadmapFactor,
  RoadmapItem,
} from "~/types";
import { useFetcher } from "react-router";
import { useActionAlert } from "~/hooks/use-action-alert";
import { Trash2 } from "lucide-react";
import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import ConfirmDialog from "~/components/ui/confirm-dialog";
import { EtaEditableCell } from "./eta-editable-cell";

interface RoadmapMatrixTableProps {
  columns: RoadmapFactor[];
  items: RoadmapItem[];
  postStatuses: PostStatus[];
}

export default function RoadmapMatrixTable({
  columns,
  items,
  postStatuses,
}: Readonly<RoadmapMatrixTableProps>) {
  const fetcher = useFetcher<CreateResponse<RoadmapItem>>();
  useActionAlert(fetcher.data);

  const isLoading = fetcher.state !== "idle";

  const updatingItemId = fetcher.formData?.get("itemId") ?? null;

  const handleCellChange = (
    itemId: string,
    columnId: string | "eta",
    newValue: string | number | boolean,
  ) => {
    fetcher.submit(
      {
        itemId,
        eta: columnId === "eta" ? newValue : null,
        factorId: columnId,
        factorValue: newValue,
      },
      {
        method: "PATCH",
        action: "/proxy/roadmaps/items",
      },
    );
  };

  const handleDeleteItem = (itemId: string) => {
    fetcher.submit(
      { itemId },
      {
        method: "DELETE",
        action: "/proxy/roadmaps/items",
      },
    );
  };

  const impactColumns = columns.filter((col) => !col.isEffort);
  const effortColumns = columns.filter((col) => col.isEffort);

  return (
    <div
      className={cn(
        "w-full rounded-xl border border-border bg-card shadow-md overflow-hidden relative transition-all duration-300",
        isLoading && "pointer-events-none",
      )}
    >
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-l from-blue-500 via-indigo-500 to-emerald-500 animate-pulse z-50" />
      )}

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40 border-b">
            <TableHead
              colSpan={4}
              className="text-center border-l font-bold text-foreground text-sm py-4"
            >
              مشخصات پست
            </TableHead>
            <TableHead
              colSpan={impactColumns.length + 1}
              className="text-center border-l font-extrabold text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 dark:bg-emerald-950/30 py-4"
            >
              فاکتورهای تاثیر (صورت کسر)
            </TableHead>

            <TableHead
              colSpan={effortColumns.length > 0 ? effortColumns.length : 1}
              className="text-center border-l font-extrabold text-sm text-destructive bg-destructive/5 dark:bg-destructive/15 py-4"
            >
              فاکتورهای هزینه (مخرج کسر)
            </TableHead>
            <TableHead
              colSpan={2}
              className="text-center font-extrabold text-sm text-blue-600 dark:text-blue-400 bg-blue-500/10 dark:bg-blue-950/20 py-4"
            >
              خروجی ارزیابی
            </TableHead>
          </TableRow>

          <TableRow className="border-b bg-muted/20">
            <TableHead className="w-12 text-center sticky right-0 bg-muted/20 z-30 h-14 border-l" />

            <TableHead className="font-semibold text-right text-sm text-muted-foreground h-14">
              عنوان
            </TableHead>
            <TableHead className="font-semibold text-right text-sm text-muted-foreground h-14">
              بخش
            </TableHead>
            <TableHead className="font-semibold text-center text-sm text-muted-foreground border-l h-14 w-24">
              وضعیت
            </TableHead>

            {impactColumns.map((col) => (
              <TableHead
                key={col.id}
                className="text-center font-semibold text-sm text-emerald-800 dark:text-emerald-400 h-14"
              >
                {col.name}
              </TableHead>
            ))}

            <TableHead className="text-center font-semibold text-sm text-emerald-800 dark:text-emerald-400 border-l h-14">
              رأی‌ها
            </TableHead>

            <Activity mode={effortColumns.length > 0 ? "visible" : "hidden"}>
              {effortColumns.map((col, index) => (
                <TableHead
                  key={col.id}
                  className={cn(
                    "text-center font-semibold text-sm text-destructive/90 dark:text-destructive h-14",
                    index === effortColumns.length - 1 ? "border-l" : "",
                  )}
                >
                  {col.name}
                </TableHead>
              ))}
            </Activity>

            <Activity mode={effortColumns.length === 0 ? "visible" : "hidden"}>
              <TableHead className="text-center text-xs text-muted-foreground italic h-14 border-l">
                فاکتوری ثبت نشده
              </TableHead>
            </Activity>

            <TableHead className="text-center font-semibold text-sm text-muted-foreground h-14">
              زمان تحویل
            </TableHead>
            <TableHead className="text-center font-bold text-sm text-blue-600 dark:text-blue-400 h-14">
              امتیاز
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item) => {
            const isRowUpdating = isLoading && updatingItemId === item.id;

            return (
              <TableRow
                key={item.id}
                className={cn(
                  "border-b last:border-0 transition-all duration-200",
                  isRowUpdating
                    ? "bg-blue-500/4 dark:bg-blue-500/8 animate-pulse"
                    : "hover:bg-muted/30 dark:hover:bg-zinc-900/40",
                )}
              >
                <TableCell className="w-12 text-center py-3 align-middle sticky right-0 bg-card transition-colors z-20 border-l">
                  <ConfirmDialog
                    title="حذف پست از نقشه‌راه"
                    description="آیا از حذف این پست از نقشه‌راه مطمئن هستید؟ این عمل قابل بازگشت نخواهد بود."
                    confirmText="بله، حذف شود"
                    onConfirm={() => handleDeleteItem(item.id)}
                    isLoading={isLoading && fetcher.formMethod === "DELETE"}
                  >
                    <IconButton
                      icon={Trash2}
                      color={[220, 38, 38]}
                      title="حذف از نقشه‌راه"
                      aria-label={`حذف پست ${item.title} از نقشه‌راه`}
                    />
                  </ConfirmDialog>
                </TableCell>

                <TableCell className="font-semibold text-right max-w-xs text-base text-foreground py-3 truncate">
                  {item.title}
                </TableCell>
                <TableCell className="text-muted-foreground text-right text-sm py-5">
                  {item.board}
                </TableCell>
                <TableCell className="border-l text-center font-medium text-sm text-foreground py-3">
                  {
                    postStatuses.find((status) => status.id === item.statusId)
                      ?.label
                  }
                </TableCell>

                {impactColumns.map((col) => {
                  const factorValue =
                    item.factorValues?.[col.id] ??
                    item.factorValues?.[col.name] ??
                    0;

                  return (
                    <TableCell
                      key={col.id}
                      className="text-center py-3 align-middle"
                    >
                      {col.source === "built_in" ? (
                        <span className="font-semibold text-sm text-foreground">
                          {factorValue}
                        </span>
                      ) : (
                        <CellEditableRenderer
                          value={factorValue}
                          type={col.type}
                          isEffort={false}
                          onChange={(newValue) =>
                            handleCellChange(item.id, col.id, newValue)
                          }
                        />
                      )}
                    </TableCell>
                  );
                })}

                <TableCell className="text-center font-bold text-base text-emerald-600 dark:text-emerald-400 border-l bg-emerald-500/5 dark:bg-emerald-950/10 py-5">
                  {item.votes}
                </TableCell>

                <Activity
                  mode={effortColumns.length > 0 ? "visible" : "hidden"}
                >
                  {effortColumns.map((col, index) => {
                    const factorValue =
                      item.factorValues?.[col.id] ??
                      item.factorValues?.[col.name] ??
                      0;

                    return (
                      <TableCell
                        key={col.id}
                        className={cn(
                          "text-center py-3 align-middle",
                          index === effortColumns.length - 1 ? "border-l" : "",
                        )}
                      >
                        {col.source === "built_in" ? (
                          <span className="font-semibold text-sm text-foreground">
                            {factorValue}
                          </span>
                        ) : (
                          <CellEditableRenderer
                            value={factorValue}
                            type={col.type}
                            isEffort={true}
                            onChange={(newValue) =>
                              handleCellChange(item.id, col.id, newValue)
                            }
                          />
                        )}
                      </TableCell>
                    );
                  })}
                </Activity>

                <Activity
                  mode={effortColumns.length === 0 ? "visible" : "hidden"}
                >
                  <TableCell className="text-center text-muted-foreground border-l py-3">
                    —
                  </TableCell>
                </Activity>

                <TableCell className="text-center py-3 align-middle">
                  <EtaEditableCell
                    initialValue={item.eta || "—"}
                    onSave={(newValue) =>
                      handleCellChange(item.id, "eta", newValue)
                    }
                  />
                </TableCell>

                <TableCell className="text-center font-extrabold text-base text-blue-600 dark:text-blue-400 bg-blue-500/5 dark:bg-blue-950/10 py-3">
                  {item.score}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
