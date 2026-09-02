// Validation for the GP details step of Set up your profile.
//
// The six frames in this column (1836:310056 to 2191:86511) show a postcode
// lookup, a GP select, a selected-practice card and a declined state. None of
// them shows an error, so the wording below follows the house pattern, except
// "Postcode is not valid." which is lifted from the equivalent field on
// personal details (2052:114800).

import { isValidPostcode } from "./personal-details.ts";

export type GpChoice = "" | "provide" | "decline";

export type GpDetailsErrors = {
  choice?: string;
  practicePostcode?: string;
  gp?: string;
  nhsNumber?: string;
};

export type GpDetailsInput = {
  choice: GpChoice;
  practicePostcode: string;
  /** True once a lookup has run for the current postcode. */
  lookupRun: boolean;
  /** The practice picked from the lookup, as a one-line label. */
  selectedGp: string;
  nhsNumber: string;
};

/** NHS numbers are 10 digits, usually written 000 000 0000. */
export function isValidNhsNumber(raw: string): boolean {
  return /^\d{10}$/.test(raw.replace(/\s/g, ""));
}

// Lifted from the declined radio on 2191:86126.
export const GP_DECLINE_NOTE =
  "We recommend having GP details saved to your profile so that our clinicians can share information with them if and when needed. You will be asked for permission to do so every time.";

export function validateGpDetails(input: GpDetailsInput): GpDetailsErrors {
  const e: GpDetailsErrors = {};

  if (!input.choice) {
    e.choice = "Please provide your GP details, or choose not to.";
    return e;
  }
  if (input.choice === "decline") return e;

  // Once a practice is picked the lookup fields are off screen, so only the
  // optional NHS number is still worth checking.
  if (!input.selectedGp) {
    if (!input.practicePostcode.trim()) e.practicePostcode = "Please provide your GP practice postcode.";
    else if (!isValidPostcode(input.practicePostcode)) e.practicePostcode = "Postcode is not valid.";
    else if (input.lookupRun) e.gp = "Please select a GP.";
  }

  if (input.nhsNumber.trim() && !isValidNhsNumber(input.nhsNumber)) {
    e.nhsNumber = "Please provide your 10-digit NHS number.";
  }

  return e;
}

const BLANK: GpDetailsInput = {
  choice: "", practicePostcode: "", lookupRun: false, selectedGp: "", nhsNumber: "",
};

const SELECTED = "Ridgmount Practice, 8 Ridgmount Street, London, WC1E 7AA";

// The mistakes this form actually sees, each with the input that caused it.
const DEMO_INPUTS: Record<string, GpDetailsInput> = {
  noChoice: { ...BLANK },
  gpPostcodeMissing: { ...BLANK, choice: "provide" },
  gpPostcodeInvalid: { ...BLANK, choice: "provide", practicePostcode: "WC1E" },
  gpNotPicked: { ...BLANK, choice: "provide", practicePostcode: "WC1E 7AA", lookupRun: true },
  gpSelected: { ...BLANK, choice: "provide", practicePostcode: "WC1E 7AA", lookupRun: true, selectedGp: SELECTED },
  nhsNumberTooShort: { ...BLANK, choice: "provide", practicePostcode: "WC1E 7AA", lookupRun: true, selectedGp: SELECTED, nhsNumber: "485 777 345" },
  declined: { ...BLANK, choice: "decline" },
};

export const DEMO_GP_DETAILS: Record<string, { input: GpDetailsInput; errors: GpDetailsErrors }> =
  Object.fromEntries(
    Object.entries(DEMO_INPUTS).map(([k, input]) => [k, { input, errors: validateGpDetails(input) }]),
  );
