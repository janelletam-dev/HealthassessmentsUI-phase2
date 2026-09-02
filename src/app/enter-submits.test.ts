import { check as assert, report } from "./assertions.ts";
import { shouldSubmit } from "./enter-submits.ts";

const ev = (over: Partial<{ key: string; defaultPrevented: boolean; targetTag: string }> = {}) =>
  ({ key: "Enter", defaultPrevented: false, targetTag: "INPUT", ...over });

// ─── The case this exists for ───────────────────────────────────────────────

assert.ok(shouldSubmit(ev()), "Enter in a text field submits");

// ─── Other keys do nothing ──────────────────────────────────────────────────

for (const key of ["a", " ", "Tab", "Escape", "ArrowDown", "Backspace", "NumpadEnter"]) {
  assert.ok(!shouldSubmit(ev({ key })), `${key} does not submit`);
}

// ─── A child that already handled Enter wins ────────────────────────────────
// The country picker uses Enter to choose an option and calls preventDefault.
// Without this the screen would submit at the same time.

assert.ok(!shouldSubmit(ev({ defaultPrevented: true })), "a handled Enter does not also submit");

// ─── Only text fields ───────────────────────────────────────────────────────
// Buttons and links keep their own Enter behaviour, otherwise Enter on a Back
// button would move forwards.

for (const targetTag of ["BUTTON", "A", "TEXTAREA", "SELECT", "DIV", "SPAN", "LABEL"]) {
  assert.ok(!shouldSubmit(ev({ targetTag })), `Enter on <${targetTag.toLowerCase()}> does not submit`);
}

// ─── Busy mirrors the button's disabled state ───────────────────────────────
// Every screen passes the same flag its primary button uses, so Enter can
// never fire a request the button itself would have refused.

assert.ok(!shouldSubmit(ev(), true), "busy blocks submission");
assert.ok(shouldSubmit(ev(), false), "not busy allows it");
assert.ok(!shouldSubmit(ev({ key: "a" }), true), "busy and wrong key still refuses");

// Busy wins even when everything else is right, which is the double-submit guard.
assert.ok(!shouldSubmit({ key: "Enter", defaultPrevented: false, targetTag: "INPUT" }, true),
  "a second Enter mid-request is ignored");

report("enter-submits");
