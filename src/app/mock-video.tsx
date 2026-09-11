// A stand-in for an embedded video: poster, play button, a caption. PM,
// 10 Sep: "embedding mock video links" inside the invitation email, the next
// steps page and the pharmacy booking confirmation email. The clips are being
// made by the clinical team; nothing plays here, and Janelle, 10 Sep: "the
// video does not need to play".
//
// NO FRAME. Nothing in the file draws a video tile; this is the plainest
// version of one, on the journey's own photography.

import { Play } from "lucide-react";
import poster from "../assets/slide-3-woman.jpg";

const WS = "'Work Sans', sans-serif";

export function MockVideo({ title, duration }: { title: string; duration: string }) {
  return (
    <div
      role="img"
      aria-label={`Video: ${title}, ${duration}`}
      className="w-full rounded-[8px] overflow-hidden"
      style={{ border: "1px solid #e5e7eb", background: "#ffffff", fontFamily: WS }}
    >
      <div className="relative w-full" style={{ aspectRatio: "16 / 9", background: "#0b1f4b" }}>
        {/* The photo is portrait; a 16:9 crop from the centre lands below the
            eyes, so anchor it near the top where the face is. */}
        <img src={poster} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.55, objectPosition: "50% 18%" }} />
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
          style={{ width: 64, height: 64, background: "#ffffff", boxShadow: "0 8px 24px rgba(3,7,18,0.3)" }}
        >
          <Play size={26} color="#135cff" strokeWidth={2.5} fill="#135cff" style={{ marginLeft: 3 }} />
        </span>
        <span
          className="absolute right-[12px] bottom-[10px] rounded-[4px] px-[8px] py-[3px] text-[12px] font-semibold text-white"
          style={{ background: "rgba(3,7,18,0.72)" }}
        >
          {duration}
        </span>
      </div>
      <p className="px-[14px] py-[10px] text-[14px] font-semibold" style={{ color: "#111827" }}>{title}</p>
    </div>
  );
}
