import { check as assert, report } from "./assertions.ts";
import {
  DEMO_POLICY_RECORD, policyMismatches, matchesPolicy, isNearMiss, passesOnHpOnly,
} from "./axa-policy.ts";

const record = DEMO_POLICY_RECORD;
const good = { firstName: "Jane", lastName: "Smith", dob: "04/07/1990" };

assert.ok(matchesPolicy(good), "the record matches itself");
assert.deepEqual(policyMismatches(good), [], "nothing disagrees");

// Case and stray space are never the real difference.
assert.ok(matchesPolicy({ ...good, firstName: "  JANE  " }), "case and padding are ignored");
assert.ok(matchesPolicy({ ...good, lastName: "smith" }));
assert.ok(matchesPolicy({ ...good, firstName: "Jane" }));

// Each field is reported on its own, so the form can mark the right one.
assert.deepEqual(policyMismatches({ ...good, lastName: "Smyth" }), ["lastName"]);
assert.deepEqual(policyMismatches({ ...good, dob: "05/07/1990" }), ["dob"]);
assert.deepEqual(
  policyMismatches({ firstName: "John", lastName: "Doe", dob: "01/01/1980" }),
  ["firstName", "lastName", "dob"],
  "all three can disagree at once",
);

// A date of birth is compared exactly. "Close" on a date is not close.
assert.ok(!matchesPolicy({ ...good, dob: "04/07/1991" }), "wrong year is a mismatch");
assert.ok(!matchesPolicy({ ...good, dob: "" }), "blank is a mismatch, not a pass");

// ── Near misses: what looser matching would have recovered ───────────────────

assert.ok(isNearMiss({ ...good, lastName: "Smyth" }), "one letter out is a near miss");
assert.ok(isNearMiss({ ...good, firstName: "Jayne" }), "one letter inserted is a near miss");
assert.ok(isNearMiss({ ...good, dob: "07/04/1990" }), "day and month transposed is a near miss");
assert.ok(
  isNearMiss({ firstName: "Jane", lastName: "Smyth", dob: "07/04/1990" }),
  "a typo and a transposition together still only need loose matching",
);

// A different person is not a near miss, however tempting the shape.
assert.ok(!isNearMiss({ firstName: "John", lastName: "Doe", dob: "01/01/1980" }), "a different person is not a near miss");
assert.ok(!isNearMiss({ ...good, lastName: "Sm" }), "two edits out is not a near miss");
assert.ok(!isNearMiss({ ...good, dob: "04/07/1991" }), "a wrong year is not a transposition");
assert.ok(!isNearMiss(good), "an exact match is not a near miss, it is a match");

// A near miss must always also be a failure, or the two ideas have drifted.
for (const input of [
  { ...good, lastName: "Smyth" },
  { ...good, firstName: "Jayne" },
  { ...good, dob: "07/04/1990" },
]) {
  assert.ok(!matchesPolicy(input), "a near miss still fails the strict rule");
}

// The record itself is the shape the form collects, or the comparison is moot.
assert.match(record.dob, /^\d{2}\/\d{2}\/\d{4}$/, "the held date of birth is DD/MM/YYYY");
assert.ok(record.firstName.length > 0 && record.lastName.length > 0);

// ── HP loosened, LC did not (P6 in the review repo's problem register) ───────
//
// AXA now validates HP on the first three characters of both names. LC still
// matches character by character. Same person, same typo, different answer.

assert.ok(matchesPolicy({ ...good, firstName: "Jan" }, "hp"), "HP accepts a three-character prefix");
assert.ok(!matchesPolicy({ ...good, firstName: "Jan" }, "lc"), "LC rejects the same name");
assert.ok(matchesPolicy({ ...good, lastName: "Smithers" }, "hp"), "HP accepts a longer name sharing three characters");
assert.ok(!matchesPolicy({ ...good, lastName: "Smithers" }, "lc"));

// The headline case for the LC ask.
assert.ok(passesOnHpOnly({ ...good, firstName: "Jan", lastName: "Smi" }), "passes HP, fails LC");
assert.ok(!passesOnHpOnly(good), "an exact match passes both, so it is not the gap");
assert.ok(!passesOnHpOnly({ firstName: "Zoe", lastName: "Doe", dob: "01/01/1980" }), "a different person fails both");

// HP is looser on names, not on everything.
assert.ok(!matchesPolicy({ ...good, dob: "05/07/1990" }, "hp"), "date of birth is exact on HP too");
assert.ok(!matchesPolicy({ ...good, firstName: "Ja" }, "hp"), "two characters is not three");
assert.ok(!matchesPolicy({ ...good, firstName: "Xan" }, "hp"), "three wrong characters still fail");
assert.ok(!matchesPolicy({ ...good, firstName: "" }, "hp"), "blank never matches");

// LC is the default, because it is the stricter of the two and the one still
// unfixed. Defaulting to the loose rule would flatter the prototype.
assert.deepEqual(
  policyMismatches({ ...good, firstName: "Jan" }),
  policyMismatches({ ...good, firstName: "Jan" }, "lc"),
  "the default plan is LC",
);

// ── dobLocked: the correction loop has to be winnable ────────────────────────
//
// On the screen that asks for a correction, the date of birth is already
// confirmed and shown as a locked pill. If it counted, someone whose date of
// birth is the mismatch could never pass, however many times they retry. That
// is the "took my details four times" defect, created by the prototype rather
// than reproduced from the system.

const wrongDob = { ...good, dob: "01/01/1990" };

assert.ok(!matchesPolicy(wrongDob), "unlocked, a wrong date of birth fails");
assert.ok(matchesPolicy(wrongDob, "lc", DEMO_POLICY_RECORD, true), "locked, it is not consulted");
assert.deepEqual(policyMismatches(wrongDob, "lc", DEMO_POLICY_RECORD, true), [], "and is not reported");

// Locking the date does not lower the bar on anything else.
assert.ok(
  !matchesPolicy({ firstName: "Zoe", lastName: "Smith", dob: "01/01/1990" }, "lc", DEMO_POLICY_RECORD, true),
  "a wrong first name still fails when the date is locked",
);
assert.deepEqual(
  policyMismatches({ firstName: "Zoe", lastName: "Doe", dob: "01/01/1990" }, "lc", DEMO_POLICY_RECORD, true),
  ["firstName", "lastName"],
  "only the names are reported",
);
assert.ok(matchesPolicy({ ...good, dob: "" }, "lc", DEMO_POLICY_RECORD, true), "a blank locked date is ignored too");

// Locked plus HP is still HP: the loosened name rule and the locked date stack.
assert.ok(matchesPolicy({ firstName: "Jan", lastName: "Smi", dob: "01/01/1990" }, "hp", DEMO_POLICY_RECORD, true));
assert.ok(!matchesPolicy({ firstName: "Jan", lastName: "Smi", dob: "01/01/1990" }, "lc", DEMO_POLICY_RECORD, true));

// The flag defaults off, so nothing that does not ask for it changes.
assert.deepEqual(policyMismatches(wrongDob), policyMismatches(wrongDob, "lc", DEMO_POLICY_RECORD, false));

report("axa-policy");
