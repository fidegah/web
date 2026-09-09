import { BadgePlus } from "lucide-react";
import { RippleButton } from "~/components/ui/animate-ui/buttons/ripple";
import { cn } from "~/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

interface FabProps {
  onClick: () => void;
  tooltipText: string;
  icon?: React.ElementType;
  className?: string;
}

export default function Fab({
  onClick,
  tooltipText,
  icon: Icon = BadgePlus,
  className,
}: Readonly<FabProps>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <RippleButton
          size="icon"
          className={cn(
            "bg-blue-500 rounded-full size-12 fixed bottom-5 mr-4 hover:bg-blue-600 z-50 text-white",
            className,
          )}
          onClick={onClick}
        >
          <Icon className="size-6" />
        </RippleButton>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
}
