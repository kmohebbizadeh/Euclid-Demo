# Cloudflare Pages deployment

The production hostname is `https://app.euclidrisk.com`.

## Build settings

- Framework preset: None
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: repository root
- Node version: any currently supported Cloudflare Pages version (the build uses only POSIX shell commands)

The build copies `euclid-loss-determination.html` to `dist/index.html`, so the console is served at the domain root. It also includes the logo, security headers, and crawler policy.

## Deploy

1. Create a Cloudflare Pages project named `euclid-risk-app` and connect this repository.
2. Apply the build settings above and run the first deployment.
3. In **Workers & Pages → euclid-risk-app → Custom domains**, add `app.euclidrisk.com`.
4. If `euclidrisk.com` is already on Cloudflare DNS, allow Pages to create the DNS record. Otherwise follow Cloudflare's displayed CNAME verification steps.
5. Verify `https://app.euclidrisk.com`, all three SRN selections, the map tiles, login/logout, and response security headers.

## Access-control note

The username and password check in the HTML is intentionally a client-side demo gate. Its credentials are visible to anyone who downloads the page and it must not be treated as security. For a non-public deployment, protect `app.euclidrisk.com` with Cloudflare Access and an identity-provider or one-time-PIN policy. The in-page login may then be retained for the demo flow or removed.

## External runtime dependencies

The page loads Leaflet 1.9.4 from unpkg, fonts from Google Fonts, and map imagery from CARTO. The included Content Security Policy allows only those required third-party hosts. If any provider is replaced, update `_headers` and test the map before deployment.
