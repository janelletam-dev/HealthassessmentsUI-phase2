// Booking the Corporate Advanced assessment, on Full Health Medical's platform.
//
// Figma rDltwIr2dJvUUNaXEqEYFO, section "FHM book clinical appt": About this
// product 27011:15640, Choose a location 27048:15033, Select date and time
// 27048:15321, Review & confirm 27048:16253, Booking confirmed 27048:16444.
//
// WHERE IT SITS. Janelle, 4 Sep: "in the journey there is a pre-assessment the
// one we did already and then when approved, they go back to book their
// appointment". So this is the second half: the pre-screen questionnaire is
// done, the clinician has recommended the Advanced assessment, and My health
// assessments on the portal signs the patient into FHM to book it.
//
// THE LOCATION LIST IS TRIMMED. The capture is a test environment and lists
// NOOB, ELSE, "fsdjkfsadjkf", "abc, efg", Jiawei Pharmacy twice and one name
// ending "(TEST)". Five plausible rows are kept, addresses verbatim, including
// JP Pharma's lower-case "london", which is the source data's own and not a
// local typo. Nothing here is invented.
//
// BOOKING CONFIRMED LEADS TO A QUESTIONNAIRE, AND NOT THE ONE ALREADY BUILT.
// Its "Complete questionnaire now" opens FHM's pre-appointment questionnaire,
// capture 27048:16445, which is a different and far longer document than the
// pre-screen: 12,591px against 5,765px, 41 questions against 25. Content in
// pre-appointment-questionnaire.ts. Pointing the button at the pre-screen would
// have shown a form this patient finished days ago.

import { useState } from "react";
import { ArrowLeft, Calendar, MapPin, CircleCheck, ClipboardList, ChevronRight, Check, House, CircleUserRound } from "lucide-react";
import { FhmShell, FhmNav, WS, PAGE, BLUE, INK, MUTED } from "./fhm-chrome.tsx";
import { NextStepExplainer } from "./fhm-results.tsx";
import { SECTIONS as PRE_APPOINTMENT, missingAnswers, type Answers } from "./pre-appointment-questionnaire.ts";
import { useScrollTop } from "./use-scroll-top.ts";
import { GuideArrow } from "./guide-arrow.tsx";

const BORDER = "#d2d2d2";
const CARD_LABEL = BLUE;
const NAV_RULE = "#d1d5db";

/*
 * 27048:15033, WITH THE NAMES REWRITTEN. Janelle, 4 Sep: "can you make the
 * names of the pharmacy better".
 *
 * The capture is a test environment and its names are test names: JP Pharma,
 * Corgi Pharmacy, Tuli Pharmacy, alongside NOOB, ELSE and "fsdjkfsadjkf". Each
 * one here is named for the street or area it is on, which is how independent
 * pharmacies are usually named and keeps the row consistent with its address.
 * Deliberately no real chain: putting Boots or Superdrug on this list would
 * imply a commercial arrangement in a deck that goes to AXA.
 *
 * The addresses are the capture's, with London capitalised. It prints "london"
 * lower case, which is the test data's own slip rather than something to
 * reproduce.
 */
const LOCATIONS = [
  { name: "PELHAM STREET PHARMACY", display: "Pelham Street Pharmacy", address: "Pelham St, South Kensington, London, SW7 2NB, United Kingdom" },
  { name: "LATCHMERE PHARMACY", display: "Latchmere Pharmacy", address: "187 Latchmere Road, London, SW11 2JZ, United Kingdom" },
  { name: "PLOUGH WAY PHARMACY", display: "Plough Way Pharmacy", address: "15 Plough Way, London, SE16 2LS, United Kingdom" },
  { name: "CANNON WHARF PHARMACY", display: "Cannon Wharf Pharmacy", address: "2.04 Cannon Wharf, London, SE8 5EN, United Kingdom" },
  { name: "PELL STREET PHARMACY", display: "Pell Street Pharmacy", address: "2.04 Cannon Wharf Pell Street, London, SE8 5EN, United Kingdom" },
];

// 27048:15321. September 2026 starts on a Tuesday, and the capture dots these
// days as having slots.
const MONTH = "September 2026";
const FIRST_WEEKDAY = 1; // Monday = 0, so the 1st sits under Tuesday.
const DAYS_IN_MONTH = 30;
const AVAILABLE = [10, 11, 16, 17, 18, 23, 24, 25, 30];
const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];
const DAY_NAMES = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

// 09:00 to 11:45 and 13:00 to 16:45, in quarter hours, exactly the gap the
// capture leaves over lunch.
const SLOTS = [
  ...Array.from({ length: 12 }, (_, i) => `${String(9 + Math.floor(i / 4)).padStart(2, "0")}:${String((i % 4) * 15).padStart(2, "0")} AM`),
  ...Array.from({ length: 16 }, (_, i) => `${String(1 + Math.floor(i / 4)).padStart(2, "0")}:${String((i % 4) * 15).padStart(2, "0")} PM`),
];

const PRODUCT = {
  // 27011:15640
  name: "Corporate Advanced",
  lines: [
    "Your Corporate Advanced Health Assessment includes an in-person pharmacy visit for physical measurements and a comprehensive range of blood tests.",
    "On the next screen, you can select your preferred pharmacy location.",
  ],
};

type Step = "about" | "location" | "datetime" | "review" | "confirmed" | "questionnaire";

function Card({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="w-full rounded-[4px] bg-white overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
      {label && (
        <div className="px-[24px] py-[20px]" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <p className="font-bold text-[14px] leading-[20px] tracking-[0.03em]" style={{ color: CARD_LABEL }}>{label}</p>
        </div>
      )}
      {children}
    </div>
  );
}

function StickyBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed left-0 right-0 bottom-0 z-[100] flex justify-center px-[24px]"
      style={{ height: 73, background: "#ffffff", borderTop: `1px solid ${NAV_RULE}` }}
    >
      <div className="w-full max-w-[744px] flex items-center justify-between">{children}</div>
    </div>
  );
}

function BackLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-[8px] bg-transparent border-none cursor-pointer p-0 text-[16px] leading-[24px]"
      style={{ color: INK, fontFamily: WS }}
    >
      <ArrowLeft size={16} strokeWidth={2} />
      {label}
    </button>
  );
}

function PrimaryButton({ label, onClick, disabled }: { label: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-[4px] px-[24px] py-[8px] text-[16px] font-medium leading-[24px]"
      style={{
        background: disabled ? "transparent" : BLUE,
        color: disabled ? MUTED : "#ffffff",
        border: "none",
        cursor: disabled ? "default" : "pointer",
      }}
    >
      {label}
    </button>
  );
}

function ProductRow() {
  return (
    <div className="m-[24px] rounded-[4px] p-[16px] flex gap-[12px] items-start" style={{ border: `1px solid ${BORDER}` }}>
      <CircleCheck size={18} color="#10b981" strokeWidth={2.5} className="shrink-0 mt-[2px]" />
      <div className="flex flex-col gap-[4px]">
        <p className="font-bold text-[16px] leading-[24px]" style={{ color: "#111827" }}>{PRODUCT.name}</p>
        {PRODUCT.lines.map((line) => (
          <p key={line} className="text-[15px] leading-[22px]" style={{ color: INK }}>{line}</p>
        ))}
      </div>
    </div>
  );
}

/*
 * FHM's pre-appointment questionnaire, 27048:16445.
 *
 * Its chrome is the booking flow's, because it is the same platform and the
 * capture shows the same nav, banner and 744 column. Its footer is the
 * capture's: "Appointments" on the left and Submit on the right.
 *
 * Required questions are marked with an asterisk after the label, which is how
 * the capture draws them, and Submit reveals what is still missing rather than
 * blocking silently.
 */
function ChoiceRow({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex items-center gap-[12px] w-full text-left px-[16px] py-[10px] rounded-[4px] cursor-pointer"
      style={{
        border: `1px solid ${selected ? BLUE : BORDER}`,
        background: selected ? "#eff6ff" : "#ffffff",
        fontFamily: WS,
      }}
    >
      <span
        className="shrink-0 size-[16px] rounded-full block"
        style={{ border: `${selected ? 5 : 1}px solid ${selected ? BLUE : "#9ca3af"}` }}
      />
      <span className="text-[16px] leading-[24px]" style={{ color: INK }}>{label}</span>
    </button>
  );
}

function TickRow({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-[12px] w-full text-left px-[16px] py-[10px] rounded-[4px] cursor-pointer"
      style={{
        border: `1px solid ${checked ? BLUE : BORDER}`,
        background: checked ? "#eff6ff" : "#ffffff",
        fontFamily: WS,
      }}
    >
      <span
        className="shrink-0 size-[16px] rounded-[3px] flex items-center justify-center"
        style={{ border: `1px solid ${checked ? BLUE : "#9ca3af"}`, background: checked ? BLUE : "#ffffff" }}
      >
        {checked && <Check size={11} color="#ffffff" strokeWidth={3.5} />}
      </span>
      <span className="text-[16px] leading-[24px]" style={{ color: INK }}>{label}</span>
    </button>
  );
}

/*
 * After Submit, from 27073:17812. Janelle, 4 Sep: "when all done, and clicked
 * submit this is how the screen looks like".
 *
 * NOT THE QUESTIONNAIRE'S TEMPLATE. This is FHM's account home: the blue band
 * carries a Home and Profile pill instead of a page title, and a mint strip
 * runs full width under it. So it wears the nav and nothing else of FhmShell.
 *
 * The capture greets "Hello, janelle" and books JP Pharma. Both come from state
 * here, so it greets Jane and names whichever pharmacy was chosen.
 */
function QuestionnaireSubmitted({ location, day, slot, onExit }: {
  location?: typeof LOCATIONS[number];
  day?: number;
  slot?: string;
  onExit: () => void;
}) {
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

      {/* Full width, edge to edge, not inside the column. */}
      <div className="w-full px-[16px] py-[14px]" style={{ background: "#dcf5f2" }} role="status">
        <p className="text-[16px] leading-[24px]" style={{ color: "#111827" }}>
          Your health questionnaire has been successfully submitted.
        </p>
      </div>

      <div className="flex justify-center px-[24px] pt-[48px] pb-[140px]">
        <div className="w-full max-w-[770px] flex flex-col gap-[24px]">
          <p className="text-[20px] leading-[28px]" style={{ color: "#111827" }}>Hello, Jane</p>

          <Card label="CORPORATE ADVANCED">
            <div className="px-[24px] py-[20px] flex flex-col gap-[6px]">
              <div className="flex items-start justify-between">
                <p className="text-[16px] leading-[24px]" style={{ color: "#111827" }}>Product</p>
                <p className="text-[16px] leading-[24px]" style={{ color: INK }}>{PRODUCT.name}</p>
              </div>
              <div className="flex items-start justify-between">
                <p className="text-[16px] leading-[24px]" style={{ color: "#111827" }}>Date</p>
                <p className="text-[16px] leading-[24px] flex items-center gap-[6px]" style={{ color: INK }}>
                  {day} Sep 2026 {slot?.replace(" AM", "").replace(" PM", "")}
                  <Calendar size={14} color="#111827" strokeWidth={2} />
                </p>
              </div>
              <div className="flex items-start justify-between">
                <p className="text-[16px] leading-[24px]" style={{ color: "#111827" }}>Location</p>
                <p className="text-[16px] leading-[24px] flex items-center gap-[6px]" style={{ color: INK }}>
                  {location?.display}
                  <MapPin size={14} color="#111827" strokeWidth={2} />
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <GuideArrow onNext={onExit} nextLabel="Continue" />
    </div>
  );
}

function PreAppointmentQuestionnaire({ onBack, onExit, location, day, slot }: {
  onBack: () => void;
  onExit: () => void;
  location?: typeof LOCATIONS[number];
  day?: number;
  slot?: string;
}) {
  const [answers, setAnswers] = useState<Answers>({});
  const [missing, setMissing] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  useScrollTop(done);

  function submit() {
    const gaps = missingAnswers(answers);
    setMissing(gaps);
    if (gaps.length === 0) setDone(true);
  }

  if (done) return <QuestionnaireSubmitted location={location} day={day} slot={slot} onExit={onExit} />;

  return (
    <FhmShell
      title="Questionnaire - Jane Smith"
      footer={
        <StickyBar>
          <BackLink label="Appointments" onClick={onBack} />
          <PrimaryButton label="Submit" onClick={submit} />
        </StickyBar>
      }
    >
      {missing.length > 0 && (
        <div
          className="w-full rounded-[4px] px-[16px] py-[12px]"
          style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
          role="alert"
        >
          <p className="text-[15px] leading-[22px]" style={{ color: "#991b1b" }}>
            {missing.length === 1
              ? "One required question still needs an answer."
              : `${missing.length} required questions still need an answer.`}
          </p>
        </div>
      )}

      {PRE_APPOINTMENT.map((section) => (
        <Card key={section.title} label={section.title.toUpperCase()}>
          <div className="px-[24px] py-[24px] flex flex-col gap-[28px]">
            {section.questions.map((q) => {
              if (q.kind === "note") {
                return (
                  <div key={q.id} className="flex flex-col gap-[8px]">
                    {q.body.map((line) => (
                      <p key={line} className="text-[15px] leading-[24px]" style={{ color: INK }}>{line}</p>
                    ))}
                    {q.bullets && (
                      <ul className="list-disc pl-[20px] flex flex-col gap-[2px]">
                        {q.bullets.map((line) => (
                          <li key={line} className="text-[15px] leading-[24px]" style={{ color: INK }}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              }

              const unanswered = missing.includes(q.id);
              const given = answers[q.id];
              return (
                <div key={q.id} className="flex flex-col gap-[10px]">
                  <p className="text-[16px] font-medium leading-[24px]" style={{ color: unanswered ? "#991b1b" : "#111827" }}>
                    {q.label}
                    {q.required && <span style={{ color: unanswered ? "#991b1b" : MUTED }}> *</span>}
                  </p>
                  {q.helper && <p className="text-[14px] leading-[20px]" style={{ color: MUTED }}>{q.helper}</p>}

                  {q.kind === "select" ? (
                    <select
                      value={typeof given === "string" ? given : ""}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                      className="w-full rounded-[4px] px-[12px] py-[10px] text-[16px] leading-[24px] bg-white"
                      style={{ border: `1px solid ${unanswered ? "#991b1b" : BORDER}`, color: INK, fontFamily: WS }}
                    >
                      <option value="">Please select</option>
                      {q.options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : q.kind === "checkbox" ? (
                    <div className="flex flex-col gap-[8px]">
                      {q.options.map((o) => {
                        const list = Array.isArray(given) ? given : [];
                        return (
                          <TickRow
                            key={o}
                            label={o}
                            checked={list.includes(o)}
                            onToggle={() => setAnswers((prev) => {
                              const current = Array.isArray(prev[q.id]) ? (prev[q.id] as string[]) : [];
                              return { ...prev, [q.id]: current.includes(o) ? current.filter((x) => x !== o) : [...current, o] };
                            })}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-[8px]">
                      {q.options.map((o) => (
                        <ChoiceRow
                          key={o}
                          label={o}
                          selected={given === o}
                          onSelect={() => setAnswers((prev) => ({ ...prev, [q.id]: o }))}
                        />
                      ))}
                    </div>
                  )}

                  {q.kind === "choice" && q.note && (
                    <div className="flex flex-col gap-[4px] mt-[2px]">
                      <p className="text-[15px] font-medium leading-[22px]" style={{ color: "#111827" }}>Notes</p>
                      <p className="text-[13px] leading-[20px]" style={{ color: MUTED }}>{q.note}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </FhmShell>
  );
}

export function FhmBooking({ onExit, initialStep = "about" }: {
  onExit: () => void;
  /** Entering from the results page's explainer skips About this product,
      which that explainer replaces; the My health assessments route still
      starts there. */
  initialStep?: Step;
}) {
  const [step, setStep] = useState<Step>(initialStep);
  const [location, setLocation] = useState<typeof LOCATIONS[number] | undefined>(undefined);
  const [day, setDay] = useState<number | undefined>(undefined);
  const [slot, setSlot] = useState<string | undefined>(undefined);
  useScrollTop(step);

  const weekdayOf = (d: number) => DAY_NAMES[(FIRST_WEEKDAY + d - 1) % 7];
  const shortDay = (d: number) => weekdayOf(d).charAt(0) + weekdayOf(d).slice(1, 3).toLowerCase();
  const dateLabel = day ? `${shortDay(day)} ${day} Sep 2026` : "";

  if (step === "about") {
    // The sparse capture card is replaced by the full explainer. Janelle,
    // 4 Sep: "slide 15 should have been updated to show this also". This is
    // the screen the My health assessments route still lands on; the results
    // page carries the same explainer, whose Book Appointment enters at
    // Choose a location directly.
    return (
      <FhmShell title="About this product">
        <NextStepExplainer onBook={() => setStep("location")} />
      </FhmShell>
    );
  }

  if (step === "location") {
    return (
      <FhmShell
        title="Choose a location"
        footer={<StickyBar><BackLink label="About this product" onClick={() => setStep("about")} /><span /></StickyBar>}
      >
        <Card>
          <div className="px-[24px] py-[20px] flex flex-col gap-[12px]">
            <p className="font-bold text-[13px] leading-[18px] tracking-[0.03em]" style={{ color: CARD_LABEL }}>
              FIND NEAREST LOCATION
            </p>
            <div className="flex items-center gap-[8px] rounded-[9999px] px-[16px] h-[40px]" style={{ border: `1px solid ${BORDER}` }}>
              <MapPin size={16} color={MUTED} strokeWidth={2} className="shrink-0" />
              <input
                placeholder="Postcode or address"
                className="flex-1 border-none outline-none text-[15px] bg-transparent"
                style={{ color: INK, fontFamily: WS }}
              />
              <button
                type="button"
                className="rounded-[9999px] px-[16px] py-[4px] text-[14px] cursor-pointer shrink-0"
                style={{ background: BLUE, color: "#ffffff", border: "none" }}
              >
                Search
              </button>
            </div>
          </div>
        </Card>

        {LOCATIONS.map((place) => (
          <Card key={place.name}>
            <div className="px-[24px] py-[16px] flex flex-col gap-[4px]">
              <p className="font-bold text-[14px] leading-[20px] tracking-[0.02em]" style={{ color: CARD_LABEL }}>{place.name}</p>
              <p className="text-[14px] leading-[20px]" style={{ color: INK }}>{place.address}</p>
            </div>
            <div className="px-[16px] pb-[16px]">
              <button
                type="button"
                onClick={() => { setLocation(place); setStep("datetime"); }}
                className="w-full rounded-[4px] py-[8px] text-[15px] leading-[22px] cursor-pointer"
                style={{ background: BLUE, color: "#ffffff", border: "none" }}
              >
                Choose
              </button>
            </div>
          </Card>
        ))}
      </FhmShell>
    );
  }

  if (step === "datetime") {
    const cells: (number | null)[] = [
      ...Array.from({ length: FIRST_WEEKDAY }, () => null),
      ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
    ];
    return (
      <FhmShell
        title="Select date and time"
        footer={
          <StickyBar>
            <BackLink label="Choose Location" onClick={() => { setDay(undefined); setSlot(undefined); setStep("location"); }} />
            <PrimaryButton
              label={slot ? "Review booking" : "Select timeslot"}
              disabled={!slot}
              onClick={() => setStep("review")}
            />
          </StickyBar>
        }
      >
        <div className="flex gap-[24px] items-start w-full">
          <div className="rounded-[4px] bg-white p-[16px] shrink-0" style={{ border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between px-[8px] pb-[12px]">
              <p className="text-[15px] leading-[22px]" style={{ color: INK }}>{MONTH}</p>
              <ChevronRight size={16} color={INK} strokeWidth={2} />
            </div>
            <div className="grid grid-cols-7">
              {WEEKDAYS.map((label, i) => (
                <p key={i} className="text-[12px] leading-[18px] text-center pb-[6px]" style={{ color: MUTED }}>{label}</p>
              ))}
              {cells.map((d, i) => {
                if (d === null) return <div key={`b${i}`} className="h-[30px]" />;
                const open = AVAILABLE.includes(d);
                const chosen = d === day;
                return (
                  <button
                    key={d}
                    type="button"
                    disabled={!open}
                    onClick={() => { setDay(d); setSlot(undefined); }}
                    className="h-[30px] w-[30px] relative text-[13px] leading-[18px] border-none"
                    style={{
                      background: chosen ? BLUE : "transparent",
                      color: chosen ? "#ffffff" : open ? INK : "#d4d4d8",
                      cursor: open ? "pointer" : "default",
                    }}
                  >
                    {d}
                    {open && !chosen && (
                      <span
                        className="absolute left-1/2 -translate-x-1/2 bottom-[2px] size-[3px] rounded-full"
                        style={{ background: BLUE }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 rounded-[4px] bg-white overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
            {day ? (
              <>
                <div className="px-[16px] py-[12px]" style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <p className="font-bold text-[13px] leading-[18px] tracking-[0.03em]" style={{ color: CARD_LABEL }}>
                    {`${weekdayOf(day)}, ${String(day).padStart(2, "0")} SEP`}
                  </p>
                </div>
                <div className="max-h-[520px] overflow-y-auto">
                  {SLOTS.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSlot(time)}
                      className="w-full text-left px-[16px] py-[10px] border-none cursor-pointer block"
                      style={{
                        borderBottom: `1px solid ${BORDER}`,
                        background: slot === time ? "#eff6ff" : "#ffffff",
                      }}
                    >
                      <p className="font-bold text-[14px] leading-[20px]" style={{ color: "#111827" }}>{time}</p>
                      <p className="text-[13px] leading-[18px]" style={{ color: MUTED }}>15 minutes</p>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="px-[16px] py-[20px] text-[15px] leading-[22px]" style={{ color: MUTED }}>
                Pick a date with a dot to see its times.
              </p>
            )}
          </div>
        </div>
      </FhmShell>
    );
  }

  if (step === "review") {
    return (
      <FhmShell
        title="Review &amp; confirm"
        subtitle="Complete your booking by clicking 'Confirm your booking'"
        footer={
          <StickyBar>
            <BackLink label="Back" onClick={() => setStep("datetime")} />
            <button
              type="button"
              onClick={() => setStep("confirmed")}
              className="rounded-[4px] px-[24px] py-[10px] text-[16px] font-medium leading-[24px] cursor-pointer"
              style={{ background: BLUE, color: "#ffffff", border: "none" }}
            >
              Confirm your booking
            </button>
          </StickyBar>
        }
      >
        <Card label="WHAT YOU ARE BOOKING"><ProductRow /></Card>

        <Card label="YOUR APPOINTMENT">
          <div className="px-[24px] py-[16px] flex items-start justify-between" style={{ borderBottom: `1px solid ${BORDER}` }}>
            <p className="text-[15px] leading-[22px]" style={{ color: INK }}>Location</p>
            <div className="text-right">
              <p className="text-[15px] leading-[22px] flex items-center gap-[6px] justify-end" style={{ color: INK }}>
                {location?.display}
                <MapPin size={14} color="#111827" strokeWidth={2} />
              </p>
              <p className="text-[15px] leading-[22px]" style={{ color: INK }}>{location?.address}</p>
            </div>
          </div>
          <div className="m-[24px] rounded-[4px] p-[16px] flex items-start justify-between" style={{ border: `1px solid ${BORDER}` }}>
            <div>
              <p className="text-[15px] leading-[22px] flex items-center gap-[8px]" style={{ color: INK }}>
                <Calendar size={14} color="#111827" strokeWidth={2} />
                {dateLabel}
              </p>
              <p className="text-[15px] leading-[22px]" style={{ color: INK }}>{slot}  (15 minutes)</p>
            </div>
            <button
              type="button"
              onClick={() => setStep("datetime")}
              className="underline bg-transparent border-none cursor-pointer text-[15px] leading-[22px] p-0"
              style={{ color: BLUE, fontFamily: WS }}
            >
              Edit
            </button>
          </div>
        </Card>
      </FhmShell>
    );
  }

  if (step === "questionnaire") {
    return (
      <PreAppointmentQuestionnaire
        onBack={() => setStep("confirmed")}
        onExit={onExit}
        location={location}
        day={day}
        slot={slot}
      />
    );
  }

  return (
    <FhmShell
      title="Booking confirmed"
      footer={
        <StickyBar>
          <BackLink label="Back to my account" onClick={onExit} />
          <PrimaryButton label="Complete questionnaire" onClick={() => setStep("questionnaire")} />
        </StickyBar>
      }
    >
      <Card label="WHAT'S NEXT">
        <div className="m-[24px] p-[16px] flex gap-[12px] items-start" style={{ background: "#fdfce9", borderLeft: "4px solid #facc14" }}>
          <ClipboardList size={18} color="#a16207" strokeWidth={2} className="shrink-0 mt-[2px]" />
          <div className="flex flex-col gap-[8px] flex-1">
            <p className="font-bold text-[15px] leading-[22px]" style={{ color: "#713f12" }}>Complete your questionnaire</p>
            <p className="text-[15px] leading-[22px]" style={{ color: "#713f12" }}>
              It&apos;s important that you complete the questionnaire before your appointment to ensure we can process your results.
            </p>
            <button
              type="button"
              onClick={() => setStep("questionnaire")}
              className="w-full rounded-[2px] py-[8px] text-[15px] leading-[22px] border-none mt-[4px] cursor-pointer"
              style={{ background: "#facc14", color: "#713f12" }}
            >
              Complete questionnaire now
            </button>
          </div>
        </div>
      </Card>

      <Card label="YOUR BOOKING DETAILS">
        <div className="px-[24px] py-[16px] flex flex-col gap-[10px]">
          <div className="flex items-start justify-between">
            <p className="text-[15px] leading-[22px]" style={{ color: INK }}>Date</p>
            <p className="text-[15px] leading-[22px] flex items-center gap-[6px]" style={{ color: INK }}>
              {day} Sep 2026 {slot?.replace(" AM", "").replace(" PM", "")}
              <Calendar size={14} color="#111827" strokeWidth={2} />
            </p>
          </div>
          <div className="flex items-start justify-between">
            <p className="text-[15px] leading-[22px]" style={{ color: INK }}>Location</p>
            <div className="text-right">
              <p className="text-[15px] leading-[22px] flex items-center gap-[6px] justify-end" style={{ color: INK }}>
                {location?.display}
                <MapPin size={14} color="#111827" strokeWidth={2} />
              </p>
              <p className="text-[15px] leading-[22px]" style={{ color: INK }}>{location?.address}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card label="WHAT YOU'VE BOOKED"><ProductRow /></Card>
    </FhmShell>
  );
}
