// The co-logo band, shared by Create account, the code-verified dialog and
// Payment details. It lives here rather than in App.tsx because payment-screen
// cannot import from App.tsx without a cycle, and Payment was carrying a
// hand-rolled copy that drew the wordmark as plain text instead of the logo.

import { Check } from "lucide-react";
import axaHealthLogo from "../assets/logo-axa-health.svg";
import nuffieldHealthLogo from "../assets/logo-nuffield-health.svg";
import dcaSvgPaths from "../../assets/account-plan-svg-paths";

// DCA logo mark — Layer (icon) + Group (wordmark) from Default import
export type AccountPlanBrand = "axa" | "dca" | "nuffield";

function AccountPlanPill({ label }: { label: string }) {
  return (
    <div
      className="flex gap-[4px] items-center justify-center rounded-[9999px] px-[8px] py-[2px] max-w-full"
      style={{ background: "#135cff" }}
    >
      <Check size={12} color="#edf6ff" strokeWidth={2.5} className="shrink-0" />
      <span
        className="text-[11px] font-semibold leading-[14px] truncate"
        style={{ color: "#edf6ff", fontFamily: "'Work Sans', sans-serif" }}
      >
        {label}
      </span>
    </div>
  );
}

/**
 * The co-logo band. `dob` is optional: when the date of birth is already
 * confirmed it is shown here as a second pill instead of being asked for again.
 *
 * 2342:68790, the frame labelled "DoB supplied (shown as a badge)", with the
 * band at 2414:319401. That frame carries two stacked badges and drops the date
 * of birth field from the form entirely. It replaces the earlier note here that
 * no frame drew the pill: one does now, and its wording is "Date of birth
 * confirmed", not the bare "Date of birth" this used to render.
 */
export function AccountPlan({ brand, code, dob }: { brand: AccountPlanBrand; code: string; dob?: string }) {
  const ws = "'Work Sans', sans-serif";
  return (
    <div
      className="flex flex-col gap-[16px] items-center justify-center w-full rounded-[8px] p-[16px]"
      style={{
        background: "#edf6ff",
        border: "1px solid #a2c4ff",
        boxShadow: "0px 4px 3px rgba(15,55,190,0.05), 0px 2px 2px rgba(15,55,190,0.05)",
      }}
    >
      <div className="flex gap-[16px] items-center justify-center w-full">
        {brand === "axa" && (
          <>
            <img src={axaHealthLogo} alt="AXA Health" width={85} height={36} style={{ width: 85, height: 36, flexShrink: 0 }} />
            <DcaPoweredByMark />
          </>
        )}
        {brand === "dca" && <DcaLogoMark />}
        {brand === "nuffield" && (
          <img src={nuffieldHealthLogo} alt="Nuffield Health" width={80} height={36} style={{ width: 80, height: 36, flexShrink: 0 }} />
        )}
      </div>
      {/* Stacked, not side by side: the pair has to wrap at 360px anyway, and
          the code is the primary fact with the date a secondary reassurance. */}
      <div className="flex flex-col gap-[8px] items-center w-full">
        <AccountPlanPill label={`Activation code: ${code}`} />
        {dob && <AccountPlanPill label={`Date of birth confirmed: ${dob}`} />}
      </div>
    </div>
  );
}

// The AXA lockup pairs its logo with a smaller "powered by" DCA mark.
function DcaPoweredByMark() {
  const ws = "'Work Sans', sans-serif";
  return (
    <div className="flex flex-col items-center gap-[2px] shrink-0">
      <span className="text-[7px] font-semibold uppercase tracking-wider" style={{ color: "#6b7280", fontFamily: ws }}>
        Powered by
      </span>
      <div style={{ transform: "scale(0.72)", transformOrigin: "center", height: 26 }}>
        <DcaLogoMark />
      </div>
    </div>
  );
}

function DcaLogoMark() {
  return (
    <div className="relative shrink-0" style={{ width: 123, height: 36 }}>
      {/* icon mark */}
      <div className="absolute" style={{ top: "0.65%", left: "0.04%", right: "10.81%", bottom: 0 }}>
        <svg fill="none" height="35.77" preserveAspectRatio="none" viewBox="0 0 122.932 35.7653" width="122.932">
          <path d={dcaSvgPaths.p2a6c3980} fill="#FFB306" />
          <path d={dcaSvgPaths.p2eda5f80} fill="#FFB306" />
          <path d={dcaSvgPaths.pdf57f0} fill="url(#dca_grad)" />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="dca_grad" x1="5.2374" x2="30.5205" y1="30.5268" y2="5.24374">
              <stop stopColor="#0E73DD" />
              <stop offset="0.18" stopColor="#1684DF" />
              <stop offset="0.47" stopColor="#219AE0" />
              <stop offset="0.74" stopColor="#27A7E2" />
              <stop offset="1" stopColor="#29ABE2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* wordmark */}
      <div className="absolute" style={{ top: "9.87%", left: "29.61%", right: "0.11%", bottom: "7.62%" }}>
        <svg fill="none" height="29.7" preserveAspectRatio="none" viewBox="0 0 96.9004 29.7022" width="96.9">
          <path d={dcaSvgPaths.pedc1e00} fill="#133595" />
          <path d={dcaSvgPaths.p31f94e00} fill="#133595" />
          <path d={dcaSvgPaths.p27ad900} fill="#133595" />
          <path d={dcaSvgPaths.p3bfd2400} fill="#133595" />
          <path d={dcaSvgPaths.p369fbf80} fill="#133595" />
          <path d={dcaSvgPaths.p3de47100} fill="#133595" />
          <path d={dcaSvgPaths.p2ebe5970} fill="#133595" />
          <path d={dcaSvgPaths.p231ab580} fill="#133595" />
          <path d={dcaSvgPaths.pd85ab00} fill="#133595" />
          <path d={dcaSvgPaths.p34382df0} fill="#133595" />
          <path d={dcaSvgPaths.p60abc00} fill="#133595" />
          <path d={dcaSvgPaths.p328c8e00} fill="#133595" />
          <path d={dcaSvgPaths.p3041f280} fill="#133595" />
          <path d={dcaSvgPaths.p33936770} fill="#133595" />
          <path d={dcaSvgPaths.pc2dae00} fill="#133595" />
          <path d={dcaSvgPaths.p2453a200} fill="#133595" />
          <path d={dcaSvgPaths.p12dc1180} fill="#133595" />
          <path d={dcaSvgPaths.p293d8230} fill="#133595" />
        </svg>
      </div>
    </div>
  );
}
