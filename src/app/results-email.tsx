// e10, results ready with an Advanced HA recommended.
//
// Health assessments rDltwIr2dJvUUNaXEqEYFO, page "B2B2C (Email comms)", frame
// 5193:8107. Janelle, 3 Sep: "the medical team will review and if further
// tseting needed they receive this email".
//
// Its type is its own frame's, not the invitation's: 40 SemiBold on the title
// against 30 Medium there, and the numbered badges are 12 SemiBold #edf6ff with
// a white ring against 14 Bold white. The two emails live in different files
// and are at different draft stages, so neither is normalised onto the other.

import { ArrowRight } from "lucide-react";
import trustpilotRow from "../assets/email/trustpilot-row.png";
import { EmailShell, INK_ALT } from "./email-chrome.tsx";
import { EmailClient } from "./email-client.tsx";
import { RESULTS_EMAIL, MAILBOX, EMAIL_FOOTER } from "./email-copy.ts";

const TITLE_INK = "#1e3a5f";
const BADGE = "#11225a";
const ON_BADGE = "#edf6ff";

export function ResultsEmail({ onView }: { onView: () => void }) {
  return (
    <EmailClient subject={MAILBOX.results.subject} date={MAILBOX.results.date}>
      <EmailShell
        title={RESULTS_EMAIL.title}
        titleSize={40}
        titleWeight={600}
        titleColor={TITLE_INK}
        greeting={RESULTS_EMAIL.greeting}
        greetingColor={INK_ALT}
        smallPrint={EMAIL_FOOTER.smallPrint}
      >
        <div className="flex flex-col gap-[16px] w-full">
          {RESULTS_EMAIL.intro.map((para) => (
            <p key={para} style={{ fontSize: 16, lineHeight: 1.5, color: INK_ALT }}>{para}</p>
          ))}
        </div>

        <div className="flex flex-col gap-[16px] w-full mt-[24px]">
          <p className="font-semibold" style={{ fontSize: 24, lineHeight: "32px", color: INK_ALT }}>
            {RESULTS_EMAIL.nextHeading}
          </p>
          {RESULTS_EMAIL.steps.map((step, i) => (
            <div key={step.title} className="flex gap-[16px] items-start w-full">
              {/* 28px disc, #11225a with a white ring, number 12 SemiBold */}
              <div
                className="flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-[9999px]"
                style={{ background: BADGE, border: "1px solid #ffffff" }}
              >
                <span className="font-semibold" style={{ fontSize: 12, lineHeight: "16px", color: ON_BADGE }}>{i + 1}</span>
              </div>
              <div className="flex flex-col gap-[4px] flex-1">
                <p className="font-semibold" style={{ fontSize: 16, lineHeight: "24px", color: INK_ALT }}>{step.title}</p>
                <p style={{ fontSize: 16, lineHeight: "24px", color: INK_ALT }}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 280x56 in the frame, padding 16/24, label 16 SemiBold #edf6ff */}
        <div className="flex justify-center w-full mt-[24px]">
          <button
            onClick={onView}
            className="flex items-center justify-center gap-[8px] cursor-pointer"
            style={{ background: BADGE, borderRadius: 9999, border: "none", padding: "16px 24px" }}
          >
            <span className="font-semibold" style={{ fontSize: 16, lineHeight: "24px", color: ON_BADGE }}>
              {RESULTS_EMAIL.cta}
            </span>
            <ArrowRight size={16} color={ON_BADGE} strokeWidth={1.33} />
          </button>
        </div>

        <div className="flex flex-col gap-[16px] w-full mt-[24px]">
          {RESULTS_EMAIL.closing.map((para) => (
            <p key={para} style={{ fontSize: 16, lineHeight: 1.5, color: INK_ALT }}>{para}</p>
          ))}
          <div className="flex flex-col">
            <p style={{ fontSize: 16, lineHeight: "24px", color: INK_ALT }}>{RESULTS_EMAIL.thanksLead}</p>
            <p style={{ fontSize: 16, lineHeight: "24px", color: INK_ALT }}>{RESULTS_EMAIL.thanksTeam}</p>
          </div>
        </div>

        <div className="flex justify-center w-full pt-[50px] pb-[20px]">
          <img src={trustpilotRow} alt="" aria-hidden className="h-[22px] object-contain" />
        </div>
      </EmailShell>
    </EmailClient>
  );
}
