// The fast-forward demo's score: every scene, keystroke and click, in order.
//
// NO FRAME anywhere in this file: nothing here is user-facing copy. The zoom
// lines quote what is already on screen (email subjects, card titles) or
// caption the beat in plain words; the typed values are the prototype's own
// demo fixtures (Jane Smith, jane.doe@mail.com, the ABC-12345 invite code).
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
  { kind: "zoom", text: "Jane, your Health Insights Assessment is ready for you" },
  { kind: "scrollThrough", ms: 3000 },
  { kind: "click", label: "Create account" },

  // ── 2. The landing ─────────────────────────────────────────────────────────
  // No code entry in this journey: the invite carries the code by email and it
  // is used later, for the questionnaire.
  { kind: "scene", label: "Landing" },
  { kind: "waitFor", text: "Find the right assessment for you" },
  { kind: "pause", ms: 900 },
  { kind: "click", label: "Get started" },

  // ── 3. Create the account ──────────────────────────────────────────────────
  { kind: "scene", label: "Create account" },
  { kind: "waitFor", text: "Create your account" },
  { kind: "type", field: "e.g., Jane", text: "Jane" },
  { kind: "type", field: "e.g., Smith", text: "Smith" },
  { kind: "type", field: "jane.doe@mail.com", text: "jane.smith@mail.com" },
  { kind: "type", field: "Choose a strong password", text: "Harbour-Sunrise-42" },
  { kind: "type", field: "DD/MM/YYYY", text: "01/01/1981" },
  { kind: "click", label: "I agree to the Terms" },
  { kind: "click", label: "Create account" },

  // ── 4. Profile: contact info with the OTP ─────────────────────────────────
  { kind: "scene", label: "Contact info" },
  { kind: "waitFor", text: "Send verification code" },
  { kind: "type", field: "07123 456 789", text: "07700 900123" },
  { kind: "click", label: "Send verification code" },
  { kind: "waitFor", text: "Enter the code sent to" },
  { kind: "type", field: "Verification code", text: "123456" },
  { kind: "click", label: "Verify code" },

  // ── 5. Profile: the remaining steps ───────────────────────────────────────
  { kind: "scene", label: "Personal details" },
  { kind: "waitFor", text: "Next: GP details", timeoutMs: 12000 },
  { kind: "pause", ms: 400 },
  { kind: "click", label: "Female" },
  // The address is manual-only (no lookup service yet), so fillAll types
  // line 1, town and postcode itself.
  { kind: "fillAll" },
  { kind: "click", label: "Next: GP details" },

  { kind: "scene", label: "GP details" },
  { kind: "waitFor", text: "Next: emergency contact" },
  { kind: "pause", ms: 400 },
  { kind: "click", label: "I want to provide my NHS GP" },
  { kind: "fillAll" },
  { kind: "click", label: "Find address" },
  { kind: "pause", ms: 600 },
  { kind: "pick", trigger: "Select an option" },
  { kind: "click", label: "Next: emergency contact" },

  { kind: "scene", label: "Emergency contact" },
  { kind: "waitFor", text: "Finish profile setup" },
  { kind: "pause", ms: 400 },
  { kind: "click", label: "I want to provide emergency contact details" },
  { kind: "fillAll" },
  { kind: "pick", trigger: "Select an option" },
  { kind: "click", label: "Finish profile setup" },

  // ── 6. Handover to FHM and the pre-screen questionnaire ───────────────────
  { kind: "scene", label: "Profile complete" },
  { kind: "waitFor", text: "Full Health Medical" },
  { kind: "click", label: "Continue to questionnaire" },
  { kind: "waitFor", text: "Signing you in to Full Health Medical" },
  { kind: "scene", label: "Pre-screen questionnaire" },
  { kind: "waitFor", text: "DEMOGRAPHICS", timeoutMs: 8000 },
  { kind: "pause", ms: 500 },
  { kind: "answerAll", perQuestionMs: 90 },
  { kind: "fillAll" },
  { kind: "click", label: "Submit" },
  { kind: "waitFor", text: "has been submitted" },
  { kind: "pause", ms: 1200 },

  // ── 7. The clinician's side ───────────────────────────────────────────────
  { kind: "scene", label: "Clinician review" },
  { kind: "click", label: "Back to Dashboard" },
  { kind: "waitFor", text: "Ready for approval" },
  { kind: "zoom", text: "The lifestyle questionnaire is reviewed before anything reaches the patient" },
  { kind: "click", label: "Jane Smith" },
  { kind: "waitFor", text: "Lifestyle Factors" },
  { kind: "pause", ms: 900 },
  { kind: "zoom", text: "Approve or reject: nothing reaches the patient without this" },
  { kind: "click", label: "Approve" },
  { kind: "pause", ms: 1200 },
  { kind: "zoom", text: "Approved. Dispatch sends the email and uploads the report to the DCA account" },
  { kind: "click", label: "Dispatch" },

  // ── 8. Results arrive and the report is read ──────────────────────────────
  { kind: "scene", label: "Results email" },
  { kind: "waitFor", text: "Lifestyle Questionnaire Report Ready", timeoutMs: 12000 },
  { kind: "pause", ms: 600 },
  { kind: "zoom", text: "Lifestyle Questionnaire Report Ready" },
  { kind: "click", label: "View report" },
  { kind: "waitFor", text: "Signing you in to Full Health Medical" },
  { kind: "scene", label: "Results on FHM" },
  { kind: "waitFor", text: "YOUR LATEST RESULTS", timeoutMs: 8000 },
  { kind: "pause", ms: 900 },
  { kind: "zoom", text: "Reviewed, with a note from the clinician" },
  { kind: "scrollThrough", ms: 3400 },
  // The in-page viewer, opened to the clinician's letter and the summary.
  { kind: "click", label: "View report" },
  { kind: "pause", ms: 1400 },
  { kind: "pdfPage", page: 2 },
  { kind: "pause", ms: 2800 },
  { kind: "pdfPage", page: 5 },
  { kind: "pause", ms: 2200 },
  { kind: "click", label: "Close report" },
  // Booking starts here, on the clinical site, per the PM: the advanced
  // process only exists on FHM. The DCA account is acknowledged, not toured.
  { kind: "zoom", text: "Results and the next step on one page: booking starts right here" },
  { kind: "click", label: "Book Appointment" },

  // ── 9. Booking the advanced assessment ────────────────────────────────────
  { kind: "scene", label: "Booking with FHM" },
  { kind: "waitFor", text: "Choose a location", timeoutMs: 8000 },
  { kind: "zoom", text: "Booking the assessment: a pharmacy, a date and a time" },
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
  { kind: "zoom", text: "Booking confirmed" },

  // ── 10. The pre-appointment questionnaire ─────────────────────────────────
  { kind: "scene", label: "Pre-appointment questionnaire" },
  { kind: "click", label: "Complete questionnaire now" },
  { kind: "waitFor", text: "MEDICAL HISTORY" },
  { kind: "pause", ms: 500 },
  { kind: "answerAll", perQuestionMs: 70 },
  { kind: "click", label: "Submit" },
  { kind: "waitFor", text: "successfully submitted" },
  { kind: "pause", ms: 1400 },
  { kind: "click", label: "Profile" },

  // ── 11. The two emails around the appointment ─────────────────────────────
  { kind: "scene", label: "Appointment email" },
  { kind: "waitFor", text: "Your appointment is booked" },
  { kind: "pause", ms: 600 },
  { kind: "zoom", text: "Your appointment is booked" },
  { kind: "scrollThrough", ms: 3200 },
  { kind: "click", label: "Newer message" },

  // ── The second review: the advanced results, same gate ────────────────────
  { kind: "scene", label: "Advanced review" },
  { kind: "waitFor", text: "Ready for approval" },
  { kind: "pause", ms: 700 },
  { kind: "zoom", text: "The Advanced Health Assessment gets the same review: approve, then dispatch" },
  { kind: "click", label: "Jane Smith" },
  { kind: "waitFor", text: "Blood Pressure" },
  { kind: "pause", ms: 1100 },
  { kind: "click", label: "Approve" },
  { kind: "pause", ms: 1200 },
  { kind: "click", label: "Dispatch" },

  { kind: "scene", label: "Advanced results email" },
  { kind: "waitFor", text: "Your health assessment results are ready" },
  { kind: "pause", ms: 600 },
  { kind: "zoom", text: "Your health assessment results are ready" },
  { kind: "scrollThrough", ms: 2200 },
  { kind: "click", label: "View my report" },
  { kind: "waitFor", text: "Signing you in to Full Health Medical" },

  // ── 12. The advanced report, on FHM ───────────────────────────────────────
  { kind: "scene", label: "Advanced results on FHM" },
  { kind: "waitFor", text: "YOUR LATEST RESULTS", timeoutMs: 8000 },
  { kind: "pause", ms: 900 },
  { kind: "zoom", text: "The advanced report, reviewed and ready" },
  { kind: "scrollThrough", ms: 2600 },
  { kind: "click", label: "View report" },
  { kind: "pause", ms: 1400 },
  { kind: "pdfPage", page: 2 },
  { kind: "pause", ms: 2800 },
  { kind: "pdfPage", page: 5 },
  { kind: "pause", ms: 2200 },
  { kind: "click", label: "Close report" },
  { kind: "click", label: "Profile" },

  // ── 13. Booking the GP follow-up ──────────────────────────────────────────
  { kind: "scene", label: "GP follow-up booking" },
  { kind: "click", label: "Home" },
  { kind: "pause", ms: 700 },
  { kind: "zoom", text: "Book a GP follow-up to talk the results through" },
  { kind: "click", label: "Book follow-up appointment" },
  { kind: "waitFor", text: "Not for emergencies" },
  { kind: "pause", ms: 900 },
  { kind: "click", label: "Continue" },
  { kind: "waitFor", text: "Select a health category" },
  { kind: "pause", ms: 700 },
  { kind: "zoom", text: "Health Check Follow-Up" },
  { kind: "click", label: "Health Check Follow-Up" },
  { kind: "waitFor", text: "Select a health concern" },
  { kind: "pause", ms: 600 },
  { kind: "click", label: "Blood Test Review" },
  { kind: "waitFor", text: "Attach File" },
  { kind: "pause", ms: 900 },
  { kind: "click", label: "Continue" },
  { kind: "waitFor", text: "Select date and time" },
  { kind: "pause", ms: 500 },
  { kind: "click", label: "9:20am" },
  { kind: "pause", ms: 400 },
  { kind: "click", label: "Book now for today, 9:20am" },
  { kind: "waitFor", text: "Appointment booked" },
  { kind: "zoom", text: "Appointment booked" },
  { kind: "pause", ms: 600 },

  // ── 14. What the patient does next, in one glance ─────────────────────────
  { kind: "scene", label: "Next steps on Home" },
  { kind: "click", label: "Back to my account" },
  { kind: "click", label: "Home" },
  // 27052:15761, the Home greeting: a waitFor target, not new copy.
  { kind: "waitFor", text: "What can we help you with?" },
  { kind: "pause", ms: 600 },
  { kind: "zoom", text: "Recommended from the results: a 10 week sleep guide" },
  // Janelle, 4 Sep: "i do not see the sleep content - so have a walk through
  // tile and click on it". The tile opens the built page in the app.
  { kind: "click", label: "Open your sleep guide" },
  { kind: "waitFor", text: "Live page" },
  { kind: "pause", ms: 2600 },
  // Week 1 is live on the site; the walkthrough opens the real article.
  { kind: "click", label: "Read Week 1" },
  { kind: "pause", ms: 2000 },

  // ── 15. The organisational picture, where the demo ends ───────────────────
  // Janelle, 4 Sep: "we also need to show a sample demographic/organisational
  // health report" and "that would probably be the best place to end it and
  // not the sleep content". No real control crosses personas, so this is the
  // demo-only phase jump.
  { kind: "scene", label: "Organisational health report" },
  { kind: "zoom", text: "And the employer sees the anonymised picture" },
  { kind: "jumpPhase", phase: "clinician" },
  { kind: "waitFor", text: "Ready for approval" },
  { kind: "click", label: "Reports" },
  { kind: "waitFor", text: "Company D 2025" },
  { kind: "click", label: "Health insights" },
  { kind: "waitFor", text: "Report flags" },
  { kind: "pause", ms: 2600 },
];
