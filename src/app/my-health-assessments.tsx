// My health assessments, on the DCA side. New version, PM, 10 Sep, from the
// brief given to Irina (she designs it next week; this is the AI first pass
// she asked for): no tabs, a short blurb on how the programme works, one
// section per assessment showing only what has already happened, each with a
// link to the report in Uploads, and one button to Full Health Medical for
// anything live. The cancellation card is gone.
//
// WHAT IS SHOWN IS ONLY WHAT CANNOT CHANGE. PM: FHM's feed is up to three
// hours old and stops at 5pm, so "booked" or "next up" could be wrong by the
// time the patient reads it. "Submitted" and "report dispatched" cannot be.
//
// Figma 5048:37958 for the chrome (header, strip, title band); the body is
// NO FRAME until Irina's designs land.

import { ArrowLeft, X, Info, ExternalLink, CircleCheckBig, Headphones } from "lucide-react";
import { Logo } from "./dca-logo.tsx";
import { ContactLink } from "./contact-link.tsx";
import { SUBMITTED, APPOINTMENT, APPOINTMENT_TIME, monthYear, dayMonth } from "./demo-dates.ts";

const WS = "'Work Sans', sans-serif";
const HEADER = "#334bf6";
const STRIP = "#2f22f1";
const PAGE = "#f4f4f4";
const INK = "#0b1f4b";
const BLUE = "#135cff";
const MUTED = "#4b5563";
// The desktop frame Janelle pasted on 10 Sep ("for the health assessments
// screen add these bits"): heading #0E1E3E, card title #133595, the card's
// border, radius and shadow, the support box's border and link blue. Its
// Source Sans Pro is not loaded here, so the bars stay in Work Sans.
const HEADING = "#0e1e3e";
const CARD_TITLE = "#133595";
const LINK = "#337aff";
const CARD_SHADOW = "0px 10px 15px -3px rgba(15,55,190,0.05), 0px 4px 6px -4px rgba(15,55,190,0.05)";
const FAQS_URL = "https://doctorcareanywhere.com/faqs";
// The same inbox the Need help card carries. Hovering the link says where it
// goes, because the label does not. Janelle, 14 Sep.
const PX_EMAIL = "teamleaderescalations@doctorcareanywhere.com";

export type AssessmentsStage = "pending" | "insights" | "advanced";

// No icons: the Figma blurb (27160:34048) is title and line only. Janelle,
// 14 Sep: "figma has no icons on the left, can you align?".
const HOW_IT_WORKS = [
  { title: "Health Insights Assessment", body: "A short assessment about your health and lifestyle." },
  { title: "Clinician review", body: "A clinician reviews your answers and sends your report within 5 working days." },
  { title: "Advanced Corporate Health Assessment", body: "If recommended: blood tests and health measurements at a pharmacy, with a second report." },
];

// One line per thing that has happened, as the D2C view draws them: a green
// tick for what is done, an info mark for what is still to come. Janelle,
// 10 Sep: "you can copy from here (d2c view) for the statuses".
type Status = { done: boolean; label: string };

function StatusRow({ done, label }: Status) {
  const colour = done ? "#166534" : "#030712";
  const Icon = done ? CircleCheckBig : Info;
  return (
    <div className="flex items-center gap-[8px]">
      <Icon size={16} color={colour} strokeWidth={1.33} />
      <span className="text-[12px] font-semibold leading-[16px]" style={{ color: colour }}>{label}</span>
    </div>
  );
}

function AssessmentCard({ title, when, statuses, linkLabel, onLink }: {
  title: string; when: string; statuses: Status[]; linkLabel?: string; onLink?: () => void;
}) {
  return (
    <div
      className="flex items-center gap-[16px] rounded-[16px] p-[24px]"
      style={{ border: "1px solid #d7e9ff", background: "#ffffff", boxShadow: CARD_SHADOW }}
    >
      <div className="flex flex-col gap-[16px] flex-1 min-w-0">
        <div className="flex flex-col gap-[4px]">
          <p className="text-[18px] font-semibold leading-[28px]" style={{ color: CARD_TITLE }}>{title}</p>
          <p className="text-[12px] leading-[16px]" style={{ color: "#030712" }}>{when}</p>
        </div>
        <div className="flex flex-col gap-[8px]">
          {statuses.map((status) => <StatusRow key={status.label} {...status} />)}
        </div>
      </div>
      {/* Secondary, as Figma 27160:33988: the card's button is outlined and
          only Manage is filled. Janelle, 14 Sep: "the secondary button
          colors see node". */}
      {linkLabel && onLink && (
        <button
          type="button"
          onClick={onLink}
          data-guide-primary
          className="flex items-center justify-center gap-[8px] shrink-0 rounded-[9999px] px-[16px] py-[12px] cursor-pointer bg-transparent"
          style={{ border: `1px solid ${BLUE}`, fontFamily: WS }}
        >
          <span className="text-[12px] font-semibold leading-[16px]" style={{ color: BLUE }}>{linkLabel}</span>
          <ExternalLink size={16} color={BLUE} strokeWidth={1.33} />
        </button>
      )}
    </div>
  );
}

export function MyHealthAssessments({ stage, onOpenUploads, onOpenFhm, onBack }: {
  stage: AssessmentsStage;
  /** The report links: DCA's own Uploads, not FHM. PM, 10 Sep, relaying Laura. */
  onOpenUploads: () => void;
  /** The one button out to Full Health Medical, for anything still live there. */
  onOpenFhm: () => void;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: PAGE, fontFamily: WS }}>
      <div className="flex items-center justify-between px-[24px] h-[70px]" style={{ background: HEADER }}>
        <Logo />
        <span className="flex items-center gap-[6px] text-white font-semibold text-[14px]">
          Exit <X size={16} strokeWidth={2.5} />
        </span>
      </div>

      <div className="flex items-center justify-between px-[24px] h-[40px]" style={{ background: STRIP }}>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-[8px] bg-transparent border-none cursor-pointer p-0 text-white font-semibold text-[13px]"
          style={{ fontFamily: WS }}
        >
          <ArrowLeft size={14} strokeWidth={2.5} /> Back a step
        </button>
        {/* One link, the real FAQs page. Irina, Figma comment #159: "right
            links and right content"; Janelle, 11 Sep: "just place one". The
            page itself now says how the assessment works. */}
        <a href={FAQS_URL} target="_blank" rel="noreferrer" className="text-white font-semibold text-[13px] underline underline-offset-2">Health assessment FAQs</a>
      </div>

      <div className="bg-white px-[130px] py-[28px]">
        {/* 27160:34024. The tile below carries "My health assessments", so
            the page title does not repeat it. Janelle, 14 Sep: "we have
            duplicated the main title and sub heading". */}
        <p className="text-[42px] font-bold leading-[42px]" style={{ color: HEADING }}>Health assessments</p>
      </div>

      <div className="flex flex-col items-center gap-[24px] pt-[40px] pb-[80px] flex-1">
        <div className="bg-white rounded-[8px] w-[700px] p-[26px] flex flex-col gap-[16px]">
          {/* The heading and the general CTA share one row. The GP follow-up
              is booked from Home. Janelle, 11 Sep: "the general CTA should not
              be book a follow up appt"; 12 Sep: "still be there as a general
              one"; 14 Sep: "in the same line as the My health assessments
              tile on its right", "not at the bottom". */}
          <div className="flex items-center justify-between gap-[16px]">
            <p className="text-[20px] font-bold leading-[28px]" style={{ color: HEADING }}>My health assessments</p>
            <button
              type="button"
              onClick={onOpenFhm}
              className="flex items-center gap-[8px] rounded-full px-[20px] py-[10px] cursor-pointer border-none shrink-0"
              style={{ background: BLUE }}
            >
              <span className="text-[13px] font-semibold text-white">Manage my health assessments</span>
              <ExternalLink size={14} color="#ffffff" strokeWidth={2} />
            </button>
          </div>
          {/* The feed behind the statuses is hours old at worst. Irina, Figma
              comment #157: "info icon about out of real time". */}
          <p className="flex items-center gap-[6px] text-[13px] leading-[18px] mt-[-8px]" style={{ color: MUTED }}>
            <Info size={14} strokeWidth={2} /> Statuses can take a few hours to update.
          </p>

          {/* Nothing to open yet, so no link. Janelle, 10 Sep: "there should
              be no go to uploads as it should be the health Insights
              assessment submitted". */}
          {stage === "pending" ? (
            <AssessmentCard
              title="Health Insights Assessment"
              when={monthYear(SUBMITTED)}
              // Review and report arrive as one event. Janelle, 11 Sep:
              // "review and results come together".
              statuses={[
                { done: true, label: "Health Insights Assessment submitted" },
                { done: false, label: "Awaiting clinician review and your report, within 5 working days" },
              ]}
            />
          ) : (
            <AssessmentCard
              title="Health Insights Assessment"
              when={monthYear(SUBMITTED)}
              statuses={[
                { done: true, label: "Health Insights Assessment submitted" },
                { done: true, label: "Reviewed by a clinician, your report is ready" },
              ]}
              linkLabel="View report in Uploads"
              onLink={onOpenUploads}
            />
          )}

          {stage === "advanced" && (
            <AssessmentCard
              title="Advanced Corporate Health Assessment"
              when={monthYear(APPOINTMENT)}
              statuses={[
                { done: true, label: `Appointment completed on ${dayMonth(APPOINTMENT)}, ${APPOINTMENT_TIME.replace(" AM", "am")}` },
                { done: true, label: "Reviewed by a clinician, your results and report are ready" },
              ]}
              linkLabel="View report in Uploads"
              onLink={onOpenUploads}
            />
          )}

        </div>

        {/* The blurb the PM asked for: what the programme is, in the words of
            the landing page's own steps. */}
        <div className="bg-white rounded-[8px] w-[700px] p-[26px]">
          <p className="text-[16px] font-bold leading-[24px]" style={{ color: "#111827" }}>How your health assessment works</p>
          <div className="flex flex-col gap-[12px] mt-[14px]">
            {HOW_IT_WORKS.map(({ title, body }) => (
              <div key={title}>
                <p className="text-[14px] font-semibold leading-[20px]" style={{ color: INK }}>{title}</p>
                <p className="text-[13px] leading-[18px]" style={{ color: MUTED }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="flex items-start justify-between gap-[24px] bg-white rounded-[5px] w-[700px] px-[16px] py-[24px]"
          style={{ border: "1px solid #d2d2d2" }}
        >
          <div className="flex gap-[8px] items-start flex-1">
            <Info size={20} color="#00008f" strokeWidth={2} className="shrink-0 mt-[3px]" />
            <div className="flex flex-col gap-[8px]">
              <p className="text-[16px] font-bold leading-[19px]" style={{ color: HEADING }}>Questions about your health assessment?</p>
              <p className="text-[14px] leading-[19px]" style={{ color: "#414141" }}>
                Our Patient Experience team can help with anything about your assessment or your report.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-[14px] shrink-0">
            <ContactLink
              href={`mailto:${PX_EMAIL}`}
              hint={`Opens your email app · ${PX_EMAIL}`}
              className="flex items-center gap-[6px] text-[16px] font-bold leading-[19px] underline"
              style={{ color: LINK }}
            >
              <Headphones size={22} strokeWidth={2} /> Contact Patient Experience
            </ContactLink>
            <a href={FAQS_URL} target="_blank" rel="noreferrer" className="text-[16px] font-bold leading-[20px] underline" style={{ color: LINK }}>Health assessment FAQs</a>
          </div>
        </div>
      </div>
    </div>
  );
}
