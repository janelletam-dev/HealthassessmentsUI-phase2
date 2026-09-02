// The "we couldn't match your details" box on Update your personal details,
// one entry per AXA arm.
//
// HP AND LC ARE NOT THE SAME SCREEN. They were built as one because the two
// frames drew the same words. Then AXA revised the HP wording, the single
// shared string carried that revision onto LC as well, and nobody had asked
// for that. Janelle, 28 Aug: treat HP and LC separately, share only what the
// frames actually share.
//
// WHAT THE FRAMES SHARE, read from the work file 28 Aug via the two status
// instances 2171:121762 (HP) and 2171:121778 (LC):
//   - the title, byte-identical on both
//   - the amber inline box itself
//
// WHAT THEY DO NOT SHARE:
//   - LC carries a "Need support? / Contact us" row, I2171:121778;795:8003.
//     HP has no support affordance at all. Read as intent rather than as a
//     drafting slip: an HP mismatch is AXA's to resolve and AXA's own copy
//     names their number inline, whereas the LC message is returned by DCA's
//     Registration API and its escape hatch is DCA's contact page.
//   - the body, since 27 Aug. AXA revised the HP messages, which is exactly
//     what Duncan's annotation 1946:150192 was waiting on ("HP validation
//     errors, placeholders only. AXA drafting the 5 messages this week. Do
//     NOT invent copy."). Nobody revised LC, so LC still says what its frame
//     says.
//
// LC'S NUMBER, and why none appears below. The Visio's LC string
// (signup-flows.pdf, GET /plan-summary, validationState 3) names AXA Policy
// Servicing on 01892 169 3965; AXA's HP sheet says 0800 169 3965. I read the
// shared last seven digits as one line moving to freephone. Janelle, 28 Aug:
// the two arms probably have genuinely different hotlines, which is ordinary
// for a Large Corporate scheme. See axa-support.ts.
//
// Either way LC shows no number here, because its own frame carries none and
// the escape hatch it does draw is DCA's contact page. Adding AXA's number to
// LC would be inventing copy on the arm AXA has not reviewed.
//
// APOSTROPHES. Both frames draw a straight quote in "couldn't". Curly here, to
// match the AXA body below and the rest of the app. Deliberate, not a misread.

import { AXA_HP_SUPPORT_PHONE, AXA_HP_SUPPORT_HOURS } from "./axa-support.ts";
import type { PolicyPlan } from "./axa-policy.ts";

export type CorrectionCopy = {
  title: string;
  body: string;
  /**
   * Whether the box ends with the "Need support? / Contact us" row.
   *
   * A field rather than a `plan === "lc"` test at the render site, so that
   * every way the two arms differ is answerable from this one table. Splitting
   * it across two files is how they drifted back together last time.
   */
  showsSupportRow: boolean;
};

export const CORRECTION_COPY: Record<PolicyPlan, CorrectionCopy> = {
  /*
   * 2171:121762 for the title.
   *
   * The body is AXA'S OWN WORDING for RECORD_NOT_FOUND, 27 Aug, replacing what
   * the frame draws. Two deliberate departures from AXA's string, recorded so
   * nobody "restores" them:
   *
   * 1. "Your account is saved." is kept in front. AXA's version drops it, and
   *    it is the single most useful fact on the screen: the account survived
   *    the mismatch and the patient is not starting again. The frame said it,
   *    so dropping it would be a regression rather than an alignment. Worth
   *    putting back to AXA rather than leaving as a local divergence.
   * 2. Their bracket is unclosed: "(Monday to Friday 8am to 8pm, 9am to 5pm
   *    Saturday and Bank Holidays." Closed here, and flagged to Duncan so it
   *    is fixed at source too.
   */
  // 2171:121762
  hp: {
    title: "We couldn’t match your details to your AXA membership record",
    body:
      "Your account is saved. Please check your membership documents and ensure the details you have entered match your AXA policy, then try again. " +
      `If you’re still experiencing issues, call AXA Policy Servicing Team on ${AXA_HP_SUPPORT_PHONE} (${AXA_HP_SUPPORT_HOURS}).`,
    showsSupportRow: false,
  },
  // 2171:121778, both strings verbatim. AXA's review was scoped to HP, so this
  // arm has had none and the frame stands.
  lc: {
    title: "We couldn’t match your details to your AXA membership record",
    body: "Your account is saved. Check any of your details below against your membership documents and update it below.",
    showsSupportRow: true,
  },
};
