import { useState, useEffect, Activity } from "react";
import {
  useEditor,
  EditorContent,
  ReactNodeViewRenderer,
  Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { RocketIcon } from "lucide-react";

import { Skeleton } from "~/components/ui/skeleton";
import { ReactTaskItem } from "./react-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { all, createLowlight } from "lowlight";
import { EditorToolbar } from "./editor-toolbar";
import Input from "../ui/input-custom";
import "./tiptap-theme.css";
import { cn } from "~/lib/utils";

const lowlight = createLowlight(all);

interface TiptapProps {
  content?: string;
  readOnly?: boolean;
  onChange?: (htmlContent: string, title: string) => void;
}

export default function TiptapEditor({
  content = `<h2>خوش آمدید!</h2><p>نوشتن متن خود را از اینجا شروع کنید...</p>`,
  readOnly = false,
  onChange,
}: Readonly<TiptapProps>) {
  const [activeBlock, setActiveBlock] = useState("paragraph");
  const [title, setTitle] = useState("");

  const getCurrentBlockType = (currentEditor: Editor | null): string => {
    if (!currentEditor) return "paragraph";
    if (currentEditor.isActive("heading", { level: 1 })) return "h1";
    if (currentEditor.isActive("heading", { level: 2 })) return "h2";
    if (currentEditor.isActive("heading", { level: 3 })) return "h3";
    if (currentEditor.isActive("taskList")) return "check";
    if (currentEditor.isActive("bulletList")) return "bullet";
    if (currentEditor.isActive("orderedList")) return "number";
    if (currentEditor.isActive("codeBlock")) return "code";
    if (currentEditor.isActive("blockquote")) return "quote";
    return "paragraph";
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class:
            "p-4 rounded-md font-mono text-left block w-full border border-border my-2 ltr selection:bg-zinc-800",
          dir: "ltr",
        },
      }),
      Underline,
      TaskList,
      TaskItem.configure({ nested: true }).extend({
        addNodeView() {
          return ReactNodeViewRenderer(ReactTaskItem);
        },
      }),
    ],
    content: content,
    editable: !readOnly,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "focus:outline-none outline-none min-h-[200px]",
      },
    },
    onUpdate({ editor }) {
      if (onChange) {
        onChange(editor.getHTML(), title);
      }
    },
    onTransaction({ editor }) {
      setActiveBlock(getCurrentBlockType(editor));
    },
    onSelectionUpdate({ editor }) {
      const { selection } = editor.state;
      if (
        selection.empty &&
        editor.isActive("heading") &&
        editor.getText() === ""
      ) {
        editor.commands.setParagraph();
      }
      setActiveBlock(getCurrentBlockType(editor));
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    if (onChange && editor) {
      onChange(editor.getHTML(), title);
    }
  }, [title]);

  if (!editor) {
    return (
      <div
        className={cn(
          "rounded-lg overflow-hidden text-right",
          !readOnly && "border border-border",
        )}
        dir="rtl"
      >
        <Activity mode={readOnly ? "hidden" : "visible"}>
          <div className="flex flex-wrap items-center gap-2 bg-muted/50 p-2 border-b border-border">
            <Skeleton className="h-9 w-40 rounded-md" />
            <div className="h-6 w-px bg-border mx-1"></div>
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </Activity>

        <div className="p-4 space-y-3 min-h-75">
          <Skeleton className="h-7 w-1/4 rounded-md" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
        </div>
      </div>
    );
  }

  const handleBlockChange = (type: string) => {
    const commands = editor.chain();
    if (
      editor.isActive("taskList") ||
      editor.isActive("bulletList") ||
      editor.isActive("orderedList")
    ) {
      commands.clearNodes();
    }

    switch (type) {
      case "h1":
        commands.toggleHeading({ level: 1 }).run();
        break;
      case "h2":
        commands.toggleHeading({ level: 2 }).run();
        break;
      case "h3":
        commands.toggleHeading({ level: 3 }).run();
        break;
      case "bullet":
        commands.toggleBulletList().run();
        break;
      case "number":
        commands.toggleOrderedList().run();
        break;
      case "check":
        commands.toggleTaskList().run();
        break;
      case "code":
        commands.toggleCodeBlock().run();
        break;
      case "quote":
        commands.toggleBlockquote().run();
        break;
      default:
        commands.setParagraph().run();
        break;
    }
    setActiveBlock(type);
    editor.commands.focus();
  };

  return (
    <div
      className={`${readOnly ? "" : "border border-border rounded-lg shadow-sm"} overflow-hidden bg-card text-card-foreground text-right transition-colors duration-200`}
    >
      <Activity mode={readOnly ? "hidden" : "visible"}>
        <EditorToolbar
          editor={editor}
          activeBlock={activeBlock}
          handleBlockChange={handleBlockChange}
        />
      </Activity>

      <div
        className={`${readOnly ? "p-2" : "p-4 min-h-75"} bg-background flex flex-col gap-4`}
      >
        <Activity mode={readOnly ? "hidden" : "visible"}>
          <Input
            id="changelogTitle"
            placeholder="عنوان گزارش (مثال:نسخه 1.2.0)"
            icon={RocketIcon}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Activity>

        <Activity mode={readOnly ? "visible" : "hidden"}>
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
        </Activity>

        <EditorContent
          editor={editor}
          className="prose prose-sm sm:prose max-w-none dark:prose-invert text-right focus:outline-none min-w-full"
        />
      </div>
    </div>
  );
}
