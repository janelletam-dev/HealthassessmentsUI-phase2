import { check as assert, report } from "./assertions.ts";
import { GP_PRACTICES, practiceLabel, practicesNear, filterPractices } from "./gp-practices.ts";

const nameOf = (postcode: string) => practicesNear(postcode).practices.map((p) => p.name);

// Janelle's example: CB1 9LF is a home address with no surgery on it, and the
// nearest is Cherry Hinton Medical Centre at CB1 9HR, one sector along.
const cb19lf = practicesNear("CB1 9LF");
assert.equal(cb19lf.practices[0].name, "Cherry Hinton Medical Centre", "nearest to CB1 9LF");
assert.equal(cb19lf.practices[0].postcode, "CB1 9HR");
assert.ok(cb19lf.approximate, "nothing sits at CB1 9LF itself, so the list is near, not at");

// A postcode that IS a surgery reports itself, and is not flagged approximate.
const exact = practicesNear("CB1 9HR");
assert.equal(exact.practices[0].name, "Cherry Hinton Medical Centre");
assert.ok(!exact.approximate, "an exact hit is not approximate");

// Spacing and case are how people actually type postcodes.
assert.deepEqual(nameOf("cb19lf"), nameOf("CB1 9LF"), "case and spacing do not change the result");
assert.deepEqual(nameOf("CB1  9lf"), nameOf("CB1 9LF"));

// Same district beats same area: every CB1 practice outranks nothing else.
assert.ok(nameOf("CB1 2PY").includes("York Street Medical Practice"));
assert.equal(nameOf("CB1 2PY")[0], "York Street Medical Practice", "the surgery at that exact postcode leads");

// A Cambridge postcode never offers a London surgery, and the reverse.
for (const name of nameOf("CB1 9LF")) {
  const practice = GP_PRACTICES.find((p) => p.name === name)!;
  assert.ok(practice.postcode.startsWith("CB"), `${name} is in the CB area`);
}
for (const name of nameOf("W12 0PT")) {
  const practice = GP_PRACTICES.find((p) => p.name === name)!;
  assert.ok(!practice.postcode.startsWith("CB"), `${name} is not in Cambridge`);
}

// Nothing in the area at all returns nothing rather than padding with far-away
// surgeries. EH is Edinburgh; the fixture has none.
const nowhere = practicesNear("EH1 1AA");
assert.deepEqual(nowhere.practices, [], "no practice in the area returns an empty list");
assert.ok(!nowhere.approximate, "an empty list is not an approximate one");

// Type-ahead matches name, street and postcode, and ignores postcode spacing.
const all = GP_PRACTICES;
assert.equal(filterPractices(all, "cherry hinton").length, 2, "matches the centre and Cornford House on Cherry Hinton Road");
assert.equal(filterPractices(all, "fishers").length, 1, "matches on street");
assert.equal(filterPractices(all, "cb19hr").length, 1, "matches an unspaced postcode");
assert.equal(filterPractices(all, "CB1 9HR").length, 1, "matches a spaced postcode");
assert.deepEqual(filterPractices(all, "   "), all, "a blank query filters nothing out");
assert.deepEqual(filterPractices(all, "zzzz"), [], "no match returns nothing");

// The label is what the picker shows and stores, so it has to round-trip.
const label = practiceLabel(GP_PRACTICES.find((p) => p.name === "Cherry Hinton Medical Centre")!);
assert.equal(label, "Cherry Hinton Medical Centre, 34 Fishers Lane, Cherry Hinton, Cambridge, CB1 9HR");

report("gp-practices");
