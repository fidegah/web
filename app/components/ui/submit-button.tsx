import { RippleButton } from "~/components/ui/animate-ui/buttons/ripple";
import { cn } from "~/lib/utils";
import { Spinner } from "./spinner";

interface SubmitButtonProps {
  label: string;
  isLoading: boolean;
  loadingLabel?: string;
  isDisabled?: boolean;
  className?: string;
  type?: "button" | "reset" | "submit";
  onClick?: () => void;
}

export default function SubmitButton({
  label,
  isLoading,
  loadingLabel,
  isDisabled,
  className,
  type,
  onClick,
}: Readonly<SubmitButtonProps>) {
  return (
    <div
      className={cn(
        `w-full md:w-1/3 lg:w-1/2 flex justify-center md:justify-start`,
        className,
      )}
    >
      <RippleButton
        type={type || "submit"}
        disabled={isDisabled || isLoading}
        onClick={onClick}
        className="w-full bg-cyan-700 hover:bg-cyan-800 dark:text-white"
      >
        {isLoading ? (loadingLabel ?? `در حال ${label}`) : label}
        {isLoading && <Spinner />}
      </RippleButton>
    </div>
  );
}
