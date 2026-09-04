// The pharmacy appointment confirmation, sent once the booking is made.
//
// jemhxV3hfyu7XbfumER8xF frame 449:1576. Copy and provenance in email-copy.ts.
// House style throughout: 30 Bold title on the textured header, #fbfbfb cards,
// the invitation's 205-wide navy button.
//
// THE BOOKING DETAILS ARE THE DEMO'S. The frame draws four Braze merge tags
// ({{event_properties.${AssesmentName}}} and friends); rendered resolved, like
// every other tag, with the booking the demo path makes: Corporate Advanced at
// Latchmere Pharmacy, Wed 16 Sep, 10:15 AM.

import { CircleCheck } from "lucide-react";
import { EmailShell, INK } from "./email-chrome.tsx";
import { EmailClient } from "./email-client.tsx";
import { APPOINTMENT_EMAIL as E, MAILBOX, EMAIL_FOOTER } from "./email-copy.ts";

const CARD = "#fbfbfb";

// NO FRAME for the values: the frame holds merge tags. These mirror the demo
// booking so the email and the Booking confirmed screen agree.
const BOOKING = ["Corporate Advanced", "Latchmere Pharmacy, London", "Wednesday 16 September 2026", "10:15 AM"];

function TickList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-[14px] w-full">
      {items.map((line) => (
        <div key={line} className="flex gap-[12px] items-start w-full">
          <CircleCheck size={24} color="#183253" strokeWidth={1.5} className="shrink-0 mt-[1px]" />
          <p className="text-left" style={{ fontSize: 16, lineHeight: 1.5, color: INK }}>{line}</p>
        </div>
      ))}
    </div>
  );
}

export function AppointmentEmail({ onNext }: {
  onNext?: () => void;
}) {
  return (
    <EmailClient subject={MAILBOX.appointment.subject} date={MAILBOX.appointment.date} onNext={onNext}>
      <EmailShell title={E.title} smallPrint={EMAIL_FOOTER.smallPrintResults} padBottom={20}>
        <p className="text-center w-full" style={{ fontSize: 16, lineHeight: 1.5, color: INK }}>
          {E.greeting}
        </p>
        <p className="text-center w-full mt-[16px]" style={{ fontSize: 16, lineHeight: 1.5, color: INK }}>
          {E.lead}
        </p>

        {/* The four detail rows, label bold, thin rules between. */}
        <div className="w-full mt-[20px]">
          {E.labels.map((label, i) => (
            <p
              key={label}
              className="w-full py-[10px]"
              style={{ fontSize: 16, lineHeight: 1.5, color: INK, borderBottom: "1px solid #c9d6e2" }}
            >
              <span className="font-bold">{label}</span> {BOOKING[i]}
            </p>
          ))}
        </div>

        <div className="w-full rounded-[8px] p-[30px] mt-[28px]" style={{ background: CARD }}>
          <div className="flex flex-col items-center gap-[20px] w-full">
            <p className="text-center font-bold" style={{ fontSize: 25, lineHeight: 1.5, color: INK }}>{E.prepareHeading}</p>
            {/* THE FRAME'S "Complete your questionnaire" BUTTON IS NOT DRAWN.
                Janelle, 4 Sep: "remove the complete your questionnaire button
                here as they have finished it" - in this journey the advanced
                questionnaire is completed at booking, so the CTA would point
                at a form already submitted. Its copy stays in email-copy.ts as
                the frame's, and the tick-list line above keeps its own
                conditional "if you haven't yet done so". */}
            <TickList items={E.prepare} />
          </div>
        </div>

        <div className="w-full rounded-[8px] p-[30px] mt-[28px]" style={{ background: CARD }}>
          <div className="flex flex-col items-center gap-[12px] w-full">
            <p className="text-center font-medium" style={{ fontSize: 22, lineHeight: 1.5, color: INK }}>{E.importantHeading}</p>
            <p className="text-center" style={{ fontSize: 16, lineHeight: 1.5, color: INK }}>{E.important}</p>
            <p className="text-center font-medium mt-[16px]" style={{ fontSize: 22, lineHeight: 1.5, color: INK }}>{E.expectHeading}</p>
            <p className="text-center" style={{ fontSize: 16, lineHeight: 1.5, color: INK }}>{E.expect}</p>
          </div>
        </div>

        <div className="w-full rounded-[8px] p-[30px] mt-[28px]" style={{ background: CARD }}>
          <div className="flex flex-col items-center gap-[20px] w-full">
            <p className="text-center font-bold" style={{ fontSize: 25, lineHeight: 1.5, color: INK }}>{E.afterHeading}</p>
            <TickList items={E.after} />
          </div>
        </div>

        <div
          className="w-full rounded-[8px] px-[30px] py-[18px] mt-[28px] mb-[8px]"
          style={{ background: "#eef8ff", border: "1px solid #d9e1e8" }}
        >
          <p className="font-bold" style={{ fontSize: 22, lineHeight: 1.5, color: INK }}>{E.changeHeading}</p>
          <p className="mt-[8px]" style={{ fontSize: 16, lineHeight: 1.5, color: INK }}>
            {E.changeLead}<span className="font-bold">{E.changePhone}</span>{E.changeTail}
          </p>
        </div>
      </EmailShell>
    </EmailClient>
  );
}
