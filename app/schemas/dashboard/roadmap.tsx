import z from "zod";
import { MESSAGES } from "~/constants/messages";

export const roadmapSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, MESSAGES.VALIDATION.FIELDS.NAME.REQUIRED)
    .max(100, MESSAGES.VALIDATION.FIELDS.NAME.MAX_LENGTH),
});
