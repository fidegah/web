import { Download } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { RoadmapFactor, RoadmapItem, PostStatus, Roadmap } from "~/types";

interface RoadmapExportButtonProps {
  roadmap: Roadmap;
  columns: RoadmapFactor[];
  items: RoadmapItem[];
  postStatuses: PostStatus[];
}

export default function RoadmapExportButton({
  roadmap,
  columns,
  items,
  postStatuses,
}: Readonly<RoadmapExportButtonProps>) {
  const handleExport = () => {
    const impactColumns = columns.filter((col) => !col.isEffort);
    const effortColumns = columns.filter((col) => col.isEffort);

    const headers = [
      "عنوان",
      "بخش",
      "وضعیت",
      ...impactColumns.map((col) => `${col.name} (تاثیر)`),
      "رأی‌ها",
      ...effortColumns.map((col) => `${col.name} (هزینه)`),
      "زمان تحویل",
      "امتیاز",
    ];

    const rows = items.map((item) => {
      const impactValues = impactColumns.map(
        (col) =>
          item.factorValues?.[col.id] ?? item.factorValues?.[col.name] ?? "",
      );
      const effortValues = effortColumns.map(
        (col) =>
          item.factorValues?.[col.id] ?? item.factorValues?.[col.name] ?? "",
      );

      const statusLabel =
        postStatuses.find((status) => status.id === item.statusId)?.label || "";

      return [
        item.title,
        item.board,
        statusLabel,
        ...impactValues,
        item.votes,
        ...effortValues,
        item.eta || "",
        item.score,
      ];
    });

    const delimiter = ";";

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => {
            const stringValue = String(value ?? "").replaceAll('"', '""');
            if (
              stringValue.includes(delimiter) ||
              stringValue.includes("\n") ||
              stringValue.includes('"')
            ) {
              return `"${stringValue}"`;
            }
            return stringValue;
          })
          .join(delimiter),
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `fidegah-roadmap-${roadmap.name}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="size-9 rounded-xl"
      title="خروجی CSV"
      onClick={handleExport}
    >
      <Download className="size-4 text-muted-foreground" />
    </Button>
  );
}
