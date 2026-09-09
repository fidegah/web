import {
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps,
} from "@tiptap/react";
import { Checkbox } from "~/components/ui/checkbox";
import { useId } from "react";

export const ReactTaskItem = ({ node, updateAttributes }: NodeViewProps) => {
  const checked = node.attrs.checked;
  const uniqueId = useId();

  return (
    <NodeViewWrapper
      className="flex items-center gap-2.5 my-1.5 min-h-6"
      dir="rtl"
    >
      <div
        className="flex items-center justify-center select-none"
        contentEditable={false}
      >
        <Checkbox
          id={uniqueId}
          checked={checked}
          onCheckedChange={(val) => {
            updateAttributes({ checked: val === true });
          }}
        />
      </div>

      <NodeViewContent className="flex-1 min-w-0 [&_p]:m-0 [&_div]:m-0 text-sm leading-none flex items-center" />
    </NodeViewWrapper>
  );
};
