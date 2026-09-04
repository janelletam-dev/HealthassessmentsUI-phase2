// The pre-screen questionnaire, on FHM's platform.
//
// Figma rDltwIr2dJvUUNaXEqEYFO node 27003:15040, a web capture of
// dca-test-domain.fullhealthmedical.com.
//
// THIS SCREEN IS NOT DCA-CHROMED, ON PURPOSE. Janelle, 3 Sep: "can you follow
// the node of questionnaire as this is now by FHM.. not dca. that is why they
// see it on the profile". The Profile complete card explains Full Health
// Medical precisely because the patient is handed over at this point, so
// wearing DCA's header, footer, Need help card and Trustpilot badge here would
// hide the handover the previous screen just described.
//
// So the chrome is the capture's: a white nav with a bottom rule, a blue
// banner, a #f9fafb page, a 744 column of white cards, and a white sticky bar.

import { useState } from "react";
import { CircleCheck, Stethoscope, Heart, Activity, History, Lock } from "lucide-react";
import { SECTIONS, SUBMITTED, missingAnswers, type Answers, type Question } from "./questionnaire.ts";
import { FhmShell, WS, PAGE, RULE, NAV_RULE, BLUE, INK, MUTED } from "./fhm-chrome.tsx";
import { GuideArrow } from "./guide-arrow.tsx";

const SELECTED_BG = "#eff6ff";
const ERROR = "#991b1b";

// The capture reads "Questionnaire - Janelle tamayo". Generic here, for the
// same reason the email greets Jane rather than showing a merge tag.
const TITLE = "Questionnaire - Jane Smith";

function ChoiceRow({ label, selected, invalid, onSelect }: {
  label: string; selected: boolean; invalid: boolean; onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      // 694x54 in the capture, fill #f9fafb, stroke #e5e7eb, radius 4.
      className="flex items-center gap-[12px] w-full text-left rounded-[4px] px-[16px] cursor-pointer"
      style={{
        minHeight: 54,
        border: `1px solid ${selected ? BLUE : invalid ? ERROR : RULE}`,
        background: selected ? SELECTED_BG : PAGE,
        fontFamily: WS,
      }}
    >
      <span
        className="flex items-center justify-center shrink-0 w-[16px] h-[16px] rounded-[9999px]"
        style={{ border: `1px solid ${selected ? BLUE : "#9ca3af"}`, background: "#ffffff" }}
      >
        {selected && <span className="w-[8px] h-[8px] rounded-[9999px]" style={{ background: BLUE }} />}
      </span>
      <span className="text-[16px] leading-[24px] flex-1 py-[12px]" style={{ color: INK }}>{label}</span>
    </button>
  );
}

function QuestionBlock({ question, value, invalid, onChange }: {
  question: Question; value: string; invalid: boolean; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-[8px] w-full" id={`q-${question.id}`}>
      {/* 16 Medium #1f2937, with the asterisk inline as the capture draws it */}
      <p className="text-[16px] font-medium leading-[24px]" style={{ color: INK }}>
        {question.required && "* "}{question.label}
      </p>
      {question.helper && (
        <p className="text-[14px] leading-[20px]" style={{ color: MUTED }}>{question.helper}</p>
      )}

      {question.kind === "choice" ? (
        <div className="flex flex-col gap-[8px] w-full">
          {question.options!.map((option) => (
            <ChoiceRow
              key={option}
              label={option}
              selected={value === option}
              invalid={invalid}
              onSelect={() => onChange(option)}
            />
          ))}
        </div>
      ) : (
        // Full width. Janelle, 3 Sep: "the weight and height is full width".
        <input
          type="number"
          inputMode="numeric"
          min={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-[4px] px-[12px] py-[8px] text-[16px] leading-[24px]"
          style={{ border: `1px solid ${invalid ? ERROR : NAV_RULE}`, color: INK, fontFamily: WS, background: "#ffffff" }}
        />
      )}

      {invalid && (
        <p className="text-[14px] leading-[20px]" style={{ color: ERROR }}>
          {question.kind === "number" ? "Please enter a number." : "Please choose an option."}
        </p>
      )}
    </div>
  );
}



// After submitting. Janelle, 3 Sep: "create something similar to the FHM chrome
// but something similar to this", with an image. So: FHM's nav, banner and page,
// and inside them the card her image draws.
//
// The icons are lucide's nearest match to the glyphs in that image, each in the
// pale blue tile it sits in there. The confetti around the tick is NOT
// reproduced: it is decorative, and drawing my own would be inventing detail
// the image only suggests.
const NEXT_ICONS = [Stethoscope, Heart, Activity];

function Submitted({ onDashboard }: { onDashboard: () => void }) {
  return (
    <FhmShell title={SUBMITTED.banner}>
      <div
        className="w-full rounded-[8px] px-[24px] py-[32px] flex flex-col items-center gap-[24px]"
        style={{ background: "#ffffff", border: `1px solid ${RULE}` }}
        role="status"
      >
        <CircleCheck size={72} color="#16a34a" strokeWidth={1.5} />

        <div className="flex flex-col items-center gap-[8px] text-center">
          <p className="text-[28px] font-bold leading-[36px]" style={{ color: "#111827" }}>{SUBMITTED.title}</p>
          <p className="text-[16px] leading-[24px]" style={{ color: INK }}>{SUBMITTED.lead}</p>
        </div>

        <div className="w-full" style={{ borderTop: `1px solid ${RULE}` }} />

        <div className="flex flex-col gap-[20px] w-full">
          <p className="text-[16px] font-bold leading-[24px]" style={{ color: "#111827" }}>{SUBMITTED.nextHeading}</p>

          {SUBMITTED.next.map((item, i) => {
            const Icon = NEXT_ICONS[i];
            return (
              <div key={item.title} className="flex gap-[16px] items-start w-full">
                <div
                  className="flex items-center justify-center shrink-0 w-[40px] h-[40px] rounded-[8px]"
                  style={{ background: SELECTED_BG }}
                >
                  <Icon size={20} color={BLUE} strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-[2px] flex-1">
                  <p className="text-[15px] font-bold leading-[22px]" style={{ color: "#111827" }}>{item.title}</p>
                  <p className="text-[14px] leading-[20px]" style={{ color: MUTED }}>{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* The one row on a tint in her image, because it is the only one that
            asks the patient to do something rather than telling them what we
            will do. */}
        <div className="flex gap-[16px] items-start w-full rounded-[8px] p-[16px]" style={{ background: SELECTED_BG }}>
          <div className="flex items-center justify-center shrink-0 w-[40px] h-[40px] rounded-[8px]" style={{ background: "#ffffff" }}>
            <History size={20} color={BLUE} strokeWidth={2} />
          </div>
          <div className="flex flex-col gap-[2px] flex-1">
            <p className="text-[15px] font-bold leading-[22px]" style={{ color: "#111827" }}>{SUBMITTED.resume.title}</p>
            <p className="text-[14px] leading-[20px]" style={{ color: MUTED }}>{SUBMITTED.resume.body}</p>
          </div>
        </div>

        <div className="flex gap-[8px] items-start w-full">
          <Lock size={16} color={MUTED} strokeWidth={2} className="shrink-0 mt-[2px]" />
          <p className="text-[13px] leading-[18px] flex-1" style={{ color: MUTED }}>{SUBMITTED.privacy}</p>
        </div>

        {/* There is no dashboard in this prototype. This carries the story on
            instead, to the email that arrives once the clinical team has
            reviewed the answers, which is the next thing that happens to the
            patient. Flagged to Janelle: if a dashboard is ever built, this goes
            back to pointing at it. */}
        <button
          onClick={onDashboard}
          data-guide-primary
          className="w-full rounded-[4px] px-[24px] py-[12px] text-[16px] font-medium leading-[24px] cursor-pointer"
          style={{ background: BLUE, color: "#ffffff", border: "none" }}
        >
          {SUBMITTED.cta}
        </button>
      </div>
    </FhmShell>
  );
}

export function QuestionnaireScreen({ onSubmitted, submitted, onDashboard }: {
  onSubmitted: () => void;
  /** Renders the confirmation instead of the form. */
  submitted: boolean;
  onDashboard: () => void;
}) {
  const [answers, setAnswers] = useState<Answers>({});
  // Nothing is flagged until Submit is pressed. Marking 24 questions red before
  // anyone has answered one is noise, not help.
  const [missing, setMissing] = useState<string[] | null>(null);

  function set(id: string, v: string) {
    setAnswers((a) => ({ ...a, [id]: v }));
    setMissing((m) => (m ? m.filter((x) => x !== id) : m));
  }

  function submit() {
    const gaps = missingAnswers(answers);
    setMissing(gaps);
    if (gaps.length === 0) { onSubmitted(); return; }
    // Land the patient on the first thing they have to fix, not on the top.
    document.getElementById(`q-${gaps[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (submitted) {
    return <Submitted onDashboard={onDashboard} />;
  }

  return (
    <FhmShell
      title={TITLE}
      footer={
        // 1512x73 white with a top rule, per the capture. Submit alone:
        // "i dont think an <- appointments is needed to be placed as the user
        // wont be able to".
        <div
          className="fixed left-0 right-0 bottom-0 z-[100] flex justify-center px-[24px]"
          style={{ height: 73, background: "#ffffff", borderTop: `1px solid ${NAV_RULE}` }}
        >
          <div className="w-full max-w-[744px] flex items-center justify-end">
            <button
              onClick={submit}
              data-guide-primary
              className="rounded-[4px] px-[24px] py-[8px] text-[16px] font-medium leading-[24px] cursor-pointer"
              style={{ background: BLUE, color: "#ffffff", border: "none" }}
            >
              Submit
            </button>
          </div>
        </div>
      }
    >
      {SECTIONS.map((section) => (
        <div key={section.title} className="w-full rounded-[4px]" style={{ background: "#ffffff", border: `1px solid ${RULE}` }}>
          {/* Card header, 73 tall in the capture, with its own bottom rule.
              The label is uppercased by FHM's CSS, not by the string. */}
          <div className="px-[24px] py-[24px]" style={{ borderBottom: `1px solid ${RULE}` }}>
            <p className="text-[16px] font-bold leading-[24px] uppercase" style={{ color: BLUE }}>
              {section.title}
            </p>
          </div>
          <div className="flex flex-col gap-[24px] px-[24px] py-[24px]">
            {section.questions.map((q) => (
              <QuestionBlock
                key={q.id}
                question={q}
                value={answers[q.id] ?? ""}
                invalid={!!missing?.includes(q.id)}
                onChange={(v) => set(q.id, v)}
              />
            ))}
          </div>
        </div>
      ))}

      {missing !== null && missing.length > 0 && (
        <p className="text-[16px] leading-[24px]" style={{ color: ERROR }}>
          {missing.length === 1
            ? "One question still needs an answer."
            : `${missing.length} questions still need an answer.`}
        </p>
      )}
    </FhmShell>
  );
}
