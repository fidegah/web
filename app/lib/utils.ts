import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import { twMerge } from "tailwind-merge";
import { type ZodError } from "zod";

dayjs.extend(quarterOfYear);
dayjs.extend(utc);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string | undefined): string | null {
  if (!name) return null;
  const words = name.trim().split(/\s+/);
  const initials = words
    .slice(0, 2)
    .map((word) => word[0])
    .join(" ");
  return initials;
}

export function getZodErrorMessages(error: ZodError) {
  return error.issues.map((e) => e.message).join(" | ");
}

export function getSubdomain(request: Request): string | null {
  const url = new URL(request.url);
  const hostname = url.hostname;
  const baseDomain = process.env.VITE_APP_DOMAIN?.split(":")[0];

  if (hostname === baseDomain) return null;
  if (hostname.endsWith("." + baseDomain)) {
    return hostname.replace("." + baseDomain, "");
  }
  return null;
}

export const sidebarMenuButtonClassName = ({
  isActive = false,
}: {
  isActive?: boolean;
}) => {
  return cn(
    `flex justify-between py-5 cursor-pointer`,
    isActive && "bg-muted border",
  );
};

export function getFormNumber(formData: FormData, key: string): number | null {
  const value = formData.get(key);

  if (typeof value !== "string" || value.trim() === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function getFormBoolean(
  formData: FormData,
  key: string,
): boolean | null {
  const value = formData.get(key);

  if (typeof value !== "string") return null;

  const boolMap: Record<string, boolean> = {
    true: true,
    "1": true,
    on: true,
    false: false,
    "0": false,
    off: false,
  };

  return boolMap[value.trim().toLowerCase()];
}

export type CleanableValue = unknown;

export const cleanObject = <T extends Record<string, CleanableValue>>(
  obj: T,
): Partial<T> => {
  const entries = Object.entries(obj).filter(
    ([, value]) => value !== undefined && value !== null && value !== "",
  );
  return Object.fromEntries(entries) as Partial<T>;
};
