// The results-ready email, marketing's version.
//
// Frame "Health Insights Assessment - Lifestyle Questionnaire Report Ready",
// 600x943, from the exported CSS and render Janelle sent on 3 Sep. Copy and
// provenance live in email-copy.ts.
//
// It is the invitation's house style, not e10's: a 30 Bold title, one #fbfbfb
// card with 8px corners, and a 205x49 button at radius 6 with the arrow inside
// the label. The card is written out here rather than shared with the
// invitation's, which needs to stack several: this email has exactly one.

import trustpilotRow from "../assets/email/trustpilot-row.png";
import { EmailShell, INK } from "./email-chrome.tsx";
import { EmailClient } from "./email-client.tsx";
import { RESULTS_EMAIL, MAILBOX, EMAIL_FOOTER } from "./email-copy.ts";

const CARD = "#fbfbfb";

export function ResultsEmail({ onView }: { onView: () => void }) {
  return (
    <EmailClient subject={MAILBOX.results.subject} date={MAILBOX.results.date}>
      <EmailShell
        title={RESULTS_EMAIL.title}
        smallPrint={EMAIL_FOOTER.smallPrintResults}
        padBottom={20}
      >
        {/* 520x353, padding 30, its column 460 wide on 8px gaps and 4px spacers. */}
        <div className="w-full rounded-[8px] p-[30px]" style={{ background: CARD }}>
          <div className="flex flex-col items-center gap-[8px] w-full">
            <p
              className="text-center whitespace-pre-line w-full"
              style={{ fontSize: 16, lineHeight: 1.5, color: INK }}
            >
              {RESULTS_EMAIL.body}
            </p>

            {/* 205x49, radius 6, padding 12/45, label 17 Bold white. */}
            <button
              onClick={onView}
              className="cursor-pointer mt-[4px]"
              style={{ background: INK, borderRadius: 6, border: "none", padding: "12px 45px" }}
            >
              <span className="font-bold" style={{ fontSize: 17, lineHeight: "25px", color: "#ffffff" }}>
                {RESULTS_EMAIL.cta}
              </span>
            </button>

            <p className="text-center w-full mt-[4px]" style={{ fontSize: 16, lineHeight: 1.5, color: INK }}>
              {RESULTS_EMAIL.closing}
            </p>
          </div>
        </div>

        {/* The frame leaves the Trustpilot content block unresolved, so it draws
            as a raw Braze tag in the export. Braze fills it with this row on
            send, and it is drawn filled here for the same reason the first name
            is drawn as Jane: a merge tag on screen reads as a bug. */}
        <div className="flex justify-center w-full pt-[40px]">
          <img src={trustpilotRow} alt="" aria-hidden className="h-[22px] object-contain" />
        </div>
      </EmailShell>
    </EmailClient>
  );
}
