// Full Health Medical's clinician portal, where the CTM approves the patient.
//
// NO FIGMA FRAME. Built from the three staging screenshots Janelle sent on
// 4 Sep (dca-test-domain.fullhealthmedical.com): the Medicals queue filtered to
// Ready for approval, a medical's detail with its flag rows, Files table and
// Approve button, and the organisational Reports dashboard. "that's clinician
// access to FHM portal to approve or reject) before DCA sends and uploads the
// lifestyle / and advanced assessment results", "we will need to have
// organisational report in there too".
//
// WHERE IT SITS. Approval gates the results release, so this beat runs between
// the patient submitting the pre-screen and the results email arriving:
// submitted -> clinician queue -> Jane's medical -> Approve -> results email.
// The same mechanism gates the advanced report; it is shown once, here, rather
// than built twice.
//
// A PERSONA BANNER, WHICH THE REAL PORTAL DOES NOT HAVE. Two people are
// interleaved in one linear demo, and without a label the audience reads this
// as something the patient sees. The amber strip names the switch and is the
// one invented element on these screens.
//
// THE QUEUE'S OTHER ROWS ARE INVENTED PLACEHOLDERS. The screenshot's rows are
// FHM's UAT accounts (Joe Bloggs, BibinUATHAWHone...) and colleagues' test
// names. A queue of one would misread as a system with one patient, so Jane
// sits among plausible rows; none is a real person.
//
// JANE'S FLAGS DERIVE FROM HER OWN PRE-SCREEN REPORT, the renamed PDF: alcohol
// above 14 units and BMI in the overweight range are its two ambers, the rest
// of its sections raise none. Her DOB here is the advanced report's 01/01/1981;
// the pre-screen PDF says 01/01/1972, the sample documents disagree, raised
// with Janelle.

import { useState } from "react";
import {
  Search, Plus, Bell, ChevronDown, ChevronRight, Phone, Download, Info, TriangleAlert, CircleAlert,
} from "lucide-react";
import { useScrollTop } from "./use-scroll-top.ts";
import { GuideArrow } from "./guide-arrow.tsx";

const SYS = "system-ui, -apple-system, 'Segoe UI', sans-serif";
const NAV_BG = "#1b2a38";
const TEAL = "#00a189";
const PAGE = "#f4f6f8";
const INK = "#243746";
const MUTED = "#6b7a88";
const RULE = "#e3e8ed";
const CHIP_BLUE_BG = "#dce8f8";
const CHIP_BLUE_INK = "#3568a8";
const AMBER_BG = "#fdf3d8";
const AMBER_INK = "#8a6d1a";
const GREEN_BG = "#d9f2e3";
const GREEN_INK = "#1e7a4f";

/*
 * The review runs twice, once per report: the pre-screen on 4 Sep and the
 * advanced on 18 Sep. PM via Janelle, 4 Sep: "after adv HA is done, there is
 * a review (approve/dispatch) process again, same as preassessment"; deck
 * step 18 says the same. The advanced stage's reference is the advanced
 * report PDF's own, its product chip and section rows follow the approved
 * advanced medical's screenshot, and its dates track the appointment (16 Sep)
 * and the results email (18 Sep, 08:26).
 */
// Rows, tones, product chips and tags follow FHM's own medical pages, from the
// staging screenshots the PM sent on 10 Sep: the pre-assessment lists six
// "DCA - " sections with Summary on Attention, the Heart Health medical lists
// seven, four red and three amber. Same as the patient's results page, so the
// two sides of the story agree.
const REVIEW_STAGES = {
  prescreen: {
    meta: "01 Jan 1981  (45yo)  Female  -  Ref: DCAPRE7Y2Q4JS8XK  -",
    product: "Pre-assessment",
    date: "04/09/2026",
    reference: "DCAPRE7Y2Q4JS8XK",
    queueDate: "04 Sep 2026",
    queueFlag: "DCA-PRE-ASSESSMENT",
    fileDate: "04 Sep 2026 16:02",
    tags: ["paid", "online"],
    rows: [
      { label: "DCA - Summary", tone: "red" },
      { label: "DCA - Demographics", tone: "info" },
      { label: "DCA - Known Medical Conditions", tone: "info" },
      { label: "DCA - Family History", tone: "amber" },
      { label: "DCA - Lifestyle Factors", tone: "info" },
      { label: "DCA - Body Metrics", tone: "info" },
    ],
  },
  advanced: {
    meta: "01 Jan 1981  (45yo)  Female  -  Ref: UAT1ADV3NFUPZPU9E  -",
    product: "Heart Health",
    date: "18/09/2026",
    reference: "UAT1ADV3NFUPZPU9E",
    queueDate: "18 Sep 2026",
    queueFlag: "DCA-ADVANCED",
    fileDate: "18 Sep 2026 08:00",
    tags: ["paid", "phone_call_required", "online"],
    rows: [
      { label: "QRiSK3", tone: "red" },
      { label: "Blood Pressure", tone: "red" },
      { label: "Body Mass Index", tone: "red" },
      { label: "HbA1c", tone: "red" },
      { label: "Lipid Profile", tone: "amber" },
      { label: "Heart Rate", tone: "amber" },
      { label: "Liver", tone: "amber" },
    ],
  },
} as const;

const ROW_TONES = {
  red: { bg: "#fde2e1", ink: "#a33030", label: "Attention", Icon: TriangleAlert },
  amber: { bg: AMBER_BG, ink: AMBER_INK, label: "Attention", Icon: CircleAlert },
  info: { bg: CHIP_BLUE_BG, ink: CHIP_BLUE_INK, label: "Information", Icon: Info },
} as const;

type ReviewStage = keyof typeof REVIEW_STAGES;

const PATIENT = {
  name: "Jane Smith",
  reviewer: "Bibin Paul",
};

// Jane first, staged; the rest dress the queue.
const QUEUE = [
  { flag: "", tone: "amber", date: "", ref: "", client: "Jane Smith", dob: "01 Jan 1981 (45)", sex: "F", location: "South Kensington", isJane: true },
  { flag: "DCA-PRE-ASSESSMENT", tone: "amber", date: "04 Sep 2026", ref: "DCAPREXVM4UFU98F", client: "George Tyson", dob: "29 Jun 2002 (24)", sex: "M", location: "South Kensington" },
  { flag: "DCA-PRE-ASSESSMENT", tone: "red", date: "03 Sep 2026", ref: "DCAPRELQ4VGCZ44", client: "Branden Nguyen", dob: "29 Jun 1987 (39)", sex: "F", location: "South Kensington" },
  { flag: "Clear", tone: "green", date: "03 Sep 2026", ref: "DCAPRENBGAE9LQZD", client: "Scarlett Carney", dob: "01 Jul 1978 (48)", sex: "F", location: "South Kensington" },
  { flag: "DCA-PRE-ASSESSMENT", tone: "red", date: "02 Sep 2026", ref: "DCAPREMBTCHG2S6Z", client: "Dorian Sandoval", dob: "09 Jun 1992 (34)", sex: "M", location: "South Kensington" },
  { flag: "Clear", tone: "green", date: "02 Sep 2026", ref: "DCAPREHWAGL9TB9E", client: "Alice Green", dob: "30 Jun 1993 (33)", sex: "F", location: "South Kensington" },
];

// Sections as the pre-screen report groups them, statuses from Jane's PDF.
const MENU: [string, string[]][] = [
  ["Clinical", ["Report", "Inputs", "Notes", "Allergies", "Medications", "Referrals", "Results over time"]],
  ["Laboratory", ["Orders", "Results"]],
  ["Financial", ["Orders"]],
  ["Other", ["Change logs", "Past Medicals"]],
];

function FlagChip({ label, tone }: { label: string; tone: string }) {
  const bg = tone === "red" ? "#fbdcdc" : tone === "amber" ? AMBER_BG : GREEN_BG;
  const ink = tone === "red" ? "#a33030" : tone === "amber" ? AMBER_INK : GREEN_INK;
  return (
    <span className="inline-flex items-center gap-[6px] rounded-[3px] px-[8px] py-[2px] text-[11px] font-semibold" style={{ background: bg, color: ink }}>
      <span className="size-[6px] rounded-full" style={{ background: ink }} />
      {label}
    </span>
  );
}

function TopNav({ onReports, onMedicals }: { onReports: () => void; onMedicals: () => void }) {
  return (
    <div className="flex items-center justify-between px-[16px] h-[50px] w-full" style={{ background: NAV_BG }}>
      <div className="flex items-center gap-[24px]">
        {/* FHM's own mark, drawn as its teal square. */}
        <span className="size-[26px] rounded-[4px] flex items-center justify-center" style={{ background: TEAL }}>
          <span className="text-white text-[15px] font-bold leading-none">F</span>
        </span>
        {["Clients", "Schedule", "Medicals", "Reports", "More"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={item === "Reports" ? onReports : item === "Medicals" ? onMedicals : undefined}
            className="flex items-center gap-[4px] bg-transparent border-none text-[13px] text-white p-0"
            style={{ cursor: item === "Reports" || item === "Medicals" ? "pointer" : "default", fontFamily: SYS }}
          >
            {item}
            <ChevronDown size={12} color="#ffffff" strokeWidth={2} />
          </button>
        ))}
      </div>
      <div className="flex items-center gap-[14px]">
        <div className="flex items-center gap-[8px] rounded-[4px] px-[10px] h-[30px] w-[220px]" style={{ background: "#ffffff" }}>
          <Search size={14} color={MUTED} strokeWidth={2} />
          <span className="text-[12px]" style={{ color: MUTED }}>Search medicals...</span>
        </div>
        <Plus size={18} color="#ffffff" strokeWidth={2} />
        <Bell size={18} color="#ffffff" strokeWidth={2} />
        <span className="size-[28px] rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: "#3d5265" }}>
          BP
        </span>
      </div>
    </div>
  );
}

function PersonaBanner() {
  return (
    <div className="w-full px-[16px] py-[6px] text-center" style={{ background: "#fdf3d8" }}>
      <p className="text-[12px]" style={{ color: AMBER_INK, fontFamily: SYS }}>
        Clinician view: Full Health Medical portal. The patient does not see these screens.
      </p>
    </div>
  );
}

function Queue({ stage, onOpenJane, onReports }: { stage: ReviewStage; onOpenJane: () => void; onReports: () => void }) {
  const staged = REVIEW_STAGES[stage];
  return (
    <div className="min-h-screen w-full" style={{ background: PAGE, fontFamily: SYS }}>
      <TopNav onReports={onReports} onMedicals={() => {}} />
      <PersonaBanner />
      <div className="px-[24px] py-[20px]">
        <div className="flex items-center justify-between">
          <p className="text-[24px] font-bold" style={{ color: INK }}>Medicals</p>
          <span className="rounded-[4px] px-[14px] py-[8px] text-[13px] font-semibold text-white" style={{ background: TEAL }}>
            Create medical
          </span>
        </div>

        <div className="flex items-center gap-[10px] mt-[14px]">
          <span className="text-[10px] font-semibold tracking-[0.08em]" style={{ color: MUTED }}>SYSTEM VIEW</span>
          <span className="flex items-center gap-[6px] text-[14px] font-semibold" style={{ color: INK }}>
            Ready for approval <ChevronDown size={14} strokeWidth={2} />
          </span>
        </div>

        <div className="flex items-center gap-[8px] mt-[12px]">
          <span className="rounded-[4px] px-[8px] py-[3px] text-[12px]" style={{ background: CHIP_BLUE_BG, color: CHIP_BLUE_INK }}>
            Status is Ready for approval ×
          </span>
          {["+ Location", "+ Reviewer", "+ Worst flag", "+ Date"].map((chip) => (
            <span key={chip} className="rounded-[4px] px-[8px] py-[3px] text-[12px]" style={{ border: `1px solid ${RULE}`, color: MUTED }}>
              {chip}
            </span>
          ))}
        </div>

        <div className="bg-white rounded-[6px] mt-[14px] overflow-hidden" style={{ border: `1px solid ${RULE}` }}>
          <div className="flex items-center justify-between px-[14px] py-[10px]" style={{ borderBottom: `1px solid ${RULE}` }}>
            <p className="text-[12px]" style={{ color: MUTED }}>Search reference, client name, employee no...</p>
            <p className="text-[12px]" style={{ color: MUTED }}>{QUEUE.length} records</p>
          </div>
          <table className="w-full text-[13px]" style={{ borderCollapse: "collapse", color: INK }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${RULE}` }}>
                {["Status", "Worst flag", "Date", "Reference", "Client", "DOB / Age", "Sex", "Location code"].map((h) => (
                  <th key={h} className="text-left font-normal px-[14px] py-[8px]" style={{ color: MUTED }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {QUEUE.map((row) => (
                <tr key={row.ref} style={{ borderBottom: `1px solid ${RULE}`, background: row.isJane ? "#f2f8fd" : undefined }}>
                  <td className="px-[14px] py-[10px]">
                    <span className="rounded-[10px] px-[10px] py-[3px] text-[12px]" style={{ background: CHIP_BLUE_BG, color: CHIP_BLUE_INK }}>
                      Ready for approval
                    </span>
                  </td>
                  <td className="px-[14px] py-[10px]"><FlagChip label={row.isJane ? staged.queueFlag : row.flag} tone={row.tone} /></td>
                  <td className="px-[14px] py-[10px]">{row.isJane ? staged.queueDate : row.date}</td>
                  <td className="px-[14px] py-[10px]" style={{ color: TEAL }}>{row.isJane ? staged.reference : row.ref}</td>
                  <td className="px-[14px] py-[10px]">
                    {row.isJane ? (
                      <button
                        type="button"
                        onClick={onOpenJane}
                        data-guide-primary
                        className="bg-transparent border-none p-0 cursor-pointer font-semibold text-[13px] underline decoration-transparent hover:decoration-inherit"
                        style={{ color: TEAL, fontFamily: SYS }}
                      >
                        {row.client}
                      </button>
                    ) : (
                      <span style={{ color: TEAL }}>{row.client}</span>
                    )}
                  </td>
                  <td className="px-[14px] py-[10px]">{row.dob}</td>
                  <td className="px-[14px] py-[10px]">{row.sex}</td>
                  <td className="px-[14px] py-[10px]" style={{ color: TEAL }}>{row.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SideCard({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-[6px] w-[280px]" style={{ border: `1px solid ${RULE}` }}>{children}</div>;
}

function Detail({ stage, approved, onApprove, onDispatch, onReports }: { stage: ReviewStage; approved: boolean; onApprove: () => void; onDispatch: () => void; onReports: () => void }) {
  const staged = REVIEW_STAGES[stage];
  return (
    <div className="min-h-screen w-full" style={{ background: PAGE, fontFamily: SYS }}>
      <TopNav onReports={onReports} onMedicals={() => {}} />
      <PersonaBanner />

      <div className="bg-white flex items-center justify-between px-[24px] py-[12px]" style={{ borderBottom: `1px solid ${RULE}` }}>
        <div>
          <p className="text-[20px] font-bold" style={{ color: INK }}>{PATIENT.name}</p>
          <p className="text-[12px]" style={{ color: MUTED }}>
            {staged.meta} <span style={{ color: TEAL }}>View profile</span>
          </p>
        </div>
        <div className="flex items-center gap-[10px]">
          <span className="rounded-[4px] px-[14px] py-[8px] text-[13px] font-semibold" style={{ border: `1px solid ${RULE}`, color: INK }}>
            Revert
          </span>
          {/* Approved medicals show Revert and Dispatch, per the staging
              screenshot; dispatching is what sends the patient their email. */}
          <button
            type="button"
            onClick={approved ? onDispatch : onApprove}
            data-guide-primary
            className="rounded-[4px] px-[14px] py-[8px] text-[13px] font-semibold text-white border-none cursor-pointer"
            style={{ background: TEAL, fontFamily: SYS }}
          >
            {approved ? "Dispatch" : "Approve"}
          </button>
        </div>
      </div>

      {approved && (
        <div className="w-full px-[16px] py-[8px]" style={{ background: GREEN_BG }} role="status">
          <p className="text-[13px]" style={{ color: GREEN_INK }}>
            Medical approved. The Patient Experience team can now dispatch the report, which sends the patient their results email.
          </p>
        </div>
      )}

      <div className="flex gap-[16px] px-[24px] py-[16px] items-start">
        <div className="flex flex-col gap-[12px] shrink-0">
          <SideCard>
            <div className="px-[14px] py-[12px] flex flex-col gap-[8px] text-[12px]" style={{ color: INK }}>
              <div className="flex justify-between"><span style={{ color: MUTED }}>Doctor Care Anywhere</span><span style={{ color: TEAL }}>{staged.product} ⓘ</span></div>
              <div className="flex justify-between items-center">
                <span style={{ color: MUTED }}>{staged.date}</span>
                <span className="rounded-[10px] px-[8px] py-[2px] text-[11px]" style={{ background: approved ? GREEN_BG : CHIP_BLUE_BG, color: approved ? GREEN_INK : CHIP_BLUE_INK }}>
                  {approved ? "Approved" : "Ready for approval"}
                </span>
              </div>
              <div className="flex justify-between"><span style={{ color: MUTED }}>Reference</span><span>{staged.reference}</span></div>
              <div className="flex justify-between"><span style={{ color: MUTED }}>Reviewer</span><span>{PATIENT.reviewer}</span></div>
              <div className="flex justify-between items-start">
                <span style={{ color: MUTED }}>Tags</span>
                <span className="flex flex-wrap gap-[4px] justify-end">
                  {staged.tags.map((tag) => (
                    <span key={tag} className="rounded-[3px] px-[6px] py-[1px] text-[10px] text-white" style={{ background: "#3d5265" }}>{tag}</span>
                  ))}
                </span>
              </div>
            </div>
          </SideCard>

          {MENU.map(([group, items]) => (
            <SideCard key={group}>
              <p className="px-[14px] pt-[10px] pb-[4px] text-[11px] font-semibold" style={{ color: MUTED }}>{group}</p>
              {items.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between px-[14px] py-[8px] text-[13px]"
                  style={{
                    color: INK,
                    borderTop: `1px solid ${RULE}`,
                    background: item === "Report" && group === "Clinical" ? "#eaf6f3" : undefined,
                    borderLeft: item === "Report" && group === "Clinical" ? `3px solid ${TEAL}` : "3px solid transparent",
                  }}
                >
                  <span className="flex items-center gap-[6px]">
                    {item}
                    {item === "Report" && group === "Clinical" && <Phone size={12} color="#c0392b" strokeWidth={2} />}
                  </span>
                  <ChevronRight size={14} color={MUTED} strokeWidth={2} />
                </div>
              ))}
            </SideCard>
          ))}
        </div>

        <div className="flex-1 flex flex-col gap-[16px]">
          <div>
            <p className="text-[16px] font-bold mb-[10px]" style={{ color: INK }}>Report</p>
            <div className="flex flex-col gap-[8px]">
              {staged.rows.map((row) => {
                const t = ROW_TONES[row.tone];
                return (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-[6px] px-[18px] py-[16px]"
                    style={{ background: t.bg }}
                  >
                    <p className="text-[14px]" style={{ color: INK }}>{row.label}</p>
                    <span
                      className="rounded-[10px] px-[10px] py-[3px] text-[11px] font-semibold flex items-center gap-[4px] bg-white"
                      style={{ color: t.ink }}
                    >
                      {t.label}
                      <t.Icon size={12} strokeWidth={2} />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-[10px]">
              <p className="text-[16px] font-bold" style={{ color: INK }}>Files</p>
              <span className="rounded-[4px] px-[12px] py-[6px] text-[12px] font-semibold text-white" style={{ background: TEAL }}>
                Add attachment
              </span>
            </div>
            <div className="bg-white rounded-[6px] overflow-hidden" style={{ border: `1px solid ${RULE}` }}>
              <table className="w-full text-[13px]" style={{ borderCollapse: "collapse", color: INK }}>
                <thead>
                  <tr style={{ background: "#eef1f4" }}>
                    {["Name", "Date added", "Added by", "Shared with consumer?"].map((h) => (
                      <th key={h} className="text-left font-normal px-[14px] py-[8px]" style={{ color: MUTED }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Two files per medical, as FHM lists them: the report and
                      the raw results. */}
                  {["Medical report", "Test results"].map((file) => (
                    <tr key={file} style={{ borderTop: `1px solid ${RULE}` }}>
                      <td className="px-[14px] py-[10px]">
                        <span className="flex items-center gap-[6px]" style={{ color: TEAL }}>
                          {file} <Download size={13} strokeWidth={2} />
                        </span>
                      </td>
                      <td className="px-[14px] py-[10px]">{staged.fileDate}</td>
                      <td className="px-[14px] py-[10px]">N/A</td>
                      <td className="px-[14px] py-[10px]">{approved ? "Yes" : "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Organisational report ───────────────────────────────────────────────────

/*
 * The Uptake dashboard, one dataset per programme, from the two FHM Reports
 * screenshots the PM sent on 10 Sep: Health Insights Assessment (119
 * participants, 110 reports dispatched, median 2 work days) and the Advanced
 * HA, sold as Heart Health (7 participants, 6 dispatched, median 4.5). Nothing
 * has been attended or booked in either, because the pre-screen has no
 * appointment and the advanced cohort is booked through a separate product.
 * Demographics are read off the bar charts, so they are close, not exact.
 */
type Programme = "insights" | "advanced";

const UPTAKE: Record<Programme, {
  label: string; participants: number; attendedPct: number; bookedPct: number;
  dispatchedPct: number; dispatched: number; cancellations: number; dnas: number;
  medianDistance: string; workDaysToAppointment: string; workDaysToDispatch: string;
  demographics: [string, number, number][]; product: { label: string; count: number };
  dispatchChart: { median: [number, number]; p90: [number, number]; leftMax: number; rightMax: number };
}> = {
  insights: {
    label: "Health Insights Assessment",
    participants: 119, attendedPct: 0, bookedPct: 0, dispatchedPct: 92.44, dispatched: 110,
    cancellations: 0, dnas: 0, medianDistance: "No data", workDaysToAppointment: "No data", workDaysToDispatch: "2",
    demographics: [["<30", 6, 3], ["30-39", 20, 17], ["40-49", 40, 8], ["50-59", 13, 6], [">60", 7, 0]],
    product: { label: "Health Insights Assessment", count: 146 },
    dispatchChart: { median: [2, 2], p90: [7, 4], leftMax: 2, rightMax: 7 },
  },
  advanced: {
    label: "Advanced Health Assessment",
    participants: 7, attendedPct: 0, bookedPct: 0, dispatchedPct: 85.71, dispatched: 6,
    cancellations: 0, dnas: 0, medianDistance: "No data", workDaysToAppointment: "No data", workDaysToDispatch: "4.5",
    demographics: [["30-39", 0, 2], ["40-49", 3, 0], ["50-59", 1, 1]],
    product: { label: "Heart Health", count: 6 },
    dispatchChart: { median: [4, 5.5], p90: [2.5, 9], leftMax: 6, rightMax: 10 },
  },
};

function Gauge({ label, pct, max }: { label: string; pct: number; max?: number }) {
  return (
    <div className="bg-white rounded-[6px] p-[16px] flex flex-col gap-[8px]" style={{ border: `1px solid ${RULE}` }}>
      <p className="text-[13px]" style={{ color: INK }}>{label}</p>
      <div className="relative w-[110px] h-[55px] mx-auto overflow-hidden">
        <div
          className="absolute inset-0 rounded-t-full"
          style={{
            width: 110, height: 110, borderRadius: "50%",
            background: `conic-gradient(from 270deg, ${pct > 0 ? "#136f63" : "#d5dbe0"} 0deg ${pct * 1.8}deg, #d5dbe0 ${pct * 1.8}deg 180deg, transparent 180deg)`,
          }}
        />
        <div className="absolute rounded-full bg-white" style={{ left: 18, top: 18, width: 74, height: 74 }} />
        <p className="absolute inset-x-0 bottom-0 text-center text-[20px] font-bold" style={{ color: INK }}>{pct}%</p>
      </div>
      {max !== undefined && (
        <div className="flex justify-between w-[110px] mx-auto text-[10px]" style={{ color: MUTED }}><span>0</span><span>{max}</span></div>
      )}
    </div>
  );
}

function NoData({ label }: { label: string }) {
  return (
    <div className="bg-white rounded-[6px] p-[16px] flex flex-col" style={{ border: `1px solid ${RULE}`, minHeight: 220 }}>
      <p className="text-[13px]" style={{ color: INK }}>{label}</p>
      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-[12px] font-semibold" style={{ color: INK }}>No data to display</p>
        <p className="text-[11px]" style={{ color: MUTED }}>Data may be filtered out</p>
      </div>
    </div>
  );
}

/* Median work days to report dispatch: two median bars on the left axis, the
   90th percentile as a line on the right axis, as the FHM chart draws it. */
function DispatchChart({ data }: { data: (typeof UPTAKE)[Programme]["dispatchChart"] }) {
  const W = 300, H = 150, pad = 28;
  const barW = 70;
  const xs = [pad + 40, pad + 170];
  const yL = (v: number) => H - pad - (v / data.leftMax) * (H - 2 * pad);
  const yR = (v: number) => H - pad - (v / data.rightMax) * (H - 2 * pad);
  return (
    <div className="bg-white rounded-[6px] p-[16px]" style={{ border: `1px solid ${RULE}`, minHeight: 220 }}>
      <p className="text-[13px]" style={{ color: INK }}>Median work days to report dispatch</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full mt-[8px]" role="img" aria-label="Median and 90th percentile work days to report dispatch">
        {[0, 0.5, 1].map((t) => (
          <g key={t}>
            <line x1={pad} x2={W - pad} y1={yL(t * data.leftMax)} y2={yL(t * data.leftMax)} stroke="#e3e8ed" strokeWidth={1} />
            <text x={pad - 6} y={yL(t * data.leftMax) + 4} fontSize={9} textAnchor="end" fill={MUTED}>{t * data.leftMax}</text>
            <text x={W - pad + 6} y={yL(t * data.leftMax) + 4} fontSize={9} textAnchor="start" fill={MUTED}>{t * data.rightMax}</text>
          </g>
        ))}
        {data.median.map((v, i) => (
          <rect key={i} x={xs[i] - barW / 2} y={yL(v)} width={barW} height={H - pad - yL(v)} fill="#136f63" />
        ))}
        <polyline points={data.p90.map((v, i) => `${xs[i]},${yR(v)}`).join(" ")} fill="none" stroke="#2bbfa4" strokeWidth={2} />
        <text x={10} y={H / 2} fontSize={8} fill={MUTED} transform={`rotate(-90 10 ${H / 2})`} textAnchor="middle">Work days (median)</text>
        <text x={W - 8} y={H / 2} fontSize={8} fill={MUTED} transform={`rotate(90 ${W - 8} ${H / 2})`} textAnchor="middle">Work days (90th percentile)</text>
      </svg>
    </div>
  );
}

function UptakeDashboard({ programme, onProgramme }: { programme: Programme; onProgramme: (p: Programme) => void }) {
  const d = UPTAKE[programme];
  const maxBar = Math.max(...d.demographics.flatMap(([, f, m]) => [f, m]));
  return (
    <div>
      {/* Two programmes, one dashboard each. A filter on the real page; a pair
          of pills here so the switch is one click in the demo. */}
      <div className="flex items-center gap-[8px] mt-[14px]">
        {(["insights", "advanced"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onProgramme(id)}
            className="rounded-full px-[14px] py-[6px] text-[12px] font-semibold cursor-pointer"
            style={{ background: programme === id ? TEAL : "#ffffff", color: programme === id ? "#ffffff" : INK, border: `1px solid ${programme === id ? TEAL : RULE}`, fontFamily: SYS }}
          >
            {UPTAKE[id].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-[12px] mt-[14px]">
        <div className="bg-white rounded-[6px] p-[16px]" style={{ border: `1px solid ${RULE}` }}>
          <p className="text-[13px]" style={{ color: INK }}>Total participants</p>
          <p className="text-[34px] font-bold mt-[6px]" style={{ color: INK }}>{d.participants}</p>
        </div>
        <Gauge label="Total attended" pct={d.attendedPct} max={d.participants} />
        <Gauge label="Total booked" pct={d.bookedPct} max={d.participants} />
        <Gauge label="Total reports dispatched" pct={d.dispatchedPct} max={d.participants} />
      </div>

      <div className="grid grid-cols-5 gap-[12px] mt-[12px]">
        {[
          ["Total cancellations", String(d.cancellations)],
          ["Total DNAs", String(d.dnas)],
          ["Median distance", d.medianDistance],
          ["Median work days to appointment", d.workDaysToAppointment],
          ["Median work days to dispatch", d.workDaysToDispatch],
        ].map(([label, value]) => (
          <div key={label} className="bg-white rounded-[6px] p-[14px]" style={{ border: `1px solid ${RULE}` }}>
            <p className="text-[12px]" style={{ color: INK }}>{label}</p>
            <p className="text-[22px] font-bold mt-[4px]" style={{ color: INK }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-[12px] mt-[12px]">
        <div className="bg-white rounded-[6px] p-[16px]" style={{ border: `1px solid ${RULE}` }}>
          <p className="text-[13px] mb-[12px]" style={{ color: INK }}>Enrollment demographics</p>
          <div className="flex items-end gap-[18px] h-[140px] px-[8px]">
            {d.demographics.map(([band, f, m]) => (
              <div key={band} className="flex flex-col items-center gap-[4px] flex-1">
                <div className="flex items-end gap-[4px] h-[120px]">
                  <div className="w-[18px] rounded-t-[2px]" style={{ height: `${(f / maxBar) * 100}%`, background: "#136f63" }} />
                  <div className="w-[18px] rounded-t-[2px]" style={{ height: `${(m / maxBar) * 100}%`, background: "#2bbfa4" }} />
                </div>
                <p className="text-[11px]" style={{ color: MUTED }}>{band}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-[14px] mt-[8px] text-[11px]" style={{ color: MUTED }}>
            <span className="flex items-center gap-[4px]"><span className="size-[8px]" style={{ background: "#136f63" }} /> female</span>
            <span className="flex items-center gap-[4px]"><span className="size-[8px]" style={{ background: "#2bbfa4" }} /> male</span>
          </div>
        </div>

        <div className="bg-white rounded-[6px] p-[16px]" style={{ border: `1px solid ${RULE}` }}>
          <p className="text-[13px] mb-[12px]" style={{ color: INK }}>Product selection</p>
          <div className="flex items-center justify-center gap-[24px]">
            <div className="relative size-[140px] rounded-full" style={{ background: "#136f63" }}>
              <div className="absolute rounded-full bg-white flex items-center justify-center" style={{ inset: 18 }}>
                <p className="text-[26px] font-bold" style={{ color: INK }}>{d.product.count}</p>
              </div>
            </div>
            <p className="text-[12px] flex items-center gap-[6px]" style={{ color: MUTED }}>
              <span className="size-[8px]" style={{ background: "#136f63" }} /> {d.product.label}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-[12px] mt-[12px]">
        <NoData label="Median distance to appointment" />
        <NoData label="Median work days to appointment" />
        <DispatchChart data={d.dispatchChart} />
      </div>
    </div>
  );
}



/*
 * The Health insights tab: the organisational health report from deck slide 15
 * ("Example Organisational Health Report - Note some basic filtering can be
 * applied"). Company D 2025's contract view: age during medical, sex at birth,
 * medicals requiring a phone call, and the red-amber-green flag distribution
 * per report section. All values are the slide's own: nine medicals, 37.5%
 * requiring a call, and the flag bars read off its chart.
 */
const FLAG_ROWS: [string, number, number][] = [
  // [label, red%, amber%]; green is the rest.
  ["Body Mass Index", 37, 25],
  ["Central Obesity", 37, 13],
  ["Blood Pressure", 37, 0],
  ["Cholesterol", 0, 37],
  ["Atrial Fibrillation", 0, 13],
  ["HbA1c", 0, 13],
  ["Renal", 0, 13],
  ["Thyroid", 0, 13],
];

const AGE_BANDS: [string, number, number][] = [["30-39", 1, 0], ["40-49", 2, 3], ["50-59", 3, 3]];

function HealthInsights() {
  return (
    <div className="flex flex-col gap-[12px] mt-[16px]">
      <div className="grid grid-cols-3 gap-[12px]">
        <div className="bg-white rounded-[6px] p-[16px]" style={{ border: `1px solid ${RULE}` }}>
          <p className="text-[13px] mb-[12px]" style={{ color: INK }}>Age during medical</p>
          <div className="flex items-end gap-[26px] h-[120px] px-[10px]">
            {AGE_BANDS.map(([band, f, m]) => (
              <div key={band} className="flex flex-col items-center gap-[4px] flex-1">
                <div className="flex items-end gap-[4px] h-[100px]">
                  <div className="w-[20px]" style={{ height: `${(f / 3) * 100}%`, background: "#136f63" }} />
                  <div className="w-[20px]" style={{ height: `${(m / 3) * 100}%`, background: "#2bbfa4" }} />
                </div>
                <p className="text-[11px]" style={{ color: MUTED }}>{band}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-[14px] mt-[8px] text-[11px]" style={{ color: MUTED }}>
            <span className="flex items-center gap-[4px]"><span className="size-[8px]" style={{ background: "#136f63" }} /> female</span>
            <span className="flex items-center gap-[4px]"><span className="size-[8px]" style={{ background: "#2bbfa4" }} /> male</span>
          </div>
        </div>

        <div className="bg-white rounded-[6px] p-[16px]" style={{ border: `1px solid ${RULE}` }}>
          <p className="text-[13px] mb-[12px]" style={{ color: INK }}>Sex at birth</p>
          <div className="flex items-center justify-center gap-[20px]">
            {/* Five to four, per the slide's donut. */}
            <div className="relative size-[120px] rounded-full" style={{ background: "conic-gradient(#136f63 0deg 200deg, #2bbfa4 200deg 360deg)" }}>
              <div className="absolute rounded-full bg-white flex items-center justify-center" style={{ inset: 16 }}>
                <p className="text-[24px] font-bold" style={{ color: INK }}>9</p>
              </div>
            </div>
            <div className="flex flex-col gap-[6px] text-[11px]" style={{ color: MUTED }}>
              <span className="flex items-center gap-[4px]"><span className="size-[8px]" style={{ background: "#136f63" }} /> female</span>
              <span className="flex items-center gap-[4px]"><span className="size-[8px]" style={{ background: "#2bbfa4" }} /> male</span>
            </div>
          </div>
        </div>

        <Gauge label="Medicals requiring a phone call" pct={37.5} />
      </div>

      <div className="bg-white rounded-[6px] p-[16px]" style={{ border: `1px solid ${RULE}` }}>
        <p className="text-[13px] mb-[14px]" style={{ color: INK }}>Report flags</p>
        <div className="flex flex-col gap-[10px]">
          {FLAG_ROWS.map(([label, red, amber]) => (
            <div key={label} className="flex items-center gap-[12px]">
              <p className="text-[12px] w-[130px] text-right shrink-0" style={{ color: MUTED }}>{label}</p>
              <div className="flex-1 h-[26px] flex rounded-[2px] overflow-hidden">
                {red > 0 && <div style={{ width: `${red}%`, background: "#e64545" }} />}
                {amber > 0 && <div style={{ width: `${amber}%`, background: "#f5b32a" }} />}
                <div style={{ width: `${100 - red - amber}%`, background: "#27bf5f" }} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between px-[142px] mt-[6px] text-[11px]" style={{ color: MUTED }}>
          <span>0%</span><span>20%</span><span>40%</span><span>60%</span><span>80%</span><span>100%</span>
        </div>
      </div>
    </div>
  );
}

function OrgReports({ onMedicals }: { onMedicals: () => void }) {
  const [tab, setTab] = useState<"uptake" | "insights">("uptake");
  const [programme, setProgramme] = useState<Programme>("insights");
  return (
    <div className="min-h-screen w-full" style={{ background: PAGE, fontFamily: SYS }}>
      <TopNav onReports={() => {}} onMedicals={onMedicals} />
      <PersonaBanner />
      <div className="px-[24px] py-[20px]">
        {/* Slide 15 frames this under a contract: employer-level, no patients. */}
        <p className="text-[12px]" style={{ color: MUTED }}>Organisations / Contracts / <span style={{ color: TEAL }}>Company D 2025</span></p>
        <p className="text-[24px] font-bold mt-[4px]" style={{ color: INK }}>Reports</p>
        <div className="flex gap-[16px] mt-[6px] text-[13px]">
          {([["uptake", "Uptake"], ["insights", "Health insights"]] as const).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className="bg-transparent border-none p-0 cursor-pointer text-[13px]"
              style={{
                color: tab === id ? INK : MUTED,
                fontWeight: tab === id ? 600 : 400,
                borderBottom: tab === id ? `2px solid ${TEAL}` : "2px solid transparent",
                fontFamily: SYS,
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {tab === "insights" && <HealthInsights />}
        {tab === "uptake" && <UptakeDashboard programme={programme} onProgramme={setProgramme} />}
      </div>
    </div>
  );
}

export function ClinicianPortal({ stage = "prescreen", onDispatched, initialScreen = "queue" }: {
  /** Which report this review is of: the same screens run for both. */
  stage?: ReviewStage;
  /** Dispatch, not Approve, is what sends the results email. Janelle, 4 Sep:
      after the clinician approves, "they need to show Revert/Dispatch before
      sending the email for results" - the Patient Experience team's step. */
  onDispatched: () => void;
  /** The employer's view opens straight on Reports at the end of the demo. */
  initialScreen?: "queue" | "reports";
}) {
  const [screen, setScreen] = useState<"queue" | "detail" | "reports">(initialScreen);
  const [approved, setApproved] = useState(false);
  useScrollTop(screen);

  if (screen === "reports") {
    return (
      <>
        <OrgReports onMedicals={() => setScreen("queue")} />
        <GuideArrow onBack={() => setScreen("queue")} backLabel="Medicals" />
      </>
    );
  }
  if (screen === "detail") {
    return (
      <>
        <Detail
          stage={stage}
          approved={approved}
          onApprove={() => setApproved(true)}
          onDispatch={onDispatched}
          onReports={() => setScreen("reports")}
        />
        <GuideArrow onBack={() => setScreen("queue")} backLabel="Queue" />
      </>
    );
  }
  return (
    <>
      <Queue stage={stage} onOpenJane={() => setScreen("detail")} onReports={() => setScreen("reports")} />
    </>
  );
}
