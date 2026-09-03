import { useState, useRef, useEffect, type ReactNode } from "react";
import { captchaGate, CAPTCHA_MESSAGES } from "./captcha-gate";
import { isValidEmail } from "./email-address";
import {
  validateCreateAccount, DEMO_CREATE_ACCOUNT, EMAIL_ALREADY_REGISTERED, dobProblem, dobMessage, maskDobInput, padPastedDob,
  type CreateAccountErrors,
} from "./create-account";
import { validatePersonalDetails, isValidPostcode, DEMO_PERSONAL_DETAILS, type PersonalDetailsErrors } from "./personal-details";
import { validateContactInfo, DEMO_CONTACT_INFO, type ContactInfoErrors } from "./contact-info";
import { checkOtp, formatForDisplay, OTP_MESSAGES, RESEND_SECONDS, DEMO_WRONG_OTP } from "./mobile-otp";
import { validateGpDetails, DEMO_GP_DETAILS, GP_DECLINE_NOTE, type GpDetailsErrors, type GpChoice } from "./gp-details";
import { practiceLabel, findPractice, practicesNear, filterPractices } from "./gp-practices";
import { validateEmergencyContact, RELATIONSHIP_OPTIONS, DEMO_EMERGENCY_CONTACT, type EmergencyContactErrors, type EmergencyContactChoice } from "./emergency-contact";
import { PLAN_NOTICES, type PlanNotice } from "./plan-notices";
import { strengthOf, toneFor, messageFor, SEGMENTS, STRENGTH_COLOURS } from "./password-strength";
import { enterSubmits } from "./enter-submits";
import { AccountPlan, type AccountPlanBrand } from "./components/account-plan";
import { Toast, TOAST_DWELL_MS } from "./components/toast";
import { CountrySelect, FieldLabel } from "./components/country-select";
import { journeyForCode, JOURNEYS, type JourneyId } from "./journeys";
import { CORRECTION_COPY } from "./axa-correction-copy";
import { InvitationEmail } from "./invitation-email";
import { QuestionnaireScreen } from "./questionnaire-screen";
import { matchesPolicy, DEMO_POLICY_RECORD, type PolicyPlan } from "./axa-policy";
import { PaymentScreen } from "./components/payment-screen";
import { DEMO_PAYMENT } from "./payment";
import { activationCodeError, CODE_ERRORS, DEMO_CODES, type CodeErrorId } from "./activation-codes";
import {
  SsoFrontDoor,
  SsoWorkSignIn,
  SsoCoverFound,
  SsoExistingAccount,
  SsoReclaimLadder,
  SsoPolicyAdded,
  SsoConfirmDetails,
} from "./components/sso-screens";
import flagUk from "./assets/flag-uk.jpg";
// Assets live in src/assets rather than a Figma Make export dump. activationUI
// carried 215MB of src/imports for eleven files; this repo takes the eleven.
import svgPaths from "../assets/svg-paths";
import imgLhs1 from "../assets/slide-1-couple.jpg";
import imgLhs2 from "../assets/slide-2-group.jpg";
import imgLhs3 from "../assets/slide-3-woman.jpg";
import imgLhs4 from "../assets/slide-4-father-daughter.jpg";
import imgLhs5 from "../assets/slide-5-skipping.jpg";
import imgDoctorAvatar from "../assets/doctor-avatar.png";
import imgUKFlag from "../assets/uk-flag.png";
import imgCareLogo1 from "../assets/cqc-logo.png";
import imgTrustpilot from "../assets/trustpilot.png";
// Both of these are AXA-only and go with the AXA screens. See the README beside
// them: they exist so the first commit compiles unchanged, nothing more.
import d17SvgPaths from "../assets/axa-pending-removal/svg-paths";
import imgAxaLhs from "../assets/axa-pending-removal/lhs.jpg";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Search,
  ChevronDown,
  LoaderCircle,
  CircleUser,
  UserCheck,
  CheckCheck,
  ListTodo,
  MapPin,
  Captions,
  TriangleAlert,
  CircleCheckBig,
  Circle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Check,
  X,
  Eye,
  EyeOff,
  ArrowRight,
  ExternalLink,
  Info,
  User,
  Wrench,
  ChevronUp,
} from "lucide-react";

// ─── Exact logo components from Figma ────────────────────────────────────────

function LogoLayer() {
  return (
    <div className="absolute inset-[0.65%_10.81%_0_0.04%]" data-name="Layer 1">
      <svg
        className="absolute block inset-0 size-full"
        fill="none"
        height="35.7653"
        preserveAspectRatio="none"
        viewBox="0 0 122.932 35.7653"
        width="122.932"
      >
        <g id="Layer 1">
          <path d={svgPaths.p2a6c3980} fill="#FFB306" />
          <path d={svgPaths.p2eda5f80} fill="#FFB306" />
          <path d={svgPaths.pdf57f0} fill="url(#logo_grad)" />
        </g>
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="logo_grad"
            x1="5.2374"
            x2="30.5205"
            y1="30.5268"
            y2="5.24374"
          >
            <stop stopColor="#0E73DD" />
            <stop offset="0.18" stopColor="#1684DF" />
            <stop offset="0.47" stopColor="#219AE0" />
            <stop offset="0.74" stopColor="#27A7E2" />
            <stop offset="1" stopColor="#29ABE2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function LogoGroup() {
  return (
    <div className="absolute inset-[9.87%_0.11%_7.62%_29.61%]" data-name="Group">
      <svg
        className="absolute block inset-0 size-full"
        fill="none"
        height="29.7022"
        preserveAspectRatio="none"
        viewBox="0 0 96.9004 29.7022"
        width="96.9004"
      >
        <g>
          <path d={svgPaths.pedc1e00} fill="white" />
          <path d={svgPaths.p31f94e00} fill="white" />
          <path d={svgPaths.p27ad900} fill="white" />
          <path d={svgPaths.p3bfd2400} fill="white" />
          <path d={svgPaths.p369fbf80} fill="white" />
          <path d={svgPaths.p3de47100} fill="white" />
          <path d={svgPaths.p2ebe5970} fill="white" />
          <path d={svgPaths.p231ab580} fill="white" />
          <path d={svgPaths.pd85ab00} fill="white" />
          <path d={svgPaths.p34382df0} fill="white" />
          <path d={svgPaths.p60abc00} fill="white" />
          <path d={svgPaths.p328c8e00} fill="white" />
          <path d={svgPaths.p3041f280} fill="white" />
          <path d={svgPaths.p33936770} fill="white" />
          <path d={svgPaths.pc2dae00} fill="white" />
          <path d={svgPaths.p2453a200} fill="white" />
          <path d={svgPaths.p12dc1180} fill="white" />
          <path d={svgPaths.p293d8230} fill="white" />
        </g>
      </svg>
    </div>
  );
}

function Logo() {
  return (
    <div className="h-[36px] overflow-clip relative shrink-0 w-[137.895px]">
      <LogoLayer />
      <LogoGroup />
    </div>
  );
}

// ─── Brand system ─────────────────────────────────────────────────────────────

type BrandId = "dca" | "axa";
type BrandTheme = {
  id: BrandId;
  headerBg: string;
  carouselBarColor: string;
  lhsHeadingColor: string;
  stepperActiveColor: string;
  primaryColor: string;
  labelColor: string;
  inputBorderColor: string;
  joinNowBorderColor: string;
  footerBg: string;
  pageGradientMid: string;
  cardBorderColor: string;
  /** One photo for every carousel slide. Omit to use each slide's own photo. */
  lhsImage?: string;
  /** Partner shown in the Account plan band. */
  accountPlanBrand: AccountPlanBrand;
  /**
   * Whether Create account is followed by the payment step.
   *
   * Currently false for every brand. Payment belongs to the PAYG journey, which
   * is not built here (Janelle, 24 Aug), and none of the journeys that are built
   * pay us: AXA cover already includes the plan, and AXA Individual and SME are
   * vouchers where AXA collects the money. A lead on the DCA brand was being
   * told to "complete payment", which was the visible symptom.
   *
   * Kept as a flag rather than ripped out, because PAYG will want it back. The
   * payment screens themselves are untouched and still reachable from the
   * Payment entries in View states.
   */
  requiresPayment: boolean;
};
const BRAND_DCA: BrandTheme = {
  id: "dca", headerBg: "#135cff", carouselBarColor: "#ffb306",
  lhsHeadingColor: "#133595", stepperActiveColor: "#a2c4ff",
  primaryColor: "#135cff", labelColor: "#0f37be", inputBorderColor: "#b9daff",
  joinNowBorderColor: "#ffb306", footerBg: "#133595",
  pageGradientMid: "rgb(237,246,255)", cardBorderColor: "#d7e9ff",
  accountPlanBrand: "dca", requiresPayment: false,
};
const BRAND_AXA: BrandTheme = {
  id: "axa", headerBg: "#3f48ff", carouselBarColor: "#ff1721",
  lhsHeadingColor: "#0c0e45", stepperActiveColor: "#e2efff",
  primaryColor: "#3f48ff", labelColor: "#0c05d2", inputBorderColor: "#ced7ff",
  joinNowBorderColor: "#ff1721", footerBg: "#0c0e45",
  pageGradientMid: "rgb(241,244,255)", cardBorderColor: "#e5e9ff",
  lhsImage: imgAxaLhs,
  accountPlanBrand: "axa", requiresPayment: false,
};


function AxaHealthMark({ height = 36 }: { height?: number }) {
  const vw = 73.6722, vh = 31.1853;
  return (
    <svg fill="none" height={height} width={(vw / vh) * height} viewBox={`0 0 ${vw} ${vh}`} style={{ display: "block" }}>
      <path d={d17SvgPaths.p308fc200} fill="#00008F" />
      <path d={d17SvgPaths.p39bf1a40} fill="#FF1721" />
      <path d={d17SvgPaths.p275fab80} fill="white" />
      <path d={d17SvgPaths.p276d8a00} fill="white" />
      <path d={d17SvgPaths.p6c52300} fill="white" />
      <path d={d17SvgPaths.p92b600} fill="white" />
      <path d={d17SvgPaths.p6bf7180} fill="white" />
      <path d={d17SvgPaths.p3f3531c0} fill="white" />
      <path d={d17SvgPaths.p131cfe80} fill="white" />
    </svg>
  );
}

function AxaHeaderLogo() {
  return (
    <div className="flex items-center gap-[12px] shrink-0">
      <AxaHealthMark height={30} />
      <div className="w-px h-[22px] shrink-0 opacity-30" style={{ background: "white" }} />
      <div className="shrink-0 overflow-hidden" style={{ width: 110, height: 29 }}>
        <div style={{ transform: "scale(0.8)", transformOrigin: "top left" }}>
          <Logo />
        </div>
      </div>
    </div>
  );
}

// ─── Header (exact from Figma) ────────────────────────────────────────────────

// NO BRAND TOGGLE AND NO VIEW STATES BUTTON. Both were activationUI's dev
// affordances: one flipped the prototype between the DCA and AXA arms, the
// other opened a picker of error states. Health assessments has one brand and,
// per Janelle 2 Sep, is the happy path only on its own repo and its own link,
// so neither has anything to point at.
function Header({ brand, onExit }: {
  brand: BrandId;
  onExit: () => void;
}) {
  return (
    <div className="content-stretch flex flex-col isolate items-start relative shrink-0 w-full z-40" style={{ position: "sticky", top: 0 }}>
      {/* Primary bar */}
      <div className="h-[64px] relative shrink-0 w-full z-[2]" style={{ background: brand === "axa" ? "#3f48ff" : "#135cff" }}>
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex items-center justify-between px-[24px] py-[8px] relative size-full">
            {brand === "axa" ? <AxaHeaderLogo /> : <Logo />}
            <div className="flex items-center gap-[12px]">
              <div className="bg-[rgba(255,255,255,0)] content-stretch flex gap-[4px] items-center justify-center relative rounded-[9999px] shrink-0 cursor-pointer" onClick={onExit}>
                <div
                  className="flex flex-col font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#edf6ff] text-[14px] whitespace-nowrap"
                  style={{ fontFamily: "'Work Sans', sans-serif" }}
                >
                  <p className="leading-[20px]">Exit</p>
                </div>
                <div className="overflow-clip relative shrink-0 size-[16px]">
                  <div className="absolute inset-1/4">
                    <div className="absolute inset-[-8.31%]">
                      <svg className="block size-full" fill="none" height="9.33" preserveAspectRatio="none" viewBox="0 0 9.33 9.33" width="9.33">
                        <path
                          d={svgPaths.p2d1e680}
                          stroke="#EDF6FF"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.33"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Secondary bar */}
      <div className="bg-[#0f37be] relative shrink-0 w-full z-[1]">
        <div className="flex flex-row items-center justify-center size-full">
          <div className="content-stretch flex gap-[10px] items-center justify-between px-[24px] py-[4px] relative size-full">
            <div className="content-center flex flex-1 flex-wrap gap-[4px] items-center justify-end min-w-px relative">
              <p
                className="font-normal leading-[20px] not-italic relative shrink-0 text-[#edf6ff] text-[14px] whitespace-nowrap"
                style={{ fontFamily: "'Work Sans', sans-serif" }}
              >
                Already have an account?
              </p>
              <div className="bg-[rgba(255,255,255,0)] content-stretch flex gap-[4px] items-center justify-center relative rounded-[9999px] shrink-0 cursor-pointer">
                <div
                  className="flex flex-col font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#edf6ff] text-[14px] whitespace-nowrap"
                  style={{ fontFamily: "'Work Sans', sans-serif" }}
                >
                  <p className="leading-[20px]">Log in</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LHS carousel ────────────────────────────────────────────────────────────

// Copy and photography both from the Health assessments file, section
// 5066:125326 "Sign up or in - Web", the five Landing page frames at x=100.
// Slide order is the file's, not the order the images were sent in chat: the
// file opens on the couple, the chat message opened on the group. A carousel is
// a loop so only the first slide actually differs, and the file wins.
const CAROUSEL_SLIDES = [
  {
    // 5066:125327
    heading: "See the full picture of your health",
    sub: "Clinician-reviewed results. Not just raw data.",
    img: imgLhs1,
  },
  {
    // 5066:125410
    heading: "Find the right assessment for you",
    sub: "From heart health and hormones to overall wellbeing. Each assessment is clinically designed.",
    img: imgLhs2,
  },
  {
    // 5066:125466
    heading: "Get answers you can actually use",
    sub: "Every result is reviewed by a UK-licensed clinician, with clear next steps and optional GP follow-up.",
    img: imgLhs3,
  },
  {
    // 5066:125501
    heading: "Book around your life, not the other way round",
    sub: "150+ UK locations. Appointments within three days, evenings and weekends included.",
    img: imgLhs4,
  },
  {
    // 5066:125536
    heading: "Know where you stand, and what to do next",
    sub: "If anything needs attention, we'll contact you directly.",
    img: imgLhs5,
  },
];

// ─── Landing steps ───────────────────────────────────────────────────────────

// 5747:27062. The four things that happen after Get started, in the file's
// order and words. Icons are the ones the frame names, not chosen here.
const LANDING_STEPS = [
  // 5066:125346
  { Icon: CircleUser, text: "Create your account and tell us a bit about you." },
  // 5066:125350
  { Icon: UserCheck, text: "Fill in a short lifestyle questionnaire to help us assess your current health." },
  // 5446:12374
  { Icon: CheckCheck, text: "Receive your results and recommended next steps." },
  // 5446:12622
  { Icon: MapPin, text: "If advised to book an Advanced Corporate Health Assessment, you can easily schedule your appointment at a nearby location." },
];

// Slide duration must match lhsBarFill animation duration in fonts.css
const SLIDE_DURATION_MS = 7000;
const SLIDE_FADE_MS = 350;
// How long the correction screen sits on "Validating..." before answering.
// Long enough to read as a check that ran, short enough not to feel stuck.
const VALIDATING_MS = 1200;

function LhsPanel({ theme }: { theme: BrandTheme }) {
  const [slide, setSlide] = useState(0);
  const [fading, setFading] = useState(false);

  /*
   * One cycle per slide, rescheduled whenever `slide` changes.
   *
   * THE HEADING WAS INVISIBLE because `fading` could be stranded at true. The
   * old version ran a setInterval whose inner setTimeout did
   * `if (!alive) return` BEFORE `setFading(false)`. Anything that ran the
   * cleanup inside that 350ms window killed the only line that turns fading
   * back off, and the text block renders `opacity: 0` for the whole of
   * fading === true. Measured on the landing: opacity 0 for 8 seconds straight,
   * animation none. Not a flicker, a permanent blank.
   *
   * Every timer here is owned by the effect and cleared on the way out, and
   * cleanup also forces fading false, so there is no window in which it can
   * survive. Clicking a bar just sets the slide: the effect restarts, the text
   * block remounts on key={slide} and replays lhsTextIn, so it still animates
   * in without a second, racing fade of its own.
   */
  useEffect(() => {
    const out = window.setTimeout(() => setFading(true), SLIDE_DURATION_MS - SLIDE_FADE_MS);
    const swap = window.setTimeout(() => {
      setSlide((s) => (s + 1) % CAROUSEL_SLIDES.length);
      setFading(false);
    }, SLIDE_DURATION_MS);
    return () => {
      window.clearTimeout(out);
      window.clearTimeout(swap);
      setFading(false);
    };
  }, [slide]);

  function goTo(i: number) {
    if (i === slide) return;
    setSlide(i);
  }

  const slides = theme.lhsImage
    ? CAROUSEL_SLIDES.map((s) => ({ ...s, img: theme.lhsImage! }))
    : CAROUSEL_SLIDES;
  const content = slides[slide];

  // The slide that was showing before this one, so it can be held at full
  // opacity underneath while the new one fades in over it. A ref, not state:
  // it must still read as the OLD value during the render where `slide`
  // changed, and it must not cause a render of its own.
  const outgoing = useRef(slide);
  useEffect(() => { outgoing.current = slide; }, [slide]);

  return (
    <div className="bg-white content-stretch flex flex-[1_0_0] flex-col items-start justify-end min-w-px relative self-stretch flex min-h-[384px] md:min-h-0 overflow-hidden rounded-b-[32px] md:rounded-b-none">

      {/* Images — two-layer: outer handles crossfade, inner handles Ken Burns */}
      {slides.map((s, i) => {
        const isActive = i === slide;
        // ONLY EVER FADE IN. Both layers used to cross-animate at once, so at
        // the midpoint each sat near 0.5 over a white container and about a
        // quarter of the white came through: the photo visibly greyed out every
        // time the carousel turned. Holding the outgoing slide opaque
        // underneath keeps total coverage at 1 throughout, so the blend is
        // photo-over-photo and never photo-over-white.
        const isOutgoing = i === outgoing.current && i !== slide;
        return (
          // Outer: always mounted, opacity crossfade only — no remount
          <div
            key={i}
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: isActive || isOutgoing ? 1 : 0,
              zIndex: isActive ? 1 : 0,
              // The fade belongs to the incoming layer. Transitioning the
              // outgoing one is exactly what reintroduces the dip.
              transition: isActive ? "opacity 1.1s ease" : "none",
            }}
          >
            {/*
              Inner: key changes when this slide becomes active → remounts →
              Ken Burns animation restarts from the beginning every time.
            */}
            <div
              key={isActive ? `kb-${slide}` : `kb-idle-${i}`}
              className="absolute inset-0"
              style={{
                animation: isActive
                  ? `lhsKenBurns ${SLIDE_DURATION_MS}ms ease-out forwards`
                  : "none",
              }}
            >
              <img
                alt=""
                className="absolute inset-0 max-w-none object-cover size-full"
                src={s.img}
              />
            </div>
          </div>
        );
      })}

      {/* Landing content wrapper — design spec: single gradient + 5px blur.
          No additional scrim: the earlier build stacked a 0.97 wash and a solid
          bottom scrim on top, which erased the photo behind the text.

          z-[2] IS LOAD BEARING. The images above carry z-index 1 while active,
          so the crossfade can hold the outgoing slide underneath the incoming
          one. A positive z-index beats a later sibling sitting at auto,
          whatever the DOM order, so without this the active photo paints over
          this whole block and the blur, the heading and the progress bars
          disappear. That is exactly what it did between c16ca12 and here. */}
      <div className="relative shrink-0 w-full z-[2]">
        {/* Blur is masked to fade in with the wash. Figma applies backdrop blur to
            the whole frame, but CSS has no gradient backdrop-filter, so an
            unmasked layer leaves a hard blur line across the photo. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
          }}
        />
        {/* 0.9, straight off Janelle's Figma CSS for the landing content
            wrapper. I briefly made this 0.5 on the strength of opacity/opacity-50
            appearing in this node's variables; that token is the INACTIVE
            PROGRESS BAR SECTION, which her export shows at opacity 0.5, not the
            wash. The exported rule is the authority:
              background: linear-gradient(180deg,
                rgba(237,246,255,0) 0%, rgba(237,246,255,0.9) 40%);
            The wash looks heavy when the heading wraps to two lines, because the
            wrapper is 112 top + content + 36 bottom and grows with the text: at
            one line it is the 298 the frame draws, at two it is 342. The gradient
            is right; the block under it is taller than the frame's. */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(237,246,255,0) 0%, rgba(237,246,255,0.9) 40%)" }}
        />

        <div className="relative flex flex-col justify-end size-full">
          <div className="content-stretch flex flex-col gap-[24px] items-start justify-end pb-[36px] pt-[76px] md:pt-[112px] px-[24px] relative size-full">
            <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">

              {/*
                Text block — key=slide forces remount on slide change so
                lhsTextIn animation always restarts from scratch.
                fading drives a rapid opacity-out before the remount.
              */}
              <div
                key={slide}
                className="content-stretch flex flex-col gap-[4px] items-start justify-end relative shrink-0 w-full"
                style={{
                  opacity: fading ? 0 : undefined,
                  transition: fading ? `opacity ${SLIDE_FADE_MS}ms ease` : "none",
                  animation: fading ? "none" : `lhsTextIn 0.55s ease forwards`,
                }}
              >
                <p
                  className="[word-break:break-word] flex-[1_0_0] leading-[36px] md:leading-[44px] min-w-px not-italic relative text-[32px] md:text-[40px] w-full"
                  style={{ color: theme.lhsHeadingColor, fontFamily: "'Work Sans', sans-serif", fontWeight: 600 }}
                >
                  {content.heading}
                </p>
                <p
                  className="[word-break:break-word] flex-[1_0_0] leading-[20px] md:leading-[24px] min-w-px not-italic relative text-[#030712] text-[14px] md:text-[16px] w-full"
                  style={{ fontFamily: "'Work Sans', sans-serif", fontWeight: 400 }}
                >
                  {content.sub}
                </p>
              </div>

              {/* Progress bar strip — clicking any segment advances to next slide */}
              <div className="content-stretch flex gap-[4px] items-start relative shrink-0 w-full">
                {CAROUSEL_SLIDES.map((_, i) => {
                  const isActive = i === slide;
                  return (
                    <button
                      key={i}
                      onClick={() => goTo((slide + 1) % CAROUSEL_SLIDES.length)}
                      aria-label="Next slide"
                      className="flex-[1_0_0] min-w-px relative cursor-pointer group"
                      style={{ opacity: isActive ? 1 : 0.45, transition: "opacity 0.5s" }}
                    >
                      {/* Track */}
                      <div
                        className="h-[6px] rounded-[9999px] w-full relative overflow-hidden transition-transform group-hover:scale-y-[1.4]"
                        style={{ background: "#4b5563", transformOrigin: "bottom" }}
                      >
                        {/* Yellow fill sweeps across on active slide */}
                        {isActive && (
                          <div
                            key={slide}
                            className="absolute inset-y-0 left-0 h-full rounded-[9999px]"
                            style={{
                              background: theme.carouselBarColor,
                              animation: `lhsBarFill ${SLIDE_DURATION_MS}ms linear forwards`,
                            }}
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Countries ────────────────────────────────────────────────────────────────


// ─── Shared design-system primitives ─────────────────────────────────────────


function TextInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  required,
  error,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div className="w-full">
      <FieldLabel label={label} required={required} />
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-[44px] px-[16px] text-[14px] rounded-[8px] bg-white outline-none transition-shadow"
          style={{
            border: `1px solid ${error ? "#991b1b" : "#b9daff"}`,
            boxShadow: "0px 1px 2px 0px rgba(15,55,190,0.05)",
            fontFamily: "'Work Sans', sans-serif",
            color: "#030712",
          }}
        />
      </div>
      {error && (
        <div className="flex items-center gap-[6px] mt-[6px]">
          <AlertCircle size={14} color="#991b1b" />
          <span
            className="text-[13px] font-semibold"
            style={{ color: "#991b1b", fontFamily: "'Work Sans', sans-serif" }}
          >
            {error}
          </span>
        </div>
      )}
    </div>
  );
}


// ─── Exact button styles from Figma ──────────────────────────────────────────

function PrimaryButton({
  label,
  onClick,
  loading,
  disabled,
}: {
  label: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full h-[48px] rounded-[9999px] font-semibold text-[14px] flex items-center justify-center gap-[8px]"
      style={{
        background: disabled ? "#9ca3af" : "#135cff",
        color: "#edf6ff",
        fontFamily: "'Work Sans', sans-serif",
        boxShadow: "0px 4px 3px rgba(15,55,190,0.05), 0px 2px 2px rgba(15,55,190,0.05)",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {label}
    </button>
  );
}

function GhostLinkButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-center text-[14px] font-semibold py-[8px]"
      style={{ color: "#135cff", fontFamily: "'Work Sans', sans-serif" }}
    >
      {label}
    </button>
  );
}

// ─── Inline link pair (from Figma) ────────────────────────────────────────────

function InlineLinkRow({ prefix, linkLabel, linkColor, onClick, href }: {
  prefix: string; linkLabel: string; linkColor?: string; onClick?: () => void; href?: string;
}) {
  return (
    <div className="content-center flex flex-wrap gap-[4px] items-center relative shrink-0 w-full">
      <p
        className="font-normal leading-[20px] not-italic relative shrink-0 text-[#4b5563] text-[14px] whitespace-nowrap"
        style={{ fontFamily: "'Work Sans', sans-serif" }}
      >
        {prefix}
      </p>
      <div
        className="bg-[rgba(255,255,255,0)] content-stretch flex gap-[4px] items-center justify-center relative rounded-[9999px] shrink-0 cursor-pointer"
        onClick={onClick}
      >
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold leading-[20px] text-[14px] whitespace-nowrap"
            style={{ color: linkColor ?? "#135cff", fontFamily: "'Work Sans', sans-serif" }}
          >
            {linkLabel}
          </a>
        ) : (
          <span
            className="font-semibold leading-[20px] text-[14px] whitespace-nowrap"
            style={{ color: linkColor ?? "#135cff", fontFamily: "'Work Sans', sans-serif" }}
          >
            {linkLabel}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Get Support Modal (Desktop-22) ──────────────────────────────────────────

function GetSupportModal({ onClose, linkColor }: { onClose: () => void; linkColor?: string }) {
  const ws = "'Work Sans', sans-serif";
  const color = linkColor ?? "#135cff";
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-[24px] py-[48px]"
      style={{ background: "rgba(10,10,10,0.3)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white relative rounded-[16px] w-full max-w-[440px]"
        style={{
          border: "1px solid #d7e9ff",
          boxShadow: "0px 10px 15px -3px rgba(15,55,190,0.08), 0px 4px 6px -4px rgba(15,55,190,0.05)",
        }}
      >
        <div className="flex flex-col gap-[16px] p-[24px]" style={{ fontFamily: ws }}>
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-[16px] right-[16px] flex items-center justify-center w-[28px] h-[28px] rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* Icon */}
          <div className="flex items-center justify-center w-[44px] h-[44px] rounded-full shrink-0" style={{ background: "#1f2937" }}>
            <Info size={22} color="white" strokeWidth={1.75} />
          </div>

          {/* Title + sub */}
          <div className="flex flex-col gap-[4px]">
            <p className="text-[18px] font-semibold leading-[28px]" style={{ color: "#030712" }}>
              Activation code support
            </p>
            <p className="text-[14px] leading-[20px]" style={{ color: "#4b5563" }}>
              We're here to help you get started.
            </p>
          </div>

          {/* Body */}
          <p className="text-[14px] leading-[20px]" style={{ color: "#4b5563" }}>
            Use this option to activate your account if you have been provided access by one of the following:
          </p>
          <ul className="flex flex-col gap-[4px] pl-[4px]" style={{ listStyle: "none" }}>
            {["Your health insurance provider", "Your employer", "Your holiday insurance provider", "Your telecoms provider", "A family member"].map((item) => (
              <li key={item} className="flex items-center gap-[8px] text-[14px] leading-[20px]" style={{ color: "#4b5563" }}>
                <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: "#4b5563" }} />
                {item}
              </li>
            ))}
          </ul>

          {/* Need support link */}
          <div className="flex flex-col gap-[2px] pt-[4px]">
            <p className="text-[13px] leading-[20px]" style={{ color: "#6b7280" }}>Need support?</p>
            <a
              href="https://doctorcareanywhere.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] font-semibold leading-[20px]"
              style={{ color }}
            >
              Contact the Patient Experience team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Request a Reminder Modal (Desktop-23) ────────────────────────────────────

function ReminderModal({ onClose, linkColor }: { onClose: () => void; linkColor?: string }) {
  const ws = "'Work Sans', sans-serif";
  const color = linkColor ?? "#135cff";
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleSubmit() {
    if (!email.trim()) {
      // 1946:149548, the same string create-account.ts uses. Kept identical on
      // purpose: two copies of one frame's sentence had already drifted apart.
      setEmailError("Please provide your email.");
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setSuccess(true);
  }

  const cardStyle = {
    border: "1px solid #d7e9ff",
    boxShadow: "0px 10px 15px -3px rgba(15,55,190,0.08), 0px 4px 6px -4px rgba(15,55,190,0.05)",
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-[24px] py-[48px]"
      style={{ background: "rgba(10,10,10,0.3)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white relative rounded-[16px] w-full max-w-[440px]" style={cardStyle}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-[16px] right-[16px] flex items-center justify-center w-[28px] h-[28px] rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {success ? (
          /* ── Success state (Desktop-24) ── */
          <div className="flex flex-col gap-[16px] p-[24px]" style={{ fontFamily: ws }}>
            <div className="flex items-center justify-center w-[44px] h-[44px] rounded-full shrink-0" style={{ background: "#166534" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-[18px] font-semibold leading-[28px]" style={{ color: "#030712" }}>
              Request a reminder
            </p>
            <p className="text-[14px] leading-[20px]" style={{ color: "#4b5563" }}>
              If we recognise your email address we will send you a reminder of your activation code shortly.
            </p>
            <div className="flex flex-col gap-[2px] pt-[4px]">
              <p className="text-[13px] leading-[20px]" style={{ color: "#6b7280" }}>Need support?</p>
              <a href="https://doctorcareanywhere.com/contact" target="_blank" rel="noopener noreferrer"
                className="text-[14px] font-semibold leading-[20px]" style={{ color }}>
                Contact the Patient Experience team
              </a>
            </div>
          </div>
        ) : (
          /* ── Form state (Desktop-23) ── */
          <div className="flex flex-col gap-[20px] p-[24px]" style={{ fontFamily: ws }}>
            <p className="text-[18px] font-semibold leading-[28px]" style={{ color: "#030712" }}>
              Request a reminder
            </p>
            <p className="text-[14px] leading-[20px]" style={{ color: "#4b5563" }}>
              If your email is associated with an activation code, you will receive an email shortly (please remember to also check your spam folder). If the email doesn't arrive within a few minutes, or you simply need more help signing up, the Patient Experience team is here for you.
            </p>

            {/* Email field */}
            <div className="flex flex-col gap-[8px]">
              <div className="relative w-full">
                <div className="absolute flex items-center gap-[4px] px-[4px] z-10" style={{ top: -10, left: 12, background: "white" }}>
                  <span className="text-[14px] font-semibold leading-[20px]" style={{ color: emailError ? "#991b1b" : color }}>Email</span>
                  <span className="text-[14px] font-semibold leading-[20px]" style={{ color: "#991b1b" }}>*</span>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  placeholder="name@domain.com"
                  className="w-full h-[44px] px-[16px] rounded-[8px] text-[14px] outline-none bg-white"
                  style={{
                    border: `1px solid ${emailError ? "#991b1b" : "#b9daff"}`,
                    fontFamily: ws,
                    color: email ? "#030712" : "#4b5563",
                    boxShadow: "0px 1px 2px 0px rgba(15,55,190,0.05)",
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>
              {emailError && (
                <div className="flex gap-[8px] items-start">
                  <AlertCircle size={20} color="#991b1b" strokeWidth={1.67} className="shrink-0" />
                  <p className="text-[14px] font-semibold leading-[20px]" style={{ color: "#991b1b", fontFamily: ws }}>
                    {emailError}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom row */}
            <div className="flex flex-wrap items-end justify-between gap-[16px]">
              <div className="flex flex-col gap-[2px]">
                <p className="text-[13px] leading-[20px]" style={{ color: "#6b7280" }}>Need support?</p>
                <a href="https://doctorcareanywhere.com/contact" target="_blank" rel="noopener noreferrer"
                  className="text-[14px] font-semibold leading-[20px]" style={{ color }}>
                  Contact the Patient Experience team
                </a>
              </div>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-[8px] px-[20px] py-[10px] rounded-[9999px] text-white text-[14px] font-semibold whitespace-nowrap shrink-0"
                style={{ background: color, fontFamily: ws }}
              >
                Request code reminder
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Exit Confirmation Modal (Desktop-25) ─────────────────────────────────────

function ExitConfirmModal({ onExit, onCancel, primaryColor }: {
  onExit: () => void; onCancel: () => void; primaryColor?: string;
}) {
  const ws = "'Work Sans', sans-serif";
  const color = primaryColor ?? "#135cff";
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-[24px] py-[48px]"
      style={{ background: "rgba(10,10,10,0.3)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        className="bg-white relative rounded-[16px] w-full max-w-[400px]"
        style={{
          border: "1px solid #d7e9ff",
          boxShadow: "0px 10px 15px -3px rgba(15,55,190,0.08), 0px 4px 6px -4px rgba(15,55,190,0.05)",
        }}
      >
        <button
          onClick={onCancel}
          className="absolute top-[16px] right-[16px] flex items-center justify-center w-[28px] h-[28px] rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="flex flex-col gap-[20px] p-[24px]" style={{ fontFamily: ws }}>
          <div className="flex flex-col gap-[8px]">
            <p className="text-[18px] font-semibold leading-[28px]" style={{ color: "#030712" }}>Exit sign up</p>
            <p className="text-[14px] leading-[20px]" style={{ color: "#4b5563" }}>
              Are you sure you want to exit the sign up process?
            </p>
          </div>
          <div className="flex gap-[12px] items-center justify-end">
            <button
              onClick={onExit}
              className="px-[20px] py-[10px] rounded-[9999px] text-[14px] font-semibold bg-white"
              style={{ border: `1px solid ${color}`, color: color, fontFamily: ws }}
            >
              Exit
            </button>
            <button
              onClick={onCancel}
              className="px-[20px] py-[10px] rounded-[9999px] text-[14px] font-semibold text-white"
              style={{ background: color, fontFamily: ws }}
            >
              Continue sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Cloudflare Turnstile mock widget ────────────────────────────────────────

import type { CaptchaStatus } from "./captcha-gate";

// Cloudflare's official test sitekeys — valid on any domain, no account needed.
const TURNSTILE_SITEKEYS = {
  pass:      "1x00000000000000000000AA", // visible widget, always passes
  block:     "2x00000000000000000000AB", // visible widget, always blocks
  challenge: "3x00000000000000000000FF", // forces the interactive checkbox
} as const;

type CaptchaMode = keyof typeof TURNSTILE_SITEKEYS;

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

// A real Turnstile pass lasts 5 minutes. Shortened here so expiry is demonstrable.
const DEMO_EXPIRY_MS = 30_000;
const SIM_VERIFY_MS = 1_500;

type ScriptState = "loading" | "ready" | "failed";

// Loads Cloudflare's script once. "failed" is what drives the simulated fallback.
function useTurnstileScript(): ScriptState {
  const [state, setState] = useState<ScriptState>(
    () => (typeof window !== "undefined" && (window as any).turnstile ? "ready" : "loading"),
  );

  useEffect(() => {
    if (state === "ready") return;
    let cancelled = false;
    const settle = () => {
      if (!cancelled) setState((window as any).turnstile ? "ready" : "failed");
    };
    // turnstile is a global singleton, so reuse the tag rather than double-registering
    let tag = document.querySelector<HTMLScriptElement>("script[data-turnstile]");
    if (!tag) {
      tag = document.createElement("script");
      tag.src = TURNSTILE_SRC;
      tag.async = true;
      tag.defer = true;
      tag.dataset.turnstile = "true";
      document.head.appendChild(tag);
    }
    tag.addEventListener("load", settle);
    tag.addEventListener("error", settle);
    // A blocked request can fire neither event, so time out into the fallback
    const timer = setTimeout(settle, 6000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      tag?.removeEventListener("load", settle);
      tag?.removeEventListener("error", settle);
    };
  }, []);

  return state;
}

type TurnstileEvent =
  | { type: "running" }
  | { type: "success"; token: string }
  | { type: "failed" };

// The real widget. Bumping runKey re-renders it, which is how Validate retries.
function RealTurnstile({ mode, runKey, onEvent }: {
  mode: CaptchaMode;
  runKey: number;
  onEvent: (e: TurnstileEvent) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const idRef = useRef<string | undefined>(undefined);
  // Keeps the latest handler without re-rendering the widget on every parent update
  const cbRef = useRef(onEvent);
  cbRef.current = onEvent;

  useEffect(() => {
    const ts = (window as any).turnstile;
    const host = hostRef.current;
    if (!ts || !host) return;

    cbRef.current({ type: "running" });
    try {
      idRef.current = ts.render(host, {
        sitekey: TURNSTILE_SITEKEYS[mode],
        size: "normal",
        callback: (token: string) => cbRef.current({ type: "success", token }),
        "error-callback": () => { cbRef.current({ type: "failed" }); return true; },
        "timeout-callback": () => cbRef.current({ type: "failed" }),
        // Mirrors real behaviour: an expired pass quietly re-runs itself
        "expired-callback": () => {
          cbRef.current({ type: "running" });
          if (idRef.current) { try { ts.reset(idRef.current); } catch { /* widget already gone */ } }
        },
      });
    } catch {
      cbRef.current({ type: "failed" });
    }

    return () => {
      if (idRef.current) { try { ts.remove(idRef.current); } catch { /* already removed */ } }
      idRef.current = undefined;
    };
  }, [mode, runKey]);

  // Test sitekeys force a "For testing only" strip into Turnstile's closed shadow
  // root. It cannot be styled away, and clipping it crops Cloudflare's own
  // border, so the real widget is shown as-is and the simulation is the default.
  return <div ref={hostRef} style={{ width: "100%", maxWidth: 288, flexShrink: 0 }} />;
}

function CloudflareLogo() {
  const ws = "'Work Sans', sans-serif";
  return (
    <div className="flex flex-col gap-[2px] items-end shrink-0 overflow-hidden">
      {/* cf-logo-row */}
      <div className="flex items-center gap-[3px]">
        {/* cloud icon exactly 15×15 */}
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ display: "block", flexShrink: 0 }}>
          <path d="M11.77 10.5H3.75C2.51 10.5 1.5 9.49 1.5 8.25C1.5 7.11 2.33 6.17 3.43 6.02C3.4 5.85 3.38 5.68 3.38 5.5C3.38 3.98 4.6 2.75 6.13 2.75C7.09 2.75 7.93 3.24 8.42 3.99C8.7 3.81 9.03 3.69 9.38 3.69C10.33 3.69 11.11 4.43 11.18 5.37C11.24 5.35 11.31 5.34 11.38 5.34C12.31 5.34 13.07 6.1 13.07 7.04C13.07 7.53 12.86 7.97 12.52 8.28C12.69 8.53 12.79 8.83 12.79 9.16C12.79 9.93 12.36 10.5 11.77 10.5Z" fill="#F38020"/>
        </svg>
        <span className="font-semibold whitespace-nowrap" style={{ fontSize: 10, letterSpacing: "0.4px", color: "#404041", fontFamily: ws }}>CLOUDFLARE</span>
      </div>
      {/* Privacy · Terms */}
      <span className="whitespace-nowrap" style={{ fontSize: 8, color: "#999", fontFamily: ws }}>Privacy · Terms</span>
    </div>
  );
}

function TurnstileShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="shrink-0"
      style={{ width: "100%", maxWidth: 288, height: 65, borderRadius: 3, background: "#fafafa", border: "1px solid #e0e0e0", display: "flex", alignItems: "center" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, width: "100%", padding: 12 }}>
        {children}
      </div>
    </div>
  );
}

// Status messaging, per Figma node 2197:121387. Icon column + content column,
// 8px padding, 8px gap, 4px between lines. Fill is the design's white-over-red
// double gradient, which resolves to #fffbfb.
// The AXA "we are unable to validate" states (2171:121762, 2171:121778). Amber
// rather than red because the account IS saved: nothing was lost, something has
// to be corrected. Sits inline, at x=0 in the frames, next to the fields it is
// asking about. Colours sampled from the rendered frame.
function InlineWarningBox({ title, body, children }: {
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  const ws = "'Work Sans', sans-serif";
  return (
    <div
      className="flex gap-[8px] items-start w-full rounded-[8px] p-[8px]"
      style={{ border: "1px solid #92400e", background: "#fffef9" }}
      role="alert"
    >
      <TriangleAlert size={20} color="#92400e" strokeWidth={1.67} className="shrink-0" />
      <div className="flex flex-col gap-[4px] flex-1 min-w-0">
        <span className="text-[12px] font-semibold leading-[16px]" style={{ color: "#92400e", fontFamily: ws }}>
          {title}
        </span>
        <p className="text-[12px] font-normal leading-[16px]" style={{ color: "#92400e", fontFamily: ws }}>
          {body}
        </p>
        {children}
      </div>
    </div>
  );
}

function InlineErrorBox({ title, body, children }: {
  title: string;
  body?: string;
  children?: React.ReactNode;
}) {
  const ws = "'Work Sans', sans-serif";
  return (
    <div
      className="flex gap-[8px] items-start w-full rounded-[8px] p-[8px]"
      style={{ border: "1px solid #991b1b", background: "#fffbfb" }}
      role="alert"
    >
      <AlertCircle size={20} color="#991b1b" strokeWidth={1.67} className="shrink-0" />
      <div className="flex flex-col gap-[4px] flex-1 min-w-0">
        <span className="text-[12px] font-semibold leading-[16px]" style={{ color: "#991b1b", fontFamily: ws }}>
          {title}
        </span>
        {body && (
          <p className="text-[12px] font-normal leading-[16px]" style={{ color: "#991b1b", fontFamily: ws }}>
            {body}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

function CaptchaWidget({ status, onTick, onRetry, theme }: {
  status: CaptchaStatus;
  onTick: () => void;
  onRetry: () => void;
  theme?: BrandTheme;
}) {
  const ws = "'Work Sans', sans-serif";
  const linkColor = theme?.primaryColor ?? "#135cff";

  // ── Load error: the design replaces the widget with our own boxed error ─────
  if (status === "load-error") {
    return <InlineErrorBox title="Captcha failed to load" body="Please try again." />;
  }

  // ── Verifying / challenge / success ─────────────────────────────────────────
  if (status === "failed") {
    return (
      <TurnstileShell>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="8" cy="8" r="7" fill="#c0392b" />
            <path d="M8 4.5v4M8 11h.01" stroke="white" strokeLinecap="round" strokeWidth="1.6" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={{ fontSize: 14, fontFamily: ws, color: "#1a1a1a", whiteSpace: "nowrap" }}>
              Verification failed
            </span>
            <button
              type="button"
              onClick={onRetry}
              style={{ fontSize: 14, fontFamily: ws, color: "#1a1a1a", textDecoration: "underline", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
            >
              Troubleshoot
            </button>
          </div>
        </div>
        <CloudflareLogo />
      </TurnstileShell>
    );
  }

  const isChallenge = status === "challenge";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
    <TurnstileShell>
      {/* LHS */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {status === "success" ? (
          <div style={{ width: 26, height: 26, borderRadius: 13, background: "#166534", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="10" viewBox="0 0 12.667 9.333" fill="none">
              <path d="M11.333 1L4.5 7.833 1.333 4.667" stroke="#F0FDF4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
        ) : isChallenge ? (
          <button
            type="button"
            onClick={onTick}
            aria-label="Verify you are human"
            style={{ width: 16, height: 16, borderRadius: 4, border: "1px solid #b9daff", background: "#ffffff", boxShadow: "0px 1px 2px rgba(15,55,190,0.05)", cursor: "pointer", padding: 0, flexShrink: 0 }}
          />
        ) : (
          <div style={{ width: 20, height: 20, borderRadius: 3, border: `2px solid ${linkColor}`, background: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div className="animate-spin" style={{ width: 10, height: 10, borderRadius: "50%", border: "2px solid transparent", borderTopColor: linkColor }} />
          </div>
        )}
        <span style={{ fontSize: 14, lineHeight: "20px", fontFamily: ws, color: "#030712", whiteSpace: "nowrap" }}>
          {status === "success" ? "Success!" : isChallenge ? "Verify you are human" : "Verifying..."}
        </span>
      </div>
      {/* RHS */}
      <CloudflareLogo />
    </TurnstileShell>
    </div>
  );
}

// Our own message about the security check: page copy, our design system.
function CaptchaMessage({ message }: { message: ReactNode }) {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full">
      <AlertCircle size={20} color="#991b1b" strokeWidth={1.67} className="shrink-0" />
      <p
        className="flex-[1_0_0] font-semibold leading-[20px] min-h-[20px] min-w-px text-[14px]"
        style={{ color: "#991b1b", fontFamily: "'Work Sans', sans-serif" }}
      >
        {message}
      </p>
    </div>
  );
}

// ─── Invalid / lapsed code error banner ───────────────────────────────────────

function CodeErrorBanner({ errorId, theme, onLogin }: {
  errorId: CodeErrorId;
  theme?: BrandTheme;
  onLogin?: () => void;
}) {
  const ws = "'Work Sans', sans-serif";
  const linkColor = theme?.primaryColor ?? "#135cff";
  const cfg = CODE_ERRORS[errorId];

  return (
    <InlineErrorBox title={cfg.title}>
      <p className="text-[12px] font-normal leading-[16px]" style={{ color: "#991b1b", fontFamily: ws }}>
        {cfg.bodyBefore}
        {cfg.linkLabel && (
          <button
            type="button"
            onClick={onLogin}
            className="font-semibold underline"
            style={{ color: "#991b1b", fontFamily: ws, fontSize: "inherit", lineHeight: "inherit", background: "none", border: "none", padding: 0, cursor: "pointer" }}
          >
            {cfg.linkLabel}
          </button>
        )}
        {cfg.bodyAfter}
      </p>
      <div className="flex flex-wrap gap-[4px] items-center">
        <span className="text-[12px] leading-[16px]" style={{ color: "#4b5563", fontFamily: ws }}>Need support?</span>
        <a
          href="https://doctorcareanywhere.com/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-[8px] text-[12px] font-semibold leading-[16px]"
          style={{ color: linkColor, fontFamily: ws }}
        >
          Contact us
          <ExternalLink size={16} strokeWidth={2} />
        </a>
      </div>
    </InlineErrorBox>
  );
}


// ─── Separator (from Figma) ───────────────────────────────────────────────────

function Separator() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" height="1" preserveAspectRatio="none" viewBox="0 0 448 1" width="448">
            <line stroke="#D7E9FF" x2="448" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Floating label input (from Figma label-wrapper pattern) ─────────────────

function ActivationCodeInput({
  value,
  onChange,
  error,
  onValidate,
  loading,
  theme,
}: {
  value: string;
  onChange: (v: string) => void;
  error: string;
  onValidate: () => void;
  loading: boolean;
  theme?: BrandTheme;
}) {
  const primaryColor = theme?.primaryColor ?? "#135cff";
  const labelColor = theme?.labelColor ?? "#0f37be";
  const inputBorder = theme?.inputBorderColor ?? "#b9daff";
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      {/* Input field wrapper (exact Figma "Custom content/Activation code") */}
      <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
        <div className="content-stretch flex flex-col isolate items-start relative shrink-0 w-full">
          {/* Floating label */}
          <div
            className="absolute bg-gradient-to-b content-stretch flex font-semibold from-1/2 from-[rgba(255,255,255,0)] gap-[4px] items-center justify-center leading-[20px] left-[12px] not-italic px-[4px] text-[14px] to-1/2 to-white top-0 whitespace-nowrap z-[3]"
            style={{ fontFamily: "'Work Sans', sans-serif" }}
          >
            <span style={{ color: labelColor }}>Activation code</span>
            <span style={{ color: "#991b1b" }}>*</span>
          </div>
          {/* Label spacer */}
          <div className="h-[10px] relative shrink-0 w-full z-[2]" />
          {/* Input + button row */}
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full z-[1]">
            <div className="flex-1 h-[44px] min-w-px relative rounded-[8px] bg-white">
              <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                <div className="content-stretch flex gap-[8px] items-center px-[16px] py-[6px] relative size-full">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Enter your unique invitation code"
                    className="flex-1 min-w-0 bg-transparent outline-none text-[14px] font-normal"
                    style={{
                      fontFamily: "'Work Sans', sans-serif",
                      color: value ? "#030712" : "#4b5563",
                    }}
                    onKeyDown={(e) => e.key === "Enter" && onValidate()}
                  />
                </div>
              </div>
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none rounded-[8px]"
                style={{
                  border: `1px solid ${error ? "#991b1b" : inputBorder}`,
                  boxShadow: "0px 1px 2px 0px rgba(15,55,190,0.05)",
                }}
              />
            </div>
            <button
              onClick={onValidate}
              aria-label="Validate"
              className="content-stretch flex gap-[8px] items-center justify-center min-h-[44px] min-w-[44px] px-0 sm:px-[16px] py-0 sm:py-[12px] relative rounded-[9999px] shrink-0"
              style={{
                border: `1px solid ${primaryColor}`,
                background: "transparent",
                boxShadow: "0px 4px 3px rgba(15,55,190,0.05), 0px 2px 2px rgba(15,55,190,0.05)",
                cursor: "pointer",
              }}
            >
              {loading && <Loader2 size={14} color={primaryColor} className="animate-spin" />}
              {!loading && <ArrowRight size={16} color={primaryColor} className="sm:hidden" />}
              <span
                className="hidden sm:inline font-semibold leading-[20px] text-[14px] whitespace-nowrap"
                style={{ color: primaryColor, fontFamily: "'Work Sans', sans-serif" }}
              >
                {loading ? "Validating..." : "Validate"}
              </span>
            </button>
          </div>
          {/* Error state (exact Figma Desktop-1 pattern) */}
          {error && (
            <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full mt-[8px]">
              <AlertCircle size={20} color="#991b1b" strokeWidth={1.67} className="shrink-0" />
              <p
                className="flex-[1_0_0] font-semibold leading-[20px] min-h-[20px] min-w-px text-[14px]"
                style={{ color: "#991b1b", fontFamily: "'Work Sans', sans-serif" }}
              >
                {error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Status banner (for failure/recovery states) ───────────────────────────────

function StatusBanner({
  variant,
  message,
  actions,
}: {
  variant: "amber" | "green" | "blue" | "red";
  message: string;
  actions: { label: string; onClick: () => void }[];
}) {
  const cfg = {
    amber: { bg: "#fffbeb", border: "#fde68a", text: "#92400e", iconColor: "#d97706" },
    green: { bg: "#f0fdf4", border: "#bbf7d0", text: "#166534", iconColor: "#16a34a" },
    blue: { bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af", iconColor: "#3b82f6" },
    red: { bg: "#fef2f2", border: "#fecaca", text: "#991b1b", iconColor: "#991b1b" },
  }[variant];

  return (
    <div
      className="rounded-[12px] p-[16px] flex gap-[12px]"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      <div className="shrink-0 mt-[1px]">
        <AlertCircle size={18} color={cfg.iconColor} />
      </div>
      <div className="flex-1">
        <p
          className="text-[14px] leading-[20px] mb-[12px]"
          style={{ color: cfg.text, fontFamily: "'Work Sans', sans-serif" }}
        >
          {message}
        </p>
        <div className="flex flex-wrap gap-[8px]">
          {actions.map((a) => (
            <button
              key={a.label}
              onClick={a.onClick}
              className="px-[16px] py-[8px] rounded-[9999px] text-[13px] font-semibold"
              style={{ background: "#135cff", color: "white", fontFamily: "'Work Sans', sans-serif" }}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── STEP 0 – Activate invite (exact Figma Desktop layout) ────────────────────

// ─── Code Verified dialog (Desktop-10) ───────────────────────────────────────

const CIRCLE_CHECK_PATH =
  "M17.5 8.40477V9.17144C17.499 10.9685 16.9171 12.717 15.8411 14.1563C14.7651 15.5956 13.2527 16.6485 11.5295 17.158C9.80619 17.6675 7.96438 17.6064 6.27873 16.9836C4.59307 16.3608 3.15388 15.2099 2.1758 13.7023C1.19772 12.1948 0.73316 10.4115 0.851398 8.61837C0.969636 6.82524 1.66434 5.11838 2.8319 3.75233C3.99946 2.38629 5.57732 1.43426 7.33016 1.03823C9.083 0.642195 10.9169 0.823385 12.5583 1.55477M6.66667 8.33801L9.16667 10.838L17.5 2.50468";


function CodeVerifiedDialog({ onContinue, brand = "dca", code = "ABC-12345", crmHasDob = true }: {
  onContinue: (dob?: string) => void;
  brand?: AccountPlanBrand;
  code?: string;
  /**
   * Whether the CRM holds a date of birth for this code.
   *
   * true  → 1946:149889, "With DoB in CRM": ask them to confirm it, CTA "Confirm".
   * false → 1946:149919, "Without DoB in CRM": no field at all, CTA
   *         "Get started – create account". Nothing to check against, so no check.
   *
   * The AXA HP/LC dependant case is UNCONFIRMED as of 24 Aug. It defaults to
   * asking, because a question you did not need is recoverable and a check you
   * skipped is not. One line to flip once AXA confirms.
   */
  crmHasDob?: boolean;
}) {
  const ws = "'Work Sans', sans-serif";
  const [dob, setDob] = useState("");
  const [dobError, setDobError] = useState<string | undefined>();

  function handleConfirm() {
    if (!crmHasDob) return onContinue(undefined);
    const fault = dobProblem(dob);
    if (fault) return setDobError(dobMessage(fault));
    setDobError(undefined);
    onContinue(dob);
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-[24px] py-[48px] z-[100]"
      style={{ background: "rgba(10,10,10,0.3)" }}
    >
      <div
        className="bg-white relative rounded-[16px] w-full max-w-[425px]"
        style={{
          border: "1px solid #d7e9ff",
          boxShadow: "0px 10px 7.5px rgba(15,55,190,0.05), 0px 4px 3px rgba(15,55,190,0.05)",
        }}
      >
        <div className="flex flex-col gap-[16px] items-end p-[24px]" style={{ fontFamily: ws }} onKeyDown={enterSubmits(handleConfirm)}>

          {/* Header */}
          <div className="flex flex-col gap-[6px] items-start w-full">
            <div className="flex items-center justify-center p-[8px] rounded-full shrink-0" style={{ background: "#166534" }}>
              <svg fill="none" height="20" viewBox="0 0 18.33 18.33" width="20">
                <path d={CIRCLE_CHECK_PATH} stroke="#F0FDF4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.667" />
              </svg>
            </div>
            <p className="text-[18px] font-semibold leading-[28px]" style={{ color: "#030712" }}>
              Activation code recognised
            </p>
            <p className="text-[14px] leading-[20px]" style={{ color: "#4b5563" }}>
              Welcome to your membership.
            </p>
          </div>

          {/* Account plan — partner band, per the design's shared component */}
          <AccountPlan brand={brand} code={code} />

          {crmHasDob && (
            <div className="w-full" style={{ marginTop: 4 }}>
              <DsDobField
                value={dob}
                onChange={(v) => { setDob(v); setDobError(undefined); }}
                error={dobError}
                purpose="confirm"
              />
              <p className="text-[12px] leading-[16px] mt-[8px]" style={{ color: "#4b5563", fontFamily: ws }}>
                Please confirm your account by entering your date of birth.
              </p>
            </div>
          )}

          {/* Footer CTA */}
          <div className="flex items-center justify-end w-full">
            <button
              onClick={handleConfirm}
              className="flex items-center justify-center gap-[8px] px-[16px] py-[12px] rounded-[9999px] text-[12px] font-semibold leading-[16px]"
              style={{ background: "#135cff", color: "#edf6ff", boxShadow: "0px 4px 3px rgba(15,55,190,0.05), 0px 2px 2px rgba(15,55,190,0.05)" }}
            >
              {/* 1946:149889 vs 1946:149919 — the CTA changes with the variant */}
              {crmHasDob ? "Confirm" : "Get started – create account"}
              <ChevronRight size={16} color="#edf6ff" strokeWidth={2} />
            </button>
          </div>

        </div>
        {/* Close icon.
            () => onContinue(), NOT onContinue. React hands the click a
            MouseEvent as its first argument, and onContinue's first argument is
            the confirmed date of birth, so closing the dialog was calling
            onContinue(MouseEvent). That lands in setConfirmedDob, which is
            truthy, so Step 1 then hid the date field as "already confirmed" and
            the band rendered "Date of birth confirmed: [object Object]".
            Found by the typecheck added 26 Aug, not by looking. */}
        <button className="absolute top-[16px] right-[16px] opacity-70 hover:opacity-100" onClick={() => onContinue()}>
          <X size={16} color="#030712" />
        </button>
      </div>
    </div>
  );
}

function Step0({ onValidate, onCodeRecognised, theme, initialCaptchaStatus, initialCodeError, captchaMode = "pass", useRealWidget = false }: {
  /** Carries the confirmed date of birth and the code that was actually typed. */
  onValidate: (dob?: string, code?: string) => void;
  /**
   * Fired the moment a code is accepted, before the recognition dialog opens.
   * That dialog carries the partner logo, so the brand has to be right by then,
   * not one step later when the date of birth is confirmed.
   */
  onCodeRecognised?: (code: string) => void;
  theme?: BrandTheme;
  initialCaptchaStatus?: CaptchaStatus;
  initialCodeError?: CodeErrorId;
  captchaMode?: CaptchaMode;
  useRealWidget?: boolean;
}) {
  const [code, setCode] = useState(initialCodeError ? DEMO_CODES[initialCodeError] : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [captcha, setCaptcha] = useState<CaptchaStatus>("verifying");
  const [captchaMessage, setCaptchaMessage] = useState("");
  const [runKey, setRunKey] = useState(0);
  const [autoRetried, setAutoRetried] = useState(false);
  const [codeError, setCodeError] = useState<CodeErrorId | null>(initialCodeError ?? null);

  const scriptState = useTurnstileScript();
  // The CAPTCHA demo states have no real-sitekey equivalent, so they force the simulation
  const forceSim = !!initialCaptchaStatus;
  const useReal = useRealWidget && scriptState === "ready" && !forceSim;

  // Simulated run. Only drives the widget when the real script is unavailable.
  useEffect(() => {
    if (useReal) return;
    if (initialCodeError) { setCaptcha("success"); return; }
    // The demo state pins only the first run; retrying releases it so the widget
    // genuinely re-runs and its own error clears
    if (initialCaptchaStatus && runKey === 0) { setCaptcha(initialCaptchaStatus); return; }
    if (captchaMode === "challenge") { setCaptcha("challenge"); return; }
    setCaptcha("verifying");
    const t = setTimeout(
      () => setCaptcha(captchaMode === "block" ? "failed" : "success"),
      SIM_VERIFY_MS,
    );
    return () => clearTimeout(t);
  }, [useReal, runKey, captchaMode, initialCaptchaStatus, initialCodeError]);

  // Simulated expiry: a real pass lasts 5 minutes, shortened so it can be shown
  useEffect(() => {
    if (useReal || captcha !== "success" || forceSim) return;
    const t = setTimeout(() => setRunKey((k) => k + 1), DEMO_EXPIRY_MS);
    return () => clearTimeout(t);
  }, [useReal, captcha, forceSim]);

  // Turnstile failures are usually transient, so try once more before the error
  // is left standing. Once only: a genuinely blocked check has to surface rather
  // than spin. Skipped when a demo state pinned the failure, so it stays visible.
  useEffect(() => {
    if (captcha !== "failed" || autoRetried || forceSim) return;
    const t = setTimeout(() => {
      setAutoRetried(true);
      setCaptcha("verifying");
      setRunKey((k) => k + 1);
    }, 800);
    return () => clearTimeout(t);
  }, [captcha, autoRetried, forceSim]);

  // A normal Success state carries no message of ours
  useEffect(() => {
    if (captcha === "success") setCaptchaMessage("");
  }, [captcha]);

  // Switching demo mode starts a new scenario, so ours must not carry over
  useEffect(() => {
    setCaptchaMessage("");
  }, [captchaMode]);

  function handleTurnstileEvent(e: TurnstileEvent) {
    if (e.type === "success") setCaptcha("success");
    else if (e.type === "failed") setCaptcha("failed");
    else setCaptcha("verifying");
  }

  // Ticking the simulated challenge box: spinner, then Success
  function handleChallengeTick() {
    setCaptcha("verifying");
    setTimeout(() => setCaptcha("success"), SIM_VERIFY_MS);
  }

  function handleCaptchaRetry() {
    setCaptcha("verifying");
    setRunKey((k) => k + 1);
  }

  function handleValidate() {
    if (loading) return;
    if (!code.trim()) {
      setError("Please provide your activation code.");
      setCaptchaMessage("");
      return;
    }
    setError("");

    const gate = captchaGate(captcha);

    // Still running: keep the typed code, say so, do nothing else
    if (gate === "still-running") {
      setCaptchaMessage(CAPTCHA_MESSAGES["still-running"]);
      return;
    }

    // Failed or blocked: re-running clears the widget's own error, so ours never
    // sits alongside it
    if (gate === "retry") {
      setCaptchaMessage(CAPTCHA_MESSAGES.retry);
      handleCaptchaRetry();
      return;
    }

    setCaptchaMessage("");
    setCodeError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const failure = activationCodeError(code);
      if (failure) {
        setCodeError(failure);
      } else {
        onCodeRecognised?.(code.trim());
        setVerified(true);
      }
    }, 900);
  }

  return (
    <div className="content-stretch flex flex-col gap-[24px] sm:gap-[32px] items-start p-[24px] sm:p-[32px] relative size-full">
      {verified && (
        <CodeVerifiedDialog
          onContinue={(dob) => onValidate(dob, code.trim() || undefined)}
          brand={journeyForCode(code).brand === "axa" ? "axa" : (theme?.accountPlanBrand ?? "dca")}
          code={code.trim() || "ABC-12345"}
        />
      )}
      {showSupport && <GetSupportModal onClose={() => setShowSupport(false)} linkColor={theme?.primaryColor} />}
      {showReminder && <ReminderModal onClose={() => setShowReminder(false)} linkColor={theme?.primaryColor} />}
      {/* Top section */}
      <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
        {/* Heading and sub-heading — Desktop-16 H3 style */}
        <div
          className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full"
          style={{ fontFamily: "'Work Sans', sans-serif" }}
        >
          <p className="[word-break:break-word] font-semibold leading-[32px] text-[24px]" style={{ color: theme?.lhsHeadingColor ?? "#133595" }}>
            New here? Begin your journey
          </p>
          <p className="[word-break:break-word] font-normal leading-[24px] text-[16px] w-full" style={{ color: "#030712" }}>
            Starting your health assessment journey is simple:
          </p>
        </div>

        {/* Sign up steps, 5747:27062. Four rows, a 16px icon at x=0 against
            20px text, 8px between rows. The icon for each row is named on the
            frame, so these are the file's icons and not a guess:
            CircleUser, UserCheck, CheckCheck, MapPin. */}
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
          {LANDING_STEPS.map(({ Icon, text }) => (
            <div key={text} className="flex gap-[8px] items-start w-full">
              {/* 16px icon centred in a 16x20 box, so it sits on the first
                  line of a wrapping label. Green, not the heading blue: every
                  Vector in the exported CSS is 1.33px #166534. */}
              <div className="flex items-center shrink-0 h-[20px] w-[16px]">
                <Icon size={16} color="#166534" strokeWidth={1.33} />
              </div>
              <p className="[word-break:break-word] font-normal leading-[20px] text-[14px] flex-1" style={{ color: "#030712" }}>
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* 5066:125355. Filled pill, unlike the outlined Sign in below it: the
            frame gives create account the weight and sign in the quiet slot. */}
        {/* Straight to create account. There is no code to validate: the
            health assessment invite carries the code by email and it is used
            later, for the questionnaire. journeyForCode would throw on the
            undefined, hence the guard at the call site. The journey machinery
            it belongs to is prune material. */}
        <button
          onClick={() => onValidate()}
          className="content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[12px] rounded-[9999px] shrink-0 cursor-pointer"
          style={{
            background: theme?.primaryColor ?? "#135CFF",
            border: "none",
            boxShadow: "0px 4px 6px -1px rgba(15,55,190,0.05), 0px 2px 4px -2px rgba(15,55,190,0.05)",
          }}
        >
          {/* #EDF6FF, not white. The frame uses the same near-white on the
              label and the chevron. */}
          <span className="font-semibold leading-[20px] text-[14px] whitespace-nowrap" style={{ color: "#EDF6FF", fontFamily: "'Work Sans', sans-serif" }}>
            Get started &ndash; create account
          </span>
          <ChevronRight size={16} color="#EDF6FF" strokeWidth={1.33} className="shrink-0" />
        </button>
      </div>

      <Separator />

      {/* Bottom: "Don't have an invite?" */}
      <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
        {/* "Don't have an invite?" — Desktop-16 H5 style */}
        <div
          className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full"
          style={{ fontFamily: "'Work Sans', sans-serif" }}
        >
          <p className="[word-break:break-word] font-semibold leading-[28px] text-[18px]" style={{ color: theme?.lhsHeadingColor ?? "#133595" }}>
            Already have an account?
          </p>
          <p className="[word-break:break-word] font-normal leading-[24px] text-[16px] w-full" style={{ color: "#030712" }}>
            Sign in to quickly book your health assessment.
          </p>
        </div>

        {/* Join now button (exact Figma style) */}
        <div
          className="bg-white content-stretch flex gap-[4px] items-center justify-center px-[12px] py-[8px] relative rounded-[9999px] shrink-0 cursor-pointer"
          style={{
            boxShadow: "0px 4px 6px -1px rgba(15,55,190,0.05), 0px 2px 4px -2px rgba(15,55,190,0.05)",
            border: `1px solid ${theme?.joinNowBorderColor ?? "#FFB306"}`,
          }}
        >
          <span
            className="font-semibold leading-[16px] text-[12px] whitespace-nowrap"
            style={{ color: "#030712", fontFamily: "'Work Sans', sans-serif" }}
          >
            Sign in
          </span>
          <div className="overflow-clip relative shrink-0 size-[16px]">
            <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4">
              <div className="absolute inset-[-8.31%_-16.62%_-8.31%_-16.63%]">
                <svg className="block size-full" fill="none" height="9.33" preserveAspectRatio="none" viewBox="0 0 5.33 9.33" width="5.33">
                  <path
                    d={svgPaths.p1500c700}
                    stroke="#030712"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.33"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STEP 1 – Create account (Figma Desktop-11 / WidgetStep1 design) ──────────

// Floating-label field — label is centred on the top border of the input box
// ─── Design system form primitives ───────────────────────────────────────────
// Input per Figma 1771:11992, Checkbox per 1592:107647. One floating-label field
// used by every form, so the label, spacing and error treatment stay identical.

function DsField({
  label, value, onChange, placeholder, required, helper, error,
  type = "text", trailing, leading, readOnly,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  /** A node, not a string: the email field's helper carries a link. */
  helper?: ReactNode;
  /** A node, not a string: 1946:149604 draws "signing in" as a link. */
  error?: ReactNode;
  type?: string;
  trailing?: ReactNode;
  leading?: ReactNode;
  readOnly?: boolean;
}) {
  const ws = "'Work Sans', sans-serif";
  const borderColor = error ? "#991b1b" : "#b9daff";
  return (
    <div className="flex flex-col isolate items-start relative w-full">
      {/* Label sits on the border, so it needs the white gradient behind it */}
      <div
        className="absolute flex gap-[4px] items-center justify-center left-[12px] top-0 px-[4px] whitespace-nowrap z-[3]"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 50%, #ffffff 50%)" }}
      >
        {/* The label does NOT go red. 1946:150456 keeps it #0f37be and turns only
            the asterisk and the border. */}
        <span className="text-[12px] font-semibold leading-[16px]" style={{ color: "#0f37be", fontFamily: ws }}>
          {label}
        </span>
        {required && (
          <span className="text-[12px] font-semibold leading-[16px]" style={{ color: "#991b1b", fontFamily: ws }}>*</span>
        )}
      </div>
      <div className="h-[8px] w-full z-[2]" />
      <div className="flex flex-col gap-[8px] items-start w-full z-[1]">
        <div
          className="flex gap-[8px] items-center w-full rounded-[8px] px-[16px]"
          style={{ height: 44, background: "#ffffff", border: `1px solid ${borderColor}`, boxShadow: "0px 1px 2px rgba(15,55,190,0.05)" }}
        >
          {leading}
          <input
            type={type}
            value={value}
            readOnly={readOnly}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 min-w-0 bg-transparent outline-none text-[12px] leading-[16px]"
            style={{ color: value ? "#030712" : "#4b5563", fontFamily: ws }}
          />
          {trailing}
        </div>
        {/* Helper stays when there is an error. 1946:149548 draws Email and
            Password each with their helper AND the error underneath it, and so
            does 1946:149604. Hiding it removed the one line that explains why
            the field is asked for, exactly when the person is stuck on it. */}
        {helper && (
          <p className="text-[12px] leading-[16px] w-full" style={{ color: "#4b5563", fontFamily: ws }}>{helper}</p>
        )}
        {error && <CaptchaMessage message={error} />}
      </div>
    </div>
  );
}

/**
 * A label with an info icon that reveals a tooltip.
 *
 * The "Info and tooltip" slot is already in the design system: Janelle's
 * Postcode lookup CSS carries it as a 16x16 element set to display:none, so
 * this turns on a slot the components already have rather than inventing one.
 *
 * Hover AND focus, and it is a real button, so the tooltip is reachable from
 * the keyboard rather than being mouse-only. aria-describedby ties it to the
 * label a screen reader announces.
 */
function InfoTooltip({ label, body }: { label: string; body: string }) {
  const ws = "'Work Sans', sans-serif";
  const [open, setOpen] = useState(false);
  const id = `tip-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div className="flex gap-[6px] items-center w-fit">
      <p className="text-[14px] leading-[20px]" style={{ color: "#030712", fontFamily: ws }}>{label}</p>
      {/* The tooltip is positioned against the ICON, not the label. Janelle's
          Figma CSS: width 230, left -107, bottom 24. On a 16px icon that puts
          the box's centre at 8, which is the icon's centre. Anchoring it to the
          row instead is what pushed it out to the far left. */}
      <span className="relative inline-flex shrink-0" style={{ width: 16, height: 16 }}>
      <button
        type="button"
        aria-label={`More about ${label.toLowerCase()}`}
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        className="shrink-0 flex items-center justify-center rounded-full"
        style={{ width: 16, height: 16 }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
      >
        <Info size={16} color="#135cff" strokeWidth={1.67} />
      </button>
      {open && (
        <div
          id={id}
          role="tooltip"
          className="absolute rounded-[8px] z-[60]"
          style={{
            background: "#135cff",
            width: 230,
            maxWidth: 384,
            left: -107,
            bottom: 24,
            padding: "6px 12px",
            boxShadow: "0px 4px 6px -1px rgba(15,55,190,0.15)",
          }}
        >
          <p className="text-[12px] font-semibold leading-[16px]" style={{ color: "#ffffff", fontFamily: ws }}>{body}</p>
          {/* The tip. A rotated square rather than a border triangle, so it
              inherits the same #135cff and stays crisp at any zoom. Centred on
              the icon because the box is, and pushed half its diagonal below
              the box so only the point shows. */}
          <span
            aria-hidden
            className="absolute"
            style={{
              left: "calc(50% - 6px)",
              bottom: -5,
              width: 12,
              height: 12,
              background: "#135cff",
              transform: "rotate(45deg)",
              borderRadius: 2,
            }}
          />
        </div>
      )}
      </span>
    </div>
  );
}

// Progress bar/Linear, per Figma I2052:113054. "Step N of M" over a 6px track.
function DsLinearProgress({ step, total, percent, done }: { step: number; total: number; percent: number; done?: boolean }) {
  const ws = "'Work Sans', sans-serif";
  const pct = done ? 100 : Math.max(0, Math.min(100, percent));
  return (
    <div className="flex flex-col gap-[4px] items-start justify-center w-full" style={{ maxWidth: 512 }}>
      <p className="text-[11px] font-semibold leading-[14px] whitespace-nowrap" style={{ color: "#4b5563", fontFamily: ws }}>
        Step {step} of {total}
      </p>
      <div className="h-[6px] w-full rounded-[6px] overflow-hidden" style={{ background: "rgba(10,10,10,0.1)" }}>
        <div className="h-full rounded-[6px]" style={{ width: `${pct}%`, background: done ? "#036235" : "#135cff" }} />
      </div>
    </div>
  );
}

// Native select behind the same floating-label chrome as DsField, so the
// picker is the platform's own on every device.
/*
 * The Select / Menu popup, to Janelle's Figma CSS (26 Aug). One shell for both
 * dropdowns, because both were drawn from the same component and neither
 * matched it: the GP list was a hand-rolled box and the relationship picker was
 * a native <select>, so it rendered the OS menu.
 *
 *   menu    padding 4, radius 8, border #D7E9FF, shadow/md, top 52
 *   group   padding 4, max-height 288, overflow-y scroll
 *   item    padding 8px 32px 8px 8px, height 36, radius 2, body-sm 14/20
 *
 * top 52 is flush under the field, not floating: 8 label spacer + 44 input.
 *
 * The chevron rows are the file's _SelectItem, and they appear ONLY when the
 * group actually scrolls. The export has them present on the GP menu (342 tall)
 * and display:none on the relationship menu (232 tall), which is the same rule
 * stated as two states: an affordance for scrolling you cannot do is noise.
 */
function SelectMenuShell({ children }: { children: ReactNode }) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [scrolls, setScrolls] = useState(false);
  useEffect(() => {
    const el = groupRef.current;
    if (!el) return;
    setScrolls(el.scrollHeight > el.clientHeight + 1);
  }, [children]);
  const chevronRow = (dir: "up" | "down") => (
    <div className="flex items-center justify-center w-full rounded-[2px]" style={{ padding: "4px 0", height: 23 }}>
      {dir === "up"
        ? <ChevronUp size={15} color="#030712" strokeWidth={1.33} />
        : <ChevronDown size={15} color="#030712" strokeWidth={1.33} />}
    </div>
  );
  return (
    <div
      className="absolute left-0 right-0 z-50 flex flex-col rounded-[8px]"
      style={{
        top: 52,
        padding: 4,
        background: "#ffffff",
        border: "1px solid #d7e9ff",
        boxShadow: "0px 4px 6px -1px rgba(15,55,190,0.05), 0px 2px 4px -2px rgba(15,55,190,0.05)",
      }}
    >
      {scrolls && chevronRow("up")}
      <div ref={groupRef} className="w-full overflow-y-auto" style={{ padding: 4, maxHeight: 288 }}>
        {children}
      </div>
      {scrolls && chevronRow("down")}
    </div>
  );
}

function SelectMenuItem({ selected, onClick, children }: { selected?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-[8px] w-full text-left rounded-[2px]"
      style={{
        padding: "8px 32px 8px 8px",
        minHeight: 36,
        fontFamily: "'Work Sans', sans-serif",
        fontSize: 14,
        lineHeight: "20px",
        color: "#030712",
        background: selected ? "#edf6ff" : undefined,
      }}
    >
      <span className="flex-1 min-w-0">{children}</span>
    </button>
  );
}

function DsSelect({ label, required, placeholder, options, value, onChange, error }: {
  label: string;
  required?: boolean;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const ws = "'Work Sans', sans-serif";
  const line = error ? "#991b1b" : "#b9daff";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /*
   * A drawn menu, not a native <select>.
   *
   * This WAS native, on purpose: "so the picker is the platform's own on every
   * device". That is a real thing to give up, and on a phone it is the bigger
   * loss, because the OS wheel beats any list we draw. Janelle, 26 Aug: the
   * popup has to match the Figma file, and the file draws a Select / Menu the
   * OS cannot be asked to render. If the native picker is wanted back on small
   * screens, this is the component to fork, not the call sites.
   */
  useEffect(() => {
    function away(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, []);

  return (
    <div className="w-full relative" style={{ zIndex: open ? 50 : undefined }} ref={ref}>
      <div className="flex flex-col items-start relative w-full">
        <div
          className="absolute flex gap-[4px] items-center left-[12px] px-[4px] top-0 z-[3]"
          style={{ background: "linear-gradient(180deg, rgba(255,255,255,0) 50%, #ffffff 50%)" }}
        >
          <span className="text-[12px] font-semibold leading-[16px] whitespace-nowrap" style={{ color: error ? "#991b1b" : "#0f37be", fontFamily: ws }}>{label}</span>
          {required && <span className="text-[12px] font-semibold leading-[16px]" style={{ color: "#991b1b", fontFamily: ws }}>*</span>}
        </div>
        <div className="h-[8px] w-full shrink-0" />
        <div className="flex flex-col gap-[8px] items-start w-full">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}
            className="flex items-center w-full rounded-[8px] px-[16px] relative text-left"
            style={{ background: "#ffffff", border: `1px solid ${line}`, height: 44, boxShadow: "0px 1px 2px rgba(15,55,190,0.05)" }}
          >
            <span
              className="flex-1 min-w-0 truncate text-[12px] leading-[16px] pr-[20px]"
              style={{ color: value ? "#030712" : "#4b5563", fontFamily: ws }}
            >
              {value ? value.split("\n").join(", ") : placeholder}
            </span>
            <ChevronDown size={16} color="#4b5563" className="absolute right-[16px] pointer-events-none" />
          </button>
          {error && <CaptchaMessage message={error} />}
        </div>
        {open && (
          <SelectMenuShell>
            <ul role="listbox">
              {options.map((o) => (
                <li key={o} role="option" aria-selected={o === value}>
                  <SelectMenuItem selected={o === value} onClick={() => { onChange(o); setOpen(false); }}>
                    {o.split("\n").join(", ")}
                  </SelectMenuItem>
                </li>
              ))}
            </ul>
          </SelectMenuShell>
        )}
      </div>
    </div>
  );
}

// Six-slot code entry, per Figma I1836:310608;586:9259. One real input behind
// six boxes: typing, pasting, backspace and autofill all work without me
// re-implementing caret handling across six separate fields.
function DsOtpInput({ label, required, value, onChange, error, length = 6 }: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  length?: number;
}) {
  const ws = "'Work Sans', sans-serif";
  const ref = useRef<HTMLInputElement>(null);
  const line = error ? "#991b1b" : "#b9daff";
  return (
    <div className="flex flex-col gap-[8px] items-start justify-center w-full">
      <div className="flex gap-[4px] items-center justify-center">
        <span className="text-[12px] font-semibold leading-[16px]" style={{ color: error ? "#991b1b" : "#0f37be", fontFamily: ws }}>{label}</span>
        {required && <span className="text-[12px] font-semibold leading-[16px]" style={{ color: "#991b1b", fontFamily: ws }}>*</span>}
      </div>

      <div className="relative" style={{ maxWidth: 300, width: "100%" }}>
        <input
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, length))}
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-label={label}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex gap-[8px] items-center w-full pointer-events-none">
          {Array.from({ length }, (_, i) => (
            <div
              key={i}
              className="flex-1 min-w-0 flex items-center justify-center rounded-[8px]"
              style={{
                height: 44, maxWidth: 44, background: "#ffffff",
                border: `1px solid ${line}`,
                boxShadow: "0px 1px 2px rgba(15,55,190,0.05)",
              }}
            >
              <span className="text-[14px] font-semibold leading-[20px]" style={{ color: "#030712", fontFamily: ws }}>
                {value[i] ?? ""}
              </span>
            </div>
          ))}
        </div>
      </div>

      {error && <CaptchaMessage message={error} />}
    </div>
  );
}

// Three-box date of birth, following the GOV.UK / NHS date input pattern.
// Deliberately not a DsField: the group needs a fieldset, a legend, a hint and
// one message for three inputs, none of which belong in the shared field.
/**
 * One date of birth box. Digits in, slashes inserted by maskDobInput.
 *
 * Paste deliberately bypasses the mask. Greedy padding would turn a pasted
 * 12/31/1990 into 12/03/1199, which is the one case where the transposed
 * branch can still tell the user something useful — so a paste that already
 * carries separators is passed through as typed and left to the validator.
 */
function DsDobField({ value, onChange, error, purpose = "collect" }: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
  /**
   * "collect" is a real date-of-birth field: autofill is wanted, and the bday
   * token is the WCAG 2.2 §1.3.5 hook.
   *
   * "confirm" is the gate on an activation code, where the field's whole job is
   * to prove the person knows a date we already hold. A password manager
   * filling it verifies the software, not the person, so an unlocked laptop
   * walks straight through. Same reason the card fields opt out. Do not "tidy"
   * this back to a single autoComplete.
   */
  purpose?: "collect" | "confirm";
}) {
  const ws = "'Work Sans', sans-serif";
  const red = "#991b1b";

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text");
    if (!/[^0-9]/.test(text.trim())) return; // bare digits: let the mask have it
    e.preventDefault();
    onChange(padPastedDob(text).slice(0, 10));
  }

  return (
    <div className="w-full">
      <div className="relative w-full">
        <div className="absolute flex items-center gap-[4px] px-[4px] z-10" style={{ top: -10, left: 12, background: "white" }}>
          <span className="text-[12px] font-semibold leading-[16px]" style={{ color: error ? red : "#0f37be", fontFamily: ws }}>
            Date of birth
          </span>
          <span className="text-[12px] font-semibold leading-[16px]" style={{ color: red, fontFamily: ws }}>*</span>
        </div>
        <input
          value={value}
          onChange={(e) => onChange(maskDobInput(e.target.value))}
          onPaste={handlePaste}
          placeholder="DD/MM/YYYY"
          inputMode="numeric"
          {...(purpose === "confirm"
            ? { autoComplete: "off", "data-lpignore": "true", "data-1p-ignore": "" }
            : { autoComplete: "bday" })}
          maxLength={10}
          className="w-full bg-white rounded-[8px] px-[16px] text-[14px] outline-none"
          style={{
            height: 44,
            border: `1px solid ${error ? red : "#b9daff"}`,
            boxShadow: "0 1px 2px rgba(15,55,190,0.05)",
            color: value ? "#030712" : "#4b5563",
            fontFamily: ws,
          }}
        />
      </div>
      {error && <div className="mt-[8px]"><CaptchaMessage message={error} /></div>}
    </div>
  );
}
// Password strength meter, per section 1787:131151. Four segments, hidden
// until something is typed (1763:57456 has it hidden), amber until every
// condition is met and green once they all are.
function DsPasswordStrength({ password }: { password: string }) {
  const ws = "'Work Sans', sans-serif";
  const score = strengthOf(password);
  if (score === 0) return null;
  const good = toneFor(score) === "good";
  const fill = good ? STRENGTH_COLOURS.goodFill : STRENGTH_COLOURS.warnFill;
  return (
    <div className="flex flex-col gap-[6px] items-start w-full" style={{ marginTop: -8 }}>
      <div className="flex gap-[4px] items-start w-full overflow-clip" role="presentation">
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <div
            key={i}
            className="flex-1 min-w-px rounded-[2px]"
            style={{ height: 4, background: i < score ? fill : STRENGTH_COLOURS.track }}
          />
        ))}
      </div>
      <p
        className="text-[12px] font-semibold leading-[16px]"
        style={{ color: good ? STRENGTH_COLOURS.goodText : STRENGTH_COLOURS.warnText, fontFamily: ws }}
        aria-live="polite"
      >
        {messageFor(score)}
      </p>
    </div>
  );
}

function DsToggleGroup({ label, required, options, value, onChange, error }: {
  label: string;
  required?: boolean;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const ws = "'Work Sans', sans-serif";
  return (
    <div className="flex flex-col gap-[8px] items-start w-full">
      <div className="flex gap-[4px] items-center">
        <span className="text-[12px] font-semibold leading-[16px]" style={{ color: error ? "#991b1b" : "#0f37be", fontFamily: ws }}>{label}</span>
        {required && <span className="text-[12px] font-semibold leading-[16px]" style={{ color: "#991b1b", fontFamily: ws }}>*</span>}
      </div>
      <div className="flex flex-wrap items-start w-full">
        {options.map((opt, i) => {
          const selected = value === opt;
          const first = i === 0, last = i === options.length - 1;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className="flex gap-[8px] items-center justify-center px-[16px]"
              style={{
                height: 44, minWidth: 44, marginRight: last ? 0 : -1,
                background: selected ? "#edf6ff" : "rgba(255,255,255,0.5)",
                border: `1px solid ${error ? "#991b1b" : selected ? "#135cff" : "#b9daff"}`,
                borderTopLeftRadius: first ? 9999 : 0, borderBottomLeftRadius: first ? 9999 : 0,
                borderTopRightRadius: last ? 9999 : 0, borderBottomRightRadius: last ? 9999 : 0,
                zIndex: selected ? 2 : 1,
                color: "#030712", fontFamily: ws, fontSize: 12, lineHeight: "16px",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {error && <CaptchaMessage message={error} />}
    </div>
  );
}

function DsCheckbox({ checked, onChange, error, children }: {
  checked: boolean;
  onChange: (v: boolean) => void;
  error?: boolean;
  children: ReactNode;
}) {
  const ws = "'Work Sans', sans-serif";
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex gap-[8px] items-start w-full text-left cursor-pointer"
    >
      <div className="flex flex-col h-[20px] items-center justify-center shrink-0">
        <div
          className="flex items-center justify-center rounded-[4px] shrink-0"
          style={{
            width: 16, height: 16,
            background: checked ? "#135cff" : "#ffffff",
            border: `1px solid ${error ? "#991b1b" : checked ? "#135cff" : "#b9daff"}`,
            boxShadow: "0px 1px 2px rgba(15,55,190,0.05)",
          }}
        >
          {checked && <Check size={11} color="#ffffff" strokeWidth={3} />}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-[4px] items-start min-w-0">
        <div className="flex gap-[4px] items-center min-h-[20px] w-full">
          <p className="flex-1 text-[12px] leading-[16px]" style={{ color: "#030712", fontFamily: ws }}>
            {children}
          </p>
        </div>
      </div>
    </button>
  );
}

function FField({
  label, value, onChange, placeholder, type = "text",
  required, disabled, hint, error,
}: {
  label: string; value: string; onChange?: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
  disabled?: boolean; hint?: string; error?: string;
}) {
  const [showPw, setShowPw] = useState(false);
  const inputType = type === "password" ? (showPw ? "text" : "password") : type;
  const ws = { fontFamily: "'Work Sans', sans-serif" };
  return (
    // mt-[14px] creates headroom above so the label (28px tall) can overlap the border
    <div className="relative mt-[14px] w-full">
      {/* Label — negative top centres it on the border: half of ~28px label height = 14px */}
      <div className="absolute -top-[14px] left-[12px] px-[4px] bg-white flex items-center gap-[3px] z-10">
        <span className="text-[#135cff] font-semibold text-[16px] leading-[28px]" style={ws}>{label}</span>
        {required && <span className="text-[#991b1b] font-semibold text-[16px] leading-[28px]" style={ws}>*</span>}
      </div>
      {/* Input box — normal padding, no extra top gap needed */}
      <div
        className="relative rounded-[8px] w-full"
        style={{
          border: `1px solid ${error ? "#991b1b" : disabled ? "#898a8f" : "#cfcfcf"}`,
          background: disabled ? "#f2f2f2" : "white",
        }}
      >
        <div className="flex items-center px-[16px] py-[14px] gap-[10px]">
          <input
            type={inputType}
            value={value}
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 min-w-0 bg-transparent outline-none text-[16px]"
            style={{ ...ws, color: value ? "#1b1b1a" : "#898a8f" }}
          />
          {type === "password" && (
            <button type="button" tabIndex={-1} onClick={() => setShowPw((s) => !s)} className="shrink-0 text-[#898a8f]">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
      </div>
      {hint && <p className="text-[12px] mt-[6px] leading-[16px]" style={{ color: "#4b5563", ...ws }}>{hint}</p>}
      {error && <p className="text-[12px] mt-[4px] text-[#991b1b]" style={ws}>{error}</p>}
    </div>
  );
}

// Sex at birth radio group
function SexAtBirth({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ws = { fontFamily: "'Work Sans', sans-serif" };
  return (
    <div className="relative pt-[16px] w-full">
      <div className="absolute top-0 left-0">
        <span className="text-[#135cff] font-semibold text-[16px]" style={ws}>Sex at birth</span>
      </div>
      <div className="flex gap-[32px] items-center pt-[10px] pb-[14px]">
        {(["Female", "Male"] as const).map((opt) => (
          <label key={opt} className="flex items-center gap-[8px] cursor-pointer select-none">
            <div
              onClick={() => onChange(opt)}
              className="w-[16px] h-[16px] rounded-full border flex items-center justify-center shrink-0 cursor-pointer"
              style={{ borderColor: "#898a8f" }}
            >
              {value === opt && <div className="w-[8px] h-[8px] rounded-full bg-[#135cff]" />}
            </div>
            <span className="text-[16px] font-semibold" style={{ color: "#1b1b1a", ...ws }}>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// Password strength rules
const PW_RULES = [
  { label: "One lowercase character", test: (p: string, _c: string) => /[a-z]/.test(p) },
  { label: "One uppercase character", test: (p: string, _c: string) => /[A-Z]/.test(p) },
  { label: "One number",              test: (p: string, _c: string) => /[0-9]/.test(p) },
  { label: "One special character",   test: (p: string, _c: string) => /[^a-zA-Z0-9]/.test(p) },
  { label: "8 characters minimum",    test: (p: string, _c: string) => p.length >= 8 },
  { label: "Passwords must match",    test: (p: string, c: string)  => p.length > 0 && p === c },
];

function PasswordStrength({ password, confirm }: { password: string; confirm: string }) {
  const ws = { fontFamily: "'Work Sans', sans-serif" };
  const half = Math.ceil(PW_RULES.length / 2);
  const cols = [PW_RULES.slice(0, half), PW_RULES.slice(half)];
  return (
    <div className="flex gap-[32px] justify-center">
      {cols.map((col, ci) => (
        <div key={ci} className="flex flex-col gap-[8px]">
          {col.map((rule) => {
            const met = rule.test(password, confirm);
            return (
              <div key={rule.label} className="flex items-center gap-[8px]">
                <div
                  className="shrink-0 w-[6px] h-[6px] rounded-[3px]"
                  style={{
                    background: met ? "#009e69" : "white",
                    border: met ? "none" : "1px solid #cfcfcf",
                  }}
                />
                <span className="text-[14px]" style={{ color: "#1b1b1a", ...ws }}>{rule.label}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// Inline external link (used in Terms)
function ExtLink({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center gap-[3px] font-semibold cursor-pointer" style={{ color: "#135cff", fontFamily: "'Work Sans', sans-serif" }}>
      {children}<ExternalLink size={11} />
    </span>
  );
}

// Terms checkbox — single line, T&C + Privacy Policy
function TermsBox({ checked, onChange, error }: { checked: boolean; onChange: (v: boolean) => void; error?: boolean }) {
  const ws = { fontFamily: "'Work Sans', sans-serif" };
  return (
    <div
      className="flex flex-col p-[16px] rounded-[8px]"
      style={{ border: `1px solid ${error ? "#991b1b" : "#d7e9ff"}` }}
    >
      <div className="flex gap-[8px] items-start">
        <div
          onClick={() => onChange(!checked)}
          className="shrink-0 w-[16px] h-[16px] rounded-[4px] border cursor-pointer flex items-center justify-center mt-[2px]"
          style={{ borderColor: "#b9daff", background: checked ? "#135cff" : "white" }}
        >
          {checked && <Check size={10} color="white" strokeWidth={3} />}
        </div>
        <p className="text-[12px] leading-[16px]" style={{ color: "#030712", ...ws }}>
          I agree to the{" "}
          <span className="font-semibold cursor-pointer" style={{ color: "#135cff" }}>Terms and Conditions</span>
          {" "}and{" "}
          <span className="font-semibold cursor-pointer" style={{ color: "#135cff" }}>Privacy Policy</span>
          {"."}{" "}
          <span className="font-semibold text-[#991b1b]">*</span>
        </p>
      </div>
    </div>
  );
}

// Marketing consent checkbox
function MarketingBox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  const ws = { fontFamily: "'Work Sans', sans-serif" };
  return (
    <div className="flex flex-col p-[16px] rounded-[8px]" style={{ border: "1px solid #d7e9ff" }}>
      <div className="flex gap-[8px] items-start">
        <div
          onClick={() => onChange(!checked)}
          className="shrink-0 w-[16px] h-[16px] rounded-[4px] border cursor-pointer flex items-center justify-center mt-[2px]"
          style={{ borderColor: "#b9daff", background: checked ? "#135cff" : "white" }}
        >
          {checked && <Check size={10} color="white" strokeWidth={3} />}
        </div>
        <p className="text-[12px] leading-[16px]" style={{ color: "#030712", ...ws }}>
          I'm happy to receive service updates, helpful information, and offers from Doctor Care Anywhere.
        </p>
      </div>
    </div>
  );
}

/**
 * "Update your personal details", the AXA HP/LC correction screen.
 *
 * A screen of its own, not Create account wearing a banner. Per Janelle's
 * 25 Aug rework: the account already exists, so the only job left is the three
 * fields the policy match uses. Email, password and the consents are gone,
 * because re-consenting to create an account you already have makes no sense.
 *
 * The warning is GLOBAL, above the heading, for three reasons: it explains why
 * the whole screen exists rather than faulting one field; sitting next to the
 * button it read as "this button failed" when in fact the account was created;
 * and its own copy says "update your details below", which is only true if it
 * is above them.
 *
 * All three fields are editable here, which is what makes the loop winnable.
 * On Create account the date of birth arrives locked in the band, and that is
 * what dobLocked is for; here there is nothing to lock.
 */
function UpdatePersonalDetails({ theme, code, plan, initial, onUpdated, initialValidating }: {
  theme?: BrandTheme;
  code: string;
  plan: PolicyPlan;
  initial: { firstName: string; lastName: string; dob: string };
  onUpdated: () => void;
  /** Opens mid-check, for the "attempted and still not matching" View state. */
  initialValidating?: boolean;
}) {
  const ws = "'Work Sans', sans-serif";
  const [firstName, setFirstName] = useState(initial.firstName);
  const [lastName, setLastName] = useState(initial.lastName);
  const [dob, setDob] = useState(initial.dob);
  const copy = CORRECTION_COPY[plan];
  const [failedOnce, setFailedOnce] = useState(true);
  const [validating, setValidating] = useState(initialValidating ?? false);

  /*
   * NO TOAST HERE. "Details updated" used to render on this screen, held for
   * TOAST_DWELL_MS, and then navigation unmounted it, so it was never actually
   * read. Both frames that carry it, 2097:99790 and 2466:65066, are LANDINGS;
   * the correction frame has none. It now travels with onUpdated and the
   * landing shows it. (26 Aug audit.)
   *
   * A retry goes through a validating pass rather than flipping instantly.
   * Janelle, 27 Aug: the button should show validating, so a patient who
   * corrects a detail and still does not match can tell the check ran and
   * failed again, rather than seeing a warning that never appeared to change.
   */
  function resolve() {
    if (matchesPolicy({ firstName, lastName, dob }, plan)) {
      onUpdated();
      return;
    }
    // Flow 15: a failed correction writes nothing and returns here. No cap and
    // no human escape, because no frame proposes one. Reproduced, not fixed.
    setValidating(false);
    setFailedOnce(true);
  }

  function submit() {
    if (validating) return;
    setValidating(true);
    window.setTimeout(resolve, VALIDATING_MS);
  }

  // Opening straight into the validating state has to schedule its own answer.
  // Without this the View state row sat on "Validating..." for ever, because
  // the only timer lived inside submit() and nobody had pressed anything.
  useEffect(() => {
    if (!initialValidating) return;
    const t = window.setTimeout(resolve, VALIDATING_MS);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="flex flex-col gap-[16px] p-[24px] sm:p-[32px]" style={{ fontFamily: ws }} onKeyDown={enterSubmits(submit)}>
      {failedOnce && !validating && (
        /*
         * Copy per arm, from axa-correction-copy.ts. HP and LC are separate
         * screens that happen to share a title: AXA revised HP's body on
         * 27 Aug and LC's has had no such review, and only LC carries a
         * support row. That file records which frame each string came from.
         */
        <InlineWarningBox title={copy.title} body={copy.body}>
          {copy.showsSupportRow && (
            <div className="flex flex-wrap gap-[4px] items-center">
              <span className="text-[12px] leading-[16px]" style={{ color: "#4b5563", fontFamily: ws }}>Need support?</span>
              <a
                href="https://doctorcareanywhere.com/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[8px] text-[12px] font-semibold leading-[16px]"
                style={{ color: "#135cff", fontFamily: ws }}
              >
                Contact us
                <ExternalLink size={16} strokeWidth={2} />
              </a>
            </div>
          )}
        </InlineWarningBox>
      )}

      <div className="flex flex-col gap-[4px]">
        <p className="text-[20px] font-semibold leading-[28px]" style={{ color: theme?.lhsHeadingColor ?? "#133595" }}>
          Update your personal details
        </p>
        <p className="text-[14px] leading-[20px]" style={{ color: "#030712" }}>
          Update your details so they exactly match your membership documents.
        </p>
      </div>

      <AccountPlan brand={theme?.accountPlanBrand ?? "dca"} code={code} />

      <DsField
        label="First name" required
        value={firstName}
        onChange={setFirstName}
        helper="Enter your name exactly as shared with your insurer or as shown on your ID."
      />
      <DsField label="Last name" required value={lastName} onChange={setLastName} />
      <DsField label="Date of birth" required value={dob} onChange={setDob} placeholder="DD/MM/YYYY" />

      <button
        onClick={submit}
        disabled={validating}
        className="w-full flex items-center justify-center gap-[8px] rounded-[9999px] text-[12px] font-semibold leading-[16px] px-[16px] py-[12px] mt-[8px]"
        style={{
          background: "#135cff",
          color: "#edf6ff",
          opacity: validating ? 0.8 : 1,
          boxShadow: "0px 4px 3px rgba(15,55,190,0.05), 0px 2px 2px rgba(15,55,190,0.05)",
        }}
      >
        {validating && <Loader2 size={16} className="animate-spin" />}
        {validating ? "Validating..." : "Update details"}
      </button>
    </div>
  );
}

function Step1({ onNext, theme, code = "ABC-12345", initialError, confirmedDob, askNames = true, policyPlan, initialBanner, initialUnvalidated, initialValidating }: {
  onNext: () => void;
  theme?: BrandTheme;
  code?: string;
  /** A DEMO_CREATE_ACCOUNT key, not a field name. */
  initialError?: keyof typeof DEMO_CREATE_ACCOUNT;
  /** Set when the dialog already checked it against the CRM. Shown in the band, not asked for again. */
  confirmedDob?: string;
  /** Lead journeys carry the name on the CRM record, so 1946:150009 has no name fields. */
  askNames?: boolean;
  /**
   * AXA Health Plan and Large Corporate match the details against the policy
   * record AXA holds. The account is created either way; a mismatch asks for a
   * correction rather than throwing the sign-up away (2171:121762).
   */
  policyPlan?: PolicyPlan;
  /**
   * Screen-level states that the patient cannot trigger, so they are reachable
   * from View states rather than by typing:
   *   unvalidated-code  2171:121778, the code did not validate
   *   creation-failed   2171:121004, the account could not be created
   *   duplicate         the uniqueness gate in the Visio: FN, LN, DOB and the
   *                     activation code already exist in CRM. Same title as
   *                     creation-failed and a different body, the way the file
   *                     already does two "Invalid code" bodies.
   * The details variant (2171:121762) IS reachable, by entering details that do
   * not match the policy record.
   *
   * The two "unable to validate" messages are separate states here and not a
   * runtime branch on purpose: the API reports one undifferentiated cause for
   * both (systems audit flow 09), which is exactly why they cannot ship as
   * drawn. Modelling them as a branch would hide that.
   */
  initialBanner?: "creation-failed" | "duplicate";
  /**
   * Open straight on "Update your personal details" rather than on the form.
   *
   * The unvalidated state used to be a banner ON the create form, headed "We
   * are unable to validate the activation code". Janelle, 27 Aug: wrong header,
   * and the edit screen needs only first name, last name and date of birth, no
   * email, password or consents. 2097:99730 and 1946:150272 agree: the frame
   * for this state IS the correction screen, three fields and Update details.
   * Nothing frames the banner variant; it cited 2171:121778, which is on
   * another page and was never opened.
   */
  initialUnvalidated?: boolean;
  /** Opens the correction screen mid re-check. */
  initialValidating?: boolean;
}) {
  const ws = "'Work Sans', sans-serif";
  const demo = initialError ? DEMO_CREATE_ACCOUNT[initialError] : undefined;
  // A date of birth the dialog already confirmed becomes a badge in the band,
  // and the field goes away: 2342:68790, "DoB supplied (shown as a badge)", is
  // drawn with two stacked badges and no date row. Its sibling one frame over,
  // "DoB required only if missing", is the other half of the same rule.
  //
  // This was briefly a prefilled field instead, because a locked date was the
  // one part of the policy match nobody could correct. That dead end closed
  // when "Update your personal details" shipped: the date is editable there.
  const askDob = !confirmedDob;
  const [form, setForm] = useState({
    firstName: demo?.input.firstName ?? "",
    lastName: demo?.input.lastName ?? "",
    email: demo?.input.email ?? "",
    password: demo?.input.password ?? "",
  });
  const [dob, setDob] = useState(demo?.input.dob ?? "");
  const [termsChecked, setTermsChecked] = useState(demo?.input.termsChecked ?? false);
  const [marketing, setMarketing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<CreateAccountErrors>(demo?.errors ?? {});
  // The AXA correction loop: the account is saved, the details did not match.
  const [created, setCreated] = useState(false);
  const [unvalidated, setUnvalidated] = useState(initialUnvalidated ?? false);
  const [detailsUpdated, setDetailsUpdated] = useState(false);

  function set(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  }

  function handleSubmit() {
    // When the dialog already confirmed it against the CRM there is nothing to
    // validate here: the value is shown in the band instead, and the dialog
    // validated it on the way in.
    const e = validateCreateAccount({ ...form, dob: confirmedDob ?? dob, termsChecked });
    if (!askNames) { delete e.firstName; delete e.lastName; }
    setErrors(e);
    if (Object.keys(e).length !== 0) return;

    // The already-registered email is the one failure the form cannot detect,
    // so it has to be re-raised here rather than left to validateCreateAccount.
    // Without this the state is a screenshot you can walk straight past: the
    // input 1946:149604 draws is perfectly valid, so submitting it unchanged
    // would sail through. Change the address and it clears, which is what the
    // frame's own way out says to do.
    if (demo?.errors.email === EMAIL_ALREADY_REGISTERED && form.email === demo.input.email) {
      setErrors({ email: EMAIL_ALREADY_REGISTERED });
      return;
    }

    if (policyPlan) {
      // All three fields count here, including a date of birth that arrived
      // locked in the band. That is safe now the correction screen exists: it
      // makes the date editable, so a date mismatch is something the patient
      // can actually fix. Before that screen it would have been a dead end,
      // which is what axa-policy's dobLocked flag was for. Nothing passes it
      // today; it is kept, and tested, because the constraint is real and would
      // return the moment a correction surface stops offering the date.
      if (!matchesPolicy(
        { firstName: form.firstName, lastName: form.lastName, dob: confirmedDob ?? dob },
        policyPlan,
        DEMO_POLICY_RECORD,
      )) {
        // The account IS created; only the policy match failed. So this hands
        // off to its own screen rather than banner-ing this one, which is what
        // lets the date of birth be editable there.
        setUnvalidated(true);
        return;
      }
      if (unvalidated) {
        setDetailsUpdated(true);
        window.setTimeout(onNext, TOAST_DWELL_MS);
        return;
      }
    }
    // The toast says "taking you to the next step", so it has to be readable
    // before the step actually changes.
    setCreated(true);
    window.setTimeout(onNext, TOAST_DWELL_MS);
  }

  if (unvalidated && policyPlan) {
    return (
      <UpdatePersonalDetails
        theme={theme}
        code={code}
        plan={policyPlan}
        // Seeded from 2097:99730 when the picker opens this directly. Reached
        // through the journey the real form values carry through, but the
        // picker clears them, and an empty form under "check your details
        // against your membership documents" reviews as broken rather than as
        // the state it is.
        initial={
          initialUnvalidated && !form.firstName && !form.lastName
            ? { firstName: "Nathan", lastName: "Smith", dob: "01/01/1990" }
            : { firstName: form.firstName, lastName: form.lastName, dob: confirmedDob ?? dob }
        }
        initialValidating={initialValidating}
        onUpdated={onNext}
      />
    );
  }

  return (
    <div className="flex flex-col gap-[16px] p-[24px] sm:p-[32px]" style={{ fontFamily: ws }} onKeyDown={enterSubmits(handleSubmit)}>
      {detailsUpdated && (
        // 2016:100559 / 2097:99790. Floats, at x=491 y=35 in the frames.
        <Toast
          title="Details updated"
          body="Your details now match your policy record. Please continue setting up your profile."
        />
      )}
      {created && (
        /*
         * ONE BODY, and the tail keyed to whether payment follows. Both frames
         * that draw it, 1946:149508 and 1946:150212, carry the same sentence
         * and differ only in the tail, and the tail is about payment, not
         * about brand.
         *
         * requiresPayment is false today, so the payment tail is unreachable
         * until PAYG is wired. Written the way the frames divide it rather
         * than hard-coded, so wiring PAYG is the only change needed.
         *
         * Removed on 3 Sep and put straight back the same day, on Janelle's
         * word: "sorry ignore me, the toastie should be there".
         */
        <Toast
          title="Account created"
          body={
            theme?.requiresPayment
              ? "Welcome to Doctor Care Anywhere! You\u2019ve created your account. Taking you to payment..."
              : "Welcome to Doctor Care Anywhere! You\u2019ve created your account. Taking you to the next step..."
          }
        />
      )}
      {/* Heading */}
      <div className="flex flex-col gap-[4px]">
        <p className="text-[20px] font-semibold leading-[28px]" style={{ color: theme?.lhsHeadingColor ?? "#133595" }}>
          Create your account
        </p>
        <p className="text-[14px] leading-[20px]" style={{ color: "#030712" }}>
          Let&rsquo;s get you set up and ready to book your first health assessment.
        </p>
      </div>

      {/* NO ACCOUNT PLAN BAND. activationUI drew the plan and the activation
          code here. The health assessment create account frame has neither, and
          there is no code to show: the invite carries one by email and it is
          used later, for the questionnaire (Janelle, 2 Sep). */}

      {askNames && (
        <>
          <DsField label="First name" required value={form.firstName} onChange={(v) => set("firstName", v)} placeholder="e.g., Jane" error={errors.firstName} />
          <DsField label="Last name" required value={form.lastName} onChange={(v) => set("lastName", v)} placeholder="e.g., Smith" error={errors.lastName} />
        </>
      )}
      {askDob && (
        <DsDobField
          value={dob}
          onChange={(v) => { setDob(v); setErrors((e) => ({ ...e, dob: undefined })); }}
          error={errors.dob}
        />
      )}
      <DsField
        label="Email" required type="email"
        value={form.email} onChange={(v) => set("email", v)}
        placeholder="jane.doe@mail.com"
        helper={
          <>
            If you need to change the email you&rsquo;re registering with, please{" "}
            <a
              href="https://doctorcareanywhere.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline"
              style={{ color: "#135CFF" }}
            >
              contact the Patient Experience team
            </a>
            .
          </>
        }
        error={
          // 1946:149604. The way out of this state is a sign-in, so it is a
          // link in the sentence rather than a second button competing with
          // Create account, which is the same call the duplicate box makes.
          errors.email === EMAIL_ALREADY_REGISTERED ? (
            <>
              Please continue by{" "}
              <button type="button" className="underline font-semibold align-baseline" style={{ color: "#991b1b" }}>signing in</button>
              {" "}or using a different email address.
            </>
          ) : errors.email
        }
      />
      <DsField
        label="Password" required
        type={showPassword ? "text" : "password"}
        value={form.password} onChange={(v) => set("password", v)}
        placeholder="Choose a strong password"
        helper="At least 8 characters, including uppercase, lowercase, number, and special character."
        error={errors.password}
        trailing={
          <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} className="shrink-0">
            {showPassword ? <EyeOff size={16} color="#4b5563" /> : <Eye size={16} color="#4b5563" />}
          </button>
        }
      />

      <DsPasswordStrength password={form.password} />

      <DsCheckbox checked={termsChecked} onChange={(v) => { setTermsChecked(v); setErrors((e) => ({ ...e, terms: undefined })); }} error={!!errors.terms}>
        I agree to the <span className="font-semibold" style={{ color: "#135cff" }}>Terms and Conditions</span> and{" "}
        <span className="font-semibold" style={{ color: "#135cff" }}>Privacy Policy</span>.{" "}
        <span style={{ color: "#991b1b" }}>*</span>
      </DsCheckbox>
      {errors.terms && <CaptchaMessage message={errors.terms} />}

      <DsCheckbox checked={marketing} onChange={setMarketing}>
        I&rsquo;m happy to receive service updates, helpful information, and offers from Doctor Care Anywhere.
      </DsCheckbox>

      {/* Submit outcomes sit here, next to the button that caused them, which
          is where the frame puts them and where the patient's attention already
          is. Contrast the AXA validation warning at the top of the correction
          screen: that one says "edit the fields below", so it has to be above
          them. These two say "your submit failed, here is the way out", and the
          way out is a link rather than the fields. Different job, different
          place. */}
      {initialBanner === "duplicate" && (
        // 2392:192903, labelled "Account creation error - not unique, existing
        // on database", in the Web AXA HP LC section. Read back 26 Aug: title,
        // body, the in-sentence sign-in link and the support row all match.
        //
        // It is the "No" branch of the Visio's uniqueness check. The two pages
        // disagree on the key: signup-flows.pdf page 1 reads "(FN, LN, DOB and
        // Activation code)", page 2 reads "(FN, LN and DOB)". Modelled on page
        // 1, the fuller one, and the difference does not change this screen.
        //
        // AXA HP/LC only for now (Janelle, 26 Aug). ALL USERS / general holds a
        // separate email-already-registered error, 1946:149604, which is a
        // field-level error on Email and a different state entirely.
        //
        // Red, because nothing was created. The way out is a sign-in, not a
        // retry, so the link is in the sentence rather than being a button
        // that would compete with Create account.
        <InlineErrorBox title="Account creation failed">
          <p className="text-[12px] font-normal leading-[16px]" style={{ color: "#991b1b", fontFamily: ws }}>
            It appears that the information you entered already exists in our database. Please continue by{" "}
            {/* 2392:192920 draws this link #0f37be SemiBold, not the box's own red at
                normal weight. It also stops the two in-sentence "signing in"
                links disagreeing with each other. */}
            <button type="button" className="underline font-semibold text-[12px] leading-[16px] align-baseline" style={{ color: "#0f37be", fontFamily: ws }}>signing in</button>
            {" "}instead.
          </p>
          <div className="flex flex-wrap gap-[4px] items-center">
            <span className="text-[12px] leading-[16px]" style={{ color: "#4b5563" }}>Need support?</span>
            <button type="button" className="flex gap-[4px] items-center text-[12px] font-semibold leading-[16px]" style={{ color: "#135cff" }}>
              Contact us
              <ExternalLink size={16} color="#135cff" strokeWidth={2} />
            </button>
          </div>
        </InlineErrorBox>
      )}
      {initialBanner === "creation-failed" && (
        // 2171:121004, inline at x=0. Red, not amber: nothing was saved.
        <InlineErrorBox
          title="Account creation failed"
          body="This is usually temporary. Please check your connection, or try again later. If this issue persists, the Patient Experience team is here to help: +44 (0)330 088 4980."
        />
      )}
      <button
        onClick={handleSubmit}
        className="w-full flex items-center justify-center rounded-[9999px] text-[12px] font-semibold leading-[16px] px-[16px] py-[12px] mt-[8px]"
        style={{ background: "#135cff", color: "#edf6ff", boxShadow: "0px 4px 3px rgba(15,55,190,0.05), 0px 2px 2px rgba(15,55,190,0.05)" }}
      >
        Create account
      </button>
    </div>
  );
}

/*
 * THERE IS NO VERIFICATION SCREEN, AND THAT IS THE POINT.
 *
 * A Step3 used to live here: a "Take a photo of your ID" box, an "Or upload a
 * document" box, and a camera-denial state. None of it is real. Identity
 * verification is Onfido document + selfie (audit repo, sso-against-activation
 * -jobs.md job 5), an SDK with its own capture, its own upload and its own
 * retry loop. Janelle, 26 Aug: "there is no upload a file as we cant do that,
 * it's done via onfido". Hand-rolling a capture UI here invented a flow the
 * product does not have and would have been demoed as if it did.
 *
 * The generic guidance the patient gets before they go through is the line the
 * landing card already carries: "You'll also verify your identity using a valid
 * photo ID and by taking a selfie." That card, with Verify your identity as
 * Next up, is the last screen this prototype draws. Part 2 is upcoming.
 */

// ─── STEP 4 – Ready to Book ────────────────────────────────────────────────────

function Step4({ onRestart, onStartProfile, onStartVerification }: { onRestart: () => void; onStartProfile: () => void; onStartVerification: () => void }) {
  const ws = "'Work Sans', sans-serif";
  return (
    <div className="flex flex-col" style={{ fontFamily: ws }}>

      {/* ── Success heading ─────────────────────────────────────── */}
      <div className="flex flex-col gap-[16px] px-[32px] pt-[32px] pb-[24px]">

        {/* Green check — matches Figma ListItemIcon */}
        <div
          className="flex items-center justify-center shrink-0 w-[40px] h-[40px] rounded-full"
          style={{ background: "rgba(3,98,53,0.04)", border: "1px solid rgba(3,98,53,0.3)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5L9.5 17L19 7" stroke="#036235" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-[6px]">
          <p className="text-[22px] font-semibold leading-[28px]" style={{ color: "#135cff" }}>
            Your account has been created!
          </p>
          <p className="text-[15px] leading-[22px]" style={{ color: "#1b1b1a" }}>
            {"We've sent a welcome email to "}
            <span className="font-semibold">jane.smith@email.com</span>.
          </p>
        </div>

        {/* Primary CTA — matches Figma Primary button */}
        <button
          onClick={onStartProfile}
          className="w-full flex items-center justify-center gap-[8px] rounded-[999px] py-[15px] px-[32px] text-[15px] font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "#135cff", boxShadow: "0 4px 14px rgba(19,92,255,0.22)" }}
        >
          Next: set up profile
          <ChevronRight size={16} strokeWidth={2.5} />
        </button>

        {/* Urgency note */}
        <p className="text-[14px] leading-[21px]" style={{ color: "#1b1b1a" }}>
          {"You will need to complete your profile "}
          <span className="font-semibold">before</span>
          {" your booked appointment time. Your appointment "}
          <span className="font-semibold">cannot</span>
          {" take place if you do not provide this information."}
        </p>

        {/* Action cards — Personal details + ID verification */}
        <div className="flex flex-col gap-[10px]">

          {/* Personal details → profile setup */}
          <button
            onClick={onStartProfile}
            className="w-full flex items-center gap-[14px] rounded-[14px] px-[16px] py-[14px] text-left transition-colors hover:bg-[rgba(19,92,255,0.03)]"
            style={{ border: "1px solid #d7e9ff", background: "white" }}
          >
            <div
              className="shrink-0 flex items-center justify-center w-[36px] h-[36px] rounded-full"
              style={{ background: "rgba(19,92,255,0.06)", border: "1px solid rgba(19,92,255,0.18)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 7.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6.5a5 5 0 0 1 10 0" stroke="#135CFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold mb-[2px]" style={{ color: "#1b1b1a" }}>Add your personal details</p>
              <p className="text-[12px] leading-[17px]" style={{ color: "#414245" }}>
                Mobile number, home address, emergency contact, and NHS GP details.
              </p>
            </div>
            <ChevronRight size={15} color="#9ca3af" className="shrink-0" />
          </button>

          {/* ID verification */}
          <button
            onClick={onStartVerification}
            className="w-full flex items-center gap-[14px] rounded-[14px] px-[16px] py-[14px] text-left transition-colors hover:bg-[rgba(19,92,255,0.03)]"
            style={{ border: "1px solid #d7e9ff", background: "white" }}
          >
            <div
              className="shrink-0 flex items-center justify-center w-[36px] h-[36px] rounded-full"
              style={{ background: "rgba(19,92,255,0.06)", border: "1px solid rgba(19,92,255,0.18)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="#135CFF" strokeWidth="1.4" />
                <circle cx="5.5" cy="8" r="1.5" stroke="#135CFF" strokeWidth="1.4" />
                <path d="M9 6.5h3.5M9 8h3.5M9 9.5h2.5" stroke="#135CFF" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold mb-[2px]" style={{ color: "#1b1b1a" }}>Verify your identity</p>
              <p className="text-[12px] leading-[17px]" style={{ color: "#414245" }}>
                Photos of a valid ID (passport or driving licence) and a selfie.
              </p>
            </div>
            <ChevronRight size={15} color="#9ca3af" className="shrink-0" />
          </button>

        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────────────── */}
      <div className="mx-[32px] h-px" style={{ background: "#f2f2f2" }} />

      {/* ── Placeholder ──────────────────────────────────────────── */}
      <div className="mx-[32px] my-[20px] rounded-[10px] h-[80px]" style={{ background: "#f9fafb", border: "1.5px dashed #d7e9ff" }} />

      {/* ── Divider ─────────────────────────────────────────────── */}
      <div className="mx-[32px] h-px" style={{ background: "#f2f2f2" }} />

      {/* ── Need help ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-[8px] px-[32px] py-[20px]">
        <p className="text-[15px] font-semibold" style={{ color: "#1b1b1a" }}>Need help?</p>
        <p className="text-[13px] leading-[18px]" style={{ color: "#1b1b1a" }}>
          The Patient Experience team is here for you.
        </p>
        <button className="flex items-center gap-[4px] text-[13px] font-semibold w-fit" style={{ color: "#135cff" }}>
          Contact us
          <ExternalLink size={12} strokeWidth={2} />
        </button>
      </div>

      {/* ── Divider ─────────────────────────────────────────────── */}
      <div className="mx-[32px] h-px" style={{ background: "#f2f2f2" }} />

      {/* ── Reset ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-end px-[32px] py-[16px]">
        <button
          onClick={onRestart}
          className="text-[12px]"
          style={{ color: "#9ca3af" }}
        >
          ↺ Start over
        </button>
      </div>

    </div>
  );
}

// ─── Profile setup: LHS panel ────────────────────────────────────────────────

/*
 * ProfileLhsPanel is gone. It was a second, hand-built copy of the LHS that
 * said `const PROFILE_SLIDES = 1; // static for now`: one hard-coded photo, one
 * hard-coded heading, five dots that never moved. Janelle, 26 Aug: "this is not
 * moving".
 *
 * The design does not have a separate static panel. Her profile frames draw the
 * same carousel as the rest of the journey, so the profile phase now renders
 * LhsPanel and there is one panel in the app instead of two that drift apart.
 * Its blur was 10px against LhsPanel's 5px and its mask 65% against 40%, which
 * is exactly the drift.
 */

function PField({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  const ws = "'Work Sans', sans-serif";
  return (
    <div className="relative w-full" style={{ marginTop: 10 }}>
      {/* Floating label */}
      <div
        className="absolute flex items-center gap-[4px] px-[4px] z-10"
        style={{ top: -10, left: 12, background: "white", fontFamily: ws }}
      >
        <span className="text-[14px] font-semibold leading-[20px]" style={{ color: "#0f37be" }}>{label}</span>
        {required && <span className="text-[14px] font-semibold leading-[20px]" style={{ color: "#991b1b" }}>*</span>}
      </div>
      <div
        className="bg-white rounded-[8px] flex items-center px-[16px] gap-[8px]"
        style={{
          height: 44,
          border: "1px solid #b9daff",
          boxShadow: "0 1px 2px rgba(15,55,190,0.05)",
        }}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-w-0 bg-transparent outline-none text-[14px] leading-[20px]"
          style={{ fontFamily: ws, color: "#030712" }}
        />
      </div>
    </div>
  );
}

// Country code combobox — styled to match Figma (UK flag avatar + chevron)
function CountryCodeField({ value, onClick }: { value: string; onClick: () => void }) {
  const ws = "'Work Sans', sans-serif";
  return (
    <div className="relative w-full" style={{ marginTop: 10 }}>
      <div
        className="absolute flex items-center gap-[4px] px-[4px] z-10"
        style={{ top: -10, left: 12, background: "white", fontFamily: ws }}
      >
        <span className="text-[14px] font-semibold leading-[20px]" style={{ color: "#0f37be" }}>Country code</span>
        <span className="text-[14px] font-semibold leading-[20px]" style={{ color: "#991b1b" }}>*</span>
      </div>
      <button
        onClick={onClick}
        className="w-full bg-white rounded-[8px] flex items-center px-[16px] gap-[8px]"
        style={{
          height: 44,
          border: "1px solid #b9daff",
          boxShadow: "0 1px 2px rgba(15,55,190,0.05)",
          fontFamily: ws,
        }}
      >
        {/* UK flag avatar */}
        <div className="shrink-0 w-[24px] h-[24px] rounded-full overflow-hidden">
          <img src={imgUKFlag} alt="UK" className="w-full h-full object-cover" />
        </div>
        <span className="flex-1 text-left text-[14px] leading-[20px]" style={{ color: "#030712" }}>
          {value}
        </span>
        <Search size={14} color="#4b5563" />
      </button>
    </div>
  );
}

// ─── Profile setup: Step 1 — Contact info ─────────────────────────────────────

// ─── Set up your profile · GP details (Figma 1836:310066) ────────────────────

// Radio card, per Figma 2196:12901. Whole card is the target.
function DsRadioCard({ selected, onSelect, label, error, children }: {
  selected: boolean;
  onSelect: () => void;
  label: string;
  error?: boolean;
  children?: ReactNode;
}) {
  const ws = "'Work Sans', sans-serif";
  return (
    <div
      className="flex flex-col gap-[16px] items-start w-full rounded-[16px] p-[16px]"
      style={{
        background: "#ffffff",
        border: `1px solid ${error ? "#991b1b" : selected ? "#135cff" : "#d7e9ff"}`,
        boxShadow: "0px 10px 7.5px rgba(15,55,190,0.05), 0px 4px 3px rgba(15,55,190,0.05)",
      }}
    >
      <button type="button" onClick={onSelect} className="flex gap-[8px] items-start w-full text-left cursor-pointer">
        <div className="flex flex-col items-center justify-center py-[2px] shrink-0">
          <div
            className="flex items-center justify-center rounded-full shrink-0"
            style={{ width: 16, height: 16, background: "#ffffff", border: `1px solid ${selected ? "#135cff" : "#b9daff"}`, boxShadow: "0px 1px 2px rgba(15,55,190,0.05)" }}
          >
            {selected && <div className="rounded-full" style={{ width: 8, height: 8, background: "#135cff" }} />}
          </div>
        </div>
        <span className="flex-1 min-w-0 text-[12px] leading-[16px]" style={{ color: "#030712", fontFamily: ws, minHeight: 20 }}>
          {label}
        </span>
      </button>
      {selected && children}
    </div>
  );
}

// Primary + tertiary pair used by every step of the profile setup.
function DsStepButtons({ nextLabel, prevLabel, onNext, onBack, busy, busyLabel, hideNextIcon }: {
  nextLabel: string;
  prevLabel: string;
  onNext: () => void;
  onBack: () => void;
  busy?: boolean;
  busyLabel?: string;
  hideNextIcon?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[16px] items-center w-full mt-[8px]">
      <button
        onClick={onNext}
        disabled={busy}
        className="w-full flex items-center justify-center gap-[8px] rounded-[9999px] text-[12px] font-semibold leading-[16px] px-[16px] py-[12px]"
        style={{ background: busy ? "#5b8dff" : "#135cff", color: "#edf6ff", boxShadow: "0px 4px 3px rgba(15,55,190,0.05), 0px 2px 2px rgba(15,55,190,0.05)" }}
      >
        {busy && <LoaderCircle size={16} color="#edf6ff" strokeWidth={2} className="animate-spin" />}
        {busy ? busyLabel ?? nextLabel : nextLabel}
        {!busy && !hideNextIcon && <ChevronRight size={16} color="#edf6ff" strokeWidth={2} />}
      </button>
      <button
        onClick={onBack}
        className="w-full flex items-center justify-center gap-[8px] rounded-[9999px] text-[12px] font-semibold leading-[16px] px-[16px] py-[12px]"
        style={{ background: "rgba(10,10,10,0.01)", border: "1px solid rgba(10,10,10,0.05)", color: "#030712", backdropFilter: "blur(6px)" }}
      >
        <ChevronLeft size={16} color="#030712" strokeWidth={2} />
        {prevLabel}
      </button>
    </div>
  );
}

// Autosuggest over the practices near the postcode the patient typed.
//
// The frame (1836:310066) draws a plain select, but the list it has to hold is
// "every surgery near you", which is long enough that scanning it is the wrong
// interaction. Typing narrows it instead. The field still opens on click, so
// the select behaviour in the frame still works for anyone who just clicks.
function PracticeAutosuggest({ postcode, value, onChange, error }: {
  postcode: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const ws = "'Work Sans', sans-serif";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const { practices, approximate } = practicesNear(postcode);
  const shown = filterPractices(practices, query);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setQuery(""); }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function choose(label: string) {
    onChange(label);
    setOpen(false);
    setQuery("");
  }

  const borderColor = error ? "#991b1b" : "#b9daff";
  return (
    <div className="w-full relative" style={{ zIndex: open ? 50 : undefined }} ref={ref}>
      <div className="flex flex-col isolate items-start relative w-full">
        <div
          className="absolute flex gap-[4px] items-center left-[12px] top-0 px-[4px] whitespace-nowrap z-[3]"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 50%, #ffffff 50%)" }}
        >
          <span className="text-[12px] font-semibold leading-[16px]" style={{ color: error ? "#991b1b" : "#0f37be", fontFamily: ws }}>GP</span>
          <span className="text-[12px] font-semibold leading-[16px]" style={{ color: "#991b1b", fontFamily: ws }}>*</span>
        </div>
        <div className="h-[8px] w-full z-[2]" />
        <div className="relative w-full z-[1]">
          <div
            className="flex gap-[8px] items-center w-full rounded-[8px] px-[16px]"
            style={{ height: 44, background: "#ffffff", border: `1px solid ${borderColor}`, boxShadow: "0px 1px 2px rgba(15,55,190,0.05)" }}
          >
            <input
              className="flex-1 min-w-0 text-[14px] leading-[20px] outline-none bg-transparent"
              style={{ fontFamily: ws, color: "#030712" }}
              placeholder="Select an option"
              value={open ? query : value}
              onFocus={() => setOpen(true)}
              onChange={(e) => { setOpen(true); setQuery(e.target.value); }}
            />
            <ChevronDown size={16} color="#4b5563" className="shrink-0" />
          </div>

          {open && (
            <SelectMenuShell>
              {approximate && (
                // NO FRAME. The frames show a plain list with no explanation,
                // but a list of surgeries that are near rather than at the
                // postcode needs to say so, or the first result reads as a
                // match. Replace if AXA drafts copy for this.
                <p
                  className="px-[8px] py-[10px] text-[12px] leading-[16px]"
                  style={{ color: "#4b5563", fontFamily: ws, borderBottom: "1px solid #d7e9ff" }}
                >
                  No surgery is registered at that postcode. These are the closest.
                </p>
              )}
              <ul role="listbox">
                {shown.map((p) => {
                  const label = practiceLabel(p);
                  return (
                    <li key={label} role="option" aria-selected={label === value}>
                      <SelectMenuItem selected={label === value} onClick={() => choose(label)}>
                        {label}
                      </SelectMenuItem>
                    </li>
                  );
                })}
                {shown.length === 0 && (
                  // NO FRAME. Same reason as the note above.
                  <li className="px-[8px] py-[10px] text-[12px] leading-[16px]" style={{ color: "#4b5563", fontFamily: ws }}>
                    {practices.length === 0
                      ? "We could not find any surgeries near that postcode. Check it, or enter the address manually."
                      : "No surgery matches that. Clear the box to see them all."}
                  </li>
                )}
              </ul>
            </SelectMenuShell>
          )}
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-[6px] mt-[6px]">
          <AlertCircle size={14} color="#991b1b" />
          <span className="text-[13px] font-semibold" style={{ color: "#991b1b", fontFamily: ws }}>{error}</span>
        </div>
      )}
    </div>
  );
}

function ProfileStep_GpDetails({ onNext, onBack, theme, initialState }: {
  onNext: () => void;
  onBack: () => void;
  theme?: BrandTheme;
  initialState?: keyof typeof DEMO_GP_DETAILS;
}) {
  const ws = "'Work Sans', sans-serif";
  const demo = initialState ? DEMO_GP_DETAILS[initialState] : undefined;
  const [choice, setChoice] = useState<GpChoice>(demo?.input.choice ?? "");
  const [practicePostcode, setPracticePostcode] = useState(demo?.input.practicePostcode ?? "");
  const [lookupRun, setLookupRun] = useState(demo?.input.lookupRun ?? false);
  const [selectedGp, setSelectedGp] = useState(demo?.input.selectedGp ?? "");
  const [nhsNumber, setNhsNumber] = useState(demo?.input.nhsNumber ?? "");
  const [errors, setErrors] = useState<GpDetailsErrors>(demo?.errors ?? {});
  const [submitting, setSubmitting] = useState(false);

  const practice = findPractice(selectedGp);

  function runLookup() {
    if (!isValidPostcode(practicePostcode)) {
      setErrors((e) => ({
        ...e,
        practicePostcode: practicePostcode.trim() ? "Postcode is not valid." : "Please provide your GP practice postcode.",
      }));
      return;
    }
    setErrors((e) => ({ ...e, practicePostcode: undefined }));
    setSelectedGp("");
    setLookupRun(true);
  }

  function handleNext() {
    const e = validateGpDetails({ choice, practicePostcode, lookupRun, selectedGp, nhsNumber });
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSubmitting(true);
    window.setTimeout(() => { setSubmitting(false); onNext(); }, 700);
  }

  return (
    <div className="flex flex-col gap-[16px] p-[24px] sm:p-[32px]" style={{ fontFamily: ws }} onKeyDown={enterSubmits(handleNext, submitting)}>
      <p className="text-[20px] font-semibold leading-[28px]" style={{ color: theme?.lhsHeadingColor ?? "#133595" }}>
        Set up your profile
      </p>

      <DsLinearProgress step={3} total={4} percent={60} />

      <div className="flex flex-col gap-[4px]">
        <p className="text-[18px] font-semibold leading-[28px]" style={{ color: theme?.lhsHeadingColor ?? "#133595" }}>
          GP details
        </p>
        <p className="text-[14px] leading-[20px]" style={{ color: "#030712" }}>
          We ask for your GP details as our clinicians may need to share information with them. Don&rsquo;t worry, you will be explicitly asked for permission.
        </p>
      </div>

      <DsRadioCard
        selected={choice === "provide"}
        onSelect={() => { setChoice("provide"); setErrors((e) => ({ ...e, choice: undefined })); }}
        label="I want to provide my NHS GP&rsquo;s details"
        error={!!errors.choice}
      >
        {practice ? (
          <div className="flex flex-col gap-[16px] w-full rounded-[16px] p-[16px]" style={{ background: "#edf6ff" }}>
            <div className="flex flex-col gap-[4px]">
              <p className="text-[14px] leading-[20px]" style={{ color: "#030712" }}>{practice.name}</p>
              {practice.lines.map((line) => (
                <p key={line} className="text-[14px] leading-[20px]" style={{ color: "#030712" }}>{line}</p>
              ))}
              <p className="text-[14px] leading-[20px]" style={{ color: "#030712" }}>{practice.postcode}</p>
            </div>
            <button
              type="button"
              onClick={() => { setSelectedGp(""); setLookupRun(false); setErrors((e) => ({ ...e, gp: undefined })); }}
              className="flex gap-[8px] items-center text-[12px] font-semibold leading-[16px] w-fit"
              style={{ color: "#135cff" }}
            >
              <ChevronLeft size={16} color="#135cff" strokeWidth={2} />
              Change GP
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-[8px] w-full">
            <div className="flex gap-[8px] items-start w-full">
              <div className="flex-1 min-w-0">
                <DsField
                  label="Find GP" required
                  value={practicePostcode}
                  onChange={(v) => { setPracticePostcode(v); setLookupRun(false); setErrors((e) => ({ ...e, practicePostcode: undefined, gp: undefined })); }}
                  placeholder="e.g., W1W 8QB"
                  error={errors.practicePostcode}
                />
              </div>
              {/* Centred on the INPUT BOX, not on the field wrapper. Janelle's
                  Figma CSS for Postcode lookup has the input-and-button row at
                  align-items:center with a 44 input and a 48 button, so the
                  button overhangs it by 2px each side. DsField's box starts 8px
                  down, behind the label notch, putting its centre at 8+22=30;
                  a 48-tall button therefore starts at 30-24=6. items-start on
                  the row is deliberate, so a validation message under the input
                  does not drag the button down with it. */}
              <button
                type="button"
                onClick={runLookup}
                className="flex items-center justify-center rounded-[9999px] shrink-0 px-[16px] text-[12px] font-semibold leading-[16px]"
                style={{ height: 48, marginTop: 6, border: "1px solid #135cff", color: "#135cff", boxShadow: "0px 4px 6px -1px rgba(15,55,190,0.05), 0px 2px 4px -2px rgba(15,55,190,0.05)" }}
              >
                Find address
              </button>
            </div>
            <button
              type="button"
              onClick={runLookup}
              className="text-[12px] font-semibold leading-[16px] w-fit"
              style={{ color: "#135cff" }}
            >
              Enter address manually
            </button>

            {lookupRun && (
              <PracticeAutosuggest
                postcode={practicePostcode}
                value={selectedGp}
                onChange={(v) => { setSelectedGp(v); setErrors((e) => ({ ...e, gp: undefined })); }}
                error={errors.gp}
              />
            )}
          </div>
        )}

        <DsField
          label="NHS number (optional)"
          value={nhsNumber}
          onChange={(v) => { setNhsNumber(v); setErrors((e) => ({ ...e, nhsNumber: undefined })); }}
          placeholder="Your 10-digit NHS number"
          error={errors.nhsNumber}
        />
      </DsRadioCard>

      <DsRadioCard
        selected={choice === "decline"}
        onSelect={() => { setChoice("decline"); setErrors((e) => ({ ...e, choice: undefined })); }}
        label="I do not want to provide these details"
        error={!!errors.choice}
      >
        <p className="text-[12px] leading-[16px]" style={{ color: "#4b5563" }}>{GP_DECLINE_NOTE}</p>
      </DsRadioCard>

      {errors.choice && <CaptchaMessage message={errors.choice} />}

      <DsStepButtons
        nextLabel="Next: emergency contact"
        prevLabel="Previous: personal details"
        onNext={handleNext}
        onBack={onBack}
        busy={submitting}
      />
    </div>
  );
}

function DsStatusBanner({ notice }: { notice: PlanNotice }) {
  const ws = "'Work Sans', sans-serif";
  const warning = notice.tone === "warning";
  const ink = warning ? "#92400e" : "#030712";
  return (
    <div
      className="flex gap-[8px] items-start w-full rounded-[8px] p-[8px]"
      style={{ background: warning ? "#fffef9" : "#ffffff", border: `1px solid ${ink}`, fontFamily: ws }}
      role={warning ? "alert" : "status"}
    >
      {warning
        ? <TriangleAlert size={20} color={ink} strokeWidth={1.67} className="shrink-0" />
        : <Info size={20} color={ink} strokeWidth={1.67} className="shrink-0" />}
      <div className="flex flex-col gap-[4px] flex-1 min-w-0">
        <p className="text-[12px] font-semibold leading-[16px]" style={{ color: ink, minHeight: 20 }}>{notice.title}</p>
        {/* The file holds the description as one text block with blank lines
            between paragraphs, so the gap after the first is a full line. */}
        {notice.paragraphs.map((p, i) => (
          <p key={p} className="text-[12px] leading-[16px]" style={{ color: ink, marginTop: i === 0 ? 0 : 12 }}>{p}</p>
        ))}
      </div>
    </div>
  );
}

// ─── Set up your account landing (Figma 1836:327771 / 1836:329977) ───────────

// Badge sits on the card's top border. Three states, all from the file:
// Next up (solid), Later (amber outline), Completed (blue outline with a check).
function LandingBadge({ kind }: { kind: "next" | "later" | "done" }) {
  const ws = "'Work Sans', sans-serif";
  const style =
    kind === "next" ? { background: "#135cff", border: "1px solid transparent", color: "#edf6ff" }
    : kind === "later" ? { background: "#ffffff", border: "1px solid #ffb306", color: "#030712" }
    : { background: "#ffffff", border: "1px solid #135cff", color: "#135cff" };
  return (
    <div
      className="absolute flex gap-[4px] items-center justify-center left-[23px] top-[-10px] px-[8px] py-[2px] rounded-full"
      style={{ ...style, fontFamily: ws }}
    >
      {kind === "done" && <Check size={12} color="#135cff" strokeWidth={2.5} />}
      <span className="text-[11px] font-semibold leading-[14px] whitespace-nowrap">
        {kind === "next" ? "Next up" : kind === "later" ? "Later" : "Completed"}
      </span>
    </div>
  );
}

function LandingTaskCard({ badge, borderColor, icon, title, description, cta, onCta }: {
  badge: "next" | "later" | "done";
  borderColor: string;
  icon: ReactNode;
  title: string;
  description: string;
  cta?: string;
  onCta?: () => void;
}) {
  const ws = "'Work Sans', sans-serif";
  return (
    <div
      className="relative flex flex-wrap gap-[16px] items-center w-full rounded-[16px] p-[24px]"
      style={{
        background: "#ffffff",
        border: `1px solid ${borderColor}`,
        boxShadow: "0px 10px 7.5px rgba(15,55,190,0.05), 0px 4px 3px rgba(15,55,190,0.05)",
        fontFamily: ws,
      }}
    >
      <LandingBadge kind={badge} />
      <div className="flex flex-col gap-[8px] items-start flex-1" style={{ minWidth: 208 }}>
        {icon}
        <div className="flex flex-col gap-[4px] items-start w-full">
          <p className="text-[18px] font-semibold leading-[28px] w-full" style={{ color: "#133595" }}>{title}</p>
          <p className="text-[12px] leading-[16px] w-full" style={{ color: "#4b5563" }}>{description}</p>
        </div>
      </div>
      {cta && (
        <button
          onClick={onCta}
          className="flex gap-[8px] items-center justify-center shrink-0 rounded-full px-[16px] py-[12px] text-[12px] font-semibold leading-[16px]"
          style={{ background: "#135cff", color: "#edf6ff", boxShadow: "0px 4px 3px rgba(15,55,190,0.05), 0px 2px 2px rgba(15,55,190,0.05)" }}
        >
          {cta}
          <ChevronRight size={16} color="#edf6ff" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

// 5066:125767, "Profile setup complete", and the exported CSS Janelle sent.
//
// THIS IS THE LAST SCREEN. Janelle, 3 Sep: "this should be the last one they
// see after the emergency contact step" and "there wont be any verification set
// up for them". So the two task cards that used to live here are gone. What
// replaced them is a single card: what happens next, who Full Health Medical
// are, and one button into the questionnaire.
//
// 0041CC for the three step icons, which is a deeper blue than the 166534 green
// on the landing's four. Both are from their own frame's CSS; they are not
// meant to match.
const COMPLETE_STEPS = [
  // I5066:125767 next steps, Frame 1
  { Icon: ListTodo, text: "Fill in a short lifestyle questionnaire to help us assess your current health." },
  // Frame 5
  { Icon: CheckCheck, text: "Receive your results and recommended next steps." },
  // Frame 4
  { Icon: MapPin, text: "If advised to book an Advanced Corporate Health Assessment, you can easily schedule your appointment at a nearby location." },
];

function ProfileComplete({ theme, onContinue }: {
  theme: BrandTheme;
  /**
   * Into the questionnaire, which is not built. Inert for now rather than
   * wired to something wrong: the questionnaire is a separate scope and its
   * content has not been supplied.
   */
  onContinue: () => void;
}) {
  const ws = "'Work Sans', sans-serif";
  const [aboutOpen, setAboutOpen] = useState(true);
  return (
    <div className="flex flex-col gap-[24px] items-center w-full max-w-[672px] px-[20px] pt-[24px] pb-[32px] sm:px-0 sm:pt-0 sm:pb-0" style={{ fontFamily: ws }}>
      {/* 48x48 ring, 24px check, both #133595 */}
      <div className="flex items-center justify-center shrink-0 w-[48px] h-[48px] rounded-[9999px]" style={{ border: "1px solid #133595" }}>
        <Check size={24} color="#133595" strokeWidth={2} />
      </div>

      <div className="flex flex-col gap-[4px] items-center w-full text-center">
        <p className="text-[24px] font-semibold leading-[32px]" style={{ color: "#133595" }}>
          Profile complete
        </p>
        <p className="text-[16px] leading-[24px]" style={{ color: "#030712" }}>
          You&rsquo;re all set to book your first health assessment.
        </p>
      </div>

      {/* The card is the only one on this screen with the primary border and
          the Next up badge, which is what marks it as the thing to do. */}
      <div
        className="relative w-full rounded-[16px] bg-white"
        style={{ border: "1px solid #135CFF", boxShadow: "0px 10px 15px -3px rgba(15,55,190,0.05), 0px 4px 6px -4px rgba(15,55,190,0.05)" }}
      >
        <span
          className="absolute left-[24px] top-[-9px] flex items-center justify-center px-[8px] py-[2px] rounded-[9999px] text-[12px] font-semibold leading-[16px]"
          style={{ background: "#135CFF", color: "#EDF6FF" }}
        >
          Next up
        </span>

        <div className="flex flex-col gap-[16px] py-[24px]">
          <div className="flex flex-col gap-[16px] px-[24px]">
            <div className="flex flex-col gap-[8px] p-[16px] rounded-[16px]" style={{ background: "#EDF6FF" }}>
              <p className="text-[16px] font-semibold leading-[24px]" style={{ color: "#030712" }}>
                Next steps:
              </p>
              <div className="flex flex-col gap-[8px] w-full">
                {COMPLETE_STEPS.map(({ Icon, text }) => (
                  <div key={text} className="flex gap-[8px] items-start w-full">
                    <div className="flex items-center shrink-0 h-[20px] w-[16px]">
                      <Icon size={16} color="#0041CC" strokeWidth={1.33} />
                    </div>
                    <p className="[word-break:break-word] text-[14px] leading-[20px] flex-1" style={{ color: "#030712" }}>
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[16px] leading-[24px]" style={{ color: "#030712" }}>
              Through our collaboration with Full Health Medical, you can complete necessary questionnaires, access your test results, and receive personalised reports. If recommended, you can also schedule your Advanced Corporate Health Assessment conveniently.
            </p>

            {/* A disclosure, not a link. The frame draws it expanded with a
                ChevronUp, so that is the default here. */}
            <button
              onClick={() => setAboutOpen((v) => !v)}
              className="flex items-center gap-[8px] text-[14px] font-semibold leading-[20px] self-start"
              style={{ color: "#135CFF", background: "none", border: "none", padding: 0, cursor: "pointer" }}
              aria-expanded={aboutOpen}
            >
              About Full Health Medical
              {aboutOpen
                ? <ChevronUp size={16} color="#135CFF" strokeWidth={1.33} />
                : <ChevronDown size={16} color="#135CFF" strokeWidth={1.33} />}
            </button>

            {aboutOpen && (
              <p className="text-[14px] leading-[20px]" style={{ color: "#030712" }}>
                Full Health Medical are a trusted provider specialising in medical assessments. They securely manage your clinical evaluation through their dedicated booking platform.
              </p>
            )}
          </div>

          <div className="px-[24px]">
            <button
              onClick={onContinue}
              className="w-full flex items-center justify-center gap-[8px] rounded-[9999px] px-[16px] py-[12px] text-[14px] font-semibold leading-[20px] cursor-pointer"
              style={{ background: "#135CFF", color: "#EDF6FF", border: "none", boxShadow: "0px 10px 15px -3px rgba(15,55,190,0.05), 0px 4px 6px -4px rgba(15,55,190,0.05)" }}
            >
              Continue to questionnaire
            </button>
          </div>
        </div>
      </div>

      {/* 672 x 400, radius 32, the same carousel panel as everywhere else. */}
      <div className="relative w-full rounded-[32px] overflow-hidden flex" style={{ height: 400 }}>
        <LhsPanel theme={theme} />
      </div>
    </div>
  );
}


// ─── Set up your profile · Emergency contact (Figma 1836:310154) ─────────────

function ProfileStep_EmergencyContact({ onFinish, onBack, theme, initialState }: {
  onFinish: () => void;
  onBack: () => void;
  theme?: BrandTheme;
  initialState?: keyof typeof DEMO_EMERGENCY_CONTACT;
}) {
  const ws = "'Work Sans', sans-serif";
  const demo = initialState ? DEMO_EMERGENCY_CONTACT[initialState] : undefined;
  const [choice, setChoice] = useState<EmergencyContactChoice>(demo?.input.choice ?? "");
  const [name, setName] = useState(demo?.input.name ?? "");
  const [countryCode, setCountryCode] = useState(demo?.input.countryCode ?? "United Kingdom (+44)");
  const [mobile, setMobile] = useState(demo?.input.mobile ?? "");
  const [relationship, setRelationship] = useState(demo?.input.relationship ?? "");
  const [errors, setErrors] = useState<EmergencyContactErrors>(demo?.errors ?? {});
  const [saving, setSaving] = useState(false);

  function handleFinish() {
    const e = validateEmergencyContact({ choice, name, countryCode, mobile, relationship });
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSaving(true);
    window.setTimeout(() => { setSaving(false); onFinish(); }, 1200);
  }

  return (
    <div className="flex flex-col gap-[16px] p-[24px] sm:p-[32px]" style={{ fontFamily: ws }} onKeyDown={enterSubmits(handleFinish, saving)}>
      <p className="text-[20px] font-semibold leading-[28px]" style={{ color: theme?.lhsHeadingColor ?? "#133595" }}>
        Set up your profile
      </p>

      <DsLinearProgress step={4} total={4} percent={80} done={saving} />

      <div className="flex flex-col gap-[4px]">
        <p className="text-[18px] font-semibold leading-[28px]" style={{ color: theme?.lhsHeadingColor ?? "#133595" }}>
          Emergency contact (optional)
        </p>
        <p className="text-[14px] leading-[20px]" style={{ color: "#030712" }}>
          We&rsquo;ll reach out to them only in a medical emergency, or if we can&rsquo;t reach you and we have reasonable concerns about your health and wellbeing.
        </p>
      </div>

      <DsRadioCard
        selected={choice === "provide"}
        onSelect={() => { setChoice("provide"); setErrors((e) => ({ ...e, choice: undefined })); }}
        label="I want to provide emergency contact details"
        error={!!errors.choice}
      >
        <DsField
          label="Name" required
          value={name}
          onChange={(v) => { setName(v); setErrors((e) => ({ ...e, name: undefined })); }}
          placeholder="e.g., Jane Smith"
          error={errors.name}
        />
        <CountrySelect
          label="Country code" withDial
          value={countryCode}
          onChange={setCountryCode}
        />
        <DsField
          label="Mobile number" required
          value={mobile}
          onChange={(v) => { setMobile(v); setErrors((e) => ({ ...e, mobile: undefined })); }}
          placeholder="e.g., 07123 456 789"
          error={errors.mobile}
        />
        <DsSelect
          label="Relationship to you" required
          placeholder="Select an option"
          options={RELATIONSHIP_OPTIONS}
          value={relationship}
          onChange={(v) => { setRelationship(v); setErrors((e) => ({ ...e, relationship: undefined })); }}
          error={errors.relationship}
        />
      </DsRadioCard>

      <DsRadioCard
        selected={choice === "decline"}
        onSelect={() => { setChoice("decline"); setErrors((e) => ({ ...e, choice: undefined })); }}
        label="I do not want to provide these details"
        error={!!errors.choice}
      >
        <p className="text-[12px] leading-[16px]" style={{ color: "#4b5563" }}>
          We recommend having emergency contact details saved to your profile in case of a medical emergency, or if we can&rsquo;t reach you and we have reasonable concerns about your health and wellbeing.
        </p>
      </DsRadioCard>

      {errors.choice && <CaptchaMessage message={errors.choice} />}

      <DsStepButtons
        nextLabel="Finish profile setup"
        prevLabel="Previous: GP details"
        onNext={handleFinish}
        onBack={onBack}
        busy={saving}
        busyLabel="Saving your profile..."
        hideNextIcon
      />
    </div>
  );
}

// ─── Set up your profile · Personal details (Figma 2052:113050) ───────────────

// Four lines the way the design shows them, not one comma-joined string.
const DEMO_LOOKUP_ADDRESSES = [
  "123 Main Street\nFlat 45\nCity/Town\nAA1 1AA",
  "125 Main Street\nCity/Town\nAA1 1AA",
  "127 Main Street\nCity/Town\nAA1 1AA",
];

function ProfileStep_PersonalDetails({ onNext, onBack, theme, initialState }: {
  onNext: () => void;
  onBack: () => void;
  theme?: BrandTheme;
  initialState?: keyof typeof DEMO_PERSONAL_DETAILS;
}) {
  const ws = "'Work Sans', sans-serif";
  const demo = initialState ? DEMO_PERSONAL_DETAILS[initialState] : undefined;

  const [sex, setSex] = useState(demo?.input.sex ?? "");
  const [country, setCountry] = useState(demo?.input.country ?? "United Kingdom");
  const [postcode, setPostcode] = useState(demo?.input.postcode ?? "");
  const [selectedAddress, setSelectedAddress] = useState(demo?.input.selectedAddress ?? "");
  const [lookupRun, setLookupRun] = useState(demo?.input.lookupRun ?? false);
  const [manual, setManual] = useState(demo?.input.manual ?? false);
  const [addressLine1, setAddressLine1] = useState(demo?.input.addressLine1 ?? "");
  const [addressLine2, setAddressLine2] = useState(demo?.input.addressLine2 ?? "");
  const [townOrCity, setTownOrCity] = useState(demo?.input.townOrCity ?? "");
  const [errors, setErrors] = useState<PersonalDetailsErrors>(demo?.errors ?? {});
  const [submitting, setSubmitting] = useState(false);

  function runLookup() {
    if (!isValidPostcode(postcode)) {
      setErrors((e) => ({ ...e, postcode: postcode.trim() ? "Postcode is not valid." : "Please provide your postcode." }));
      return;
    }
    setErrors((e) => ({ ...e, postcode: undefined }));
    setSelectedAddress("");
    setLookupRun(true);
  }

  function handleNext() {
    const e = validatePersonalDetails({
      sex, country, postcode, selectedAddress, lookupRun, manual, addressLine1, addressLine2, townOrCity,
    });
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    // The design has a loading state on this button (2191:85588), so the step
    // does not hand off instantly.
    setSubmitting(true);
    window.setTimeout(() => { setSubmitting(false); onNext(); }, 700);
  }

  function startOver() {
    setSelectedAddress("");
    setLookupRun(false);
    setManual(false);
    setErrors({});
  }

  return (
    <div className="flex flex-col gap-[16px] p-[24px] sm:p-[32px]" style={{ fontFamily: ws }} onKeyDown={enterSubmits(handleNext, submitting)}>
      <p className="text-[20px] font-semibold leading-[28px]" style={{ color: theme?.lhsHeadingColor ?? "#133595" }}>
        Set up your profile
      </p>

      <DsLinearProgress step={2} total={4} percent={40} />

      <div className="flex flex-col gap-[4px]">
        <p className="text-[18px] font-semibold leading-[28px]" style={{ color: theme?.lhsHeadingColor ?? "#133595" }}>
          Personal details
        </p>
        <p className="text-[14px] leading-[20px]" style={{ color: "#030712" }}>
          To help us provide you with the best and safest care, we just need a few more details.
        </p>
      </div>

      <DsToggleGroup
        label="Sex at birth" required
        options={["Female", "Male"]}
        value={sex}
        onChange={(v) => { setSex(v); setErrors((e) => ({ ...e, sex: undefined })); }}
        error={errors.sex}
      />

      <div className="h-px w-full" style={{ background: "#d7e9ff" }} />

      {/* The icon was already here and did nothing: a decorative <Info /> with
          no label, no keyboard target and nothing to reveal. InfoTooltip is the
          same icon wired to the copy the frame puts behind it. */}
      <InfoTooltip
        label="Current residence address"
        body="Please provide the address where you currently reside in the UK. If you are in the UK temporarily, enter your location while you are visiting, not your permanent address abroad."
      />

      {selectedAddress && (
        <div className="flex flex-col gap-[16px] w-full rounded-[16px] p-[16px]" style={{ background: "#edf6ff" }}>
          <div className="flex flex-col gap-[4px]">
            {selectedAddress.split("\n").map((line) => (
              <p key={line} className="text-[14px] leading-[20px]" style={{ color: "#030712" }}>{line}</p>
            ))}
          </div>
          <button
            type="button"
            onClick={startOver}
            className="flex gap-[8px] items-center text-[12px] font-semibold leading-[16px] w-fit"
            style={{ color: "#135cff" }}
          >
            <ChevronLeft size={16} color="#135cff" strokeWidth={2} />
            Change address
          </button>
        </div>
      )}

      {!selectedAddress && !manual && (
        <>
          {/* A real picker again, per the Country dropdown design (Janelle,
              25 Aug). It was pinned to the UK on 24 Aug on the basis that the
              service is UK-only; the design shows the address country as a
              dropdown, and the design wins. */}
          <CountrySelect
            label="Country"
            value={country}
            onChange={(v) => { setCountry(v); setErrors((e) => ({ ...e, country: undefined })); }}
            error={errors.country}
          />

          <div className="flex gap-[8px] items-start w-full">
            <div className="flex-1 min-w-0">
              <DsField
                label="Postcode" required
                value={postcode}
                onChange={(v) => { setPostcode(v); setLookupRun(false); setErrors((e) => ({ ...e, postcode: undefined, address: undefined })); }}
                placeholder="e.g., W1W 8QB"
                error={errors.postcode}
              />
            </div>
            <button
              type="button"
              onClick={runLookup}
              aria-label="Find address"
              className="flex items-center justify-center rounded-[9999px] shrink-0"
              style={{ width: 44, height: 44, marginTop: 8, border: "1px solid #135cff", boxShadow: "0px 4px 6px -1px rgba(15,55,190,0.05), 0px 2px 4px -2px rgba(15,55,190,0.05)" }}
            >
              <Search size={16} color="#135cff" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => { setManual(true); setLookupRun(false); setErrors({}); }}
            className="text-[12px] font-semibold leading-[16px] w-fit"
            style={{ color: "#135cff" }}
          >
            Enter address manually
          </button>

          {lookupRun && (
            <DsSelect
              label="Address" required
              placeholder="Select an address"
              options={DEMO_LOOKUP_ADDRESSES}
              value={selectedAddress}
              onChange={(v) => { setSelectedAddress(v); setErrors((e) => ({ ...e, address: undefined })); }}
              error={errors.address}
            />
          )}
        </>
      )}

      {!selectedAddress && manual && (
        <>
          <DsField
            label="Address line 1" required
            value={addressLine1}
            onChange={(v) => { setAddressLine1(v); setErrors((e) => ({ ...e, addressLine1: undefined })); }}
            placeholder="e.g., 19 Great Portland Street"
            error={errors.addressLine1}
          />
          <DsField
            label="Address line 2 (optional)"
            value={addressLine2}
            onChange={setAddressLine2}
            placeholder="e.g., Flat 1, Building Name"
          />
          <DsField
            label="Town or city" required
            value={townOrCity}
            onChange={(v) => { setTownOrCity(v); setErrors((e) => ({ ...e, townOrCity: undefined })); }}
            placeholder="e.g., London"
            error={errors.townOrCity}
          />
          <DsField
            label="Postcode" required
            value={postcode}
            onChange={(v) => { setPostcode(v); setErrors((e) => ({ ...e, postcode: undefined })); }}
            placeholder="e.g., W1W 8QB"
            error={errors.postcode}
          />
          {/* A real picker again, per the Country dropdown design (Janelle,
              25 Aug). It was pinned to the UK on 24 Aug on the basis that the
              service is UK-only; the design shows the address country as a
              dropdown, and the design wins. */}
          <CountrySelect
            label="Country"
            value={country}
            onChange={(v) => { setCountry(v); setErrors((e) => ({ ...e, country: undefined })); }}
            error={errors.country}
          />
          {/* Not in the manual-entry frames, but without it there is no way back
              to the postcode lookup once you switch. */}
          <button
            type="button"
            onClick={startOver}
            className="text-[12px] font-semibold leading-[16px] w-fit"
            style={{ color: "#135cff" }}
          >
            Search for address instead
          </button>
        </>
      )}

      <DsStepButtons
        nextLabel="Next: GP details"
        prevLabel="Previous: contact info"
        onNext={handleNext}
        onBack={onBack}
        busy={submitting}
      />
    </div>
  );
}

function ProfileStep_ContactInfo({ onNext, theme, initialState, initialStage }: {
  onNext: () => void;
  theme?: BrandTheme;
  initialState?: keyof typeof DEMO_CONTACT_INFO;
  initialStage?: "code" | "code-error" | "code-failed";
}) {
  const ws = "'Work Sans', sans-serif";
  const demo = initialState ? DEMO_CONTACT_INFO[initialState] : undefined;
  const [countryCode, setCountryCode] = useState(demo?.input.countryCode ?? "United Kingdom (+44)");
  const [mobile, setMobile] = useState(demo?.input.mobile ?? (initialStage ? "07123456789" : ""));
  const [errors, setErrors] = useState<ContactInfoErrors>(demo?.errors ?? {});

  // The design splits this step in two: give a number, then enter the code
  // that arrives by text.
  const [stage, setStage] = useState<"phone" | "code">(initialStage ? "code" : "phone");
  const [sending, setSending] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState<string | undefined>(
    initialStage === "code-error" ? OTP_MESSAGES.incomplete : undefined,
  );
  const [verifying, setVerifying] = useState(false);
  const [failed, setFailed] = useState(initialStage === "code-failed");
  const [verified, setVerified] = useState(false);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);

  // Countdown behind "Resend code (59s)...", restarted whenever a code is sent.
  useEffect(() => {
    if (stage !== "code" || resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [stage, resendIn]);

  function sendCode() {
    const e = validateContactInfo({ countryCode, mobile });
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setStage("code");
      setCode(""); setCodeError(undefined); setFailed(false);
      setResendIn(RESEND_SECONDS);
    }, 900);
  }

  function verifyCode() {
    const outcome = checkOtp(code);
    if (outcome === "incomplete") {
      setCodeError(OTP_MESSAGES.incomplete);
      setFailed(false);
      return;
    }
    setCodeError(undefined);
    setVerifying(true);
    window.setTimeout(() => {
      setVerifying(false);
      if (outcome === "verified") {
        setFailed(false);
        setVerified(true);
        window.setTimeout(onNext, TOAST_DWELL_MS);
      } else {
        setFailed(true);
      }
    }, 900);
  }

  const heading = (
    <>
      <p className="text-[20px] font-semibold leading-[28px]" style={{ color: theme?.lhsHeadingColor ?? "#133595" }}>
        Set up your profile
      </p>
      <DsLinearProgress step={1} total={4} percent={20} />
    </>
  );

  if (stage === "code") {
    return (
      <div className="flex flex-col gap-[16px] p-[24px] sm:p-[32px]" style={{ fontFamily: ws }} onKeyDown={enterSubmits(verifyCode, verifying || verified)}>
        {heading}

        <div className="flex flex-col gap-[4px] items-start">
          <p className="text-[18px] font-semibold leading-[28px]" style={{ color: theme?.lhsHeadingColor ?? "#133595" }}>
            Contact info
          </p>
          <p className="text-[14px] leading-[20px]" style={{ color: "#030712" }}>
            Enter the code sent to {formatForDisplay(mobile)}.
          </p>
          <button
            type="button"
            onClick={() => { setStage("phone"); setCode(""); setCodeError(undefined); setFailed(false); }}
            className="flex gap-[8px] items-center text-[12px] font-semibold leading-[16px]"
            style={{ color: "#135cff" }}
          >
            <ChevronLeft size={16} color="#135cff" strokeWidth={2} />
            Change number
          </button>
        </div>

        <DsOtpInput
          label="Verification code" required
          value={code}
          onChange={(v) => { setCode(v); setCodeError(undefined); setFailed(false); }}
          error={codeError}
        />

        {/* Floats, per 1836:310658 at x=496 y=48. The matching failure state
            (2197:122108) sits inline below, at x=0, because it is asking for a
            correction rather than announcing one. */}
        {verified && <Toast title={OTP_MESSAGES.successTitle} body={OTP_MESSAGES.successBody} />}

        {failed && (
          <InlineErrorBox title={OTP_MESSAGES.failedTitle} body={OTP_MESSAGES.failedBody}>
            <div className="flex flex-wrap gap-[4px] items-center">
              <span className="text-[12px] leading-[16px]" style={{ color: "#4b5563" }}>Need support?</span>
              <button type="button" className="flex gap-[4px] items-center text-[12px] font-semibold leading-[16px]" style={{ color: "#135cff" }}>
                Contact us
                <ExternalLink size={14} color="#135cff" strokeWidth={2} />
              </button>
            </div>
          </InlineErrorBox>
        )}

        <div className="flex flex-col gap-[16px] items-center w-full mt-[8px]">
          <button
            onClick={verifyCode}
            disabled={verifying || verified}
            className="w-full flex items-center justify-center gap-[8px] rounded-[9999px] text-[12px] font-semibold leading-[16px] px-[16px] py-[12px]"
            style={{ background: verifying || verified ? "#5b8dff" : "#135cff", color: "#edf6ff", boxShadow: "0px 4px 3px rgba(15,55,190,0.05), 0px 2px 2px rgba(15,55,190,0.05)" }}
          >
            {verifying && <LoaderCircle size={16} color="#edf6ff" strokeWidth={2} className="animate-spin" />}
            {verifying ? "Verifying code..." : "Verify code"}
          </button>

          <button
            type="button"
            onClick={() => { setResendIn(RESEND_SECONDS); setCode(""); setCodeError(undefined); setFailed(false); }}
            disabled={resendIn > 0}
            className="w-full flex items-center justify-center rounded-[9999px] text-[12px] font-semibold leading-[16px] px-[16px] py-[12px]"
            style={{
              background: "#ffffff", border: "1px solid #ffb306", color: "#030712",
              opacity: resendIn > 0 ? 0.5 : 1,
              boxShadow: "0px 4px 3px rgba(15,55,190,0.05), 0px 2px 2px rgba(15,55,190,0.05)",
            }}
          >
            {resendIn > 0 ? `Resend code (${resendIn}s)...` : "Resend code"}
          </button>

          <div className="flex flex-wrap gap-[4px] items-center justify-center w-full">
            <span className="text-[12px] leading-[16px]" style={{ color: "#4b5563" }}>Trouble verifying?</span>
            <button type="button" className="text-[12px] font-semibold leading-[16px]" style={{ color: "#135cff" }}>
              Contact the Patient Experience team
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[16px] p-[24px] sm:p-[32px]" style={{ fontFamily: ws }} onKeyDown={enterSubmits(sendCode, sending)}>
      {heading}

      <div className="flex flex-col gap-[4px]">
        <p className="text-[18px] font-semibold leading-[28px]" style={{ color: theme?.lhsHeadingColor ?? "#133595" }}>
          Contact info
        </p>
        <p className="text-[14px] leading-[20px]" style={{ color: "#030712" }}>
          We&rsquo;ll need your mobile number to contact you about your results.
        </p>
      </div>

      <CountrySelect
        label="Country code" withDial
        value={countryCode}
        onChange={setCountryCode}
        error={errors.countryCode}
      />

      <DsField
        label="Mobile number" required
        value={mobile}
        onChange={(v) => { setMobile(v); setErrors((e) => ({ ...e, mobile: undefined })); }}
        placeholder="e.g., 07123 456 789"
        error={errors.mobile}
      />

      <div className="flex flex-col gap-[16px] items-center w-full mt-[8px]">
        <button
          onClick={sendCode}
          disabled={sending}
          className="w-full flex items-center justify-center gap-[8px] rounded-[9999px] text-[12px] font-semibold leading-[16px] px-[16px] py-[12px]"
          style={{ background: sending ? "#5b8dff" : "#135cff", color: "#edf6ff", boxShadow: "0px 4px 3px rgba(15,55,190,0.05), 0px 2px 2px rgba(15,55,190,0.05)" }}
        >
          {sending && <LoaderCircle size={16} color="#edf6ff" strokeWidth={2} className="animate-spin" />}
          {sending ? "Sending verification code..." : "Send verification code"}
        </button>
        <div className="flex flex-wrap gap-[4px] items-center justify-center w-full">
          <span className="text-[12px] leading-[16px]" style={{ color: "#4b5563" }}>Don&rsquo;t have a mobile number?</span>
          <button type="button" className="text-[12px] font-semibold leading-[16px]" style={{ color: "#135cff" }}>
            Contact the Patient Experience team
          </button>
        </div>
      </div>
    </div>
  );
}

// The Need help card, corrected against the exported CSS Janelle sent for
// 5066:125767. Three things were off: the title is heading-sm, 20px in #133595
// rather than 18px in #030712; the shadow is the shadow/lg token; and the phone
// number is 14px like the sentence around it, not 12px.
// The Health Assessments PX team. Janelle, 3 Sep, correcting 02046 469 390,
// which came across with the scaffold. This is the same number the invitation
// email's footer carries, and the same one the Visio's activate-new-policy page
// uses for DCA's own team. It is NOT an AXA number.
const HA_PX_PHONE = "0330 088 4980";

function ProfileNeedHelpCard() {
  const ws = "'Work Sans', sans-serif";
  return (
    <div
      className="bg-white relative rounded-[16px] w-full"
      style={{
        boxShadow: "0px 10px 15px -3px rgba(15,55,190,0.05), 0px 4px 6px -4px rgba(15,55,190,0.05)",
        border: "1px solid #D7E9FF",
        fontFamily: ws,
      }}
    >
      <div className="flex flex-col gap-[4px] px-[24px] py-[24px]">
        <p className="text-[20px] font-semibold leading-[28px]" style={{ color: "#133595" }}>Need help?</p>
        <p className="text-[14px] leading-[20px]" style={{ color: "#4B5563" }}>
          {"If you need any support, our team is here to help. Please contact our dedicated Health Assessments PX team on "}
          <span className="font-semibold underline" style={{ color: "#135CFF" }}>{HA_PX_PHONE}</span>
          {". Lines are open 09:00 – 17:30, Monday to Friday."}
        </p>
      </div>
    </div>
  );
}

// 5066:125788, "image 4" on the frame, 118x60. Exported at 3x so it stays crisp.
// Decorative: the rating it shows is Trustpilot's own chrome, and the sentence
// it would read out adds nothing a patient needs mid sign-up.
function TrustpilotBadge() {
  return (
    <div className="flex justify-center w-full">
      <img src={imgTrustpilot} alt="" aria-hidden className="w-[118px] h-[60px] object-contain" />
    </div>
  );
}

// ─── Footer (Desktop-16) ──────────────────────────────────────────────────────

function FooterInner({ bg, logos, dividerOpacity = 0.4 }: { bg: string; logos: ReactNode; dividerOpacity?: number }) {
  const ws = "'Work Sans', sans-serif";
  return (
    <div className="relative shrink-0 w-full" data-name="Footer" style={{ background: bg }}>
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col items-center px-[24px] py-[24px] w-full">
          <div className="flex flex-col gap-[16px] items-start max-w-[1024px] w-full">
            {/* Logo + tagline */}
            <div className="flex flex-col gap-[16px] items-start w-full">
              {logos}
              <p className="font-semibold text-[20px] leading-[28px] text-white" style={{ fontFamily: ws }}>
                Convenient, doctor-led healthcare designed around you.
              </p>
            </div>
            {/* Separator */}
            <div className="w-full" style={{ height: 1, background: `rgba(215,233,255,${dividerOpacity})` }} />
            {/* Copyright and legal */}
            <div className="flex flex-wrap gap-y-[16px] items-center justify-between w-full">
              <div className="flex flex-1 flex-wrap gap-[16px] items-start min-w-[288px]">
                <span className="font-normal text-[14px] leading-[20px] text-white whitespace-nowrap" style={{ fontFamily: ws }}>
                  ©2026 Doctor Care Anywhere Ltd.
                </span>
                <div className="flex gap-[16px] font-semibold text-[14px] leading-[20px] text-white" style={{ fontFamily: ws }}>
                  <span className="cursor-pointer hover:underline">Terms and conditions</span>
                  <span className="cursor-pointer hover:underline">Privacy Policy</span>
                </div>
              </div>
              <div className="h-[24px] w-[97px] shrink-0 relative overflow-hidden">
                <img alt="Care Quality Commission" className="absolute inset-0 w-full h-full object-contain" src={imgCareLogo1} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer({ brand }: { brand: BrandId }) {
  if (brand === "axa") {
    return (
      <FooterInner
        bg="#0c0e45"
        dividerOpacity={0.3}
        logos={
          <div className="flex items-center gap-[24px]">
            <AxaHealthMark height={36} />
            <div className="w-px h-[28px] shrink-0 opacity-20" style={{ background: "white" }} />
            <div className="shrink-0 overflow-hidden" style={{ width: 110, height: 29 }}>
              <div style={{ transform: "scale(0.8)", transformOrigin: "top left" }}>
                <Logo />
              </div>
            </div>
          </div>
        }
      />
    );
  }
  return <FooterInner bg="#133595" logos={<Logo />} />;
}

// ─── Main shell – exact Figma two-column card ─────────────────────────────────

export default function App() {
  const [brand, setBrand] = useState<BrandId>("dca");
  const BRAND_THEMES: Record<BrandId, BrandTheme> = { dca: BRAND_DCA, axa: BRAND_AXA };
  // Which journey the typed code put us in. Drives the brand above, and whether
  // Create account is matched against an AXA policy record.
  const [journey, setJourney] = useState<JourneyId>("dca");
  // "duplicate" was missing here after the axa-duplicate state was added, so
  // the union no longer described what the picker actually stores.
  const [activeBanner, setActiveBanner] = useState<"creation-failed" | "duplicate" | undefined>(undefined);
  /** Opens Step 1 straight on "Update your personal details" (2097:99730). */
  const [activeUnvalidated, setActiveUnvalidated] = useState(false);
  /** That screen mid re-check, so the failing half of the loop is reviewable. */
  const [activeValidating, setActiveValidating] = useState(false);
  /** "Details updated" on the landing (2097:99790). */
  const [detailsUpdated, setDetailsUpdated] = useState(false);
  // Chrome and co-logo are separate decisions.
  //
  // The AXA HP and LC frames keep DCA chrome, header and footer, and carry AXA
  // only in the account-plan band (1946:150212, 2016:100544, and Janelle's
  // 25 Aug screenshot of the post-update landing). So a detected AXA journey
  // sets the BAND, not the whole theme. The header toggle still switches chrome
  // for anyone who wants to see the customer-branded route.
  const brandTheme: BrandTheme = {
    ...BRAND_THEMES[brand],
    accountPlanBrand: JOURNEYS[journey].brand === "axa" ? "axa" : BRAND_THEMES[brand].accountPlanBrand,
  };
  const [path, setPath] = useState<"choose" | "code" | "sso">("code");
  const [ssoStep, setSsoStep] = useState(0);
  const [step, setStep] = useState(0);
  // "email" is the invitation, the first thing a patient sees. Janelle, 3 Sep:
  // "the email should be the first screen inside the prototype".
  const [phase, setPhase] = useState<"email" | "activate" | "profile" | "landing" | "questionnaire" | "submitted">("email");
  const [profileDone, setProfileDone] = useState(false);
  const [planNotice, setPlanNotice] = useState<keyof typeof PLAN_NOTICES | undefined>(undefined);
  const [profileStep, setProfileStep] = useState(0);
  const [showExit, setShowExit] = useState(false);
  const [activeErrorState, setActiveErrorState] = useState<string | null>(null);
  // Which code-recognised path is showing, and the date it produced. The date
  // then rides into Create account, which drops its own field and shows a
  // second pill in the band instead.
  const [activeCodeVerified, setActiveCodeVerified] = useState<false | "crm" | "no-crm">(false);
  const [confirmedDob, setConfirmedDob] = useState<string | undefined>(undefined);
  const [enteredCode, setEnteredCode] = useState<string | undefined>(undefined);
  const [activePaymentState, setActivePaymentState] = useState<keyof typeof DEMO_PAYMENT | undefined>(undefined);
  // The Lead form (1946:150009) drops the name fields: date of birth, email,
  // password only. Off by default; the Voucher journey asks for names.
  const [askNames, setAskNames] = useState(true);
  const [activeCaptchaStatus, setActiveCaptchaStatus] = useState<CaptchaStatus | undefined>(undefined);
  const [activeCaptchaMode, setActiveCaptchaMode] = useState<CaptchaMode>("pass");
  const [useRealWidget, setUseRealWidget] = useState(false);
  // A DEMO_CREATE_ACCOUNT key ("missing", "invalidDob", "emailRegistered"...),
  // never a CreateAccountErrors field name. The old annotation said the latter
  // and every call site cast to it, which type-checked and meant nothing.
  const [activeCreateError, setActiveCreateError] = useState<keyof typeof DEMO_CREATE_ACCOUNT | undefined>(undefined);
  const [activePersonalState, setActivePersonalState] = useState<keyof typeof DEMO_PERSONAL_DETAILS | undefined>(undefined);
  const [activeContactState, setActiveContactState] = useState<keyof typeof DEMO_CONTACT_INFO | undefined>(undefined);
  const [activeOtpStage, setActiveOtpStage] = useState<"code" | "code-error" | "code-failed" | undefined>(undefined);
  const [activeGpState, setActiveGpState] = useState<keyof typeof DEMO_GP_DETAILS | undefined>(undefined);
  const [activeEmergencyState, setActiveEmergencyState] = useState<keyof typeof DEMO_EMERGENCY_CONTACT | undefined>(undefined);
  const [activeCodeError, setActiveCodeError] = useState<CodeErrorId | undefined>(undefined);
  const rhsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rhsRef.current) rhsRef.current.scrollTop = 0;
  }, [step, profileStep, phase, path, ssoStep]);

  function startProfile() {
    setPhase("profile");
    setProfileStep(0);
  }

  function renderForm() {
    // ── SSO front door ──────────────────────────────────────────────────────
    if (path === "choose") {
      return (
        <SsoFrontDoor
          onSso={() => { setPath("sso"); setSsoStep(0); }}
          onCode={() => { setPath("code"); setStep(0); }}
        />
      );
    }

    // ── SSO path ────────────────────────────────────────────────────────────
    if (path === "sso") {
      switch (ssoStep) {
        case 0: return <SsoWorkSignIn onNext={() => setSsoStep(1)} />;
        case 1: return <SsoCoverFound onNext={() => setSsoStep(2)} />;
        case 2: return (
          <SsoExistingAccount
            onEmailLink={() => setSsoStep(4)}
            onNoAccess={() => setSsoStep(3)}
            onNotMe={() => setSsoStep(5)}
          />
        );
        case 3: return (
          <SsoReclaimLadder
            onPhone={() => setSsoStep(4)}
            onVerify={() => setSsoStep(4)}
            onContact={() => {}}
          />
        );
        case 4: return <SsoPolicyAdded onDone={() => { setPath("choose"); setSsoStep(0); }} />;
        case 5: return (
          <SsoConfirmDetails
            onNext={() => { setPath("code"); setPhase("activate"); setStep(4); }}
          />
        );
        default: return null;
      }
    }

    // ── Code / profile path (existing) ──────────────────────────────────────
    if (phase === "profile") {
      if (activeContactState || activeOtpStage) {
        return (
          <ProfileStep_ContactInfo
            key={`${activeContactState}|${activeOtpStage ?? "none"}`}
            onNext={() => { setProfileStep(1); setActiveContactState(undefined); setActiveOtpStage(undefined); }}
            theme={brandTheme}
            initialState={activeContactState}
            initialStage={activeOtpStage}
          />
        );
      }
      if (profileStep >= 3 || activeEmergencyState) {
        return (
          <ProfileStep_EmergencyContact
            key={activeEmergencyState ?? "none"}
            onFinish={() => {
              setActiveEmergencyState(undefined);
              setProfileDone(true);
              setPhase("landing");
            }}
            onBack={() => { setProfileStep(2); setActiveEmergencyState(undefined); }}
            theme={brandTheme}
            initialState={activeEmergencyState}
          />
        );
      }
      if (profileStep >= 2 || activeGpState) {
        return (
          <ProfileStep_GpDetails
            key={activeGpState ?? "none"}
            onNext={() => { setProfileStep(3); setActiveGpState(undefined); }}
            onBack={() => { setProfileStep(1); setActiveGpState(undefined); }}
            theme={brandTheme}
            initialState={activeGpState}
          />
        );
      }
      if (profileStep >= 1 || activePersonalState) {
        return (
          <ProfileStep_PersonalDetails
            key={activePersonalState ?? "none"}
            onNext={() => { setProfileStep(2); setActivePersonalState(undefined); }}
            onBack={() => { setProfileStep(0); setActivePersonalState(undefined); }}
            theme={brandTheme}
            initialState={activePersonalState}
          />
        );
      }
      return (
        <ProfileStep_ContactInfo
          key={`${activeContactState ?? "none"}|${activeOtpStage ?? "none"}`}
          onNext={() => { setProfileStep(1); setActiveContactState(undefined); setActiveOtpStage(undefined); }}
          theme={brandTheme}
          initialState={activeContactState}
          initialStage={activeOtpStage}
        />
      );
    }
    switch (step) {
      // Keyed on the demo selection so picking a state resets Step0 rather than
      // leaving a previous banner on screen
      case 0: return <Step0 key={`${activeCaptchaMode}|${activeCaptchaStatus ?? "none"}|${activeCodeError ?? "none"}|${useRealWidget}`} onCodeRecognised={(code) => { const j = journeyForCode(code); if (j.id !== "dca") setJourney(j.id); }} onValidate={(dob, code) => { setConfirmedDob(dob); setEnteredCode(code); if (code) setJourney(journeyForCode(code).id); setStep(1); setActiveCaptchaStatus(undefined); setActiveCodeError(undefined); }} theme={brandTheme} initialCaptchaStatus={activeCaptchaStatus} initialCodeError={activeCodeError} captchaMode={activeCaptchaMode} useRealWidget={useRealWidget} />;
      case 1: return <Step1 key={`${activeCreateError ?? "none"}|${confirmedDob ?? "ask"}|${askNames}|${enteredCode ?? "d"}|${journey}|${activeBanner ?? "none"}|${activeUnvalidated}|${activeValidating}`} onNext={() => { setActiveCreateError(undefined); setProfileDone(false); startProfile(); }} theme={brandTheme} initialError={activeCreateError} confirmedDob={confirmedDob} askNames={askNames} code={enteredCode ?? "ABC-12345"} policyPlan={JOURNEYS[journey].validatesAgainstPolicy ? (journey === "axa-hp" ? "hp" : "lc") : undefined} initialBanner={activeBanner} initialUnvalidated={activeUnvalidated} initialValidating={activeValidating} />;
      case 2: return (
        <PaymentScreen
          key={activePaymentState ?? "none"}
          onPaid={() => { setActivePaymentState(undefined); setProfileDone(false); setPlanNotice(undefined); setPhase("landing"); }}
          initialState={activePaymentState}
        />
      );
      case 4: return <Step4 onRestart={() => { setStep(0); setPhase("activate"); setPath("choose"); }} onStartProfile={() => { setProfileDone(false); setPlanNotice(undefined); setPhase("landing"); }} onStartVerification={() => {}} />;
      default: return null;
    }
  }

  const isProfile = phase === "profile" && path === "code";
  // The first screen, and the only one without the Need help card below it.
  const isLanding = phase === "activate" && step === 0;
  const isSsoOrChoose = path === "sso" || path === "choose";

  // THE EMAIL IS ITS OWN SCREEN, outside the app chrome. It is an email: a
  // header, a footer and a carousel panel around it would be wrong. Start your
  // questionnaire drops the patient on the landing, which is where the real
  // link goes.
  if (phase === "email") {
    return <InvitationEmail onStart={() => { setPhase("activate"); setStep(0); }} />;
  }

  return (
    <div
      className="bg-white content-stretch flex flex-col items-start relative min-h-screen"
      data-name="Desktop"
    >
      {/* Page background gradient */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(5.68397deg, ${brandTheme.pageGradientMid} 0%, rgb(255, 255, 255) 50%, ${brandTheme.pageGradientMid} 100%)`,
          zIndex: 0,
        }}
      />

      {/* Sticky header */}
      <div className="relative z-40 w-full">
        <Header brand={brand} onExit={() => setShowExit(true)} />
      </div>

      {/* Page content */}
      <div className="relative z-10 flex-1 w-full flex flex-col items-center">
        <div className="content-stretch flex flex-col items-center px-0 sm:px-[24px] py-0 sm:py-[32px] relative w-full">
          {/* Max width wrapper */}
          <div className="content-stretch flex flex-col isolate items-center gap-[24px] max-w-[1024px] relative shrink-0 w-full">

            {/* NO STEPPER ABOVE THE CARD. activationUI drew a three-segment
                "Activate your invite / Create your account / Set up your
                account" strip here. Health assessments has no invite step and
                no such strip: of the 48 frames in 5066:125326, the only
                progress element is Progress bar/Linear ("Step 1 of 4") and it
                appears on the four onboarding columns only, never on the
                landing or create account. Janelle, 2 Sep: remove it. */}

            {phase === "questionnaire" ? (
              <QuestionnaireScreen onSubmitted={() => setPhase("submitted")} />
            ) : phase === "submitted" ? (
              /*
               * NO DESIGN FOR THIS ONE YET. The pilot deck's step 13 is a green
               * "Your health questionnaire has been successfully submitted."
               * banner on FHM, which is the only artefact for it, so that is
               * the sentence. Flagged rather than invented further: when a
               * frame exists, this is replaced, not extended.
               */
              <div className="flex flex-col gap-[16px] w-full max-w-[672px]">
                <div
                  className="flex items-start gap-[8px] w-full rounded-[8px] px-[16px] py-[12px]"
                  style={{ background: "#ecfdf5", border: "1px solid #166534" }}
                  role="status"
                >
                  <CheckCheck size={20} color="#166534" strokeWidth={1.67} className="shrink-0" />
                  <p className="text-[14px] leading-[20px]" style={{ color: "#166534" }}>
                    Your health questionnaire has been successfully submitted.
                  </p>
                </div>
                <ProfileComplete theme={brandTheme} onContinue={() => setPhase("questionnaire")} />
              </div>
            ) : phase === "landing" ? (
              <ProfileComplete
                theme={brandTheme}
                onContinue={() => setPhase("questionnaire")}
              />
            ) : (
            <>
            {/* Main container card */}
            <div
              className="relative shrink-0 w-full z-[1] md:bg-white md:rounded-[32px]"
              data-name="Main container"
              style={{ minHeight: 500 }}
            >
              <div
                className="content-stretch flex flex-col md:flex-row items-stretch min-h-[inherit] relative w-full md:overflow-clip md:rounded-[inherit]"
                style={{ minHeight: 500 }}
              >
                {/* LHS — carousel during activation, static photo during profile setup */}
                {<LhsPanel theme={brandTheme} />}

                {/* RHS */}
                <div
                  className="flex-[1_0_0] min-w-0 relative self-stretch flex flex-col mx-[24px] -mt-[24px] rounded-[32px] bg-white shadow-[0px_10px_15px_-3px_rgba(15,55,190,0.05),0px_4px_6px_-4px_rgba(15,55,190,0.05)] md:mx-0 md:mt-0 md:rounded-none md:bg-transparent md:shadow-none"
                  style={{ border: "1px solid #d7e9ff" }}
                  data-name="RHS"
                >
                  {/* Scrollable form area */}
                  <div
                    ref={rhsRef}
                    className="flex-1 overflow-y-auto"
                  >
                    {renderForm()}
                  </div>
                </div>
              </div>

              {/* Card border overlay */}
              <div
                aria-hidden
                className="hidden md:block absolute inset-[-1px] pointer-events-none rounded-[33px]"
                style={{
                  border: `1px solid ${brandTheme.cardBorderColor}`,
                  boxShadow: "0px 10px 15px -3px rgba(15,55,190,0.05), 0px 4px 6px -4px rgba(15,55,190,0.05)",
                }}
              />
            </div>

            {/* Everything from create account onwards carries these two.
                Janelle, 3 Sep: "landing page is correct, no trustpilot, but
                once they click create an account, then we see the need help
                section and the trust pilot at the bottom". */}
            {!isLanding && (
              <>
                <ProfileNeedHelpCard />
                <TrustpilotBadge />
              </>
            )}
            </>
            )}

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 w-full">
        <Footer brand={brand} />
      </div>

      {/* View states panel */}
      {showExit && (
        <ExitConfirmModal
          primaryColor={brandTheme.primaryColor}
          onCancel={() => setShowExit(false)}
          onExit={() => {
            setShowExit(false);
            setPath("code");
            setPhase("activate");
            setStep(0);
            setSsoStep(0);
          }}
        />
      )}

      {/* DoB confirmation dialog (triggered from picker) */}
      {activeCodeVerified && (
        <CodeVerifiedDialog
          onContinue={(dob) => {
            setConfirmedDob(dob);
            setActiveCodeVerified(false);
            setPhase("activate");
            setStep(1);
          }}
          brand={brandTheme.accountPlanBrand}
          crmHasDob={activeCodeVerified === "crm"}
        />
      )}

    </div>
  );
}
