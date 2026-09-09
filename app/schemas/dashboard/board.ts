import z from "zod";
import { MESSAGES } from "~/constants/messages";

export const createBoardSchema = z.object({
  title: z
    .string({ message: MESSAGES.VALIDATION.FIELDS.TITLE.REQUIRED })
    .min(3, MESSAGES.VALIDATION.FIELDS.TITLE.MIN_LENGTH)
    .max(100, MESSAGES.VALIDATION.FIELDS.TITLE.MAX_LENGTH),

  url: z
    .string({ message: MESSAGES.VALIDATION.FIELDS.URL.REQUIRED })
    .min(3, MESSAGES.VALIDATION.FIELDS.URL.MIN_LENGTH)
    .max(50, MESSAGES.VALIDATION.FIELDS.URL.MAX_LENGTH)
    .regex(
      /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/,
      MESSAGES.VALIDATION.FIELDS.URL.INVALID,
    )
    .transform((val) => val.toLowerCase()),

  isPrivate: z.boolean(),
});
