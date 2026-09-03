// The parts every DCA email shares: the 600px card, its textured header block
// and its gradient footer.
//
// Two emails use these now, the invitation from the transactional file and the
// results-ready one from the design file's Email comms page. Their type differs,
// 30 Medium against 40 SemiBold on the title, so that is a prop rather than
// something averaged into one value.

import type { ReactNode } from "react";
import bgTexture from "../assets/email/header-bg.jpg";
import logo from "../assets/email/logo.png";
import social from "../assets/email/social.png";
import { EMAIL_FOOTER } from "./email-copy.ts";

export const WS = "'Work Sans', sans-serif";
export const INK = "#183153";
export const INK_ALT = "#11225a";
export const MUTED = "#5c6975";

export function EmailShell({ title, titleSize, titleWeight, titleColor, greeting, greetingColor, children }: {
  title: string;
  titleSize: number;
  titleWeight: number;
  titleColor: string;
  greeting: string;
  greetingColor: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full max-w-[600px] mx-auto" style={{ background: "#ffffff", fontFamily: WS }}>
      <div
        className="flex flex-col items-center px-[40px] pb-[15px]"
        style={{
          background: "#dae9f5",
          backgroundImage: `url(${bgTexture})`,
          backgroundSize: "100% auto",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-col items-center gap-[24px] w-full py-[40px]">
          <img src={logo} alt="Doctor Care Anywhere" className="w-[180px] h-[57px] object-contain" />
          <p className="text-center" style={{ fontSize: titleSize, lineHeight: 1.26, fontWeight: titleWeight, color: titleColor }}>
            {title}
          </p>
          <p className="text-center font-semibold" style={{ fontSize: 16, color: greetingColor }}>
            {greeting}
          </p>
        </div>
        <div className="flex flex-col items-center w-full">{children}</div>
      </div>

      <div
        className="flex flex-col items-center gap-[16px] px-[32px] py-[40px] w-full"
        style={{ background: "linear-gradient(180deg, #183153 0%, #70b7ff 100%)" }}
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
            {EMAIL_FOOTER.smallPrint.map((line) => <p key={line}>{line}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}
