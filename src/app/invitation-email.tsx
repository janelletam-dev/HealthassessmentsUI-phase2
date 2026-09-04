// The invitation email, marketing's version.
//
// Figma jemhxV3hfyu7XbfumER8xF, page B2B, section "DCA Emails", frame 449:528
// "Health Insights Assessment - Invitation Email - Activated", 600x1907, inside
// the "Non-Activated Users" subsection. Janelle, 3 Sep: "could you please use
// this as a reference, PM updated. what marketing did".
//
// WHAT CHANGED FROM THE EARLIER DRAFT AT 354:102. Not a restyle, a rewrite:
//   the product is "Health Insights Assessment", not "health assessment"
//   the greeting folds into the opening paragraph, and both are centred
//   what happens next is FOUR steps, numbered in the copy, not three badges
//   the two blocks sit in #fbfbfb cards with 8px corners
//   the tick discs are outline #183253, not filled mint
//   the CTA is "Create account →", with the arrow inside the label
//   a tinted privacy card replaces the closing paragraphs and the sign-off
//   there is no Trustpilot row
//   the small print leads with the footnote, not the membership line
//
// Marketing also dropped the em dashes, writing "-" instead. That is theirs,
// not a local edit.

import { CircleCheck } from "lucide-react";
import { EmailShell, INK } from "./email-chrome.tsx";
import { EmailClient } from "./email-client.tsx";
import {
  EMAIL_HEADER, EMAIL_INTRO, EMAIL_NEXT_HEADING, EMAIL_STEPS,
  EMAIL_WHY_HEADING, EMAIL_WHY, EMAIL_CTA, EMAIL_PRIVACY, EMAIL_FOOTER, MAILBOX,
} from "./email-copy.ts";

const CARD = "#fbfbfb";
const TICK = "#183253";

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-[8px] p-[30px]" style={{ background: CARD }}>
      <div className="flex flex-col items-center gap-[8px] w-full">{children}</div>
    </div>
  );
}

export function InvitationEmail({ onStart }: { onStart: () => void }) {
  return (
    <EmailClient subject={MAILBOX.invitation.subject} date={MAILBOX.invitation.date}>
      <EmailShell
        title={EMAIL_HEADER.title}
        smallPrint={EMAIL_FOOTER.smallPrintMarketing}
        padBottom={40}
      >
        {/* Greeting and opening paragraph are one centred block in this frame. */}
        <p className="text-center whitespace-pre-line w-full" style={{ fontSize: 16, lineHeight: 1.5, color: INK }}>
          {EMAIL_INTRO}
        </p>

        <div className="w-full mt-[20px]">
          <Card>
            <p className="text-center font-bold" style={{ fontSize: 25, lineHeight: 1.5, color: INK }}>
              {EMAIL_NEXT_HEADING}
            </p>
            <div className="flex flex-col gap-[12px] w-full mt-[4px]">
              {EMAIL_STEPS.map((step) => (
                <div key={step.title} className="flex flex-col gap-[2px] w-full">
                  <p className="font-medium" style={{ fontSize: 22, lineHeight: 1.5, color: INK }}>{step.title}</p>
                  {step.body && (
                    <p style={{ fontSize: 16, lineHeight: 1.5, color: INK }}>{step.body}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="w-full mt-[16px]">
          <Card>
            <p className="text-center font-bold" style={{ fontSize: 25, lineHeight: 1.5, color: INK }}>
              {EMAIL_WHY_HEADING}
            </p>
            <div className="flex flex-col gap-[12px] w-full mt-[18px]">
              {EMAIL_WHY.map((line) => (
                <div key={line} className="flex gap-[8px] items-center w-full">
                  {/* 29px outline disc and tick, both stroked #183253 at 1.5 */}
                  <CircleCheck size={29} color={TICK} strokeWidth={1.5} className="shrink-0" />
                  <p style={{ fontSize: 16, lineHeight: 1.5, color: INK }}>{line}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex flex-col items-center gap-[22px] w-full pt-[30px] pb-[30px]">
          <p className="text-center" style={{ fontSize: 16, lineHeight: "25px", color: INK }}>
            {EMAIL_CTA.lead}
          </p>
          {/* 239x49, radius 6, padding 12/45, label 17 Bold white */}
          <button
            onClick={onStart}
            className="cursor-pointer"
            style={{ background: INK, borderRadius: 6, border: "none", padding: "12px 45px" }}
          >
            <span className="font-bold" style={{ fontSize: 17, lineHeight: "25px", color: "#ffffff" }}>
              {EMAIL_CTA.button}
            </span>
          </button>
        </div>

        <div
          className="w-full rounded-[8px] px-[30px] py-[18px]"
          style={{ background: "#eef8ff", border: "1px solid #d9e1e8" }}
        >
          <p className="font-bold" style={{ fontSize: 22, lineHeight: 1.5, color: INK }}>{EMAIL_PRIVACY.title}</p>
          <p className="mt-[8px]" style={{ fontSize: 16, lineHeight: 1.5, color: INK }}>{EMAIL_PRIVACY.body}</p>
        </div>
      </EmailShell>
    </EmailClient>
  );
}
