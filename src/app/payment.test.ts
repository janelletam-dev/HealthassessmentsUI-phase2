import { check as assert, report } from "./assertions.ts";
import {
  validatePayment, passesLuhn, cardBrand, cvvLengthFor, formatCardNumber,
  maskExpiry, expiryFault, isDeclined, DECLINED_CARD,
  PAYMENT_AMOUNT, PAYMENT_FAILED_TITLE, PAYMENT_FAILED_BODY, DEMO_PAYMENT,
} from "./payment.ts";

// Fixed today so these do not rot
const TODAY = new Date(2026, 7, 24);
const GOOD = {
  nameOnCard: "Jane Smith", cardNumber: "4242 4242 4242 4242", expiry: "04/2030",
  cvv: "123", country: "United Kingdom", billingPostcode: "W1W 8QB",
};
assert.deepEqual(validatePayment(GOOD, TODAY), {}, "a complete card has no errors");

// ─── Luhn ────────────────────────────────────────────────────────────────────
// Real test numbers, which are published for exactly this purpose
for (const ok of ["4242424242424242", "5555555555554444", "378282246310005", "6011111111111117"]) {
  assert.ok(passesLuhn(ok), `${ok} passes Luhn`);
}
// A single transposed or mistyped digit must fail, which length alone misses
for (const bad of ["4242424242424243", "4242424242424422", "1234567812345678"]) {
  assert.ok(!passesLuhn(bad), `${bad} fails Luhn`);
}
assert.ok(!passesLuhn(""), "empty fails");
assert.ok(!passesLuhn("42424242"), "too short to be a card");
assert.ok(passesLuhn("4242 4242 4242 4242"), "spaces are ignored");

// ─── Brand and security code length ──────────────────────────────────────────
assert.equal(cardBrand("378282246310005"), "amex");
assert.equal(cardBrand("371449635398431"), "amex");
assert.equal(cardBrand("4242424242424242"), "visa");
assert.equal(cardBrand("5555555555554444"), "mastercard");
assert.equal(cardBrand("2223003122003222"), "mastercard", "the 2-series is Mastercard too");
assert.equal(cardBrand("6011111111111117"), "unknown");
assert.equal(cvvLengthFor("amex"), 4, "Amex codes are four digits");
for (const b of ["visa", "mastercard", "unknown"] as const) assert.equal(cvvLengthFor(b), 3);

// An Amex with a three-digit code is caught, and told the right length
const amex = validatePayment({ ...GOOD, cardNumber: "3782 822463 10005", cvv: "123" }, TODAY);
assert.match(amex.cvv ?? "", /4 digits/, "Amex wants four");
assert.match(amex.cvv ?? "", /front/, "and they are on the front");
assert.deepEqual(
  validatePayment({ ...GOOD, cardNumber: "3782 822463 10005", cvv: "1234" }, TODAY), {},
  "four digits satisfies an Amex",
);
assert.match(validatePayment({ ...GOOD, cvv: "1234" }, TODAY).cvv ?? "", /3 digits/, "but not a Visa");

// ─── Grouping and the expiry mask ────────────────────────────────────────────
assert.equal(formatCardNumber("4242424242424242"), "4242 4242 4242 4242");
assert.equal(formatCardNumber("378282246310005"), "3782 822463 10005", "Amex groups 4-6-5");
assert.equal(formatCardNumber("4242"), "4242");
assert.equal(formatCardNumber(""), "");
assert.equal(formatCardNumber("4242abc4242"), "4242 4242", "letters are dropped");

assert.equal(maskExpiry("0"), "0");
assert.equal(maskExpiry("04"), "04");
assert.equal(maskExpiry("042"), "04/2");
assert.equal(maskExpiry("042030"), "04/2030");
assert.equal(maskExpiry("04/2030"), "04/2030", "already masked stays put");
assert.equal(maskExpiry("0420301234"), "04/2030", "excess digits are dropped");

// ─── Expiry ──────────────────────────────────────────────────────────────────
assert.equal(expiryFault("04/2030", TODAY), null);
assert.equal(expiryFault("08/2026", TODAY), null, "the current month is still valid");
assert.equal(expiryFault("07/2026", TODAY), "past", "last month has gone");
assert.equal(expiryFault("04/2020", TODAY), "past");
assert.equal(expiryFault("13/2030", TODAY), "month");
assert.equal(expiryFault("00/2030", TODAY), "month");
assert.equal(expiryFault("4/2030", TODAY), "format", "not zero padded");
assert.equal(expiryFault("04/30", TODAY), "format", "two digit year is not MM/YYYY");
assert.equal(expiryFault("", TODAY), "format");

// ─── Field-level messages ────────────────────────────────────────────────────
const blank = validatePayment(
  { nameOnCard: "", cardNumber: "", expiry: "", cvv: "", country: "", billingPostcode: "" }, TODAY);
assert.equal(blank.nameOnCard, "Please provide the name on your card.");
assert.equal(blank.cardNumber, "Please provide your card number.");
assert.equal(blank.expiry, "Please provide your card's expiry date.");
assert.equal(blank.cvv, "Please provide the security code.");
assert.equal(blank.country, "Please select a country.");
assert.equal(blank.billingPostcode, "Please provide your billing postcode.");

assert.match(validatePayment({ ...GOOD, cardNumber: "4242 4242 4242 4243" }, TODAY).cardNumber ?? "", /not valid/);
assert.match(validatePayment({ ...GOOD, cardNumber: "4242 4242" }, TODAY).cardNumber ?? "", /wrong length/);
assert.match(validatePayment({ ...GOOD, cardNumber: "4242abcd42424242" }, TODAY).cardNumber ?? "", /digits and spaces/);
assert.match(validatePayment({ ...GOOD, cvv: "12a" }, TODAY).cvv ?? "", /digits only/);

// Billing postcode is only checked as UK when the country is the UK
assert.equal(validatePayment({ ...GOOD, billingPostcode: "W1W" }, TODAY).billingPostcode, "Postcode is not valid.");
assert.equal(
  validatePayment({ ...GOOD, country: "France", billingPostcode: "75008" }, TODAY).billingPostcode,
  undefined,
  "a French postcode is not held to the UK format",
);

// ─── The declined card ───────────────────────────────────────────────────────
// It must pass every field check, so the decline is a gateway outcome and not
// a validation one. That is what makes the failure box demonstrable.
assert.deepEqual(validatePayment({ ...GOOD, cardNumber: DECLINED_CARD }, TODAY), {});
assert.ok(passesLuhn(DECLINED_CARD), "the declined card is a well-formed number");
assert.ok(isDeclined(DECLINED_CARD));
assert.ok(isDeclined("4000000000000002"), "spacing does not matter");
assert.ok(!isDeclined(GOOD.cardNumber), "the good card is not declined");

// ─── Copy lifted from 2171:120980 and 1946:149657 ────────────────────────────
assert.equal(PAYMENT_FAILED_TITLE, "Payment failed");
assert.equal(PAYMENT_FAILED_BODY, "Your payment could not be completed. Please try again.");
assert.equal(PAYMENT_AMOUNT, "£10");

// ─── Demo states raise what they are named for ───────────────────────────────
assert.equal(Object.keys(DEMO_PAYMENT.allBlank.errors).length, 5, "country is prefilled, so five blanks");
assert.ok(DEMO_PAYMENT.cardMistyped.errors.cardNumber);
assert.ok(DEMO_PAYMENT.cardTooShort.errors.cardNumber);
assert.ok(DEMO_PAYMENT.expiryPast.errors.expiry);
assert.ok(DEMO_PAYMENT.expiryMonth.errors.expiry);
assert.ok(DEMO_PAYMENT.cvvTooShort.errors.cvv);
assert.ok(DEMO_PAYMENT.amexCvvThree.errors.cvv);
assert.ok(DEMO_PAYMENT.postcodeInvalid.errors.billingPostcode);
assert.deepEqual(DEMO_PAYMENT.declined.errors, {}, "the declined card is valid, it just fails at the gateway");

// No em dashes anywhere
for (const state of Object.values(DEMO_PAYMENT)) {
  for (const msg of Object.values(state.errors)) assert.ok(!msg.includes("—"), `no em dash in: ${msg}`);
}
assert.ok(!PAYMENT_FAILED_BODY.includes("—"));

report("payment");
