// The DCA to Full Health Medical handover.
//
// NO FRAME. Janelle, 4 Sep: "from the DCA change to FHM portal can you please
// show like an SSO being done in the background". Nothing in 5066:125326 draws
// this step, so it is invention, kept to what the request describes.
//
// It exists because the next screen is somebody else's platform. Profile
// complete says Full Health Medical will run the assessment, then the chrome
// changes completely: different nav, different colours, no DCA footer. Without
// a beat in between, that reads as the prototype breaking rather than as a
// sign-in the patient never has to do. This is the beat.
//
// Neither brand's page on purpose. It is the moment between the two, so it
// carries both marks and belongs to neither.

import { useEffect, useRef } from "react";
import { Lock } from "lucide-react";
import logo from "../assets/email/logo.png";

const WS = "'Work Sans', sans-serif";
const PAGE = "#f9fafb";
const INK = "#1f2937";
const MUTED = "#6b7280";
const BLUE = "#135cff";

const DWELL_MS = 2400;

export function SsoHandover({ onDone }: { onDone: () => void }) {
  // Held in a ref so an inline arrow at the call site cannot restart the timer
  // on an unrelated re-render.
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    const timer = window.setTimeout(() => done.current(), DWELL_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full px-[24px]"
      style={{ background: PAGE, fontFamily: WS }}
    >
      <div className="flex items-center gap-[20px]">
        <img src={logo} alt="Doctor Care Anywhere" className="h-[44px] object-contain" />

        {/* Three dots travelling left to right, so the direction of the handover
            is legible without any copy saying it. */}
        <div className="flex items-center gap-[6px]">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-[6px] rounded-full animate-pulse"
              style={{ background: BLUE, animationDelay: `${i * 200}ms`, animationDuration: "1200ms" }}
            />
          ))}
        </div>

        <p className="font-semibold text-[16px] leading-[24px]" style={{ color: INK }}>
          Full Health Medical
        </p>
      </div>

      <p className="font-semibold text-[20px] leading-[28px] text-center mt-[32px]" style={{ color: INK }}>
        Signing you in to Full Health Medical
      </p>
      <p className="text-[14px] leading-[20px] text-center mt-[8px]" style={{ color: MUTED }}>
        You do not need to enter anything. This takes a few seconds.
      </p>

      <div className="flex items-center gap-[8px] mt-[24px]">
        <Lock size={14} color={MUTED} strokeWidth={2} aria-hidden />
        <p className="text-[13px] leading-[18px]" style={{ color: MUTED }}>
          Your details are passed securely. Your answers stay with your clinician.
        </p>
      </div>
    </div>
  );
}
