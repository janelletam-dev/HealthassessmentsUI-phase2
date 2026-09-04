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

import {
  House, CircleUserRound, ClipboardList, PenSquare, ChevronRight, Info, Download,
} from "lucide-react";
import { FhmNav, WS, PAGE, RULE, BLUE, INK } from "./fhm-chrome.tsx";
import reportPdf from "../assets/portal/health-insights-pre-screen-report.pdf";

const AMBER_BG = "#fdf3d8";
const AMBER_INK = "#8a6d1a";
const INFO_BG = "#dbeafe";
const INFO_INK = "#1d4ed8";

const SECTIONS: { label: string; tone: "attention" | "info" }[] = [
  { label: "Summary", tone: "attention" },
  { label: "Family History", tone: "attention" },
  { label: "Demographics", tone: "info" },
  { label: "Known Medical Conditions", tone: "info" },
  { label: "Lifestyle Factors", tone: "info" },
  { label: "Body Metrics", tone: "info" },
];

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

export function FhmResults({ onExit }: { onExit: () => void }) {
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
              {/* The results email arrives 4 Sep at 16:02; the review is the same day. */}
              <p className="text-[15px] mt-[8px]" style={{ color: INK }}>Sep 4 2026</p>
            </div>

            <div className="px-[28px] py-[22px]" style={{ borderBottom: `1px solid ${RULE}` }}>
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-[10px] text-[17px]" style={{ color: "#111827" }}>
                  <PenSquare size={17} color={BLUE} strokeWidth={2} /> Reviewer&rsquo;s note
                </p>
                <Chip tone="attention" />
              </div>
              <p className="text-[15px] leading-[24px] mt-[16px]" style={{ color: "#374151" }}>
                Thank you for completing your DCA Protect Health Insights questionnaire, which looks at factors affecting your long-term cardiovascular and metabolic health.
              </p>
              <p className="text-[15px] leading-[24px] mt-[14px]" style={{ color: "#374151" }}>
                Based on your answers, we believe you would benefit from progressing to the next stage of the programme: the Advanced Corporate Health Assessment. You can book this from your Doctor Care Anywhere account. In the meantime, you can also book an appointment for further discussion with a DCA GP (via the &lsquo;health check follow up&rsquo; health concern).
              </p>
            </div>

            {SECTIONS.map((section) => (
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
              <p className="flex items-center gap-[8px] text-[15px] underline" style={{ color: BLUE }}>
                <Download size={15} strokeWidth={2} /> Download results
              </p>
              {/* FHM serves the report at its own medical_reports URL; here the
                  same gesture opens the report PDF in its own tab. */}
              <a
                href={reportPdf}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-[8px] text-[15px] underline w-fit"
                style={{ color: BLUE }}
              >
                <Download size={15} strokeWidth={2} /> Download report
              </a>
            </div>
          </div>

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
