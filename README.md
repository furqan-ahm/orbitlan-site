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

`wrangler.jsonc` deploys the existing `orbitlan-web` Worker with Workers Static
Assets and retains the `orbitlan.site` and `www.orbitlan.site` custom domains.
Deployment requires access to the project owner's Cloudflare account.

The Android APK is hosted independently at
[`downloads.orbitlan.site`](https://downloads.orbitlan.site). Keep displayed
version information and versioned download links aligned with the accepted
release.
