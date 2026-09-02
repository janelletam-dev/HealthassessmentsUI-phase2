// The activation-code errors from the design, and the demo codes that trigger
// them. Codes are matched case-sensitively on purpose: "Abc-12345" is what
// demonstrates the case-sensitivity message.
//
// THE DEMO CODES ARE DELIBERATELY NOT REAL FORMATS. Confirmed with Janelle,
// 24 Aug 2026. Do not "correct" them.
//
// Real AXA codes look like this:
//
//   AXA-RA003032   AXA Health Plan — a group of health plan members.
//                  Hyphen. Maps to the AXA HP LC frames, 1946:150091.
//   AXA/S9862901   An AXA voucher. Slash. Membership number used as a code.
//   HOL/H1214301   An AXA voucher. Slash. Membership number used as a code.
//                  DCA does not hold AXA SME company names.
//
//                  NEITHER SLASH PREFIX SAYS WHICH VOUCHER. These two lines
//                  used to read "AXA Individual" and "AXA SME" as if the prefix
//                  settled it, which contradicted journeys.ts once the two
//                  voucher journeys merged. Janelle, 26 Aug: "HOL could be axa
//                  sme and ind, not lcdb/hp". journeys.ts is the rule; this is
//                  a comment about example shapes, and it now agrees with it.
//
// DIGITS ALTERED. Because an AXA Individual or SME voucher code *is* the
// member's membership number, the examples Janelle gave in session were live
// identifiers. The shapes above are what detection keys on; the values are not
// real and must not be "restored" from a message or a ticket.
//
// Both voucher journeys map to the Voucher frames, 1946:149321, and a Lead is
// created a few days after activation — which is why the "with DoB in CRM"
// branch lives in the Lead section: by the time someone signs up, a record
// exists. See crmHasDob in App.tsx.
//
// Two demo codes look nearly real and are meant to:
//
//   "Abc-12345"   lower case on purpose. Real codes are upper case, so this is
//                 what makes the case-sensitivity message fire.
//   "HOL/234567"  the SME prefix with a shorter body than a real code. Close
//                 enough to read as plausible, not close enough to be mistaken
//                 for a live membership number.
//
// The frames draw "ABC-12345" throughout, so the generic codes also keep the
// prototype aligned with the design rather than with production data.

export type CodeErrorId = "code-used" | "code-not-recognised" | "invalid-code" | "code-lapsed";

export type CodeError = {
  title: string;
  bodyBefore: string;
  linkLabel?: string;
  bodyAfter?: string;
};

export const CODE_ERRORS: Record<CodeErrorId, CodeError> = {
  "code-used": {
    title: "Code already used",
    bodyBefore: "Activation codes are unique and single-use. Do you want to ",
    linkLabel: "log in",
    bodyAfter: " instead?",
  },
  "code-not-recognised": {
    title: "Code not recognised",
    bodyBefore: "Please note that your activation code is case-sensitive.",
  },
  "invalid-code": {
    title: "Invalid code",
    // 1800:155031, shown against ABC-123456
    bodyBefore:
      "Sorry, something went wrong. We're unable to validate this activation code. Please check your membership documents and try again.",
  },
  "code-lapsed": {
    title: "Invalid code",
    // 1800:155001, shown against 9876543L. Same title, different body: the
    // file distinguishes a code it cannot read from one it can read and has
    // withdrawn. Both were mapped to the first body until 24 Aug.
    bodyBefore:
      "Sorry, something went wrong. We can't activate your invite with this code. It has either lapsed or been cancelled.",
  },
};

// The code shown alongside each error in the design, used to prefill the demo.
export const DEMO_CODES: Record<CodeErrorId, string> = {
  "code-used": "HOL/234567",
  "code-not-recognised": "Abc-12345",
  "invalid-code": "ABC-123456",
  "code-lapsed": "9876543L",
};

// Older demo codes that still raise an error. Kept apart from DEMO_CODES so the
// picker and the prefill keep showing the one code the design uses.
const CODE_ALIASES: Record<string, CodeErrorId> = {};

// Anything not listed here validates successfully and moves on.
export function activationCodeError(raw: string): CodeErrorId | null {
  // Designs and pasted codes often carry en/em dashes rather than hyphens
  const code = raw.trim().replace(/[‐-―]/g, "-");
  const match = (Object.keys(DEMO_CODES) as CodeErrorId[]).find(
    (id) => DEMO_CODES[id] === code,
  );
  return match ?? CODE_ALIASES[code] ?? null;
}
