// Validation for the Personal details step of Set up your profile.
//
// Copy is taken from the Figma error frames, not written here. Each node id now
// sits BESIDE its string rather than in this header: a header citation tells
// you the file was read, not which frame a given sentence came from, which is
// the whole point of the convention in copy-provenance.ts. These ten were 10 of
// the 51 on the ratchet purely because of where the ids lived.
//
//   2052:113973  Error, missing data
//   2052:114800  Error, invalid data
//   2052:116680  Address not selected
//   1836:310250  Manual input, missing data

export type PersonalDetailsErrors = {
  sex?: string;
  country?: string;
  postcode?: string;
  address?: string;
  addressLine1?: string;
  townOrCity?: string;
};

export type PersonalDetailsInput = {
  sex: string;
  country: string;
  postcode: string;
  /** Which address the person picked from the lookup, if any. */
  selectedAddress: string;
  /** True once a lookup has actually been run for the current postcode. */
  lookupRun: boolean;
  /** True when the person switched to typing the address out themselves. */
  manual: boolean;
  addressLine1: string;
  addressLine2: string;
  townOrCity: string;
};

// UK postcode, loose enough to accept the real formats without being a parser.
const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

export function isValidPostcode(v: string): boolean {
  return UK_POSTCODE.test(v.trim());
}

export function validatePersonalDetails(input: PersonalDetailsInput): PersonalDetailsErrors {
  const e: PersonalDetailsErrors = {};
  // 2052:113973
  if (!input.sex) e.sex = "Please provide your sex at birth.";

  if (input.manual) {
    // 1836:310250, the manual-input frame
    if (!input.addressLine1.trim()) e.addressLine1 = "Please provide the first line of your address.";
    // 1836:310250
    if (!input.townOrCity.trim()) e.townOrCity = "Please provide your town or city.";
    // 2052:113973
    if (!input.postcode.trim()) e.postcode = "Please provide your postcode.";
    // 2052:114800
    else if (!isValidPostcode(input.postcode)) e.postcode = "Postcode is not valid.";
    // 1836:310250
    if (!input.country.trim()) e.country = "Please select a country.";
    return e;
  }

  // The lookup path is finished once an address has been picked, so the
  // postcode field is no longer on screen and no longer worth checking.
  if (input.selectedAddress) return e;

  // 1836:310250
  if (!input.country.trim()) e.country = "Please select a country.";
  // 2052:113973
  if (!input.postcode.trim()) e.postcode = "Please provide your postcode.";
  // 2052:114800
  else if (!isValidPostcode(input.postcode)) e.postcode = "Postcode is not valid.";
  // 2052:116680
  else if (input.lookupRun) e.address = "Please select an address.";

  return e;
}

const BLANK: PersonalDetailsInput = {
  sex: "", country: "", postcode: "", selectedAddress: "", lookupRun: false,
  manual: false, addressLine1: "", addressLine2: "", townOrCity: "",
};

// The mistakes this form actually sees, each with the input that caused it.
const DEMO_INPUTS: Record<string, PersonalDetailsInput> = {
  missingData: { ...BLANK, country: "United Kingdom" },
  invalidPostcode: { ...BLANK, sex: "Female", country: "United Kingdom", postcode: "123" },
  missingSelection: { ...BLANK, sex: "Female", country: "United Kingdom", postcode: "AA1 1AA", lookupRun: true },
  manualMissingData: { ...BLANK, sex: "Female", manual: true },
  addressSelected: {
    ...BLANK, sex: "Female", country: "United Kingdom", postcode: "AA1 1AA", lookupRun: true,
    selectedAddress: "123 Main Street\nFlat 45\nCity/Town\nAA1 1AA",
  },
};

export const DEMO_PERSONAL_DETAILS: Record<string, { input: PersonalDetailsInput; errors: PersonalDetailsErrors }> =
  Object.fromEntries(
    Object.entries(DEMO_INPUTS).map(([k, input]) => [k, { input, errors: validatePersonalDetails(input) }]),
  );
