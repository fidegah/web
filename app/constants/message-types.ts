import {
  Bell,
  BadgeInfo,
  MessageCircleWarning,
  ShieldAlert,
  FolderCheck,
} from "lucide-react";

export const messageTypeConfig = {
  general: {
    icon: Bell,
    color: "text-gray-600 dark:text-gray-300",
    bg: "bg-gray-100 dark:bg-gray-800",
  },
  info: {
    icon: BadgeInfo,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900",
  },
  warning: {
    icon: MessageCircleWarning,
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-100 dark:bg-yellow-900",
  },
  error: {
    icon: ShieldAlert,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900",
  },
  success: {
    icon: FolderCheck,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-900",
  },
} as const;
