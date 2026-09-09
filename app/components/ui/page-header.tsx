import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

interface PageTitleProps {
  title: string;
  className?: string;
  id?: string;
}

export function PageTitle({
  title,
  className,
  id = "",
}: Readonly<PageTitleProps>) {
  return (
    <b id={id} className={cn(`text-base lg:text-lg line-clamp-1`, className)}>
      {title}
    </b>
  );
}

interface PageDescriptionProps {
  description: string;
  className?: string;
}

export function PageDescription({
  description,
  className,
}: Readonly<PageDescriptionProps>) {
  return (
    <p
      className={cn(`text-xs lg:text-sm text-muted-foreground mt-2`, className)}
    >
      {description}
    </p>
  );
}

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionTitle({
  children,
  className,
}: Readonly<SectionTitleProps>) {
  return (
    <h2
      className={cn(
        "lg:text-lg font-semibold tracking-tight text-zinc-800 dark:text-zinc-200",
        className,
      )}
    >
      {children}
    </h2>
  );
}

interface PageHeaderProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHeader({
  description,
  icon: Icon,
  title,
  children,
}: Readonly<PageHeaderProps>) {
  return (
    <div className="w-full flex flex-col md:border-b md:p-2.5 lg:p-4 gap-2">
      <div className="flex items-center justify-between gap-2 lg:gap-3">
        <div className="flex items-center gap-2 lg:gap-3">
          {Icon && (
            <Icon className="size-5.5 text-zinc-500 dark:text-zinc-400" />
          )}
          <PageTitle title={title} />
        </div>

        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>

      {description && (
        <PageDescription
          description={description}
          className="text-sm lg:text-base mt-0 text-zinc-500 dark:text-zinc-400"
        />
      )}
    </div>
  );
}
