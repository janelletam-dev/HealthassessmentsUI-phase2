import { check as assert, report } from "./assertions.ts";
import { SECTIONS, ALL_QUESTIONS, missingAnswers, type Answers } from "./questionnaire.ts";

// Shape, against the capture: four sections, 25 questions.
assert.deepEqual(SECTIONS.map((s) => s.title), ["Demographics", "Medical History", "Family History", "Lifestyle"]);
assert.equal(ALL_QUESTIONS.length, 25, "25 questions were transcribed from 27003:15040");
assert.deepEqual(SECTIONS.map((s) => s.questions.length), [4, 10, 5, 6]);

// Ids have to be unique or answers overwrite each other silently.
const ids = ALL_QUESTIONS.map((q) => q.id);
assert.equal(new Set(ids).size, ids.length, "question ids are unique");

// Exactly one optional question, the waist measurement.
const optional = ALL_QUESTIONS.filter((q) => !q.required).map((q) => q.id);
assert.deepEqual(optional, ["waist"], "only the waist measurement is unmarked in the capture");

// Every choice question has options; every number question has none.
for (const q of ALL_QUESTIONS) {
  if (q.kind === "choice") assert.ok(q.options && q.options.length >= 2, `${q.id} offers a choice`);
  else assert.equal(q.options, undefined, `${q.id} is a number, not a choice`);
}

// The three answer sets the capture actually uses.
const familyOptions = SECTIONS[2].questions.map((q) => q.options?.join("/"));
assert.deepEqual(new Set(familyOptions).size, 1, "family history is one option set");
assert.equal(familyOptions[0], "Yes/No/Don't know", "family history offers Don't know");
assert.equal(SECTIONS[1].questions[0].options?.join("/"), "Yes/No", "medical history is Yes/No");

// ── missingAnswers ──────────────────────────────────────────────────────────
assert.equal(missingAnswers({}).length, 24, "an empty form is missing every required question");
assert.ok(!missingAnswers({}).includes("waist"), "the optional one is never missing");

const full: Answers = Object.fromEntries(
  ALL_QUESTIONS.map((q) => [q.id, q.kind === "number" ? "170" : q.options![0]]),
);
assert.deepEqual(missingAnswers(full), [], "a fully answered form is complete");

// A number question is not answered by zero, by blank space, or by words.
for (const bad of ["", "   ", "0", "-5", "abc"]) {
  assert.ok(missingAnswers({ ...full, height: bad }).includes("height"), `height rejects ${JSON.stringify(bad)}`);
}
assert.deepEqual(missingAnswers({ ...full, height: "170.5" }), [], "a decimal height is fine");

// Whitespace is not an answer to a choice either.
assert.ok(missingAnswers({ ...full, ethnicity: "  " }).includes("ethnicity"), "blank space is not a choice");

// Order is the order asked, so the first missing one is the first to scroll to.
assert.equal(missingAnswers({ ...full, sleep: "", ethnicity: "" })[0], "ethnicity", "reported in page order");

report("questionnaire");
