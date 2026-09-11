// The fast-forward demo's score: every scene, keystroke and click, in order.
//
// NO FRAME anywhere in this file: nothing here is user-facing copy. The zoom
// lines are the narration, written for anyone in sales or the leadership
// team showing this to a prospective client (Janelle, 11 Sep: "ensure the
// text narration is clear for anybody in sales team or elt"), so they say
// what is on screen and why it matters, in plain words, and never name the
// clinical partner. The typed values are the prototype's own demo fixtures
// (Jane Smith, jane.smith@mail.com, Demo123!). The presenter's guide is
// docs/fast-forward-demo.md; keep the two in step.
//
// The engine in demo-driver.tsx runs this top to bottom. A waitFor both
// paces the run and asserts the app actually reached the screen the script
// believes it is on: if a step breaks, the run stops there and the badge says
// where, which is the debugging story.

export type DemoStep =
  | { kind: "scene"; label: string }
  | { kind: "waitFor"; text: string; timeoutMs?: number }
  | { kind: "pause"; ms: number }
  | { kind: "click"; label: string }
  | { kind: "type"; field: string; text: string }
  | { kind: "select"; option: string }
  | { kind: "zoom"; text: string; ms?: number }
  | { kind: "answerAll"; perQuestionMs: number }
  | { kind: "fillAll" }
  | { kind: "pick"; trigger: string; option?: string }
  | { kind: "jumpPhase"; phase: string }
  | { kind: "pdfPage"; page: number }
  | { kind: "scrollThrough"; ms?: number };

export const DEMO_SCRIPT: DemoStep[] = [
  // ── 1. The invitation lands ────────────────────────────────────────────────
  { kind: "scene", label: "Invitation email" },
  { kind: "waitFor", text: "your Health Insights Assessment is ready for you" },
  { kind: "pause", ms: 800 },
  { kind: "zoom", text: "It starts with an email from the employer's programme: a free Health Insights Assessment that takes a few minutes" },
  { kind: "scrollThrough", ms: 3000 },
  { kind: "click", label: "Create account" },

  // ── 2. The landing ─────────────────────────────────────────────────────────
  // No code entry in this journey: the invite carries the code by email and it
  // is used later, for the questionnaire.
  { kind: "scene", label: "Welcome page" },
  { kind: "waitFor", text: "Find the right assessment for you" },
  { kind: "pause", ms: 600 },
  { kind: "zoom", text: "The link lands on Doctor Care Anywhere, with the four steps ahead spelled out" },
  { kind: "click", label: "Get started" },

  // ── 3. Create the account ──────────────────────────────────────────────────
  { kind: "scene", label: "Create account" },
  { kind: "waitFor", text: "Create your account" },
  { kind: "zoom", text: "A Doctor Care Anywhere account in one form: name, date of birth, email and password" },
  { kind: "type", field: "e.g., Jane", text: "Jane" },
  { kind: "type", field: "e.g., Smith", text: "Smith" },
  { kind: "type", field: "jane.doe@mail.com", text: "jane.smith@mail.com" },
  { kind: "type", field: "Choose a strong password", text: "Demo123!" },
  { kind: "type", field: "DD/MM/YYYY", text: "01/01/1981" },
  { kind: "click", label: "I agree to the Terms" },
  { kind: "click", label: "Create account" },

  // ── 4. Profile: contact info with the OTP ─────────────────────────────────
  { kind: "scene", label: "Mobile number" },
  { kind: "waitFor", text: "Send verification code" },
  { kind: "zoom", text: "Profile, step 1 of 4: a mobile number, verified by text message" },
  { kind: "type", field: "07123 456 789", text: "07700 900123" },
  { kind: "click", label: "Send verification code" },
  { kind: "waitFor", text: "Enter the code sent to" },
  { kind: "type", field: "Verification code", text: "123456" },
  { kind: "click", label: "Verify code" },

  // ── 5. Profile: the remaining steps ───────────────────────────────────────
  { kind: "scene", label: "Personal details" },
  { kind: "waitFor", text: "Next: GP details", timeoutMs: 12000 },
  { kind: "pause", ms: 400 },
  { kind: "zoom", text: "Step 2 of 4: sex at birth and home address" },
  { kind: "click", label: "Female" },
  // The address is manual-only (no lookup service yet), so fillAll types
  // line 1, town and postcode itself.
  { kind: "fillAll" },
  { kind: "click", label: "Next: GP details" },

  { kind: "scene", label: "GP details" },
  { kind: "waitFor", text: "Next: emergency contact" },
  { kind: "pause", ms: 400 },
  { kind: "zoom", text: "Step 3 of 4: the patient's GP, NHS or private, found by postcode" },
  { kind: "click", label: "I want to provide my GP" },
  { kind: "fillAll" },
  { kind: "click", label: "Find address" },
  { kind: "pause", ms: 600 },
  { kind: "pick", trigger: "Select an option" },
  { kind: "click", label: "Next: emergency contact" },

  { kind: "scene", label: "Emergency contact" },
  { kind: "waitFor", text: "Finish profile setup" },
  { kind: "pause", ms: 400 },
  { kind: "zoom", text: "Step 4 of 4: an emergency contact, optional" },
  { kind: "click", label: "I want to provide emergency contact details" },
  { kind: "fillAll" },
  { kind: "pick", trigger: "Select an option" },
  { kind: "click", label: "Finish profile setup" },

  // ── 6. The Health Insights Assessment ─────────────────────────────────────
  { kind: "scene", label: "Profile complete" },
  { kind: "waitFor", text: "Profile complete" },
  { kind: "pause", ms: 600 },
  { kind: "zoom", text: "Profile done. The assessment takes a few minutes, and a clinician reviews every answer" },
  { kind: "click", label: "Start your Health Insights Assessment" },
  { kind: "scene", label: "Health Insights Assessment" },
  { kind: "waitFor", text: "DEMOGRAPHICS", timeoutMs: 8000 },
  { kind: "pause", ms: 500 },
  { kind: "zoom", text: "The Health Insights Assessment: demographics, medical history, lifestyle, family history and body metrics" },
  { kind: "answerAll", perQuestionMs: 90 },
  { kind: "fillAll" },
  { kind: "click", label: "Submit" },
  { kind: "waitFor", text: "has been submitted" },
  { kind: "pause", ms: 600 },
  { kind: "zoom", text: "Submitted. The patient is told what happens next: a clinician review, and a report within 2 days" },
  { kind: "pause", ms: 1200 },

  // ── 6b. The DCA account while the report is being prepared ───────────────
  // PM, 10 Sep: "if patient logs in what would they see": login, Home, My
  // health assessments showing only what has happened.
  { kind: "scene", label: "The account, report pending" },
  { kind: "jumpPhase", phase: "dcaLoginPending" },
  { kind: "waitFor", text: "Sign in with your email address" },
  { kind: "pause", ms: 500 },
  { kind: "zoom", text: "Meanwhile, if the patient signs in to Doctor Care Anywhere" },
  { kind: "type", field: "Email Address", text: "jane.smith@mail.com" },
  { kind: "type", field: "Password", text: "Demo123!" },
  { kind: "click", label: "Sign in" },
  // 27052:15761, the Home greeting: a waitFor target, not new copy.
  { kind: "waitFor", text: "What can we help you with?" },
  { kind: "pause", ms: 800 },
  { kind: "zoom", text: "Home shows only what has happened: the assessment is in, and the report is on its way" },
  { kind: "click", label: "Open my health assessments" },
  { kind: "waitFor", text: "Awaiting clinician review" },
  { kind: "pause", ms: 600 },
  { kind: "zoom", text: "My health assessments: submitted, and the clinician's review and report follow together within 2 days" },
  { kind: "pause", ms: 1000 },

  // ── 7. The clinician's side ───────────────────────────────────────────────
  { kind: "scene", label: "Clinician review" },
  // No real control crosses from the patient's account to the clinician's.
  { kind: "jumpPhase", phase: "clinician" },
  { kind: "waitFor", text: "Ready for approval" },
  { kind: "zoom", text: "Behind the scenes: every assessment is reviewed by a clinician before anything reaches the patient" },
  { kind: "click", label: "Jane Smith" },
  { kind: "waitFor", text: "Lifestyle Factors" },
  { kind: "pause", ms: 900 },
  { kind: "zoom", text: "The clinician sees each section flagged, writes the note, and approves or rejects" },
  { kind: "click", label: "Approve" },
  { kind: "pause", ms: 1200 },
  { kind: "zoom", text: "Approved. Dispatch sends the results email and files the report in the patient's account" },
  { kind: "click", label: "Dispatch" },

  // ── 8. Results arrive and the report is read ──────────────────────────────
  { kind: "scene", label: "Results email" },
  { kind: "waitFor", text: "Health Insights Assessment Report Ready", timeoutMs: 12000 },
  { kind: "pause", ms: 600 },
  { kind: "zoom", text: "The patient is emailed the moment the report is ready" },
  { kind: "click", label: "View report" },
  { kind: "scene", label: "Results: no concerns" },
  { kind: "waitFor", text: "YOUR LATEST RESULTS", timeoutMs: 8000 },
  { kind: "pause", ms: 500 },
  // The report first: popup open, the clinician's letter and summary, close.
  // Janelle, 4 Sep: "go through popup pdf close it and then scroll down to
  // show the message then book", with the narration card after the PDF,
  // not before it.
  { kind: "click", label: "View report" },
  { kind: "pause", ms: 700 },
  { kind: "pdfPage", page: 2 },
  { kind: "pause", ms: 3400 },
  { kind: "pdfPage", page: 5 },
  { kind: "pause", ms: 2200 },
  { kind: "click", label: "Close report" },
  // Two outcomes, in a line. PM, 10 Sep: first the green note with the sleep
  // guide, then the amber note with the next steps.
  { kind: "zoom", text: "A clear result: every section green, and the clinician's note points to a 10 week sleep guide" },
  { kind: "pause", ms: 1400 },
  { kind: "click", label: "Open your sleep guide" },
  { kind: "waitFor", text: "Live page" },
  { kind: "pause", ms: 600 },
  { kind: "zoom", text: "The sleep guide: clinician-written content the patient can act on straight away" },
  { kind: "pause", ms: 2000 },
  { kind: "scene", label: "Results: further assessment" },
  { kind: "jumpPhase", phase: "fhmResultsAmber" },
  { kind: "waitFor", text: "YOUR LATEST RESULTS", timeoutMs: 8000 },
  { kind: "pause", ms: 500 },
  { kind: "zoom", text: "The other outcome: amber and red flags, and the clinician recommends the Advanced Health Assessment" },
  { kind: "pause", ms: 1200 },
  { kind: "click", label: "Read your next steps and book" },
  { kind: "waitFor", text: "YOUR NEXT STEP" },
  { kind: "scrollThrough", ms: 3000 },
  { kind: "zoom", text: "Next steps on their own page: what the Advanced Health Assessment involves, and the button to book it" },
  { kind: "click", label: "Book Appointment" },

  // ── 9. Booking the advanced assessment ────────────────────────────────────
  { kind: "scene", label: "Booking the Advanced Health Assessment" },
  { kind: "waitFor", text: "Choose a location", timeoutMs: 8000 },
  { kind: "zoom", text: "Booked in three steps: a pharmacy near the patient, a date and a time" },
  { kind: "pause", ms: 600 },
  { kind: "click", label: "Choose" },
  { kind: "waitFor", text: "Select date and time" },
  { kind: "click", label: "16" },
  { kind: "pause", ms: 500 },
  { kind: "click", label: "10:15 AM" },
  { kind: "click", label: "Review booking" },
  { kind: "waitFor", text: "Review & confirm" },
  { kind: "pause", ms: 900 },
  { kind: "click", label: "Confirm your booking" },
  { kind: "waitFor", text: "Booking confirmed" },
  { kind: "zoom", text: "Booking confirmed, funded by the employer" },

  // ── 10. The Advanced Health Assessment, before the appointment ────────────
  { kind: "scene", label: "Advanced Health Assessment" },
  { kind: "click", label: "Complete Advanced Health Assessment now" },
  { kind: "waitFor", text: "MEDICAL HISTORY" },
  { kind: "pause", ms: 500 },
  { kind: "zoom", text: "Before the appointment: the Advanced Health Assessment questionnaire" },
  { kind: "answerAll", perQuestionMs: 70 },
  { kind: "click", label: "Submit" },
  { kind: "waitFor", text: "successfully submitted" },
  { kind: "pause", ms: 1400 },
  { kind: "click", label: "Profile" },

  // ── 11. The two emails around the appointment ─────────────────────────────
  { kind: "scene", label: "Appointment email" },
  { kind: "waitFor", text: "Your appointment is booked" },
  { kind: "pause", ms: 600 },
  { kind: "zoom", text: "The confirmation email: where to go, what to bring, and a short video on what to expect" },
  { kind: "scrollThrough", ms: 3200 },
  { kind: "click", label: "Newer message" },

  // ── The second review: the advanced results, same gate ────────────────────
  { kind: "scene", label: "Clinician review, advanced" },
  { kind: "waitFor", text: "Ready for approval" },
  { kind: "pause", ms: 700 },
  { kind: "zoom", text: "After the pharmacy visit, the blood results and measurements get the same clinician review" },
  { kind: "click", label: "Jane Smith" },
  { kind: "waitFor", text: "Blood Pressure" },
  { kind: "pause", ms: 1100 },
  { kind: "zoom", text: "QRISK3, blood pressure, BMI, HbA1c and lipids, each flagged, then approved and dispatched" },
  { kind: "click", label: "Approve" },
  { kind: "pause", ms: 1200 },
  { kind: "click", label: "Dispatch" },

  { kind: "scene", label: "Advanced results email" },
  { kind: "waitFor", text: "Your health assessment results are ready" },
  { kind: "pause", ms: 600 },
  { kind: "zoom", text: "The second results email, with a free video GP appointment included to talk it through" },
  { kind: "scrollThrough", ms: 2200 },
  { kind: "click", label: "View my report" },

  // ── 12. The advanced results ──────────────────────────────────────────────
  // The report itself was opened once already, at scene 8; the second report
  // is shown as its results page, not the popup again. Janelle, 11 Sep: "on
  // showing the pdfs, it seems like they have been repeated 2-3x".
  { kind: "scene", label: "Advanced results" },
  { kind: "waitFor", text: "YOUR LATEST RESULTS", timeoutMs: 8000 },
  { kind: "pause", ms: 500 },
  { kind: "zoom", text: "The Advanced Health Assessment results: clinician-reviewed, with every flag explained" },
  { kind: "scrollThrough", ms: 3200 },
  { kind: "click", label: "Profile" },

  // ── 13. Back to the DCA account, through its own login ────────────────────
  { kind: "scene", label: "Back to the account" },
  { kind: "waitFor", text: "Sign in with your email address" },
  { kind: "pause", ms: 600 },
  { kind: "zoom", text: "Back on Doctor Care Anywhere, where both reports now live" },
  { kind: "type", field: "Email Address", text: "jane.smith@mail.com" },
  { kind: "type", field: "Password", text: "Demo123!" },
  { kind: "click", label: "Sign in" },

  // ── 14. Both reports, in the account ──────────────────────────────────────
  { kind: "scene", label: "Reports in the account" },
  // 27052:15761, the Home greeting: a waitFor target, not new copy.
  { kind: "waitFor", text: "What can we help you with?" },
  { kind: "pause", ms: 600 },
  { kind: "zoom", text: "Home: both assessments done, and where the reports are" },
  { kind: "click", label: "Open my health assessments" },
  { kind: "waitFor", text: "your results and report are ready" },
  { kind: "pause", ms: 800 },
  { kind: "zoom", text: "My health assessments: each report, its status, and the way to it" },
  { kind: "pause", ms: 600 },
  { kind: "click", label: "View report in Uploads" },
  { kind: "waitFor", text: "Advanced Health Assessment Report", timeoutMs: 8000 },
  { kind: "pause", ms: 800 },
  { kind: "zoom", text: "Uploads: both reports filed as PDFs in the patient's own account" },
  { kind: "pause", ms: 1200 },
  { kind: "click", label: "Home" },

  // ── 15. The GP follow-up, booked like any appointment ─────────────────────
  // PM, 10 Sep: the follow-up is the normal Book an appointment journey.
  // Janelle, 11 Sep: "enable the book an appointment button, make it work,
  // but show all the health concerns".
  { kind: "scene", label: "GP follow-up" },
  // 27052:15761, the Home greeting: a waitFor target, not new copy.
  { kind: "waitFor", text: "What can we help you with?" },
  { kind: "pause", ms: 500 },
  { kind: "zoom", text: "The free GP follow-up is booked like any Doctor Care Anywhere appointment" },
  { kind: "click", label: "Book now" },
  { kind: "waitFor", text: "Not for emergencies" },
  { kind: "pause", ms: 400 },
  { kind: "click", label: "Continue" },
  { kind: "waitFor", text: "Select a health category" },
  { kind: "pause", ms: 600 },
  { kind: "zoom", text: "Every reason to see a GP, and one for the health assessment follow-up" },
  { kind: "click", label: "Health Check Follow-Up" },
  { kind: "waitFor", text: "Select a health concern" },
  { kind: "pause", ms: 500 },
  { kind: "click", label: "Blood Test Review" },
  { kind: "waitFor", text: "Attach File" },
  { kind: "pause", ms: 500 },
  { kind: "click", label: "Continue" },
  { kind: "waitFor", text: "Select date and time" },
  { kind: "pause", ms: 600 },
  { kind: "click", label: "9:20am" },
  { kind: "pause", ms: 400 },
  { kind: "click", label: "Book now for today" },
  { kind: "waitFor", text: "Appointment booked" },
  { kind: "pause", ms: 500 },
  { kind: "zoom", text: "A video GP appointment today, with the results already to hand" },
  { kind: "pause", ms: 1200 },

  // ── 16. The employer's view, where the demo ends ──────────────────────────
  // Janelle, 4 Sep: "we also need to show a sample demographic/organisational
  // health report" and, 11 Sep, "the end of the journey should show the
  // corporate view". No real control crosses personas, so this is the
  // demo-only phase jump.
  { kind: "scene", label: "Employer's view" },
  { kind: "jumpPhase", phase: "orgReport" },
  { kind: "waitFor", text: "Total participants" },
  { kind: "pause", ms: 600 },
  // Uptake for both programmes, then the health insights view. PM, 10 Sep:
  // "in the end we can show both, this is how the health insights looks like,
  // and this is how the advanced one looks like, for corporate".
  { kind: "zoom", text: "The employer's dashboard: 119 took the Health Insights Assessment, 110 reports dispatched" },
  { kind: "pause", ms: 2200 },
  { kind: "click", label: "Advanced Health Assessment" },
  { kind: "pause", ms: 600 },
  { kind: "zoom", text: "And the Advanced Health Assessment cohort: 7 so far, with uptake by age" },
  { kind: "pause", ms: 2200 },
  { kind: "click", label: "Health insights" },
  { kind: "waitFor", text: "Report flags" },
  // Narrate over the report itself; before the jump the card played on the
  // previous screen and vanished with the phase change.
  { kind: "zoom", text: "The anonymised health picture of the workforce, never an individual" },
  { kind: "pause", ms: 2600 },
];
