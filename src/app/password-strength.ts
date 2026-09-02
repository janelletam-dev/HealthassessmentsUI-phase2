// Password strength meter for Create account.
//
// Section 1787:131151 "Password strength interactions" draws five states:
// empty (no meter), weak, medium, strong, and submit-blocked. The frames are
// marked "(proposal)".
//
// The meter has four segments. The form states the rule as "At least 8
// characters, including uppercase, lowercase, number, and special character",
// which is five conditions, so mixed case counts as one segment. That keeps
// the meter and the helper text describing the same rule, and a full meter
// means exactly what isStrongPassword() already means.

export type Strength = 0 | 1 | 2 | 3 | 4;

export const SEGMENTS = 4;

export type StrengthCriteria = {
  length: boolean;
  mixedCase: boolean;
  number: boolean;
  symbol: boolean;
};

export function criteriaFor(password: string): StrengthCriteria {
  return {
    length: password.length >= 8,
    mixedCase: /[a-z]/.test(password) && /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
}

/** How many of the four segments are filled. Zero means no meter is shown. */
export function strengthOf(password: string): Strength {
  if (!password) return 0;
  const c = criteriaFor(password);
  return (Number(c.length) + Number(c.mixedCase) + Number(c.number) + Number(c.symbol)) as Strength;
}

export type StrengthTone = "none" | "warn" | "good";

export function toneFor(score: Strength): StrengthTone {
  if (score === 0) return "none";
  return score === SEGMENTS ? "good" : "warn";
}

// Colours read from the meter frames rather than guessed.
// 1763:57503 filled segment and 1763:57504 track, weak state
// 1763:57532 filled segment and 1763:57535 track, strong state
export const STRENGTH_COLOURS = {
  warnFill: "#d9990d",
  warnText: "#8c6105",
  goodFill: "#16a34a",
  goodText: "#166534",
  track: "#e5e5e5",
} as const;

export function messageFor(score: Strength): string {
  if (score === 0) return "";
  if (score === SEGMENTS) {
    // 1763:57536
    return "Strong password";
  }
  if (score === 1) {
    // 1763:57507, shown against a one-segment meter
    // 1946:149567 and 1946:149604 draw "Weak password" alone. The advice
    // sentence was invented, and it duplicated the field helper sitting
    // directly above it.
    return "Weak password";
  }
  // 1763:57568, shown against a two-segment meter. The file has no
  // three-segment frame, so it carries this one too: at three the password
  // still fails at least one condition, which is what "almost" means.
  // NO FRAME. "Weak password" and "Strong password" are both read off frames
  // (1946:149567, 1946:149604) and are two words each, so this one almost
  // certainly is too, but no frame showing the middle tier has been opened.
  // Left as-is rather than guessing a third caption to match a pattern.
  return "Almost there. Add a number or a symbol";
}
