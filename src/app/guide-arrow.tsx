// The self-serve guide: floating arrows at the page's mid edges, for screens
// where the next click is not obvious. Janelle, 4 Sep: "show arrows so they
// know what is next? left right mid corner of the page", then "think not only
// on those as they dont know what to click next".
//
// Each screen that needs one wires the arrow to the same action the journey
// expects, so the arrow IS the next step, not a hint beside it.

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WS = "'Work Sans', sans-serif";

// Chevrons only: Janelle, 4 Sep, "no need to show what's next i think". The
// label survives as the aria name.
function Arrow({ side, label, onClick }: { side: "left" | "right"; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      data-guide-back={side === "left" ? "" : undefined}
      data-guide-next={side === "right" ? "" : undefined}
      className="fixed top-1/2 -translate-y-1/2 z-[500] flex items-center justify-center cursor-pointer border-none rounded-full size-[46px]"
      style={{
        [side]: 18,
        background: "rgba(3,7,18,0.78)",
        color: "#ffffff",
        fontFamily: WS,
        boxShadow: "0 8px 24px rgba(3,7,18,0.25)",
        backdropFilter: "blur(3px)",
      }}
    >
      {side === "left" ? <ChevronLeft size={20} strokeWidth={2.5} /> : <ChevronRight size={20} strokeWidth={2.5} />}
    </button>
  );
}

export function GuideArrow({ onNext, nextLabel = "Next", onBack, backLabel = "Back" }: {
  onNext?: () => void;
  nextLabel?: string;
  onBack?: () => void;
  backLabel?: string;
}) {
  return (
    <>
      {onBack && <Arrow side="left" label={backLabel} onClick={onBack} />}
      {onNext && <Arrow side="right" label={nextLabel} onClick={onNext} />}
    </>
  );
}

/*
 * The global next arrow. Janelle, 4 Sep: "for the self serve just show an
 * arrow please on all the pages". Screens mark their primary action with
 * data-guide-primary, and this one arrow follows the mark: on forms it is
 * the submit, on tick-lists the tile, on the date picker whichever choice
 * comes next. Pressing it presses the marked control, so an unfilled form
 * answers with its own validation, which is the honest guidance.
 */
const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

function setNativeValue(el: HTMLInputElement | HTMLSelectElement, value: string) {
  const proto = el instanceof HTMLSelectElement ? window.HTMLSelectElement.prototype : window.HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

const visible = (el: Element) => (el as HTMLElement).offsetParent !== null;

/*
 * The happy path, pressed into one arrow. Janelle, 4 Sep: "no need for the
 * error messages.. just go through happy path". Before pressing the screen's
 * primary, the arrow completes the screen the way the walkthrough would:
 * demo values into empty fields, first options into unanswered choices, the
 * address and GP pickers walked. A viewer clicking only the arrow never
 * meets a validation message.
 */
async function completeScreen() {
  // Choice cards and toggles that gate fields: sex at birth, the provide-
  // details radio cards, the terms tick (only when unticked; aria-checked
  // says so).
  for (const label of ["Female", "I want to provide"]) {
    const match = [...document.querySelectorAll<HTMLElement>("button")].filter(visible)
      .find((b) => b.innerText.trim().startsWith(label));
    if (match) { match.click(); await sleep(250); }
  }
  const terms = [...document.querySelectorAll<HTMLElement>('[role="checkbox"][aria-checked="false"]')].filter(visible)
    .find((b) => b.innerText.includes("I agree to the Terms"));
  if (terms) { terms.click(); await sleep(200); }

  // Questionnaire-style groups: first option each.
  const groups = [...document.querySelectorAll<HTMLElement>("div")].filter(
    (d) => d.querySelector(":scope > p") && d.querySelector(":scope > div > button") && visible(d),
  );
  for (const group of groups) {
    // A group is a choice: two or more option buttons, which is what the
    // questionnaires' rows are (aria-pressed). Anything else that shares the
    // shape (helper <p>, wrapper div > button) is left alone: the password
    // field's eye, which turned the input into plain text and lost the
    // password (Janelle, 10 Sep: "you do not need the unhappy / error path"),
    // and the code screen, where Change number sat first and every press
    // sent the code again.
    const options = [...group.querySelectorAll<HTMLElement>(":scope > div > button[aria-pressed]")].filter((b) => b.innerText.trim());
    if (options.length < 2) continue;
    options[0].click();
    await sleep(30);
  }
  // Required tick-box questions (the advanced questionnaire's Diagnosed
  // Conditions, say): one tick each, or Submit refuses the form.
  for (const group of groups) {
    if (!group.querySelector(":scope > p")?.textContent?.trim().endsWith("*")) continue;
    const box = group.querySelector<HTMLElement>(':scope > div > [role="checkbox"][aria-checked="false"]');
    if (box) { box.click(); await sleep(30); }
  }

  // Empty fields, valued by placeholder or aria; numbers get plausible vitals.
  const numbers = ["168", "72", "80"];
  let numberSeq = 0;
  for (const input of [...document.querySelectorAll<HTMLInputElement>("input")].filter(
    (i) => visible(i) && !i.value && ["text", "email", "tel", "number", "password"].includes(i.type),
  )) {
    const ph = input.getAttribute("placeholder") ?? "";
    const aria = input.getAttribute("aria-label") ?? "";
    const value =
      input.type === "number" ? numbers[numberSeq++ % numbers.length]
      : aria.includes("Verification code") ? "123456"
      : ph.includes("Email Address") || ph.includes("jane.doe") ? "jane.smith@mail.com"
      : input.type === "password" ? "Demo123!"
      : ph.includes("e.g., Jane") ? "Jane"
      : ph.includes("e.g., Smith") ? "Smith"
      : ph.includes("W1W 8QB") ? "W1W 8QB"
      : ph.includes("NHS number") ? "4857773456"
      : ph.includes("Jane Smith") ? "Peter Smith"
      : ph.includes("07123") ? "07700 900456"
      : ph.includes("DD/MM/YYYY") ? "01/01/1981"
      : ph.includes("Great Portland") ? "19 Great Portland Street"
      : ph.includes("London") ? "London"
      : ph.includes("Flat") || ph.includes("Select") ? ""
      : "Demo";
    if (!value) continue;
    setNativeValue(input, value);
    await sleep(60);
  }

  for (const select of [...document.querySelectorAll<HTMLSelectElement>("select")].filter(visible)) {
    if (select.selectedIndex <= 0 && select.options.length > 1) {
      setNativeValue(select, select.options[1].value);
      await sleep(60);
    }
  }

  // Drawn pickers: the GP lookup and the DsSelects, walked to a first option.
  const finder = [...document.querySelectorAll<HTMLElement>("button, [role=button]")].filter(visible)
    .find((b) => (b.getAttribute("aria-label") ?? "").includes("Find address"));
  if (finder && !document.querySelector('[role="option"]')) {
    finder.click();
    await sleep(700);
  }
  const picker = [...document.querySelectorAll<HTMLElement>("button, input")].filter(visible)
    .find((el) => ((el as HTMLInputElement).placeholder ?? el.innerText ?? "").includes("Select an "));
  if (picker) {
    picker.click();
    (picker as HTMLElement).focus();
    picker.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    await sleep(450);
    const option = [...document.querySelectorAll<HTMLElement>('[role="option"]')].filter(visible)[0];
    if (option) {
      (option.querySelector("button") ?? option).click();
      await sleep(250);
    }
  }
}

/*
 * The global back arrow. Janelle, 10 Sep: "the back arrow on each page", then
 * "could they go back one page please and not back to the start?". So it
 * presses the screen's own back control first, marked data-guide-back-target
 * (Previous in the profile steps, Change number, the booking links), the way
 * the right arrow presses data-guide-primary. Only when the screen has none
 * does it ask App, over "guide:back", for the phase before this one; App
 * keeps that list and says over "guide:history" whether there is one.
 */
function backTarget() {
  return [...document.querySelectorAll<HTMLElement>("[data-guide-back-target]")]
    .find((el) => el.offsetParent !== null && !(el as HTMLButtonElement).disabled);
}

export function GlobalGuideArrow() {
  const [present, setPresent] = useState(false);
  const [canBack, setCanBack] = useState(false);
  const [ownBack, setOwnBack] = useState(false);
  const [ownNext, setOwnNext] = useState(false);
  const [target, setTarget] = useState(false);
  useEffect(() => {
    const tick = window.setInterval(() => {
      const marked = [...document.querySelectorAll<HTMLElement>("[data-guide-primary]")]
        .filter((el) => el.offsetParent !== null && !(el as HTMLButtonElement).disabled);
      setPresent(marked.length > 0);
      // A screen with its own left arrow (the clinician's queue and detail)
      // keeps it; two arrows in the same spot would be one too many.
      setOwnBack([...document.querySelectorAll("[data-guide-back]")].some((el) => !el.closest("[data-guide-global]")));
      // Likewise a screen's own right arrow: the sleep guide's, say, which
      // carries the story to the amber result. Janelle, 10 Sep: "i am looping".
      setOwnNext([...document.querySelectorAll("[data-guide-next]")].some((el) => !el.closest("[data-guide-global]")));
      setTarget(backTarget() !== undefined);
    }, 350);
    const onHistory = (e: Event) => setCanBack(Boolean((e as CustomEvent<boolean>).detail));
    window.addEventListener("guide:history", onHistory);
    return () => { window.clearInterval(tick); window.removeEventListener("guide:history", onHistory); };
  }, []);
  return (
    <>
      {(canBack || target) && !ownBack && (
        <span data-guide-global>
          <Arrow
            side="left"
            label="Back"
            onClick={() => {
              const own = backTarget();
              if (own) { own.scrollIntoView({ block: "center", behavior: "smooth" }); own.click(); return; }
              window.dispatchEvent(new CustomEvent("guide:back"));
            }}
          />
        </span>
      )}
      {present && !ownNext && (
        <span data-guide-global>
        <Arrow
          side="right"
          label="Next"
          onClick={async () => {
            await completeScreen();
            const el = [...document.querySelectorAll<HTMLElement>("[data-guide-primary]")]
              .find((candidate) => candidate.offsetParent !== null && !(candidate as HTMLButtonElement).disabled);
            if (!el) return;
            el.scrollIntoView({ block: "center", behavior: "smooth" });
            el.click();
          }}
        />
        </span>
      )}
    </>
  );
}
