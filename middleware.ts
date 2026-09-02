// HTTP Basic Auth in front of the whole prototype.
//
// Vercel's own Password Protection is $150/month, which is not a sensible price
// for gating a demo. This is the same thing at the same layer: it runs before
// anything is served, so the password never reaches the bundle and there is no
// client-side check to open devtools and skip.
//
// The password lives in the PROTOTYPE_PASSWORD environment variable, set in the
// Vercel dashboard. It must never be committed.

import { next } from "@vercel/functions";

export const config = {
  // Every path. Assets are gated too: browsers resend Basic credentials to the
  // same origin automatically, so this costs a header, not a second prompt.
  matcher: "/(.*)",
};

/**
 * Compares in time that does not depend on how much of the string matched.
 * Length still leaks, which is fine for a shared demo password.
 */
function equals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let differing = 0;
  for (let i = 0; i < a.length; i++) differing |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return differing === 0;
}

/**
 * The password out of an Authorization header, or null if there isn't one.
 *
 * The username is ignored on purpose: one secret to share is one secret to get
 * wrong. Split on the first colon only, since a password may contain colons.
 */
export function passwordFrom(header: string | null): string | null {
  if (!header) return null;
  const [scheme, encoded] = header.split(" ");
  if (scheme?.toLowerCase() !== "basic" || !encoded) return null;

  let decoded: string;
  try {
    // atob yields one byte per char, so re-decode as UTF-8 rather than trusting
    // it to have handled anything outside ASCII.
    decoded = new TextDecoder().decode(Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0)));
  } catch {
    return null; // malformed base64
  }

  const colon = decoded.indexOf(":");
  return colon === -1 ? null : decoded.slice(colon + 1);
}

export function isAuthorised(header: string | null, expected: string): boolean {
  const supplied = passwordFrom(header);
  return supplied !== null && equals(supplied, expected);
}

/**
 * What sits behind the browser's own password dialog, and what someone sees if
 * they cancel it. Deliberately abstract: blurred bands in the brand colours,
 * not a screenshot of the prototype, since a recognisable render would give
 * away the thing the gate exists to keep back.
 *
 * Self-contained on purpose. Assets are gated too, so nothing external would
 * load here anyway.
 */
const LOCKED_PAGE = `<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Prototype locked</title>
<style>
  :root { color-scheme: light }
  * { box-sizing: border-box }
  body {
    margin: 0; min-height: 100svh; overflow: hidden;
    display: grid; place-items: center; padding: 24px;
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    color: #133595;
    background: linear-gradient(12deg, #edf6ff 0%, #ffffff 50%, #edf6ff 100%);
  }
  /* A page-shaped blur: header band, card, footer band. */
  .haze { position: fixed; inset: 0; filter: blur(64px); opacity: .8; pointer-events: none }
  .haze span { position: absolute; display: block; border-radius: 48px }
  .bar   { left: -5%; width: 110%; height: 12%; top: 0; background: #135cff }
  .card  { left: 14%; width: 72%; top: 26%; height: 42%; background: #ffffff }
  .warm  { left: 18%; width: 22%; top: 52%; height: 8%; background: #ffb306 }
  .foot  { left: -5%; width: 110%; bottom: 0; height: 18%; background: #133595 }
  .panel {
    position: relative; max-width: 420px; width: 100%; padding: 32px;
    background: rgba(255,255,255,.72);
    -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
    border: 1px solid #d7e9ff; border-radius: 32px;
    box-shadow: 0 10px 15px -3px rgba(15,55,190,.08), 0 4px 6px -4px rgba(15,55,190,.08);
    text-align: center;
  }
  h1 { margin: 0 0 8px; font-size: 20px; line-height: 28px; font-weight: 600 }
  p  { margin: 0; font-size: 14px; line-height: 20px; color: #4b5563 }
  p + p { margin-top: 12px }
</style>
<div class="haze" aria-hidden="true">
  <span class="bar"></span><span class="card"></span>
  <span class="warm"></span><span class="foot"></span>
</div>
<main class="panel">
  <h1>This prototype is password protected</h1>
  <p>Enter the password in your browser's sign-in box. Any username works.</p>
  <p>Reload the page if the box has already closed.</p>
</main>
`;

export default function middleware(request: Request) {
  const expected = process.env.PROTOTYPE_PASSWORD;

  // Fail closed. A missing variable means nobody gets in rather than everybody,
  // so forgetting to set it can never quietly publish the prototype.
  if (!expected) {
    return new Response(
      "This prototype is not configured. Set PROTOTYPE_PASSWORD in the Vercel project settings.",
      { status: 503, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }

  if (isAuthorised(request.headers.get("authorization"), expected)) return next();

  return new Response(LOCKED_PAGE, {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="DCA activation prototype. Any username.", charset="UTF-8"',
      "content-type": "text/html; charset=utf-8",
    },
  });
}
