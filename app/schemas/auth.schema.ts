import z from "zod";
import { emailField } from "./email.schema";
import { MESSAGES } from "~/constants/messages";

const fullNameField = z
  .string({ message: MESSAGES.VALIDATION.FIELDS.NAME.REQUIRED })
  .trim()
  .min(1, MESSAGES.VALIDATION.FIELDS.NAME.REQUIRED)
  .max(50, MESSAGES.VALIDATION.FIELDS.NAME.MIN_LENGTH)
  .regex(/^[\u0600-\u06FF\s]+$/, MESSAGES.VALIDATION.FIELDS.NAME.PERSIAN_ONLY);

const passwordField = z
  .string({ message: MESSAGES.VALIDATION.FIELDS.PASSWORD.REQUIRED })
  .min(8, MESSAGES.VALIDATION.FIELDS.PASSWORD.MIN_LENGTH)
  .max(128, MESSAGES.VALIDATION.FIELDS.PASSWORD.MAX_LENGTH)
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    MESSAGES.VALIDATION.FIELDS.PASSWORD.PASSWORD_STRONG_PATTERN,
  );

export const sendOtpSchema = z.object({
  email: emailField,
});

export const verifyOtpSchema = z.object({
  email: emailField,
  code: z
    .string(MESSAGES.VALIDATION.FIELDS.OTP_CODE.REQUIRED)
    .length(6, MESSAGES.VALIDATION.FIELDS.OTP_CODE.EXACT_LENGTH)
    .regex(/^\d+$/, MESSAGES.VALIDATION.FIELDS.OTP_CODE.DIGITS_ONLY),
});

export const updateProfileSchema = z.object({
  fullName: fullNameField,
});

export const signUpSchema = z
  .object({
    fullName: fullNameField,
    email: emailField,
    password: passwordField,
    confirmPassword: z.string({
      message: MESSAGES.VALIDATION.FIELDS.CONFIRM_PASSWORD.REQUIRED,
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: MESSAGES.VALIDATION.FIELDS.CONFIRM_PASSWORD.NOT_MATCH,
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailField,
  password: z
    .string({ message: MESSAGES.VALIDATION.FIELDS.PASSWORD.REQUIRED })
    .min(1, MESSAGES.VALIDATION.FIELDS.PASSWORD.REQUIRED),
});

export const updatePasswordSchema = z
  .object({
    newPassword: passwordField,
    confirmPassword: z.string({
      message: MESSAGES.VALIDATION.FIELDS.CONFIRM_PASSWORD.REQUIRED,
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: MESSAGES.VALIDATION.FIELDS.CONFIRM_PASSWORD.NOT_MATCH,
  });

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
