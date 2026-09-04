// FHM's pre-appointment questionnaire, the one Booking confirmed sends you to.
//
// Figma rDltwIr2dJvUUNaXEqEYFO node 27048:16445, a web capture of the live FHM
// questionnaire at dca-test-domain.fullhealthmedical.com, 1512x12591. Janelle,
// 4 Sep: "the contents of the questionnaire when the click on the yellow button
// is this".
//
// NOT THE PRE-SCREEN. questionnaire.ts is a different capture, 27003:15040 at
// 1512x5765, asked before any booking exists: demographics, medical history,
// family history, lifestyle. This one is asked after the Advanced assessment is
// booked and before the appointment, and it is more than twice as long. The two
// share a platform and nothing else, which is why they are separate files.
//
// ELEVEN SECTIONS. Every heading, question, option, note and asterisk below is
// the capture's. Where a question is a closed dropdown in the capture its
// options are not visible, and those four are marked NO FRAME individually with
// the instrument they come from.

export type Question =
  | { kind: "note"; id: string; body: string[]; bullets?: string[] }
  | { kind: "checkbox"; id: string; label: string; helper?: string; required: boolean; options: string[] }
  | { kind: "choice"; id: string; label: string; helper?: string; note?: string; required: boolean; options: string[] }
  | { kind: "select"; id: string; label: string; helper?: string; required: boolean; options: string[] };

export type Section = { title: string; questions: Question[] };

const YES_NO = ["Yes", "No"];

// 27048:16445, the Diagnosed Conditions tick list, in the capture's order.
const CONDITIONS = [
  "Angina/Heart Attack", "High Blood Pressure", "High Cholesterol", "Previous TIA / Stroke",
  "Atrial Fibrillation", "Diabetes - Type 1", "Diabetes - Type 2", "Thyroid abnormalities",
  "Liver Disease", "Renal Impairment", "Breast Cancer", "Rheumatoid Arthritis",
  "Anaemia", "Haemochromatosis", "Gout", "None of the above",
];

export const SECTIONS: Section[] = [
  {
    title: "Medical History",
    questions: [
      {
        kind: "checkbox", id: "diagnosed", required: true,
        // 27048:16445
        label: "Diagnosed Conditions",
        helper: "Have you previously been diagnosed with any of the following conditions? (tick appropriate)",
        options: CONDITIONS,
      },
      {
        kind: "checkbox", id: "family", required: true,
        // 27048:16445. The same list, plus one option.
        label: "Family History",
        helper: "Does your family have any history of any of the following conditions?",
        options: [...CONDITIONS, "I don't know"],
      },
    ],
  },
  {
    title: "Cardiac",
    questions: [
      {
        kind: "choice", id: "statin", required: true,
        // 27048:16445
        label: "Are you taking a statin to lower your cholesterol?",
        // 27048:16445, drawn under a "Notes" subheading.
        note: "Some common examples of statins are: Atorvastatin (Lipitor), Rosuvastatin (Crestor) and Simvastatin (Zocor)",
        options: YES_NO,
      },
      {
        kind: "select", id: "ethnicity", required: false,
        // 27048:16445
        label: "Ethnicity",
        helper: "Your ethnicity is not required but it can help calculate a more accurate cardiovascular risk score",
        // NO FRAME for the options: the capture draws this closed. Taken from
        // the pre-screen's own ethnicity question at 27003:15040, which is the
        // same field on the same platform.
        options: ["White", "South Asian", "Black", "Mixed or Other", "Prefer not to say"],
      },
    ],
  },
  {
    title: "Female Specific",
    questions: [
      // 27048:16445. Only the first carries an asterisk.
      { kind: "choice", id: "breast-exam", required: true, label: "Do you examine your breasts regularly?", options: YES_NO },
      { kind: "choice", id: "breast-aware", required: false, label: "Do you know how to be breast aware?", options: YES_NO },
      { kind: "choice", id: "menstruating", required: false, label: "Are you still menstruating?", options: YES_NO },
    ],
  },
  {
    title: "Musculoskeletal",
    questions: [
      {
        kind: "choice", id: "joint-pain", required: true,
        // 27048:16445
        label: "Have you been experiencing any muscular or joint pain or swelling recently, in the absence of an injury?",
        options: YES_NO,
      },
    ],
  },
  {
    title: "Smoking",
    questions: [
      // 27048:16445
      { kind: "choice", id: "smoke", required: true, label: "Do you currently smoke?", options: YES_NO },
      { kind: "choice", id: "vape", required: true, label: "Do you currently vape?", options: YES_NO },
    ],
  },
  {
    title: "Alcohol",
    questions: [
      {
        kind: "note", id: "alcohol-note",
        // 27048:16445
        body: [
          "Alcohol can affect your health, medications and treatments and this questionnaire looks at your overall alcohol consumption. Think about your drinking patterns in the past year and pick the answer that is the best match to your average alcohol consumption.",
          "A “drink” means 1 unit of alcohol which is defined as:",
        ],
        bullets: [
          "1/2 pint of lower-strength beer",
          "1/2 glass of wine",
          "1 pub measure of spirits (25mL)",
          "(Pint of higher-strength beer = 3 units)",
        ],
      },
      {
        kind: "note", id: "alcohol-source",
        // 27048:16445
        body: ["This questionnaire is based on the US-AUDIT standardised assessment tool but it has been adapted for drink sizes and national alcohol consumption guidelines for your country."],
      },
      {
        kind: "select", id: "alcohol-frequency", required: true,
        // 27048:16445
        label: "How often do you have a drink containing alcohol?",
        // NO FRAME for the options: the capture draws this closed. These are
        // AUDIT question 1's own response set, which the note above names as
        // the instrument this section is based on.
        options: ["Never", "Monthly or less", "2 to 4 times a month", "2 to 3 times a week", "4 or more times a week"],
      },
    ],
  },
  {
    title: "Diet",
    questions: [
      // 27048:16445, every one asterisked in the capture.
      { kind: "choice", id: "red-meat", required: true, label: "How often do you eat red meat?", options: ["Never", "Vegetarian", "Less than 3 times per week", "3 or more times per week"] },
      { kind: "choice", id: "fruit", required: true, label: "On average, how many daily servings of whole, fresh fruit do you eat? (fruit juice doesn't count)", options: ["0", "1-4", "More than 5"] },
      { kind: "choice", id: "vegetables", required: true, label: "On average, how many daily servings of whole vegetables do you eat?", options: ["0", "1-4", "More than 5"] },
      { kind: "choice", id: "nuts", required: true, label: "Do you regularly eat small portions of unprocessed nuts and seeds in your diet? e.g. unsalted or uncoated nuts.", options: ["No", "Not sure", "Yes"] },
      { kind: "choice", id: "dairy", required: true, label: "How many days per week do you eat dairy foods like cheese, yogurt and ice cream?", options: ["None", "1-2", "3-5", "6-7"] },
      { kind: "choice", id: "eggs", required: true, label: "How many days per week do you eat eggs or add them as an ingredient when cooking?", options: ["None", "1-2", "3-5", "6-7"] },
      { kind: "choice", id: "sugar", required: true, label: "Do you add sugar to your food such as cereals, tea or coffee?", options: ["No", "Sometimes", "Yes"] },
      { kind: "choice", id: "carbs", required: true, label: "What proportion of your diet consists of carbohydrates such as bread, pasta, cakes, cookies, rice and potatoes?", options: ["None", "Small proportion", "Medium proportion", "Large proportion"] },
      { kind: "choice", id: "meat-meals", required: true, label: "How many of your meals per week include meat?", options: ["None", "Some", "Most"] },
      { kind: "choice", id: "dessert", required: true, label: "How many days per week do you eat dessert?", options: ["None", "Some", "Most"] },
      { kind: "choice", id: "water", required: true, label: "Do you drink 2 litres or more of water most days?", options: YES_NO },
      { kind: "choice", id: "plan-meals", required: true, label: "Do you usually plan what you intend to eat in advance?", options: YES_NO },
      { kind: "choice", id: "shift-work", required: true, label: "Do you work shift work or need to eat at unusual hours?", options: ["No", "Sometimes", "Yes"] },
      { kind: "choice", id: "sleep", required: true, label: "Do your find yourself consistently getting less than the recommended amount of sleep?", options: ["No", "Sometimes", "Yes"] },
      { kind: "choice", id: "stop-when-full", required: true, label: "Do you stop eating when full?", options: YES_NO },
      // 27048:16445, the Diet list continued.
      { kind: "choice", id: "comfort-eat", required: true, label: "Do you frequently comfort eat to cheer yourself up?", options: YES_NO },
      { kind: "choice", id: "sugar-cravings", required: true, label: "Do you ever find yourself craving sugary foods?", options: YES_NO },
      { kind: "choice", id: "whole-foods", required: true, label: "Are most of your meals made at home from whole foods, or do you find yourself depending mainly on processed foods?", options: ["Mostly whole foods", "Mostly processed foods", "It depends"] },
      { kind: "choice", id: "fast-food", required: true, label: "How often would you eat fast food (including takeaways)?", options: ["Never", "More than once per fortnight", "Less than once per fortnight"] },
      { kind: "choice", id: "snacks", required: true, label: "How often would you have an unhealthy snack?", options: ["Never", "Every day", "Some days"] },
      { kind: "choice", id: "portion-size", required: true, label: "Describe your portion size compared to healthy people you know?", options: ["Smaller", "Similar", "Larger"] },
      { kind: "choice", id: "weigh-less", required: true, label: "Would you like to weigh less than you do?", options: YES_NO },
      { kind: "choice", id: "fasting", required: true, label: "Do you practice intermittent fasting?", options: ["No, and it does not interest me", "No, but I am curious", "Yes"] },
    ],
  },
  {
    title: "Exercise",
    questions: [
      // 27048:16445. All four are closed dropdowns in the capture.
      //
      // NO FRAME for the options. The first three are IPAQ short-form day
      // counts, which run 0 to 7, and the fourth is its sitting-time band. The
      // wording of all four is verbatim IPAQ, which is what makes the response
      // sets safe to state rather than invent.
      { kind: "select", id: "vigorous-days", required: true, label: "During the last 7 days, on how many days did you do vigorous physical activities like heavy lifting, digging, aerobics, or fast bicycling?", options: ["0", "1", "2", "3", "4", "5", "6", "7"] },
      { kind: "select", id: "moderate-days", required: true, label: "During the last 7 days, on how many days did you do moderate physical activities like carrying light loads, bicycling at a regular pace, or doubles tennis? Do not include walking.", options: ["0", "1", "2", "3", "4", "5", "6", "7"] },
      { kind: "select", id: "walking-days", required: true, label: "During the last 7 days, on how many days did you walk for at least 10 minutes at a time?", options: ["0", "1", "2", "3", "4", "5", "6", "7"] },
      { kind: "select", id: "sitting-time", required: true, label: "During the last 7 days, how much time did you spend sitting on a week day?", options: ["Less than 2 hours", "2 to 4 hours", "4 to 6 hours", "6 to 8 hours", "More than 8 hours"] },
    ],
  },
  {
    title: "Stress",
    questions: [
      // 27048:16445
      { kind: "choice", id: "stress", required: true, label: "How frequently do you find yourself stressed?", options: ["Never", "Sometimes", "Regularly"] },
    ],
  },
  {
    title: "DASS-21",
    questions: [
      {
        kind: "note", id: "dass-note",
        // 27048:16445
        body: ["The Depression, Anxiety and Stress Scale (DASS-21) is a widely recognised set of three self-reporting scales designed to measure the emotional states of depression, anxiety and stress. It is not used to make a diagnosis in itself but rather to highlight areas of concern in relation to mental health and draw a person’s attention to specific areas that may need a closer look."],
      },
      {
        kind: "checkbox", id: "dass-participate", required: false,
        // 27048:16445. One option, and the question carries no asterisk.
        label: "Do you wish to participate?",
        options: ["I wish to participate in the depression, anxiety and stress self-assessment"],
      },
    ],
  },
  {
    title: "Vitamin D",
    questions: [
      // 27048:16445
      { kind: "choice", id: "vitamin-d", required: true, label: "Are you taking a Vitamin D supplement?", options: YES_NO },
    ],
  },
];

export type Answers = Record<string, string | string[]>;

/** Ids of the required questions still unanswered, in the order they are asked. */
export function missingAnswers(answers: Answers): string[] {
  const missing: string[] = [];
  for (const section of SECTIONS) {
    for (const question of section.questions) {
      if (question.kind === "note" || !question.required) continue;
      const given = answers[question.id];
      const answered = Array.isArray(given) ? given.length > 0 : Boolean(given);
      if (!answered) missing.push(question.id);
    }
  }
  return missing;
}
