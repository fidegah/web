import { Edit, Trash2, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/animate-ui/radix/dropdown-menu";
import { Button } from "~/components/ui/button";

interface RoadmapActionsProps {
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export default function RoadmapActions({
  onEditClick,
  onDeleteClick,
}: Readonly<RoadmapActionsProps>) {
  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="size-9 rounded-xl">
          <Settings className="size-4 text-zinc-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 rounded-xl">
        <DropdownMenuItem
          onClick={onEditClick}
          className="gap-2 cursor-pointer"
        >
          <Edit className="size-4" />
          <span>ویرایش نقشه‌راه</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onDeleteClick}
          className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
        >
          <Trash2 className="size-4 text-current" />
          <span>حذف نقشه‌راه</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
