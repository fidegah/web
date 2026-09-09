import {
  Bug,
  Palette,
  Rocket,
  ShieldCheck,
  Sparkles,
  Trash,
  TriangleAlert,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const TAG_ICON_MAP: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  wrench: Wrench,
  bug: Bug,
  rocket: Rocket,
  "shield-check": ShieldCheck,
  shield: ShieldCheck,
  palette: Palette,
  "triangle-alert": TriangleAlert,
  alert: TriangleAlert,
  trash: Trash,
};

export function getTagIcon(iconName?: string | null): LucideIcon {
  if (!iconName) return Sparkles;
  return TAG_ICON_MAP[iconName] ?? Sparkles;
}
