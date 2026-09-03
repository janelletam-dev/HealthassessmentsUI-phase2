// Success toast, per the Figma export for 1946:149641.
//
// Tokens are taken from that SVG rather than eyeballed: the 448x80 box, the
// 8px radius, #166534 for the border, icon and both text runs, and 14px/20
// type. The 80px height is 10px padding, a 20px title line and two 20px body
// lines, which is why the padding is 10 and not the 12 used elsewhere.
//
// It lives in components/ rather than App.tsx because payment-screen.tsx needs
// it too and cannot import App.tsx without a cycle.

import { createPortal } from "react-dom";
import { CircleCheckBig } from "lucide-react";

/**
 * How long a success toast stays up before the screen changes under it.
 *
 * Both bodies run to about thirteen words over two lines. At a glance-reading
 * rate that needs roughly three seconds, and 1.6s was measurably too quick to
 * finish the sentence. It is not longer than that because the copy promises
 * the next step, so dwelling on it reads as a stall.
 */
export const TOAST_DWELL_MS = 3000;

/**
 * Success only, and that is a rule the file follows rather than a limitation.
 *
 * Every one of the sixteen Status messaging instances was checked for where it
 * sits. Every success is at frame level, floating over the header: 1946:150231,
 * 2016:100559, 2097:99790, 1836:310658, 1946:149641. Every failure is at x=0
 * inside the content, next to the thing that has to be fixed: 2171:121762,
 * 2171:121778, 2171:121004, 2171:120980, 2197:122108.
 *
 * So a failure never floats. Use InlineWarningBox or InlineErrorBox in App.tsx
 * for those, and do not add an error tone here: it would put the message where
 * the design deliberately does not put it.
 *
 * Colour sampled from the rendered frame, not eyeballed.
 */
const INK = "#166534";
const BG = "#fafefc";

export function Toast({ title, body }: { title: string; body: string }) {
  const ink = INK, bg = BG, Icon = CircleCheckBig;
  // Portalled to the body because the screens render inside a z-10 stacking
  // context, which would trap any z-index here below the z-40 header. The
  // frame shows the toast sitting over that header.
  return createPortal(
    <div
      role="status"
      aria-live="polite"
      // top-[104px]. 64 was inherited from the AXA prototype and lands the
      // toast ON the secondary strip here: measured in the browser, this app's
      // sticky header stack is 92px, 64 for the primary bar plus 28 for the
      // "Already have an account? Log in" strip. 104 clears it with a 12px gap,
      // which is the same gap the frame leaves. Icon is 20px in the frame.
      className="fixed left-1/2 -translate-x-1/2 top-[104px] z-[200] w-full max-w-[448px] px-[16px] sm:px-0 pointer-events-none"
    >
      <div
        className="flex gap-[10px] items-start rounded-[8px] p-[10px]"
        style={{
          background: bg,
          border: `1px solid ${ink}`,
          fontFamily: "'Work Sans', sans-serif",
        }}
      >
        <Icon size={20} color={ink} strokeWidth={1.33333} className="shrink-0" />
        <div className="flex flex-col min-w-0">
          <span className="text-[14px] font-semibold leading-[20px]" style={{ color: ink }}>
            {title}
          </span>
          <p className="text-[14px] leading-[20px]" style={{ color: ink }}>
            {body}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
