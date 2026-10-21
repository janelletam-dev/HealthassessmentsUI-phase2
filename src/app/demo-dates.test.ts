import { check as assert, report } from "./assertions.ts";
import { addDays } from "./demo-dates.ts";

// Across both UK clock changes, a day on is the next date. A 24-hour step
// stayed on 25 Oct 2026 (25 hours long), so dates past it came out a day early.
const day = (d: Date) => d.toDateString();
assert.equal(day(addDays(new Date(2026, 9, 25), 1)), "Mon Oct 26 2026", "clocks back: 25 Oct + 1");
assert.equal(day(addDays(new Date(2027, 2, 28), 1)), "Mon Mar 29 2027", "clocks forward: 28 Mar + 1");
assert.equal(day(addDays(new Date(2026, 9, 21), 12)), "Mon Nov 02 2026", "21 Oct + 12");

report("demo-dates");
