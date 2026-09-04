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
      onClick={() => {
        const el = [...document.querySelectorAll<HTMLElement>("[data-guide-primary]")]
          .find((candidate) => candidate.offsetParent !== null && !(candidate as HTMLButtonElement).disabled);
        if (!el) return;
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        el.click();
      }}
    />
  );
}
