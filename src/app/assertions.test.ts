// The counter is now the thing making the claims, so it gets checked itself.
// Deliberately uses the raw assert, not the wrapper: you cannot verify a
// counter with the counter.
import assert from "node:assert/strict";
import { check, assertionCount, report } from "./assertions.ts";

const start = assertionCount();

// Each call counts once, whichever method
check.equal(1, 1);
check.ok(true);
check.deepEqual({ a: 1 }, { a: 1 });
check.match("abc", /b/);
check.notEqual(1, 2);
assert.equal(assertionCount() - start, 5, "five calls counted as five");

// A failing assertion still throws, and still counts
let threw = false;
try { check.equal(1, 2); } catch { threw = true; }
assert.ok(threw, "the wrapper does not swallow failures");
assert.equal(assertionCount() - start, 6, "the failing call was counted too");

// Loop bodies count per iteration. This is the case a hand-written total always
// missed, and why the old numbers drifted: countries.test.ts loops over 121
// entries, so its real figure was several times the literal.
const beforeLoop = assertionCount();
for (const v of [1, 2, 3, 4, 5, 6, 7]) check.ok(v > 0);
assert.equal(assertionCount() - beforeLoop, 7, "seven iterations, seven assertions");

// Non-function properties pass through untouched
assert.equal(typeof check.AssertionError, "function");
assert.equal(typeof report, "function");

console.log("assertions: self-test passed, wrapper counts correctly");
