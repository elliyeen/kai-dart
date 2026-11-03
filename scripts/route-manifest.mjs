// Source-derived route manifest + link/asset crawler for a static export.
// Usage: node scripts/route-manifest.mjs <baseUrl> <basePath> [outFile-without-ext]
//   e.g. SITE_BASE=/dart node scripts/serve-out.mjs &  node scripts/route-manifest.mjs http://localhost:4173 /dart docs/route-manifest-cloudflare-dart
// Enumerates every .html in ./out, fetches each under <basePath>, and verifies every same-origin
// href/src/srcset target (links, _next assets, images) returns 200. Exits 1 on any failure.
import fs from "node:fs";
import path from "node:path";

const [origin = "http://localhost:4173", basePath = "", outBase = "docs/route-manifest"] = process.argv.slice(2);
const root = path.resolve("out");
const skip = new Set(["404.html", "_not-found.html"]);

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const routes = walk(root)
  .filter((f) => f.endsWith(".html") && !skip.has(path.basename(f)))
  .map((f) => path.relative(root, f).replace(/\.html$/, "").replace(/(^|\/)index$/, "") || "")
  .map((r) => "/" + r)
  .sort();

const tag = (r) => (r.startsWith("/dart") || r.startsWith("/cities") || r === "/platform" ? "legacy" : r === "/demo" ? "alias" : "canonical");
const cache = new Map();
const status = async (url) => {
  if (!cache.has(url)) {
    try { cache.set(url, (await fetch(url, { redirect: "manual" })).status); } catch { cache.set(url, 0); }
  }
  return cache.get(url);
};

const rows = [];
const failures = [];
for (const r of routes) {
  const url = origin + basePath + (r === "/" ? "/" : r);
  let res, html = "";
  try { res = await fetch(url, { redirect: "manual" }); html = res.status === 200 ? await res.text() : ""; } catch { res = { status: 0 }; }
  const row = { route: r === "/" ? basePath + "/" : basePath + r, kind: tag(r), status: res.status, brokenRefs: [] };
  if (res.status !== 200) failures.push(`${row.route} -> HTTP ${res.status}`);
  const refs = new Set();
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[#?][^"]*)?"/g)) if (!m[1].startsWith("//")) refs.add(m[1]);
  for (const ref of refs) {
    const s = await status(origin + ref);
    if (s !== 200) { row.brokenRefs.push(`${ref} (${s})`); failures.push(`${row.route} references ${ref} -> ${s}`); }
  }
  rows.push(row);
}

fs.mkdirSync(path.dirname(outBase), { recursive: true });
fs.writeFileSync(outBase + ".json", JSON.stringify({ basePath, routeCount: rows.length, uniqueRefsChecked: cache.size, failures: failures.length, routes: rows }, null, 2) + "\n");
fs.writeFileSync(outBase + ".csv", "route,kind,status,broken_refs\n" + rows.map((x) => `${x.route},${x.kind},${x.status},"${x.brokenRefs.join("; ")}"`).join("\n") + "\n");
const by = (k) => rows.filter((x) => x.kind === k).length;
console.log(`routes=${rows.length} (canonical=${by("canonical")}, alias=${by("alias")}, legacy=${by("legacy")}) uniqueRefsChecked=${cache.size} failures=${failures.length}`);
failures.slice(0, 25).forEach((f) => console.log("FAIL", f));
process.exit(failures.length ? 1 : 0);
