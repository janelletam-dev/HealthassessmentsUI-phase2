// Walks the prototype by the right arrow alone, in headless Google Chrome over
// CDP, no dependencies, logging each screen reached and screenshotting every
// new one. Serve the build first, then:
//   node scripts/arrow-walk.mjs out/walk [url]
// It stops at the employer's view, or says STUCK and where.
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
const OUT = process.argv[2]; const URL = process.argv[3] ?? "http://127.0.0.1:5198/?walk=1"; const PORT = 9334;
mkdirSync(OUT, { recursive: true });
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${OUT}/profile`,
  "--window-size=1440,900", "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "about:blank",
], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets; for (let i = 0; i < 40; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); break; } catch { await sleep(250); } }
const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: URL }); await sleep(1500);
const ev = async (expr) => (await send("Runtime.evaluate", { expression: expr, returnByValue: true, awaitPromise: true })).result?.result?.value;
const shot = async (name) => { const r = await send("Page.captureScreenshot", { format: "jpeg", quality: 70 }); writeFileSync(`${OUT}/${name}.jpg`, Buffer.from(r.result.data, "base64")); };
const SIG = `(() => { const t = document.body.innerText.replace(/\\s+/g,' '); const m = t.match(/You’re invited|New here\\? Begin|Create your account|Step \\d of 4|Profile complete|DEMOGRAPHICS|has been submitted|Sign in with your email|What can we help you with|Awaiting clinician review|Ready for approval|Report Ready|YOUR LATEST RESULTS|Live page|YOUR NEXT STEP|Choose a location|Select date and time|Review & confirm|Booking confirmed|MEDICAL HISTORY|successfully submitted|Your appointment is booked|results are ready|Report dispatched 18|Advanced Health Assessment Report|Not for emergencies|Select a health category|Select a health concern|Attach File|Appointment booked|Total participants|Report flags/); const a = document.querySelector('[aria-label="Next"], [aria-label^="Next:"]'); return (m ? m[0] : t.slice(0, 40)) + (a ? '' : '  [no next arrow]'); })()`;
const NEXT = `(() => { const all = [...document.querySelectorAll('button')]; const b = all.find((x) => x.getAttribute('aria-label') === 'Next') ?? all.find((x) => (x.getAttribute('aria-label')||'').startsWith('Next:')); if (!b) return false; b.click(); return b.getAttribute('aria-label'); })()`;
const start = Date.now(); const log = []; let last = ""; let presses = 0; let n = 0; let stuck = 0;
while (presses < 70 && Date.now() - start < 8 * 60 * 1000) {
  const sig = await ev(SIG);
  if (sig !== last) { n++; last = sig; stuck = 0; log.push(`${presses}p ${Math.round((Date.now()-start)/1000)}s  ${sig}`); console.log(log[log.length-1]); await shot(`${String(n).padStart(2,"0")}-${presses}p`); }
  else if (++stuck >= 3) { log.push(`STUCK on: ${sig}`); console.log(log[log.length-1]); await shot(`stuck-${presses}p`); break; }
  if (/Total participants|Report flags/.test(sig)) break;
  const pressed = await ev(NEXT); presses++;
  // Let the arrow's fill settle: text stable for 1.5s, at least 2.5s.
  let prev = await ev("document.body.innerText"); let stableSince = Date.now(); const t0 = Date.now();
  while (Date.now() - t0 < 9000) { await sleep(300); const now = await ev("document.body.innerText"); if (now !== prev) { prev = now; stableSince = Date.now(); } if (Date.now() - t0 > 2500 && Date.now() - stableSince > 1500) break; }
}
await shot("zz-final"); console.log("END after", presses, "presses:", await ev(SIG));
writeFileSync(`${OUT}/log.txt`, log.join("\n")); ws.close(); chrome.kill();
