// Validation for the Payment details step.
//
// Copy lifted from the Voucher section of 1946:117507:
//   1946:149652  the form, its labels and placeholders
//   2171:120980  "Payment failed" / "Your payment could not be completed.
//                Please try again."  the gateway-level failure box
//
// The field-level messages below have NO frame. The file draws only the
// gateway failure, so the per-field wording follows the house "provide"
// pattern, same caveat as GP details and emergency contact. See AUDIT.

import { isValidPostcode } from "./personal-details.ts";

export type PaymentErrors = {
  nameOnCard?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  country?: string;
  billingPostcode?: string;
};

export type PaymentInput = {
  nameOnCard: string;
  cardNumber: string;
  /** MM/YYYY, as the placeholder asks for. */
  expiry: string;
  cvv: string;
  country: string;
  billingPostcode: string;
};

/** The amount the button quotes, per 1946:149657. */
export const PAYMENT_AMOUNT = "£10";

export type CardBrand = "amex" | "visa" | "mastercard" | "unknown";

const digitsOnly = (v: string) => v.replace(/\D/g, "");

export function cardBrand(raw: string): CardBrand {
  const n = digitsOnly(raw);
  if (/^3[47]/.test(n)) return "amex";
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(n)) return "mastercard";
  return "unknown";
}

/** Amex security codes are four digits, everything else is three. */
export function cvvLengthFor(brand: CardBrand): number {
  return brand === "amex" ? 4 : 3;
}

/**
 * The Luhn checksum every card number satisfies. Catches a mistyped or
 * transposed digit, which a length check alone does not.
 */
export function passesLuhn(raw: string): boolean {
  const n = digitsOnly(raw);
  if (n.length < 12) return false;
  let sum = 0;
  let double = false;
  for (let i = n.length - 1; i >= 0; i -= 1) {
    let d = Number(n[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

/** Groups a card number for display: 4-4-4-4, or 4-6-5 for Amex. */
export function formatCardNumber(raw: string): string {
  const n = digitsOnly(raw).slice(0, 19);
  const groups = cardBrand(n) === "amex" ? [4, 6, 5] : [4, 4, 4, 4, 3];
  const out: string[] = [];
  let i = 0;
  for (const size of groups) {
    if (i >= n.length) break;
    out.push(n.slice(i, i + size));
    i += size;
  }
  return out.join(" ");
}

/** Inserts the slash as the month is typed, so MM/YYYY needs no keying. */
export function maskExpiry(raw: string): string {
  const n = digitsOnly(raw).slice(0, 6);
  if (n.length <= 2) return n;
  return `${n.slice(0, 2)}/${n.slice(2)}`;
}

export type ExpiryFault = "format" | "month" | "past" | null;

export function expiryFault(raw: string, today = new Date()): ExpiryFault {
  const m = raw.trim().match(/^(\d{2})\/(\d{4})$/);
  if (!m) return "format";
  const month = Number(m[1]);
  const year = Number(m[2]);
  if (month < 1 || month > 12) return "month";
  // A card is good through the last day of its expiry month.
  const endOfMonth = new Date(year, month, 0);
  const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return endOfMonth < midnight ? "past" : null;
}

export function validatePayment(input: PaymentInput, today = new Date()): PaymentErrors {
  const e: PaymentErrors = {};

  if (!input.nameOnCard.trim()) e.nameOnCard = "Please provide the name on your card.";

  const number = digitsOnly(input.cardNumber);
  if (!number) e.cardNumber = "Please provide your card number.";
  else if (input.cardNumber.replace(/[\s-]/g, "") !== number)
    e.cardNumber = "Card numbers can only contain digits and spaces.";
  else if (number.length < 13 || number.length > 19)
    e.cardNumber = "That card number is the wrong length. Check the long number across the front.";
  else if (!passesLuhn(number))
    e.cardNumber = "That card number is not valid. Please check it and try again.";

  const fault = expiryFault(input.expiry, today);
  if (!input.expiry.trim()) e.expiry = "Please provide your card's expiry date.";
  else if (fault === "format") e.expiry = "Please provide the expiry date as MM/YYYY.";
  else if (fault === "month") e.expiry = "There is no such month. The first two digits are the month.";
  else if (fault === "past") e.expiry = "That card has expired. Please use a card that is still in date.";

  const cvv = digitsOnly(input.cvv);
  const wanted = cvvLengthFor(cardBrand(input.cardNumber));
  if (!input.cvv.trim()) e.cvv = "Please provide the security code.";
  else if (input.cvv.trim() !== cvv) e.cvv = "The security code is digits only.";
  else if (cvv.length !== wanted)
    e.cvv = `The security code is ${wanted} digits, on the ${wanted === 4 ? "front" : "back"} of your card.`;

  if (!input.country.trim()) e.country = "Please select a country.";

  if (!input.billingPostcode.trim()) e.billingPostcode = "Please provide your billing postcode.";
  else if (input.country === "United Kingdom" && !isValidPostcode(input.billingPostcode))
    e.billingPostcode = "Postcode is not valid.";

  return e;
}

// Lifted from 2171:120980.
export const PAYMENT_FAILED_TITLE = "Payment failed";
export const PAYMENT_FAILED_BODY = "Your payment could not be completed. Please try again.";

/**
 * A card the demo declines, so the failure box can be shown on purpose.
 * Passes Luhn and every field check, and is rejected at the gateway step,
 * which is how a real decline behaves.
 */
export const DECLINED_CARD = "4000 0000 0000 0002";

export function isDeclined(cardNumber: string): boolean {
  return digitsOnly(cardNumber) === digitsOnly(DECLINED_CARD);
}

const GOOD: PaymentInput = {
  nameOnCard: "Jane Smith",
  cardNumber: "4242 4242 4242 4242",
  expiry: "04/2030",
  cvv: "123",
  country: "United Kingdom",
  billingPostcode: "W1W 8QB",
};

// The mistakes this form actually sees, each with the input that caused it.
const DEMO_INPUTS: Record<string, PaymentInput> = {
  allBlank: { nameOnCard: "", cardNumber: "", expiry: "", cvv: "", country: "United Kingdom", billingPostcode: "" },
  cardMistyped: { ...GOOD, cardNumber: "4242 4242 4242 4243" },
  cardTooShort: { ...GOOD, cardNumber: "4242 4242" },
  expiryPast: { ...GOOD, expiry: "04/2020" },
  expiryMonth: { ...GOOD, expiry: "13/2030" },
  cvvTooShort: { ...GOOD, cvv: "12" },
  amexCvvThree: { ...GOOD, cardNumber: "3782 822463 10005", cvv: "123" },
  postcodeInvalid: { ...GOOD, billingPostcode: "W1W" },
  declined: { ...GOOD, cardNumber: DECLINED_CARD },
};

export const DEMO_PAYMENT: Record<string, { input: PaymentInput; errors: PaymentErrors }> =
  Object.fromEntries(
    Object.entries(DEMO_INPUTS).map(([k, input]) => [k, { input, errors: validatePayment(input, new Date(2026, 7, 24)) }]),
  );
