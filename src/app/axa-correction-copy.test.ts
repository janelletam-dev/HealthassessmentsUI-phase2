// The regression this file exists for: HP and LC shared one string, AXA
// revised the HP wording, and the revision landed on LC as well without anyone
// deciding it should. Nothing failed, because there was nothing to fail.

import { readFileSync } from "node:fs";
import { check, report } from "./assertions.ts";
import { CORRECTION_COPY } from "./axa-correction-copy.ts";
import { AXA_HP_SUPPORT_PHONE } from "./axa-support.ts";

const { hp, lc } = CORRECTION_COPY;

// THE INVARIANT. If these two ever converge again it is because someone edited
// one arm and let it stand for both.
check.notEqual(hp.body, lc.body, "HP and LC bodies have collapsed back into one string");

// The title is the one thing 2171:121762 and 2171:121778 genuinely share.
check.equal(hp.title, lc.title, "the two frames draw the same title; they should still agree");

// Only LC's frame carries a support row.
check.equal(hp.showsSupportRow, false, "2171:121762 has no support affordance");
check.equal(lc.showsSupportRow, true, "2171:121778 ends with Need support? / Contact us");

// SPEC LOCK. The number comes from the two source documents, not from this
// file and not from the frames (Janelle, 28 Aug). Changing it means re-reading
// HP_API_error_messages.xlsx, not editing the constant.
check.equal(
  AXA_HP_SUPPORT_PHONE,
  "0800 169 3965",
  "HP's number is the DCA Web message column of HP_API_error_messages.xlsx, rows 2 and 4",
);
// The LC number belongs to the other arm and must never appear on HP copy.
// signup-flows.pdf, GET /plan-summary, validationState 3 and 4.
check.ok(!hp.body.includes("01892"), "01892 is LC's line, not HP's");

// AXA's HP wording names their team inline, which is why HP needs no row.
check.ok(hp.body.includes(AXA_HP_SUPPORT_PHONE), "HP carries AXA's number, from their own copy");
check.ok(hp.body.includes("AXA Policy Servicing Team"), "and names the team");

// LC's frame carries no number. Its wording is unreviewed, and HP's and LC's
// hotlines are probably different lines rather than one number written two
// ways, so putting HP's here would be wrong twice over.
check.ok(!/\d{4}\s?\d{3}\s?\d{4}/.test(lc.body), "LC's frame body carries no phone number; do not add one");

// Both arms keep the account-saved reassurance. Dropping it is the specific
// regression AXA's string would have introduced.
for (const [arm, copy] of Object.entries(CORRECTION_COPY)) {
  check.ok(copy.body.startsWith("Your account is saved."), `${arm} opens by saying the account survived`);
  check.ok(copy.title.length > 0 && copy.body.length > 0, `${arm} has both strings`);
}

// The screen has to READ the table. Inlining a literal at the render site is
// how the two arms merged in the first place, and would leave every assertion
// above passing against copy nobody sees.
const app = readFileSync(new URL("./App.tsx", import.meta.url), "utf8");
check.ok(app.includes("CORRECTION_COPY[plan]"), "the correction screen looks the copy up by arm");
check.ok(
  !app.includes("your AXA membership record"),
  "the box copy is back inline in App.tsx, so the table is decorative",
);

report("axa-correction-copy");
