# OrbitLan website

This repository owns the public website served at
[orbitlan.site](https://orbitlan.site), including the OrbitVPN product page at
[`/orbitvpn/`](https://orbitlan.site/orbitvpn/).

The site is intentionally separate from the public OrbitLan application source
and the private OrbitVPN/control-plane workspace. It contains public static
content only. Product code, credentials, customer information, signing keys,
and private infrastructure configuration do not belong here.

## Local review

Open `index.html` directly for a basic review or run Wrangler's local server:

```bash
npm install
npx wrangler dev
```

## Validate and deploy

```bash
npm install
npm run check
npm run deploy
```

`npm run check` validates canonical metadata, JSON-LD, sitemap membership, and
internal links before running Wrangler's dry-run packaging. `npm run deploy`
runs the same SEO validation before it publishes anything.

The OrbitVPN social preview is assembled from the existing Earth artwork and
the site's node geometry; it does not use generated artwork. Regenerate it
after an intentional copy or layout change with:

```bash
npm run assets:orbitvpn
```

`wrangler.jsonc` deploys the existing `orbitlan-web` Worker with Workers Static
Assets and retains the `orbitlan.site` and `www.orbitlan.site` custom domains.
Deployment requires access to the project owner's Cloudflare account.

The OrbitVPN Android APK and Windows ZIP are hosted independently at
[`downloads.orbitlan.site`](https://downloads.orbitlan.site). Keep displayed
version information and versioned download links aligned with the accepted
release.

OrbitVPN has a separate public privacy notice at `/orbitvpn/privacy/`. Keep it
aligned with the real control-plane schema whenever account, device, usage,
session, support, or retention behavior changes. Do not point OrbitVPN readers
at the account-free OrbitLan privacy notice as a substitute.

The homepage advertises the existing 192×192 Earth artwork as its primary
search favicon and keeps the 48×48 ICO as a fallback. After an icon change,
request a homepage recrawl in Google Search Console; search surfaces can retain
an older favicon after the live asset has changed.

The submitted sitemap is the Google discovery mechanism for ordinary website
and guide pages. Google's URL-level Indexing API is not applicable to this
content. Keep `sitemap.xml` dates accurate, leave it referenced in `robots.txt`,
and use Search Console URL Inspection only when a new page needs an initial
manual nudge.
