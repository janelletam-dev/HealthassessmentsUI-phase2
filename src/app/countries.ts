// Country list for the residence and dialling-code pickers.
//
// United Kingdom is pinned first because almost every patient picks it; the
// rest are alphabetical. Flags are rendered from the ISO 3166-1 alpha-2 code
// as regional indicator pairs, so there are no flag image assets to ship.

export type Country = { name: string; iso: string; dial: string };

const REST: Country[] = [
  { name: "Afghanistan", iso: "AF", dial: "+93" }, { name: "Albania", iso: "AL", dial: "+355" },
  { name: "Algeria", iso: "DZ", dial: "+213" }, { name: "Andorra", iso: "AD", dial: "+376" },
  { name: "Angola", iso: "AO", dial: "+244" }, { name: "Argentina", iso: "AR", dial: "+54" },
  { name: "Armenia", iso: "AM", dial: "+374" }, { name: "Australia", iso: "AU", dial: "+61" },
  { name: "Austria", iso: "AT", dial: "+43" }, { name: "Azerbaijan", iso: "AZ", dial: "+994" },
  { name: "Bahamas", iso: "BS", dial: "+1" }, { name: "Bahrain", iso: "BH", dial: "+973" },
  { name: "Bangladesh", iso: "BD", dial: "+880" }, { name: "Barbados", iso: "BB", dial: "+1" },
  { name: "Belarus", iso: "BY", dial: "+375" }, { name: "Belgium", iso: "BE", dial: "+32" },
  { name: "Belize", iso: "BZ", dial: "+501" }, { name: "Bolivia", iso: "BO", dial: "+591" },
  { name: "Bosnia and Herzegovina", iso: "BA", dial: "+387" }, { name: "Botswana", iso: "BW", dial: "+267" },
  { name: "Brazil", iso: "BR", dial: "+55" }, { name: "Brunei", iso: "BN", dial: "+673" },
  { name: "Bulgaria", iso: "BG", dial: "+359" }, { name: "Cambodia", iso: "KH", dial: "+855" },
  { name: "Cameroon", iso: "CM", dial: "+237" }, { name: "Canada", iso: "CA", dial: "+1" },
  { name: "Chile", iso: "CL", dial: "+56" }, { name: "China", iso: "CN", dial: "+86" },
  { name: "Colombia", iso: "CO", dial: "+57" }, { name: "Croatia", iso: "HR", dial: "+385" },
  { name: "Cuba", iso: "CU", dial: "+53" }, { name: "Cyprus", iso: "CY", dial: "+357" },
  { name: "Czech Republic", iso: "CZ", dial: "+420" }, { name: "Denmark", iso: "DK", dial: "+45" },
  { name: "Dominican Republic", iso: "DO", dial: "+1" }, { name: "Ecuador", iso: "EC", dial: "+593" },
  { name: "Egypt", iso: "EG", dial: "+20" }, { name: "Estonia", iso: "EE", dial: "+372" },
  { name: "Ethiopia", iso: "ET", dial: "+251" }, { name: "Finland", iso: "FI", dial: "+358" },
  { name: "France", iso: "FR", dial: "+33" }, { name: "Georgia", iso: "GE", dial: "+995" },
  { name: "Germany", iso: "DE", dial: "+49" }, { name: "Ghana", iso: "GH", dial: "+233" },
  { name: "Greece", iso: "GR", dial: "+30" }, { name: "Guatemala", iso: "GT", dial: "+502" },
  { name: "Hungary", iso: "HU", dial: "+36" }, { name: "Iceland", iso: "IS", dial: "+354" },
  { name: "India", iso: "IN", dial: "+91" }, { name: "Indonesia", iso: "ID", dial: "+62" },
  { name: "Iran", iso: "IR", dial: "+98" }, { name: "Iraq", iso: "IQ", dial: "+964" },
  { name: "Ireland", iso: "IE", dial: "+353" }, { name: "Israel", iso: "IL", dial: "+972" },
  { name: "Italy", iso: "IT", dial: "+39" }, { name: "Jamaica", iso: "JM", dial: "+1" },
  { name: "Japan", iso: "JP", dial: "+81" }, { name: "Jordan", iso: "JO", dial: "+962" },
  { name: "Kazakhstan", iso: "KZ", dial: "+7" }, { name: "Kenya", iso: "KE", dial: "+254" },
  { name: "Kuwait", iso: "KW", dial: "+965" }, { name: "Latvia", iso: "LV", dial: "+371" },
  { name: "Lebanon", iso: "LB", dial: "+961" }, { name: "Libya", iso: "LY", dial: "+218" },
  { name: "Liechtenstein", iso: "LI", dial: "+423" }, { name: "Lithuania", iso: "LT", dial: "+370" },
  { name: "Luxembourg", iso: "LU", dial: "+352" }, { name: "Malaysia", iso: "MY", dial: "+60" },
  { name: "Maldives", iso: "MV", dial: "+960" }, { name: "Malta", iso: "MT", dial: "+356" },
  { name: "Mexico", iso: "MX", dial: "+52" }, { name: "Moldova", iso: "MD", dial: "+373" },
  { name: "Monaco", iso: "MC", dial: "+377" }, { name: "Morocco", iso: "MA", dial: "+212" },
  { name: "Myanmar", iso: "MM", dial: "+95" }, { name: "Nepal", iso: "NP", dial: "+977" },
  { name: "Netherlands", iso: "NL", dial: "+31" }, { name: "New Zealand", iso: "NZ", dial: "+64" },
  { name: "Nigeria", iso: "NG", dial: "+234" }, { name: "Norway", iso: "NO", dial: "+47" },
  { name: "Oman", iso: "OM", dial: "+968" }, { name: "Pakistan", iso: "PK", dial: "+92" },
  { name: "Panama", iso: "PA", dial: "+507" }, { name: "Paraguay", iso: "PY", dial: "+595" },
  { name: "Peru", iso: "PE", dial: "+51" }, { name: "Philippines", iso: "PH", dial: "+63" },
  { name: "Poland", iso: "PL", dial: "+48" }, { name: "Portugal", iso: "PT", dial: "+351" },
  { name: "Qatar", iso: "QA", dial: "+974" }, { name: "Romania", iso: "RO", dial: "+40" },
  { name: "Russia", iso: "RU", dial: "+7" }, { name: "Rwanda", iso: "RW", dial: "+250" },
  { name: "Saudi Arabia", iso: "SA", dial: "+966" }, { name: "Senegal", iso: "SN", dial: "+221" },
  { name: "Serbia", iso: "RS", dial: "+381" }, { name: "Singapore", iso: "SG", dial: "+65" },
  { name: "Slovakia", iso: "SK", dial: "+421" }, { name: "Slovenia", iso: "SI", dial: "+386" },
  { name: "South Africa", iso: "ZA", dial: "+27" }, { name: "South Korea", iso: "KR", dial: "+82" },
  { name: "Spain", iso: "ES", dial: "+34" }, { name: "Sri Lanka", iso: "LK", dial: "+94" },
  { name: "Sweden", iso: "SE", dial: "+46" }, { name: "Switzerland", iso: "CH", dial: "+41" },
  { name: "Taiwan", iso: "TW", dial: "+886" }, { name: "Tanzania", iso: "TZ", dial: "+255" },
  { name: "Thailand", iso: "TH", dial: "+66" }, { name: "Tunisia", iso: "TN", dial: "+216" },
  { name: "Turkey", iso: "TR", dial: "+90" }, { name: "Uganda", iso: "UG", dial: "+256" },
  { name: "Ukraine", iso: "UA", dial: "+380" }, { name: "United Arab Emirates", iso: "AE", dial: "+971" },
  { name: "United States", iso: "US", dial: "+1" }, { name: "Uruguay", iso: "UY", dial: "+598" },
  { name: "Uzbekistan", iso: "UZ", dial: "+998" }, { name: "Venezuela", iso: "VE", dial: "+58" },
  { name: "Vietnam", iso: "VN", dial: "+84" }, { name: "Yemen", iso: "YE", dial: "+967" },
  { name: "Zambia", iso: "ZM", dial: "+260" }, { name: "Zimbabwe", iso: "ZW", dial: "+263" },
].sort((a, b) => a.name.localeCompare(b.name, "en-GB"));

export const UNITED_KINGDOM: Country = { name: "United Kingdom", iso: "GB", dial: "+44" };

/** United Kingdom first, everything else alphabetical. */
export const COUNTRIES: Country[] = [UNITED_KINGDOM, ...REST];

/** "GB" becomes the flag emoji, via the regional indicator block. */
export function flagFor(iso: string): string {
  return iso
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .split("")
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + 0x1f1a5))
    .join("");
}

/**
 * Whether this browser draws regional indicator pairs as a single flag glyph.
 * Chrome on Windows does not, and falls back to drawing the two letters, which
 * would put a bare "GB" next to "United Kingdom". Where that is the case the
 * caller hides the glyph and the country name stands alone.
 *
 * Measured rather than sniffed: a real flag ligature is narrower than the two
 * letters drawn separately.
 */
let flagSupport: boolean | null = null;
export function supportsFlagEmoji(): boolean {
  if (flagSupport !== null) return flagSupport;
  if (typeof document === "undefined") return (flagSupport = true);
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return (flagSupport = true);
  ctx.font = "16px sans-serif";
  const [a, b] = [...flagFor("GB")];
  const pair = ctx.measureText(a + b).width;
  const apart = ctx.measureText(a).width + ctx.measureText(b).width;
  return (flagSupport = pair > 0 && pair < apart);
}

/**
 * Match on any word boundary, so "korea" finds South Korea and "united" finds
 * all three. An exact country code matches too, so someone who thinks "GB"
 * gets United Kingdom rather than nothing. Ranked: code, then word start,
 * then anywhere in the name. The pinned entry keeps its place within a rank.
 */
export function searchCountries(query: string): Country[] {
  const q = query.trim().toLowerCase();
  if (!q) return COUNTRIES;

  const rank = (c: Country): number => {
    if (c.iso.toLowerCase() === q) return 0;
    if (c.name.toLowerCase().split(/\s+/).some((w) => w.startsWith(q))) return 1;
    if (c.name.toLowerCase().includes(q)) return 2;
    return 3;
  };

  return COUNTRIES
    .map((c, i) => ({ c, r: rank(c), i }))
    .filter((x) => x.r < 3)
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .map((x) => x.c);
}
