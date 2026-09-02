// Where every user-facing string came from.
//
// Four styles were in use at once: a node id beside the string, a node id in
// the file header, a prose comment explaining a deliberate divergence, and
// nothing at all. From the code you could not tell a string lifted from a frame
// from one somebody wrote, which meant answering "how much copy is invented?"
// required redoing the whole audit. This makes it a command.
//
// THE CONVENTION
//
// Every user-facing string must have, within LOOKBACK lines above it, either:
//
//   a Figma node id      e.g. // 1946:149548
//   or the marker NO FRAME, with a reason
//
// A file-header citation does not count. The point is to know which string came
// from which frame, not that the file touched Figma somewhere.
//
//   // 1946:149567, shown against 99/99/9999
//   return "Date of birth is not valid.";
//
//   // NO FRAME. Approved by Janelle 24 Aug; all four Over 18 frames read that
//   // day and none carries an under-age message. Cite a node once one exists.
//   return `You need to be ${minAge} or over to create your own account.`;
//
// The test is a RATCHET, not a gate. It fails when the number of unattributed
// strings goes up, never merely because some remain. New copy has to be
// attributed; existing copy gets attributed as someone touches it.

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const LOOKBACK = 15;
const NODE_ID = /\b\d{3,6}:\d{2,6}\b/;
const NO_FRAME = /NO FRAME/i;

/**
 * A sentence in quotes, starting with a capital and ending in punctuation.
 * Template literals count: interpolated copy is still copy, and missing them
 * is how the first version of this scanner overlooked the too-young message.
 */
const MESSAGE = /"([A-Z][^"\\]{12,240}?[.?!])"|`([A-Z][^`\\]{12,240}?[.?!])`/g;

export type CopyString = { file: string; line: number; text: string; attributed: boolean };

function isComment(line: string): boolean {
  const s = line.trim();
  return s.startsWith("//") || s.startsWith("*") || s.startsWith("/*");
}

export function scanFile(path: string, name: string): CopyString[] {
  const lines = readFileSync(path, "utf8").split("\n");
  const out: CopyString[] = [];
  lines.forEach((line, i) => {
    if (isComment(line)) return;
    for (const m of line.matchAll(MESSAGE)) {
      const context = lines.slice(Math.max(0, i - LOOKBACK), i).join("\n");
      out.push({
        file: name,
        line: i + 1,
        text: m[1] ?? m[2],
        attributed: NODE_ID.test(context) || NO_FRAME.test(context),
      });
    }
  });
  return out;
}

/** Every validation module beside this one. Components are not covered yet. */
export function scanCopy(): CopyString[] {
  const dir = dirname(fileURLToPath(import.meta.url));
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".ts"))
    .filter((f) => !f.endsWith(".test.ts"))
    .filter((f) => f !== "copy-provenance.ts" && f !== "assertions.ts")
    .sort();
  return files.flatMap((f) => scanFile(join(dir, f), f));
}

export function unattributed(all = scanCopy()): CopyString[] {
  return all.filter((s) => !s.attributed);
}
