import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries
    .filter((entry) => ![".git", ".wrangler", "node_modules"].includes(entry.name))
    .map((entry) => entry.isDirectory() ? walk(path.join(directory, entry.name)) : path.join(directory, entry.name)));
  return nested.flat();
}

const htmlFiles = (await walk(root)).filter((file) => file.endsWith(".html"));
const sitemap = await readFile(path.join(root, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const sitemapSet = new Set(sitemapUrls);
const failures = [];
const orbitVpnSocialUrl = "https://orbitlan.site/assets/orbitvpn-social.png";
const primaryFavicon = '<link rel="icon" type="image/png" sizes="192x192" href="/assets/orbitlan-icon-192.png">';

if (sitemapSet.size !== sitemapUrls.length) failures.push("sitemap.xml contains duplicate URLs");

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const relative = path.relative(root, file).replaceAll(path.sep, "/");
  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]+)">/)?.[1];
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

  if (!canonical) failures.push(`${relative}: missing canonical URL`);
  if (!title) failures.push(`${relative}: missing title`);
  if (!description) failures.push(`${relative}: missing description`);
  if (!html.includes(primaryFavicon) && relative !== "orbitvpn/index.html") {
    failures.push(`${relative}: missing primary 192x192 favicon`);
  }
  if (relative === "orbitvpn/index.html" && !html.includes(primaryFavicon.replaceAll('href="/', 'href="../'))) {
    failures.push(`${relative}: missing primary 192x192 favicon`);
  }
  if (relative.startsWith("orbitvpn/") && !html.includes(`<meta property="og:image" content="${orbitVpnSocialUrl}">`)) {
    failures.push(`${relative}: missing OrbitVPN social preview`);
  }
  for (const [, json] of schemas) {
    try { JSON.parse(json); } catch (error) { failures.push(`${relative}: invalid JSON-LD (${error.message})`); }
  }

  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (/^(https?:|mailto:|#)/.test(href)) continue;
    const clean = href.split("#", 1)[0].split("?", 1)[0];
    if (!clean) continue;
    let target = clean.startsWith("/") ? path.join(root, clean) : path.join(path.dirname(file), clean);
    try {
      if ((await stat(target)).isDirectory()) target = path.join(target, "index.html");
      await stat(target);
    } catch {
      failures.push(`${relative}: broken internal link ${href}`);
    }
  }

  if (canonical && !sitemapSet.has(canonical) && !["security/index.html"].includes(relative)) {
    failures.push(`${relative}: canonical URL is not in sitemap.xml`);
  }
}

try {
  const preview = await stat(path.join(root, "assets", "orbitvpn-social.png"));
  if (preview.size < 10_000) failures.push("assets/orbitvpn-social.png is unexpectedly small");
} catch {
  failures.push("assets/orbitvpn-social.png is missing");
}

try {
  const favicon = await stat(path.join(root, "assets", "orbitlan-icon-192.png"));
  if (favicon.size < 1_000) failures.push("assets/orbitlan-icon-192.png is unexpectedly small");
} catch {
  failures.push("assets/orbitlan-icon-192.png is missing");
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`SEO validation passed for ${htmlFiles.length} HTML files and ${sitemapUrls.length} sitemap URLs.`);
