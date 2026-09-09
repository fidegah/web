import z from "zod";
import { MESSAGES } from "~/constants/messages";

export const createPostSchema = z.object({
  boardId: z.string({ message: MESSAGES.VALIDATION.FIELDS.BOARD.REQUIRED }),
  categoryId: z.string().optional(),
  title: z
    .string({ message: MESSAGES.VALIDATION.FIELDS.TITLE.REQUIRED })
    .min(1, MESSAGES.VALIDATION.FIELDS.TITLE.REQUIRED)
    .max(100, MESSAGES.VALIDATION.FIELDS.TITLE.MAX_LENGTH),
  description: z
    .string()
    .max(1000, MESSAGES.VALIDATION.FIELDS.DESCRIPTION.MAX_LENGTH)
    .nullish(),
});
