// The patient's results page on Full Health Medical, where the results email
// lands after the SSO.
//
// NO FIGMA FRAME: built from the staging screenshots Janelle sent on 4 Sep
// ("Hello, Deepali" on dca-test-domain). Janelle: "when the user clicks on the
// email for the results, it should show the sso to FHM portal here is the
// screenshot".
//
// THE REVIEWER'S NOTE IS ADAPTED, NOT VERBATIM. The screenshot's second
// paragraph is the internal pilot's ("further testing is not currently
// included"), which would contradict the journey this prototype demos, where
// the patient is recommended and books the Advanced assessment. The first
// paragraph is the screenshot's; the second follows the recommendation wording
// of Jane's own report PDF. Swap back when the pilot copy is the story.
//
// The section chips follow the screenshot: Summary and Family History carry
// Attention, the rest Information. Download report opens the report PDF in its
// own tab, which is how FHM serves it (medical_reports/<id>.pdf). The Profile
// pill is the way back to the DCA account, as on the questionnaire's own
// submitted screen.

import { useState } from "react";
import {
  House, CircleUserRound, ClipboardList, PenSquare, ChevronRight, Info, Download,
  FlaskConical, ListChecks, Stethoscope, FileHeart, CircleCheck, Eye,
} from "lucide-react";
import { FhmNav, WS, PAGE, RULE, BLUE, INK } from "./fhm-chrome.tsx";
import reportPdf from "../assets/portal/health-insights-pre-screen-report.pdf";
import advancedReportPdf from "../assets/portal/advanced-health-assessment-report.pdf";

const AMBER_BG = "#fdf3d8";
const AMBER_INK = "#8a6d1a";
const INFO_BG = "#dbeafe";
const INFO_INK = "#1d4ed8";

/*
 * BOTH RESULTS LIVE HERE, per the PM's ruling relayed by Janelle on 4 Sep:
 * "we redirect the patients to FHM to view their report and not to DCA
 * Uploads. The reason being, for patients further referred to advanced HA,
 * the process is only available on FHM platform." The pre-screen stage is the
 * staging screenshot's; the advanced stage's sections follow the approved
 * advanced medical's screenshot (Blood Pressure and BMI on Attention), its
 * note follows the advanced results email and deck steps 21-22, and its
 * explainer is gone because that step is done.
 */
const STAGES = {
  prescreen: {
    date: "Sep 4 2026",
    pdf: "prescreen" as const,
    note: [
      "Thank you for completing your DCA Protect Health Insights questionnaire, which looks at factors affecting your long-term cardiovascular and metabolic health.",
      "Based on your answers, we believe you would benefit from progressing to the next stage of the programme: the Advanced Corporate Health Assessment. You can book this below. In the meantime, you can also book an appointment for further discussion with a DCA GP (via the \u2018health check follow up\u2019 health concern).",
    ],
    sections: [
      { label: "Summary", tone: "attention" },
      { label: "Family History", tone: "attention" },
      { label: "Demographics", tone: "info" },
      { label: "Known Medical Conditions", tone: "info" },
      { label: "Lifestyle Factors", tone: "info" },
      { label: "Body Metrics", tone: "info" },
    ],
  },
  advanced: {
    date: "Sep 18 2026",
    pdf: "advanced" as const,
    note: [
      "Your Advanced Corporate Health Assessment is complete and your clinician-reviewed report is ready to view, with clear, personalised insights on where you stand and what to do next.",
      "You have a free Video GP appointment included. Book a time to discuss your results and next steps with a doctor, via the \u2018health check follow up\u2019 health concern on your Doctor Care Anywhere account.",
    ],
    sections: [
      { label: "Blood Pressure", tone: "attention" },
      { label: "Body Mass Index", tone: "attention" },
      { label: "QRiSK 3", tone: "info" },
      { label: "Lipid Profile", tone: "info" },
      { label: "Heart Rate", tone: "info" },
      { label: "Full Blood Count", tone: "info" },
    ],
  },
} satisfies Record<string, { date: string; pdf: "prescreen" | "advanced"; note: string[]; sections: { label: string; tone: "attention" | "info" }[] }>;

function Chip({ tone }: { tone: "attention" | "info" }) {
  const attention = tone === "attention";
  return (
    <span
      className="flex items-center gap-[6px] rounded-[6px] px-[12px] py-[4px] text-[13px]"
      style={{ background: attention ? AMBER_BG : INFO_BG, color: attention ? AMBER_INK : INFO_INK }}
    >
      {attention ? "Attention" : "Information"}
      <Info size={13} strokeWidth={2} />
    </span>
  );
}


/*
 * The next-step explainer, from the reference layout Janelle sent on 4 Sep:
 * "to add more info just like this - a version on what they should be
 * expecting", one page with the results. Copy is drawn from the journey's own
 * verified sources where one exists: the intro and step one from the results
 * email (funded by your employer; choose a pharmacy, date and time), step two
 * from the appointment email (complete before your appointment so results can
 * be processed), the video GP line from the advanced results email, and Why
 * take part from the invitation email's Why it matters list. The tile and
 * chip wordings are the reference's, sharpened where its render is too small
 * to read.
 */
const FEATURES = [
  { Icon: FlaskConical, title: "Comprehensive Testing", body: "Blood tests and health measurements." },
  { Icon: ListChecks, title: "In-Depth Questionnaire", body: "Detailed health and lifestyle questions." },
  { Icon: Stethoscope, title: "Clinician Review", body: "A clinician reviews all of your results." },
  { Icon: FileHeart, title: "Personalised Health Report", body: "Clear results and recommended next steps." },
];

const HOW_IT_WORKS = [
  { title: "Attend a pharmacy appointment", body: "Choose a pharmacy, date and time that suit you." },
  { title: "Complete an Advanced Health Questionnaire", body: "Before your appointment, so your results can be processed." },
  { title: "Clinician review", body: "A qualified clinician reviews your test results and questionnaire answers." },
  { title: "Receive your personalised report", body: "Detailed insights and recommended next steps." },
];

const RECOMMENDATION_CHIPS = [
  "Lifestyle changes",
  "Nutrition and exercise",
  "Medication or treatment options",
  "Further investigations or specialist referrals",
];

const WHY_TAKE_PART = [
  "Identify potential health risks early",
  "Get personalised advice",
  "Improve your energy, fitness and wellbeing",
  "Take proactive steps for a healthier future",
];

export function NextStepExplainer({ onBook }: { onBook: () => void }) {
  return (
    <div className="bg-white rounded-[6px] overflow-hidden" style={{ border: `1px solid ${RULE}` }}>
      <div className="px-[28px] pt-[26px] pb-[22px] text-center" style={{ borderBottom: `1px solid ${RULE}` }}>
        <p className="font-bold text-[14px] tracking-[0.03em]" style={{ color: BLUE }}>YOUR NEXT STEP</p>
        <p className="font-bold text-[26px] leading-[34px] mt-[6px]" style={{ color: "#0b1f4b" }}>
          Advanced Corporate Health Assessment
        </p>
        <p className="text-[15px] leading-[24px] mt-[10px] max-w-[620px] mx-auto" style={{ color: "#374151" }}>
          Based on your Pre-Screen results, we recommend a more in-depth assessment to build a clearer picture of your health. The assessment is fully funded by your employer.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-[14px] px-[28px] py-[22px]" style={{ borderBottom: `1px solid ${RULE}` }}>
        {FEATURES.map(({ Icon, title, body }) => (
          <div key={title} className="rounded-[8px] px-[14px] py-[16px] text-center" style={{ background: "#f0f6ff" }}>
            <Icon size={22} color={BLUE} strokeWidth={1.8} className="mx-auto" />
            <p className="font-bold text-[13px] leading-[18px] mt-[8px]" style={{ color: "#0b1f4b" }}>{title}</p>
            <p className="text-[12px] leading-[17px] mt-[4px]" style={{ color: "#4b5563" }}>{body}</p>
          </div>
        ))}
      </div>

      <div className="px-[28px] py-[22px]" style={{ borderBottom: `1px solid ${RULE}` }}>
        <p className="font-bold text-[16px] text-center" style={{ color: "#0b1f4b" }}>How it works</p>
        <div className="grid grid-cols-4 gap-[14px] mt-[16px]">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.title} className="text-center">
              <span
                className="mx-auto flex items-center justify-center size-[26px] rounded-full text-[13px] font-bold text-white"
                style={{ background: BLUE }}
              >
                {i + 1}
              </span>
              <p className="font-bold text-[13px] leading-[18px] mt-[8px]" style={{ color: "#0b1f4b" }}>{step.title}</p>
              <p className="text-[12px] leading-[17px] mt-[4px]" style={{ color: "#4b5563" }}>{step.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-[28px] py-[20px] text-center" style={{ borderBottom: `1px solid ${RULE}` }}>
        <p className="font-bold text-[14px]" style={{ color: "#0b1f4b" }}>You may receive recommendations for:</p>
        <div className="flex flex-wrap justify-center gap-[8px] mt-[12px]">
          {RECOMMENDATION_CHIPS.map((chip) => (
            <span key={chip} className="rounded-full px-[14px] py-[6px] text-[13px]" style={{ background: "#e9f8ef", color: "#166534" }}>
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div className="px-[28px] py-[20px] text-center" style={{ borderBottom: `1px solid ${RULE}` }}>
        <p className="font-bold text-[15px]" style={{ color: "#0b1f4b" }}>Want to discuss your results?</p>
        <p className="text-[14px] leading-[22px] mt-[6px] max-w-[560px] mx-auto" style={{ color: "#374151" }}>
          You have a free Video GP appointment included, so you can talk your results and next steps through with a doctor once your report is ready.
        </p>
      </div>

      <div className="px-[28px] py-[20px]" style={{ borderBottom: `1px solid ${RULE}` }}>
        <p className="font-bold text-[15px] text-center" style={{ color: "#0b1f4b" }}>Why take part?</p>
        <div className="grid grid-cols-4 gap-[12px] mt-[14px]">
          {WHY_TAKE_PART.map((reason) => (
            <div key={reason} className="flex flex-col items-center gap-[6px] text-center">
              <CircleCheck size={18} color="#166534" strokeWidth={2} />
              <p className="text-[12px] leading-[17px]" style={{ color: "#374151" }}>{reason}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-[28px] py-[20px]" style={{ background: BLUE }}>
        <div>
          <p className="font-bold text-[16px] text-white">Ready to get started?</p>
          <p className="text-[13px] mt-[2px]" style={{ color: "#dbeafe" }}>
            Book your Advanced Corporate Health Assessment at a pharmacy near you.
          </p>
        </div>
        <button
          type="button"
          onClick={onBook}
          className="rounded-full px-[26px] py-[11px] text-[15px] font-bold border-none cursor-pointer shrink-0"
          style={{ background: "#ffffff", color: BLUE, fontFamily: WS }}
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
}

export function FhmResults({ stage = "prescreen", onExit, onBook }: {
  stage?: keyof typeof STAGES;
  onExit: () => void;
  /** Janelle, 4 Sep: after the results, "show the view also for booking their
      appointment on the clinical site for their bloodworks". The patient is
      already on FHM, so no SSO: straight into the booking flow. The DCA
      account's My health assessments route stays as the other way in. */
  onBook: () => void;
}) {
  const data = STAGES[stage];
  const pdf = data.pdf === "advanced" ? advancedReportPdf : reportPdf;
  // The inline viewer is invention: FHM serves the PDF in its own tab, and
  // Download report still does. But an own-tab document cannot be walked to
  // the clinician's letter by the demo, and reports no longer open on the DCA
  // side, so the page offers a view-in-place too.
  const [viewerOpen, setViewerOpen] = useState(false);
  return (
    <div className="min-h-screen w-full" style={{ background: PAGE, fontFamily: WS }}>
      <FhmNav menu={false} />

      <div className="flex items-center justify-center" style={{ height: 89, background: BLUE }}>
        <div className="flex items-center rounded-[9999px] p-[4px]" style={{ background: "#4871f7" }}>
          <span className="flex items-center gap-[8px] rounded-[9999px] px-[16px] py-[8px] bg-white text-[16px] leading-[24px]" style={{ color: BLUE }}>
            <House size={16} strokeWidth={2} />
            Home
          </span>
          <button
            type="button"
            onClick={onExit}
            className="flex items-center gap-[8px] rounded-[9999px] px-[16px] py-[8px] bg-transparent border-none cursor-pointer text-[16px] leading-[24px] text-white"
            style={{ fontFamily: WS }}
          >
            <CircleUserRound size={16} strokeWidth={2} />
            Profile
          </button>
        </div>
      </div>

      <div className="flex justify-center px-[24px] pt-[36px] pb-[100px]">
        <div className="w-full max-w-[900px] flex flex-col gap-[20px]">
          <p className="text-[22px] leading-[30px]" style={{ color: "#111827" }}>Hello, Jane</p>

          <div className="bg-white rounded-[6px]" style={{ border: `1px solid ${RULE}` }}>
            <div className="px-[28px] py-[22px]" style={{ borderBottom: `1px solid ${RULE}` }}>
              <p className="flex items-center gap-[10px] font-bold text-[16px] tracking-[0.03em]" style={{ color: BLUE }}>
                <ClipboardList size={18} strokeWidth={2} /> YOUR LATEST RESULTS
              </p>
              {/* The dates track the emails: results 4 Sep, advanced 18 Sep. */}
              <p className="text-[15px] mt-[8px]" style={{ color: INK }}>{data.date}</p>
            </div>

            <div className="px-[28px] py-[22px]" style={{ borderBottom: `1px solid ${RULE}` }}>
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-[10px] text-[17px]" style={{ color: "#111827" }}>
                  <PenSquare size={17} color={BLUE} strokeWidth={2} /> Reviewer&rsquo;s note
                </p>
                <Chip tone="attention" />
              </div>
              {data.note.map((para) => (
                <p key={para.slice(0, 24)} className="text-[15px] leading-[24px] mt-[14px]" style={{ color: "#374151" }}>
                  {para}
                </p>
              ))}
            </div>

            {data.sections.map((section) => (
              <div
                key={section.label}
                className="flex items-center justify-between px-[28px] py-[16px]"
                style={{ borderBottom: `1px solid ${RULE}` }}
              >
                <p className="text-[16px]" style={{ color: "#111827" }}>{section.label}</p>
                <span className="flex items-center gap-[16px]">
                  <Chip tone={section.tone} />
                  <ChevronRight size={16} color="#6b7280" strokeWidth={2} />
                </span>
              </div>
            ))}

            <div className="px-[28px] py-[20px] flex flex-col gap-[12px]">
              <p className="flex items-center gap-[8px] text-[15px] underline" style={{ color: BLUE }}>
                <Info size={15} strokeWidth={2} /> About your report
              </p>
              <button
                type="button"
                onClick={() => setViewerOpen((open) => !open)}
                className="flex items-center gap-[8px] text-[15px] underline w-fit bg-transparent border-none p-0 cursor-pointer"
                style={{ color: BLUE, fontFamily: WS }}
              >
                <Eye size={15} strokeWidth={2} /> View report
              </button>
              {/* FHM serves the report at its own medical_reports URL; the
                  same gesture opens the PDF in its own tab. */}
              <a
                href={pdf}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-[8px] text-[15px] underline w-fit"
                style={{ color: BLUE }}
              >
                <Download size={15} strokeWidth={2} /> Download report
              </a>
            </div>

            {viewerOpen && (
              <div style={{ borderTop: `1px solid ${RULE}` }}>
                <iframe src={pdf} title="Your report" className="w-full h-[820px] border-none block" />
              </div>
            )}
          </div>

          {stage === "prescreen" && <NextStepExplainer onBook={onBook} />}

          <div className="bg-white rounded-[6px] flex items-center justify-between px-[28px] py-[18px]" style={{ border: `1px solid ${RULE}` }}>
            <p className="flex items-center gap-[10px] text-[16px]" style={{ color: "#111827" }}>
              <ClipboardList size={17} color="#6b7280" strokeWidth={2} /> View all reports
            </p>
            <ChevronRight size={16} color="#6b7280" strokeWidth={2} />
          </div>
          <div className="bg-white rounded-[6px] flex items-center justify-between px-[28px] py-[18px]" style={{ border: `1px solid ${RULE}` }}>
            <p className="flex items-center gap-[10px] text-[16px]" style={{ color: "#111827" }}>
              <ClipboardList size={17} color="#6b7280" strokeWidth={2} /> View all test results
            </p>
            <ChevronRight size={16} color="#6b7280" strokeWidth={2} />
          </div>
        </div>
      </div>
    </div>
  );
}
