// The parts every DCA email shares: the 600px card, its textured header block
// and its gradient footer.
//
// THE TITLE IS NOT A PROP ANY MORE. It was, because the two emails disagreed:
// 30 Medium on the invitation against 40 SemiBold on e10 from the design file's
// Email comms page. Marketing's rewrite of the results email replaced e10 and
// put both on the same 30 Bold, so the house style is stated here once instead
// of being passed in twice with the same three values. The greeting props went
// with it: both emails fold the greeting into their opening paragraph now.
//
// The small print is still a prop. The two emails genuinely lead it
// differently, one with a footnote and one with the legal pair alone.

import type { ReactNode } from "react";
import bgTexture from "../assets/email/header-bg.jpg";
import logo from "../assets/email/logo.png";
import social from "../assets/email/social.png";
import { EMAIL_FOOTER } from "./email-copy.ts";

export const WS = "'Work Sans', sans-serif";
export const INK = "#183153";

const TITLE_INK = "#1e3a5f";

export function EmailShell({ smallPrint, padBottom = 15, title, children }: {
  title: string;
  /** The two emails lead their small print differently. */
  smallPrint: string[];
  padBottom?: number;
  children: ReactNode;
}) {
  return (
    <div className="w-full max-w-[600px] mx-auto" style={{ background: "#ffffff", fontFamily: WS }}>
      <div
        className="flex flex-col items-center px-[40px]"
        style={{
          background: "#dae9f5",
          backgroundImage: `url(${bgTexture})`,
          backgroundSize: "100% auto",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          paddingBottom: padBottom,
        }}
      >
        <div className="flex flex-col items-center gap-[24px] w-full py-[40px]">
          <img src={logo} alt="Doctor Care Anywhere" className="w-[180px] h-[57px] object-contain" />
          <p className="text-center font-bold" style={{ fontSize: 30, lineHeight: 1.33, color: TITLE_INK }}>
            {title}
          </p>
        </div>
        <div className="flex flex-col items-center w-full">{children}</div>
      </div>

      {/* The frame's own export: 270deg, and the light stop sits at 168.92% so
          only the first three fifths of the ramp are on the card. That is why
          the band reads as navy lifting to mid blue on the left rather than
          washing out to #70b7ff at one edge. */}
      <div
        className="flex flex-col items-center gap-[16px] px-[32px] py-[40px] w-full"
        style={{ background: "linear-gradient(270deg, #183153 0%, #70b7ff 168.92%)" }}
      >
        <div className="flex flex-col items-center gap-[8px] w-full">
          <p className="font-medium text-center" style={{ fontSize: 24, color: "#ffffff" }}>{EMAIL_FOOTER.heading}</p>
          <p className="text-center" style={{ fontSize: 14, lineHeight: 1.38, color: "#ffffff" }}>
            <span className="underline">{EMAIL_FOOTER.email}</span>
            <br />
            {EMAIL_FOOTER.phone}
          </p>
          <img src={social} alt="" aria-hidden className="w-[140px] h-[40px] object-contain" />
          <div className="flex flex-col gap-[10px] text-center" style={{ fontSize: 8, lineHeight: 1.5, color: "#ffffff" }}>
            {smallPrint.map((line) => <p key={line}>{line}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}
