import { check as assert, report } from "./assertions.ts";
import { PLAN_NOTICES } from "./plan-notices.ts";

// Four notices, two tones
assert.deepEqual(Object.keys(PLAN_NOTICES), ["dependantPending", "dependantPendingShort", "policyValidating", "planLapsed"]);
assert.equal(PLAN_NOTICES.dependantPending.tone, "info");
assert.equal(PLAN_NOTICES.dependantPendingShort.tone, "info");
assert.equal(PLAN_NOTICES.policyValidating.tone, "warning");
assert.equal(PLAN_NOTICES.planLapsed.tone, "warning");

// Only the AXA wait blocks the onboarding tasks. The dependant notices all say
// "you can still set up your profile", so their cards keep their buttons; the
// wait says the opposite, and a notice that blocks has to be the reason both
// cards go Later.
const blocking = Object.entries(PLAN_NOTICES).filter(([, n]) => n.blocksTasks);
assert.deepEqual(blocking.map(([k]) => k), ["policyValidating"]);
// AXA's own wording, 27 Aug. Pinned on the two facts a patient acts on: what
// is wrong, and when to come back.
assert.ok(PLAN_NOTICES.policyValidating.paragraphs[0].includes("not yet live"));
assert.ok(PLAN_NOTICES.policyValidating.paragraphs[0].includes("try again on the start date"));
// The heading has to agree with the paragraph under it.
assert.ok(!/validat/i.test(PLAN_NOTICES.policyValidating.title), "the title still says validating over a not-live body");

// The two pending variants differ only by the credit-back paragraph
assert.equal(PLAN_NOTICES.dependantPending.title, PLAN_NOTICES.dependantPendingShort.title);
assert.equal(PLAN_NOTICES.dependantPending.paragraphs.length, 3);
assert.equal(PLAN_NOTICES.dependantPendingShort.paragraphs.length, 2);
assert.deepEqual(
  PLAN_NOTICES.dependantPending.paragraphs.slice(0, 2),
  PLAN_NOTICES.dependantPendingShort.paragraphs,
);
assert.ok(PLAN_NOTICES.dependantPending.paragraphs[2].includes("credit back"));

// Every notice that leaves the tasks open tells the person they can carry on in
// the meantime. The blocking one must not: there is no meantime to carry on in.
for (const notice of Object.values(PLAN_NOTICES)) {
  assert.ok(notice.title.length > 0);
  const carriesOn = notice.paragraphs.some((p) => p.includes("pay-as-you-go plan"));
  assert.equal(carriesOn, !notice.blocksTasks, `${notice.title} agrees with its own blocksTasks`);
}

// The lapsed notice is the only one that asks the policyholder to act
assert.ok(PLAN_NOTICES.planLapsed.paragraphs[0].includes("cannot be activated"));

// No em dashes anywhere
for (const notice of Object.values(PLAN_NOTICES)) {
  assert.ok(!notice.title.includes("—"), `no em dash in: ${notice.title}`);
  for (const p of notice.paragraphs) assert.ok(!p.includes("—"), `no em dash in: ${p}`);
}

report("plan-notices");
