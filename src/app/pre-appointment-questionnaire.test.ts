import { check as assert, report } from "./assertions.ts";
import { SECTIONS, missingAnswers, type Answers } from "./pre-appointment-questionnaire.ts";

// The capture's eleven headings, in order.
assert.deepEqual(
  SECTIONS.map((s) => s.title),
  ["Medical History", "Cardiac", "Female Specific", "Musculoskeletal", "Smoking", "Alcohol",
   "Diet", "Exercise", "Stress", "DASS-21", "Vitamin D"],
  "eleven sections in the capture's order",
);

const questions = SECTIONS.flatMap((s) => s.questions);
const asked = questions.filter((q) => q.kind !== "note");

assert.ok(questions.length > 40, "the whole document is transcribed, not a sample");

// Ids address answers, so a duplicate would silently tie two questions together.
const ids = questions.map((q) => q.id);
assert.deepEqual(ids.length, new Set(ids).size, "every id is unique");

// Every answerable question offers something to answer with. The four closed
// dropdowns in the capture are the reason this is checked rather than assumed.
for (const q of asked) {
  assert.ok(q.options.length > 0, `${q.id} has options`);
}

// The two tick lists are the same list, and the family one adds exactly one.
const diagnosed = asked.find((q) => q.id === "diagnosed");
const family = asked.find((q) => q.id === "family");
assert.deepEqual(diagnosed?.options.length, 16, "sixteen diagnosed conditions");
assert.deepEqual(family?.options.length, 17, "family history adds I don't know");
assert.deepEqual(family?.options.at(-1), "I don't know", "and adds it last");

// Labels carry no leading asterisk: required drives the marker instead.
for (const q of asked) {
  assert.ok(!q.label.startsWith("*"), `${q.id} label has no asterisk`);
}

// Optional questions are the four the capture leaves unmarked.
assert.deepEqual(
  asked.filter((q) => !q.required).map((q) => q.id),
  ["ethnicity", "breast-aware", "menstruating", "dass-participate"],
  "only the capture's unmarked questions are optional",
);

// missingAnswers
assert.deepEqual(missingAnswers({}).length, asked.filter((q) => q.required).length, "empty form misses every required question");
assert.ok(missingAnswers({}).includes("statin"), "and names them by id");

const full: Answers = {};
for (const q of asked) full[q.id] = q.kind === "checkbox" ? [q.options[0]] : q.options[0];
assert.deepEqual(missingAnswers(full), [], "a full form misses nothing");

// An empty tick list is not an answer, which a truthiness check would miss.
assert.deepEqual(missingAnswers({ ...full, diagnosed: [] }), ["diagnosed"], "an empty checkbox list counts as unanswered");
assert.deepEqual(missingAnswers({ ...full, statin: "" }), ["statin"], "an empty choice counts as unanswered");

report("pre-appointment-questionnaire", `${asked.length} questions across ${SECTIONS.length} sections`);
