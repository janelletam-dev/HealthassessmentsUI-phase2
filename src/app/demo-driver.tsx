// The self-driving demo: /demo-fastforward (or ?demo=fastforward).
//
// NO FRAME. Janelle, 4 Sep: "have a prototype url where it shows the animation
// where all the type is being done, like all in fast forward motion ...
// /demo-fastforward so all info are prefilled", plus "zoomed in text for those
// that are needed to be emphasized (like the subject of the email etc)".
//
// HOW IT DRIVES. It does not reach into React state: it types into the real
// inputs and clicks the real buttons, through the native value setter so React
// sees each keystroke. Whatever it can drive, a person can; if a screen breaks,
// the demo breaks with it, which is the point of a demo that runs the app
// rather than a video of it.
//
// The script lives in demo-script.ts. This file is the engine and the overlay:
// the progress badge, the typing caret effect and the zoom card.

import { useEffect, useRef, useState } from "react";
import { DEMO_SCRIPT } from "./demo-script.ts";

/** Janelle, 4 Sep: "/demo-fastforward so all info are prefilled". The path is
    rewritten to the SPA by vercel.json; the query form works everywhere. */
export const IS_DEMO =
  window.location.pathname === "/demo-fastforward" ||
  new URLSearchParams(window.location.search).get("demo") === "fastforward";

const TYPE_MS = 26;

function setNativeValue(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string) {
  const proto = el instanceof HTMLSelectElement
    ? window.HTMLSelectElement.prototype
    : el instanceof HTMLTextAreaElement
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

/*
 * setTimeout, but from a Worker. Chrome throttles page timers to one tick a
 * second when the window is hidden or occluded, which turned the whole run
 * into slow motion the moment another window covered it. Worker timers are
 * exempt, so the demo keeps pace even part-covered or in a background tab.
 */
const timerWorker = new Worker(
  URL.createObjectURL(new Blob(["onmessage = (e) => setTimeout(() => postMessage(e.data), e.data.ms)"], { type: "text/javascript" })),
);
let sleepSeq = 0;
let fillAllNumberSeq = 0;
const sleepers = new Map<number, () => void>();
timerWorker.onmessage = (e: MessageEvent<{ id: number }>) => {
  sleepers.get(e.data.id)?.();
  sleepers.delete(e.data.id);
};
const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    const id = ++sleepSeq;
    sleepers.set(id, resolve);
    timerWorker.postMessage({ id, ms });
  });

async function poll<T>(find: () => T | undefined, timeoutMs = 8000): Promise<T> {
  const started = Date.now();
  for (;;) {
    const found = find();
    if (found !== undefined) return found;
    if (Date.now() - started > timeoutMs) throw new Error("demo: timed out waiting");
    await sleep(120);
  }
}

const visible = (el: Element) => (el as HTMLElement).offsetParent !== null || el.tagName === "IFRAME";

/** The page's text without the driver's own overlay, which otherwise lets a
    scene label satisfy its own waitFor. */
function appText(): string {
  let text = "";
  for (const child of document.body.querySelectorAll<HTMLElement>("#root > *")) {
    if (child.id === "demo-driver-ui") continue;
    text += child.innerText + "\n";
  }
  return text;
}

function findButton(label: string): HTMLElement | undefined {
  const all = [...document.querySelectorAll<HTMLElement>("button, a, [role=button]")].filter(visible);
  return (
    all.find((b) => b.innerText.trim() === label) ??
    all.find((b) => b.innerText.trim().startsWith(label)) ??
    // Icon-only controls carry their name in the aria-label.
    all.find((b) => (b.getAttribute("aria-label") ?? "").includes(label))
  );
}

function findField(match: string): HTMLInputElement | HTMLTextAreaElement | undefined {
  // The OTP field is an opacity-0 input whose boxes are drawn separately, so
  // visibility is judged by layout, which opacity does not remove.
  const fields = [...document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea")].filter(visible);
  const byPlaceholder = fields.find((f) => (f.getAttribute("placeholder") ?? "").includes(match));
  if (byPlaceholder) return byPlaceholder;
  const byAria = fields.find((f) => (f.getAttribute("aria-label") ?? "").includes(match));
  if (byAria) return byAria;
  // Fall back to the label text nearest above the field.
  return fields.find((f) => {
    const wrap = f.closest("div")?.parentElement;
    return wrap ? wrap.textContent?.includes(match) : false;
  });
}

function spotlight(el: HTMLElement, on: boolean) {
  el.style.transition = "box-shadow 300ms ease, transform 300ms ease";
  el.style.boxShadow = on ? "0 0 0 3px #ffb306, 0 0 24px rgba(255,179,6,0.55)" : "";
  el.style.transform = on ? "scale(1.02)" : "";
}

export function DemoDriver() {
  const [scene, setScene] = useState("Starting");
  const [sceneIndex, setSceneIndex] = useState(0);
  const [zoom, setZoom] = useState<string | undefined>(undefined);
  const [failed, setFailed] = useState<string | undefined>(undefined);
  const running = useRef(false);
  // The catch reads these refs, not the state, which a closure would freeze at
  // its first render's values.
  const where = useRef("start");

  useEffect(() => {
    if (running.current) return;
    running.current = true;

    async function run() {
      let scenes = 0;
      for (const [index, step] of DEMO_SCRIPT.entries()) {
        where.current = `step ${index} (${step.kind}${"label" in step ? ` ${step.label}` : "text" in step ? ` ${String(step.text).slice(0, 40)}` : "field" in step ? ` ${step.field}` : ""})`;
        switch (step.kind) {
          case "scene": {
            scenes += 1;
            setScene(step.label);
            setSceneIndex(scenes);
            break;
          }
          case "waitFor": {
            await poll(() => (appText().includes(step.text) ? true : undefined), step.timeoutMs ?? 10000);
            break;
          }
          case "pause": {
            await sleep(step.ms);
            break;
          }
          case "click": {
            const el = await poll(() => findButton(step.label));
            el.scrollIntoView({ block: "center", behavior: "smooth" });
            await sleep(250);
            spotlight(el, true);
            await sleep(300);
            spotlight(el, false);
            el.click();
            // React commits after the handler returns; without this beat the
            // next step queries a DOM the click has not yet changed.
            await sleep(300);
            break;
          }
          case "type": {
            const el = await poll(() => findField(step.field));
            el.scrollIntoView({ block: "center", behavior: "smooth" });
            await sleep(200);
            el.focus();
            spotlight(el, true);
            for (let i = 1; i <= step.text.length; i++) {
              setNativeValue(el, step.text.slice(0, i));
              await sleep(TYPE_MS);
            }
            spotlight(el, false);
            break;
          }
          case "select": {
            const el = await poll(() => {
              const selects = [...document.querySelectorAll<HTMLSelectElement>("select")].filter(visible);
              return selects.find((s) => [...s.options].some((o) => o.text === step.option));
            });
            el.scrollIntoView({ block: "center", behavior: "smooth" });
            await sleep(200);
            spotlight(el, true);
            setNativeValue(el, [...el.options].find((o) => o.text === step.option)!.value);
            await sleep(250);
            spotlight(el, false);
            break;
          }
          case "pdfPage": {
            // Chrome's PDF viewer cannot be scrolled from outside, but it
            // honours #page=N on the src, so the walkthrough turns pages by
            // re-pointing the open viewer. Janelle, 4 Sep: "do a scroll
            // through the pdfs please... most especially the message from
            // their clinician".
            const frame = await poll(() => document.querySelector<HTMLIFrameElement>("iframe") ?? undefined);
            // A fragment-only change does not reload the embedded viewer, so
            // the hash alone left the PDF on page one. The query makes each
            // turn a genuinely new URL, which does.
            const base = frame.src.split("#")[0].split("?")[0];
            frame.src = `${base}?turn=${step.page}#page=${step.page}`;
            await sleep(900);
            break;
          }
          case "jumpPhase": {
            window.dispatchEvent(new CustomEvent("demo:phase", { detail: step.phase }));
            await sleep(400);
            break;
          }
          case "zoom": {
            setZoom(step.text);
            await sleep(step.ms ?? 1900);
            setZoom(undefined);
            await sleep(250);
            break;
          }
          case "pick": {
            // A drawn menu (DsSelect) or the GP autosuggest: open it, then take
            // the first option, which for both is a SelectMenuItem in a
            // role=option list.
            const opener = await poll(() => findButton(step.trigger) ?? findField(step.trigger));
            opener.scrollIntoView({ block: "center", behavior: "smooth" });
            await sleep(200);
            spotlight(opener as HTMLElement, true);
            if (opener instanceof HTMLInputElement) {
              setNativeValue(opener, "");
            }
            (opener as HTMLElement).click();
            (opener as HTMLElement).focus();
            // When the window itself is unfocused, focus() moves activeElement
            // without firing the event React's onFocus listens for. Say it out
            // loud so a focus-opened menu still opens.
            (opener as HTMLElement).dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
            await sleep(350);
            const option = await poll(() => {
              const items = [...document.querySelectorAll<HTMLElement>('[role="option"]')].filter(visible);
              const wanted = step.option ? items.find((i) => i.innerText.includes(step.option!)) : items[0];
              return wanted ?? undefined;
            });
            (option.querySelector("button") ?? option).click();
            spotlight(opener as HTMLElement, false);
            await sleep(200);
            break;
          }
          case "fillAll": {
            // Every visible empty text field, valued by its placeholder; every
            // unset select to its first real option. The map covers the known
            // placeholders; anything unmapped gets a plain word so required
            // validation passes visibly rather than silently.
            const inputs = [...document.querySelectorAll<HTMLInputElement>("input")].filter(
              (i) => visible(i) && !i.value && (i.type === "text" || i.type === "email" || i.type === "tel" || i.type === "number"),
            );
            for (const input of inputs) {
              const ph = input.getAttribute("placeholder") ?? "";
              // Height, weight and waist are the only bare number fields; the
              // exact figures do not matter to the demo, plausibility does.
              if (input.type === "number") {
                const numbers = ["168", "72", "80"];
                const value = numbers[fillAllNumberSeq++ % numbers.length];
                input.scrollIntoView({ block: "center" });
                input.focus();
                spotlight(input, true);
                for (let i = 1; i <= value.length; i++) {
                  setNativeValue(input, value.slice(0, i));
                  await sleep(TYPE_MS * 3);
                }
                spotlight(input, false);
                await sleep(120);
                continue;
              }
              const value =
                ph.includes("W1W 8QB") ? "W1W 8QB"
                : ph.includes("NHS number") ? "4857773456"
                : ph.includes("Jane Smith") ? "Peter Smith"
                : ph.includes("07123") ? "07700 900456"
                : ph.includes("DD/MM/YYYY") ? "01/01/1981"
                : ph.includes("Great Portland") ? "19 Great Portland Street"
                : ph.includes("London") ? "London"
                : ph.includes("Flat") ? ""
                // Drawn menus and autosuggests are pick's job, and typing a
                // stray word into one filters its options down to nothing.
                : ph.includes("Select") ? ""
                : "Demo";
              if (!value) continue;
              input.scrollIntoView({ block: "center" });
              input.focus();
              spotlight(input, true);
              for (let i = 1; i <= value.length; i++) {
                setNativeValue(input, value.slice(0, i));
                await sleep(TYPE_MS);
              }
              spotlight(input, false);
              await sleep(120);
            }
            for (const select of [...document.querySelectorAll<HTMLSelectElement>("select")].filter(visible)) {
              if (select.selectedIndex <= 0 && select.options.length > 1) {
                select.scrollIntoView({ block: "center" });
                setNativeValue(select, select.options[1].value);
                await sleep(200);
              }
            }
            break;
          }
          case "answerAll": {
            // Sweep every visible unanswered question: first option of each
            // radio or tick group, second option of each select. Sequential on
            // a short delay, so the fast-forward is watchable rather than
            // instant.
            const groups = [...document.querySelectorAll<HTMLElement>("div")].filter(
              (d) => d.querySelector(":scope > p") && d.querySelector(":scope > div > button") && visible(d),
            );
            for (const group of groups) {
              const first = group.querySelector<HTMLElement>(":scope > div > button");
              if (!first) continue;
              first.scrollIntoView({ block: "center" });
              first.click();
              await sleep(step.perQuestionMs);
            }
            for (const select of [...document.querySelectorAll<HTMLSelectElement>("select")].filter(visible)) {
              if (select.selectedIndex <= 0 && select.options.length > 1) {
                select.scrollIntoView({ block: "center" });
                setNativeValue(select, select.options[1].value);
                await sleep(step.perQuestionMs);
              }
            }
            break;
          }
        }
      }
      setScene("Demo complete");
    }

    run().catch((error: Error) => {
      setFailed(`${where.current}: ${error.message}`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="demo-driver-ui">
      {/* The progress badge. Bottom left, clear of every screen's own chrome. */}
      <div
        className="fixed bottom-[16px] left-[16px] z-[9999] flex items-center gap-[10px] rounded-[9999px] px-[16px] py-[8px]"
        style={{ background: "rgba(3,7,18,0.85)", backdropFilter: "blur(4px)", fontFamily: "'Work Sans', sans-serif" }}
      >
        <span className="size-[8px] rounded-full animate-pulse" style={{ background: failed ? "#f87171" : "#4ade80" }} />
        <p className="text-[13px] leading-[18px] text-white">
          {failed ? `Demo stopped at ${failed}` : `Fast-forward demo ${sceneIndex ? `· ${sceneIndex}/${DEMO_SCRIPT.filter((s) => s.kind === "scene").length} ` : ""}· ${scene}`}
        </p>
      </div>

      {/* The zoom card: the emphasized text, large, over a dimmed page. */}
      {zoom && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-none" style={{ background: "rgba(3,7,18,0.45)" }}>
          <p
            className="max-w-[720px] px-[40px] py-[28px] rounded-[16px] text-center font-semibold"
            style={{
              background: "#ffffff",
              color: "#030712",
              fontSize: 30,
              lineHeight: "40px",
              fontFamily: "'Work Sans', sans-serif",
              boxShadow: "0 24px 60px rgba(3,7,18,0.35)",
              animation: "demoZoomIn 420ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {zoom}
          </p>
        </div>
      )}
    </div>
  );
}
