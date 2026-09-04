// My health assessments, on the DCA side, before the FHM handover.
//
// Figma 5048:37958. Janelle, 4 Sep: "here is the tile for advanced corporate
// ... that would then allow them to book their appointment on the fhm portal".
// So the portal Home tile lands here, and Continue journey, with its external
// link mark, is what actually runs the SSO into Full Health Medical: the
// handover made visible instead of implied.
//
// Everything else on the frame is drawn and inert: Exit, the FAQ links, and
// the cancellation card's Patient Experience links go nowhere yet.

import { ArrowLeft, X, Info, Headphones, ExternalLink } from "lucide-react";
import { Logo } from "./dca-logo.tsx";

const WS = "'Work Sans', sans-serif";
const HEADER = "#334bf6";
const STRIP = "#2f22f1";
const PAGE = "#f4f4f4";
const INK = "#0b1f4b";
const BLUE = "#135cff";

export function MyHealthAssessments({ onContinue, onBack }: { onContinue: () => void; onBack: () => void }) {
  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: PAGE, fontFamily: WS }}>
      <div className="flex items-center justify-between px-[24px] h-[70px]" style={{ background: HEADER }}>
        <Logo />
        <span className="flex items-center gap-[6px] text-white font-semibold text-[14px]">
          Exit <X size={16} strokeWidth={2.5} />
        </span>
      </div>

      <div className="flex items-center justify-between px-[24px] h-[40px]" style={{ background: STRIP }}>
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-[8px] bg-transparent border-none cursor-pointer p-0 text-white font-semibold text-[13px]"
          style={{ fontFamily: WS }}
        >
          <ArrowLeft size={14} strokeWidth={2.5} /> Back a step
        </button>
        <div className="flex items-center gap-[32px] text-white font-semibold text-[13px]">
          <span>Health assessment FAQs</span>
          <span>How health assessments work</span>
        </div>
      </div>

      <div className="bg-white px-[130px] py-[28px]">
        <p className="text-[40px] font-bold leading-[48px]" style={{ color: INK }}>My health assessments</p>
      </div>

      <div className="flex flex-col items-center gap-[24px] pt-[52px] pb-[80px] flex-1">
        <div className="bg-white rounded-[8px] w-[700px] p-[26px]">
          <p className="text-[20px] font-bold leading-[28px]" style={{ color: "#111827" }}>My health assessments</p>
          <div
            className="flex items-center justify-between rounded-[12px] px-[24px] py-[20px] mt-[18px]"
            style={{ border: "1px solid #d7e9ff" }}
          >
            <p className="text-[18px] font-semibold leading-[26px]" style={{ color: INK }}>
              Advanced Corporate Health Assessment
            </p>
            <button
              type="button"
              onClick={onContinue}
              data-guide-primary
              className="flex items-center gap-[8px] rounded-full px-[20px] py-[10px] cursor-pointer border-none"
              style={{ background: BLUE }}
            >
              <span className="text-[13px] font-semibold text-white">Continue journey</span>
              <ExternalLink size={14} color="#ffffff" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[8px] w-[700px] p-[26px] flex items-start justify-between gap-[24px]">
          <div className="flex flex-col gap-[10px]">
            <p className="flex items-center gap-[8px] text-[16px] font-bold" style={{ color: "#111827" }}>
              <Info size={16} color={BLUE} strokeWidth={2} /> Cancelling a health assessment
            </p>
            <p className="text-[14px] leading-[20px]" style={{ color: "#374151" }}>
              Contact our patient experience team to cancel or request a refund.
            </p>
          </div>
          <div className="flex flex-col items-start gap-[12px] shrink-0">
            <p className="flex items-center gap-[8px] text-[15px] font-bold underline" style={{ color: BLUE }}>
              <Headphones size={16} strokeWidth={2} /> Contact Patient Experience
            </p>
            <p className="text-[14px] font-semibold underline" style={{ color: BLUE }}>Health assessment FAQs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
