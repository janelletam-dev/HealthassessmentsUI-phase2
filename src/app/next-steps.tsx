// Your next steps, on FHM: the Advanced Corporate Health Assessment explainer
// on its own page. PM, 10 Sep: "remove the next steps section from the report
// page and make it as a separate page (link for this is red/amber report ->
// reviewer notes)". The explainer itself is unchanged; it moved.
//
// NO FRAME. The reference is the same layout the explainer was built from on
// 4 Sep, so the page wears FHM's results chrome and nothing new.

import { House, CircleUserRound, ArrowLeft } from "lucide-react";
import { FhmNav, WS, PAGE, BLUE } from "./fhm-chrome.tsx";
import { NextStepExplainer } from "./fhm-results.tsx";
import { MockVideo } from "./mock-video.tsx";

export function NextStepsPage({ onBack, onBook }: { onBack: () => void; onBook: () => void }) {
  return (
    <div className="min-h-screen w-full" style={{ background: PAGE, fontFamily: WS }}>
      <FhmNav menu={false} />

      <div className="flex items-center justify-center" style={{ height: 89, background: BLUE }}>
        <div className="flex items-center rounded-[9999px] p-[4px]" style={{ background: "#4871f7" }}>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-[8px] rounded-[9999px] px-[16px] py-[8px] bg-white border-none cursor-pointer text-[16px] leading-[24px]"
            style={{ color: BLUE, fontFamily: WS }}
          >
            <House size={16} strokeWidth={2} />
            Home
          </button>
          <span className="flex items-center gap-[8px] rounded-[9999px] px-[16px] py-[8px] text-[16px] leading-[24px] text-white">
            <CircleUserRound size={16} strokeWidth={2} />
            Profile
          </span>
        </div>
      </div>

      <div className="flex justify-center px-[24px] pt-[36px] pb-[100px]">
        <div className="w-full max-w-[900px] flex flex-col gap-[20px]">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-[8px] w-fit bg-transparent border-none p-0 cursor-pointer text-[15px]"
            style={{ color: BLUE, fontFamily: WS }}
          >
            <ArrowLeft size={16} strokeWidth={2} /> Back to your results
          </button>
          <p className="text-[22px] leading-[30px]" style={{ color: "#111827" }}>Your next steps</p>

          <NextStepExplainer onBook={onBook} />

          {/* PM, 10 Sep: a mock video on "Full health assessment recommended
              and next steps page". Below the content: Janelle, 11 Sep, "the
              contents should be this, you could put the video at the bottom". */}
          <MockVideo title="What happens at an Advanced Corporate Health Assessment" duration="1 min" />
        </div>
      </div>
    </div>
  );
}
