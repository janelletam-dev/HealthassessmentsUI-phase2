import { check as assert, report } from "./assertions.ts";
import {
  validateEmergencyContact,
  RELATIONSHIP_OPTIONS,
  DEMO_EMERGENCY_CONTACT,
} from "./emergency-contact.ts";

const good = {
  choice: "provide" as const,
  name: "Jane Smith",
  countryCode: "United Kingdom (+44)",
  mobile: "07123 456 789",
  relationship: "Sibling",
};
assert.deepEqual(validateEmergencyContact(good), {}, "a complete contact has no errors");

// Declining skips every field check, however empty they are
assert.deepEqual(
  validateEmergencyContact({ ...good, choice: "decline", name: "", mobile: "", relationship: "" }),
  {},
  "declining clears the step",
);

// Not choosing at all is its own error and stops there
const noChoice = validateEmergencyContact({ ...good, choice: "" });
assert.equal(noChoice.choice, "Please provide an emergency contact, or choose not to.");
assert.equal(noChoice.name, undefined, "the choice error is reported on its own");

// Copy comes from the Figma error frame verbatim
assert.equal(
  validateEmergencyContact({ ...good, mobile: "07aaa" }).mobile,
  "Mobile number is not a valid number.",
);
// A blank mobile is a different message from an unusable one
assert.equal(
  validateEmergencyContact({ ...good, mobile: "" }).mobile,
  "Please provide their mobile number.",
);

// The same UK mobile rule the contact info step uses
for (const bad of ["0207 946 0958", "07123 456", "+1 555 0100", "07aaa"]) {
  assert.ok(validateEmergencyContact({ ...good, mobile: bad }).mobile, `${bad} is rejected`);
}
for (const ok of ["07123456789", "+447123456789", "447123456789", "07123 456 789"]) {
  assert.equal(validateEmergencyContact({ ...good, mobile: ok }).mobile, undefined, `${ok} is accepted`);
}

// Name and relationship are both required once you choose to provide
assert.equal(validateEmergencyContact({ ...good, name: "  " }).name, "Please provide their name.");
assert.equal(
  validateEmergencyContact({ ...good, relationship: "" }).relationship,
  "Please select their relationship to you.",
);

// The dropdown is the file's list, in the file's order
assert.deepEqual(RELATIONSHIP_OPTIONS, ["Parent/Guardian", "Sibling", "Spouse", "Child", "Friend", "Other"]);

// Each demo state raises exactly what it is named for
assert.ok(DEMO_EMERGENCY_CONTACT.noChoice.errors.choice);
assert.ok(DEMO_EMERGENCY_CONTACT.detailsMissing.errors.name && DEMO_EMERGENCY_CONTACT.detailsMissing.errors.relationship);
assert.equal(DEMO_EMERGENCY_CONTACT.lettersInMobile.errors.mobile, "Mobile number is not a valid number.");
assert.ok(DEMO_EMERGENCY_CONTACT.relationshipNotPicked.errors.relationship && !DEMO_EMERGENCY_CONTACT.relationshipNotPicked.errors.mobile);
assert.deepEqual(DEMO_EMERGENCY_CONTACT.declined.errors, {});

// No em dashes anywhere
for (const state of Object.values(DEMO_EMERGENCY_CONTACT)) {
  for (const msg of Object.values(state.errors)) assert.ok(!msg.includes("—"), `no em dash in: ${msg}`);
}

report("emergency-contact");
