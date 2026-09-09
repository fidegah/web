import { KeyRound, type LucideIcon, ChevronLeft } from "lucide-react";
import { Activity } from "react";
import { Link } from "react-router";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

type CardStatus = "default" | "error" | "info";

interface AuthActionCardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  showFooter?: boolean;
  footerLinkText?: string;
  footerLinkHref?: string;
  icon?: LucideIcon;
  status?: CardStatus;
}

const statusStyles = {
  default: {
    container: "bg-primary/10",
    icon: "text-primary",
  },
  error: {
    container: "bg-destructive/10",
    icon: "text-destructive",
  },
  info: {
    container: "bg-blue-500/10 dark:bg-blue-400/10",
    icon: "text-blue-600 dark:text-blue-400",
  },
};

export function AuthActionCard({
  title,
  description,
  children,
  showFooter = true,
  footerLinkText = "بازگشت به صفحه ورود",
  footerLinkHref = "/auth/login",
  icon: Icon = KeyRound,
  status = "default",
}: Readonly<AuthActionCardProps>) {
  const currentStyle = statusStyles[status];

  return (
    <>
      <CardHeader className="space-y-1 flex flex-col items-center text-center">
        <div
          className={`size-12 rounded-full flex items-center justify-center mb-2 ${currentStyle.container}`}
        >
          <Icon className={`size-6 ${currentStyle.icon}`} />
        </div>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <Activity mode={children ? "visible" : "hidden"}>
        <CardContent>{children}</CardContent>
      </Activity>

      <Activity mode={showFooter ? "visible" : "hidden"}>
        <CardFooter className="flex justify-center border-t py-4">
          <Link
            to={footerLinkHref}
            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
          >
            {footerLinkText}
            <ChevronLeft className="size-4" />
          </Link>
        </CardFooter>
      </Activity>
    </>
  );
}
