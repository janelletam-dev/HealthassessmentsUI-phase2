// Copy for the invitation email, the first screen in the prototype.
//
// Figma file jemhxV3hfyu7XbfumER8xF, "Health Assessment Transactional Emails",
// page B2B2C, frame 354:102 "e1-b-invitation-no-code", 600x1442. Every string
// below is that frame's, verbatim.
//
// THE RIGHT FILE, ON THE SECOND ATTEMPT. There is a near-twin in the design
// file's own Email comms page, 5182:109386 "e02-invitation-no-code", 600x1617,
// which has a body under step 1 about height and waist measurement and a
// privacy line by the button. Janelle pointed at the transactional file, so
// this is built from that one. If the two ever need reconciling, they are
// genuinely different drafts, not a stale export.
//
// EM DASHES, SIX OF THEM, DELIBERATE. They break the standing rule against em
// dashes in copy, which is why this file is named in the exemption list in
// ui-copy.test.ts rather than the rule being weakened for everything. Janelle,
// 3 Sep: "that's fine that was marketing copy, so for the email it's fine".
// Nothing here should be "corrected" locally, or the prototype stops matching
// the email that actually sends.
//
// Braze owns the real send. These strings drive the prototype's first screen;
// they are not the template.

// 354:102 Header. The logo, the title and the greeting.
export const EMAIL_HEADER = {
  title: "You’re invited",
  greeting: "Hi {{first_name}},",
};

// 354:102, the opening paragraph directly under the header.
export const EMAIL_INTRO =
  "As part of your employer's Health Assessment Programme, you're invited to take a short, employer-funded look at your health — starting with a quick lifestyle questionnaire that takes less than 5 minutes.";

// 354:102, the first section heading.
export const EMAIL_NEXT_HEADING = "Here’s what happens next";

/** Three numbered steps. The first carries no body in this frame. */
// 354:102, the three numbered rows under that heading.
export const EMAIL_STEPS: { title: string; body?: string }[] = [
  { title: "Complete a quick lifestyle questionnaire" },
  {
    title: "A clinician reviews your answers",
    body: "They will share personalised tips and next steps with you.",
  },
  {
    title: "Further support if needed*",
    body: "You may be offered a free, more in-depth Health Assessment — this can include blood tests and health measurements, all at no cost to you.",
  },
];

// 354:102, the second section heading.
export const EMAIL_WHY_HEADING = "Why it matters";

// 354:102, the four mint-disc rows under it.
export const EMAIL_WHY = [
  "Identify potential health risks early",
  "Get personalised advice",
  "Improve your energy, fitness and wellbeing",
  "Take proactive steps for a healthier future",
];

// 354:102, the button and the line beneath it.
export const EMAIL_CTA = {
  button: "Start your questionnaire",
  under: "New to Doctor Care Anywhere? You'll create an account first — it only takes a moment. Already have an account? Just log in.",
};

// 354:102, the closing block above the Trustpilot row.
export const EMAIL_SIGNOFF = {
  results: "Your results are clinician-reviewed — not just raw data — so you'll know where you stand and what to do next.",
  thanksLead: "With thanks,",
  thanksTeam: "The Doctor Care Anywhere Team",
  footnote: "*If recommended by the Clinician.",
};

// 354:164, the Footer frame, a sibling of Main container.
export const EMAIL_FOOTER = {
  heading: "Need help?",
  email: "contactus@doctorcareanywhere.com",
  phone: "0330 088 4980",
  smallPrint: [
    "You are receiving this email as part of your Doctor Care Anywhere membership.",
    "For information about how we process data and monitor communications, please see our Privacy Policy. For information on our service, subscription usage and cancellation policy, please see our Terms & Conditions.",
    "If you no longer wish to receive these emails please unsubscribe here.",
  ],
};
