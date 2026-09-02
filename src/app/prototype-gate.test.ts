// The Basic Auth gate in front of the deployed prototype. Lives in
// middleware.ts at the repo root, because that is where Vercel looks for it.

import { check as assert, report } from "./assertions.ts";
import { passwordFrom, isAuthorised } from "../../middleware.ts";

const encode = (user: string, pass: string) =>
  "Basic " + Buffer.from(`${user}:${pass}`, "utf-8").toString("base64");

const SECRET = "correct horse battery staple";

// ─── Extracting the password ────────────────────────────────────────────────

assert.equal(passwordFrom(encode("anyone", SECRET)), SECRET, "reads the password out");
assert.equal(passwordFrom(encode("", SECRET)), SECRET, "an empty username is still fine");

// The username is deliberately ignored: one shared secret, not two.
for (const user of ["dca", "janelle", "", "someone-else"]) {
  assert.ok(isAuthorised(encode(user, SECRET), SECRET), `any username works: "${user}"`);
}

// A password may contain colons, so only the first one separates the pair.
const colonPass = "a:b:c";
assert.equal(passwordFrom(encode("user", colonPass)), colonPass, "splits on the first colon only");
assert.ok(isAuthorised(encode("user", colonPass), colonPass), "and a colonned password authorises");

// Non-ASCII survives the base64 round trip rather than being mangled by atob.
const utf8Pass = "påsswörd–é";
assert.equal(passwordFrom(encode("user", utf8Pass)), utf8Pass, "UTF-8 decodes correctly");

// ─── Refusing everything else ───────────────────────────────────────────────

assert.equal(passwordFrom(null), null, "no header at all");
assert.equal(passwordFrom(""), null, "empty header");
assert.equal(passwordFrom("Bearer abc123"), null, "wrong scheme");
assert.equal(passwordFrom("Basic"), null, "scheme with no payload");
assert.equal(passwordFrom("Basic !!!not-base64!!!"), null, "malformed base64 does not throw");
assert.equal(passwordFrom("Basic " + Buffer.from("nocolon").toString("base64")), null, "no colon means no pair");

assert.ok(!isAuthorised(null, SECRET), "an anonymous request is refused");
assert.ok(!isAuthorised(encode("user", "wrong"), SECRET), "a wrong password is refused");
assert.ok(!isAuthorised(encode("user", ""), SECRET), "an empty password is refused");

// The comparison is on the whole string, not a prefix, and not a suffix.
assert.ok(!isAuthorised(encode("user", SECRET.slice(0, -1)), SECRET), "a prefix of the password is refused");
assert.ok(!isAuthorised(encode("user", SECRET + "x"), SECRET), "the password plus a character is refused");
assert.ok(!isAuthorised(encode("user", SECRET.toUpperCase()), SECRET), "the comparison is case-sensitive");
assert.ok(!isAuthorised(encode("user", " " + SECRET), SECRET), "leading whitespace is not trimmed away");

// Scheme name is matched case-insensitively, per RFC 7617.
assert.ok(isAuthorised("basic " + encode("u", SECRET).split(" ")[1], SECRET), "lowercase scheme is accepted");
assert.ok(isAuthorised("BASIC " + encode("u", SECRET).split(" ")[1], SECRET), "uppercase scheme is accepted");

report("prototype-gate");
