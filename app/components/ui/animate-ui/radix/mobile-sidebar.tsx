"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./sheet";
import { MotionHighlight } from "../effects/motion-highlight";
import { cn } from "~/lib/utils";

type MobileSidebarProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  side?: "left" | "right";
  containerClassName?: string;
  animateOnHover?: boolean;
  transition?: any;
  children: React.ReactNode;
  className?: string;
};

export function MobileSidebar({
  open,
  setOpen,
  side = "right",
  containerClassName,
  animateOnHover = true,
  transition,
  children,
  className,
}: Readonly<MobileSidebarProps>) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        data-sidebar="sidebar"
        data-slot="sidebar"
        data-mobile="true"
        className={cn(
          "bg-sidebar text-sidebar-foreground w-[18rem] p-0 [&>button]:hidden",
          className,
        )}
        side={side}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Sidebar</SheetTitle>
          <SheetDescription>Displays the mobile sidebar.</SheetDescription>
        </SheetHeader>
        <MotionHighlight
          enabled={animateOnHover}
          hover
          controlledItems
          mode="parent"
          containerClassName={cn("h-full", containerClassName)}
          transition={transition}
        >
          <div className="flex h-full w-full flex-col">{children}</div>
        </MotionHighlight>
      </SheetContent>
    </Sheet>
  );
}
