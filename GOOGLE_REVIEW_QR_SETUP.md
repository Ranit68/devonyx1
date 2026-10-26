# DevonyX Google Review QR platform

This adds the public product page, self-service activation, public redirect handler, and Firebase-backed product administration to the existing Vite/React and Vercel site. No Firebase project, service account, marketplace listing URL, or credential is assumed by the code.

## Routes and data

- `/google-review-qr`: indexed public product page.
- `/setup` and `/qr-success`: noindex activation flow and confirmation.
- `/r/{slug}`: Vercel rewrite to the QR handler. Activated products receive an uncached 302 to a validated Google review link. Unactivated products redirect directly to `/setup`; unknown or disabled products get a branded error page.
- `/api/qr/activate`, `/api/qr/resolve/{slug}`, and `/api/qr/admin/*`: server-only operations.
- `qrProducts/{randomSlug}`: status, HMAC-SHA256 activation-code hash, and (after activation) business and review details. `qrActivationCodes/{hash}` privately maps each unique hash to its product slug, enabling direct lookup and atomic duplicate-code prevention.
- `qrAdminBatches/{requestUuid}`: AES-256-GCM encrypted CSV for safe recovery if the connection drops during generation. Only the same verified administrator can ask the Function to decrypt and return the same batch again; Firestore clients cannot read this collection. The encryption key is derived with HKDF from `QR_CODE_PEPPER`, so keep that secret stable and backed up.
- `qrRateLimits/{sha256OfClientIp}`: short-window request counter. Configure Firestore TTL on `expiresAt` (instructions below).
- `qrAdminAudit/{eventId}`: private metadata for product generation and recovery actions (no codes or review URLs).

All Firestore reads and writes use Firebase Admin SDK on the server. `firestore.rules` denies all client access. The activation lookup uses an equality query on the HMAC hash, avoiding collection scans. Keep `QR_CODE_PEPPER` stable: changing it invalidates all unactivated codes and prevents decryption of saved batch recovery files. Back it up as a secret outside source control.

## Required setup

1. Create or select the Firebase project and enable **Firestore** in Native mode and **Authentication** (Email/Password is sufficient for the administrator account). The Google Cloud project needs the Blaze billing plan for deployed Functions. Set a billing budget and alert in Google Cloud Billing.
2. Copy `.firebaserc.example` to `.firebaserc` and replace the project ID. `.firebaserc` is local project configuration; do not commit private credentials.
3. Generate a random secret of at least 32 characters for `QR_CODE_PEPPER` (for example `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`). Set it as a Firebase Functions secret/environment value. Do not rotate it after printing product cards unless you also implement a migration.
4. Create the Functions secret with `npx firebase-tools functions:secrets:set QR_CODE_PEPPER` and enter your generated random value when prompted. `functions/index.js` binds the secret to `qrApi` and defines `PUBLIC_BASE_URL` (default `https://devonyx.in`) as a deploy-time parameter. Never put either value in a `VITE_` variable.
5. Deploy rules and function from the repository root: `npx firebase-tools deploy --only firestore:rules,functions:qrApi`. This deploys `qrApi` in `asia-south1` on Node.js 22. The function URL is shown by the CLI.
6. Add a Firebase Auth user for each DevonyX administrator. Find the user's Auth UID and grant the `admin` custom claim with a trusted local service identity: `node functions/set-admin-claim.js FIREBASE_AUTH_UID`. Locally, use Application Default Credentials or a service-account JSON in the `FIREBASE_SERVICE_ACCOUNT` environment variable. The script preserves existing custom claims. It never accepts a password or stores a credential in the repository. Sign out and back in after setting the claim.
7. The checked-in Vercel config proxies `/r` and `/api/qr` to the deployed `qrApi` Function. This keeps the Firebase Admin service credential and `QR_CODE_PEPPER` out of Vercel. If you change Firebase project or region, update the Function URL in `vercel.json`. Do not route public activation traffic to Firebase Hosting unless you have configured the `devonyx.in` DNS/custom-domain arrangement for it.
8. Set the same `PUBLIC_BASE_URL` and `QR_CODE_PEPPER` in the selected server runtime. Set `VITE_FIREBASE_API_KEY` in Vercel Production so the `/admin/qr-batches` page can sign in through Firebase Authentication. This web API key is public browser configuration, not a secret; restrict it to the required Google APIs and site domains. Configure `VITE_QR_AMAZON_URL`, `VITE_QR_FLIPKART_URL`, and `VITE_QR_MEESHO_URL` in Vercel only when real listing URLs are ready; Vite embeds these public URLs at build time.
9. If desired, set `REQUIRE_APP_CHECK=true` only after integrating a Firebase App Check provider and sending its token from the browser. It is off by default so the setup works without an unconfigured App Check site key. The activation route also limits each client IP to 12 attempts per 15 minutes.
10. Enable Firestore TTL for `qrRateLimits.expiresAt` in Google Cloud Console (Firestore → Time-to-live). Without TTL, rate-limit documents remain stored after their window; they do not affect behavior but slowly add storage cost.

### Vercel and Firebase routing

The frontend stays on Vercel, which proxies `/r` and `/api/qr` to the deployed `qrApi` Function. The physical QR code uses `https://devonyx.in/r/{slug}`, so changing the API host does not change printed codes. `firebase.json` deploys Firestore rules and Functions only; it does not configure Firebase Hosting or DNS.

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env`; set `PUBLIC_BASE_URL=http://localhost:5173`, `QR_CODE_PEPPER`, and a local Admin SDK credential/Application Default Credentials. Never commit `.env`.
3. Start `npm run dev`. With `.firebaserc` configured, Vite proxies `/api/qr` to the deployed `qrApi` Function, so localhost exercises the real backend. Set `QR_FUNCTION_URL=http://127.0.0.1:5001/luxxglow/asia-south1/qrApi` in your shell to proxy to the Firebase Functions emulator instead. If you also want the existing local Notion API, start `npm run dev:full`; the QR proxy continues to use the deployed Function.
4. Build with `npm run build`; run the unit tests with `npm test`.

For a one-product live smoke test, open `/qr-local-test` in Vite while it is running. Sign in in that browser as a Firebase Auth user with the `admin: true` custom claim, generate one product, scan the displayed local QR, and finish activation on `/setup`. This creates and activates one test product in the deployed `luxxglow` Firestore; delete the test product and its `qrActivationCodes` mapping from Firestore after the check if you do not want to keep it. The test page only exists in Vite development builds and is not shipped in the production router.

The code is emulator-compatible, but this repository does not include a configured Firebase Emulator Suite. The checks in `tests/qr-validation.test.js` cover URL and code normalization; the end-to-end checklist below must be completed against a disposable Firebase project/emulator before launch.

## Generate and print products

1. Open **Admin panel** in the site navigation (or visit `/admin`, which redirects to `/admin/qr-batches`) and sign in to Firebase Authentication as the claimed administrator. The page accepts batch sizes from 1 to 200 and submits an idempotent request to the protected API.
2. Store the downloaded CSV in a restricted location. It contains `slug`, `redirect_url`, and `activation_code`. Firestore stores an authenticated-encrypted recovery copy of the CSV; retrying the same batch request as the same admin returns the same products and codes. The request ID is kept in that admin's browser storage so a lost response does not create another batch.
3. Use each `redirect_url` to print the matching QR on a stand. The page previews a selected QR and can download its SVG. Put the matching `activation_code` on the insert inside the same package. Never print the activation code beside the public stand QR.
4. Treat the CSV as a secret and securely delete/archive it according to your fulfillment process. Product records store only the HMAC hash. The dashboard keeps a pending batch request ID per administrator so a failed connection can recover the same encrypted batch instead of accidentally creating duplicates.
5. Test each print before packaging. If an unused code is lost, verify the buyer's order and call `/api/qr/admin/reset-activation` with an admin ID token and its slug. The response contains a replacement activation code once; deliver it securely. If an activated buyer needs a correction, verify ownership and call `/api/qr/admin/update-destination` with the slug, business name, and new Google review URL. The code cannot be reset after activation.

## End-to-end launch checklist

- [ ] Valid activation stores the business name and review URL and changes status exactly once; an identical retry returns the same public test URL, while different details cannot reassign the code.
- [ ] Invalid, malformed, expired/mistyped, and already-used codes return a generic message.
- [ ] Two simultaneous activation requests for one code produce one winner.
- [ ] Arbitrary domains, HTTP, localhost/private destinations, JavaScript/data URLs, and malformed URLs are rejected; supported Google review link formats work.
- [ ] Unknown slug shows branded 404; unactivated slug redirects to `/setup`; activated slug returns 302 to the saved Google link; disabled/revoked slug does not redirect.
- [ ] Update a destination as an administrator and confirm the same printed slug uses the new link; confirm cache headers prevent stale redirects.
- [ ] Public Firestore SDK reads and writes are denied, including guessed slugs and private fields.
- [ ] Non-admin, expired, revoked, and malformed admin calls fail; an admin can generate batches of 1 and 200, and all slugs/codes are unique.
- [ ] Code reset requires admin authorization and an unactivated product, replaces the old code atomically, and returns the replacement only once; destination updates require an activated product and a valid Google URL.
- [ ] Verify every generated CSV code activates only its paired slug, batch recovery returns exactly the same file, and no plaintext code appears in Firestore or logs.
- [ ] Rate-limit behavior and App Check (if enabled) reject excess/unverified requests; database outages return a generic retry response.
- [ ] Confirm Vercel rewrites, custom domain HTTPS, 302 behavior, metadata, noindex activation pages, sitemap, and mobile/keyboard accessibility in a preview deployment.
- [ ] Never run these checks against production product records.

## Cost and abuse controls

Cloud Functions and Firestore usage are billed on the Firebase Blaze plan. A scan makes one product document read. Activation makes a direct hash-map lookup, a product transaction, and a rate-limit transaction. Each activation attempt adds a small rate-limit transaction; TTL removes expired rate-limit documents after the configured retention. Functions have a 256 MiB memory setting and a 10-instance cap to limit runaway scale. Set Cloud Logging retention and alert thresholds, Cloud Billing budget alerts, Firestore/Function usage alerts, and review App Check adoption before marketplace promotion. Budget alerts notify but do not automatically cap spend. Avoid recording request bodies, codes, full review links, or service-account data in logs.

The static landing page and Vercel routes use the existing Vercel deployment. Firebase Hosting is not needed. Vercel plan/API costs and Firebase usage vary with scans, activations, abuse, and retention; check current provider pricing before launch.

## Changed files

New QR pages/styles and router wiring: `src/pages/GoogleReviewQR.jsx`, `src/pages/QRBatchAdmin.jsx`, `src/App.jsx`, `src/index.css`.

Server/security/deployment: `functions/qr/core.js`, `api/index.js`, `server/index.js`, `functions/index.js`, `functions/package.json`, `functions/set-admin-claim.js`, `firestore.rules`, `firebase.json`, `.firebaserc.example`, `vercel.json`, `.env.example`, `vite.config.js`, and `package.json`.

SEO and checks: `public/sitemap.xml`, `public/robots.txt`, `tests/qr-validation.test.js`, this guide.
