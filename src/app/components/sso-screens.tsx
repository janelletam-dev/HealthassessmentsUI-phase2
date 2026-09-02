import { useState } from "react";
import { Building2, CheckCircle, ChevronRight, Mail, Phone, Shield } from "lucide-react";

const ws = "'Work Sans', sans-serif";
const blue = "#135cff";
const dark = "#030712";
const grey = "#4b5563";

// ─── Shared primitives ────────────────────────────────────────────────────────

function SsoField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  tag,
  helper,
  readOnly,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  tag?: string;
  helper?: string;
  readOnly?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[6px]">
      <div className="flex items-center gap-[8px] flex-wrap">
        <label className="text-[13px] font-semibold leading-[18px]" style={{ color: "#0f37be", fontFamily: ws }}>
          {label}
        </label>
        {tag && (
          <span
            className="text-[11px] font-semibold px-[8px] py-[2px] rounded-[99px]"
            style={{ background: "rgba(19,92,255,0.08)", color: blue, fontFamily: ws }}
          >
            {tag}
          </span>
        )}
      </div>
      <div
        className="bg-white rounded-[8px] flex items-center px-[14px]"
        style={{
          height: 44,
          border: readOnly ? "1px solid #e5e7eb" : "1px solid #b9daff",
          background: readOnly ? "#f9fafb" : "white",
          boxShadow: "0 1px 2px rgba(15,55,190,0.05)",
        }}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className="flex-1 min-w-0 bg-transparent outline-none text-[14px] leading-[20px]"
          style={{ fontFamily: ws, color: readOnly ? grey : dark }}
        />
      </div>
      {helper && (
        <p className="text-[12px] leading-[17px]" style={{ color: grey, fontFamily: ws }}>
          {helper}
        </p>
      )}
    </div>
  );
}

function BluePillBtn({ children, onClick, fullWidth = true }: { children: React.ReactNode; onClick: () => void; fullWidth?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`${fullWidth ? "w-full" : ""} flex items-center justify-center gap-[8px] rounded-[9999px] py-[12px] px-[20px] text-[14px] font-semibold transition-opacity hover:opacity-90`}
      style={{ background: blue, color: "#edf6ff", boxShadow: "0 4px 3px rgba(15,55,190,0.05)", fontFamily: ws }}
    >
      {children}
    </button>
  );
}

function GhostPillBtn({ children, onClick, fullWidth = true }: { children: React.ReactNode; onClick: () => void; fullWidth?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`${fullWidth ? "w-full" : ""} flex items-center justify-center gap-[8px] rounded-[9999px] py-[12px] px-[20px] text-[14px] font-semibold transition-colors hover:bg-[rgba(19,92,255,0.04)]`}
      style={{ border: "1px solid #d7e9ff", color: dark, fontFamily: ws }}
    >
      {children}
    </button>
  );
}

function TextLink({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-[14px] font-semibold text-center" style={{ color: blue, fontFamily: ws }}>
      {children}
    </button>
  );
}

// ─── Global SSO help bar ──────────────────────────────────────────────────────

export function SsoHelpBar() {
  return (
    <div className="mt-auto pt-[24px]">
      <div className="mx-[32px] mb-[24px] rounded-[10px] px-[16px] py-[12px]" style={{ background: "rgba(19,92,255,0.04)", border: "1px solid rgba(19,92,255,0.12)" }}>
        <p className="text-[12px] leading-[18px]" style={{ color: grey, fontFamily: ws }}>
          <span className="font-semibold" style={{ color: "#0f37be" }}>Something unusual? </span>
          Talk to the Patient Experience team. We'll see where you got to, so you won't have to explain from the start.
        </p>
      </div>
    </div>
  );
}

// ─── 1. Front door ────────────────────────────────────────────────────────────

export function SsoFrontDoor({ onSso, onCode }: { onSso: () => void; onCode: () => void }) {
  return (
    <div className="flex flex-col gap-[32px] p-[32px] h-full">
      {/* Heading */}
      <div className="flex flex-col gap-[8px]">
        <p className="text-[20px] font-semibold leading-[28px]" style={{ color: dark, fontFamily: ws }}>
          Activate your account
        </p>
        <p className="text-[16px] leading-[24px]" style={{ color: grey, fontFamily: ws }}>
          If you've been given access by a partner or via an invite, enter your activation code below.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-[12px]">
        <BluePillBtn onClick={onCode}>
          Enter your activation code
          <ChevronRight size={14} strokeWidth={2} />
        </BluePillBtn>

        <p className="text-[12px] leading-[18px] text-center" style={{ color: grey, fontFamily: ws }}>
          Family members activate with their own invites.
        </p>
      </div>

      {/* Divider + PAYG note */}
      <div className="flex flex-col gap-[16px]">
        <div className="h-px" style={{ background: "#f2f2f2" }} />
        <div className="flex flex-col gap-[4px]">
          <p className="text-[14px] font-semibold leading-[20px]" style={{ color: dark, fontFamily: ws }}>
            Don't have an invite?
          </p>
          <p className="text-[14px] leading-[20px]" style={{ color: grey, fontFamily: ws }}>
            Join today to book appointments in as little as one hour, and pay through flexible one-off payments or subscription options.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── 2. Work sign-in ──────────────────────────────────────────────────────────

export function SsoWorkSignIn({ onNext }: { onNext: () => void }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  function handleOtpChange(i: number, v: string) {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-[24px] p-[32px] flex-1">
        {/* Heading */}
        <div className="flex flex-col gap-[8px]">
          <p className="text-[20px] font-semibold leading-[28px]" style={{ color: dark, fontFamily: ws }}>
            Sign in with your work account
          </p>
          <p className="text-[14px] leading-[20px]" style={{ color: grey, fontFamily: ws }}>
            We'll use your employer's sign-in to confirm your cover.
          </p>
        </div>

        {/* Employer IdP panel */}
        <div className="flex flex-col gap-[16px] rounded-[14px] p-[20px]" style={{ background: "#f8f9fc", border: "1px solid #e4e9f4" }}>

          {/* Identity provider label */}
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center justify-center w-[36px] h-[36px] rounded-[8px]" style={{ background: "#e4e9f4" }}>
              <Building2 size={18} color="#374151" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-[13px] font-semibold leading-[18px]" style={{ color: "#374151", fontFamily: ws }}>Your employer's sign-in</p>
              <p className="text-[11px] leading-[16px]" style={{ color: "#6b7280", fontFamily: ws }}>Acme Corp · SSO</p>
            </div>
          </div>

          <div className="h-px" style={{ background: "#e4e9f4" }} />

          {/* Work email */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-semibold" style={{ color: "#6b7280", fontFamily: ws }}>Work email</label>
            <div className="bg-white rounded-[8px] flex items-center px-[12px] gap-[8px]" style={{ height: 40, border: "1px solid #d1d5db" }}>
              <Mail size={14} color="#9ca3af" strokeWidth={1.8} />
              <span className="text-[14px]" style={{ color: "#6b7280", fontFamily: ws }}>j.smith@acmecorp.com</span>
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-[6px]">
            <label className="text-[12px] font-semibold" style={{ color: "#6b7280", fontFamily: ws }}>Password</label>
            <div className="bg-white rounded-[8px] flex items-center px-[12px] gap-[8px]" style={{ height: 40, border: "1px solid #d1d5db" }}>
              <span className="text-[18px] tracking-[6px]" style={{ color: "#374151", letterSpacing: "0.3em" }}>••••••••</span>
            </div>
          </div>

          <div className="h-px" style={{ background: "#e4e9f4" }} />

          {/* 2FA */}
          <div className="flex flex-col gap-[10px]">
            <div className="flex items-center gap-[6px]">
              <Shield size={14} color="#6b7280" strokeWidth={1.8} />
              <p className="text-[12px] font-semibold" style={{ color: "#6b7280", fontFamily: ws }}>Two-step verification</p>
            </div>
            <p className="text-[12px] leading-[17px]" style={{ color: "#9ca3af", fontFamily: ws }}>
              Enter the 6-digit code from your authenticator app.
            </p>
            <div className="flex gap-[8px]">
              {otp.map((v, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={v}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="flex-1 min-w-0 text-center rounded-[8px] outline-none text-[18px] font-semibold"
                  style={{
                    height: 44,
                    border: `1.5px solid ${v ? blue : "#d1d5db"}`,
                    color: dark,
                    fontFamily: ws,
                    background: "white",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <BluePillBtn onClick={onNext}>Verify and continue</BluePillBtn>
      </div>
      <SsoHelpBar />
    </div>
  );
}

// ─── 3. Cover found ───────────────────────────────────────────────────────────

export function SsoCoverFound({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-[24px] p-[32px] flex-1">
        {/* Success badge */}
        <div className="flex flex-col gap-[12px]">
          <div className="flex items-center justify-center w-[48px] h-[48px] rounded-full" style={{ background: "#166534" }}>
            <CheckCircle size={24} color="#f0fdf4" strokeWidth={1.8} />
          </div>
          <div className="flex flex-col gap-[6px]">
            <p className="text-[22px] font-semibold leading-[30px]" style={{ color: "#133595", fontFamily: ws }}>
              We found your cover.
            </p>
            <p className="text-[15px] leading-[22px]" style={{ color: grey, fontFamily: ws }}>
              Your employer's scheme includes this service.
            </p>
          </div>
        </div>

        {/* Success panel */}
        <div className="rounded-[12px] p-[18px] flex flex-col gap-[6px]" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
          <p className="text-[14px] font-semibold leading-[20px]" style={{ color: "#166534", fontFamily: ws }}>
            No activation code needed
          </p>
          <p className="text-[14px] leading-[20px]" style={{ color: "#15803d", fontFamily: ws }}>
            Your work account confirmed your entitlement. You're ready to set up your Doctor Care Anywhere account.
          </p>
        </div>

        <BluePillBtn onClick={onNext}>Set up my account</BluePillBtn>
      </div>
      <SsoHelpBar />
    </div>
  );
}

// ─── 4. Existing account check ────────────────────────────────────────────────

export function SsoExistingAccount({
  onEmailLink,
  onNoAccess,
  onNotMe,
}: {
  onEmailLink: () => void;
  onNoAccess: () => void;
  onNotMe: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-[24px] p-[32px] flex-1">
        {/* Heading */}
        <div className="flex flex-col gap-[8px]">
          <p className="text-[20px] font-semibold leading-[28px]" style={{ color: dark, fontFamily: ws }}>
            You already have an account
          </p>
          <p className="text-[15px] leading-[22px]" style={{ color: grey, fontFamily: ws }}>
            Your details match an account that already exists. You don't need to start again. We can sign you straight back in, with your history and verification intact.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-[10px]">
          <div className="flex flex-col gap-[6px]">
            <BluePillBtn onClick={onEmailLink}>
              <Mail size={15} strokeWidth={2} />
              Email me a sign-in link
            </BluePillBtn>
            <p className="text-[12px] leading-[17px] text-center" style={{ color: grey, fontFamily: ws }}>
              We'll send it to the email you signed up with.
            </p>
          </div>

          <div className="flex flex-col gap-[6px]">
            <GhostPillBtn onClick={onNoAccess}>
              No longer have access to that email?
            </GhostPillBtn>
          </div>
        </div>

        <div className="h-px" style={{ background: "#f2f2f2" }} />

        <TextLink onClick={onNotMe}>This isn't me, continue as new</TextLink>
      </div>
      <SsoHelpBar />
    </div>
  );
}

// ─── 5. Reclaim ladder ────────────────────────────────────────────────────────

export function SsoReclaimLadder({
  onPhone,
  onVerify,
  onContact,
}: {
  onPhone: () => void;
  onVerify: () => void;
  onContact: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-[24px] p-[32px] flex-1">
        {/* Heading */}
        <div className="flex flex-col gap-[8px]">
          <p className="text-[20px] font-semibold leading-[28px]" style={{ color: dark, fontFamily: ws }}>
            Get back into your account
          </p>
          <p className="text-[15px] leading-[22px]" style={{ color: grey, fontFamily: ws }}>
            If you signed up with an old work email, choose another way to prove the account is yours.
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-[10px]">
          <BluePillBtn onClick={onPhone}>
            <Phone size={15} strokeWidth={2} />
            Text a code to my phone ★★★★4567
          </BluePillBtn>

          <div className="flex flex-col gap-[6px]">
            <GhostPillBtn onClick={onVerify}>
              Verify my identity again to reclaim it
            </GhostPillBtn>
            <p className="text-[12px] leading-[17px] text-center" style={{ color: grey, fontFamily: ws }}>
              A quick photo-ID check against the identity already on the account.
            </p>
          </div>
        </div>

        <div className="h-px" style={{ background: "#f2f2f2" }} />

        <TextLink onClick={onContact}>Contact the Patient Experience team</TextLink>
      </div>
      <SsoHelpBar />
    </div>
  );
}

// ─── 6. Policy added (success) ────────────────────────────────────────────────

export function SsoPolicyAdded({ onDone }: { onDone: () => void }) {
  const items = [
    { label: "KEPT", color: "#166534", bg: "#f0fdf4", border: "#bbf7d0", text: "Your history, GP details, and identity verification" },
    { label: "ADDED", color: "#1e40af", bg: "#eff6ff", border: "#bfdbfe", text: "The new policy and your work sign-in" },
    { label: "ENDED", color: "#92400e", bg: "#fffbeb", border: "#fde68a", text: "Your previous employer's cover (stays in your history)" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-[24px] p-[32px] flex-1">
        {/* Success badge */}
        <div className="flex flex-col gap-[12px]">
          <div className="flex items-center justify-center w-[48px] h-[48px] rounded-full" style={{ background: "#166534" }}>
            <CheckCircle size={24} color="#f0fdf4" strokeWidth={1.8} />
          </div>
          <div className="flex flex-col gap-[4px]">
            <p className="text-[22px] font-semibold leading-[30px]" style={{ color: "#133595", fontFamily: ws }}>
              Your new cover has been added.
            </p>
            <p className="text-[14px] leading-[20px]" style={{ color: grey, fontFamily: ws }}>
              Same account, same medical history. Because you verified your identity before, you don't need to do it again.
            </p>
          </div>
        </div>

        {/* Summary list */}
        <div className="flex flex-col gap-[8px]">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-[12px] rounded-[10px] px-[14px] py-[12px]"
              style={{ background: item.bg, border: `1px solid ${item.border}` }}
            >
              <span
                className="text-[10px] font-semibold px-[7px] py-[2px] rounded-[4px] shrink-0 mt-[1px]"
                style={{ background: item.color, color: "white", fontFamily: ws, letterSpacing: "0.05em" }}
              >
                {item.label}
              </span>
              <p className="text-[13px] leading-[18px]" style={{ color: item.color, fontFamily: ws }}>
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <BluePillBtn onClick={onDone}>Take me to booking</BluePillBtn>
      </div>
      <SsoHelpBar />
    </div>
  );
}

// ─── 7. Confirm your details (SSO new-user path) ──────────────────────────────

export function SsoConfirmDetails({ onNext }: { onNext: () => void }) {
  const [firstName] = useState("Jane");
  const [lastName] = useState("Smith");
  const [dob] = useState("15 / 03 / 1990");
  const [personalEmail, setPersonalEmail] = useState("");

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-[24px] p-[32px] flex-1">
        {/* Heading */}
        <div className="flex flex-col gap-[8px]">
          <p className="text-[20px] font-semibold leading-[28px]" style={{ color: dark, fontFamily: ws }}>
            Confirm your details
          </p>
          <p className="text-[14px] leading-[20px]" style={{ color: grey, fontFamily: ws }}>
            Check the details we've pulled from your employer. Add a personal email below.
          </p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-[16px]">
          <div className="flex gap-[12px]">
            <div className="flex-1">
              <SsoField label="First name" value={firstName} tag="From work account" readOnly />
            </div>
            <div className="flex-1">
              <SsoField label="Last name" value={lastName} readOnly />
            </div>
          </div>

          <SsoField
            label="Date of birth"
            value={dob}
            tag="From your employer's scheme"
            helper="Check this is right, it's used to confirm your identity."
            readOnly
          />

          <SsoField
            label="Personal email"
            value={personalEmail}
            onChange={setPersonalEmail}
            type="email"
            placeholder="e.g. jane@gmail.com"
            helper="Any email works, but we recommend a personal one. It becomes another way to sign in, and it keeps your health record reachable if you ever leave your employer."
          />
        </div>

        <BluePillBtn onClick={onNext}>Continue to identity verification</BluePillBtn>
      </div>
      <SsoHelpBar />
    </div>
  );
}
