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
  Search, Plus, Bell, ChevronDown, ChevronRight, Phone, CircleCheck, Download,
} from "lucide-react";
import { useScrollTop } from "./use-scroll-top.ts";

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

const PATIENT = {
  name: "Jane Smith",
  meta: "01 Jan 1981  (45yo)  Female  -  Ref: DCAPRE7Y2Q4JS8XK  -",
  product: "Pre-assessment",
  date: "04/09/2026",
  reference: "DCAPRE7Y2Q4JS8XK",
  reviewer: "Bibin Paul",
  tags: ["viewed_online", "online"],
};

// Jane first; the rest dress the queue.
const QUEUE = [
  { flag: "DCA-PRE-ASSESSMENT", tone: "amber", date: "04 Sep 2026", ref: "DCAPRE7Y2Q4JS8XK", client: "Jane Smith", dob: "01 Jan 1981 (45)", sex: "F", location: "South Kensington", isJane: true },
  { flag: "DCA-PRE-ASSESSMENT", tone: "amber", date: "04 Sep 2026", ref: "DCAPREXVM4UFU98F", client: "George Tyson", dob: "29 Jun 2002 (24)", sex: "M", location: "South Kensington" },
  { flag: "DCA-PRE-ASSESSMENT", tone: "red", date: "03 Sep 2026", ref: "DCAPRELQ4VGCZ44", client: "Branden Nguyen", dob: "29 Jun 1987 (39)", sex: "F", location: "South Kensington" },
  { flag: "Clear", tone: "green", date: "03 Sep 2026", ref: "DCAPRENBGAE9LQZD", client: "Scarlett Carney", dob: "01 Jul 1978 (48)", sex: "F", location: "South Kensington" },
  { flag: "DCA-PRE-ASSESSMENT", tone: "red", date: "02 Sep 2026", ref: "DCAPREMBTCHG2S6Z", client: "Dorian Sandoval", dob: "09 Jun 1992 (34)", sex: "M", location: "South Kensington" },
  { flag: "Clear", tone: "green", date: "02 Sep 2026", ref: "DCAPREHWAGL9TB9E", client: "Alice Green", dob: "30 Jun 1993 (33)", sex: "F", location: "South Kensington" },
];

// Sections as the pre-screen report groups them, statuses from Jane's PDF.
const REPORT_ROWS = [
  { label: "Demographics", tone: "green" },
  { label: "Known Medical Conditions", tone: "green" },
  { label: "Family History", tone: "green" },
  { label: "Lifestyle Factors", tone: "amber" },
  { label: "Body Metrics", tone: "amber" },
];

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

function Queue({ onOpenJane, onReports }: { onOpenJane: () => void; onReports: () => void }) {
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
                  <td className="px-[14px] py-[10px]"><FlagChip label={row.flag} tone={row.tone} /></td>
                  <td className="px-[14px] py-[10px]">{row.date}</td>
                  <td className="px-[14px] py-[10px]" style={{ color: TEAL }}>{row.ref}</td>
                  <td className="px-[14px] py-[10px]">
                    {row.isJane ? (
                      <button
                        type="button"
                        onClick={onOpenJane}
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

function Detail({ approved, onApprove, onReports }: { approved: boolean; onApprove: () => void; onReports: () => void }) {
  return (
    <div className="min-h-screen w-full" style={{ background: PAGE, fontFamily: SYS }}>
      <TopNav onReports={onReports} onMedicals={() => {}} />
      <PersonaBanner />

      <div className="bg-white flex items-center justify-between px-[24px] py-[12px]" style={{ borderBottom: `1px solid ${RULE}` }}>
        <div>
          <p className="text-[20px] font-bold" style={{ color: INK }}>{PATIENT.name}</p>
          <p className="text-[12px]" style={{ color: MUTED }}>
            {PATIENT.meta} <span style={{ color: TEAL }}>View profile</span>
          </p>
        </div>
        <div className="flex items-center gap-[10px]">
          <span className="rounded-[4px] px-[14px] py-[8px] text-[13px] font-semibold" style={{ border: `1px solid ${RULE}`, color: INK }}>
            Revert
          </span>
          <button
            type="button"
            onClick={approved ? undefined : onApprove}
            className="rounded-[4px] px-[14px] py-[8px] text-[13px] font-semibold text-white border-none"
            style={{ background: approved ? "#5f9e8f" : TEAL, cursor: approved ? "default" : "pointer", fontFamily: SYS }}
          >
            {approved ? "Approved ✓" : "Approve"}
          </button>
        </div>
      </div>

      {approved && (
        <div className="w-full px-[16px] py-[8px]" style={{ background: GREEN_BG }} role="status">
          <p className="text-[13px]" style={{ color: GREEN_INK }}>
            Medical approved. The report will be released to Doctor Care Anywhere for upload to the patient record.
          </p>
        </div>
      )}

      <div className="flex gap-[16px] px-[24px] py-[16px] items-start">
        <div className="flex flex-col gap-[12px] shrink-0">
          <SideCard>
            <div className="px-[14px] py-[12px] flex flex-col gap-[8px] text-[12px]" style={{ color: INK }}>
              <div className="flex justify-between"><span style={{ color: MUTED }}>DCA - TEST DOMAIN</span><span style={{ color: TEAL }}>{PATIENT.product} ⓘ</span></div>
              <div className="flex justify-between items-center">
                <span style={{ color: MUTED }}>{PATIENT.date}</span>
                <span className="rounded-[10px] px-[8px] py-[2px] text-[11px]" style={{ background: approved ? GREEN_BG : CHIP_BLUE_BG, color: approved ? GREEN_INK : CHIP_BLUE_INK }}>
                  {approved ? "Approved" : "Ready for approval"}
                </span>
              </div>
              <div className="flex justify-between"><span style={{ color: MUTED }}>Reference</span><span>{PATIENT.reference}</span></div>
              <div className="flex justify-between"><span style={{ color: MUTED }}>Reviewer</span><span>{PATIENT.reviewer}</span></div>
              <div className="flex justify-between items-start">
                <span style={{ color: MUTED }}>Tags</span>
                <span className="flex flex-wrap gap-[4px] justify-end">
                  {PATIENT.tags.map((tag) => (
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
              {REPORT_ROWS.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between rounded-[6px] px-[18px] py-[16px]"
                  style={{ background: row.tone === "amber" ? AMBER_BG : GREEN_BG }}
                >
                  <p className="text-[14px]" style={{ color: INK }}>{row.label}</p>
                  <span
                    className="rounded-[10px] px-[10px] py-[3px] text-[11px] font-semibold flex items-center gap-[4px] bg-white"
                    style={{ color: row.tone === "amber" ? AMBER_INK : GREEN_INK }}
                  >
                    {row.tone === "amber" ? "Attention" : "No concerns"}
                    <CircleCheck size={12} strokeWidth={2} />
                  </span>
                </div>
              ))}
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
                  <tr>
                    <td className="px-[14px] py-[10px]">
                      <span className="flex items-center gap-[6px]" style={{ color: TEAL }}>
                        Medical report <Download size={13} strokeWidth={2} />
                      </span>
                    </td>
                    <td className="px-[14px] py-[10px]">04 Sep 2026 16:02</td>
                    <td className="px-[14px] py-[10px]">N/A</td>
                    <td className="px-[14px] py-[10px]">{approved ? "Yes" : "N/A"}</td>
                  </tr>
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

const KPIS = [
  { label: "Total participants", value: "20" },
  { label: "Total cancellations", value: "0" },
  { label: "Total DNAs", value: "0" },
  { label: "Median distance", value: "120.55" },
  { label: "Median work days to appointment", value: "5" },
  { label: "Median work days to dispatch", value: "No data" },
];

// The demographics bars: [female, male] per age band, from the screenshot.
const DEMOGRAPHICS: [string, number, number][] = [
  ["<30", 1, 3], ["30-39", 4, 2], ["40-49", 4, 0], ["50-59", 1, 1], [">60", 1, 3],
];

function Gauge({ label, pct }: { label: string; pct: number }) {
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
  const maxBar = 4;
  const [tab, setTab] = useState<"uptake" | "insights">("uptake");
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
        {tab === "uptake" && (
        <div>

        <div className="grid grid-cols-4 gap-[12px] mt-[16px]">
          {KPIS.slice(0, 1).map((k) => (
            <div key={k.label} className="bg-white rounded-[6px] p-[16px]" style={{ border: `1px solid ${RULE}` }}>
              <p className="text-[13px]" style={{ color: INK }}>{k.label}</p>
              <p className="text-[34px] font-bold mt-[6px]" style={{ color: INK }}>{k.value}</p>
            </div>
          ))}
          <Gauge label="Total attended" pct={100} />
          <Gauge label="Total booked" pct={100} />
          <Gauge label="Total reports dispatched" pct={0} />
        </div>

        <div className="grid grid-cols-5 gap-[12px] mt-[12px]">
          {KPIS.slice(1).map((k) => (
            <div key={k.label} className="bg-white rounded-[6px] p-[14px]" style={{ border: `1px solid ${RULE}` }}>
              <p className="text-[12px]" style={{ color: INK }}>{k.label}</p>
              <p className="text-[22px] font-bold mt-[4px]" style={{ color: INK }}>{k.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-[12px] mt-[12px]">
          <div className="bg-white rounded-[6px] p-[16px]" style={{ border: `1px solid ${RULE}` }}>
            <p className="text-[13px] mb-[12px]" style={{ color: INK }}>Enrollment demographics</p>
            <div className="flex items-end gap-[18px] h-[140px] px-[8px]">
              {DEMOGRAPHICS.map(([band, f, m]) => (
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
                  <p className="text-[26px] font-bold" style={{ color: INK }}>20</p>
                </div>
              </div>
              <p className="text-[12px] flex items-center gap-[6px]" style={{ color: MUTED }}>
                <span className="size-[8px]" style={{ background: "#136f63" }} /> Pre-assessment
              </p>
            </div>
          </div>
        </div>
        </div>
        )}
      </div>
    </div>
  );
}

export function ClinicianPortal({ onApproved }: {
  /** Approve releases the report to DCA, whose next beat is the results email. */
  onApproved: () => void;
}) {
  const [screen, setScreen] = useState<"queue" | "detail" | "reports">("queue");
  const [approved, setApproved] = useState(false);
  useScrollTop(screen);

  // A short dwell after Approve so cause and effect read: the chip flips, the
  // release strip appears, then the patient's email arrives.
  function approve() {
    setApproved(true);
    window.setTimeout(onApproved, 2200);
  }

  if (screen === "reports") return <OrgReports onMedicals={() => setScreen("queue")} />;
  if (screen === "detail") return <Detail approved={approved} onApprove={approve} onReports={() => setScreen("reports")} />;
  return <Queue onOpenJane={() => setScreen("detail")} onReports={() => setScreen("reports")} />;
}
