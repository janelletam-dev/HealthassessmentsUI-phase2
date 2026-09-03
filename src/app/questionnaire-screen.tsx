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
import { Menu, CircleCheckBig } from "lucide-react";
import logo from "../assets/email/logo.png";
import { SECTIONS, missingAnswers, type Answers, type Question } from "./questionnaire.ts";

const WS = "'Work Sans', sans-serif";
const PAGE = "#f9fafb";
const RULE = "#e5e7eb";
const NAV_RULE = "#d1d5db";
const BLUE = "#135cff";
const INK = "#1f2937";
const MUTED = "#6b7280";
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

function FhmShell({ children, footer }: { children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full" style={{ background: PAGE, fontFamily: WS }}>
      {/* 1512x89 white, bottom rule. The hamburger is FHM's, not a DCA control. */}
      <div
        className="flex items-center justify-between px-[24px] w-full"
        style={{ height: 89, background: "#ffffff", borderBottom: `1px solid ${NAV_RULE}` }}
      >
        <img src={logo} alt="Doctor Care Anywhere" className="h-[57px] object-contain" />
        <Menu size={24} color={INK} strokeWidth={2} aria-hidden />
      </div>

      {/* 1512x148, #135cff, title 40 Medium white */}
      <div className="flex items-center justify-center px-[24px]" style={{ height: 148, background: BLUE }}>
        <p className="text-center font-medium" style={{ fontSize: 40, lineHeight: "52px", color: "#ffffff" }}>
          {TITLE}
        </p>
      </div>

      <div className="flex justify-center px-[24px] pt-[24px] pb-[140px]">
        <div className="w-full max-w-[744px] flex flex-col gap-[24px]">{children}</div>
      </div>

      {footer}
    </div>
  );
}

export function QuestionnaireScreen({ onSubmitted, submitted }: {
  onSubmitted: () => void;
  /** Renders the confirmation instead of the form. */
  submitted: boolean;
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
    return (
      <FhmShell>
        {/*
         * NO FRAME FOR THIS ONE. The only artefact is the pilot deck's step 13,
         * a green "Your health questionnaire has been successfully submitted."
         * banner on FHM, so that is the sentence and nothing more is invented.
         * Replace this when a frame exists rather than extending it.
         */}
        <div
          className="flex items-start gap-[12px] w-full rounded-[4px] px-[16px] py-[12px]"
          style={{ background: "#ecfdf5", border: "1px solid #166534" }}
          role="status"
        >
          <CircleCheckBig size={20} color="#166534" strokeWidth={2} className="shrink-0" />
          <p className="text-[16px] leading-[24px]" style={{ color: "#166534" }}>
            Your health questionnaire has been successfully submitted.
          </p>
        </div>
      </FhmShell>
    );
  }

  return (
    <FhmShell
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
