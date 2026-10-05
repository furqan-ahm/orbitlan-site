import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(scriptDir, "..");
const assetsDir = path.join(siteDir, "assets");
const earthSource = path.join(assetsDir, "earth-clouds.gif");

const escapeXml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const size = 500;
const center = size / 2;
const time = 2.4;
const latitudes = [-0.64, 0.08, 0.62, -0.22, 0.38, -0.48, 0.72, 0.18];
const links = [[0, 1], [1, 2], [2, 0], [2, 3], [3, 0], [3, 4], [4, 1], [4, 5], [5, 2], [5, 6], [6, 3], [6, 7], [7, 4], [7, 0]];

const points = latitudes.map((baseLatitude, index) => {
  const longitude = index * (Math.PI * 2 / latitudes.length) + (index % 2) * 0.34 + time * (0.19 + (index % 3) * 0.012);
  const latitude = baseLatitude + Math.sin(time * 0.31 + index * 0.8) * 0.06;
  const latitudeWidth = Math.cos(latitude);
  const depth = Math.cos(longitude) * latitudeWidth;
  const radius = size * (0.414 + (index % 3) * 0.012);
  return {
    x: center + Math.sin(longitude) * latitudeWidth * radius,
    y: center - Math.sin(latitude) * size * 0.36 + depth * size * 0.035,
    depth,
    radius: Math.max(4, size * (0.0064 + (depth + 1) * 0.0018)),
  };
});

function meshLayer(isFront) {
  const lines = links.flatMap(([a, b]) => {
    const depth = (points[a].depth + points[b].depth) / 2;
    if ((depth >= 0) !== isFront) return [];
    const opacity = isFront ? 0.52 + Math.max(0, depth) * 0.28 : 0.13 + (depth + 1) * 0.08;
    return `<line x1="${points[a].x.toFixed(1)}" y1="${points[a].y.toFixed(1)}" x2="${points[b].x.toFixed(1)}" y2="${points[b].y.toFixed(1)}" opacity="${opacity.toFixed(2)}"/>`;
  }).join("");
  const nodes = points.flatMap((point) => {
    if ((point.depth >= 0) !== isFront) return [];
    const opacity = isFront ? 0.86 + Math.max(0, point.depth) * 0.14 : 0.28 + (point.depth + 1) * 0.14;
    return `<circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="${point.radius.toFixed(1)}" opacity="${opacity.toFixed(2)}"/>`;
  }).join("");
  return Buffer.from(`<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg"><g fill="#4cff9f" stroke="#4cff9f" stroke-width="2.2" stroke-linecap="round">${lines}${nodes}</g></svg>`);
}

const text = {
  kicker: "VPN FOR CHINA · SMALL BETA",
  name: "OrbitVPN",
  platform: "Windows + Android",
  summary: "Automatic location. Direct support.",
  url: "orbitlan.site/orbitvpn",
  note: "Simple setup · regional exits · clear usage",
};

const background = Buffer.from(`
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0.92" y2="1">
      <stop offset="0" stop-color="#090e43"/>
      <stop offset="0.56" stop-color="#111755"/>
      <stop offset="1" stop-color="#40316b"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#7380ef" stop-opacity="0.25"/>
      <stop offset="1" stop-color="#7380ef" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#sky)"/>
  <circle cx="954" cy="318" r="310" fill="url(#glow)"/>
  <g fill="#e3e5ff">
    <rect x="66" y="74" width="4" height="4"/><rect x="211" y="119" width="3" height="3"/>
    <rect x="356" y="67" width="4" height="4"/><rect x="538" y="101" width="3" height="3"/>
    <rect x="681" y="56" width="4" height="4"/><rect x="1103" y="91" width="3" height="3"/>
    <rect x="92" y="528" width="3" height="3"/><rect x="444" y="552" width="4" height="4"/>
    <rect x="660" y="504" width="3" height="3"/><rect x="1138" y="512" width="4" height="4"/>
  </g>
  <text x="80" y="140" text-anchor="start" direction="ltr" fill="#c9c7ff" font-family="DejaVu Sans Mono, monospace" font-size="18" font-weight="700" letter-spacing="1.5">${escapeXml(text.kicker)}</text>
  <text x="76" y="244" text-anchor="start" direction="ltr" fill="#ffffff" font-family="DejaVu Sans, Arial, sans-serif" font-size="86" font-weight="700" letter-spacing="-4">${escapeXml(text.name)}</text>
  <text x="80" y="310" text-anchor="start" direction="ltr" fill="#e2e3ff" font-family="DejaVu Sans, Arial, sans-serif" font-size="34" font-weight="700">${escapeXml(text.platform)}</text>
  <text x="80" y="375" text-anchor="start" direction="ltr" fill="#bcc0e5" font-family="DejaVu Sans, Arial, sans-serif" font-size="23">${escapeXml(text.summary)}</text>
  <line x1="80" y1="451" x2="560" y2="451" stroke="#8386b8" stroke-width="1"/>
  <text x="80" y="497" text-anchor="start" direction="ltr" fill="#ffffff" font-family="DejaVu Sans, Arial, sans-serif" font-size="21" font-weight="700">${escapeXml(text.url)}</text>
  <text x="80" y="532" text-anchor="start" direction="ltr" fill="#aeb2d9" font-family="DejaVu Sans, Arial, sans-serif" font-size="17">${escapeXml(text.note)}</text>
</svg>`);

const earth = await sharp(earthSource, { page: 0 })
  .resize(410, 410, { fit: "contain", kernel: sharp.kernel.nearest })
  .png()
  .toBuffer();

await sharp(background)
  .composite([
    { input: meshLayer(false), left: 700, top: 65 },
    { input: earth, left: 745, top: 110 },
    { input: meshLayer(true), left: 700, top: 65 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(path.join(assetsDir, "orbitvpn-social.png"));

console.log("Generated assets/orbitvpn-social.png from the existing Earth artwork and site node geometry.");
