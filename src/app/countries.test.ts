import { check as assert, report } from "./assertions.ts";
import { COUNTRIES, UNITED_KINGDOM, flagFor, searchCountries, supportsFlagEmoji } from "./countries.ts";

// United Kingdom is pinned first, the rest are alphabetical
assert.equal(COUNTRIES[0].name, "United Kingdom", "UK is pinned first");
assert.equal(COUNTRIES[0].iso, "GB");
const rest = COUNTRIES.slice(1).map((c) => c.name);
assert.deepEqual(rest, [...rest].sort((a, b) => a.localeCompare(b, "en-GB")), "the rest are alphabetical");
assert.ok(!rest.includes("United Kingdom"), "UK appears once only");
assert.ok(COUNTRIES.length >= 60, `at least 60 countries, got ${COUNTRIES.length}`);

// Every country has a plausible ISO 3166-1 alpha-2 code, and they are unique
for (const c of COUNTRIES) {
  assert.match(c.iso, /^[A-Z]{2}$/, `${c.name} has a two-letter code`);
  assert.ok(c.name.trim().length > 0);
}
assert.equal(new Set(COUNTRIES.map((c) => c.iso)).size, COUNTRIES.length, "no duplicate codes");
assert.equal(new Set(COUNTRIES.map((c) => c.name)).size, COUNTRIES.length, "no duplicate names");

// Flags are built from the regional indicator block, so no image assets
assert.equal(flagFor("GB"), "\u{1F1EC}\u{1F1E7}");
assert.equal(flagFor("US"), "\u{1F1FA}\u{1F1F8}");
assert.equal(flagFor("PH"), "\u{1F1F5}\u{1F1ED}");
assert.equal(flagFor("gb"), flagFor("GB"), "case does not matter");
assert.equal([...flagFor("FR")].length, 2, "a flag is two code points");
for (const c of COUNTRIES) {
  assert.equal([...flagFor(c.iso)].length, 2, `${c.name} renders a flag`);
}

// Spot-check a few codes that are easy to get wrong
const iso = (n: string) => COUNTRIES.find((c) => c.name === n)?.iso;
assert.equal(iso("Germany"), "DE");
assert.equal(iso("Spain"), "ES");
assert.equal(iso("Japan"), "JP");
assert.equal(iso("South Korea"), "KR");
assert.equal(iso("Netherlands"), "NL");
assert.equal(iso("Switzerland"), "CH");
assert.equal(iso("Sweden"), "SE");
assert.equal(iso("United Arab Emirates"), "AE");
assert.equal(iso("South Africa"), "ZA");
assert.equal(iso("Czech Republic"), "CZ");

// Search: empty returns everything, in order
assert.deepEqual(searchCountries(""), COUNTRIES);
assert.deepEqual(searchCountries("   "), COUNTRIES);

// Typing narrows it down, so nobody has to scroll the whole list
assert.ok(searchCountries("united").length >= 3, "united matches Kingdom, States and Emirates");
assert.equal(searchCountries("united")[0].name, "United Kingdom", "the pinned entry stays first");
assert.deepEqual(searchCountries("philippines").map((c) => c.name), ["Philippines"]);
assert.equal(searchCountries("ger")[0].name, "Germany");

// Matching on any word, so a second word still finds it
assert.ok(searchCountries("korea").some((c) => c.name === "South Korea"), "korea finds South Korea");
assert.ok(searchCountries("zealand").some((c) => c.name === "New Zealand"));
assert.ok(searchCountries("emirates").some((c) => c.name === "United Arab Emirates"));

// Word-start matches rank above mid-word ones
const ind = searchCountries("ind").map((c) => c.name);
assert.equal(ind[0], "India", "India starts with ind, so it ranks first");
assert.ok(ind.includes("Indonesia"));

// The two searches Janelle called out, pinned so they cannot regress
assert.equal(searchCountries("korea")[0].name, "South Korea", "korea finds South Korea first");
assert.equal(searchCountries("emirates")[0].name, "United Arab Emirates", "emirates finds UAE first");
// "united" keeps the pinned entry first, then the other two alphabetically
assert.deepEqual(
  searchCountries("united").map((c) => c.name),
  ["United Kingdom", "United Arab Emirates", "United States"],
);

// GB is never shown as a code. The name carries it, and where the browser
// cannot draw the flag the glyph is dropped rather than falling back to "GB".
assert.equal(UNITED_KINGDOM.name, "United Kingdom");
assert.ok(!COUNTRIES.some((c) => c.name === c.iso), "no country is labelled by its code");
assert.equal(typeof supportsFlagEmoji(), "boolean");
assert.equal(supportsFlagEmoji(), supportsFlagEmoji(), "the answer is cached, not remeasured");

// Typing the code finds the country, and shows it by name
assert.equal(searchCountries("gb")[0], UNITED_KINGDOM, "gb finds United Kingdom");
assert.equal(searchCountries("GB")[0].name, "United Kingdom", "and names it, never 'GB'");
assert.equal(searchCountries("us")[0].name, "United States");
assert.equal(searchCountries("de")[0].name, "Germany");
// An exact code outranks a name that merely contains those letters
assert.equal(searchCountries("in")[0].name, "India", "IN is India's code, so it leads");
assert.ok(searchCountries("in").some((c) => c.name === "Indonesia"), "name matches still follow");

assert.deepEqual(searchCountries("zzzz"), [], "no matches returns nothing");
assert.equal(searchCountries("UNITED KINGDOM")[0], UNITED_KINGDOM, "search is case-insensitive");

report("countries");
