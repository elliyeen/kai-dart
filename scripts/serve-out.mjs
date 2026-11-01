// Minimal static server for the GitHub-Pages-style export: serves ./out under /kai-dart/.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const root = path.resolve("out");
const base = "/kai-dart";
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".mp4": "video/mp4", ".woff2": "font/woff2", ".txt": "text/plain", ".ico": "image/x-icon" };
const port = Number(process.env.PORT || 4173);
const tryFile = (p) => { try { return fs.statSync(p).isFile() ? p : null; } catch { return null; } };
http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  let rel = decodeURIComponent(u.pathname);
  if (!rel.startsWith(base)) { res.writeHead(404); return res.end("not found"); }
  rel = rel.slice(base.length) || "/";
  const p = path.join(root, rel);
  if (!p.startsWith(root)) { res.writeHead(403); return res.end(); }
  const file = tryFile(p) || tryFile(p + ".html") || tryFile(path.join(p, "index.html"));
  if (!file) { const nf = tryFile(path.join(root, "404.html")); res.writeHead(404, { "content-type": "text/html" }); return res.end(nf ? fs.readFileSync(nf) : "404"); }
  res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}).listen(port, () => console.log(`serving out/ at http://localhost:${port}${base}/`));
