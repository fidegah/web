import z from "zod";
import { MESSAGES } from "~/constants/messages";

export const createChangelogSchema = z.object({
  title: z
    .string({ message: MESSAGES.VALIDATION.FIELDS.TITLE.REQUIRED })
    .min(3, MESSAGES.VALIDATION.FIELDS.TITLE.MIN_LENGTH)
    .max(100, MESSAGES.VALIDATION.FIELDS.TITLE.MAX_LENGTH),

  content: z.string(),

  tagIds: z.array(z.string()).min(1, MESSAGES.CHANGELOGS.TAG_REQUIRED),
});
