// The DCA member portal, Home and Uploads.
//
// Figma rDltwIr2dJvUUNaXEqEYFO, both frames captured from the live portal:
// Home 27052:15703, Uploads 27052:15866 (member.doctorcareanywhere.com/Home/
// Uploads). Janelle, 4 Sep: "after the user has clicked the email, show this
// page where they see their dca account", then "also do one screen for the
// home tab".
//
// THE UPLOADS LIST IS REBUILT, NOT PASTED. In its frame that list is a flat
// screenshot, node 27052:16130, of Janelle's own account: four real rows naming
// skin lesions and a throat, "Added by Janelle Tamayo", against patient number
// DCA-001418023, which the Home frame repeats. None of that belongs in a
// prototype that gets shown to AXA, so the table is real markup, the row is the
// one this journey produces, and the patient number is invented.
//
// TWO TYPEFACES, WHICH IS THE PORTAL'S OWN DOING. Its chrome is Source Sans on
// #494de3 purple, neither of which appears anywhere else in this prototype. The
// Home cards and the Uploads button are Work Sans on the same design system as
// the activation app: #d7e9ff borders, #133595 headings, #135cff buttons. Both
// frames draw it that way.
//
// Only Home and Uploads exist, so only those two tabs move. The other three are
// drawn because the portal has them, and are inert.

import { useEffect, useState } from "react";
import {
  House, CalendarDays, BriefcaseMedical, FileUp, Folder, FileText,
  ChevronRight, ChevronLeft, CircleChevronRight,
} from "lucide-react";
import { Logo } from "./dca-logo.tsx";
import appTile from "../assets/portal/app-tile.png";
import reportPdf from "../assets/portal/health-insights-pre-screen-report.pdf";
import advancedReportPdf from "../assets/portal/advanced-health-assessment-report.pdf";
import { useScrollTop } from "./use-scroll-top.ts";

const SS = "'Source Sans 3', 'Source Sans Pro', sans-serif";
const WS = "'Work Sans', sans-serif";
const PURPLE = "#494de3";
const NAVY = "#00008f";
const PAGE = "#f4f4f4";
const BLUE = "#135cff";
const CARD_BORDER = "#d7e9ff";
const CARD_HEADING = "#133595";
const CARD_BODY = "#030712";
const HEADING = "#4e4e46";
const GREETING_INK = "#081f3f";
const BODY = "#333333";
const META = "#575757";
const RULE = "#e8e8e8";
const SHADOW_LG = "drop-shadow(0px 10px 7.5px rgba(15,55,190,0.05)) drop-shadow(0px 4px 3px rgba(15,55,190,0.05))";

type TabName = "Home" | "Appointments" | "Prescriptions" | "Uploads" | "Medical History";

// 27052:15741-15760. Equal fifths, the active one a white card to the full
// height of the strip.
const TABS: { label: TabName; Icon: typeof House }[] = [
  { label: "Home", Icon: House },
  { label: "Appointments", Icon: CalendarDays },
  { label: "Prescriptions", Icon: BriefcaseMedical },
  { label: "Uploads", Icon: FileUp },
  { label: "Medical History", Icon: Folder },
];

const LIVE_TABS: TabName[] = ["Home", "Uploads"];

// One row, because this patient has just joined for the assessment. The frame's
// four are Janelle's own history. Janelle, 4 Sep: "change to Health Insights
// Pre-screen test results", "Uploaded by the Patient Experience Team".
/*
 * Newest first, like the live portal. The advanced report exists only after
 * the appointment, so it is not in this list: UploadsBody prepends it when the
 * journey has reached that stage.
 *
 * Its PDF is Janelle's AdvReport1.pdf, 32 pages, with the patient renamed to
 * Jane Smith in all 33 places (addressee, greeting, every footer). The
 * reviewer, reference UAT1ADV3NFUPZPU9E and 01/01/1981 date of birth are the
 * sample's own. Janelle, 4 Sep: "again change the name to Jane Smith".
 */
const ADVANCED_FILE = {
  name: "Advanced Health Assessment Report",
  pages: 32,
  // The results-ready email arrives at 08:26, so the file lands then too. The
  // appointment was Wed 16 Sep; two days for the samples and review.
  when: "Fri, 18 Sep 2026, 8:26am",
  addedBy: "Added by Patient Experience Team",
  uploadedFor: "Uploaded for Jane Smith",
  pdf: advancedReportPdf,
};

const FILES = [
  {
    name: "Health Insights Pre-screen test results",
    pages: 14,
    // The results email is timestamped 16:02, so the report lands at 16:02.
    when: "Fri, 4 Sep 2026, 4:02pm",
    addedBy: "Added by Patient Experience Team",
    uploadedFor: "Uploaded for Jane Smith",
    pdf: reportPdf,
  },
];

function Tab({ label, Icon, active, onSelect }: {
  label: TabName; Icon: typeof House; active: boolean; onSelect?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex flex-col items-center pt-[18px] pb-[15px] flex-1 rounded-t-[5px] border-none"
      style={{ background: active ? "#ffffff" : "transparent", cursor: onSelect ? "pointer" : "default" }}
    >
      <div className="h-[41px] flex items-center">
        <Icon size={27} color={active ? PURPLE : "#ffffff"} strokeWidth={1.5} />
      </div>
      <p
        className="font-bold text-center text-[14px] leading-[24px] whitespace-nowrap mt-[13px]"
        style={{ fontFamily: SS, color: active ? PURPLE : "#ffffff" }}
      >
        {label}
      </p>
    </button>
  );
}

function ProfileCard() {
  return (
    <div className="relative shrink-0 w-[200px] h-[378px] rounded-[4px]" style={{ background: NAVY, fontFamily: SS }}>
      <div className="absolute left-0 right-0 top-0 h-[189px]" style={{ borderBottom: "0.8px solid #f4f4f4" }}>
        <div
          className="absolute left-1/2 -translate-x-1/2 top-[17.6px] size-[65.6px] rounded-[32.8px]"
          style={{ background: "#071b38", border: "0.8px solid #f4f4f4" }}
        />
        <p className="absolute left-0 right-0 top-[93.6px] text-center font-bold text-[16px] leading-[21.76px] text-white">
          Jane Smith
        </p>
        <p className="absolute left-0 right-0 top-[118.56px] text-center text-[11.2px] leading-[15.68px] text-white">
          Patient no: DCA-001234567
        </p>
        <p
          className="absolute left-1/2 -translate-x-1/2 top-[147.83px] font-bold text-[11.2px] leading-[15.68px] text-white pb-[2px]"
          style={{ borderBottom: "0.8px solid #848f9f" }}
        >
          My profile
        </p>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 top-[214.71px] w-[155.2px] h-[24px] rounded-[12px] bg-white flex items-center justify-center">
        <p className="font-bold text-[9.6px] leading-[24px]" style={{ color: NAVY }}>Book an appointment</p>
        <ChevronRight size={10} color={NAVY} strokeWidth={3} className="absolute right-[8px]" />
      </div>

      <p
        className="absolute left-1/2 -translate-x-1/2 top-[328.14px] font-bold text-[11.2px] leading-[15.68px] text-white pb-[2px]"
        style={{ borderBottom: "0.8px solid #848f9f" }}
      >
        Manage my account
      </p>
    </div>
  );
}

function Footer() {
  return (
    <div className="w-full shrink-0" style={{ fontFamily: SS }}>
      <div className="w-full h-[221px]" style={{ background: "#092040" }}>
        <div className="max-w-[1200px] mx-auto h-full px-[57px] flex items-start pt-[45px]">
          <div className="shrink-0" style={{ transform: "scale(0.78)", transformOrigin: "top left" }}>
            <Logo />
          </div>
          <div className="flex-1" />
          <div className="flex gap-[70px] pr-[164px]">
            <div className="flex flex-col gap-[10px] text-[14px] leading-[24px] text-white">
              <p className="uppercase">Service</p>
              <p className="mt-[5px]">Home</p>
              <p>My profile</p>
              <p>About us</p>
            </div>
            <div className="flex flex-col gap-[10px] text-[14px] leading-[24px] text-white">
              <p className="uppercase">Our Apps</p>
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
      </div>

      <div className="w-full h-[65px] flex items-center" style={{ background: "#061731" }}>
        <div className="max-w-[1200px] w-full mx-auto flex gap-[40px] text-[12px] leading-[24px] pl-[211px]">
          {/* The frame's own year. */}
          <p style={{ color: "#a7aaaf" }}>©2025 Doctor Care Anywhere Ltd.</p>
          <p className="text-white">Terms and conditions</p>
          <p className="text-white">Privacy</p>
        </div>
      </div>
    </div>
  );
}

/** The design system card both Home rows use, from 27052:15770 and 15773. */
function ActionCard({ title, body, action }: { title: string; body: string; action: React.ReactNode }) {
  return (
    <div
      className="flex flex-wrap gap-[16px] items-center p-[24px] rounded-[16px] w-full bg-white"
      style={{ border: `1px solid ${CARD_BORDER}`, filter: SHADOW_LG, fontFamily: WS }}
    >
      <div className="flex flex-col gap-[4px] flex-1 min-w-[208px]">
        <p className="font-semibold text-[18px] leading-[28px]" style={{ color: CARD_HEADING }}>{title}</p>
        <p className="text-[12px] leading-[16px]" style={{ color: CARD_BODY }}>{body}</p>
      </div>
      {action}
    </div>
  );
}

function PortalShell({ active, onSelectTab, children }: {
  active: TabName; onSelectTab: (tab: TabName) => void; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center min-h-screen w-full" style={{ background: PAGE }}>
      <div className="relative w-full flex flex-col items-center">
        {/* The purple runs behind the header, the tabs and the top of the first
            card, which is what puts the active tab on a white ground. */}
        <div className="absolute top-0 left-0 right-0 h-[282px]" style={{ background: PURPLE }} />

        <div className="relative w-full h-[70px] flex items-center justify-between px-[20px]">
          <div style={{ transform: "scale(1.28)", transformOrigin: "left center" }}>
            <Logo />
          </div>
          <div className="flex items-center gap-[10px] pr-[4px]">
            <div className="size-[32px] rounded-[16px]" style={{ background: NAVY, border: "1px solid rgba(255,255,255,0.3)" }} />
            <p className="font-bold text-[14px] leading-[19.6px] text-white" style={{ fontFamily: SS }}>Jane</p>
            <ChevronRight size={14} color="#ffffff" strokeWidth={2.5} />
          </div>
        </div>

        <div className="relative w-[782px] flex flex-col gap-[21px] pt-[10px] pb-[100px]">
          <div className="flex w-full">
            {TABS.map((tab) => (
              <Tab
                key={tab.label}
                label={tab.label}
                Icon={tab.Icon}
                active={tab.label === active}
                onSelect={LIVE_TABS.includes(tab.label) ? () => onSelectTab(tab.label) : undefined}
              />
            ))}
          </div>
          {children}
        </div>
      </div>

      <div className="flex-1" />
      <Footer />
    </div>
  );
}

function HomeBody({ showAdvanced, onOpenAssessments, onBookFollowUp, onOpenSleep }: {
  showAdvanced: boolean;
  onOpenAssessments: () => void;
  onBookFollowUp: () => void;
  onOpenSleep: () => void;
}) {
  return (
    <>
      {/* 27052:15761. The strip sits flush under the tabs, so it is pulled up
          out of the column's 21px gap. */}
      <div
        className="bg-white rounded-[5px] w-full h-[160px] px-[29px] flex flex-col justify-center mt-[-21px]"
        style={{ filter: "drop-shadow(0px 0px 7.5px rgba(229,229,229,0.4))", fontFamily: SS }}
      >
        <p className="text-[40px] leading-[40px]" style={{ color: GREETING_INK }}>
          <span className="font-bold">Hi, Jane.</span>
        </p>
        <p className="text-[40px] leading-[40px] mt-[19px]" style={{ color: GREETING_INK }}>
          What can we help you with?
        </p>
      </div>

      <div className="flex gap-[15px] items-start w-full">
        <div className="flex flex-col gap-[32px] w-[567px] shrink-0">
          {/* 27052:15770 */}
          <ActionCard
            title="Book an appointment"
            body="Video and phone appointments available 24/7, all year round. We’ve got just the clinician for you."
            action={
              <button
                type="button"
                className="flex items-center gap-[8px] justify-center px-[16px] py-[12px] rounded-full border-none cursor-pointer shrink-0"
                style={{ background: BLUE, filter: "drop-shadow(0px 4px 3px rgba(15,55,190,0.05))" }}
              >
                <span className="font-semibold text-[12px] leading-[16px]" style={{ color: "#edf6ff" }}>Book now</span>
                <CircleChevronRight size={16} color="#edf6ff" strokeWidth={1.5} />
              </button>
            }
          />

          <div className="flex flex-col gap-[16px] w-full">
            {/* 27052:15772 */}
            <p className="font-semibold text-[20px] leading-[28px] text-black" style={{ fontFamily: WS }}>
              Health Assessments
            </p>

            {/* 27052:15773. Hidden at the pre-screen stage (Janelle, 4 Sep:
                "not the stage here"), because it announces a report that does
                not exist yet. Once the advanced report is in, it is exactly the
                stage: deck steps 21-22, Patient Books HA Follow-Up. */}
            {showAdvanced && (
              <ActionCard
                title="Health Assessment follow-up"
                body="Your report from the Advanced Corporate Health Assessment is ready. Book an appointment with a Doctor (GP) if you’d like to discuss your results."
                action={
                  <button
                    type="button"
                    onClick={onBookFollowUp}
                    data-guide-primary
                    className="flex items-center gap-[8px] justify-center px-[16px] py-[12px] rounded-full cursor-pointer shrink-0 bg-transparent"
                    style={{ border: `1px solid ${BLUE}`, filter: "drop-shadow(0px 4px 3px rgba(15,55,190,0.05))" }}
                  >
                    <span className="font-semibold text-[12px] leading-[16px]" style={{ color: BLUE }}>
                      Book follow-up appointment
                    </span>
                    <CircleChevronRight size={16} color={BLUE} strokeWidth={1.5} />
                  </button>
                }
              />
            )}

            {/* 27052:15774. Icon only, 44 square, on the ghost button's tint. */}
            {/* 27052:15774 draws this as "My health assessments" / "Continue
                your health assessment journey.", which was written for a tile
                that went nowhere. Janelle, 4 Sep: "the my health assessments
                would have the person supposedly land on the book their FHM
                booking for clinic now, so either we chnage the copy on that tile
                to match the journey". So the copy names what the button does.
                NO FRAME: this pair is mine, not marketing's. */}
            <ActionCard
              title="Book your Health Assessment"
              body="Your clinician has recommended a more in-depth assessment. Choose a pharmacy, date and time that suit you."
              action={
                <button
                  type="button"
                  aria-label="Open my health assessments"
                  data-guide-primary={!showAdvanced || undefined}
                  onClick={onOpenAssessments}
                  className="flex items-center justify-center size-[44px] rounded-full cursor-pointer shrink-0"
                  style={{ background: "rgba(10,10,10,0.01)", border: "1px solid rgba(10,10,10,0.05)" }}
                >
                  <CircleChevronRight size={16} color={CARD_BODY} strokeWidth={1.5} />
                </button>
              }
            />

            {/* NO FRAME: the deck's HealthStyle ending (slides 16 and 20), a
                clinician-recommended lifestyle programme. The card opened the
                team's live page directly for a day, but that URL is a HubSpot
                preview slug behind preview auth, so anyone without it saw
                nothing. Janelle, 4 Sep: "i still dont see the contents of the
                sleep content at least show the url file or the one you made".
                So it opens the built page, which keeps the live link in its
                corner. */}
            {showAdvanced && (
              <ActionCard
                title="Your 10 week sleep guide"
                body="Recommended from your results: a clinically guided programme to better rest, one week at a time."
                action={
                  <button
                    type="button"
                    aria-label="Open your sleep guide"
                    onClick={onOpenSleep}
                    className="flex items-center justify-center size-[44px] rounded-full cursor-pointer shrink-0"
                    style={{ background: "rgba(10,10,10,0.01)", border: "1px solid rgba(10,10,10,0.05)" }}
                  >
                    <CircleChevronRight size={16} color={CARD_BODY} strokeWidth={1.5} />
                  </button>
                }
              />
            )}
          </div>
        </div>
        <ProfileCard />
      </div>
    </>
  );
}

function UploadsBody({ showAdvanced, onOpenFile }: {
  /** True once the journey has passed the appointment: the advanced report
      row exists, and it arrives in front of the viewer. Janelle, 4 Sep: "show
      through motion animation that another result has been uploaded". */
  showAdvanced: boolean;
  onOpenFile: (file: typeof FILES[number]) => void;
}) {
  // The row mounts empty and appears a beat after the page, so its arrival is
  // seen rather than already there.
  const [advancedArrived, setAdvancedArrived] = useState(false);
  useEffect(() => {
    if (!showAdvanced) return;
    const timer = window.setTimeout(() => setAdvancedArrived(true), 900);
    return () => window.clearTimeout(timer);
  }, [showAdvanced]);

  const rows = showAdvanced && advancedArrived ? [ADVANCED_FILE, ...FILES] : FILES;

  return (
    <>
      {/* 27052:16061. Radius 5, px 36, pt 35, pb 14, flush under the tabs. */}
      <div
        className="bg-white rounded-[5px] px-[36px] pt-[35px] pb-[14px] w-full mt-[-21px]"
        style={{ filter: "drop-shadow(0px 0px 7.5px rgba(229,229,229,0.4))" }}
      >
        <div className="flex items-start justify-between w-full">
          <p className="text-[40px] leading-[48px] whitespace-nowrap" style={{ fontFamily: SS, fontWeight: 900, color: HEADING }}>
            Uploads
          </p>
          {/* 27052:16071. Work Sans on this one control, per the frame. */}
          <button
            type="button"
            className="h-[40px] rounded-[20px] pl-[30px] pr-[40px] cursor-pointer shrink-0"
            style={{ background: BLUE, border: `0.625px solid ${NAVY}` }}
          >
            <span className="font-bold text-[14px] leading-[40px] text-white" style={{ fontFamily: WS }}>
              Upload a file
            </span>
          </button>
        </div>
        {/* 27052:16069 */}
        <p className="text-[16px] leading-[26px] mt-[19px]" style={{ fontFamily: SS, color: BODY }}>
          Keep your patient record up-to-date by saving all your files, images and notes in one safe place.
        </p>
      </div>

      <div className="flex gap-[15px] items-start w-full">
        <div
          className="bg-white rounded-[5px] w-[562px] px-[20px] py-[14px]"
          style={{ filter: "drop-shadow(0px 0px 7.5px rgba(229,229,229,0.4))", fontFamily: SS }}
        >
          {rows.map((file) => (
            <div
              key={file.name}
              className="flex items-start gap-[14px] py-[20px]"
              style={{
                borderTop: `1px solid ${RULE}`,
                borderBottom: `1px solid ${RULE}`,
                animation: file === ADVANCED_FILE ? "uploadArrive 1600ms ease-out" : undefined,
              }}
            >
              <FileText size={16} color={NAVY} strokeWidth={2} className="shrink-0 mt-[2px]" />
              <button
                type="button"
                onClick={() => onOpenFile(file)}
                data-guide-primary={file === rows[0] || undefined}
                className="font-bold text-[14px] leading-[20px] w-[158px] shrink-0 text-left bg-transparent border-none p-0 cursor-pointer underline decoration-transparent hover:decoration-inherit"
                style={{ color: NAVY, fontFamily: "inherit" }}
              >
                {file.name}
              </button>
              <p className="text-[13px] leading-[20px] w-[132px] shrink-0 whitespace-nowrap" style={{ color: BODY }}>
                {file.when}
              </p>
              <div className="flex flex-col gap-[8px] text-[12px] leading-[18px] whitespace-nowrap" style={{ color: META }}>
                <p>{file.addedBy}</p>
                <p>{file.uploadedFor}</p>
              </div>
            </div>
          ))}
        </div>
        <ProfileCard />
      </div>
    </>
  );
}

/*
 * THE REPORT, IN A VIEWER.
 *
 * Janelle, 4 Sep: "when they click on the pdf uploads this is what they see,
 * the name is dermott can i have you edit it to Jane Smith (show a pdf viewer
 * too)". The PDF is hers, PreAssessReport1.pdf, 14 pages, with "Dermot Shortt"
 * rewritten to "Jane Smith" in all 15 places it appeared: the addressee, the
 * "Dear Dermot" greeting and the footer on every page. The rest of the document
 * is untouched, including the reference FHB74925A0 and the 01/01/1972 date of
 * birth, which are the sample report's own.
 *
 * The browser's own PDF toolbar is left on rather than hidden behind #toolbar=0.
 * It is a real viewer with working page navigation, zoom and download, and
 * drawing a fake toolbar over a document nobody can page through would be worse
 * than showing the real one.
 */
function PdfViewer({ name, pages, src, onClose }: { name: string; pages: number; src: string; onClose: () => void }) {
  return (
    // Wider than the portal's 782 column, by (1120 - 782) / 2 either side. The
    // viewer keeps its own thumbnail rail, which Chrome will not close for us
    // (it ignores #pagemode), so at column width the page itself is left about
    // 390px and unreadable.
    <div
      className="bg-white rounded-[5px] w-[1120px] -mx-[169px] overflow-hidden"
      style={{ filter: "drop-shadow(0px 0px 7.5px rgba(229,229,229,0.4))", fontFamily: SS }}
    >
      <div className="flex items-center justify-between px-[20px] py-[14px]" style={{ borderBottom: `1px solid ${RULE}` }}>
        <div className="flex items-center gap-[10px] min-w-0">
          <FileText size={16} color={NAVY} strokeWidth={2} className="shrink-0" />
          <p className="font-bold text-[14px] leading-[20px] truncate" style={{ color: NAVY }}>{name}</p>
          <p className="text-[12px] leading-[20px] shrink-0" style={{ color: META }}>{pages} pages</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          data-guide-primary
          className="flex items-center gap-[6px] bg-transparent border-none cursor-pointer p-0"
        >
          <ChevronLeft size={14} color={NAVY} strokeWidth={2.5} />
          <span className="font-bold text-[12px] leading-[20px]" style={{ color: NAVY }}>Back to uploads</span>
        </button>
      </div>
      <iframe src={src} title={name} className="w-full h-[900px] border-none block" />
    </div>
  );
}

export function Portal({ initialTab = "Uploads", showAdvanced = false, onOpenAssessments, onBookFollowUp, onOpenSleep }: {
  initialTab?: TabName;
  /** True when entered from the advanced results email: the advanced report
      row exists and animates in, and Home gains the follow-up and sleep
      cards. False at the pre-screen stage, where they would promise results
      from the future. */
  showAdvanced?: boolean;
  /** Opens the My health assessments screen (5048:37958), whose Continue
      journey runs the SSO into Full Health Medical. */
  onOpenAssessments: () => void;
  onBookFollowUp: () => void;
  onOpenSleep: () => void;
}) {
  const [tab, setTab] = useState<TabName>(initialTab);
  const [openFile, setOpenFile] = useState<typeof FILES[number] | undefined>(undefined);
  useScrollTop(tab, openFile);

  // Changing tab closes the document, so Uploads is never returned to with a
  // viewer still open over its list.
  function selectTab(next: TabName) {
    setOpenFile(undefined);
    setTab(next);
  }

  return (
    <>
      <PortalShell active={tab} onSelectTab={selectTab}>
        {tab === "Home" ? (
          <HomeBody showAdvanced={showAdvanced} onOpenAssessments={onOpenAssessments} onBookFollowUp={onBookFollowUp} onOpenSleep={onOpenSleep} />
        ) : openFile ? (
          <PdfViewer name={openFile.name} pages={openFile.pages} src={openFile.pdf} onClose={() => setOpenFile(undefined)} />
        ) : (
          <UploadsBody showAdvanced={showAdvanced} onOpenFile={setOpenFile} />
        )}
      </PortalShell>
    </>
  );
}
