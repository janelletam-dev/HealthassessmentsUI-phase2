import { check as assert, report } from "./assertions.ts";
import {
  strengthOf, criteriaFor, toneFor, messageFor, SEGMENTS, STRENGTH_COLOURS,
} from "./password-strength.ts";
import { isStrongPassword } from "./create-account.ts";

// Empty shows no meter at all, per 1763:57456 where it is hidden
assert.equal(strengthOf(""), 0);
assert.equal(toneFor(0), "none");
assert.equal(messageFor(0), "", "nothing typed, nothing said");

// Each criterion is worth exactly one segment
assert.deepEqual(criteriaFor("abcdefgh"), { length: true, mixedCase: false, number: false, symbol: false });
assert.equal(strengthOf("abcdefgh"), 1, "long enough, nothing else");
assert.equal(strengthOf("Abcdefgh"), 2, "and mixed case");
assert.equal(strengthOf("Abcdefg1"), 3, "and a number");
assert.equal(strengthOf("Abcdefg1!"), 4, "and a symbol");

// Short passwords lose the length segment but keep what they earn
assert.equal(strengthOf("Ab1!"), 3, "everything but length");
assert.equal(strengthOf("ab"), 0, "nothing earned at all");
assert.equal(strengthOf("A1!"), 2, "no lowercase, so no mixed case, and too short");

// Mixed case is one segment, not two
assert.equal(criteriaFor("ABCDEFGH").mixedCase, false, "upper alone is not mixed");
assert.equal(criteriaFor("abcdefgh").mixedCase, false, "lower alone is not mixed");
assert.equal(criteriaFor("Abcdefgh").mixedCase, true);

// A full meter means exactly what the submit check means. If these ever
// disagree, someone sees four green segments and is then refused.
for (const p of ["Str0ng!pass", "Abcdefg1!", "P@ssw0rd", "aB3$aB3$", "password", "PASSWORD1", "Ab1!", "12345678", ""]) {
  assert.equal(
    strengthOf(p) === SEGMENTS, isStrongPassword(p),
    `full meter and isStrongPassword must agree on ${JSON.stringify(p)}`,
  );
}

// Tone: amber until every condition is met, then green
assert.equal(toneFor(1), "warn");
assert.equal(toneFor(2), "warn");
assert.equal(toneFor(3), "warn", "three of four is still not done");
assert.equal(toneFor(4), "good");

// Copy is lifted, and the three-segment case reuses the two-segment string
// 1946:149567 and 1946:149604 both draw "Weak password" alone; the advice
// clause was invented and duplicated the field helper directly above it.
assert.equal(messageFor(1), "Weak password");
assert.equal(messageFor(2), "Almost there. Add a number or a symbol");
assert.equal(messageFor(3), messageFor(2), "no three-segment frame exists, so it shares");
assert.equal(messageFor(4), "Strong password");

// Colours came off the frames
assert.equal(STRENGTH_COLOURS.warnFill, "#d9990d");
assert.equal(STRENGTH_COLOURS.goodFill, "#16a34a");
assert.equal(STRENGTH_COLOURS.track, "#e5e5e5");

// No em dashes
for (let s = 0; s <= 4; s += 1) assert.ok(!messageFor(s as 0).includes("—"));

report("password-strength");
