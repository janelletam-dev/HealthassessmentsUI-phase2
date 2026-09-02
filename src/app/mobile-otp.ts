// The mobile verification code the patient receives by text.
//
// There is no SMS service behind a prototype, so ANY six digits verify. This
// follows activation-codes.ts, where anything not on the demo list validates
// and moves on: the happy path is the default and named inputs raise the
// errors, never the other way round.
//
// It used to be the other way round, pinned to one correct code, and that made
// the step a wall. Nobody demoing the prototype knows the pinned code, so the
// commonest thing a person does here, type six digits, failed. A prototype
// that blocks the walkthrough is not demonstrating the failure state, it is
// just broken to whoever is holding it.
//
// One code is still pinned as WRONG so the failure stays typable, the same way
// "HOL/234567" pins "code already used". Both failure states are also reachable
// from View states without typing anything.

/** The one six-digit code that fails, so the failure path can be typed. */
export const DEMO_WRONG_OTP = "000000";

export const OTP_LENGTH = 6;

/** How long the resend button stays disabled, per "Resend code (59s)..." */
export const RESEND_SECONDS = 60;

export type OtpOutcome = "incomplete" | "wrong" | "verified";

export function isOtpComplete(code: string): boolean {
  return new RegExp(`^\\d{${OTP_LENGTH}}$`).test(code);
}

export function checkOtp(code: string): OtpOutcome {
  if (!isOtpComplete(code)) return "incomplete";
  return code === DEMO_WRONG_OTP ? "wrong" : "verified";
}

// Lifted from 1836:310608, 1836:310658 and 2197:122108.
export const OTP_MESSAGES = {
  incomplete: "Please provide your verification code.",
  successTitle: "Success",
  successBody: "You've verified your mobile number. Taking you to the next step...",
  failedTitle: "Verification failed",
  failedBody: "We couldn't verify your mobile number. Please check the code and try again.",
} as const;

/**
 * "07123456789" reads back as "+44 (0) 7123 456 789", the format the design
 * uses in "Enter the code sent to ...".
 */
export function formatForDisplay(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "").replace(/^\+?44/, "0");
  if (!/^07\d{9}$/.test(digits)) return raw.trim();
  const national = digits.slice(1); // drop the leading 0
  return `+44 (0) ${national.slice(0, 4)} ${national.slice(4, 7)} ${national.slice(7)}`;
}
