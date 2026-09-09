import z from "zod";
import { MESSAGES } from "~/constants/messages";

const isValidISODate = (dateString: string) => {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;
  if (!regex.test(dateString)) return false;
  const date = new Date(dateString);
  return !Number.isNaN(date.getTime());
};

export const createPollSchema = z
  .object({
    title: z
      .string({ message: MESSAGES.VALIDATION.FIELDS.TITLE.REQUIRED })
      .min(1, MESSAGES.VALIDATION.FIELDS.TITLE.REQUIRED)
      .max(100, MESSAGES.VALIDATION.FIELDS.TITLE.MAX_LENGTH),

    description: z
      .string()
      .max(1000, MESSAGES.VALIDATION.FIELDS.DESCRIPTION.MAX_LENGTH)
      .nullish(),

    options: z
      .array(
        z.object({
          title: z
            .string()
            .min(2, MESSAGES.POLL.OPTION_TOO_SHORT)
            .max(100, MESSAGES.POLL.OPTION_TOO_LONG),
          order: z.number().int().min(0).default(0),
        }),
      )
      .min(2, MESSAGES.POLL.OPTIONS_MIN)
      .max(10, MESSAGES.POLL.OPTIONS_MAX),

    type: z.enum(["single", "multiple", "ranking"]),

    startAtISO: z
      .string({ message: MESSAGES.POLL.START_AT_REQUIRED })
      .refine(isValidISODate, MESSAGES.VALIDATION.FIELDS.URL.INVALID),

    endAtISO: z
      .string({ message: MESSAGES.POLL.END_AT_REQUIRED })
      .refine(isValidISODate, MESSAGES.VALIDATION.FIELDS.URL.INVALID),
  })
  .refine(
    (data) => {
      const start = new Date(data.startAtISO);
      const end = new Date(data.endAtISO);
      return end > start;
    },
    {
      message: MESSAGES.POLL.END_DATE_MUST_BE_AFTER_START,
      path: ["endAtISO"],
    },
  );
