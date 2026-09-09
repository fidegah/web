import z from "zod";
import { MESSAGES } from "~/constants/messages";

export const workspaceSchema = z.object({
  name: z
    .string({ message: MESSAGES.VALIDATION.FIELDS.NAME.REQUIRED })
    .min(3, MESSAGES.WORKSPACE.NAME_MIN)
    .max(100, MESSAGES.WORKSPACE.NAME_MAX),

  subdomain: z
    .string({ message: MESSAGES.VALIDATION.FIELDS.SUBDOMAIN.REQUIRED })
    .min(3, MESSAGES.WORKSPACE.SUBDOMAIN_MIN)
    .max(63, MESSAGES.WORKSPACE.SUBDOMAIN_MAX)
    .regex(
      /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/,
      MESSAGES.VALIDATION.FIELDS.URL.INVALID,
    )
    .transform((val) => val.toLowerCase()),
});

const originRegex =
  /^https?:\/\/(localhost|127\.0\.0\.1|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+)(:\d+)?$/;

export const updateAllowedDomainsSchema = z.object({
  allowedDomains: z
    .array(
      z.string().trim().toLowerCase().regex(originRegex, {
        message: MESSAGES.ALLOWED_DOMAINS.INVALID_FORMAT,
      }),
    )
    .refine((items) => new Set(items).size === items.length, {
      message: MESSAGES.ALLOWED_DOMAINS.DUPLICATE,
    }),
});
