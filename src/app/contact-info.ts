// Validation for the Contact info step of Set up your profile.
//
// The blank-mobile message is lifted from 1836:310518 and matches the file.
//
// The invalid-mobile message is a DELIBERATE divergence, on Janelle's call
// (24 Aug). The file (1836:310540) says only "Mobile number is not a valid
// number.", which tells someone nothing about what they got wrong. A UK mobile
// is 07 followed by 9 digits, 11 in total, so the messages below name the
// actual fault: wrong characters, wrong length, a landline, or a non-UK number.

export type ContactInfoErrors = {
  countryCode?: string;
  mobile?: string;
};

export type ContactInfoInput = {
  countryCode: string;
  mobile: string;
};

/** Strip the punctuation people paste off a contacts card. */
function clean(raw: string): string {
  return raw.replace(/[\s()\-.]/g, "");
}

/**
 * Reduce to the national number: +44 / 0044 / 44 all become a leading 0.
 * Returns null when the number is not addressed to the UK at all.
 */
function toNational(cleaned: string): string | null {
  if (cleaned.startsWith("+44")) return "0" + cleaned.slice(3);
  if (cleaned.startsWith("0044")) return "0" + cleaned.slice(4);
  if (cleaned.startsWith("0")) return cleaned;
  // A bare 44... is only a UK number if what follows looks like a mobile.
  if (cleaned.startsWith("44") && cleaned[2] === "7") return "0" + cleaned.slice(2);
  if (cleaned.startsWith("+")) return null;
  return cleaned;
}

// UK mobile: 07 followed by 9 digits.
const UK_MOBILE = /^07\d{9}$/;

export function isValidUkMobile(raw: string): boolean {
  const national = toNational(clean(raw));
  return national !== null && UK_MOBILE.test(national);
}

/** The specific reason a number is unusable, or null when it is fine. */
export function ukMobileProblem(raw: string): string | null {
  const cleaned = clean(raw);
  if (!cleaned) return "Please provide your mobile number.";

  if (/[^0-9+]/.test(cleaned) || cleaned.lastIndexOf("+") > 0) {
    return "Mobile numbers can only contain digits, spaces and a leading plus.";
  }

  const national = toNational(cleaned);
  if (national === null) {
    return "We can only text UK mobile numbers. Please provide one starting 07 or +44 7.";
  }

  if (!national.startsWith("07")) {
    // 01 and 02 are UK geographic ranges, 03 is non-geographic.
    if (/^0[123]/.test(national)) {
      return "That looks like a landline. Please provide a mobile number, starting 07 or +44 7.";
    }
    return "UK mobile numbers start 07, or +44 7 with the international code.";
  }

  const digits = national.length;
  if (digits < 11) {
    const short = 11 - digits;
    return `That number is ${short} digit${short === 1 ? "" : "s"} short. A UK mobile is 07 followed by 9 digits, 11 in total.`;
  }
  if (digits > 11) {
    const over = digits - 11;
    return `That number has ${over} digit${over === 1 ? "" : "s"} too many. A UK mobile is 07 followed by 9 digits, 11 in total.`;
  }

  return null;
}

export function validateContactInfo(input: ContactInfoInput): ContactInfoErrors {
  const e: ContactInfoErrors = {};
  if (!input.countryCode.trim()) e.countryCode = "Please provide your country code.";

  const problem = ukMobileProblem(input.mobile);
  if (problem) e.mobile = problem;

  return e;
}

const DEMO_INPUTS: Record<string, ContactInfoInput> = {
  missingMobile: { countryCode: "United Kingdom (+44)", mobile: "" },
  lettersInMobile: { countryCode: "United Kingdom (+44)", mobile: "07aaa" },
  landlineTyped: { countryCode: "United Kingdom (+44)", mobile: "0207 946 0958" },
  mobileTooShort: { countryCode: "United Kingdom (+44)", mobile: "07123 456" },
  mobileTooLong: { countryCode: "United Kingdom (+44)", mobile: "+44 7123 456 7890" },
  nonUkNumber: { countryCode: "United Kingdom (+44)", mobile: "+1 555 0100" },
};

export const DEMO_CONTACT_INFO: Record<string, { input: ContactInfoInput; errors: ContactInfoErrors }> =
  Object.fromEntries(
    Object.entries(DEMO_INPUTS).map(([k, input]) => [k, { input, errors: validateContactInfo(input) }]),
  );
