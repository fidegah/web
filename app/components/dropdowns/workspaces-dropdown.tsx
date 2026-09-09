import { FolderDot } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
} from "../ui/animate-ui/radix/dropdown-menu";
import type { Workspace } from "~/types";

interface WorkspaceDropdownProps {
  workspaces: Workspace[];
}

export default function WorkspacesDropdown({
  workspaces,
}: Readonly<WorkspaceDropdownProps>) {
  return (
    <>
      <DropdownMenuLabel className="text-right">
        فضاهای کاری ایجاد شده
      </DropdownMenuLabel>

      {workspaces.map((item) => (
        <DropdownMenuItem key={item.id}>
          <a
            href={
              globalThis.window === undefined
                ? "#"
                : `${globalThis.window.location.protocol}//${item.subdomain}.${globalThis.window.location.host
                    .replace(/^www\./, "")
                    .split(".")
                    .slice(-2)
                    .join(".")}/dashboard`
            }
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between text-right"
          >
            <span>{item.name}</span>
            <FolderDot className="size-4" />
          </a>
        </DropdownMenuItem>
      ))}
    </>
  );
}
