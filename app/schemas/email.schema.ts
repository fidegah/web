import z from "zod";
import { MESSAGES } from "~/constants/messages";

export const emailField = z
  .email({ message: MESSAGES.VALIDATION.FIELDS.EMAIL.INVALID })
  .nonempty(MESSAGES.VALIDATION.FIELDS.EMAIL.REQUIRED)
  .max(50, { message: MESSAGES.VALIDATION.FIELDS.EMAIL.INVALID });
