// Which journey a code puts someone into.
//
// Janelle, 24 Aug: "code format drives detection". The shapes below are the
// real ones, with the digits altered because an AXA Individual or SME voucher
// code IS the member's membership number:
//
//   AXA-RA003032   AXA Health Plan. A group reference. Hyphen. HP validates
//                  against AXA live. The two-letters-then-six-digits body is
//                  what the sample looks like, not what is required: AXA-123456
//                  is an HP code too.
//   AXA/S9862901   An AXA voucher. Slash.
//   HOL/H1214301   An AXA voucher. Slash. Company names are not held in our
//                  system for the SME ones.
//
//                  NEITHER PREFIX SAYS WHICH VOUCHER. Janelle, 26 Aug: "HOL
//                  could be axa sme and ind, not lcdb/hp". So a slash prefix
//                  tells you it is an AXA voucher and that it is not a plan;
//                  it does not tell SME from Individual, and the code no
//                  longer pretends otherwise. What it rules OUT is the part
//                  that matters: never LC, never HP, so never a policy match.
//   6747401Y       AXA Large Corporate, from LCDB: seven digits then a capital
//                  letter (Janelle via Bibin, 25 Aug).
//   G01125901      AXA Large Corporate, Barclays scheme: a capital letter then
//                  eight digits (Janelle, 25 Aug). A different shape, not a
//                  prefix on the one above.
//                  Digits altered in both, since an LCDB number identifies a
//                  member. LC still matches character by character.
//   ABC-12345      DCA activation, and what the frames draw throughout.
//
// HP and LC differ at the API as well as in shape: flow 09 has HP calling AXA
// live while LC matches against a pre-loaded Customer file.
//
// Nothing in this file pays. Payment belongs to PAYG, which is not built, and
// AXA collects the money for its own products.

export type JourneyId = "dca" | "axa-hp" | "axa-lc" | "axa-voucher";

export type Journey = {
  id: JourneyId;
  /** Shown in View states and in the audit, not to patients. */
  label: string;
  brand: "dca" | "axa";
  /**
   * Whether sign-up details are matched against a policy record AXA holds.
   * True for the two AXA plan journeys; the vouchers carry their own entitlement.
   */
  validatesAgainstPolicy: boolean;
};

export const JOURNEYS: Record<JourneyId, Journey> = {
  "dca":            { id: "dca",            label: "DCA activation",       brand: "dca", validatesAgainstPolicy: false },
  "axa-hp":         { id: "axa-hp",         label: "AXA Health Plan",      brand: "axa", validatesAgainstPolicy: true },
  "axa-lc":         { id: "axa-lc",         label: "AXA Large Corporate",  brand: "axa", validatesAgainstPolicy: true },
  // One journey, not two. SME and Individual were separate ids that differed
  // only by their label, and nothing in the app ever branched on which. Since
  // the prefix cannot tell them apart either, two ids only let the code state
  // something it does not know.
  "axa-voucher":    { id: "axa-voucher",    label: "AXA voucher (SME or Individual)", brand: "axa", validatesAgainstPolicy: false },
};

// Anchored, so a code that merely starts with a known prefix does not match.
//
// THE RULE: A PREFIX IS ENOUGH, A BARE SHAPE IS NOT.
//
// AXA-, AXA/ and HOL/ are keyed on the prefix and a plausible body length.
// Janelle listed all three as AXA on 26 Aug, and twice found a code of hers
// reading as DCA because the body did not match a sample: HOL/2345678, then
// AXA-123456. The body was never the part carrying the meaning. Nothing else
// in the prototype begins AXA- or HOL/, so the prefix cannot collide.
//
// The Visio backs this up rather than the old strictness. docs/signup-flows.pdf
// page 1 sends every non-HP/LC code to "fetch activation code information from
// CRM, like it's unspecified, includes all types (voucher, lead, over 18)", and
// page 12 still asks "WILL we use this Account for identifying AXA IND/SME?" as
// an open question. There was never any authority for "two letters then six
// digits" or "a letter then seven digits" beyond one sample code each.
//
// THE TWO LC SHAPES STAY STRICT, because they have no prefix to anchor on. They
// are bare alphanumerics, so loosening them would swallow any eight-character
// string, DCA codes included. A shape is all they have, so the shape has to
// hold.
//
// The floor on each body is load bearing in one place: seven for HOL/ keeps
// "HOL/234567" (six) out of the voucher shape so it stays available as the
// already-used demo code. The ceilings are not load bearing, they just stop an
// arbitrarily long string counting as a code.
//
// Both slash prefixes land on the same journey because neither says which
// voucher it is. Janelle, 26 Aug: "HOL could be axa sme and ind, not lcdb/hp".
const SHAPES: { pattern: RegExp; journey: JourneyId }[] = [
  { pattern: /^AXA-[A-Z0-9]{6,12}$/i, journey: "axa-hp" },
  { pattern: /^AXA\/[A-Z0-9]{7,12}$/i, journey: "axa-voucher" },
  { pattern: /^HOL\/[A-Z0-9]{7,12}$/i, journey: "axa-voucher" },
  // LC has two shapes, and they are mirror images rather than variants of each
  // other. Both matched case-insensitively like the rest, because detection must
  // not disagree with validation about what a code IS; a lower-case letter still
  // fails validation afterwards.
  { pattern: /^\d{7}[A-Z]$/i, journey: "axa-lc" },   // LCDB: 7 digits, then a letter
  { pattern: /^[A-Z]\d{8}$/i, journey: "axa-lc" },   // Barclays: a letter, then 8 digits
];

/**
 * The journey a code belongs to. Unknown shapes fall back to DCA, which is what
 * the frames draw and what an ordinary invite code does.
 *
 * Spaces are stripped because people paste codes out of emails and letters.
 * Case is not: the prototype matches codes case-sensitively on purpose so the
 * case-sensitivity error can demonstrate itself, and detection must not quietly
 * disagree with validation about what a code is.
 */
export function journeyForCode(raw: string): Journey {
  const code = raw.replace(/\s+/g, "");
  for (const { pattern, journey } of SHAPES) {
    if (pattern.test(code)) return JOURNEYS[journey];
  }
  return JOURNEYS.dca;
}

/** Whether a code is one of the AXA voucher shapes. */
export function isVoucherCode(raw: string): boolean {
  return journeyForCode(raw).id === "axa-voucher";
}
