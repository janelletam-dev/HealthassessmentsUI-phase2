// Plays the fast-forward demo in headless Google Chrome over CDP, no dependencies,
// and screenshots every scene into the folder given. Serve the build first
// (python3 -m http.server 5198 --directory dist), then:
//   node scripts/demo-e2e.mjs out/demo [url]
// The last line says whether the demo completed or where it stopped.
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
const OUT = process.argv[2];
const URL = process.argv[3] ?? "http://127.0.0.1:5198/?demo=fastforward";
const PORT = 9337;
mkdirSync(OUT, { recursive: true });
const chrome = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", [
  "--headless=new", `--remote-debugging-port=${PORT}`, `--user-data-dir=${OUT}/profile`,
  "--window-size=1440,900", "--no-first-run", "--no-default-browser-check", "--hide-scrollbars", "about:blank",
], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 40; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); break; } catch { await sleep(250); } }
const page = targets.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const n = ++id; pending.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: URL });
const evalText = async (expr) => (await send("Runtime.evaluate", { expression: expr, returnByValue: true })).result?.result?.value;
const shot = async (name) => { const r = await send("Page.captureScreenshot", { format: "jpeg", quality: 70 }); writeFileSync(`${OUT}/${name}.jpg`, Buffer.from(r.result.data, "base64")); };
const badgeExpr = `(() => { const t = document.body.innerText; const m = t.match(/Fast-forward demo[^\\n]*|Demo stopped[^\\n]*|Demo complete[^\\n]*/); return m ? m[0] : ""; })()`;
const start = Date.now(); let last = ""; let n = 0; const log = [];
while (Date.now() - start < 9 * 60 * 1000) {
  await sleep(1500);
  const badge = (await evalText(badgeExpr)) ?? "";
  if (badge !== last) {
    n++; last = badge; const t = Math.round((Date.now() - start) / 1000);
    log.push(`${t}s  ${badge}`); console.log(`${t}s  ${badge}`);
    await shot(`${String(n).padStart(2, "0")}-${t}s`);
    if (/Demo complete|Demo stopped/.test(badge)) break;
  }
}
// One last look at the final screen, a beat later.
await sleep(2500); await shot("zz-final");
console.log("FINAL:", await evalText(badgeExpr));
console.log("HEAD:", (await evalText("document.body.innerText.replace(/\\s+/g,' ').slice(0,160)")));
writeFileSync(`${OUT}/log.txt`, log.join("\n"));
ws.close(); chrome.kill();
