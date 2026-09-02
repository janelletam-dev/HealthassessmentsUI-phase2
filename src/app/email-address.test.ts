import { check as assert, report } from "./assertions.ts";
import { isValidEmail } from "./email-address.ts";

// Personal and work addresses, single and multi-part endings
const valid = [
  "janelle.tamayo1024@gmail.com",
  "someone@yahoo.co.uk",
  "a@hotmail.co",
  "nurse@nhs.net",
  "first.last@doctorcareanywhere.com",
  "team@axa.co.uk",
  "user+tag@gmail.com",
  "name@mail.subdomain.example.org",
  "  spaced@gmail.com  ",
];
for (const v of valid) assert.ok(isValidEmail(v), `should accept ${v}`);

// Broken anatomy
const invalid = [
  "",
  "no-at-sign.com",
  "@gmail.com",
  "name@",
  "name@domain",        // no ending
  "name@domain.c",      // ending too short
  "name@domain..com",   // empty label
  "name@.com",
  ".name@gmail.com",    // leading dot
  "name.@gmail.com",    // trailing dot
  "na me@gmail.com",    // space
  "name@-domain.com",   // label starts with a hyphen
  "name@domain-.com",   // label ends with a hyphen
  "name@@gmail.com",
  "a".repeat(250) + "@gmail.com", // over the length limit
];
for (const v of invalid) assert.ok(!isValidEmail(v), `should reject ${JSON.stringify(v.slice(0, 30))}`);

report("email-address");
