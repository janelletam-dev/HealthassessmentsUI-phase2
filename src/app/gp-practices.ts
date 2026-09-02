// Real London and Cambridge GP practices, pulled from the NHS Organisation Data Service
// directory on 24 Aug 2026 (PrimaryRoleId RO177, Status Active):
//   https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations
//
// Demo data for the practice lookup. ODS stores names in upper case, so the
// casing here is normalised by hand; the addresses are as ODS holds them.

export type GpPractice = {
  name: string;
  lines: string[];
  postcode: string;
};

export const GP_PRACTICES: GpPractice[] = [
  { name: "Ridgmount Practice", lines: ["8 Ridgmount Street", "London"], postcode: "WC1E 7AA" },
  { name: "Gower Street Practice", lines: ["20 Gower Street", "London"], postcode: "WC1E 6DP" },
  { name: "The Bloomsbury Surgery", lines: ["1 Handel Street", "London"], postcode: "WC1N 1PD" },
  { name: "Holborn Medical Centre", lines: ["64-66 Lambs Conduit Street", "London"], postcode: "WC1N 3NA" },
  { name: "Brunswick Medical Centre", lines: ["39 Brunswick Centre", "London"], postcode: "WC1N 1AF" },
  { name: "Gray's Inn Medical Group", lines: ["77 Gray's Inn Road", "London"], postcode: "WC1X 8TS" },
  { name: "North End Medical Centre", lines: ["160 North End Road", "West Kensington", "London"], postcode: "W14 9PR" },
  { name: "West Kensington GP Surgery", lines: ["Milson Road Health Centre", "1-13 Milson Road", "London"], postcode: "W14 0LJ" },
  { name: "The Westway Surgery", lines: ["13 Westway", "Shepherds Bush", "London"], postcode: "W12 0PT" },
  { name: "Ashchurch Surgery", lines: ["134 Askew Road", "Shepherds Bush", "London"], postcode: "W12 9BP" },
  { name: "The New Surgery", lines: ["143A Uxbridge Road", "Shepherds Bush", "London"], postcode: "W12 9RD" },
  { name: "Shepherds Bush Medical Centre", lines: ["336 Uxbridge Road", "Shepherds Bush", "London"], postcode: "W12 7LS" },
  { name: "The Bush Doctors", lines: ["16-17 West 12 Shopping Centre", "Shepherds Bush Green", "London"], postcode: "W12 8PP" },
  { name: "Northfields Surgery", lines: ["61 Northfield Avenue", "Ealing", "London"], postcode: "W13 9QP" },
  { name: "Gordon House Surgery", lines: ["78 Mattock Lane", "West Ealing", "London"], postcode: "W13 9NZ" },
  { name: "Grosvenor House Surgery", lines: ["147 Broadway", "West Ealing", "London"], postcode: "W13 9BE" },
  { name: "The Avenue Surgery", lines: ["102 The Avenue", "West Ealing", "London"], postcode: "W13 8LA" },

  { name: "Fitzrovia Medical Centre", lines: ["21 Fitzroy Square", "London"], postcode: "W1T 6EU" },
  { name: "Crawford Street Surgery", lines: ["27 Crawford Street", "London"], postcode: "W1H 2HJ" },
  { name: "Soho Square General Practice", lines: ["1 Frith Street", "Soho", "London"], postcode: "W1D 3HZ" },
  { name: "Great Chapel Street Medical Centre", lines: ["13 Great Chapel Street", "Soho", "London"], postcode: "W1D 3HZ" },
  { name: "Mayfair Medical Centre", lines: ["8 Shepherd Street", "Mayfair", "London"], postcode: "W1K 5LS" },

  { name: "York Street Medical Practice", lines: ["146-148 York Street", "Cambridge"], postcode: "CB1 2PY" },
  { name: "Petersfield Medical Practice", lines: ["25 Mill Road", "Cambridge"], postcode: "CB1 2AB" },
  { name: "Mill Road Surgery", lines: ["279-281 Mill Road", "Cambridge"], postcode: "CB1 3DG" },
  { name: "Cornford House Surgery", lines: ["364 Cherry Hinton Road", "Cambridge"], postcode: "CB1 8BA" },
  { name: "Queen Edith Medical Practice", lines: ["Queen Edith Medical Centre", "59 Queen Ediths Way", "Cambridge"], postcode: "CB1 8PJ" },
  { name: "Cherry Hinton Medical Centre", lines: ["34 Fishers Lane", "Cherry Hinton", "Cambridge"], postcode: "CB1 9HR" },
];

/** One-line form, used as the value and the label in the picker. */
export function practiceLabel(p: GpPractice): string {
  return [p.name, ...p.lines, p.postcode].join(", ");
}

export function findPractice(label: string): GpPractice | undefined {
  return GP_PRACTICES.find((p) => practiceLabel(p) === label);
}


// ─── Finding a practice near a postcode ──────────────────────────────────────
//
// A UK postcode is outward + inward: "CB1 9LF" is outward CB1, sector CB1 9.
// Ranking on how much of it matches gets you "no surgery at CB1 9LF, but Cherry
// Hinton Medical Centre at CB1 9HR is the closest" without shipping coordinates
// or calling a geocoder from the client.
//
// The district tier matters in London specifically. W1W and W1T are both the W1
// district and a few streets apart; W1W and W12 share only the W area and are
// five miles apart. Without that tier a W1W search offers Shepherds Bush before
// Fitzrovia, which is worse than useless.
//
// ponytail: postcode proximity, not real distance. Two sectors can be adjacent
// on the map and unrelated in the code (CB1 9 and CB5 8 are neighbours). Swap
// in lat/long from the ODS GeoLoc block and a haversine sort if the ordering
// ever has to be defensible rather than plausible.

/** Uppercase, strip spaces: "cb1 9lf" becomes "CB19LF". */
function canonical(postcode: string): string {
  return postcode.toUpperCase().replace(/\s+/g, "");
}

/** The outward code, "CB1" from "CB1 9LF". Inward is always the last three. */
function outward(postcode: string): string {
  const c = canonical(postcode);
  return c.length > 3 ? c.slice(0, -3) : c;
}

/** The sector, "CB19" from "CB1 9LF": outward plus the first inward digit. */
function sector(postcode: string): string {
  const c = canonical(postcode);
  return c.length > 3 ? c.slice(0, -2) : c;
}

/**
 * The district, "W1" from "W1W 8QB" and "CB1" from "CB1 9LF": the outward code
 * with any trailing sub-district letter dropped. Outward codes that are all
 * digits after the letters ("W12") are already districts.
 */
function district(postcode: string): string {
  const out = outward(postcode);
  const trimmed = out.replace(/[A-Z]+$/, "");
  return /\d/.test(trimmed) ? trimmed : out;
}

/** The area, the leading letters: "CB" from "CB1 9LF". */
function area(postcode: string): string {
  return outward(postcode).replace(/[0-9].*$/, "");
}

/** 0 postcode, 1 sector, 2 outward, 3 district, 4 area, 5 elsewhere. */
function proximity(practice: GpPractice, postcode: string): number {
  if (canonical(practice.postcode) === canonical(postcode)) return 0;
  if (sector(practice.postcode) === sector(postcode)) return 1;
  if (outward(practice.postcode) === outward(postcode)) return 2;
  if (district(practice.postcode) === district(postcode)) return 3;
  if (area(practice.postcode) === area(postcode)) return 4;
  return 5;
}

export type PracticeLookup = {
  /** Nearest first. Empty when nothing is even in the same area. */
  practices: GpPractice[];
  /** True when nothing sits at the postcode itself, so these are near, not at. */
  approximate: boolean;
};

/**
 * Practices at or near a postcode, nearest first. Anything outside the postcode
 * area is dropped rather than padded: offering a London surgery to someone in
 * Cambridge is worse than offering nothing.
 */
export function practicesNear(postcode: string, limit = 8): PracticeLookup {
  const ranked = GP_PRACTICES
    .map((practice) => ({ practice, rank: proximity(practice, postcode) }))
    .filter((entry) => entry.rank < 5)
    .sort((a, b) => a.rank - b.rank || a.practice.name.localeCompare(b.practice.name));

  return {
    practices: ranked.slice(0, limit).map((entry) => entry.practice),
    approximate: ranked.length > 0 && ranked[0].rank > 0,
  };
}

/** Type-ahead over a set of practices: matches name, street or postcode. */
export function filterPractices(practices: GpPractice[], query: string): GpPractice[] {
  const q = query.trim().toLowerCase();
  if (!q) return practices;
  const squashed = q.replace(/\s+/g, "");
  return practices.filter((p) =>
    practiceLabel(p).toLowerCase().includes(q) ||
    canonical(p.postcode).toLowerCase().includes(squashed));
}
