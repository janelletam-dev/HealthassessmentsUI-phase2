// What pressing Validate should do for the current state of the security check.
// Extracted so the branch is testable without standing up the whole page.

export type CaptchaStatus = "verifying" | "success" | "failed" | "challenge" | "load-error";

export type CaptchaGate = "proceed" | "still-running" | "retry";

export function captchaGate(status: CaptchaStatus): CaptchaGate {
  if (status === "success") return "proceed";
  // A challenge awaiting its tick is still running as far as the page is concerned
  if (status === "verifying" || status === "challenge") return "still-running";
  return "retry";
}

export const CAPTCHA_MESSAGES: Record<Exclude<CaptchaGate, "proceed">, string> = {
  "still-running": "The security check is still running. Please try again in a moment - your code is still here.",
  retry: "We couldn't complete the security check. Please try again - your code is still here.",
};
