# The fast-forward demo, presenter's guide

The prototype plays the whole Health Assessment journey on its own, in the browser, in about six minutes. It is built for anyone in sales or the leadership team to show a prospective client. Nothing needs typing; the captions carry the story, and this guide gives you the words around them.

## Running it

- Open the prototype with `?demo=fastforward` on the end of the address (or the `/demo-fastforward` path). It starts on the invitation email.
- The badge at the bottom left shows the scene number and name, with worded controls: Pause and Stop while it plays; Resume, Back and Next step while it is paused. Back goes one screen back, Next step runs the script's next step. Refresh the page to start again from the top.
- To walk the journey by hand instead, open the prototype without the flag. The right arrow fills each screen with demo data and presses its main button. The left arrow goes back one screen.
- Everything typed is demo data: Jane Smith, jane.smith@mail.com, the password `Demo123!`, the text-message code `123456`.

## What to say, scene by scene

| # | Scene | On screen | Caption | Worth adding |
|---|-------|-----------|---------|--------------|
| 1 | Invitation email | The employer programme's email to Jane | It starts with an email from the employer's programme: a free Health Insights Assessment that takes a few minutes | Four steps are spelled out in the email, so the patient knows the whole shape before they start. |
| 2 | Welcome page | Doctor Care Anywhere landing page | The link lands on Doctor Care Anywhere, with the four steps ahead spelled out | Existing account holders sign in from here instead. |
| 3 | Create account | One registration form | A Doctor Care Anywhere account in one form: name, date of birth, email and password | No activation code to type; the invite carried it. |
| 4 | Mobile number | Step 1 of 4, verified by text | Profile, step 1 of 4: a mobile number, verified by text message | Results are never sent to an unverified number. |
| 5 | Personal details | Step 2 of 4 | Step 2 of 4: sex at birth and home address | Sex at birth feeds the clinical thresholds. |
| 6 | GP details | Step 3 of 4 | Step 3 of 4: the patient's GP, NHS or private, found by postcode | Manual entry is there for anyone the lookup misses. |
| 7 | Emergency contact | Step 4 of 4 | Step 4 of 4: an emergency contact, optional | |
| 8 | Profile complete | What happens next | Profile done. The assessment takes a few minutes, and a clinician reviews every answer | The expectations card is where the clinical review is first promised. |
| 9 | Health Insights Assessment | The questionnaire | The Health Insights Assessment: demographics, medical history, lifestyle, family history and body metrics | Answers are filled at speed here; a real patient takes a few minutes. |
| 10 | The account, report pending | Sign in, Home, My health assessments | Home shows only what has happened: the assessment is in, and the report is on its way | Nothing is shown that could be out of date. The clinician's review and the report arrive together. |
| 11 | Clinician review | The clinical queue and the detail page | Behind the scenes: every assessment is reviewed by a clinician before anything reaches the patient | Approve, then Dispatch. Dispatch is the step that sends the email and files the report. |
| 12 | Results email | The results-ready email | The patient is emailed the moment the report is ready | |
| 13 | Results: no concerns | Green results, PDF report, sleep guide | A clear result: every section green, and the clinician's note points to a 10 week sleep guide | Most people end here, with something useful to do. |
| 14 | Results: further assessment | Amber and red flags, next steps page | The other outcome: amber and red flags, and the clinician recommends the Advanced Health Assessment | The next steps page explains the assessment before asking anyone to book. |
| 15 | Booking the Advanced Health Assessment | Pharmacy, date, time, confirmation | Booked in three steps: a pharmacy near the patient, a date and a time | Funded by the employer; the patient pays nothing. |
| 16 | Advanced Health Assessment | The pre-appointment questionnaire | Before the appointment: the Advanced Health Assessment questionnaire | |
| 17 | Appointment email | The confirmation email | The confirmation email: where to go, what to bring, and a short video on what to expect | The video is a placeholder; the clinical team are producing the clips. |
| 18 | Clinician review, advanced | Blood results and measurements, flagged | After the pharmacy visit, the blood results and measurements get the same clinician review | QRISK3, blood pressure, BMI, HbA1c, lipids, liver, heart rate. |
| 19 | Advanced results email | The second results email | The second results email, with a free video GP appointment included to talk it through | |
| 20 | Advanced results | The advanced results page, every section flagged | The Advanced Health Assessment results: clinician-reviewed, with every flag explained | The report PDF itself is opened at scene 22, in Uploads. |
| 21 | Back to the account | Doctor Care Anywhere sign in | Back on Doctor Care Anywhere, where both reports now live | |
| 22 | Reports in the account | Home, My health assessments, Uploads, the Advanced report | Uploads: both reports filed as PDFs in the patient's own account | The Advanced report opens here, once, after the amber and red results. The free GP follow-up is booked from Home's Book an appointment; show it by hand if asked, it is not a scene. |
| 23 | Employer's view | The employer's dashboard, both programmes | The employer's dashboard: 119 took the Health Insights Assessment, 110 reports dispatched | Uptake by age, dispatch times, and the anonymised health picture. Never an individual. |

## Things not to say

- The clinical partner is not named to patients anywhere in the journey, and the captions follow suit. Say "our clinical team".
- "Within 2 days" for the report is a placeholder awaiting the product team's confirmed timeline.
- "Advanced Corporate Health Assessment" is the working name; the final name is still with the product team.
- The employer dashboard numbers are sample data.
- Cancelling an assessment is not shown; the help box on My health assessments points to the Patient Experience team.

## Keeping this in step

The captions live in `src/app/demo-script.ts`. If a caption changes there, change the table here.

To check the demo still plays end to end after a change, serve the build and run `node scripts/demo-e2e.mjs out/demo`; `node scripts/arrow-walk.mjs out/walk` does the same for the arrow-by-arrow route. Both need only Google Chrome and Node, and leave a screenshot per screen in the folder given.
