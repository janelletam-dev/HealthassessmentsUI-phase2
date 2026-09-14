// A link that says where it goes before you press it.
//
// NO FRAME. Janelle, 14 Sep: "expose it and have the mailto option, like on
// other apps when you hover, a piece of hyperlink small toastie appears so
// they see where it sends".
//
// The browser already does this in the status bar, but only on desktop, only
// for real links, and it is easy to miss. This draws the destination in a small
// dark bubble above the link, on hover AND on keyboard focus, so it is not a
// mouse-only affordance. The bubble is decorative for a screen reader, which
// gets the same information from aria-describedby.
//
// Touch devices have no hover, so the bubble never appears there; the address
// is still readable on the page, which is why it is exposed rather than hidden
// behind "email us".

import { useId, useState } from "react";

const WS = "'Work Sans', sans-serif";

export function ContactLink({ href, hint, className, style, children }: {
  /** mailto:, tel: or a URL. */
  href: string;
  /** What the bubble says. The destination, in the patient's words. */
  hint: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className="relative inline-flex">
      <a
        href={href}
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className={className}
        style={style}
      >
        {children}
      </a>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute left-1/2 bottom-full z-[60] mb-[8px] -translate-x-1/2 whitespace-nowrap rounded-[6px] px-[10px] py-[6px] text-[12px] font-medium leading-[16px] text-white pointer-events-none"
          style={{ background: "#111827", fontFamily: WS, boxShadow: "0 4px 12px rgba(3,7,18,0.25)" }}
        >
          {hint}
          {/* The little pointer, a rotated square tucked under the bubble. */}
          <span
            aria-hidden
            className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 rotate-45"
            style={{ width: 8, height: 8, background: "#111827" }}
          />
        </span>
      )}
    </span>
  );
}
