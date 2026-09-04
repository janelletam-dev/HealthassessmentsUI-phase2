// Booking the GP follow-up on the DCA portal: the appointment to talk the
// advanced results through, not the pharmacy visit that produced them.
// Janelle, 4 Sep: "it's different from the booking demoed - that is with the
// clinic to have the blood works done. this one is after the clinician has
// seen the results of the blood works and would like to have more talk or
// followup."
//
// SOURCES, one per step:
//   Not for emergencies    Figma 5048:40490 (DCA-branded)
//   Select a health category   board 27084:16913 capture 27084:16133
//   Select a health concern    capture 27084:16134 (the Blood Test Review tile)
//   Attach File (Optional)     capture 27084:16135
//   Select date and time       27084:16914 and 27084:17143 (the redesigned
//                              picker: day pills, day-part tabs, Book now)
// The captures are AXA-branded staging; this journey is DCA's, so the chrome
// stays the DCA purple of 5048:40490 throughout, which is also what the
// redesigned picker frames draw.
//
// Janelle, 4 Sep: "just show the health follow up tile for the health concern
// and then follow". The category grid is the capture's, all thirteen tiles
// verbatim, and Health Check Follow-Up is the one that navigates; the concern
// step then offers the capture's single Blood Test Review tile.
//
// DATES AND TIMES ARE DEMO-COHERENT, NOT THE CAPTURE'S. The staging rota
// offers 4:00am GP slots on Mon 1 Jan, which is test data. Here today is
// Fri 18 Sep 2026, the day the advanced results arrived, and the slots run in
// working hours. Structure (four day pills, three day-part tabs with counts,
// a three-column grid, Book now naming the choice) is the frames'.
//
// NO CONFIRMATION FRAME EXISTS on the board (its "Conversion feedback" is an
// exit-intent survey), so the booked state at the end is minimal and invented:
// a tick, the booking, and the way back.

import { useState } from "react";
import {
  ArrowLeft, Info, ChevronRight, ChevronLeft, Check, CircleCheck, Upload,
  ClipboardCheck, FileText, Sunrise, Sun, Sunset,
} from "lucide-react";
import { Logo } from "./dca-logo.tsx";
import appTile from "../assets/portal/app-tile.png";
import { useScrollTop } from "./use-scroll-top.ts";

const WS = "'Work Sans', sans-serif";
const PURPLE = "#494de3";
const STRIP = "#3b3fd8";
const PAGE = "#f4f4f4";
const INK = "#0b1f4b";
const CORAL = "#f07662";
const BLUE = "#135cff";
const TILE_BG = "#aebcf7";
const BORDER = "#d2d2d2";

/*
 * 27084:16133 draws thirteen category tiles. ONE IS KEPT. Janelle, 4 Sep:
 * "just show the health follow up tile for the health concern", repeated as
 * "just show the health follow up tile nothing else". This patient arrived
 * from their assessment results, and a grid of skin, gut and mental-health
 * tiles is another product's front door. The full list lives in the capture
 * for when a general booking entry is built.
 */
const CATEGORIES: { name: string; sub?: string; Icon: typeof ClipboardCheck }[] = [
  { name: "Health Check Follow-Up", Icon: ClipboardCheck },
];

const DAYS = ["Today • Fri, 18 Sep", "Sat, 19 Sep", "Sun, 20 Sep", "Mon, 21 Sep"];
const DAY_PARTS = [
  { label: "Morning (12am – 12pm)", count: 18, Icon: Sunrise },
  { label: "Afternoon (12pm – 5pm)", count: 24, Icon: Sun },
  { label: "Evening (5pm – 12am)", count: 15, Icon: Sunset },
];
// 9:00 to 11:50 in ten-minute steps, the morning tab's eighteen.
const SLOTS = Array.from({ length: 18 }, (_, i) => {
  const h = 9 + Math.floor(i / 6);
  return `${h}:${String((i % 6) * 10).padStart(2, "0")}am`;
});

type Step = "notice" | "category" | "concern" | "attach" | "datetime" | "booked";

function Chrome({ children, onBackStep }: { children: React.ReactNode; onBackStep: () => void }) {
  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: PAGE, fontFamily: WS }}>
      <div className="flex items-center justify-between px-[24px] h-[70px]" style={{ background: PURPLE }}>
        <Logo />
        <div className="flex items-center gap-[10px]">
          <div className="size-[32px] rounded-[16px]" style={{ background: "#00008f", border: "1px solid rgba(255,255,255,0.3)" }} />
          <p className="font-bold text-[14px] text-white">Jane</p>
          <ChevronRight size={14} color="#ffffff" strokeWidth={2.5} />
        </div>
      </div>

      <div className="flex items-center justify-between px-[24px] h-[38px]" style={{ background: STRIP }}>
        <button
          type="button"
          onClick={onBackStep}
          className="flex items-center gap-[8px] bg-transparent border-none cursor-pointer p-0 text-white font-semibold text-[13px]"
          style={{ fontFamily: WS }}
        >
          <ArrowLeft size={14} strokeWidth={2.5} /> Back a step
        </button>
        <p className="flex items-center gap-[6px] text-white font-semibold text-[13px]">
          How appointments work <Info size={14} strokeWidth={2} />
        </p>
      </div>

      <div className="bg-white px-[280px] py-[26px]">
        <p className="text-[36px] font-bold leading-[44px]" style={{ color: INK }}>Book an appointment</p>
      </div>

      <div className="flex justify-center pt-[36px] pb-[80px] flex-1">{children}</div>

      <div className="w-full" style={{ background: PURPLE }}>
        <div className="max-w-[1200px] mx-auto px-[57px] py-[40px] flex items-start">
          <div className="flex items-center gap-[10px]">
            <p className="text-[12px] text-white">Powered by</p>
            <div style={{ transform: "scale(0.72)", transformOrigin: "left center" }}><Logo /></div>
          </div>
          <div className="flex-1" />
          <div className="flex gap-[70px] pr-[100px]">
            <div className="flex flex-col gap-[10px] text-[14px] leading-[24px] text-white">
              <p className="uppercase font-semibold">Service</p>
              <p className="mt-[5px]">Home</p>
              <p>My profile</p>
              <p>About us</p>
            </div>
            <div className="flex flex-col gap-[10px] text-[14px] leading-[24px] text-white">
              <p className="uppercase font-semibold">Our Apps</p>
              <div className="flex items-center gap-[10px] mt-[5px]">
                <img src={appTile} alt="" aria-hidden className="size-[20px] rounded-[4px]" />
                <p>iOS</p>
              </div>
              <div className="flex items-center gap-[10px]">
                <img src={appTile} alt="" aria-hidden className="size-[20px] rounded-[4px]" />
                <p>Android</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full" style={{ background: STRIP }}>
          <div className="max-w-[1200px] mx-auto px-[57px] py-[20px] flex items-center gap-[40px] text-[12px] text-white">
            <p style={{ color: "#c3c5f5" }}>©2025 Doctor Care Anywhere Ltd.</p>
            <p>Terms and conditions</p>
            <p>Privacy</p>
            <div className="flex-1" />
            <p className="flex items-center gap-[6px]">CareQuality Commission <Check size={12} strokeWidth={3} /></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookFollowUp({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<Step>("notice");
  const [slot, setSlot] = useState<string | undefined>(undefined);
  useScrollTop(step);

  const backFrom: Record<Step, () => void> = {
    notice: onBack,
    category: () => setStep("notice"),
    concern: () => setStep("category"),
    attach: () => setStep("concern"),
    datetime: () => { setSlot(undefined); setStep("attach"); },
    booked: onBack,
  };

  return (
    <Chrome onBackStep={backFrom[step]}>
      {step === "notice" && (
        <div className="bg-white rounded-[8px] w-[630px] p-[44px] h-fit">
          <p className="flex items-center gap-[10px] text-[20px] font-bold" style={{ color: INK }}>
            Not for emergencies <Info size={17} color={BLUE} strokeWidth={2} />
          </p>
          <div className="rounded-[6px] px-[16px] py-[14px] mt-[26px]" style={{ background: "#ccdcff" }}>
            <p className="text-[15px] leading-[20px]" style={{ color: "#1f2937" }}>
              Our clinicians cannot assess or treat medical emergencies. If your or your child&rsquo;s symptoms worsen while you are waiting for your appointment, you may need to seek more urgent care. In an emergency, please contact emergency services (111/999) or visit your nearest A&amp;E department.
            </p>
          </div>
          <div className="flex justify-center mt-[34px]">
            <button
              type="button"
              onClick={() => setStep("category")}
              data-guide-primary
              className="flex items-center gap-[10px] rounded-full px-[38px] py-[13px] cursor-pointer border-none"
              style={{ background: CORAL }}
            >
              <span className="text-[16px] font-semibold text-white">Continue</span>
              <ChevronRight size={16} color="#ffffff" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {step === "category" && (
        <div className="bg-white rounded-[8px] w-[720px] p-[36px] h-fit">
          <p className="text-[20px] font-bold" style={{ color: INK }}>Select a health category</p>
          <div className="grid grid-cols-1 gap-[14px] mt-[22px]">
            {CATEGORIES.map(({ name, sub, Icon }) => (
              <button
                key={name}
                type="button"
                onClick={name === "Health Check Follow-Up" ? () => setStep("concern") : undefined}
                data-guide-primary={name === "Health Check Follow-Up" || undefined}
                className="flex items-stretch text-left rounded-[4px] overflow-hidden bg-white p-0"
                style={{ border: `1px solid ${BORDER}`, cursor: name === "Health Check Follow-Up" ? "pointer" : "default", fontFamily: WS }}
              >
                <span className="flex items-center justify-center w-[64px] shrink-0" style={{ background: TILE_BG }}>
                  <Icon size={26} color={INK} strokeWidth={1.6} />
                </span>
                <span className="flex-1 px-[12px] py-[10px] flex flex-col gap-[2px] justify-center">
                  <span className="text-[14px] font-bold leading-[18px]" style={{ color: "#111827" }}>{name}</span>
                  {sub && <span className="text-[12px] leading-[16px]" style={{ color: "#4b5563" }}>{sub}</span>}
                </span>
                <span className="flex items-center pr-[12px]">
                  <ChevronRight size={16} color="#111827" strokeWidth={2} />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "concern" && (
        <div className="bg-white rounded-[8px] w-[560px] p-[36px] h-fit">
          <p className="text-[20px] font-bold" style={{ color: INK }}>Select a health concern</p>
          <button
            type="button"
            onClick={() => setStep("attach")}
            data-guide-primary
            className="flex items-center justify-between text-left rounded-[4px] w-full mt-[22px] px-[16px] py-[12px] cursor-pointer bg-white"
            style={{ border: `1px solid ${BORDER}`, fontFamily: WS }}
          >
            <span className="flex flex-col gap-[2px]">
              <span className="text-[14px] font-bold leading-[18px]" style={{ color: "#111827" }}>Blood Test Review</span>
              <span className="text-[12px] leading-[16px]" style={{ color: "#4b5563" }}>
                Please upload a blood test result to make the most of this appointment.
              </span>
            </span>
            <ChevronRight size={16} color="#111827" strokeWidth={2} className="shrink-0" />
          </button>
        </div>
      )}

      {step === "attach" && (
        <div className="bg-white rounded-[8px] w-[630px] h-fit overflow-hidden">
          <div className="p-[36px]">
            <p className="flex items-center gap-[8px] text-[20px] leading-[28px]" style={{ color: INK }}>
              <span className="font-bold">Attach File</span> (Optional) <Info size={15} color={BLUE} strokeWidth={2} />
            </p>
            <p className="text-[14px] leading-[20px] mt-[14px]" style={{ color: "#374151" }}>
              Uploading a high quality photo or documents relevant to your symptoms helps you get the most out of seeing our clinicians. Photos uploaded should not be of an intimate area even if it is in the problem area.
            </p>
            <button
              type="button"
              className="flex items-center gap-[8px] rounded-full px-[24px] py-[9px] mt-[18px] cursor-pointer bg-white"
              style={{ border: `1.5px solid ${INK}`, fontFamily: WS }}
            >
              <Upload size={14} color={INK} strokeWidth={2} />
              <span className="text-[14px] font-bold" style={{ color: INK }}>Upload file</span>
            </button>
            <p className="text-[12px] leading-[16px] mt-[14px]" style={{ color: "#6b7280" }}>Accepted file types: jpg, jpeg, png, pdf and doc.</p>
            <p className="text-[12px] leading-[16px] mt-[4px]" style={{ color: "#6b7280" }}>Files should not be bigger than 5MB.</p>
          </div>
          <div className="flex justify-center py-[22px]" style={{ borderTop: `1px solid ${BORDER}` }}>
            <button
              type="button"
              onClick={() => setStep("datetime")}
              data-guide-primary
              className="flex items-center gap-[10px] rounded-full px-[38px] py-[12px] cursor-pointer border-none"
              style={{ background: "#0d1c8a" }}
            >
              <span className="text-[15px] font-semibold text-white">Continue</span>
              <ChevronRight size={15} color="#ffffff" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {step === "datetime" && (
        <div className="bg-white rounded-[12px] w-[900px] p-[36px] h-fit relative">
          <div className="flex items-center justify-between">
            <p className="text-[20px] font-bold" style={{ color: "#111827" }}>Select date and time</p>
            <p className="text-[13px] font-semibold" style={{ color: BLUE }}>Preferences</p>
          </div>

          <div className="flex items-center gap-[10px] mt-[22px]">
            <ChevronLeft size={16} color="#9ca3af" strokeWidth={2} />
            {DAYS.map((day, i) => (
              <span
                key={day}
                className="rounded-full px-[20px] py-[9px] text-[13px] whitespace-nowrap"
                style={{
                  border: `${i === 0 ? 2 : 1}px solid ${i === 0 ? BLUE : "#d1d5db"}`,
                  background: i === 0 ? "#eff6ff" : "#ffffff",
                  color: i === 0 ? BLUE : "#4b5563",
                  fontWeight: i === 0 ? 600 : 400,
                }}
              >
                {day}
              </span>
            ))}
            <ChevronRight size={16} color="#f59e0b" strokeWidth={2} />
          </div>

          <div className="flex gap-[26px] mt-[22px]" style={{ borderBottom: "1px solid #e5e7eb" }}>
            {DAY_PARTS.map(({ label, count, Icon }, i) => (
              <div key={label} className="flex flex-col gap-[2px] pb-[8px]" style={{ borderBottom: i === 0 ? `2px solid #111827` : "none" }}>
                <span className="flex items-center gap-[6px] text-[13px]" style={{ color: i === 0 ? BLUE : "#111827", fontWeight: 600 }}>
                  <Icon size={14} strokeWidth={2} /> {label}
                </span>
                <span className="text-[12px]" style={{ color: "#4b5563" }}>{count} times available</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-[12px] mt-[18px] pb-[70px]">
            {SLOTS.map((time) => (
              <button
                key={time}
                type="button"
                data-guide-primary={(!slot && time === "9:20am") || undefined}
                onClick={() => setSlot(time)}
                className="rounded-[8px] py-[12px] text-[14px] cursor-pointer bg-white"
                style={{
                  border: `${slot === time ? 2 : 1}px solid ${slot === time ? BLUE : "#dbeafe"}`,
                  background: slot === time ? "#eff6ff" : "#ffffff",
                  color: slot === time ? BLUE : "#111827",
                  fontWeight: slot === time ? 600 : 400,
                  fontFamily: WS,
                }}
              >
                {time}
              </button>
            ))}
          </div>

          {/* 27084:17143: the pill floats over the grid and names the choice. */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[26px]">
            <button
              type="button"
              disabled={!slot}
              data-guide-primary
              onClick={() => setStep("booked")}
              className="rounded-full px-[60px] py-[13px] text-[15px] font-semibold text-white border-none"
              style={{ background: slot ? BLUE : "#93b8fd", cursor: slot ? "pointer" : "default", fontFamily: WS }}
            >
              {slot ? `Book now for today, ${slot}` : "Book now"}
            </button>
          </div>
        </div>
      )}

      {step === "booked" && (
        <div className="bg-white rounded-[8px] w-[560px] p-[44px] h-fit flex flex-col items-center gap-[16px] text-center">
          <CircleCheck size={56} color="#16a34a" strokeWidth={1.5} />
          <p className="text-[24px] font-bold" style={{ color: INK }}>Appointment booked</p>
          <p className="text-[15px] leading-[22px]" style={{ color: "#374151" }}>
            Your video GP appointment is booked for today, {slot}. Your clinician will have your Advanced Health Assessment results to hand.
          </p>
          <p className="flex items-center gap-[8px] text-[13px]" style={{ color: "#6b7280" }}>
            <FileText size={14} strokeWidth={2} /> Blood Test Review · Health Check Follow-Up
          </p>
          <button
            type="button"
            onClick={onBack}
            data-guide-primary
            className="rounded-full px-[32px] py-[12px] mt-[8px] text-[15px] font-semibold text-white border-none cursor-pointer"
            style={{ background: BLUE, fontFamily: WS }}
          >
            Back to my account
          </button>
        </div>
      )}
    </Chrome>
  );
}
