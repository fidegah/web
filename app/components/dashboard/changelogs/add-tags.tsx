import {
  Bug,
  Palette,
  Pencil,
  Plus,
  Rocket,
  ShieldCheck,
  Sparkles,
  Trash,
  TriangleAlert,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { IconButton } from "~/components/ui/animate-ui/buttons/icon";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/animate-ui/radix/dropdown-menu";
import { Badge } from "~/components/ui/badge";
import { getTagIcon } from "~/lib/changelog-tag-icons";
import type { ChangelogTag } from "~/types";

interface AddTagsProps {
  tags: ChangelogTag[];
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function AddTags({
  tags,
  selectedTags,
  setSelectedTags,
}: Readonly<AddTagsProps>) {
  return (
    <div className="relative w-full border rounded-md p-3 gap-3 flex items-center">
      <span className="absolute -top-3 right-3 bg-white dark:bg-[#1f1f1f] px-2 text-muted-foreground text-xs md:text-sm">
        اضافه یا حذف تگ‌ها
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            icon={selectedTags.length > 0 ? Pencil : Plus}
            title={selectedTags.length > 0 ? "ویرایش تگ‌ها" : "افزودن تگ"}
            aria-label={selectedTags.length > 0 ? "ویرایش تگ‌ها" : "افزودن تگ"}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" dir="rtl">
          <DropdownMenuLabel>تگ‌ها</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {tags.map((item) => {
            const Icon = getTagIcon(item.icon);
            return (
              <DropdownMenuCheckboxItem
                key={item.id}
                checked={selectedTags.includes(item.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedTags([...selectedTags, item.id]);
                  } else {
                    setSelectedTags(
                      selectedTags.filter((id) => id !== item.id),
                    );
                  }
                }}
              >
                <Icon className="size-4 ml-2 text-blue-800 dark:text-blue-400" />
                {item.name}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar">
        {selectedTags.length > 0 ? (
          selectedTags.map((id) => {
            const tag = tags.find((item) => item.id === id);
            if (!tag) return null;
            const Icon = getTagIcon(tag.icon);
            return (
              <Badge
                key={id}
                className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-300 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1.5"
              >
                <Icon className="size-3.5" />
                {tag.name}
              </Badge>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">
            هیچ تگی انتخاب نشده است.
          </p>
        )}
      </div>
    </div>
  );
}
