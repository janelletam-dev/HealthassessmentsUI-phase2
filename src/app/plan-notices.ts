// Copy for the status banners on the Set up your account landing. Each notice
// carries its own node id: a header citation tells you the file was read, not
// which frame a given sentence came from.
//
// AXA SUPPORT NUMBERS live in axa-support.ts, one per arm: 0800 169 3965 for
// HP, 01892 169 3965 for LC. They are probably two different hotlines rather
// than one number written two ways (Janelle, 28 Aug), so do not "correct" one
// to the other. No notice below carries a number, which is why nothing here
// changed; this points at the file so that whoever adds one picks the arm
// first. The DCA Patient Experience number, +44 (0)330 088 4980, is a
// different team and unaffected.

export type PlanNotice = {
  tone: "info" | "warning";
  title: string;
  paragraphs: string[];
  /**
   * Whether the two onboarding tasks are still open while this notice shows.
   *
   * The dependant notices explicitly say "you can still set up your profile",
   * so their cards keep their CTAs. The AXA validation wait does not: its
   * frame drops both buttons and marks both cards Later, because nothing can
   * be set up until AXA answers. It rides on the notice rather than on a prop
   * of its own, since the notice is the only reason the tasks are blocked.
   */
  blocksTasks?: boolean;
};

/*
 * THREE OF THESE ARE CURRENTLY UNREACHABLE. Janelle, 27 Aug: leave the
 * dependant states out for now. Their View states rows and configs are gone, so
 * dependantPending, dependantPendingShort and planLapsed have no way in.
 *
 * The copy stays. All three are lifted from real frames with node ids beside
 * them, and deleting framed copy to chase an unused-symbol warning would throw
 * away the read that produced it. policyValidating is still live, via
 * landing-policyValidating.
 */
export const PLAN_NOTICES: Record<string, PlanNotice> = {
  // 1836:327820, plan not yet active, with the credit-back line.
  dependantPending: {
    tone: "info",
    title: "Your plan is not yet active",
    paragraphs: [
      "Your plan starts once the main policyholder registers and activates their account.",
      "In the meantime, you can still set up your profile and verify your identity to be ready to book appointments. You will be on a pay-as-you-go plan.",
      "Once your plan is active, we'll credit back the cost of the appointments booked.",
    ],
  },
  // 1836:327840, the same notice without the credit-back line.
  dependantPendingShort: {
    tone: "info",
    title: "Your plan is not yet active",
    paragraphs: [
      "Your plan starts once the main policyholder registers and activates their account.",
      "In the meantime, you can still set up your profile and verify your identity to be ready to book appointments. You will be on a pay-as-you-go plan.",
    ],
  },
  /*
   * AXA'S OWN WORDING, 27 Aug, replacing the frame's.
   *
   * 2378:133264 and 2016:100560 draw "Your policy is being validated" over
   * "We are currently waiting for AXA to validate your policy and will activate
   * as soon as they confirm." AXA reviewed the HP error messages and asked for
   * the not-live cases to be aligned on one sentence, which is the body below.
   * Janelle, 27 Aug: use that here.
   *
   * THE TITLE CHANGED TOO, and that is my call rather than AXA's. "Your policy
   * is being validated" over a body that says the policy is not yet live is a
   * heading contradicting its own paragraph, which is the exact defect class
   * this repo spent 26 Aug removing. If AXA supplied a title, it wins over
   * this one.
   *
   * SO THE FRAME IS NOW OUT OF DATE. 2378:133264 still draws the waiting
   * wording; this text is newer and came from the party that owns the
   * behaviour. The frame needs redrawing, and until it is, this is a knowing
   * divergence rather than a paraphrase.
   *
   * Worth resolving separately: the sheet maps the waiting wording to 409
   * MEMBER_ALREADY_REGISTERED, which does not mean "not live" either. One of
   * those two mappings is wrong at source.
   */
  policyValidating: {
    tone: "warning",
    title: "Your policy is not yet live",
    paragraphs: [
      "Registration cannot be completed at this time as your AXA policy is not yet live. Please check the date your policy starts and try again on the start date.",
      // NO FRAME. Janelle, 28 Aug: "what happens to the account they have
      // created? will it be saved? this does not explain". She is right. AXA's
      // sentence never says, and it renders on the landing that only exists
      // BECAUSE the account was created, so "registration cannot be completed"
      // reads as though the account was lost.
      //
      // The Visio already answers it and AXA's replacement deleted the answer.
      // signup-flows.pdf, GET /plan-summary: the Awaiting response carries a
      // real patientReferenceNumber, and the flow beside it is "Show Awaiting
      // plan summary, disable Continue profile set up button, wait until it
      // gets changed by AXA, refresh Set up profile page". So the record
      // exists and the user comes back to it.
      //
      // Separate paragraph so AXA's string above stays verbatim and Duncan can
      // see exactly what we added.
      "Your account is saved. Sign back in on your policy start date to finish setting up.",
    ],
    blocksTasks: true,
  },
  // 1836:327860, plan lapsed or cancelled. The frame reads "contact AXA ro
  // register"; corrected to "to register" on Janelle's say-so.
  planLapsed: {
    tone: "warning",
    title: "This plan shows as lapsed or cancelled",
    paragraphs: [
      "Your plan cannot be activated right now. The main policyholder needs to contact AXA to register or activate their account.",
      "In the meantime, you can still set up your profile and verify your identity to be ready to book appointments. You will be on a pay-as-you-go plan.",
    ],
  },
};
