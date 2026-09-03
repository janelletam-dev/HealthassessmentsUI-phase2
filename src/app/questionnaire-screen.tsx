// The pre-screen questionnaire, from the capture at 27003:15040.
//
// The capture is FHM's live page, so its chrome is FHM's: a blue banner
// heading, and a bottom bar carrying "Appointments" next to Submit. Neither is
// reproduced. Janelle, 3 Sep: "the button floating should be at the bottom" and
// "i dont think an <- appointments is needed to be placed as the user wont be
// able to". So the bar is a sticky footer with Submit alone, and the page wears
// the same DCA chrome as every other screen here.
//
// The selected row is the capture's: a blue border, a pale blue fill and a
// filled radio, per Janelle's "when the user selects this is how it should
// look".

import { useState } from "react";
import { SECTIONS, missingAnswers, type Answers, type Question } from "./questionnaire.ts";

const WS = "'Work Sans', sans-serif";
const HEADING = "#133595";
const INK = "#030712";
const BORDER = "#d7e9ff";
const PRIMARY = "#135cff";
const SELECTED_BG = "#edf6ff";
const ERROR = "#991b1b";

function ChoiceRow({ label, selected, invalid, onSelect }: {
  label: string; selected: boolean; invalid: boolean; onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className="flex items-center gap-[12px] w-full text-left rounded-[8px] px-[16px] py-[12px] cursor-pointer"
      style={{
        border: `1px solid ${selected ? PRIMARY : invalid ? ERROR : BORDER}`,
        background: selected ? SELECTED_BG : "#ffffff",
        fontFamily: WS,
      }}
    >
      <span
        className="flex items-center justify-center shrink-0 w-[16px] h-[16px] rounded-[9999px]"
        style={{ border: `1px solid ${selected ? PRIMARY : "#9ca3af"}` }}
      >
        {selected && <span className="w-[8px] h-[8px] rounded-[9999px]" style={{ background: PRIMARY }} />}
      </span>
      <span className="text-[14px] leading-[20px] flex-1" style={{ color: INK }}>{label}</span>
    </button>
  );
}

function QuestionBlock({ question, value, invalid, onChange }: {
  question: Question; value: string; invalid: boolean; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-[8px] w-full" id={`q-${question.id}`}>
      <div className="flex flex-col gap-[2px]">
        <p className="text-[14px] font-semibold leading-[20px]" style={{ color: INK }}>
          {question.required && <span style={{ color: ERROR }}>* </span>}
          {question.label}
        </p>
        {question.helper && (
          <p className="text-[12px] leading-[16px]" style={{ color: "#4b5563" }}>{question.helper}</p>
        )}
      </div>

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
        <div className="flex items-center gap-[8px]">
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-[8px] px-[16px] py-[12px] text-[14px] leading-[20px] w-[160px]"
            style={{ border: `1px solid ${invalid ? ERROR : BORDER}`, color: INK, fontFamily: WS }}
          />
          <span className="text-[14px] leading-[20px]" style={{ color: "#4b5563" }}>{question.suffix}</span>
        </div>
      )}

      {invalid && (
        <p className="text-[12px] leading-[16px]" style={{ color: ERROR }}>
          {question.kind === "number" ? "Please enter a number." : "Please choose an option."}
        </p>
      )}
    </div>
  );
}

export function QuestionnaireScreen({ onSubmitted }: { onSubmitted: () => void }) {
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

  return (
    <div className="flex flex-col gap-[24px] w-full max-w-[672px] pb-[96px]" style={{ fontFamily: WS }}>
      <p className="text-[24px] font-semibold leading-[32px]" style={{ color: HEADING }}>Questionnaire</p>

      {SECTIONS.map((section) => (
        <div
          key={section.title}
          className="flex flex-col gap-[24px] w-full rounded-[16px] bg-white px-[24px] py-[24px]"
          style={{ border: `1px solid ${BORDER}` }}
        >
          <p className="text-[16px] font-semibold leading-[24px]" style={{ color: HEADING }}>{section.title}</p>
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
      ))}

      {missing !== null && missing.length > 0 && (
        <p className="text-[14px] leading-[20px]" style={{ color: ERROR }}>
          {missing.length === 1
            ? "One question still needs an answer."
            : `${missing.length} questions still need an answer.`}
        </p>
      )}

      {/* Sticky, per the capture. Submit alone: there is no Appointments to go
          back to in this prototype. */}
      <div
        className="fixed left-0 right-0 bottom-0 z-[100] flex justify-center px-[24px] py-[16px]"
        style={{ background: "#ffffff", borderTop: `1px solid ${BORDER}` }}
      >
        <div className="w-full max-w-[672px] flex justify-end">
          <button
            onClick={submit}
            className="rounded-[9999px] px-[24px] py-[12px] text-[14px] font-semibold leading-[20px] cursor-pointer"
            style={{ background: PRIMARY, color: "#edf6ff", border: "none" }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
