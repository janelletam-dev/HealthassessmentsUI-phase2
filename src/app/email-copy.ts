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
//
// THE FRAME SAYS "Hi {{first_name}},". Janelle, 3 Sep: use a generic name
// instead. Jane, because the prototype already demos as Jane everywhere else,
// the first name placeholder is "e.g., Jane" and the email placeholder is
// jane.doe@mail.com, and a merge tag left raw on the first screen reads as a
// bug to anyone being shown this rather than as a personalisation token.
//
// The tag is the design's, not a mistake: Braze fills it on send. If this
// screen is ever exported as a template, the tag goes back.
export const EMAIL_HEADER = {
  // 449:528
  title: "You’re invited",
};

// 449:528. Marketing merged the greeting and the opening paragraph into one
// centred block, so they are one string here rather than two. The double space
// after "assessment." is the frame's.
export const EMAIL_INTRO =
  "Hi Jane,\n\nAs part of your employer's Health Assessment Programme, you're invited to take a short health insights assessment.  It takes just a few minutes and is completely free.";

// 449:528, the first card.
export const EMAIL_NEXT_HEADING = "Here’s what happens next";

/*
 * FOUR STEPS NOW, NOT THREE, and the numbering is part of the string.
 *
 * Marketing writes "1. Complete your..." as one run rather than drawing a
 * numbered badge beside it, so the numbers live in the copy. Step 3 carries no
 * body in the frame.
 */
export const EMAIL_STEPS: { title: string; body?: string }[] = [
  {
    // 449:528
    title: "1. Complete your Health Insights Assessment",
    // 449:528
    body: "You'll need your height, weight and, if possible, your waist measurement. Guidance on measuring your waist can be found here: NHS – How to measure your waist.",
  },
  {
    // 449:528
    title: "2. A clinician reviews your answers",
    // 449:528
    body: "They will share personalised tips and next steps with you.",
  },
  {
    // 449:528
    title: "3. Receive your Health Insights Report",
  },
  {
    // 449:528
    title: "4. Further support if needed*",
    // 449:528
    body: "You may be offered a free, more in-depth Health Assessment - this can include blood tests and health measurements, all at no cost to you.",
  },
];

// 449:528, the second card.
export const EMAIL_WHY_HEADING = "Why it matters";

// 449:528, the four table rows. Unchanged from the earlier draft.
export const EMAIL_WHY = [
  "Identify potential health risks early",
  "Get personalised advice",
  "Improve your energy, fitness and wellbeing",
  "Take proactive steps for a healthier future",
];

export const EMAIL_CTA = {
  // 449:528
  lead: "New to Doctor Care Anywhere? You'll create an account first, it only takes a moment.",
  // 449:528. The arrow is inside the label in the frame, not a separate icon.
  button: "Create account →",
};

// 449:528, the tinted card at the foot of the body.
export const EMAIL_PRIVACY = {
  // 449:528
  title: "Your privacy is important.",
  // 449:528. The spacing around the dash is the frame's.
  body: "Your information is confidential and secure. Your results are clinician-reviewed, not just raw data -  so you'll know where you stand and what to do next.",
};

export const EMAIL_FOOTER = {
  heading: "Need help?",
  email: "contactus@doctorcareanywhere.com",
  phone: "0330 088 4980",
  // 449:528 opens the small print with the footnote instead of the membership
  // line. The results email, which is from the other file, still uses the
  // membership line, so both lists exist rather than one being imposed on both.
  smallPrintMarketing: [
    "*If recommended by the Clinician.",
    "For information about how we process data and monitor communications, please see our Privacy Policy. For information on our service, subscription usage and cancellation policy, please see our Terms & Conditions.",
    "If you no longer wish to receive these emails please unsubscribe here.",
  ],
  smallPrint: [
    "You are receiving this email as part of your Doctor Care Anywhere membership.",
    "For information about how we process data and monitor communications, please see our Privacy Policy. For information on our service, subscription usage and cancellation policy, please see our Terms & Conditions.",
    "If you no longer wish to receive these emails please unsubscribe here.",
  ],
};

// ─── e10, results ready, Advanced HA recommended ─────────────────────────────
//
// A DIFFERENT FILE FROM THE INVITATION. This one is Health assessments
// rDltwIr2dJvUUNaXEqEYFO, page "B2B2C (Email comms)", frame 5193:8107
// "e010-results-ready-prescreen-yesadv", 600x1309. Janelle pointed at that node
// directly on 3 Sep: "the medical team will review and if further tseting
// needed they receive this email".
//
// Its house style is not identical to the transactional file's invitation: the
// title is 40 SemiBold here against 30 Medium there, and the numbered badges
// are 12 SemiBold #edf6ff with a white ring against 14 Bold white. Both are
// reproduced as their own frame draws them rather than averaged.
//
// THE SUPPORT NUMBER IN THE BODY CONTRADICTS THE FOOTER, and both are in this
// one frame: the body says 02046 469 390, the footer says 0330 088 4980.
// Janelle, 3 Sep, gave 0330 088 4980 as the correct Health Assessments number
// and 02046 469 390 is the one she corrected out of the app's Need help card.
// Reproduced verbatim anyway, because this is the design and quietly "fixing"
// it would hide the conflict. Raised with her.

export const RESULTS_EMAIL = {
  // 5193:8107 Header
  title: "Your results are ready",
  greeting: "Hi Jane,",
  intro: [
    // 5193:8107 Body, first section
    "A clinician has reviewed your lifestyle questionnaire — and based on your answers, you've been recommended a free, more in-depth Advanced Corporate Health Assessment, funded by your employer.",
    // 5193:8107
    "It includes blood tests and health measurements, and gives you a fuller picture of your health with a clinician-reviewed report — so you'll know where you stand and what to do next.",
  ],
  // 5193:8107, the What to do next heading
  nextHeading: "What to do next",
  steps: [
    {
      // 5193:8107, step 1
      title: "View your results",
      body: "See why you were recommended an advanced assessment.",
    },
    {
      // 5193:8107, step 2
      title: "Book your free Advanced Corporate Health Assessment",
      body: "It only takes a few moments to choose a pharmacy, date and time that suit you.",
    },
  ],
  // 5193:8107, the button
  cta: "View your results and book",
  closing: [
    // 5193:8107
    "Your assessment is delivered in collaboration with our partners, Full Health Medical and Tuli, so you can book at a convenient local location.",
    // 5193:8107. The number here is the frame's and disagrees with the footer.
    "If you need any support, our team is here to help. Please contact our dedicated Health Assessments Customer Support team on 02046 469 390. Lines are open 09:00–17:30, Monday to Friday.",
  ],
  // 5193:8107
  thanksLead: "With thanks,",
  thanksTeam: "The Doctor Care Anywhere Team",
};

// ─── The mail client around the emails ───────────────────────────────────────
//
// NO FRAME. Janelle, 3 Sep: "can we have the emails really look like an email
// screen", with a Gmail screenshot, then "like that at the top but just show
// the email content already". So this is the chrome an email is read in, not
// part of any design.
//
// Deliberately a generic mail client rather than a copy of Gmail: reproducing
// Google's wordmark and product furniture in a DCA prototype that gets shown to
// clients is not something to do casually, and the point of the request is that
// it reads as an email, which a neutral client does just as well.
//
// The subjects and previews ARE the design's, from the annotations above the
// frames on the Email comms page, 5190:1956 and 5193:8160. The sender address
// is prototype dressing: no frame states one.
export const MAILBOX = {
  sender: "Doctor Care Anywhere",
  // Janelle sent a real inbox screenshot on 3 Sep. This is the address it shows,
  // not a guess: noreply@info.doctorcareanywhere.com, with an Unsubscribe link
  // beside it and "to me" underneath.
  senderAddress: "noreply@info.doctorcareanywhere.com",
  to: "to me",
  unsubscribe: "Unsubscribe",
  inboxChip: "Inbox",
  invitation: {
    // 449:620, marketing's annotation. Replaces the earlier
    // "your employer's health assessment is ready for you".
    subject: "Jane, your Health Insights Assessment is ready for you",
    date: "09:14",
  },
  results: {
    // 5193:8160
    subject: "Jane, you've been recommended a free in-depth Health Assessment",
    date: "16:02",
  },
};
