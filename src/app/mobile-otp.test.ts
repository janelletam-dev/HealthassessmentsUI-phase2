import { check as assert, report } from "./assertions.ts";
import {
  DEMO_WRONG_OTP, OTP_LENGTH, RESEND_SECONDS,
  isOtpComplete, checkOtp, formatForDisplay, OTP_MESSAGES,
} from "./mobile-otp.ts";

// Shape
assert.equal(OTP_LENGTH, 6);
assert.equal(RESEND_SECONDS, 60);
assert.ok(isOtpComplete(DEMO_WRONG_OTP), "the pinned failure is itself a complete code");

// Completeness
for (const ok of ["123456", "000000", "999999"]) assert.ok(isOtpComplete(ok), ok);
for (const bad of ["", "1", "12345", "1234567", "12345a", "12 345"]) {
  assert.ok(!isOtpComplete(bad), `${bad} is not complete`);
}

// Three outcomes, and only three
assert.equal(checkOtp(""), "incomplete");
assert.equal(checkOtp("12345"), "incomplete");
assert.equal(checkOtp("12345a"), "incomplete", "letters never count as complete");

// ANY six digits verify. This is the point of the change: whoever is holding
// the prototype does not know a pinned code, so typing six digits has to work.
for (const typed of ["123456", "654321", "111111", "999999", "070707"]) {
  assert.equal(checkOtp(typed), "verified", `${typed} verifies`);
}

// Except the one pinned failure, which keeps the failure path typable.
assert.equal(checkOtp(DEMO_WRONG_OTP), "wrong");
assert.equal(checkOtp("000000"), "wrong", "a complete but pinned-wrong code is wrong, not incomplete");

// The failure has to be reachable BY TYPING, not only from View states, or the
// next person to tidy this deletes the pinned code and loses the state.
assert.notEqual(checkOtp(DEMO_WRONG_OTP), "verified", "the pinned failure must not pass");
assert.ok(isOtpComplete(DEMO_WRONG_OTP), "and it must be six digits, or it reads as incomplete instead");

// The number reads back the way the design writes it
assert.equal(formatForDisplay("07123456789"), "+44 (0) 7123 456 789");
assert.equal(formatForDisplay("07123 456 789"), "+44 (0) 7123 456 789");
assert.equal(formatForDisplay("+447123456789"), "+44 (0) 7123 456 789");
assert.equal(formatForDisplay("+44 7123 456789"), "+44 (0) 7123 456 789");
// Anything that is not a UK mobile is echoed rather than mangled
assert.equal(formatForDisplay("0207 946 0958"), "0207 946 0958");
assert.equal(formatForDisplay("  "), "");

// Copy is lifted and must stay word for word
assert.equal(OTP_MESSAGES.incomplete, "Please provide your verification code.");
assert.equal(OTP_MESSAGES.successTitle, "Success");
assert.equal(OTP_MESSAGES.successBody, "You've verified your mobile number. Taking you to the next step...");
assert.equal(OTP_MESSAGES.failedTitle, "Verification failed");
assert.equal(OTP_MESSAGES.failedBody, "We couldn't verify your mobile number. Please check the code and try again.");

// No em dashes anywhere
for (const msg of Object.values(OTP_MESSAGES)) assert.ok(!msg.includes("—"), `no em dash in: ${msg}`);

report("mobile-otp");
