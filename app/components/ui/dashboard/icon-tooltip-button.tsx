import {
  IconButton,
  type IconButtonProps,
} from "~/components/ui/animate-ui/buttons/icon";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";

type IconTooltipButtonProps = {
  icon: React.ElementType;
  label: string;
  size?: "default" | "sm" | "lg";
} & Omit<IconButtonProps, "icon" | "size">;

export default function IconTooltipButton({
  icon,
  label,
  size = "default",
  onClick,
  className,
  ...rest
}: Readonly<IconTooltipButtonProps>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconButton
          size={size}
          icon={icon}
          onClick={onClick}
          className={className}
          {...rest}
        />
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-sm">{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}
