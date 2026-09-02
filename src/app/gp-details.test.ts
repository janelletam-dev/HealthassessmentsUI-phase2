import { check as assert, report } from "./assertions.ts";
import { validateGpDetails, isValidNhsNumber, GP_DECLINE_NOTE, DEMO_GP_DETAILS } from "./gp-details.ts";
import { GP_PRACTICES, practiceLabel, findPractice } from "./gp-practices.ts";

const picked = practiceLabel(GP_PRACTICES[0]);
const good = {
  choice: "provide" as const,
  practicePostcode: "WC1E 7AA", lookupRun: true, selectedGp: picked, nhsNumber: "",
};
assert.deepEqual(validateGpDetails(good), {}, "a picked practice completes the step");

// Not choosing at all stops there
const noChoice = validateGpDetails({ ...good, choice: "" });
assert.equal(noChoice.choice, "Please provide your GP details, or choose not to.");
assert.equal(noChoice.practicePostcode, undefined, "the choice error is reported on its own");

// Declining skips every field, however empty
assert.deepEqual(
  validateGpDetails({ ...good, choice: "decline", practicePostcode: "", selectedGp: "", lookupRun: false }),
  {},
);

// The lookup path, in order
const blank = validateGpDetails({ ...good, selectedGp: "", practicePostcode: "", lookupRun: false });
assert.equal(blank.practicePostcode, "Please provide your GP practice postcode.");
const badPc = validateGpDetails({ ...good, selectedGp: "", practicePostcode: "WC1E", lookupRun: false });
assert.equal(badPc.practicePostcode, "Postcode is not valid.");
const noPick = validateGpDetails({ ...good, selectedGp: "", lookupRun: true });
assert.equal(noPick.gp, "Please select a GP.");
// Before a lookup has run, not having picked is not yet an error
assert.equal(validateGpDetails({ ...good, selectedGp: "", lookupRun: false }).gp, undefined);
// A bad postcode is flagged before we ever ask about the selection
assert.ok(badPc.practicePostcode && !badPc.gp, "postcode error takes precedence");

// Once a practice is picked, a stale postcode cannot block the step
assert.deepEqual(validateGpDetails({ ...good, practicePostcode: "nonsense" }), {});

// NHS number is optional, and 10 digits when given
for (const ok of ["4857773456", "485 777 3456"]) assert.ok(isValidNhsNumber(ok), ok);
for (const bad of ["485777345", "48577734567", "485 777 34a6"]) assert.ok(!isValidNhsNumber(bad), bad);
assert.equal(validateGpDetails({ ...good, nhsNumber: "" }).nhsNumber, undefined, "blank is allowed");
assert.equal(
  validateGpDetails({ ...good, nhsNumber: "485 777 345" }).nhsNumber,
  "Please provide your 10-digit NHS number.",
);

// The practice list is real NHS ODS data, and round-trips through its label
assert.ok(GP_PRACTICES.length >= 15, `at least 15 practices, got ${GP_PRACTICES.length}`);
for (const p of GP_PRACTICES) {
  assert.ok(p.name.trim().length > 0, "every practice is named");
  assert.ok(p.lines.length >= 2, `${p.name} has a street and a town`);
  assert.match(p.postcode, /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/, `${p.name} has a real postcode`);
  // Was "every practice is in London". The fixture now covers Cambridge too, so
  // that a non-London postcode has something to find and the nearest-practice
  // path can be exercised. The real invariant was always "it names a town".
  assert.ok(
    p.lines.some((line) => line === "London" || line === "Cambridge"),
    `${p.name} names its town`,
  );
  assert.deepEqual(findPractice(practiceLabel(p)), p, `${p.name} round-trips`);
}
assert.equal(findPractice("Not A Real Surgery"), undefined);
assert.equal(new Set(GP_PRACTICES.map(practiceLabel)).size, GP_PRACTICES.length, "no duplicates");

// The declined note is lifted and must stay word for word
assert.match(GP_DECLINE_NOTE, /^We recommend having GP details saved to your profile/);
assert.match(GP_DECLINE_NOTE, /You will be asked for permission to do so every time\.$/);

// Each demo state raises exactly what it is named for
assert.ok(DEMO_GP_DETAILS.noChoice.errors.choice);
assert.ok(DEMO_GP_DETAILS.gpPostcodeMissing.errors.practicePostcode);
assert.equal(DEMO_GP_DETAILS.gpPostcodeInvalid.errors.practicePostcode, "Postcode is not valid.");
assert.equal(DEMO_GP_DETAILS.gpNotPicked.errors.gp, "Please select a GP.");
assert.deepEqual(DEMO_GP_DETAILS.gpSelected.errors, {});
assert.ok(DEMO_GP_DETAILS.nhsNumberTooShort.errors.nhsNumber);
assert.deepEqual(DEMO_GP_DETAILS.declined.errors, {});

// No em dashes anywhere
for (const state of Object.values(DEMO_GP_DETAILS)) {
  for (const msg of Object.values(state.errors)) assert.ok(!msg.includes("—"), `no em dash in: ${msg}`);
}
assert.ok(!GP_DECLINE_NOTE.includes("—"));

report("gp-details");
