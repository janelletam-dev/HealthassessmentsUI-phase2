// Logging back in to the DCA member account.
//
// NO FRAME. Janelle, 4 Sep: "after showing the report have the user log in to
// their dca account to book their Advanced HA ff up with clinician". The FHM
// session and the DCA account are separate sign-ins, and skipping straight
// from one into the other hid that; this screen makes the boundary visible.
// Styled as the member portal's own chrome, since that is what it guards.
//
// The demo types the account created earlier; any input logs in, because
// there is no backend to check it against.

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Logo } from "./dca-logo.tsx";

const WS = "'Work Sans', sans-serif";
const PURPLE = "#494de3";
const PAGE = "#f4f4f4";
const BLUE = "#135cff";

export function DcaLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: PAGE, fontFamily: WS }}>
      <div className="flex items-center px-[24px] h-[70px]" style={{ background: PURPLE }}>
        <Logo />
      </div>

      <div className="flex-1 flex items-start justify-center pt-[70px] pb-[100px] px-[24px]">
        <div className="bg-white rounded-[8px] w-full max-w-[420px] p-[36px]">
          <p className="text-[26px] font-bold leading-[34px]" style={{ color: "#0b1f4b" }}>Log in</p>
          <p className="text-[14px] leading-[20px] mt-[6px]" style={{ color: "#4b5563" }}>
            Sign in to your Doctor Care Anywhere account.
          </p>

          <label className="block mt-[24px]">
            <span className="text-[12px] font-semibold" style={{ color: "#0f37be" }}>Email address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full rounded-[8px] px-[14px] py-[10px] mt-[6px] text-[14px] outline-none"
              style={{ border: "1px solid #b9daff", fontFamily: WS, color: "#030712" }}
            />
          </label>
          <label className="block mt-[16px]">
            <span className="text-[12px] font-semibold" style={{ color: "#0f37be" }}>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full rounded-[8px] px-[14px] py-[10px] mt-[6px] text-[14px] outline-none"
              style={{ border: "1px solid #b9daff", fontFamily: WS, color: "#030712" }}
            />
          </label>

          <button
            type="button"
            onClick={onLogin}
            data-guide-primary
            className="w-full flex items-center justify-center gap-[8px] rounded-[9999px] px-[16px] py-[12px] mt-[24px] text-[14px] font-semibold cursor-pointer border-none"
            style={{ background: BLUE, color: "#edf6ff" }}
          >
            Log in
            <ChevronRight size={16} color="#edf6ff" strokeWidth={2} />
          </button>

          <p className="text-[13px] font-semibold mt-[18px] text-center" style={{ color: BLUE }}>
            Forgotten your password?
          </p>
        </div>
      </div>
    </div>
  );
}
