import type React from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { RippleButton } from "~/components/ui/animate-ui/buttons/ripple";
import { cn } from "~/lib/utils";
import { StackedCardsIllustration } from "./illustrations/stacked-cards";
import { ChatIllustration } from "./illustrations/chat";

type IllustrationType = "stacked-cards" | "chat";

const illustrations: Record<IllustrationType, React.ComponentType> = {
  "stacked-cards": StackedCardsIllustration,
  chat: ChatIllustration,
};

interface DataEmptyStateProps {
  title: string;
  description?: string;
  actionText?: string;
  actionIcon?: React.ElementType;
  onActionClick?: () => void;
  actionVariant?: "default" | "outline" | "secondary" | "ghost";
  fullWidth?: boolean;
  size?: "sm" | "default";
  className?: string;
  hasBorder?: boolean;
  illustrationType?: IllustrationType;
}

export const DataEmptyState = ({
  title,
  description,
  actionText,
  actionIcon: ActionIcon,
  onActionClick,
  actionVariant = "outline",
  fullWidth,
  size = "default",
  className,
  hasBorder = false,
  illustrationType = "stacked-cards",
}: Readonly<DataEmptyStateProps>) => {
  const IllustrationComponent = illustrations[illustrationType];

  return (
    <div
      className={cn(
        "w-full h-screen flex justify-center items-center",
        className,
      )}
    >
      <div className={cn("p-3 md:p-0", fullWidth && "w-full")}>
        <Empty className={cn("w-fit border-0", hasBorder && "border")}>
          <EmptyHeader>
            <EmptyMedia variant="default">
              <IllustrationComponent />
            </EmptyMedia>
            <EmptyTitle
              className={cn(
                size === "default" && "text-md",
                size === "sm" && "text-sm",
              )}
            >
              {title}
            </EmptyTitle>

            {description && (
              <EmptyDescription className={cn(size === "sm" && "text-xs")}>
                {description}
              </EmptyDescription>
            )}
          </EmptyHeader>
          {actionText && ActionIcon && onActionClick && (
            <EmptyContent>
              <RippleButton variant={actionVariant} onClick={onActionClick}>
                <ActionIcon />
                {actionText}
              </RippleButton>
            </EmptyContent>
          )}
        </Empty>
      </div>
    </div>
  );
};
