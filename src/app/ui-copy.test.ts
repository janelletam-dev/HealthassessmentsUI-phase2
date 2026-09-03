// Janelle's standing rule: no em dashes in anything a person reads on screen.
// Comments are fine, so this checks source lines that carry UI text.
import { check as assert, report } from "./assertions.ts";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL(".", import.meta.url).pathname;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    if (!/\.tsx?$/.test(entry.name) || entry.name.endsWith(".test.ts")) return [];
    return [full];
  });
}

// Returns, for each line, whether it is inside a comment. Block comments span
// lines, so a single-line test is not enough.
function commentMask(lines: string[]): boolean[] {
  let open = false;
  return lines.map((line) => {
    const t = line.trim();
    const wasOpen = open;
    if (open) {
      if (t.includes("*/")) open = false;
      return true;
    }
    if (t.startsWith("//")) return true;
    const start = t.indexOf("/*");
    if (start !== -1 && !t.slice(start).includes("*/")) {
      open = true;
      return true;
    }
    return start !== -1 || wasOpen;
  });
}

/*
 * ONE EXEMPTION, and it has to earn its place.
 *
 * email-copy.ts is the invitation email, reproduced verbatim from Figma
 * 354:102. It carries six em dashes. Janelle, 3 Sep: "that's fine that was
 * marketing copy, so for the email it's fine". The rule stands everywhere
 * else; changing those strings locally would make the prototype stop matching
 * the email that actually sends.
 *
 * The two checks under the loop stop this becoming a hole: the file has to
 * exist, and it has to still contain an em dash. Rename it or clean it up and
 * the exemption fails rather than quietly covering something new.
 */
const EXEMPT = ["email-copy.ts"];

const offenders: string[] = [];
const exemptSeen = new Map<string, boolean>();
let scanned = 0;

for (const file of sourceFiles(ROOT)) {
  scanned += 1;
  const exempt = EXEMPT.find((name) => file.endsWith(name));
  if (exempt) {
    exemptSeen.set(exempt, readFileSync(file, "utf8").includes("—"));
    continue;
  }
  const lines = readFileSync(file, "utf8").split("\n");
  const inComment = commentMask(lines);
  lines.forEach((line, i) => {
    // Box-drawing section rules use a different character, leave those alone.
    if (line.includes("─")) return;
    if (!line.includes("—")) return;
    if (inComment[i]) return;
    offenders.push(`${file.replace(ROOT, "")}:${i + 1}: ${line.trim().slice(0, 80)}`);
  });
}

assert.ok(scanned > 0, "found source files to scan");
assert.deepEqual(offenders, [], `em dash in UI copy:\n${offenders.join("\n")}`);

// An exemption for a file that is gone, or that no longer needs one, is a hole
// waiting for the next em dash to fall into.
for (const name of EXEMPT) {
  assert.ok(exemptSeen.has(name), `${name} is exempted but was not found; drop the exemption or fix the name`);
  assert.ok(exemptSeen.get(name), `${name} is exempted but has no em dash left; drop the exemption`);
}

// The check has to be able to fail, or it proves nothing.
assert.deepEqual(commentMask(['  body: "a — b",']), [false], "a string line is scanned");
assert.deepEqual(commentMask(["  // a — b"]), [true], "a line comment is skipped");
assert.deepEqual(
  commentMask(["  {/* one", "     two — three", "     four */}", '  body: "x — y",']),
  [true, true, true, false],
  "a block comment is skipped across every one of its lines",
);

report("ui-copy", `no em dashes across ${scanned} files`);
