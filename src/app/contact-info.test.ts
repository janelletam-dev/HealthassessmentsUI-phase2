import { check as assert, report } from "./assertions.ts";
import { validateContactInfo, isValidUkMobile, ukMobileProblem, DEMO_CONTACT_INFO } from "./contact-info.ts";

const good = { countryCode: "United Kingdom (+44)", mobile: "07123 456 789" };
assert.deepEqual(validateContactInfo(good), {}, "a complete form has no errors");

// The formats people actually paste
for (const ok of [
  "07123456789", "07123 456 789", "+447123456789", "+44 7123 456789",
  "447123456789", "0044 7123 456789", "(07123) 456-789", "07123.456.789",
]) {
  assert.ok(isValidUkMobile(ok), `${ok} is valid`);
  assert.equal(ukMobileProblem(ok), null, `${ok} has no problem`);
}

// 07 plus exactly 9 digits, 11 in total
assert.ok(isValidUkMobile("07000000000"));
assert.ok(!isValidUkMobile("0700000000"), "ten digits is too short");
assert.ok(!isValidUkMobile("070000000000"), "twelve digits is too long");

// Blank is lifted from 1836:310518 and must stay word for word
assert.equal(ukMobileProblem(""), "Please provide your mobile number.");
assert.equal(ukMobileProblem("   "), "Please provide your mobile number.");

// Each fault names itself rather than saying "not a valid number"
assert.match(ukMobileProblem("07aaa") ?? "", /digits, spaces and a leading plus/);
assert.match(ukMobileProblem("07123 45/6 789") ?? "", /digits, spaces and a leading plus/);
assert.match(ukMobileProblem("0207 946 0958") ?? "", /looks like a landline/);
assert.match(ukMobileProblem("0300 123 4567") ?? "", /looks like a landline/);
assert.match(ukMobileProblem("+1 555 0100") ?? "", /only text UK mobile numbers/);
assert.match(ukMobileProblem("08123 456 789") ?? "", /start 07/);

// Length messages count the actual shortfall, and get the plural right
assert.match(ukMobileProblem("07123 456") ?? "", /3 digits short/);   // 8 digits
assert.match(ukMobileProblem("0712345678") ?? "", /1 digit short/);   // 10 digits
assert.ok(!(ukMobileProblem("0712345678") ?? "").includes("1 digits"), "singular, not '1 digits'");
assert.match(ukMobileProblem("+44 7123 456 7890") ?? "", /1 digit too many/);
assert.match(ukMobileProblem("071234567890123") ?? "", /4 digits too many/);

// Every length message states the rule so the person can act on it
for (const bad of ["07123 456", "0712345678", "+44 7123 456 7890"]) {
  assert.match(ukMobileProblem(bad) ?? "", /07 followed by 9 digits, 11 in total/, bad);
}

// A missing country code is reported on its own field
assert.equal(
  validateContactInfo({ ...good, countryCode: "" }).countryCode,
  "Please provide your country code.",
);

// Each demo state raises exactly what it is named for
assert.equal(DEMO_CONTACT_INFO.missingMobile.errors.mobile, "Please provide your mobile number.");
assert.match(DEMO_CONTACT_INFO.lettersInMobile.errors.mobile ?? "", /digits, spaces/);
assert.match(DEMO_CONTACT_INFO.landlineTyped.errors.mobile ?? "", /landline/);
assert.match(DEMO_CONTACT_INFO.mobileTooShort.errors.mobile ?? "", /3 digits short/);
assert.match(DEMO_CONTACT_INFO.mobileTooLong.errors.mobile ?? "", /1 digit too many/);
assert.match(DEMO_CONTACT_INFO.nonUkNumber.errors.mobile ?? "", /UK mobile numbers/);

// No em dashes anywhere
for (const state of Object.values(DEMO_CONTACT_INFO)) {
  for (const msg of Object.values(state.errors)) assert.ok(!msg.includes("—"), `no em dash in: ${msg}`);
}

report("contact-info");
