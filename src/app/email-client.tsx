// The mail client an email is read in.
//
// Janelle, 3 Sep: "can we have the emails really look like an email screen",
// with a Gmail screenshot, then "like that at the top but just show the email
// content already". So: the toolbar and message header, with the message
// already open. No inbox list.
//
// DELIBERATELY NOT GMAIL. Google's wordmark, its sidebar and its product
// furniture are not ours to reproduce in a prototype that gets shown to
// clients, and the request is that it reads as an email, which a neutral
// client does just as well. The layout follows her screenshot: toolbar, subject
// with an Inbox chip, avatar, sender and address, Unsubscribe, "to me", the
// date on the right, then the body, then Reply and Forward.

import type { ReactNode } from "react";
import {
  ArrowLeft, Archive, CircleAlert, Trash2, MailOpen, Clock, MoreVertical,
  ChevronLeft, ChevronRight, Printer, ExternalLink, Star, Reply, Forward, User,
} from "lucide-react";
import { MAILBOX } from "./email-copy.ts";

const WS = "'Work Sans', sans-serif";
const RULE = "#e5e7eb";
const MUTED = "#5f6368";
const INK = "#202124";

function ToolbarIcon({ Icon }: { Icon: typeof Archive }) {
  return (
    <span className="flex items-center justify-center w-[32px] h-[32px] rounded-[9999px]">
      <Icon size={18} color={MUTED} strokeWidth={2} />
    </span>
  );
}

export function EmailClient({ subject, date, onNext, children }: {
  subject: string;
  date: string;
  /** The toolbar's newer-message chevron. Chrome the demo uses to move from
      one email beat to the next, so it only becomes a button when a next
      email exists. */
  onNext?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen w-full" style={{ background: "#ffffff", fontFamily: WS }}>
      {/* Toolbar */}
      <div
        className="flex items-center justify-between px-[16px]"
        style={{ height: 48, borderBottom: `1px solid ${RULE}` }}
      >
        <div className="flex items-center gap-[4px]">
          <ToolbarIcon Icon={ArrowLeft} />
          <span className="mx-[8px] h-[20px]" style={{ borderLeft: `1px solid ${RULE}` }} />
          <ToolbarIcon Icon={Archive} />
          <ToolbarIcon Icon={CircleAlert} />
          <ToolbarIcon Icon={Trash2} />
          <span className="mx-[8px] h-[20px]" style={{ borderLeft: `1px solid ${RULE}` }} />
          <ToolbarIcon Icon={MailOpen} />
          <ToolbarIcon Icon={Clock} />
          <ToolbarIcon Icon={MoreVertical} />
        </div>
        <div className="hidden sm:flex items-center gap-[4px]">
          <ToolbarIcon Icon={ChevronLeft} />
          {onNext ? (
            <button
              type="button"
              onClick={onNext}
              aria-label="Newer message"
              className="flex items-center justify-center w-[32px] h-[32px] rounded-[9999px] cursor-pointer bg-transparent border-none p-0"
            >
              <ChevronRight size={18} color={MUTED} strokeWidth={2} />
            </button>
          ) : (
            <ToolbarIcon Icon={ChevronRight} />
          )}
        </div>
      </div>

      <div className="w-full max-w-[1000px] mx-auto px-[16px] sm:px-[32px] pt-[20px] pb-[48px]">
        <div className="flex items-start justify-between gap-[16px]">
          <h1 className="flex items-center gap-[12px] flex-wrap" style={{ fontSize: 22, lineHeight: "28px", color: INK }}>
            {subject}
            <span
              className="inline-flex items-center gap-[6px] rounded-[4px] px-[8px]"
              style={{ background: "#f1f3f4", color: MUTED, fontSize: 12, lineHeight: "20px" }}
            >
              {MAILBOX.inboxChip}
              <span aria-hidden>&times;</span>
            </span>
          </h1>
          <div className="hidden sm:flex items-center gap-[4px] shrink-0">
            <ToolbarIcon Icon={Printer} />
            <ToolbarIcon Icon={ExternalLink} />
          </div>
        </div>

        <div className="flex items-start gap-[16px] mt-[16px]">
          <span
            className="flex items-center justify-center shrink-0 w-[40px] h-[40px] rounded-[9999px]"
            style={{ background: "#e8eaed" }}
          >
            <User size={22} color="#9aa0a6" strokeWidth={2} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="flex items-baseline gap-[6px] flex-wrap" style={{ fontSize: 14, lineHeight: "20px", color: INK }}>
              <span className="font-semibold">{MAILBOX.sender}</span>
              <span style={{ color: MUTED }}>&lt;{MAILBOX.senderAddress}&gt;</span>
              <span className="font-semibold" style={{ color: "#1a73e8" }}>{MAILBOX.unsubscribe}</span>
            </p>
            <p style={{ fontSize: 12, lineHeight: "18px", color: MUTED }}>{MAILBOX.to}</p>
          </div>
          <div className="hidden sm:flex items-center gap-[8px] shrink-0">
            <span style={{ fontSize: 12, color: MUTED }}>{date}</span>
            <Star size={18} color={MUTED} strokeWidth={2} />
          </div>
        </div>

        <div className="mt-[24px]">{children}</div>

        <div className="flex items-center gap-[12px] mt-[24px]">
          {[{ Icon: Reply, label: "Reply" }, { Icon: Forward, label: "Forward" }].map(({ Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-[8px] rounded-[9999px] px-[20px] py-[8px]"
              style={{ border: `1px solid ${RULE}`, color: INK, fontSize: 14 }}
            >
              <Icon size={16} color={MUTED} strokeWidth={2} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
