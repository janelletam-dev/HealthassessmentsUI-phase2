// AXA's support lines, per arm.
//
// TWO NUMBERS, AND THEY ARE PROBABLY TWO LINES, NOT ONE MOVED.
//
// THE TWO DOCUMENTS ARE THE SOURCE OF TRUTH FOR THE NUMBER (Janelle, 28 Aug).
// Not the frames, not AXA's email, not this file. Both were read on 28 Aug:
//
//   HP   0800 169 3965   HP_API_error_messages.xlsx, "DCA Web message" column,
//                        rows 2 (404 RECORD_NOT_FOUND) and 4 (428 Precondition
//                        Required). Rendered on the HP correction screen.
//   LC   01892 169 3965  signup-flows.pdf, GET /plan-summary, the
//                        validationState 3 and 4 message bodies. Also the
//                        Figma mobile Need help card at 2016:100560. Not
//                        rendered anywhere yet.
//
// WHAT SETTLES IT. The two documents carry the SAME message set, word for
// word, and differ only in the number. Compare RECORD_NOT_FOUND against
// validationState 3, and the 428 lapsed message against validationState 4:
// identical sentences, identical hours, 0800 in one and 01892 in the other.
// One number written two ways would not survive being written out twice, in
// two systems, inside otherwise identical strings. Two hotlines would.
//
// I read the shared "169 3965" and the freephone-vs-local prefix as one line
// migrating, and said so. Janelle, 28 Aug: "i think there really is a
// difference between the axa hp and lc hotlines". The documents above bear
// that out, so the migration reading is retired. AXA Health servicing Large
// Corporate schemes on a separate line from individual Health Plan members is
// ordinary.
//
// WHAT THAT CHANGES. 2016:100560 was on the list to be corrected to 0800. It
// comes off that list: if 01892 is the LC line then the card may be right, and
// the frame it sits on is the "no details received from AXA" one, which has no
// HP or LC label. Its number is now the only evidence for which arm that state
// belongs to. Worth confirming with Duncan before anyone edits it.
//
// A constant rather than a literal because the number appears in patient copy,
// and the whole reason it needed settling is that two copies of it had already
// drifted apart. Named per arm so the HP one cannot be reused on LC by
// somebody reaching for "the AXA number".
//
// This is NOT the DCA Patient Experience number, +44 (0)330 088 4980. Different
// team, different hours, unaffected. It is what the LC arm's "Contact us" row
// and the Visio's activate-new-policy page point at.
export const AXA_HP_SUPPORT_PHONE = "0800 169 3965";

/*
 * From AXA's revised sentence, 27 Aug, which is the copy actually rendered.
 *
 * ONE WORD OF DIVERGENCE, deliberate and unresolved. Both source documents
 * write the hours as "Monday to Friday 8am to 8pm AND 9am to 5pm Saturday and
 * Bank Holidays"; AXA's newer sentence uses a comma. Kept as AXA wrote it,
 * because editing a conjunction inside their own revised string is not ours to
 * do, and flagged so the next reader does not think the sheet was misread.
 * LC's hours are the same words in both documents, so if the hotlines really
 * are separate, whether the rotas match is still unconfirmed.
 */
export const AXA_HP_SUPPORT_HOURS =
  "Monday to Friday 8am to 8pm, 9am to 5pm Saturday and Bank Holidays";
