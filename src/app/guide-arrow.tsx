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
    group.querySelector<HTMLElement>(":scope > div > button")?.click();
    await sleep(30);
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
      : input.type === "password" ? "Harbour-Sunrise-42"
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

export function GlobalGuideArrow() {
  const [present, setPresent] = useState(false);
  useEffect(() => {
    const tick = window.setInterval(() => {
      const marked = [...document.querySelectorAll<HTMLElement>("[data-guide-primary]")]
        .filter((el) => el.offsetParent !== null && !(el as HTMLButtonElement).disabled);
      setPresent(marked.length > 0);
    }, 350);
    return () => window.clearInterval(tick);
  }, []);
  if (!present) return null;
  return (
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
  );
}
