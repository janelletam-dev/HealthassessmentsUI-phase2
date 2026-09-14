// The patient's results page on Full Health Medical, where the results email
// lands after the SSO.
//
// NO FIGMA FRAME: built from the staging screenshots Janelle sent on 4 Sep
// ("Hello, Deepali" on dca-test-domain). Janelle: "when the user clicks on the
// email for the results, it should show the sso to FHM portal here is the
// screenshot".
//
// THE AMBER REVIEWER'S NOTE IS ANUSHKA'S DRAFT for a real corporate (content
// review, 11 Sep, relayed by Janelle 14 Sep). The screenshot's own second
// paragraph was the internal pilot's ("further testing is not currently
// included"), which contradicts the journey this prototype demos, where the
// patient is recommended and books the next stage. The green note opens with
// the same sentence.
//
// The section chips follow the screenshot: Summary and Family History carry
// Attention, the rest Information. Download report opens the report PDF in its
// own tab, which is how FHM serves it (medical_reports/<id>.pdf). The Profile
// pill is the way back to the DCA account, as on the questionnaire's own
// submitted screen.

import { useState } from "react";
import {
  House, CircleUserRound, ClipboardList, PenSquare, ChevronRight, Info, Download,
  FlaskConical, ListChecks, Stethoscope, FileHeart, CircleCheck, Eye, X, CircleAlert, TriangleAlert,
} from "lucide-react";
import { FhmNav, WS, PAGE, RULE, BLUE, INK } from "./fhm-chrome.tsx";
import { SUBMITTED, ADVANCED_REPORT, usShort } from "./demo-dates.ts";
import { useDatedReport } from "./dated-report.ts";

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
/*
 * Three outcomes, PM, 10 Sep, from FHM's live reviewer-note templates:
 *   green      "your results are reassuring and no further assessment is
 *              needed", every section clear, and the note carries the link to
 *              the sleep guide (the DCA Home tile that used to carry it is gone)
 *   prescreen  the amber outcome: further assessment recommended, and the
 *              note carries the link to the Next steps page, which is where
 *              the explainer and Book Appointment now live
 *   advanced   the Advanced report, section names and tones as FHM's Heart
 *              Health medical: four red, three amber
 * The green note's first two paragraphs are FHM's own wording with
 * "questionnaire" swapped for the product name; the sleep sentence is new.
 */
type Tone = "alert" | "attention" | "info" | "clear";
type Stage = {
  reportName: string;
  date: string;
  pdf: "prescreen" | "advanced";
  noteTone: Tone;
  note: string[];
  /** A sentence that ends in a link, rendered after the note. */
  link?: { lead: string; label: string; target: "sleep" | "nextSteps" };
  sections: { label: string; tone: Tone }[];
};
const STAGES = {
  green: {
    reportName: "Health Insights Assessment",
    date: usShort(SUBMITTED),
    pdf: "prescreen" as const,
    noteTone: "clear" as const,
    // Same opening as Anushka's amber note; Janelle, 14 Sep: "use it on the
    // green results page too".
    note: [
      "Thank you for completing your DCA Protect Health Insights questionnaire, which looks at factors affecting your long-term cardiovascular and metabolic health.",
      "Based on your answers, your results are reassuring and no further assessment is needed at this time.",
    ],
    // NO FRAME. PM, 10 Sep: "add link here that has the sleep recommendations,
    // come up with copy".
    link: { lead: "Good sleep protects the results you have. Our clinicians recommend a 10 week guide, one week at a time.", label: "Open your sleep guide", target: "sleep" as const },
    sections: [
      { label: "Summary", tone: "clear" as const },
      { label: "Family History", tone: "clear" as const },
      { label: "Demographics", tone: "clear" as const },
      { label: "Known Medical Conditions", tone: "clear" as const },
      { label: "Lifestyle Factors", tone: "clear" as const },
      { label: "Body Metrics", tone: "clear" as const },
    ],
  },
  prescreen: {
    reportName: "Health Insights Assessment",
    date: usShort(SUBMITTED),
    pdf: "prescreen" as const,
    noteTone: "attention" as const,
    // NO FRAME. Anushka's drafted note, PowerPoint comment 11 Sep; Janelle,
    // 14 Sep: "change to this 2nd paragraph".
    note: [
      "Thank you for completing your DCA Protect Health Insights questionnaire, which looks at factors affecting your long-term cardiovascular and metabolic health.",
      "Based on your answers, we'd like to take a closer look at some areas together - this is a normal next step for many people and doesn't mean there's a problem.",
      "Please use the link below to arrange your next stage of testing. This will include some further questionnaires as well as blood tests and physical measurements.",
    ],
    // NO FRAME. PM, 10 Sep: the reviewer note links to the next steps page.
    // The note's last paragraph already introduces the link, so no lead.
    link: { lead: "", label: "Arrange your next stage of testing", target: "nextSteps" as const },
    sections: [
      { label: "Summary", tone: "attention" as const },
      { label: "Family History", tone: "attention" as const },
      { label: "Demographics", tone: "info" as const },
      { label: "Known Medical Conditions", tone: "info" as const },
      { label: "Lifestyle Factors", tone: "info" as const },
      { label: "Body Metrics", tone: "info" as const },
    ],
  },
  advanced: {
    reportName: "Advanced Corporate Health Assessment",
    date: usShort(ADVANCED_REPORT),
    pdf: "advanced" as const,
    noteTone: "alert" as const,
    note: [
      "Your Advanced Corporate Health Assessment is complete and your clinician-reviewed report is ready to view, with clear, personalised insights on where you stand and what to do next.",
      "You have a free Video GP appointment included. Book a time to discuss your results and next steps with a doctor, via the \u2018health check follow up\u2019 health concern on your Doctor Care Anywhere account.",
    ],
    sections: [
      { label: "QRiSK3", tone: "alert" as const },
      { label: "Blood Pressure", tone: "alert" as const },
      { label: "Body Mass Index", tone: "alert" as const },
      { label: "HbA1c", tone: "alert" as const },
      { label: "Lipid Profile", tone: "attention" as const },
      { label: "Heart Rate", tone: "attention" as const },
      { label: "Liver", tone: "attention" as const },
    ],
  },
} satisfies Record<string, Stage>;

const CHIP: Record<Tone, { bg: string; ink: string; label: string; Icon: typeof Info }> = {
  alert: { bg: "#fde2e1", ink: "#a33030", label: "Attention", Icon: TriangleAlert },
  attention: { bg: AMBER_BG, ink: AMBER_INK, label: "Attention", Icon: CircleAlert },
  info: { bg: INFO_BG, ink: INFO_INK, label: "Information", Icon: Info },
  clear: { bg: "#d9f2e3", ink: "#1e7a4f", label: "No concerns", Icon: CircleCheck },
};

function Chip({ tone }: { tone: Tone }) {
  const { bg, ink, label, Icon } = CHIP[tone];
  return (
    <span className="flex items-center gap-[6px] rounded-[6px] px-[12px] py-[4px] text-[13px]" style={{ background: bg, color: ink }}>
      {label}
      <Icon size={13} strokeWidth={2} />
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
  { Icon: ListChecks, title: "Advanced Health Assessment", body: "Detailed health and lifestyle questions." },
  { Icon: Stethoscope, title: "Clinician Review", body: "A clinician reviews all of your results." },
  { Icon: FileHeart, title: "Personalised Health Report", body: "Clear results and recommended next steps." },
];

const HOW_IT_WORKS = [
  { title: "Attend a pharmacy appointment", body: "Choose a pharmacy, date and time that suit you." },
  { title: "Complete your Advanced Health Assessment", body: "Before your appointment, so your results can be processed." },
  { title: "Clinician review", body: "A qualified clinician reviews your test results and assessment answers." },
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
  "Get personalised advice and treatment",
  "Improve your health and wellbeing",
  "Take proactive steps for a healthier future",
];

// The Introduction page of the Advanced Corporate Health Assessment, as the
// clinical partner draws it: left-aligned sections in two columns, rules
// between them, the closing line in plain text. Janelle, 11 Sep: "change the
// advanced health assessments screen (FHM side) to the 1st image". With
// onBook it ends in a Book Appointment button (the next steps page); without,
// the page's own footer carries Next.
function Section({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className="px-[24px] py-[22px]" style={{ borderBottom: last ? "none" : `1px solid ${RULE}` }}>
      <p className="text-[17px] font-medium leading-[24px] mb-[16px]" style={{ color: "#111827" }}>{title}</p>
      {children}
    </div>
  );
}

export function NextStepExplainer({ onBook }: { onBook?: () => void }) {
  return (
    <div className="bg-white rounded-[6px] overflow-hidden" style={{ border: `1px solid ${RULE}`, fontFamily: WS }}>
      <div className="px-[24px] pt-[26px] pb-[22px] text-center" style={{ borderBottom: `1px solid ${RULE}` }}>
        <p className="font-semibold text-[24px] leading-[32px]" style={{ color: "#111827" }}>Advanced Corporate Health Assessment</p>
        <p className="text-[15px] leading-[22px] mt-[10px] max-w-[600px] mx-auto" style={{ color: "#374151" }}>
          Based on your Pre-Screen results, we recommend a more in-depth assessment to build a clearer picture of your health. The assessment is fully funded by your employer.
        </p>
      </div>

      <Section title="What’s included">
        <div className="grid grid-cols-2 gap-x-[24px] gap-y-[18px]">
          {FEATURES.map(({ Icon, title, body }) => (
            <div key={title} className="flex gap-[12px] items-start">
              <span className="flex items-center justify-center shrink-0 size-[32px] rounded-[8px]" style={{ background: "#e8f0fe" }}>
                <Icon size={16} color={BLUE} strokeWidth={1.8} />
              </span>
              <div>
                <p className="text-[15px] font-medium leading-[22px]" style={{ color: "#111827" }}>{title}</p>
                <p className="text-[14px] leading-[21px]" style={{ color: "#4b5563" }}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="How it works">
        <div className="grid grid-cols-2 gap-x-[24px] gap-y-[18px]">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.title} className="flex gap-[12px] items-start">
              <span className="flex items-center justify-center shrink-0 size-[22px] rounded-full text-[12px] font-semibold text-white mt-[1px]" style={{ background: BLUE }}>{i + 1}</span>
              <div>
                <p className="text-[15px] font-medium leading-[22px]" style={{ color: "#111827" }}>{step.title}</p>
                <p className="text-[14px] leading-[21px]" style={{ color: "#4b5563" }}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="You may receive recommendations for">
        <ul className="list-disc pl-[20px] flex flex-col gap-[4px]">
          {RECOMMENDATION_CHIPS.map((item) => (
            <li key={item} className="text-[15px] leading-[22px]" style={{ color: "#374151" }}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title="Want to discuss your results?">
        <p className="text-[15px] leading-[22px] mt-[-6px]" style={{ color: "#374151" }}>
          You have a free Video GP appointment included, so you can talk through your results and next steps with a doctor, including any recommended treatment plans.
        </p>
      </Section>

      <Section title="Why take part?" last>
        <div className="grid grid-cols-2 gap-x-[24px] gap-y-[16px]">
          {WHY_TAKE_PART.map((reason) => (
            <div key={reason} className="flex gap-[12px] items-center">
              <span className="flex items-center justify-center shrink-0 size-[32px] rounded-full" style={{ background: "#e8f0fe" }}>
                <CircleCheck size={16} color={BLUE} strokeWidth={1.8} />
              </span>
              <p className="text-[15px] leading-[22px]" style={{ color: "#111827" }}>{reason}</p>
            </div>
          ))}
        </div>
        <p className="text-[15px] leading-[22px] mt-[22px]" style={{ color: "#374151" }}>
          Ready to get started? Book your Advanced Corporate Health Assessment at a pharmacy near you.
        </p>
        {onBook && (
          <button
            type="button"
            onClick={onBook}
            data-guide-primary
            className="rounded-[4px] px-[24px] py-[9px] mt-[18px] text-[15px] font-medium border-none cursor-pointer"
            style={{ background: BLUE, color: "#ffffff", fontFamily: WS }}
          >
            Book Appointment
          </button>
        )}
      </Section>
    </div>
  );
}

export function FhmResults({ stage = "prescreen", onExit, onNextSteps, onSleep }: {
  stage?: keyof typeof STAGES;
  onExit: () => void;
  /** The amber note's link: the explainer and Book Appointment moved to
      their own page. PM, 10 Sep. */
  onNextSteps: () => void;
  /** The green note's link: the sleep guide. */
  onSleep: () => void;
}) {
  const data: Stage = STAGES[stage];
  // Dated for today before it is shown (dated-report-core.ts).
  const pdf = useDatedReport(data.pdf) ?? "about:blank";
  // The popup viewer is invention, and says so. FHM serves the PDF in its
  // own tab, which Download report still does; Janelle, 4 Sep: "have the pdfs
  // when view report as pdf popup just to show (although not how it is but we
  // jsut want to show the contents)".
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
            data-guide-primary={stage === "advanced" || undefined}
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
              {/* Which report this is, said out loud: the lifestyle
                  questionnaire and the Advanced HA are different artefacts. */}
              <p className="font-semibold text-[15px] mt-[8px]" style={{ color: "#111827" }}>{data.reportName}</p>
              <p className="text-[14px] mt-[2px]" style={{ color: INK }}>{data.date}</p>
            </div>

            <div className="px-[28px] py-[22px]" style={{ borderBottom: `1px solid ${RULE}` }}>
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-[10px] text-[17px]" style={{ color: "#111827" }}>
                  <PenSquare size={17} color={BLUE} strokeWidth={2} /> Reviewer&rsquo;s note
                </p>
                <Chip tone={data.noteTone} />
              </div>
              {data.note.map((para) => (
                <p key={para.slice(0, 24)} className="text-[15px] leading-[24px] mt-[14px]" style={{ color: "#374151" }}>
                  {para}
                </p>
              ))}
              {data.link && (
                <p className="text-[15px] leading-[24px] mt-[14px]" style={{ color: "#374151" }}>
                  {data.link.lead}{" "}
                  <button
                    type="button"
                    onClick={data.link.target === "sleep" ? onSleep : onNextSteps}
                    data-guide-primary
                    className="underline bg-transparent border-none p-0 cursor-pointer text-[15px] font-semibold"
                    style={{ color: BLUE, fontFamily: WS }}
                  >
                    {data.link.label}
                  </button>
                </p>
              )}
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

          </div>

          {/* The next-step explainer used to sit here for the amber result. It
              is its own page now (next-steps.tsx), reached from the note. */}

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

      {viewerOpen && (
        <div
          className="fixed inset-0 z-[600] flex items-center justify-center px-[24px] py-[24px]"
          style={{ background: "rgba(3,7,18,0.55)" }}
        >
          <div className="bg-white rounded-[10px] w-full max-w-[980px] h-full flex flex-col overflow-hidden" style={{ boxShadow: "0 24px 60px rgba(3,7,18,0.35)" }}>
            <div className="flex items-center justify-between px-[20px] py-[12px]" style={{ borderBottom: `1px solid ${RULE}` }}>
              <p className="font-bold text-[15px]" style={{ color: "#111827" }}>Your report</p>
              <button
                type="button"
                onClick={() => setViewerOpen(false)}
                aria-label="Close report"
                className="flex items-center justify-center size-[30px] rounded-full cursor-pointer border-none"
                style={{ background: "#f3f4f6" }}
              >
                <X size={16} color="#374151" strokeWidth={2.5} />
              </button>
            </div>
            <iframe src={pdf} title="Your report" className="w-full flex-1 border-none block" />
          </div>
        </div>
      )}
    </div>
  );
}
