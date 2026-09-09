import { useNavigate } from "react-router";
import { Layers, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { Roadmap } from "~/types";

interface RoadmapSwitcherProps {
  roadmaps: Roadmap[];
  currentRoadmapId: string | undefined;
  onCreateClick: () => void;
}

export default function RoadmapSwitcher({
  roadmaps,
  currentRoadmapId,
  onCreateClick,
}: Readonly<RoadmapSwitcherProps>) {
  const navigate = useNavigate();

  const handleValueChange = (value: string) => {
    if (value === "NEW_ROADMAP") {
      onCreateClick();
      return;
    }

    navigate(`/dashboard/roadmaps/${value}`);
  };

  return (
    <Select
      dir="rtl"
      value={String(currentRoadmapId)}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-full h-10 font-semibold bg-background shadow-sm hover:bg-accent/50 transition-colors text-right gap-2 border max-w-50">
        <div className="flex items-center gap-2 truncate">
          <Layers className="size-4 text-primary shrink-0" />
          <SelectValue placeholder="انتخاب نقشه‌راه" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {roadmaps.map((r) => (
          <SelectItem
            key={r.id}
            value={String(r.id)}
            className="text-right font-medium cursor-pointer"
          >
            {r.name}
          </SelectItem>
        ))}

        <SelectSeparator />

        <SelectItem
          value="NEW_ROADMAP"
          className="text-right font-medium cursor-pointer text-muted-foreground"
        >
          <Plus className="size-4" />
          ایجاد نقشه‌راه جدید
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
