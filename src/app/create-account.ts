// Validation for the Create account step. Kept out of the component so the rules
// are testable, and so the demo states in View states reuse the same shapes.
//
// NOTE: this copy is provisional. It is NOT the AXA Health Plan validation set,
// which the Figma annotation says AXA is still drafting and must not be invented.
// These are the ordinary client-side field checks.

import { isValidEmail } from "./email-address.ts";

export type CreateAccountErrors = {
  firstName?: string;
  lastName?: string;
  dob?: string;
  email?: string;
  password?: string;
  terms?: string;
};

export type CreateAccountInput = {
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  password: string;
  termsChecked: boolean;
};

// DD/MM/YYYY, and a date that actually exists in the calendar.
// Kept as-is: it is the pure calendar check, and dobProblem() builds on it.
export function isValidDob(raw: string): boolean {
  const m = raw.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return false;
  const [, dd, mm, yyyy] = m;
  const day = Number(dd), month = Number(mm), year = Number(yyyy);
  if (month < 1 || month > 12 || day < 1) return false;
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) return false;
  return year >= 1900;
}

// ─── Date of birth, by fault ─────────────────────────────────────────────────
//
// One message for every bad date was wrong: "Please provide your date of birth
// as DD/MM/YYYY." is only true when the shape is wrong. It fired for 99/99/9999
// and 12/31/1990 too, where the user did use DD/MM/YYYY.
//
// The file draws the shape-is-fine-values-are-not case explicitly: 1946:149567
// shows 99/99/9999 in the field with "Date of birth is not valid." beneath it.
// So both strings are real, they just belong to different branches.
//
//   not-a-date   99/99/9999, 31/02/1990, 04/07/1899      1946:149567, 27126:39200
//   future       04/07/2090   accepted outright before.  27126:39237
//   too-young    see MIN_AGE below.                      27126:39274, 27126:39311

export type DobProblem =
  | "missing"
  | "incomplete"
  | "format"
  | "transposed"
  | "not-a-date"
  | "future"
  | "too-young";

/** Someone opening their own account is an adult. */
export const MIN_AGE_ACCOUNT_HOLDER = 18;

/**
 * A 16- or 17-year-old dependant whom the main policy holder has chosen to move
 * onto their own independent account.
 *
 * UNCONFIRMED, with Duncan as of 24 Aug 2026. Neither the concept nor the
 * number is settled: the 16 wording's only frame (27126:39311) sits in a
 * section labelled "⚒️ Proposed", authored by an agent rather than a designer,
 * and the eligibility rule behind it has not been agreed with AXA.
 *
 * Nothing in the app passes `minAge`, so the running prototype always enforces
 * MIN_AGE_ACCOUNT_HOLDER. This constant and its message are reachable from the
 * tests only. Do not wire it to a screen, and do not change either number,
 * until Duncan confirms.
 */
export const MIN_AGE_ASSIGNED_DEPENDANT = 16;

export type DobOptions = {
  /** Defaults to MIN_AGE_ACCOUNT_HOLDER. The 16–17 case is UNCONFIRMED — see MIN_AGE_ASSIGNED_DEPENDANT before passing it. */
  minAge?: number;
  /** Injectable so tests do not drift as real time passes. */
  today?: Date;
};

/** Everything the mask can produce short of a whole date: 0, 04, 04/1, 04/07/199. */
const DOB_PREFIX = /^\d{1,2}(\/\d{1,2}(\/\d{1,3})?)?$/;

function parseDob(raw: string): { day: number; month: number; year: number } | null {
  const m = raw.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  return { day: Number(m[1]), month: Number(m[2]), year: Number(m[3]) };
}

/** Completed years from birth date to `on`, birthday-aware. */
export function ageOn(day: number, month: number, year: number, on: Date): number {
  let age = on.getFullYear() - year;
  const monthDiff = on.getMonth() + 1 - month;
  if (monthDiff < 0 || (monthDiff === 0 && on.getDate() < day)) age -= 1;
  return age;
}

export function dobProblem(raw: string, opts: DobOptions = {}): DobProblem | null {
  const minAge = opts.minAge ?? MIN_AGE_ACCOUNT_HOLDER;
  const today = opts.today ?? new Date();

  if (!raw.trim()) return "missing";

  const parts = parseDob(raw);
  if (!parts) {
    // A prefix of DD/MM/YYYY is someone part-way through typing, not someone
    // using the wrong format. Telling them to use DD/MM/YYYY when they already
    // are was the same defect this file opened the day fixing, one branch over.
    return DOB_PREFIX.test(raw.trim()) ? "incomplete" : "format";
  }
  const { day, month, year } = parts;

  // Day and month the wrong way round: 12/31/1990 is a real date, mis-ordered.
  // 99/99/9999 is not — its day is out of range either way round. Reachable
  // again now the field is one masked box rather than three labelled ones.
  if (month > 12 && day >= 1 && day <= 12) return "transposed";

  if (!isValidDob(raw)) return "not-a-date";

  // Month is 1-indexed here; Date wants 0-indexed.
  const birth = new Date(year, month - 1, day);
  const midnightToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (birth.getTime() > midnightToday.getTime()) return "future";

  if (ageOn(day, month, year, midnightToday) < minAge) return "too-young";

  return null;
}

/**
 * What the date of birth box should show, given whatever is in it.
 *
 * Digits only; the slashes are inserted, never typed. Single digits are padded
 * as soon as they cannot be anything else: no valid day starts 4–9 and no valid
 * month starts 2–9, so those digits can only be a one-digit day or month. That
 * is what makes 4 7 1990 land as 04/07/1990 in six keystrokes.
 *
 * The cost, accepted deliberately on 24 Aug: 12311990 becomes 12/03/1199 rather
 * than 12/31/1990, so a US-order typist gets "Date of birth is not valid."
 * instead of the DD/MM/YYYY hint. The transposed branch in dobProblem still
 * catches the case when a date arrives already separated, e.g. pasted.
 *
 * No trailing slash is added until the next segment has a digit, so backspace
 * walks back through the value instead of stalling against a re-added slash.
 */
export function maskDobInput(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  if (!d) return "";

  let i = 0;
  let day: string;
  if (d[0] >= "4") { day = "0" + d[0]; i = 1; }
  else { day = d.slice(0, 2); i = day.length; }
  if (i >= d.length) return day;

  let month: string;
  if (d[i] >= "2") { month = "0" + d[i]; i += 1; }
  else { month = d.slice(i, i + 2); i += month.length; }
  if (i >= d.length) return `${day}/${month}`;

  return `${day}/${month}/${d.slice(i, i + 4)}`;
}

/**
 * A pasted date keeps its separators but gains zero padding, so 4/7/1998 lands
 * as 04/07/1998, the same as typing those digits.
 *
 * Day and month only, and only when each is already one or two digits. That
 * leaves 12/31/1990 untouched, so it still reaches the transposed branch and
 * the US-order diagnosis is unaffected.
 */
export function padPastedDob(raw: string): string {
  const trimmed = raw.trim();
  const parts = trimmed.split("/");
  if (parts.length !== 3) return trimmed;
  const [day, month, year] = parts;
  if (!/^\d{1,2}$/.test(day) || !/^\d{1,2}$/.test(month)) return trimmed;
  return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
}

export function dobMessage(problem: DobProblem, minAge = MIN_AGE_ACCOUNT_HOLDER): string {
  switch (problem) {
    case "missing":
    case "incomplete":
      // 1946:149548. A half-typed date has not been provided either, so both
      // faults take the framed string. Deliberately NOT a new message: a 26th
      // invented string to say "you are not finished" is worse than reusing a
      // sentence that is already true and already drawn.
      return "Please provide your date of birth.";
    case "format":
    case "transposed":
      // The one date-of-birth string with no frame anywhere in the file. The
      // provenance note on 27126:131790 records that it stays unframed.
      // "transposed" shares it because 12/31/1990 is a format problem, not a
      // value one: the user gave a real date in the wrong order, and telling
      // them the order is what helps.
      return "Please provide your date of birth as DD/MM/YYYY.";
    case "not-a-date":
    case "future":
      // 1946:149567 against 99/99/9999, and 27126:39237 against 04/07/2090.
      // Both faults carry the same message in the file.
      return "Date of birth is not valid.";
    case "too-young":
      // Now framed, in section 27126:39183: 27126:39274 shows the 18 wording
      // against 04/07/2010, and 27126:39311 the 16 wording against 04/07/2011.
      // Read back from both frames 24 Aug and they match this string exactly.
      return `You need to be ${minAge} or over to create your own account.`;
  }
}

// The rule the form states: 8+ chars with upper, lower, number and symbol.
export function isStrongPassword(v: string): boolean {
  return v.length >= 8
    && /[a-z]/.test(v)
    && /[A-Z]/.test(v)
    && /\d/.test(v)
    && /[^A-Za-z0-9]/.test(v);
}

export function validateCreateAccount(
  input: CreateAccountInput,
  opts: DobOptions = {},
): CreateAccountErrors {
  const e: CreateAccountErrors = {};
  if (!input.firstName.trim()) e.firstName = "Please provide your first name.";
  if (!input.lastName.trim()) e.lastName = "Please provide your last name.";

  const dobFault = dobProblem(input.dob, opts);
  if (dobFault) e.dob = dobMessage(dobFault, opts.minAge ?? MIN_AGE_ACCOUNT_HOLDER);

  // 1946:149548 against a blank form, 1946:149567 against "wrong". All four
  // read off the frames on 26 Aug. Every one of these was a paraphrase of the
  // drawn string, and the last was worse than a paraphrase: it printed the
  // field's own helper sentence back as the error, so the same sentence
  // appeared twice under one field.
  if (!input.email.trim()) e.email = "Please provide your email.";
  else if (!isValidEmail(input.email)) e.email = "E-mail address is not a valid e-mail address.";

  if (!input.password) e.password = "Please choose a strong password.";
  else if (!isStrongPassword(input.password))
    e.password = "Password doesn't meet requirements.";

  if (!input.termsChecked) e.terms = "Please accept the Terms and Conditions and Privacy Policy to continue.";
  return e;
}

/**
 * The email is already on an account. 1946:149604 in the Web ALL USERS /
 * general section, where it is a field-level error on Email with the way out
 * in the sentence.
 *
 * NOT the same state as the AXA uniqueness gate at 2392:192903. That one keys
 * on first name, last name, date of birth and the activation code, and draws a
 * red box beside the button. This one keys on the email alone and belongs to
 * every journey, which is why it lives in ALL USERS.
 *
 * Exported because Step 1 has to recognise it: the frame draws "signing in" as
 * a link, and a plain string cannot carry one.
 */
export const EMAIL_ALREADY_REGISTERED =
  "Please continue by signing in or using a different email address.";

// Mistakes a real person actually makes. Each carries the input that caused it,
// so View states shows the bad value in the field rather than an empty form.
const DEMO_INPUTS: Record<string, CreateAccountInput> = {
  missing: { firstName: "", lastName: "", dob: "", email: "", password: "", termsChecked: false },
  invalidDob: { firstName: "Jane", lastName: "Smith", dob: "31/02/1990", email: "jane.smith@gmail.com", password: "Str0ng!pass", termsChecked: true },
  invalidEmail: { firstName: "Jane", lastName: "Smith", dob: "04/07/1990", email: "jane.smith@gmail", password: "Str0ng!pass", termsChecked: true },
  weakPassword: { firstName: "Jane", lastName: "Smith", dob: "04/07/1990", email: "jane.smith@gmail.com", password: "password", termsChecked: true },
  termsNotAccepted: { firstName: "Jane", lastName: "Smith", dob: "04/07/1990", email: "jane.smith@gmail.com", password: "Str0ng!pass", termsChecked: false },
};

/**
 * Failures the FORM cannot produce, because only the server knows them. Kept
 * apart from DEMO_INPUTS on purpose: those run through validateCreateAccount,
 * and running this one through it would return no errors at all. The input
 * here is deliberately valid. That is the whole point of the state.
 */
const DEMO_SERVER_REJECTIONS: Record<string, { input: CreateAccountInput; errors: CreateAccountErrors }> = {
  emailRegistered: {
    // 1946:149604 draws Jane Doe against jane.doe@mail.com.
    input: { firstName: "Jane", lastName: "Doe", dob: "01/01/1990", email: "jane.doe@mail.com", password: "Str0ng!pass", termsChecked: true },
    errors: { email: EMAIL_ALREADY_REGISTERED },
  },
};

export const DEMO_CREATE_ACCOUNT: Record<string, { input: CreateAccountInput; errors: CreateAccountErrors }> = {
  ...Object.fromEntries(
    Object.entries(DEMO_INPUTS).map(([k, input]) => [k, { input, errors: validateCreateAccount(input) }]),
  ),
  ...DEMO_SERVER_REJECTIONS,
};

export const DEMO_CREATE_ACCOUNT_ERRORS: Record<string, CreateAccountErrors> =
  Object.fromEntries(Object.entries(DEMO_CREATE_ACCOUNT).map(([k, v]) => [k, v.errors]));
