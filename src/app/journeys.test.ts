import { check as assert, report } from "./assertions.ts";
import { journeyForCode, isVoucherCode, JOURNEYS } from "./journeys.ts";
import { DEMO_CODES, activationCodeError } from "./activation-codes.ts";

// The four shapes route where they should.
assert.equal(journeyForCode("AXA-RA003032").id, "axa-hp", "group reference is Health Plan");
assert.equal(journeyForCode("AXA/S9862901").id, "axa-voucher", "a slash prefix is an AXA voucher");
assert.equal(journeyForCode("HOL/H1214301").id, "axa-voucher", "HOL is a voucher too, SME or Individual");
assert.equal(journeyForCode("ABC-12345").id, "dca", "the code the frames draw is DCA");

// Brand follows the journey, so the header and the band cannot disagree with it.
assert.equal(journeyForCode("AXA/S9862901").brand, "axa");
assert.equal(journeyForCode("HOL/H1214301").brand, "axa");
assert.equal(journeyForCode("AXA-RA003032").brand, "axa");
assert.equal(journeyForCode("ABC-12345").brand, "dca");

// Only the plan journeys match against a policy record. Vouchers carry their
// own entitlement, per flow 09 in the systems audit.
assert.ok(JOURNEYS["axa-hp"].validatesAgainstPolicy);
assert.ok(JOURNEYS["axa-lc"].validatesAgainstPolicy);
assert.ok(!JOURNEYS["axa-voucher"].validatesAgainstPolicy);
assert.ok(!JOURNEYS["dca"].validatesAgainstPolicy);

// Vouchers are the two direct-sale products, not the plans.
assert.ok(isVoucherCode("AXA/S9862901"));
assert.ok(isVoucherCode("HOL/H1214301"));
assert.ok(!isVoucherCode("AXA-RA003032"), "a group reference is not a voucher");
assert.ok(!isVoucherCode("ABC-12345"));

// Pasted codes carry spaces. Detection has to survive that.
assert.equal(journeyForCode(" AXA/S9862901 ").id, "axa-voucher");
assert.equal(journeyForCode("HOL / H1214301").id, "axa-voucher");

// THE COLLISION THAT MATTERS. "HOL/234567" is the demo code for "already used".
// HOL is also the live SME prefix, so if the SME shape were loose enough to
// swallow six bare digits, the already-used state would become unreachable.
assert.equal(DEMO_CODES["code-used"], "HOL/234567", "the already-used demo code is unchanged");
assert.equal(journeyForCode("HOL/234567").id, "dca", "six digits and no letter is not an SME voucher");

// AXA- is a prefix, not a body shape. Janelle typed AXA-123456 on 26 Aug and
// got the DCA lockup, the same failure HOL/2345678 had: the sample body
// (two letters, six digits) was being enforced as a rule.
for (const hp of ["AXA-RA003032", "AXA-123456", "AXA-R003032", "AXA-RAA03032", "axa-123456"]) {
  assert.equal(journeyForCode(hp).id, "axa-hp", `"${hp}" is AXA HP`);
}
assert.equal(journeyForCode("AXA-123456").brand, "axa", "the code that started this reads as AXA");
assert.ok(JOURNEYS[journeyForCode("AXA-123456").id].validatesAgainstPolicy, "and HP still validates");

// Still anchored, and still a body.
for (const almost of [
  "XAXA-RA003032",       // prefixed
  "AXA-12345",           // five, below the floor
  "AXA-RA0030321234567", // past the ceiling
  "AXA-RA00-3032",       // punctuated body
  "AXA123456",           // no separator
  "",
]) {
  assert.equal(journeyForCode(almost).id, "dca", `"${almost}" is not AXA HP`);
}

// THE PREFIXES MUST NOT EAT THE DEMO CODES. Nothing in the prototype begins
// AXA- or HOL/ except real AXA codes, which is the whole reason the prefix is
// safe to key on. Pin it, because a demo code added later that starts AXA-
// would silently become an AXA journey.
for (const [id, code] of Object.entries(DEMO_CODES)) {
  if (id === "code-lapsed") continue; // 9876543L genuinely IS the LC shape, covered below
  assert.equal(journeyForCode(code).id, "dca", `demo code ${code} (${id}) stays DCA`);
}

// The VOUCHER prefixes are deliberately loose: the Visio has no SME or
// Individual format branch, so the prefix is the only part with any authority
// behind it. Janelle, 26 Aug: "HOL is axa".
for (const voucher of ["AXA/S9862901", "AXA/S986290", "AXA/99862901", "AXA/S9862901X"]) {
  assert.equal(journeyForCode(voucher).id, "axa-voucher", `"${voucher}" is a voucher`);
}
for (const voucher of ["HOL/H1214301", "HOL/H121430", "HOL/2345678"]) {
  assert.equal(journeyForCode(voucher).id, "axa-voucher", `"${voucher}" is a voucher`);
}

// HOL/2345678 is the code Janelle typed on 26 Aug and got a DCA band for. Pin
// it: it is the whole reason the shape was loosened.
assert.equal(journeyForCode("HOL/2345678").brand, "axa", "the code that started this reads as AXA");

// Loose is not unanchored. The prefix still has to be the prefix, and a body
// has to look like a body.
for (const almost of [
  "XAXA/S9862901",       // prefixed
  "AXA/S98629",          // six, below the floor that protects the demo code
  "AXA/S9862901234567",  // past the ceiling
  "AXA/S9862-901",       // punctuated body
  "HOL-H1214301",        // hyphen, not a slash
]) {
  assert.equal(journeyForCode(almost).id, "dca", `"${almost}" is not a voucher`);
}

// THE POINT OF ONE VOUCHER JOURNEY. Janelle, 26 Aug: "HOL could be axa sme and
// ind, not lcdb/hp". A slash prefix cannot tell SME from Individual, so the
// code must not claim to. What it CAN say is what the prefix rules out, and
// that is the half the journey actually branches on.
for (const voucher of ["AXA/S9862901", "HOL/H1214301", "HOL/2345678"]) {
  const j = journeyForCode(voucher);
  assert.equal(j.brand, "axa", `${voucher} is AXA`);
  assert.ok(!j.validatesAgainstPolicy, `${voucher} never matches a policy record`);
  assert.ok(isVoucherCode(voucher), `${voucher} is a voucher`);
  assert.ok(j.id !== "axa-lc" && j.id !== "axa-hp", `${voucher} is never LC or HP`);
}

// Lower case still routes: people type codes however they like, and the
// case-sensitivity error is raised by validation, not by detection.
assert.equal(journeyForCode("axa/s9862901").id, "axa-voucher", "detection is case-insensitive");

// Every journey is self-consistent.
for (const [id, j] of Object.entries(JOURNEYS)) {
  assert.equal(j.id, id, `${id} knows its own id`);
  assert.ok(j.label.trim().length > 0, `${id} has a label`);
  assert.ok(!j.label.includes("—"), `no em dash in ${id}`);
}

// ── AXA Large Corporate: digits then a trailing letter ──────────────────────

assert.equal(journeyForCode("9876543L").id, "axa-lc", "seven digits then a letter is LC");
assert.equal(journeyForCode("4471290K").id, "axa-lc");
assert.equal(journeyForCode("9876543l").id, "axa-lc", "detection is case-insensitive here too");
assert.equal(journeyForCode(" 9876543 L ").id, "axa-lc", "pasted spacing survives");
assert.equal(JOURNEYS["axa-lc"].brand, "axa");
assert.ok(!isVoucherCode("9876543L"), "LC is a plan, not a voucher");

// THE SECOND COLLISION. "9876543L" is also the demo code for "code lapsed", and
// it is exactly the LC shape. That is safe only because the error check gates
// routing: activationCodeError runs first, and onCodeRecognised fires only when
// it returns null. Pin both halves, because the day someone reorders those two
// the lapsed state silently becomes an LC sign-up.
assert.equal(DEMO_CODES["code-lapsed"], "9876543L", "the lapsed demo code is unchanged");
assert.equal(activationCodeError("9876543L"), "code-lapsed", "it still errors before anything routes");
assert.equal(journeyForCode("9876543L").id, "axa-lc", "and the shape genuinely is LC, which is why order matters");

// Near-shapes must not become LC.
for (const almost of [
  "987654L",     // six digits
  "98765432L",   // eight digits
  "9876543",     // no letter
  "9876543LL",   // two letters
  "L9876543",    // letter first
  "9876-543L",   // punctuated
]) {
  assert.equal(journeyForCode(almost).id, "dca", `"${almost}" is not LC`);
}

// LC's second shape: the Barclays scheme is a capital letter then eight digits.
// A mirror of the LCDB one, not a prefix on it. I had guessed "barclays" was a
// literal prefix on the LCDB shape; it is not, and the guess is what this block
// replaces.
assert.equal(journeyForCode("G01125901").id, "axa-lc", "letter then eight digits is LC");
assert.equal(journeyForCode("g01125901").id, "axa-lc", "case-insensitive, like every other shape");
assert.equal(journeyForCode(" G0112 5901 ").id, "axa-lc", "pasted spacing survives");
assert.ok(!isVoucherCode("G01125901"), "still a plan, not a voucher");
assert.ok(JOURNEYS[journeyForCode("G01125901").id].validatesAgainstPolicy, "and it validates against the policy record");

// The two LC shapes must not bleed into each other or into anything else.
for (const almost of [
  "G0112590",    // seven digits, one short
  "G011259012",  // nine digits, one over
  "GG01125901",  // two letters
  "01125901G",   // the other way round, but eight digits not seven
  "G-01125901",  // punctuated
  "01125901",    // no letter at all
]) {
  assert.equal(journeyForCode(almost).id, "dca", `"${almost}" is not LC`);
}

// The mirror pair is genuinely distinct: 7+letter and letter+8, not 8 either way.
assert.equal(journeyForCode("6747401Y").id, "axa-lc");
assert.equal(journeyForCode("Y6747401").id, "dca", "seven digits behind a letter is not the Barclays shape");

report("journeys");
