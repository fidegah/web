import { useState } from "react";
import { Editor } from "@tiptap/react";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { blockTypeToBlockName } from "./block-types";

interface EditorToolbarProps {
  editor: Editor;
  activeBlock: string;
  handleBlockChange: (type: string) => void;
}

export function EditorToolbar({
  editor,
  activeBlock,
  handleBlockChange,
}: Readonly<EditorToolbarProps>) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2 bg-muted/40 p-2 border-b border-border">
      <Select
        open={open}
        onOpenChange={setOpen}
        value={activeBlock}
        onValueChange={handleBlockChange}
        dir="rtl"
      >
        <SelectTrigger className="w-40 h-9 bg-background border-input flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              {blockTypeToBlockName[activeBlock]?.icon}
            </span>
            <span className="text-sm font-medium">
              {blockTypeToBlockName[activeBlock]?.label}
            </span>
          </div>
        </SelectTrigger>

        <SelectContent align="start" className="text-right" dir="rtl">
          {Object.entries(blockTypeToBlockName).map(([key, value]) => (
            <SelectItem
              key={key}
              value={key}
              className="cursor-pointer focus:bg-muted"
            >
              <span className="flex items-center gap-2 text-sm font-medium w-full justify-start">
                <span className="text-muted-foreground">{value.icon}</span>
                <span>{value.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="h-6 w-px bg-border mx-1" />

      <Button
        type="button"
        variant={editor.isActive("bold") ? "default" : "outline"}
        size="icon"
        className="h-8 w-8 transition-all"
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="برجسته"
      >
        <BoldIcon className="size-4" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive("italic") ? "default" : "outline"}
        size="icon"
        className="h-8 w-8 transition-all"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="کج"
      >
        <ItalicIcon className="size-4" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive("underline") ? "default" : "outline"}
        size="icon"
        className="h-8 w-8 transition-all"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="زیرخط"
      >
        <UnderlineIcon className="size-4" />
      </Button>

      <Button
        type="button"
        variant={editor.isActive("strike") ? "default" : "outline"}
        size="icon"
        className="h-8 w-8 transition-all"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="خط‌خوردگی"
      >
        <StrikethroughIcon className="size-4" />
      </Button>
    </div>
  );
}
