// The country picker, shared by the address step, the mobile country code and
// the card billing country. It lives here rather than in App.tsx because
// payment-screen.tsx needs it and cannot import App.tsx without a cycle.

import { useEffect, useRef, useState } from "react";
import { Search, Check, AlertCircle } from "lucide-react";
import { COUNTRIES, searchCountries, flagFor, supportsFlagEmoji, type Country } from "../countries";

export function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <div
      className="flex gap-[4px] items-center mb-[6px] text-[14px] font-semibold leading-[20px]"
      style={{ fontFamily: "'Work Sans', sans-serif" }}
    >
      <span style={{ color: "#0f37be" }}>{label}</span>
      {required && <span style={{ color: "#991b1b" }}>*</span>}
    </div>
  );
}

// The file draws flags as circular images that fill the disc (1836:310460).
// An emoji flag is a glyph, so object-fit does not apply to it. Oversizing the
// glyph and clipping to the circle gets the same result without shipping ~200
// flag images. Sizes and the cream ring are from the frame.
function FlagAvatar({ iso, size, ring }: { iso: string; size: number; ring?: boolean }) {
  return (
    <span
      className="shrink-0 inline-flex items-center justify-center rounded-full overflow-hidden"
      style={{
        width: size,
        height: size,
        border: ring ? "2px solid #fffdea" : undefined,
        // An emoji flag is a *waving* illustration with transparent margins, so
        // clipping it at its natural size leaves the ragged rounded-rectangle
        // shape rather than a disc. Oversizing pushes the wavy edges outside the
        // circle so only the flat middle shows, which is how circular flag
        // assets are cut.
        //
        // 2x is the best point on a narrow curve, measured at both sizes in the
        // browser: below it the waving edge notches the circle at 24px, above it
        // the Union Jack loses its diagonals and reads as a plain red cross.
        //
        // ponytail: this is the ceiling of using emoji rather than assets. A
        // small circular flag simply cannot be cut from a waving glyph and stay
        // recognisable. Ship real flag images if this needs to be right rather
        // than acceptable.
        fontSize: size * 2,
        lineHeight: 1,
      }}
    >
      {flagFor(iso)}
    </span>
  );
}

export function CountrySelect({
  label = "Country of residence",
  value,
  onChange,
  error,
  withDial = false,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  /**
   * Dialling-code mode: the closed field reads "United Kingdom (+44)", which is
   * what the mobile step stores and validates against. The open list still
   * shows plain country names, per 1836:310456.
   */
  withDial?: boolean;
}) {
  const labelFor = (c: Country) => (withDial ? `${c.name} (${c.dial})` : c.name);
  const [open, setOpen] = useState(false);
  // null means "not typed yet", so the field shows the chosen country on open
  // and the list is unfiltered. Typing takes over both.
  const [query, setQuery] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        // null, not "". The field renders `query ?? value`, so an empty string
        // is a typed-and-cleared query and blanks a field that still holds a
        // country. Clicking away from the picker wiped "United Kingdom" off
        // every country field in the app; choose() and Escape already did this
        // right, this one path did not.
        setQuery(null);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const filtered = searchCountries(query ?? "");
  const selectedIso = COUNTRIES.find((c) => labelFor(c) === value)?.iso;
  const showFlags = supportsFlagEmoji();
  // Which row the arrow keys are on. Reset whenever the query changes, so
  // Enter always takes the top match rather than a stale row.
  const [active, setActive] = useState(0);
  useEffect(() => { setActive(0); }, [query]);
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-row="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function choose(country: Country) {
    onChange(labelFor(country));
    setOpen(false);
    setQuery(null);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, filtered.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); if (filtered[active]) choose(filtered[active]); }
    else if (e.key === "Escape") { setOpen(false); setQuery(null); }
  }

  return (
    // Each field is its own stacking context (isolate, for the notch label), and
    // sibling contexts paint in DOM order, so the open list would sit under the
    // field below it. Lifting the whole control while open is what gets it out.
    <div className="w-full relative" style={{ zIndex: open ? 50 : undefined }} ref={ref}>
      {/* Same notch label as DsField: it sits on the border, so it carries the
          white gradient behind it. The frames draw every field this way, and
          a plain label here made this field the odd one out in the column. */}
      <div className="flex flex-col isolate items-start relative w-full">
        <div
          className="absolute flex gap-[4px] items-center justify-center left-[12px] top-0 px-[4px] whitespace-nowrap z-[3]"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0) 50%, #ffffff 50%)" }}
        >
          <span className="text-[12px] font-semibold leading-[16px]" style={{ color: error ? "#991b1b" : "#0f37be", fontFamily: "'Work Sans', sans-serif" }}>
            {label}
          </span>
          <span className="text-[12px] font-semibold leading-[16px]" style={{ color: "#991b1b", fontFamily: "'Work Sans', sans-serif" }}>*</span>
        </div>
        <div className="h-[8px] w-full z-[2]" />
        <div className="relative w-full z-[1]">
        {/* The field IS the search box, per the design: one input with the flag
            and a magnifier, and a bare list beneath it. There was a second
            "Search countries" row inside the dropdown before, which no frame
            has and which made the same job available in two places. */}
        <div
          className="w-full h-[44px] px-[16px] rounded-[8px] bg-white flex items-center gap-[8px]"
          style={{
            border: `1px solid ${error ? "#991b1b" : "#b9daff"}`,
            boxShadow: "0px 1px 2px 0px rgba(15,55,190,0.05)",
          }}
        >
          {showFlags && selectedIso && <FlagAvatar iso={selectedIso} size={24} />}
          <input
            className="flex-1 min-w-0 text-[14px] leading-[20px] outline-none bg-transparent"
            style={{ fontFamily: "'Work Sans', sans-serif", color: value ? "#030712" : "#4b5563" }}
            placeholder="Select country…"
            value={query ?? value}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            onChange={(e) => { setOpen(true); setQuery(e.target.value); }}
            onKeyDown={onKeyDown}
          />
          <Search size={16} color="#4b5563" className="shrink-0" />
        </div>
        {open && (
          <div
            className="absolute z-50 top-full mt-[4px] w-full rounded-[8px] bg-white shadow-lg overflow-hidden"
            style={{ border: "1px solid #b9daff" }}
          >
            <ul className="max-h-[200px] overflow-y-auto" ref={listRef}>
              {filtered.map((c, i) => {
                const isSelected = labelFor(c) === value;
                return (
                  <li key={c.iso}>
                    <button
                      type="button"
                      data-row={i}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => choose(c)}
                      className="w-full text-left px-[16px] py-[10px] text-[14px] flex items-center gap-[8px]"
                      style={{
                        fontFamily: "'Work Sans', sans-serif",
                        // Selected row is base/accent with accent-foreground, per 1836:310460
                        color: isSelected ? "#481e00" : "#030712",
                        background: isSelected ? "#ffb306" : i === active ? "#edf6ff" : undefined,
                      }}
                    >
                      {showFlags && <FlagAvatar iso={c.iso} size={32} ring={isSelected} />}
                      <span className="flex-1 min-w-0 truncate">{c.name}</span>
                      {isSelected && <Check size={16} color="#481e00" className="shrink-0" />}
                    </button>
                  </li>
                );
              })}
              {filtered.length === 0 && (
                <li
                  className="px-[16px] py-[10px] text-[14px]"
                  style={{ color: "#9ca3af", fontFamily: "'Work Sans', sans-serif" }}
                >
                  No results
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      </div>
      {error && (
        <div className="flex items-center gap-[6px] mt-[6px]">
          <AlertCircle size={14} color="#991b1b" />
          <span className="text-[13px] font-semibold" style={{ color: "#991b1b", fontFamily: "'Work Sans', sans-serif" }}>
            {error}
          </span>
        </div>
      )}
    </div>
  );
}
