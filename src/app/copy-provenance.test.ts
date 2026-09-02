import { check as assert, report } from "./assertions.ts";
import { scanCopy, unattributed } from "./copy-provenance.ts";

// A ratchet, not a gate. Lower these as strings get attributed; the test fails
// if any rises, so new copy has to arrive with its provenance.
//
// 24 Aug 2026: 51 across nine files, and it had not moved since.
// 27 Aug 2026: 36 across seven. personal-details.ts went 10 to 0 by moving its
// node ids out of the file header and beside the strings, which is bookkeeping
// rather than invented copy and was the cheapest ten available. create-account
// went 7 to 2 as the four paraphrased strings were corrected against
// 1946:149548 and 1946:149567 and cited there. plan-notices.ts is gone from the
// list entirely.
//
// What is left is genuinely unframed, not mislaid: payment.ts (15) and
// contact-info.ts (8) are field-level messages their own headers already admit
// have no frame.
//
// Do not raise a number to make this pass. Attribute the string instead: a node
// id above it, or NO FRAME with a reason.
const BASELINE: Record<string, number> = {
  "activation-codes.ts": 1,
  "captcha-gate.ts": 2,
  "contact-info.ts": 8,
  "create-account.ts": 2,
  "emergency-contact.ts": 4,
  "gp-details.ts": 4,
  "payment.ts": 15,
};

const all = scanCopy();
const missing = unattributed(all);

assert.ok(all.length > 50, "the scanner found the copy at all");

const counts: Record<string, number> = {};
for (const s of missing) counts[s.file] = (counts[s.file] ?? 0) + 1;

for (const [file, limit] of Object.entries(BASELINE)) {
  const now = counts[file] ?? 0;
  assert.ok(
    now <= limit,
    `${file}: ${now} unattributed strings, baseline ${limit}. Attribute the new one — ` +
      `a node id above it, or NO FRAME with a reason — rather than raising the baseline.`,
  );
}

for (const file of Object.keys(counts)) {
  assert.ok(file in BASELINE, `${file} is new: ${counts[file]} unattributed. New copy needs provenance.`);
}

// The convention works in both directions.
assert.ok(
  all.some((s) => s.attributed && /Date of birth is not valid/.test(s.text)),
  "a node id above a string counts as attribution",
);
assert.ok(
  all.some((s) => s.attributed && /or over to create your own account/.test(s.text)),
  "template literals are scanned, and NO FRAME counts as attribution",
);
assert.ok(
  missing.some((s) => s.file === "payment.ts"),
  "the payment messages are correctly seen as unattributed",
);

report("copy-provenance", `${missing.length} of ${all.length} strings unattributed, none worse than baseline`);
