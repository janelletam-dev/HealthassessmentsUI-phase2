// The advanced assessment results email, sent after the appointment.
//
// jemhxV3hfyu7XbfumER8xF frame 468:2616. Copy and provenance in email-copy.ts.
//
// "Want to talk through your results?" is Quatro Slab in the frame, the only
// serif in any of these emails. Quatro Slab is a paid face, so the stack falls
// back to Zilla Slab from Google Fonts, the closest free slab, and then serif.

import { EmailShell, INK } from "./email-chrome.tsx";
import { EmailClient } from "./email-client.tsx";
import trustpilotRow from "../assets/email/trustpilot-row.png";
import { ADVANCED_RESULTS_EMAIL as E, MAILBOX, EMAIL_FOOTER } from "./email-copy.ts";

const CARD = "#fbfbfb";
const SLAB = "'Quatro Slab', 'Zilla Slab', serif";

function NavyButton({ label, onClick, primary }: { label: string; onClick?: () => void; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      data-guide-primary={primary || undefined}
      className={onClick ? "cursor-pointer" : undefined}
      style={{ background: INK, borderRadius: 6, border: "none", padding: "12px 45px" }}
    >
      <span className="font-bold" style={{ fontSize: 17, lineHeight: "25px", color: "#ffffff" }}>{label}</span>
    </button>
  );
}

export function AdvancedResultsEmail({ onView, onBook }: { onView: () => void; onBook?: () => void }) {
  return (
    <EmailClient subject={MAILBOX.advancedResults.subject} date={MAILBOX.advancedResults.date}>
      <EmailShell title={E.title} smallPrint={EMAIL_FOOTER.smallPrintResults} padBottom={20}>
        <div className="w-full rounded-[8px] p-[30px]" style={{ background: CARD }}>
          <div className="flex flex-col items-center gap-[20px] w-full">
            <p className="text-center whitespace-pre-line w-full" style={{ fontSize: 16, lineHeight: 1.5, color: INK }}>
              {E.body}
            </p>
            <NavyButton label={E.cta} onClick={onView} primary />
          </div>
        </div>

        <div className="w-full rounded-[8px] p-[30px] mt-[28px]" style={{ background: CARD }}>
          <div className="flex flex-col items-center gap-[16px] w-full">
            <p className="text-center font-medium" style={{ fontSize: 26, lineHeight: 1.4, color: "#183153", fontFamily: SLAB }}>
              {E.talkHeading}
            </p>
            <p className="text-center" style={{ fontSize: 16, lineHeight: 1.5, color: INK }}>{E.talk}</p>
            {/* Video GP booking is not built; inert unless the caller wires it. */}
            <NavyButton label={E.bookCta} onClick={onBook} />
          </div>
        </div>

        <div className="flex justify-center w-full pt-[40px]">
          <img src={trustpilotRow} alt="" aria-hidden className="h-[22px] object-contain" />
        </div>
      </EmailShell>
    </EmailClient>
  );
}
