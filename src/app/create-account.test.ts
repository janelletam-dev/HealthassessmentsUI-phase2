import { check as assert, report } from "./assertions.ts";
import { maskDobInput, validateCreateAccount, isValidDob, isStrongPassword, DEMO_CREATE_ACCOUNT, DEMO_CREATE_ACCOUNT_ERRORS, EMAIL_ALREADY_REGISTERED, dobProblem, dobMessage, ageOn, MIN_AGE_ACCOUNT_HOLDER, MIN_AGE_ASSIGNED_DEPENDANT, padPastedDob } from "./create-account.ts";

const good = { firstName: "Jane", lastName: "Smith", dob: "04/07/1990", email: "jane@gmail.com", password: "Str0ng!pass", termsChecked: true };
assert.deepEqual(validateCreateAccount(good), {}, "a complete valid form has no errors");

// Dates people actually mistype
assert.ok(isValidDob("04/07/1990"));
assert.ok(isValidDob("29/02/2024"), "leap day is real");
assert.ok(!isValidDob("31/02/1990"), "February has no 31st");
assert.ok(!isValidDob("29/02/2023"), "not a leap year");
assert.ok(!isValidDob("4/7/1990"), "must be zero padded");
assert.ok(!isValidDob("1990-07-04"), "wrong format");
assert.ok(!isValidDob("13/13/1990"), "no 13th month");
assert.ok(!isValidDob(""));

// Password rule as the form states it
assert.ok(isStrongPassword("Str0ng!pass"));
assert.ok(!isStrongPassword("password"), "no upper, digit or symbol");
assert.ok(!isStrongPassword("Passw0rd"), "no symbol");
assert.ok(!isStrongPassword("Pa1!"), "too short");

// Each required field is caught on its own
const empty = validateCreateAccount({ firstName: "", lastName: "", dob: "", email: "", password: "", termsChecked: false });
for (const k of ["firstName", "lastName", "dob", "email", "password", "terms"]) {
  assert.ok((empty as Record<string, string>)[k], `${k} should be flagged when empty`);
}

// Every demo state produces exactly the error it is named for
assert.ok(DEMO_CREATE_ACCOUNT_ERRORS.invalidDob.dob && !DEMO_CREATE_ACCOUNT_ERRORS.invalidDob.email);
assert.ok(DEMO_CREATE_ACCOUNT_ERRORS.invalidEmail.email && !DEMO_CREATE_ACCOUNT_ERRORS.invalidEmail.dob);
assert.ok(DEMO_CREATE_ACCOUNT_ERRORS.weakPassword.password && !DEMO_CREATE_ACCOUNT_ERRORS.weakPassword.email);
assert.ok(DEMO_CREATE_ACCOUNT_ERRORS.termsNotAccepted.terms && !DEMO_CREATE_ACCOUNT_ERRORS.termsNotAccepted.password);
assert.ok(Object.keys(DEMO_CREATE_ACCOUNT_ERRORS.missing).length === 6);

// No em dashes in any user-facing string
for (const state of Object.values(DEMO_CREATE_ACCOUNT_ERRORS)) {
  for (const msg of Object.values(state)) assert.ok(!msg.includes("—"), `no em dash in: ${msg}`);
}

// ─── The email is already on an account (1946:149604) ────────────────────────
// The one create-account failure the form cannot detect, because only the
// server knows it. Everything else in DEMO_CREATE_ACCOUNT is derived by running
// validateCreateAccount over a bad input; this one carries its error directly.
const registered = DEMO_CREATE_ACCOUNT.emailRegistered;
assert.equal(registered.errors.email, EMAIL_ALREADY_REGISTERED);
assert.equal(Object.keys(registered.errors).length, 1, "it faults the email and nothing else");

// THE INPUT IS VALID. That is the point, and it is what the re-raise in
// handleSubmit exists for: run it through the validator and nothing comes back,
// so without that guard the state would be a screenshot you walk straight past.
assert.deepEqual(
  validateCreateAccount(registered.input),
  {},
  "the form cannot fault this input, only the server can",
);

// The way out is a sign-in, so the sentence has to contain the link text that
// Step 1 keys on when it swaps the plain string for a real link.
assert.ok(EMAIL_ALREADY_REGISTERED.includes("signing in"));
assert.ok(EMAIL_ALREADY_REGISTERED.includes("different email address"));

// ─── Date of birth, by fault ─────────────────────────────────────────────────
// A fixed today, so these do not start failing as real time passes.
const TODAY = new Date(2026, 7, 24); // 24 Aug 2026
const on = (dob: string, minAge?: number) => dobProblem(dob, { today: TODAY, minAge });

assert.equal(on(""), "missing");
assert.equal(on("   "), "missing", "whitespace only is still missing");

assert.equal(on("4/7/1990"), "format", "not zero padded");
assert.equal(on("1990-07-04"), "format", "wrong separator and order");
assert.equal(
  on("04/07/90"), "incomplete",
  "a two digit year is a year half typed, not a wrong format",
);

// ─── Incomplete, the most common way to fail ─────────────────────────────────
// Everything the mask can produce short of a whole date. Each is a person
// part-way through typing, so none of them is told to use a format they are
// already using.
for (const partial of ["0", "04", "04/1", "04/07", "04/07/1", "04/07/19", "04/07/199"]) {
  assert.equal(on(partial), "incomplete", `${partial} is unfinished, not misformatted`);
  assert.equal(
    dobMessage(on(partial)!), "Please provide your date of birth.",
    `${partial} reuses the framed string rather than inventing one`,
  );
}
assert.equal(dobMessage("incomplete"), dobMessage("missing"), "no new copy was invented for this");

// Still a format problem: a whole date in the wrong shape is not unfinished.
assert.equal(on("4/7/1990"), "format", "complete, just not zero padded");
assert.equal(on("1990-07-04"), "format", "complete, wrong separator and order");
assert.equal(on("4 July 1990"), "format", "complete, not digits");

assert.equal(on("99/99/9999"), "not-a-date", "the value the file shows in 1946:149567");
assert.equal(on("31/02/1990"), "not-a-date", "February has no 31st");
assert.equal(on("13/13/1990"), "not-a-date", "month 13 does not exist");
assert.equal(
  on("12/31/1990"), "transposed",
  "a real date in US order: reachable again now the field is one box, and only via paste",
);
assert.equal(on("04/07/1899"), "not-a-date", "before the 1900 floor");
assert.equal(on("29/02/2023"), "not-a-date", "not a leap year");

assert.equal(on("04/07/2090"), "future", "was accepted outright before this change");
assert.equal(on("25/08/2026"), "future", "tomorrow");
assert.equal(on("24/08/2026"), "too-young", "today is a real date, just far too recent");

// The 18 gate, and its boundary
assert.equal(on("04/07/2008"), null, "18 already");
assert.equal(on("24/08/2008"), null, "turns 18 today");
assert.equal(on("25/08/2008"), "too-young", "18 tomorrow, so not yet");
assert.equal(on("04/07/2010"), "too-young", "16 on this date");

// The assigned-dependant gate lowers it to 16
assert.equal(on("04/07/2010", MIN_AGE_ASSIGNED_DEPENDANT), null, "16 is enough for an assigned dependant");
assert.equal(on("04/07/2011", MIN_AGE_ASSIGNED_DEPENDANT), "too-young", "15 is not");
assert.equal(MIN_AGE_ACCOUNT_HOLDER, 18);
assert.equal(MIN_AGE_ASSIGNED_DEPENDANT, 16);

// ageOn is birthday-aware
assert.equal(ageOn(24, 8, 2008, TODAY), 18, "birthday is today");
assert.equal(ageOn(25, 8, 2008, TODAY), 17, "birthday is tomorrow");
assert.equal(ageOn(23, 8, 2008, TODAY), 18, "birthday was yesterday");
assert.equal(ageOn(29, 2, 2008, TODAY), 18, "leap day birthday");

// Messages, and which node each came from
assert.equal(dobMessage("missing"), "Please provide your date of birth.");
assert.equal(dobMessage("format"), "Please provide your date of birth as DD/MM/YYYY.");
assert.equal(dobMessage("not-a-date"), "Date of birth is not valid.");
assert.equal(dobMessage("future"), dobMessage("not-a-date"), "a future date is not a valid birth date");
// Both now read back from frames, 27126:39274 and 27126:39311
assert.equal(dobMessage("too-young"), "You need to be 18 or over to create your own account.");
assert.equal(
  dobMessage("too-young", MIN_AGE_ASSIGNED_DEPENDANT),
  "You need to be 16 or over to create your own account.",
);

// validateCreateAccount routes through the ladder and honours minAge
const sixteen = { firstName: "Jane", lastName: "Smith", dob: "04/07/2010", email: "jane@gmail.com", password: "Str0ng!pass", termsChecked: true };
assert.ok(validateCreateAccount(sixteen, { today: TODAY }).dob, "16 is blocked from an ordinary account");
assert.deepEqual(
  validateCreateAccount(sixteen, { today: TODAY, minAge: MIN_AGE_ASSIGNED_DEPENDANT }), {},
  "the same person passes as an assigned dependant",
);
assert.equal(
  validateCreateAccount({ ...sixteen, dob: "99/99/9999" }, { today: TODAY }).dob,
  "Date of birth is not valid.",
);
assert.equal(
  validateCreateAccount({ ...sixteen, dob: "12/31/1990" }, { today: TODAY }).dob,
  "Please provide your date of birth as DD/MM/YYYY.",
  "US order is a format problem: the date is real, the order is not ours",
);

// ─── The mask ────────────────────────────────────────────────────────────────
// Digits in, slashes inserted. Padding fires as soon as a digit cannot be
// anything else, which is what makes 4 7 1990 work in six keystrokes.

const MASK: Array<[string, string, string]> = [
  ["", "", "empty stays empty"],
  ["abc", "", "non-digits are dropped"],
  ["0", "0", "one ambiguous digit waits"],
  ["3", "3", "3 could still be 30 or 31"],
  ["4", "04", "no day starts 4, so it is padded at once"],
  ["9", "09", "same for 9"],
  ["04", "04", "no trailing slash until the month starts"],
  ["041", "04/1", "1 could still be 10, 11 or 12"],
  ["047", "04/07", "no month starts 7, so it is padded at once"],
  ["0471", "04/07/1", "year builds a digit at a time"],
  ["471990", "04/07/1990", "4 7 1990 in six keystrokes"],
  ["04071990", "04/07/1990", "fully typed"],
  ["13041990", "13/04/1990", "the value from the dialog screenshot"],
  ["040719901234", "04/07/1990", "extra digits are ignored"],
  ["04/07/1990", "04/07/1990", "already masked is idempotent"],
  ["04/07/", "04/07", "backspacing a slash does not re-add it"],
  // The accepted cost of greedy padding, 24 Aug: a US-order typist gets a
  // mangled date rather than the DD/MM/YYYY hint.
  ["12311990", "12/03/1199", "12/31/1990 typed bare becomes 12/03/1199"],
];
for (const [input, expected, why] of MASK) {
  assert.equal(maskDobInput(input), expected, `${JSON.stringify(input)}: ${why}`);
}

// What the masked value then means
assert.equal(on("12/03/1199"), "not-a-date", "the mangled result is a value fault, not a format one");
assert.equal(on("12/31/1990"), "transposed", "separated input still reaches the transposed branch");
assert.equal(dobMessage("transposed"), dobMessage("format"), "a swap is a format problem");
assert.equal(maskDobInput("04071990"), "04/07/1990");
assert.equal(on(maskDobInput("471990")), null, "the mask feeds the validator cleanly");
assert.equal(on(maskDobInput("04072010")), "too-young", "and is still age checked");

// ─── Pasting a short date ───────────────────────────────────────────────────
// Typed 4 7 1998 gives 04/07/1998, so a pasted 4/7/1998 must too. Same input,
// same intent, one answer.

assert.equal(padPastedDob("4/7/1998"), "04/07/1998", "a pasted short date is padded");
assert.equal(padPastedDob("4/07/1998"), "04/07/1998", "day only");
assert.equal(padPastedDob("04/7/1998"), "04/07/1998", "month only");
assert.equal(padPastedDob("04/07/1998"), "04/07/1998", "an already padded date is unchanged");
assert.equal(padPastedDob("  4/7/1998  "), "04/07/1998", "surrounding whitespace is trimmed");
assert.equal(dobProblem(padPastedDob("4/7/1998")), null, "and it now validates");

// The US-order branch is untouched: padding leaves this exactly as it was, so
// it still lands on transposed rather than being quietly repaired.
assert.equal(padPastedDob("12/31/1990"), "12/31/1990", "an already two-digit pair is not altered");
assert.equal(dobProblem(padPastedDob("12/31/1990")), "transposed", "and still reads as transposed");

// Anything that is not three slash-separated parts is left for the validator.
for (const raw of ["1990-07-04", "4 July 1990", "04/07", "1/2/3/4", "", "not a date"]) {
  assert.equal(padPastedDob(raw), raw.trim(), `left alone: ${JSON.stringify(raw)}`);
}
assert.equal(padPastedDob("123/7/1998"), "123/7/1998", "a three-digit day is not a day, so it is left alone");

report("create-account");
