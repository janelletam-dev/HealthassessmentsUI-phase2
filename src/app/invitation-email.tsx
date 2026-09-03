// The invitation email, rendered as the prototype's first screen.
//
// Figma jemhxV3hfyu7XbfumER8xF, frame 354:102 "e1-b-invitation-no-code",
// 600x1442. Janelle, 3 Sep: "the email should be the first screen inside the
// prototype", so this is a screen, not a sendable template. Braze owns the real
// send; the strings live in email-copy.ts so the two can be compared.
//
// Sizes, colours and spacing are the frame's, taken from its own values rather
// than sampled off a render.

import { Check, ArrowRight } from "lucide-react";
import trustpilotRow from "../assets/email/trustpilot-row.png";
import { EmailShell } from "./email-chrome.tsx";
import { EmailClient } from "./email-client.tsx";
import {
  EMAIL_HEADER, EMAIL_INTRO, EMAIL_NEXT_HEADING, EMAIL_STEPS,
  EMAIL_WHY_HEADING, EMAIL_WHY, EMAIL_CTA, EMAIL_SIGNOFF, MAILBOX,
} from "./email-copy.ts";

const WS = "'Work Sans', sans-serif";
const INK = "#183153";       // body and headings
const INK_TITLE = "#1e3a5f"; // "You're invited" and the two section headings
const MUTED = "#5c6975";     // the two small lines
const MINT = "#a0f2e8";      // the Why it matters check discs

export function InvitationEmail({ onStart }: { onStart: () => void }) {
  return (
    <EmailClient subject={MAILBOX.invitation.subject} date={MAILBOX.invitation.date}>
      <EmailShell
        title={EMAIL_HEADER.title}
        titleSize={30}
        titleWeight={500}
        titleColor={INK_TITLE}
        greeting={EMAIL_HEADER.greeting}
        greetingColor={INK}
      >
<p className="w-full" style={{ fontSize: 16, lineHeight: 1.5, color: INK }}>
              {EMAIL_INTRO}
            </p>

            {/* Here's what happens next: 28px numbered discs, gap 16 */}
            <div className="flex flex-col gap-[20px] w-full mt-[20px]">
              <p className="font-medium" style={{ fontSize: 22, color: INK_TITLE }}>{EMAIL_NEXT_HEADING}</p>
              {EMAIL_STEPS.map((step, i) => (
                <div key={step.title} className="flex gap-[16px] items-start w-full">
                  <div
                    className="flex items-center justify-center shrink-0 w-[28px] h-[28px] rounded-[14px]"
                    style={{ background: INK }}
                  >
                    <span className="font-bold" style={{ fontSize: 14, color: "#ffffff" }}>{i + 1}</span>
                  </div>
                  <div className="flex flex-col gap-[4px] flex-1">
                    <p className="font-bold" style={{ fontSize: 16, color: INK }}>{step.title}</p>
                    {step.body && (
                      <p style={{ fontSize: 16, lineHeight: 1.5, color: INK }}>{step.body}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Why it matters: 24px mint discs with a 14px check */}
            <div className="flex flex-col gap-[20px] w-full mt-[20px]">
              <p className="font-medium" style={{ fontSize: 22, color: INK_TITLE }}>{EMAIL_WHY_HEADING}</p>
              {EMAIL_WHY.map((line) => (
                <div key={line} className="flex gap-[12px] items-center w-full">
                  <div
                    className="flex items-center justify-center shrink-0 w-[24px] h-[24px] rounded-[12px]"
                    style={{ background: MINT }}
                  >
                    <Check size={14} color={INK} strokeWidth={2.5} />
                  </div>
                  <p style={{ fontSize: 16, color: INK }}>{line}</p>
                </div>
              ))}
            </div>

            {/* The button is 309x50 in the frame, padding 14/40, radius 100 */}
            <div className="flex flex-col items-center gap-[16px] w-full mt-[20px]">
              <button
                onClick={onStart}
                className="flex items-center justify-center gap-[8px] cursor-pointer"
                style={{
                  background: INK, borderRadius: 100, border: "none",
                  padding: "14px 40px", color: "#ffffff",
                }}
              >
                <span className="font-bold" style={{ fontSize: 17 }}>{EMAIL_CTA.button}</span>
                <ArrowRight size={18} color="#ffffff" strokeWidth={2} />
              </button>
              <p className="text-center" style={{ fontSize: 12, color: MUTED }}>{EMAIL_CTA.under}</p>
            </div>

            <div className="flex flex-col gap-[20px] w-full mt-[20px]">
              <p style={{ fontSize: 16, lineHeight: 1.5, color: INK }}>{EMAIL_SIGNOFF.results}</p>
              <div className="flex flex-col">
                <p style={{ fontSize: 16, color: INK }}>{EMAIL_SIGNOFF.thanksLead}</p>
                <p className="font-bold" style={{ fontSize: 16, color: INK }}>{EMAIL_SIGNOFF.thanksTeam}</p>
              </div>
              <p style={{ fontSize: 12, color: MUTED }}>{EMAIL_SIGNOFF.footnote}</p>
            </div>

            {/* Trustpilot row, 50 above and 20 below in the frame */}
            <div className="flex justify-center w-full pt-[50px] pb-[20px]">
              <img src={trustpilotRow} alt="" aria-hidden className="h-[22px] object-contain" />
            </div>
      </EmailShell>
    </EmailClient>
  );
}
