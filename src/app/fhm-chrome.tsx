// Full Health Medical's chrome: the white nav, the blue banner and the page
// under them. Not DCA's, on purpose, because FHM runs these screens.
//
// IT LIVES HERE NOW BECAUSE THREE THINGS WEAR IT: the questionnaire, its
// submitted state, and the booking flow. It was inside questionnaire-screen.tsx,
// which the booking flow has no reason to import.
//
// The blue is #135cff, the app's. The booking captures measure #2b5bf6, close
// enough that reproducing both would put two nearly identical blues in one
// journey for no gain.

import type { ReactNode } from "react";
import logo from "../assets/email/logo.png";
import { Menu } from "lucide-react";

export const WS = "'Work Sans', sans-serif";
export const PAGE = "#f9fafb";
export const RULE = "#e5e7eb";
export const NAV_RULE = "#d1d5db";
export const BLUE = "#135cff";
export const INK = "#1f2937";
export const MUTED = "#6b7280";

/** 1512x89 white, bottom rule. The hamburger is FHM's, not a DCA control. */
export function FhmNav({ menu = true }: { menu?: boolean }) {
  return (
    <div
      className="flex items-center justify-between px-[24px] w-full"
      style={{ height: 89, background: "#ffffff", borderBottom: `1px solid ${NAV_RULE}` }}
    >
      <img src={logo} alt="Doctor Care Anywhere" className="h-[57px] object-contain" />
      {menu && <Menu size={24} color={INK} strokeWidth={2} aria-hidden />}
    </div>
  );
}

export function FhmShell({ children, footer, title, subtitle }: {
  children: React.ReactNode;
  footer?: React.ReactNode;
  title: string;
  /** Review & confirm is the only step that runs a line under its title. */
  subtitle?: string;
}) {
  return (
    <div className="min-h-screen w-full" style={{ background: PAGE, fontFamily: WS }}>
      <FhmNav />

      {/* 1512x148, #135cff, title 40 Medium white */}
      <div
        className="flex flex-col items-center justify-center gap-[8px] px-[24px]"
        style={{ minHeight: 148, background: BLUE }}
      >
        <p className="text-center font-medium" style={{ fontSize: 40, lineHeight: "52px", color: "#ffffff" }}>
          {title}
        </p>
        {subtitle && (
          <p className="text-center" style={{ fontSize: 18, lineHeight: "26px", color: "#ffffff" }}>{subtitle}</p>
        )}
      </div>

      <div className="flex justify-center px-[24px] pt-[24px] pb-[140px]">
        <div className="w-full max-w-[744px] flex flex-col gap-[24px]">{children}</div>
      </div>

      {footer}
    </div>
  );
}
