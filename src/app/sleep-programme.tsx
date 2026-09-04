// Your 10 week sleep guide: the team's own page, shown as itself.
//
// Janelle, 4 Sep, in order: "just use the link given by the team", then "i
// still dont see the contents" because the link is a HubSpot preview slug
// behind preview auth, then, with the full-page render in hand, "or just use
// this see it has images". So the page IS her render, photography and all,
// with the prototype's back bar above it and the live link for anyone with
// preview access. When the page publishes, swap the card's target to the
// public URL and this screen can go.

import { ArrowLeft, ExternalLink } from "lucide-react";
import sleepPage from "../assets/portal/sleep-guide-page.jpg";

const WS = "'Work Sans', sans-serif";
const INK = "#0b2a5e";

const LIVE_URL =
  "https://doctorcareanywhere.com/-temporary-slug-d37a2618-78a5-47e0-8f01-92ac33a19f62?hs_preview=rnorZgzz-454684014815";

// Week 1 is published, publicly: Janelle, 4 Sep, "this is week 1". The other
// nine presumably follow the same slug as they publish.
const WEEK_1_URL = "https://doctorcareanywhere.com/your-sleep-reset-week-1";

export function SleepProgramme({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen w-full" style={{ background: "#efe9d8", fontFamily: WS }}>
      <div className="sticky top-0 z-10 flex items-center justify-between px-[24px] py-[12px]" style={{ background: "#efe9d8", borderBottom: "1px solid #ddd5bd" }}>
        <button
          type="button"
          onClick={onBack}
          data-guide-primary
          className="flex items-center gap-[8px] bg-transparent border-none cursor-pointer p-0 text-[13px] font-semibold"
          style={{ color: INK, fontFamily: WS }}
        >
          <ArrowLeft size={14} strokeWidth={2.5} /> Back to my account
        </button>
        <a
          href={LIVE_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-[6px] rounded-full px-[16px] py-[8px] text-[12px] font-semibold"
          style={{ border: `1.5px solid ${INK}`, color: INK, fontFamily: WS }}
        >
          Live page <ExternalLink size={12} strokeWidth={2} />
        </a>
      </div>
      {/* The render, full width, with the published Week 1 article clickable
          where its card sits in the image. The region is measured off the
          1124x2000 render as percentages, so it scales with the image. */}
      <div className="relative w-full max-w-[1240px] mx-auto">
        <img
          src={sleepPage}
          alt="Your 10 week sleep guide: Your Brain After Dark and nine more weekly reads, with the Sleep SOS Toolkit"
          className="w-full block"
        />
        <a
          href={WEEK_1_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Read Week 1: Your Brain After Dark"
          className="absolute block rounded-[12px]"
          style={{ left: "3.1%", top: "21.7%", width: "22%", height: "8.2%" }}
        />
      </div>
    </div>
  );
}
