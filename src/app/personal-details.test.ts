import { check as assert, report } from "./assertions.ts";
import { validatePersonalDetails, isValidPostcode, DEMO_PERSONAL_DETAILS } from "./personal-details.ts";

const good = {
  sex: "Female", country: "United Kingdom", postcode: "W1W 8QB",
  selectedAddress: "1 Example Street", lookupRun: true,
  manual: false, addressLine1: "", addressLine2: "", townOrCity: "",
};
assert.deepEqual(validatePersonalDetails(good), {}, "a complete form has no errors");

// Postcodes people actually type
for (const ok of ["W1W 8QB", "w1w8qb", "SW1A 1AA", "M1 1AE", "B33 8TH", "CR2 6XH", "AA1 1AA"]) {
  assert.ok(isValidPostcode(ok), `${ok} is valid`);
}
for (const bad of ["", "W1W", "W1W8Q", "12345", "123", "ZZZZ ZZZ"]) {
  assert.ok(!isValidPostcode(bad), `${bad} is not valid`);
}

// Copy comes from the Figma error frames verbatim
assert.equal(
  validatePersonalDetails({ ...good, sex: "" }).sex,
  "Please provide your sex at birth.",
);
assert.equal(
  validatePersonalDetails({ ...good, selectedAddress: "", lookupRun: false, postcode: "" }).postcode,
  "Please provide your postcode.",
);
assert.equal(
  validatePersonalDetails({ ...good, selectedAddress: "", lookupRun: false, postcode: "123" }).postcode,
  "Postcode is not valid.",
);

// Running a lookup and not picking a result is its own error
const noPick = validatePersonalDetails({ ...good, selectedAddress: "", lookupRun: true });
assert.equal(noPick.address, "Please select an address.");  // lifted from 2052:116680
// but before a lookup has run, not having picked is not yet an error
assert.equal(validatePersonalDetails({ ...good, selectedAddress: "", lookupRun: false }).address, undefined);

// An invalid postcode is flagged before we ever ask about selection
const badPc = validatePersonalDetails({ ...good, postcode: "W1W8Q", selectedAddress: "", lookupRun: true });
assert.ok(badPc.postcode && !badPc.address, "postcode error takes precedence");

// Once an address has been picked the postcode field is off screen, so a stale
// postcode value can no longer block the step
assert.deepEqual(validatePersonalDetails({ ...good, postcode: "123" }), {});

// Manual entry checks its own four fields and ignores the lookup ones
const manualBlank = validatePersonalDetails({
  ...good, manual: true, selectedAddress: "", lookupRun: false,
  country: "", postcode: "", addressLine1: "", townOrCity: "",
});
assert.equal(manualBlank.addressLine1, "Please provide the first line of your address.");
assert.equal(manualBlank.townOrCity, "Please provide your town or city.");
assert.equal(manualBlank.postcode, "Please provide your postcode.");
assert.equal(manualBlank.country, "Please select a country.");
assert.equal(manualBlank.address, undefined, "manual entry never asks about the lookup list");

// Address line 2 is optional
const manualFilled = validatePersonalDetails({
  ...good, manual: true, selectedAddress: "", lookupRun: false,
  addressLine1: "19 Great Portland Street", addressLine2: "", townOrCity: "London", postcode: "W1W 8QB",
});
assert.deepEqual(manualFilled, {}, "a complete manual address has no errors");

// Each demo state raises exactly what it is named for
assert.ok(DEMO_PERSONAL_DETAILS.missingData.errors.sex && DEMO_PERSONAL_DETAILS.missingData.errors.postcode);
assert.ok(DEMO_PERSONAL_DETAILS.invalidPostcode.errors.postcode && !DEMO_PERSONAL_DETAILS.invalidPostcode.errors.sex);
assert.ok(DEMO_PERSONAL_DETAILS.missingSelection.errors.address && !DEMO_PERSONAL_DETAILS.missingSelection.errors.postcode);
assert.ok(DEMO_PERSONAL_DETAILS.manualMissingData.errors.addressLine1 && DEMO_PERSONAL_DETAILS.manualMissingData.errors.country);
assert.deepEqual(DEMO_PERSONAL_DETAILS.addressSelected.errors, {}, "a picked address clears the step");

// No em dashes anywhere
for (const state of Object.values(DEMO_PERSONAL_DETAILS)) {
  for (const msg of Object.values(state.errors)) assert.ok(!msg.includes("—"), `no em dash in: ${msg}`);
}

report("personal-details");
