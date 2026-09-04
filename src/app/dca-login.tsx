// Logging back in to the DCA member account, per the current SSO design.
//
// From the render Janelle sent on 4 Sep out of the MFA-for-clinicians file
// (220:1796, which neither MCP can read directly): a photo on the left, and
// on lavender, a white card with the DCA mark, "Sign in with your email
// address", the two fields, Forgot your password, a full-width Sign in and
// the Sign Up line, with the reference's own photograph on the left
// (pexels-greta-hoffman-7674820, from Janelle's export).
//
// Janelle, 4 Sep: "after showing the report have the user log in to their
// dca account to book their Advanced HA ff up with clinician". Any input
// signs in; there is no backend to check against.

import { useState } from "react";
import { Headphones } from "lucide-react";
import mark from "../assets/dca-mark.png";
import photo from "../assets/login-photo.jpg";

const WS = "'Work Sans', sans-serif";
const BLUE = "#135cff";
const INK = "#111827";

export function DcaLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen w-full flex" style={{ fontFamily: WS }}>
      <div className="hidden md:block w-[44%] shrink-0">
        <img src={photo} alt="" aria-hidden className="w-full h-full object-cover block" style={{ minHeight: "100vh" }} />
      </div>

      <div className="flex-1 flex items-start justify-center pt-[80px] pb-[80px] px-[24px]" style={{ background: "#e2e5f8" }}>
        <div className="bg-white rounded-[8px] w-full max-w-[440px] px-[48px] pt-[20px] pb-[40px] relative" style={{ boxShadow: "0 10px 30px rgba(17,24,39,0.06)" }}>
          <p className="flex items-center gap-[6px] justify-end text-[13px] font-bold" style={{ color: "#3d3ee0" }}>
            <Headphones size={15} strokeWidth={2.2} /> Need help?
          </p>

          <img src={mark} alt="Doctor Care Anywhere" className="h-[42px] mx-auto mt-[14px] block" />

          <p className="text-[22px] font-bold leading-[30px] text-center mt-[14px]" style={{ color: INK }}>
            Sign in with your email address
          </p>

          <label className="block mt-[30px]">
            <span className="text-[14px]" style={{ color: INK }}>Email Address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full rounded-[4px] px-[14px] py-[12px] mt-[8px] text-[14px] outline-none"
              style={{ border: "1px solid #d1d5db", fontFamily: WS, color: INK }}
            />
          </label>
          <label className="block mt-[18px]">
            <span className="text-[14px]" style={{ color: INK }}>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-[4px] px-[14px] py-[12px] mt-[8px] text-[14px] outline-none"
              style={{ border: "1px solid #d1d5db", fontFamily: WS, color: INK }}
            />
          </label>
          <p className="text-[13px] text-right mt-[8px]" style={{ color: "#4b5563" }}>Forgot your password?</p>

          <button
            type="button"
            onClick={onLogin}
            data-guide-primary
            className="w-full rounded-[9999px] py-[13px] mt-[26px] text-[15px] font-semibold cursor-pointer border-none"
            style={{ background: BLUE, color: "#ffffff" }}
          >
            Sign in
          </button>

          <p className="text-[13px] text-center mt-[16px]" style={{ color: "#4b5563" }}>
            Don&rsquo;t have an account? <span className="font-bold" style={{ color: BLUE }}>Sign Up now</span>
          </p>
        </div>
      </div>
    </div>
  );
}
