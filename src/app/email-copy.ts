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

/*
 * THE TWO LEGAL LINES, WRITTEN ONCE.
 *
 * They were copied into both small-print lists, and now a third email wants
 * them. A 200-character legal paragraph kept in three places drifts, and the
 * copy that drifts is the one nobody rereads.
 */
// 449:528, and the same pair in the Lifestyle Questionnaire Report Ready frame.
const LEGAL = [
  "For information about how we process data and monitor communications, please see our Privacy Policy. For information on our service, subscription usage and cancellation policy, please see our Terms & Conditions.",
  "If you no longer wish to receive these emails please unsubscribe here.",
];

export const EMAIL_FOOTER = {
  heading: "Need help?",
  email: "contactus@doctorcareanywhere.com",
  phone: "0330 088 4980",
  // 449:528 opens the small print with the footnote, because its step 4 carries
  // an asterisk. No other email has one.
  smallPrintMarketing: ["*If recommended by the Clinician.", ...LEGAL],
  // The results frame runs the legal pair alone, then a Braze address block.
  //
  // THE MEMBERSHIP LINE IS GONE, along with the smallPrint list that held it.
  // It came from e10 at 5193:8107, which this email replaces, and no current
  // frame draws it.
  smallPrintResults: LEGAL,
};

// ─── Results ready, the lifestyle questionnaire report ─────────────────
//
// Frame "Health Insights Assessment - Lifestyle Questionnaire Report Ready",
// 600x943. Janelle pasted its exported CSS and a render on 3 Sep, after
// "after a few bits the questionnaire is reviewed by CTM, here is the email".
//
// IT REPLACES e10 AT 5193:8107, and it is a different email rather than a
// restyle. e10 told the reader they had been recommended an Advanced Corporate
// Health Assessment and gave two numbered steps to book it. This one is the
// generic report-ready mail: it covers both outcomes in one sentence, "if a
// more in-depth Health Assessment has been recommended for you", so it can send
// to everyone who finishes the questionnaire. Gone with e10: the two steps, the
// Full Health Medical and Tuli partner line, the sign-off, and the support
// paragraph that carried 02046 469 390, the number Janelle corrected out of the
// app on the same day. That contradiction is resolved by deletion.
//
// NO FRAME ID. The transactional file lists only its "Early Designs" page
// through the MCP and this frame is not on it, so there is no node to cite.
// Every string below is from the render and the CSS she sent.
export const RESULTS_EMAIL = {
  title: "Your lifestyle questionnaire results are ready",
  // Greeting and paragraph are one centred block, as in marketing's invitation.
  body: "Hi Jane,\n\nYour clinician-reviewed results are ready to view. Your report explains what we found and your recommended next steps — in clear language, not just raw data.",
  // The arrow is inside the label in the frame, not a separate icon.
  cta: "View report →",
  closing: "If a more in-depth Health Assessment has been recommended for you, your report will explain it and you'll be able to book from there.",
};

// ─── Pharmacy appointment confirmation ─────────────────────────────────────
//
// jemhxV3hfyu7XbfumER8xF frame 449:1576, "Health Insights Assessment - Pharmacy
// Appointment Confirmation", 600x2295. Janelle, 4 Sep: "we end up with another
// email transaction supposing before they go to their appointment".
//
// THE SUPPORT NUMBER IS CORRECTED, NOT THE FRAME'S. The frame's body says
// 02046 469 390 for the "Health Assessments Customer Support team" while its
// own footer says 0330 088 4980. Raised, and Janelle ruled on 4 Sep: "again
// 0330 088 4980 is what needs to be followed". So every support number in this
// prototype is 0330 088 4980, whatever team name sits in front of it, and
// 02046 469 390 appears nowhere. The frame still disagrees; flagged for
// marketing to fix at source.
export const APPOINTMENT_EMAIL = {
  // 449:1576
  title: "Your appointment is booked",
  // 449:1576. The frame greets {{first_name}}; Jane, as everywhere else.
  greeting: "Hi Jane,",
  // 449:1576
  lead: "Great news — your pharmacy appointment for your Health Assessment is now booked:",
  // 449:1576, the four label cells. Their values are the booking's.
  labels: ["Type:", "Location:", "Date:", "Time:"],
  // 449:1576
  prepareHeading: "How to prepare",
  prepare: [
    "Check how to get there, and allow plenty of time for your appointment",
    "Make sure to drink plenty of water before your visit. Being well hydrated can make sample collection easier and supports accurate readings.",
    "Wear clothing that allows easy access to your arm.",
    "Arrive a few minutes early to check in (have your booking reference handy, you may be asked for it).",
    "Please complete your Advanced Health Assessment questionnaire (about [X minutes]), if you haven't yet done so.",
  ],
  // 449:1576. The bracketed [X minutes] above is the frame's own placeholder,
  // left in because marketing has not filled it and inventing a duration would
  // put a number on screen that nobody has agreed.
  cta: "Complete your questionnaire →",
  // 449:1576
  importantHeading: "Important health information",
  important: "Please let the clinician know if you are taking blood-thinning medication, have a history of fainting, needle phobia, or any relevant medical conditions.",
  // 449:1576
  expectHeading: "What to expect",
  expect: "Your appointment will take place at a local pharmacy or clinic, where a trained professional will carry out your tests with care — it's quick, straightforward and private.",
  // 449:1576
  afterHeading: "After your visit",
  after: [
    "Keep the plaster on for at least 2 hours.",
    "Avoid heavy lifting with the affected arm for a few hours.",
    "Mild bruising is normal, but contact your GP if you notice prolonged pain, redness or swelling.",
    "Your samples will be packaged by the phlebotomist and must be posted promptly — identify your nearest postbox in advance so they're sent without delay.",
  ],
  // 449:1576
  changeHeading: "Need to change your appointment?",
  changeLead: "You can reschedule or cancel via our dedicated Health Assessments Customer Support team on ",
  changePhone: "0330 088 4980",
  changeTail: ". Lines are open 09:00–17:30, Monday to Friday.",
};

// ─── Advanced assessment results ready ─────────────────────────────────────
//
// jemhxV3hfyu7XbfumER8xF frame 468:2616, "Health Insights Assessment - Advanced
// Corporate Health Assessment Report Ready", 600x1130. Janelle, 4 Sep: "then
// after", meaning after the appointment.
//
// The asterisk on "Video GP appointment*" has no footnote anywhere in the
// frame. Kept as drawn.
export const ADVANCED_RESULTS_EMAIL = {
  // 468:2616
  title: "Your health assessment results are ready",
  // 468:2616. Greeting and paragraph are one centred block, as in the others.
  body: "Hi Jane,\n\nYour Advanced Corporate Health Assessment is complete and your clinician-reviewed report is ready to view — with clear, personalised insights on where you stand and what to do next.",
  // 468:2616
  cta: "View my report →",
  // 468:2616
  talkHeading: "Want to talk through your results?",
  talk: "You have a free Video GP appointment* included — book a time to discuss your results and next steps with a doctor.",
  // 468:2616
  bookCta: "Book an appointment →",
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
  appointment: {
    // NO FRAME. The transactional file carries no subject annotation for
    // 449:1576, so this is the email's own heading. Replace with marketing's
    // when it lands.
    subject: "Your appointment is booked",
    date: "11:40",
  },
  advancedResults: {
    // NO FRAME, same reason, for 468:2616.
    subject: "Your health assessment results are ready",
    date: "08:26",
  },
  results: {
    // Janelle, 3 Sep: "have this as subject: Lifestyle Questionnaire Report
    // Ready". Replaces e10's annotation at 5193:8160, "Jane, you've been
    // recommended a free in-depth Health Assessment", which contradicted the
    // body: this email does not know whether one was recommended.
    //
    // No first name and no sentence case, unlike the invitation's subject. That
    // is hers, not a slip.
    subject: "Lifestyle Questionnaire Report Ready",
    date: "16:02",
  },
};
