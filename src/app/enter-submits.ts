// Enter in a text field runs the screen's primary action, the way implicit form
// submission would.
//
// Deliberately not a real <form>. Thirty-seven of App.tsx's fifty-nine buttons
// declare no type, and inside a form every one of them becomes a submit button,
// including the dialog close icons. Converting all of them to fix Enter would be
// a far larger and riskier change than the bug.

import type { KeyboardEvent } from "react";

/**
 * The rule, in terms that need no DOM, so it can be tested directly.
 *
 * `defaultPrevented`: a child that already handled Enter wins. The country
 * picker uses Enter to choose an option and must not also submit the screen.
 *
 * `targetTag`: buttons and links keep their own Enter behaviour.
 */
export function shouldSubmit(
  event: { key: string; defaultPrevented: boolean; targetTag: string },
  busy = false,
): boolean {
  if (event.key !== "Enter" || event.defaultPrevented || busy) return false;
  return event.targetTag === "INPUT";
}

/**
 * @param run   the screen's primary action, the same function its main button calls
 * @param busy  mirrors that button's own disabled condition, so Enter cannot
 *              fire a request the button itself would have refused
 */
export function enterSubmits(run: () => void, busy = false) {
  return (e: KeyboardEvent) => {
    const targetTag = (e.target as HTMLElement).tagName;
    if (!shouldSubmit({ key: e.key, defaultPrevented: e.defaultPrevented, targetTag }, busy)) return;
    e.preventDefault();
    run();
  };
}
