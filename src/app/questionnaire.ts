// The pre-screen lifestyle questionnaire.
//
// Figma rDltwIr2dJvUUNaXEqEYFO, node 27003:15040. That node is not a DCA
// design: it is a web capture of the live FHM questionnaire at
// dca-test-domain.fullhealthmedical.com, 1512x5765, which is consistent with
// the pilot deck ("the pilot will utilise the existing FHM platform... UX and
// UI enhancements are outside the scope"). Every question, option and helper
// below is transcribed from that capture.
//
// FOUR SECTIONS, 25 QUESTIONS, NO BRANCHING. The capture shows every question
// at once with no conditional follow-ups. An older FHM screenshot did show
// follow-ups under "Do you currently smoke?"; this capture does not, and the
// capture is the newer artefact, so nothing here branches.
//
// REQUIRED IS MARKED WITH * IN THE CAPTURE. Exactly one question is unmarked,
// the waist measurement, which matches the invitation email telling people to
// take that measurement "if possible".

export type QuestionKind = "choice" | "number";

export type Question = {
  id: string;
  /** As drawn, minus the leading asterisk, which required drives instead. */
  label: string;
  kind: QuestionKind;
  required: boolean;
  helper?: string;
  options?: string[];
  /** Number questions only, for the unit shown after the field. */
  suffix?: string;
};

export type Section = { title: string; questions: Question[] };

const YES_NO = ["Yes", "No"];
const YES_NO_DK = ["Yes", "No", "Don't know"];

/** Ten medical-history questions, all Yes/No, all required. */
// 27003:15040, transcribed in the order the capture asks them.
const MEDICAL: [string, string][] = [
  ["hypertension", "Have you ever been diagnosed with high blood pressure (hypertension)?"],
  ["hyperlipidaemia", "Have you ever been diagnosed with high cholesterol or high blood fats (hyperlipidaemia)?"],
  ["diabetes", "Have you ever been diagnosed with diabetes or pre-diabetes?"],
  ["kidney", "Have you ever been diagnosed with long-term kidney disease (chronic kidney disease)?"],
  ["liver", "Have you ever been diagnosed with liver disease or a fatty liver?"],
  ["gestational", "Have you ever been diagnosed with diabetes during pregnancy (gestational diabetes)?"],
  ["pcos", "Have you been diagnosed with polycystic ovary syndrome (PCOS/PMOS) or similar hormone condition?"],
  ["thyroid", "Have you ever been diagnosed with a thyroid condition (e.g. an underactive or overactive thyroid)?"],
  ["anaemia", "Have you had a diagnosis of anaemia in the last 3 years?"],
  ["mentalHealth", "Have you been clinically diagnosed with a mental health condition in the last five years?"],
];

/** Five family-history questions, all Yes/No/Don't know, all required. */
// 27003:15040, transcribed in the order the capture asks them.
const FAMILY: [string, string][] = [
  ["famHeart", "Has a first degree relative (a biological parent, sibling, or child) ever been diagnosed with heart disease e.g. heart attack or stroke, before the age of 60?"],
  ["famStroke", "Has a first degree relative (a biological parent, sibling, or child) ever had a stroke before the age of 60?"],
  ["famDiabetes", "Has a first degree relative (a biological parent, sibling, or child) ever been diagnosed with type 1 or 2 diabetes?"],
  ["famCholesterol", "Has a first degree relative (a biological parent only) ever been diagnosed with a genetic condition that causes very high cholesterol (known as familial hypercholesterolaemia)?"],
  ["famCancer", "Has a first degree relative (a biological parent, sibling, or child) ever been diagnosed with any form of cancer?"],
];

export const SECTIONS: Section[] = [
  {
    title: "Demographics",
    questions: [
      {
        id: "ethnicity",
        // 27003:15040
        label: "What is your ethnic background?",
        kind: "choice",
        required: true,
        // 27003:15040
        helper: "We use your ethnicity to apply population-specific risk thresholds.",
        options: ["White", "South Asian", "Black", "Mixed or Other", "Prefer not to say"],
      },
      { id: "height", label: "What is your height (cm)?", kind: "number", required: true, suffix: "cm" },
      { id: "weight", label: "What is your weight (kg)?", kind: "number", required: true, suffix: "kg" },
      // The only unmarked question in the capture.
      { id: "waist", label: "What is your waist measurement (cm)?", kind: "number", required: false, suffix: "cm" },
    ],
  },
  {
    title: "Medical History",
    questions: MEDICAL.map(([id, label]) => ({ id, label, kind: "choice" as const, required: true, options: YES_NO })),
  },
  {
    title: "Family History",
    questions: FAMILY.map(([id, label]) => ({ id, label, kind: "choice" as const, required: true, options: YES_NO_DK })),
  },
  {
    title: "Lifestyle",
    questions: [
      {
        id: "smoking",
        // 27003:15040
        label: "Do you smoke (tobacco, roll-ups, cigars, pipe or vaping)?",
        kind: "choice",
        required: true,
        options: ["No", "Ex-smoker (regularly within the last 5 years)", "Current smoker"],
      },
      {
        id: "alcohol",
        // 27003:15040
        label: "On a typical week, do you drink more than 14 units of alcohol? 1 unit = half a pint of beer, a small glass of wine, or a single measure of spirits",
        kind: "choice", required: true, options: YES_NO,
      },
      {
        id: "stress",
        // 27003:15040
        label: "Would you say you experience high levels of stress in your daily life e.g. feeling frustrated or irritable?",
        kind: "choice", required: true, options: YES_NO,
      },
      {
        id: "active",
        // 27003:15040
        label: "Would you say you are physically active? For example, at least 75 minutes of vigorous activity (e.g. running, cycling, interval training) or 150 minutes of moderate-intensity aerobic exercise (e.g., brisk walking) per week.",
        kind: "choice", required: true, options: YES_NO,
      },
      {
        id: "diet",
        // 27003:15040
        label: "Would you say you have a healthy diet? For example, you eat minimal processed foods.",
        kind: "choice", required: true, options: YES_NO,
      },
      {
        id: "sleep",
        // 27003:15040
        label: "Would you say you sleep well? For example, you regularly sleep seven hours per night.",
        kind: "choice", required: true, options: YES_NO,
      },
    ],
  },
];

export const ALL_QUESTIONS: Question[] = SECTIONS.flatMap((s) => s.questions);

export type Answers = Record<string, string>;

/**
 * Which questions are unanswered, in the order they appear.
 *
 * A number question counts as answered only if it holds a positive number: the
 * capture's fields are numeric, and "0 cm tall" is not an answer. Whitespace is
 * not an answer either, which is what trim is for.
 */
export function missingAnswers(answers: Answers): string[] {
  return ALL_QUESTIONS.filter((q) => {
    if (!q.required) return false;
    const value = (answers[q.id] ?? "").trim();
    if (value === "") return true;
    if (q.kind === "number") {
      const n = Number(value);
      return !Number.isFinite(n) || n <= 0;
    }
    return false;
  }).map((q) => q.id);
}

// ─── After submitting ────────────────────────────────────────────────────────

/*
 * NO FRAME. This screen is not in the Health assessments file: searched the
 * B2B2C page for "Thank you!", "has been submitted", "What happens next?" and
 * "Back to Dashboard" and found nothing. Janelle sent it as an image on 3 Sep
 * with "when user is done with the questionnaire, have this: create something
 * similar to the FHM chrome but something similar to this", so the copy below
 * is transcribed from that image and the layout follows it.
 *
 * Cite a node once one exists. Until then this is the only record of the
 * wording, which is why it lives here rather than inline in the component.
 */
export const SUBMITTED = {
  // NO FRAME. Transcribed from Janelle's image, 3 Sep.
  banner: "Your Health Questionnaire has been submitted",
  // NO FRAME. Transcribed from Janelle's image, 3 Sep.
  title: "Thank you!",
  // NO FRAME. Transcribed from Janelle's image, 3 Sep.
  lead: "Your Health Questionnaire has been submitted successfully.",
  // NO FRAME. Transcribed from Janelle's image, 3 Sep.
  nextHeading: "What happens next?",
  next: [
    {
      // NO FRAME. Transcribed from Janelle's image, 3 Sep.
      title: "Clinician review",
      // NO FRAME. Transcribed from Janelle's image, 3 Sep.
      body: "A qualified Clinician will review your responses and identify any opportunities to improve your health and wellbeing.",
    },
    {
      // NO FRAME. Transcribed from Janelle's image, 3 Sep.
      title: "Personalised recommendations",
      // NO FRAME. Transcribed from Janelle's image, 3 Sep.
      body: "You'll receive practical health and lifestyle recommendations tailored to you.",
    },
    {
      // NO FRAME. Transcribed from Janelle's image, 3 Sep.
      title: "Advanced Health Assessment (if recommended)",
      // NO FRAME. Transcribed from Janelle's image, 3 Sep.
      body: "If clinically appropriate, you may be invited to book a free Advanced Corporate Health Assessment, fully funded by your employer.",
    },
  ],
  resume: {
    // NO FRAME. Transcribed from Janelle's image, 3 Sep.
    title: "Need to come back and finish later?",
    // NO FRAME. Transcribed from Janelle's image, 3 Sep.
    body: "Simply log back in to your account at any time. You'll continue from where you left off.",
  },
  // NO FRAME. Transcribed from Janelle's image, 3 Sep.
  privacy: "Your information is confidential and will only be used by our healthcare team to support your health.",
  cta: "Back to Dashboard",
};
