// Records the fast-forward demo to an mp4, for embedding in a slide deck.
// Same headless Chrome over CDP as demo-e2e.mjs, but screencasting every
// repaint instead of screenshotting each scene. Serve the build first
// (python3 -m http.server 5198 --directory dist), then:
//   node scripts/demo-record.mjs <frames dir> out/demo.mp4 [url]
//
// Pacing is the whole point: a presenter rehearses a voiceover against this,
// so the video must run at the demo's true wall-clock speed. Each frame
// carries its own timestamp; the frames are resampled onto a 30fps grid and
// fed to ffmpeg's image2 demuxer, which is exact. The concat demuxer is NOT
// used: it floors any frame shorter than the input frame rate, which stretched
// a 3:45 demo to 4:30.
import { spawn, spawnSync } from "node:child_process";
import { writeFileSync, mkdirSync, rmSync, symlinkSync } from "node:fs";
const FRAMES = process.argv[2];
const OUT = process.argv[3];
const URL = process.argv[4] ?? "http://127.0.0.1:5198/?demo=fastforward";
const PORT = 9338;
const FPS = 30;
rmSync(FRAMES, { recursive: true, force: true });
mkdirSync(`${FRAMES}/seq`, { recursive: true });
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${FRAMES}/profile`,
  // The layout stays 1440x900 CSS; this is what makes the screencast capture
  // it at 2880x1800, so the mp4 is sharp when a slide deck blows it up.
  // setDeviceMetricsOverride alone does not: its deviceScaleFactor changes the
  // page's devicePixelRatio but not the captured surface.
  "--force-device-scale-factor=2", "--window-size=1440,900", "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "about:blank",
], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 40; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); break; } catch { await sleep(250); } }
const page = targets.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
const times = [];
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === "Page.screencastFrame") {
    const n = times.length;
    writeFileSync(`${FRAMES}/f${String(n).padStart(6, "0")}.jpg`, Buffer.from(d.params.data, "base64"));
    times.push(d.params.metadata.timestamp);
    ws.send(JSON.stringify({ id: ++id, method: "Page.screencastFrameAck", params: { sessionId: d.params.sessionId } }));
  }
};
const send = (method, params = {}) => new Promise((r) => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 2, mobile: false });
await send("Page.navigate", { url: URL });
const evalText = async (expr) => (await send("Runtime.evaluate", { expression: expr, returnByValue: true })).result?.result?.value;
await sleep(1200);
// Video only: the badge and the guide chevrons are presenter controls, not
// part of the journey, so they are hidden for the recording and left alone in
// the prototype. opacity, not display:none, because the completion check below
// reads the badge's text out of innerText.
await send("Runtime.evaluate", { expression: `(() => {
  const css = document.createElement("style");
  css.textContent = "#demo-driver-ui > div:first-child, [data-guide-back], [data-guide-next] { opacity: 0 !important; pointer-events: none !important; }";
  document.head.appendChild(css);
})()` });
await send("Page.startScreencast", { format: "jpeg", quality: 85, maxWidth: 2880, maxHeight: 1800, everyNthFrame: 1 });
const badgeExpr = `(() => { const t = document.body.innerText; const m = t.match(/Fast-forward demo[^\\n]*|Demo stopped[^\\n]*|Demo complete[^\\n]*/); return m ? m[0] : ""; })()`;
const start = Date.now(); let last = "";
while (Date.now() - start < 9 * 60 * 1000) {
  await sleep(500);
  const badge = (await evalText(badgeExpr)) ?? "";
  if (badge !== last) { last = badge; console.log(`${Math.round((Date.now() - start) / 1000)}s  ${badge}`); }
  if (/Demo complete|Demo stopped/.test(badge)) break;
}
// A beat on the closing screen before the video ends.
await sleep(2500);
await send("Page.stopScreencast");
ws.close(); chrome.kill();
// Resample onto the 30fps grid: at each tick, whichever frame was on screen.
const span = times[times.length - 1] - times[0];
let j = 0, k = 0;
for (; k < Math.round(span * FPS); k++) {
  const tick = times[0] + k / FPS;
  while (j + 1 < times.length && times[j + 1] <= tick) j += 1;
  symlinkSync(`../f${String(j).padStart(6, "0")}.jpg`, `${FRAMES}/seq/${String(k).padStart(6, "0")}.jpg`);
}
console.log(`FINAL: ${last} · ${times.length} frames · ${span.toFixed(1)}s · ${k} at ${FPS}fps`);
const ff = spawnSync("ffmpeg", ["-y", "-framerate", String(FPS), "-i", `${FRAMES}/seq/%06d.jpg`,
  "-vf", "scale=1920:1200:flags=lanczos", "-c:v", "libx264", "-preset", "slow",
  "-crf", "20", "-pix_fmt", "yuv420p", "-profile:v", "high", "-level", "4.1",
  "-movflags", "+faststart", OUT], { stdio: "inherit" });
process.exit(ff.status ?? 0);
