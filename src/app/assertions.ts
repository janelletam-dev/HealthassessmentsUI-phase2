// A counting wrapper around node:assert.
//
// Every test file used to end with a hand-written total, e.g. "68 assertions
// passed". Those were literals: nobody recounted them when assertions were
// added, and half the assert calls in these files sit inside loops, so no grep
// would have matched either. The numbers were self-reported and proved nothing.
//
// `check` behaves exactly like `assert` and counts each call. `report` prints
// the real figure. Two lines per test file, and every number after this is
// measured.

import assert from "node:assert/strict";

let count = 0;

/** Drop-in for `assert`, including its methods. Counts every call. */
export const check: typeof assert = new Proxy(assert, {
  apply(target, thisArg, args: unknown[]) {
    count += 1;
    return Reflect.apply(target as (...a: unknown[]) => unknown, thisArg, args);
  },
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver);
    if (typeof value !== "function") return value;
    return (...args: unknown[]) => {
      count += 1;
      return (value as (...a: unknown[]) => unknown).apply(target, args);
    };
  },
});

export function assertionCount(): number {
  return count;
}

export function report(name: string, note?: string): void {
  console.log(`${name}: ${count} assertions passed${note ? `, ${note}` : ""}`);
}
