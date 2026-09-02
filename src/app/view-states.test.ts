// Every View states entry has to be visible, reachable, and land on a real
// demo state.
//
// This exists because two whole picker groups were once dead in exactly the way
// nobody notices: the five landing-* ids were listed in PICKER_GROUPS but had no
// STATE_DIALOG_CONFIGS entry, and the panel renders `if (!cfg) return null`, so
// both groups drew a heading with nothing under it. No error, no warning, just
// two states that could not be reviewed.
//
// The three failures this catches, all silent:
//   listed but unconfigured  -> the row does not render at all
//   configured but unlisted  -> the state exists and cannot be reached
//   dispatched into a map    -> the key is missing, so the screen opens blank
//
// It reads App.tsx as text rather than importing it, the way ui-copy.test.ts
// does: App.tsx is TSX with React in it and nothing here needs to render.

import { check as assert, report } from "./assertions.ts";
import { readFileSync } from "node:fs";
import { DEMO_PAYMENT } from "./payment.ts";
import { DEMO_EMERGENCY_CONTACT } from "./emergency-contact.ts";
import { DEMO_GP_DETAILS } from "./gp-details.ts";
import { DEMO_CONTACT_INFO } from "./contact-info.ts";
import { DEMO_PERSONAL_DETAILS } from "./personal-details.ts";
import { DEMO_CREATE_ACCOUNT } from "./create-account.ts";
import { PLAN_NOTICES } from "./plan-notices.ts";

const SRC = readFileSync(new URL("./App.tsx", import.meta.url), "utf8");

// ── What the picker lists ────────────────────────────────────────────────────

const groupsBlock = SRC.slice(
  SRC.indexOf("const PICKER_GROUPS"),
  SRC.indexOf("// Icon badge helper"),
);
assert.ok(groupsBlock.length > 0, "found the PICKER_GROUPS block");

const groups: { label: string; ids: string[] }[] = [];
for (const m of groupsBlock.matchAll(/\{\s*label:\s*"([^"]+)",\s*ids:\s*\[([^\]]+)\]/g)) {
  groups.push({
    label: m[1],
    ids: [...m[2].matchAll(/"([^"]+)"/g)].map((x) => x[1]),
  });
}
assert.ok(groups.length >= 15, `parsed the groups (${groups.length})`);

const listed = groups.flatMap((g) => g.ids);
assert.ok(listed.length >= 60, `parsed the ids (${listed.length})`);

// A duplicated id renders twice and only the first is ever reached.
const seen = new Set<string>();
for (const id of listed) {
  assert.ok(!seen.has(id), `${id} is listed once`);
  seen.add(id);
}

// A group with no ids draws a heading over nothing.
for (const g of groups) assert.ok(g.ids.length > 0, `group "${g.label}" has entries`);

// ── What the picker can draw ─────────────────────────────────────────────────

const configBlock = SRC.slice(
  SRC.indexOf("const STATE_DIALOG_CONFIGS"),
  SRC.indexOf("const PICKER_GROUPS"),
);
const configured = new Map<string, string>(); // id -> category
for (const m of configBlock.matchAll(/^\s{2}"([a-zA-Z0-9-]+)":\s*\{\s*\n?\s*category:\s*"(\w+)"/gm)) {
  configured.set(m[1], m[2]);
}
assert.ok(configured.size >= 60, `parsed the configs (${configured.size})`);

// THE BUG THIS FILE WAS WRITTEN FOR. The panel does `if (!cfg) return null`.
for (const id of listed) {
  assert.ok(configured.has(id), `"${id}" is listed in View states but has no config, so its row never renders`);
}

// The mirror: a config nothing lists is a state that cannot be opened.
//
// One is parked on purpose. PICKER_GROUPS says so above the code-entry group:
// "code-not-arrived" has no inline design and overlaps with "Code not
// recognised" from the patient's side, so its config is kept and its row is
// not. Named here rather than skipped generically, so the next unlisted config
// still fails.
const PARKED = ["code-not-arrived"];
for (const id of PARKED) {
  assert.ok(configured.has(id), `${id} is named as parked but has no config to park`);
  assert.ok(!seen.has(id), `${id} is now listed, so drop it from PARKED`);
  assert.ok(SRC.includes(`"${id}" is parked`), `${id} is parked with no comment saying why`);
}
for (const id of configured.keys()) {
  if (PARKED.includes(id)) continue;
  assert.ok(seen.has(id), `"${id}" is configured but appears in no picker group, so nothing can reach it`);
}

// ── What the dispatch handles ────────────────────────────────────────────────

const dispatch = SRC.slice(
  SRC.indexOf("onTriggerError={(id) => {"),
  SRC.indexOf('} else if (cfg && cfg.category !== "activation")'),
);
assert.ok(dispatch.length > 0, "found the dispatch");

const prefixes = [...dispatch.matchAll(/id\.startsWith\("([^"]+)"\)/g)].map((m) => m[1]);
const exact = new Set([...dispatch.matchAll(/id === "([^"]+)"/g)].map((m) => m[1]));

// Every listed id either matches a branch or falls through to the two-line
// tail, which does the same thing both ways: setActiveErrorState(id), over
// step 4 for a non-activation category and step 0 otherwise.
//
// So nothing is ever literally unhandled, and asserting that would prove
// nothing. What the tail can actually render is a StateDialog, which needs a
// title. An id that falls through carrying `inline: true` and an empty title
// opens an empty dialog over the code screen, which is the failure worth
// catching.
function titleOf(id: string): string {
  const block = configBlock.slice(configBlock.indexOf(`"${id}":`));
  // Leading delimiter, or this matches inside pickerSubtitle.
  return block.match(/[\s,{]title:\s*"([^"]*)"/)?.[1] ?? "";
}

const fallsThrough = listed.filter(
  (id) => !prefixes.some((p) => id.startsWith(p)) && !exact.has(id),
);
// Not asserted non-empty. After the six undesigned states were removed on
// 27 Aug every listed id has its own branch, so nothing reaches the tail and
// this list is legitimately empty. The check below still matters for the next
// id that does fall through.


// Nothing is exempt from needing a title any more. otp-error used to be, via
// OtpErrorPreview; that state and its renderer were removed on 27 Aug as
// undesigned, and with them the only id that reached the tail without one.
const OWN_RENDERER: string[] = [];

for (const id of fallsThrough) {
  if (OWN_RENDERER.includes(id)) continue;
  assert.ok(
    titleOf(id).trim().length > 0,
    `"${id}" reaches no dispatch branch, so it renders through setActiveErrorState as a dialog, but its config has no title: it would open empty`,
  );
}

// No mirror assertion here. "A handled id must have no title" looked like the
// obvious counterpart and is not true: dob-confirm is handled by its own branch
// and still carries "Activation code recognised", which documents the state
// even though CodeVerifiedDialog renders its own copy. Asserting it would be
// inventing a convention rather than pinning one.

// ── Where the prefixed ones actually land ────────────────────────────────────
// The dispatch slices the prefix off and looks the rest up in a demo map. A
// missing key opens the screen with no demo state, which reads as "the state is
// broken" rather than "the entry is wrong".

const SLICED: { prefix: string; map: Record<string, unknown>; name: string }[] = [
  { prefix: "pay-", map: DEMO_PAYMENT, name: "DEMO_PAYMENT" },
  { prefix: "ec-", map: DEMO_EMERGENCY_CONTACT, name: "DEMO_EMERGENCY_CONTACT" },
  { prefix: "gp-", map: DEMO_GP_DETAILS, name: "DEMO_GP_DETAILS" },
  { prefix: "ci-", map: DEMO_CONTACT_INFO, name: "DEMO_CONTACT_INFO" },
  { prefix: "pd-", map: DEMO_PERSONAL_DETAILS, name: "DEMO_PERSONAL_DETAILS" },
  { prefix: "ca-", map: DEMO_CREATE_ACCOUNT, name: "DEMO_CREATE_ACCOUNT" },
];

for (const { prefix, map, name } of SLICED) {
  const ids = listed.filter((id) => id.startsWith(prefix));
  assert.ok(ids.length > 0, `${prefix}* has entries to check`);
  for (const id of ids) {
    const key = id.slice(prefix.length);
    assert.ok(key in map, `"${id}" slices to "${key}", which ${name} does not have`);
  }
}

// landing-* is the odd one: two of its ids drive the cards directly and the
// rest have to name a notice, or the banner silently does not appear.
const LANDING_WITHOUT_NOTICE = ["beforeProfile", "afterProfile"];
for (const id of listed.filter((i) => i.startsWith("landing-"))) {
  const key = id.slice("landing-".length);
  assert.ok(
    LANDING_WITHOUT_NOTICE.includes(key) || key in PLAN_NOTICES,
    `"${id}" slices to "${key}", which is neither a card state nor a PLAN_NOTICES key`,
  );
}

// otp-* is sliced into a literal union rather than a map, and the branch names
// its three ids rather than matching the prefix. The state that forced that,
// "otp-error", has since been removed as undesigned, but the naming stays: a
// prefix is not a safe proxy for "is a verification stage", and the next id
// that starts otp- would be captured silently all over again.
const OTP_STAGES = ["otp-code", "otp-code-error", "otp-code-failed"];
for (const id of OTP_STAGES) {
  assert.ok(seen.has(id), `${id} is a stage the dispatch names but nothing lists`);
  assert.ok(!fallsThrough.includes(id), `${id} should be handled by the stage branch`);
}
assert.ok(
  !dispatch.includes('id.startsWith("otp-")'),
  "the otp branch is prefix-matched again, so any new otp-* id gets captured as a stage",
);

// The axa- branch ends in an unguarded else that renders creation-failed, so
// every axa- id has to be accounted for by name or it lands there silently.
// Four open the correction screen or the landing; two set a banner.
const AXA_NOT_BANNER = ["axa-unvalidatedCode", "axa-lc-unvalidatedCode", "axa-stillNotMatched", "axa-detailsUpdated"];
const AXA_BANNERS = ["axa-duplicate", "axa-creationFailed"];
for (const id of listed.filter((i) => i.startsWith("axa-"))) {
  assert.ok(
    AXA_BANNERS.includes(id) || AXA_NOT_BANNER.includes(id),
    `"${id}" is not named in the axa- branch, so it falls to the else and silently renders the creation-failed banner`,
  );
}
// And the ones that are not banners must actually be named there, or they take
// the else regardless of what this list says.
for (const id of AXA_NOT_BANNER) {
  assert.ok(dispatch.includes(`id === "${id}"`), `${id} is listed as not-a-banner but the branch never names it`);
}

// ── THE FIFTH FAILURE MODE: state inherited from the previous row ───────────
//
// The 26 Aug audit found seven rows whose screen depended on which row you
// opened before them, because the dispatch reset three fields at the top and
// left fifteen to whichever branch remembered. The worst was a latch: setBrand
// is called only with "axa" and nothing reset it, so one AXA row put every
// later row in AXA chrome until reload.
//
// The invariant that kills the whole class: the reset preamble names EVERY
// picker-controlled setter, so no branch can inherit. Checked structurally,
// because the alternative is opening 70 rows in 70 orders.

// The slice marker has to be checked, not assumed. indexOf returns -1 when the
// first branch stops being a prefix test, and slice(0, -1) then hands back
// almost the whole dispatch, so every assertion below would pass vacuously.
// A check that cannot fail is worse than no check. (Gap raised by the 27 Aug
// audit; it was right.)
const PREAMBLE_END = "if (id.startsWith(";
const cut = dispatch.indexOf(PREAMBLE_END);
assert.ok(cut > 0, `the preamble is sliced at ${PREAMBLE_END}, which is no longer the first branch: re-anchor this or everything below stops meaning anything`);
const preamble = dispatch.slice(0, cut);
assert.ok(preamble.includes("setPath("), "the slice landed on the real preamble");
// And it must stop BEFORE the first branch. If the marker merely moves rather
// than disappearing, indexOf finds a later startsWith and the "preamble"
// quietly swallows branch bodies, which would mask exactly the leaks this file
// exists to catch.
assert.ok(!preamble.includes("else if"), "the preamble slice has run past the first branch, so branch setters are being counted as resets");

// Every setter the dispatch calls anywhere must also be called in the preamble.
// A branch that sets something the preamble never resets is the bug's shape.
const setters = new Set([...dispatch.matchAll(/\bset([A-Z]\w+)\(/g)].map((m) => m[1]));
assert.ok(setters.size >= 20, `found the setters (${setters.size})`);

const notReset: string[] = [];
for (const name of setters) {
  if (!new RegExp(`\\bset${name}\\(`).test(preamble)) notReset.push(name);
}
assert.deepEqual(
  notReset,
  [],
  `these are set by a branch but never reset in the preamble, so their value leaks into whatever row you open next: ${notReset.join(", ")}`,
);

// The dispatch-only view is the other gap the 27 Aug audit raised: a field the
// dispatch never touches, but some screen owns, would still leak. So check the
// preamble against EVERY piece of state the App component declares, not just
// the ones the dispatch happens to set.
const appStart = SRC.indexOf("const [brand, setBrand]");
const appBlock = SRC.slice(appStart, SRC.indexOf("onTriggerError={(id) => {"));
const declared = [...appBlock.matchAll(/const \[\w+, (set\w+)\]/g)].map((m) => m[1]);
assert.ok(declared.length >= 24, `found the state declarations (${declared.length})`);

// Deliberately outside the picker's reach. Named individually so a new one has
// to be argued for rather than silently joining the list.
const NOT_PICKER_STATE = [
  "setShowStates",  // the panel's own visibility; the picker closes it separately
  "setShowExit",    // the exit confirmation, unrelated to which state is shown
];
const leaks = declared.filter((n) => !preamble.includes(`${n}(`) && !NOT_PICKER_STATE.includes(n));
assert.deepEqual(
  leaks,
  [],
  `App state the preamble never resets, so it carries from one picker row to the next: ${leaks.join(", ")}`,
);

// The latch specifically. setBrand only ever takes "axa" in the branches, so if
// the preamble stops resetting it the picker sticks in AXA chrome for good.
assert.ok(/setBrand\("dca"\)/.test(preamble), "the preamble resets brand, or one AXA row latches the whole picker");
assert.ok(/setJourney\("dca"\)/.test(preamble), "the preamble resets journey, which drives the account-plan band");

// Rows in the same picker group should land on the same screen. lapsed-policy
// sat with details-mismatch and opened on the code screen, because it reached
// the tail rather than a branch.
for (const id of ["details-mismatch", "lapsed-policy"]) {
  assert.ok(
    new RegExp(`id === "${id}"`).test(dispatch),
    `"${id}" is in the After account creation group, so it needs a branch: the tail opens at step 0`,
  );
}

// ── The rows a person reads ──────────────────────────────────────────────────

for (const [id] of configured) {
  const block = configBlock.slice(configBlock.indexOf(`"${id}":`));
  const label = block.match(/pickerLabel:\s*"([^"]*)"/)?.[1] ?? "";
  const subtitle = block.match(/pickerSubtitle:\s*["`]([^"`]*)["`]/)?.[1] ?? "";
  assert.ok(label.trim().length > 0, `${id} has a picker label`);
  assert.ok(subtitle.trim().length > 0, `${id} has a picker subtitle`);
  assert.ok(!label.includes("—") && !subtitle.includes("—"), `no em dash in the ${id} row`);
}

report("view-states");
