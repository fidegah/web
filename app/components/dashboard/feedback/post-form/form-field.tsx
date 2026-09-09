import { Link } from "react-router";
import { Label } from "~/components/ui/label";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  actionLink?: { label: string; link: string };
  children: React.ReactNode;
}

export const FormField = ({
  label,
  htmlFor,
  actionLink,
  children,
}: FormFieldProps) => (
  <div className="flex flex-col gap-2.5 lg:gap-3">
    <div className="w-full flex items-center justify-between">
      <Label htmlFor={htmlFor} className="lg:text-base font-semibold">
        {label}
      </Label>

      {actionLink && (
        <Link
          to={actionLink.link}
          className="text-xs lg:text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400"
        >
          {actionLink.label}
        </Link>
      )}
    </div>
    {children}
  </div>
);
