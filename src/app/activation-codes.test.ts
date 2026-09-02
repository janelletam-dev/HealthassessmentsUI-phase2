import { check as assert, report } from "./assertions.ts";
import { activationCodeError, CODE_ERRORS, DEMO_CODES } from "./activation-codes.ts";

// Each designed code raises its own error
assert.equal(activationCodeError("HOL/234567"), "code-used");
assert.equal(activationCodeError("Abc-12345"), "code-not-recognised");
assert.equal(activationCodeError("ABC-123456"), "invalid-code");

// En dashes copied out of the design still match
assert.equal(activationCodeError("Abc–12345"), "code-not-recognised");
assert.equal(activationCodeError("ABC—123456"), "invalid-code");
assert.equal(activationCodeError("  HOL/234567  "), "code-used");

// Case matters: that is the whole point of the case-sensitivity message
assert.equal(activationCodeError("ABC-12345"), null);
assert.equal(activationCodeError("abc-123456"), null);

// Any other code proceeds
for (const ok of ["", "VALID-001", "HOL/999999"]) {
  assert.equal(activationCodeError(ok), null, `${ok} should proceed`);
}

// Every error has content, and only code-used carries an inline link
for (const id of Object.keys(CODE_ERRORS) as (keyof typeof CODE_ERRORS)[]) {
  assert.ok(CODE_ERRORS[id].title.length > 0, `${id} needs a title`);
  assert.ok(CODE_ERRORS[id].bodyBefore.length > 0, `${id} needs body copy`);
  assert.ok(DEMO_CODES[id].length > 0, `${id} needs a demo code`);
  assert.ok(!CODE_ERRORS[id].title.includes("—"), `${id} title must not use an em dash`);
}
assert.equal(CODE_ERRORS["code-used"].linkLabel, "log in");
assert.equal(CODE_ERRORS["invalid-code"].linkLabel, undefined);

// The file draws TWO Invalid code frames with different bodies, keyed to the
// code entered. Both were mapped to the first body until 24 Aug.
//   1800:155031  ABC-123456  cannot be validated, check your documents
//   1800:155001  9876543L    lapsed or cancelled
assert.equal(activationCodeError("ABC-123456"), "invalid-code");
assert.equal(activationCodeError("9876543L"), "code-lapsed");
assert.equal(activationCodeError("  9876543L  "), "code-lapsed", "trimmed the same way");
assert.equal(DEMO_CODES["invalid-code"], "ABC-123456");
assert.equal(DEMO_CODES["code-lapsed"], "9876543L");

// Same heading, different explanation. That distinction is the whole point.
assert.equal(CODE_ERRORS["code-lapsed"].title, CODE_ERRORS["invalid-code"].title, "both read Invalid code");
assert.notEqual(
  CODE_ERRORS["code-lapsed"].bodyBefore, CODE_ERRORS["invalid-code"].bodyBefore,
  "but they must not share a body",
);
assert.match(CODE_ERRORS["code-lapsed"].bodyBefore, /lapsed or been cancelled/);
assert.match(CODE_ERRORS["invalid-code"].bodyBefore, /membership documents/);

report("activation-codes");
