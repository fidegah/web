import type { RoadmapFactor } from "~/types";

export const ROADMAP_FACTOR_TYPES: {
  value: RoadmapFactor["type"];
  label: string;
}[] = [
  { value: "0-10", label: "بازه ۰ تا ۱۰" },
  { value: "0-100", label: "بازه ۰ تا ۱۰۰" },
  { value: "fibonacci", label: "فیبوناچی" },
  { value: "stars", label: "ستاره‌ای (۱-۵)" },
  { value: "boolean", label: "بله / خیر" },
];
