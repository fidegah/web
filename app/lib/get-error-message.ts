import { MESSAGES } from "~/constants/messages";
import { ApiError } from "./api/client";
import { ERROR_MESSAGES_BY_CODE } from "~/constants/error-codes";

export function getErrorMessage(
  err: unknown,
  fallbackMessage: string = MESSAGES.GENERAL.ERROR,
): string {
  if (err instanceof ApiError) {
    return ERROR_MESSAGES_BY_CODE[err.code] || fallbackMessage;
  }
  return fallbackMessage;
}
