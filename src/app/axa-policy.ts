// Matching what someone typed against the policy record AXA holds for them.
//
// This is the AXA Health Plan and Large Corporate journey, which Janelle calls
// the majority case. The member signs up, we try to match them against the AXA
// record, and when we cannot we keep the account and ask them to correct their
// details rather than throwing the sign-up away.
//
// Two distinct failures in the file, with different copy:
//
//   2171:121762  the details do not match  ("update your details below")
//   2171:121778  the activation code does not validate ("check your membership
//                documents and update your details so they match")
//
// and one recovery, 2016:100559 / 2097:99790: "Details updated".
//
// HP AND LC DO NOT MATCH THE SAME WAY. From the review repo's problem register
// (docs/prioritised-problems.md, P6, confirmed multi-source 29-30 July 2026 by
// an AXA engineer email, the workshop and a written QA update):
//
//   HP  the API now validates on the FIRST THREE CHARACTERS of both the first
//       and the last name. AXA loosened this. Nickname mapping too.
//   LC  still matches character by character. Untouched. Pushing the HP rules
//       onto LC is an open ask with AXA, and the register calls it a big bet.
//
// So a "Jon" whose record says "Jonathan" passes on HP and fails on LC, which
// is the single sharpest way to show what the LC ask is worth. Date of birth is
// exact on both.
//
// The near-miss helper below marks failures that looser matching would have
// recovered, which is the sizing argument behind that ask.

export type PolicyRecord = {
  firstName: string;
  lastName: string;
  /** DD/MM/YYYY, as the form collects it. */
  dob: string;
};

export type PolicyMatchInput = {
  firstName: string;
  lastName: string;
  dob: string;
};

/** Which AXA product, because the two match names differently. */
export type PolicyPlan = "hp" | "lc";

/**
 * The record AXA holds for the demo member. One record is enough: the journey
 * being shown is "your details do not match ours", and what matters is the
 * mismatch and the recovery, not the size of the directory.
 */
export const DEMO_POLICY_RECORD: PolicyRecord = {
  firstName: "Jane",
  lastName: "Smith",
  dob: "04/07/1990",
};

/** Case and surrounding space are never the real difference. */
function normalise(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/** HP compares the first three characters; LC compares the whole name. */
function nameMatches(typed: string, held: string, plan: PolicyPlan): boolean {
  const a = normalise(typed);
  const b = normalise(held);
  if (plan === "lc") return a === b;
  // A name shorter than three characters has to match whole, or "Jo" would
  // pass against every "Jo..." on file.
  const width = Math.min(3, b.length);
  return a.length >= width && a.slice(0, width) === b.slice(0, width);
}

/**
 * Which fields disagree with the policy record. Empty means it matched.
 *
 * `dobLocked` is for the screen where the date of birth was already confirmed
 * in the dialog and arrives as a locked pill in the band. It is excluded from
 * the comparison there because the copy says "update your details below", and
 * a field the patient cannot reach is not below: leaving it in makes the
 * correction loop unwinnable.
 *
 * It is a flag rather than the caller quietly passing a record whose date of
 * birth already equals the input. That trick has the same effect and says
 * nothing, so the next person to tidy the call site reinstates the bug.
 */
export function policyMismatches(
  input: PolicyMatchInput,
  plan: PolicyPlan = "lc",
  record: PolicyRecord = DEMO_POLICY_RECORD,
  dobLocked = false,
): string[] {
  const wrong: string[] = [];
  if (!nameMatches(input.firstName, record.firstName, plan)) wrong.push("firstName");
  if (!nameMatches(input.lastName, record.lastName, plan)) wrong.push("lastName");
  if (!dobLocked && input.dob.trim() !== record.dob) wrong.push("dob");
  return wrong;
}

export function matchesPolicy(
  input: PolicyMatchInput,
  plan: PolicyPlan = "lc",
  record: PolicyRecord = DEMO_POLICY_RECORD,
  dobLocked = false,
): boolean {
  return policyMismatches(input, plan, record, dobLocked).length === 0;
}

/**
 * Would this have passed on HP but failed on LC? That gap is the LC ask in P6,
 * made visible: same person, same typo, different answer depending on which
 * AXA product they happen to hold.
 */
export function passesOnHpOnly(input: PolicyMatchInput, record: PolicyRecord = DEMO_POLICY_RECORD): boolean {
  return matchesPolicy(input, "hp", record) && !matchesPolicy(input, "lc", record);
}

/**
 * Levenshtein distance, capped: only used to tell "typo" from "different
 * person", so the exact number stops mattering above a couple of edits.
 */
function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const candidate = Math.min(
        prev[j] + 1,
        prev[j - 1] + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      diagonal = prev[j];
      prev[j] = candidate;
    }
  }
  return prev[b.length];
}

/**
 * A near miss is a failure that looser matching would have accepted: every
 * wrong field is within one edit of the record, and the date of birth is
 * either right or transposed (04/07 vs 07/04, the classic UK/US slip).
 *
 * Not wired into the journey. It exists so the prototype can show the size of
 * the prize the audit is arguing for, without changing what actually passes.
 */
export function isNearMiss(input: PolicyMatchInput, record: PolicyRecord = DEMO_POLICY_RECORD): boolean {
  const wrong = policyMismatches(input, "lc", record);
  if (wrong.length === 0) return false;

  for (const field of wrong) {
    if (field === "dob") {
      const [d, m, y] = input.dob.trim().split("/");
      const [rd, rm, ry] = record.dob.split("/");
      const transposed = d === rm && m === rd && y === ry;
      if (!transposed) return false;
    } else {
      const typed = normalise(input[field as "firstName" | "lastName"]);
      const held = normalise(record[field as "firstName" | "lastName"]);
      if (editDistance(typed, held) > 1) return false;
    }
  }
  return true;
}
