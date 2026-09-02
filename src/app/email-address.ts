// Structural check only: does this look like an email address at all.
// Works the same for work and personal domains, and for single or multi-part
// endings (.com, .co, .co.uk, .nhs.net). It deliberately says nothing about
// whether the address exists; only the CRM lookup can answer that.

const EMAIL_PATTERN =
  /^[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

export function isValidEmail(value: string): boolean {
  const email = value.trim();
  // 254 is the maximum length a real address can be
  if (email.length === 0 || email.length > 254) return false;
  return EMAIL_PATTERN.test(email);
}
