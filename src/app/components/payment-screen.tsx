import { useState } from "react";
import { enterSubmits } from "../enter-submits";
import { AccountPlan } from "./account-plan";
import { Toast, TOAST_DWELL_MS } from "./toast";
import { CountrySelect } from "./country-select";
import { CircleAlert, LockKeyhole, LoaderCircle } from "lucide-react";
import {
  validatePayment, formatCardNumber, maskExpiry, isDeclined,
  PAYMENT_AMOUNT, PAYMENT_FAILED_TITLE, PAYMENT_FAILED_BODY, DEMO_PAYMENT,
  type PaymentErrors, type PaymentInput,
} from "../payment";

// Built as its own file rather than inside App.tsx, following sso-screens.tsx.
// Tokens are repeated here for the same reason they are there: this surface
// does not import from App.tsx.
const ws = "'Work Sans', sans-serif";
const INK = "#030712";
const LABEL = "#0f37be";
const BORDER = "#b9daff";
const MUTED = "#4b5563";
const BLUE = "#135cff";
const RED = "#991b1b";
const AMBER_INK = "#92400e";

function Field({ label, value, onChange, placeholder, error, inputMode, maxLength }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
  inputMode?: "numeric" | "text";
  maxLength?: number;
}) {
  return (
    <div className="flex flex-col items-start relative w-full">
      <div
        className="absolute flex gap-[4px] items-center left-[12px] px-[4px] top-0 z-[3]"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0) 50%, #ffffff 50%)" }}
      >
        <span className="text-[12px] font-semibold leading-[16px] whitespace-nowrap" style={{ color: error ? RED : LABEL, fontFamily: ws }}>{label}</span>
        <span className="text-[12px] font-semibold leading-[16px]" style={{ color: RED, fontFamily: ws }}>*</span>
      </div>
      <div className="h-[8px] w-full shrink-0" />
      <div className="flex flex-col gap-[8px] items-start w-full">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          maxLength={maxLength}
          // Never carry a cc-* autocomplete token, and switch autofill off, so
          // a browser holding a real saved card cannot offer it here.
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore=""
          className="w-full rounded-[8px] px-[16px] outline-none text-[12px] leading-[16px]"
          style={{
            height: 44, background: "#ffffff",
            border: `1px solid ${error ? RED : BORDER}`,
            boxShadow: "0px 1px 2px rgba(15,55,190,0.05)",
            color: INK, fontFamily: ws,
          }}
        />
        {error && (
          <div className="flex gap-[8px] items-start w-full">
            <CircleAlert size={20} color={RED} strokeWidth={1.67} className="shrink-0" />
            <p className="flex-1 min-w-0 text-[12px] font-semibold leading-[16px]" style={{ color: RED, fontFamily: ws }}>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/** Payment details, per Figma 1946:149652 in the Voucher section. */
export function PaymentScreen({ code = "ABC-12345", onPaid, initialState }: {
  code?: string;
  onPaid: () => void;
  initialState?: keyof typeof DEMO_PAYMENT;
}) {
  const demo = initialState ? DEMO_PAYMENT[initialState] : undefined;
  // Prefilled with the published test card. Nobody should need to type a real
  // one to look at this screen, and an empty form invites exactly that.
  const [form, setForm] = useState<PaymentInput>(demo?.input ?? {
    nameOnCard: "Jane Smith", cardNumber: "4242 4242 4242 4242", expiry: "04/2030",
    cvv: "123", country: "United Kingdom", billingPostcode: "W1W 8QB",
  });
  const [errors, setErrors] = useState<PaymentErrors>(demo?.errors ?? {});
  const [paying, setPaying] = useState(false);
  const [failed, setFailed] = useState(initialState === "declined");
  const [paid, setPaid] = useState(false);

  function set(k: keyof PaymentInput, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
    setFailed(false);
  }

  function pay() {
    const e = validatePayment(form);
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setPaying(true);
    // The decline is a gateway outcome, so it happens after the round trip
    // rather than as a field error.
    window.setTimeout(() => {
      setPaying(false);
      if (isDeclined(form.cardNumber)) return setFailed(true);
      // Same as Create account: the toast promises the next step, so it has to
      // be on screen before the step changes.
      setPaid(true);
      window.setTimeout(onPaid, TOAST_DWELL_MS);
    }, 1100);
  }

  return (
    <div className="flex flex-col gap-[16px] p-[24px] sm:p-[32px]" style={{ fontFamily: ws }} onKeyDown={enterSubmits(pay, paying)}>
      {paid && (
        <Toast
          title="Success"
          body="We&rsquo;ve received your payment, thank you! Taking you to the next step..."
        />
      )}

      <p className="text-[20px] font-semibold leading-[28px]" style={{ color: "#133595" }}>
        Payment details
      </p>

      <AccountPlan brand="dca" code={code} />

      <Field label="Name on card" value={form.nameOnCard} onChange={(v) => set("nameOnCard", v)}
             placeholder="Enter name as it appears on card" error={errors.nameOnCard} />
      <Field label="Card number" value={form.cardNumber} onChange={(v) => set("cardNumber", formatCardNumber(v))}
             placeholder="Card number" error={errors.cardNumber} inputMode="numeric" maxLength={23} />
      <Field label="Expiry date" value={form.expiry} onChange={(v) => set("expiry", maskExpiry(v))}
             placeholder="MM/YYYY" error={errors.expiry} inputMode="numeric" maxLength={7} />
      <Field label="CVV" value={form.cvv} onChange={(v) => set("cvv", v)}
             placeholder="CVV" error={errors.cvv} inputMode="numeric" maxLength={4} />

      <CountrySelect
        label="Country"
        value={form.country}
        onChange={(v) => set("country", v)}
        error={errors.country}
      />

      <Field label="Billing postcode" value={form.billingPostcode} onChange={(v) => set("billingPostcode", v)}
             placeholder="e.g., W1W 8QB" error={errors.billingPostcode} />

      <div className="flex gap-[4px] items-center justify-center w-full">
        <LockKeyhole size={16} color={MUTED} className="shrink-0" />
        <p className="text-[12px] leading-[16px]" style={{ color: MUTED }}>
          Secure payment powered by Revolut
          <span style={{ color: AMBER_INK }}> (simulated)</span>
        </p>
      </div>

      {failed && (
        <div className="flex gap-[8px] items-start w-full rounded-[8px] p-[8px]"
             style={{ background: "#fffbfb", border: `1px solid ${RED}` }} role="alert">
          <CircleAlert size={20} color={RED} strokeWidth={1.67} className="shrink-0" />
          <div className="flex flex-col gap-[4px] flex-1 min-w-0">
            <span className="text-[12px] font-semibold leading-[16px]" style={{ color: RED, minHeight: 20 }}>{PAYMENT_FAILED_TITLE}</span>
            <p className="text-[12px] leading-[16px]" style={{ color: RED }}>{PAYMENT_FAILED_BODY}</p>
          </div>
        </div>
      )}

      <button
        onClick={pay}
        disabled={paying}
        className="w-full flex items-center justify-center gap-[8px] rounded-full px-[16px] py-[12px] text-[12px] font-semibold leading-[16px] mt-[8px]"
        style={{ background: paying ? "#5b8dff" : BLUE, color: "#edf6ff", boxShadow: "0px 4px 3px rgba(15,55,190,0.05), 0px 2px 2px rgba(15,55,190,0.05)" }}
      >
        {paying && <LoaderCircle size={16} color="#edf6ff" strokeWidth={2} className="animate-spin" />}
        {paying ? "Taking payment..." : `Make payment – ${PAYMENT_AMOUNT}`}
      </button>
    </div>
  );
}
