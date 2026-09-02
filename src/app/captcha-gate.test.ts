import { check as assert, report } from "./assertions.ts";
import { captchaGate, CAPTCHA_MESSAGES, type CaptchaStatus } from "./captcha-gate.ts";

const cases: [CaptchaStatus, string][] = [
  ["success", "proceed"],
  ["verifying", "still-running"],
  ["challenge", "still-running"],
  ["failed", "retry"],
  ["load-error", "retry"],
];

for (const [status, expected] of cases) {
  assert.equal(captchaGate(status), expected, `${status} should gate as ${expected}`);
}

// Success is the only state that shows no message of ours
assert.equal(captchaGate("success"), "proceed");
assert.ok(!("proceed" in CAPTCHA_MESSAGES));

// UK English copy, hyphens not em dashes, and the code-is-safe reassurance
for (const msg of Object.values(CAPTCHA_MESSAGES)) {
  assert.ok(!msg.includes("—"), `no em dash in: ${msg}`);
  assert.ok(msg.includes("your code is still here"), `reassurance missing in: ${msg}`);
}

report("captcha-gate");
