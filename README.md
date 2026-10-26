# DevonyX Google Review QR

DevonyX QR stands use a permanent QR code that can be assigned to a business after purchase. The business owner activates the stand with a one-time code and their Google review link. After activation, scans go straight to that review link.

## How a business owner sets up a stand

1. The owner receives a DevonyX stand with its QR already printed on it, plus a separate one-time activation code inside the package.
2. They scan the stand QR with their phone camera. Before activation, it sends them directly to the setup page.
3. They enter the code from the package, then enter their business name and Google review link.
4. They can get the link in their Google Business Profile using **Ask for reviews** / **Get more reviews**. They do not give DevonyX their Google password.
5. They submit the form. The stand is now connected. Scanning it sends customers to the business's Google review page.

The QR URL stays the same after setup. The owner can place the stand near checkout and invite customers to leave an honest review. The QR does not guarantee or automatically create reviews.

## How DevonyX prepares a QR for a customer

Each product needs its own unique QR URL and activation code. Keep the pair together in your fulfillment records:

- Print the `redirect_url` as the QR on the stand. It has the form `https://devonyx.in/r/{slug}`.
- Put the matching `activation_code` on a card inside the package. Do not print this code beside the public QR.
- Send the stand and code to the same customer. Each activation code can be used only once.

To prepare commercial batches, a DevonyX administrator opens **Admin panel** from the site navigation (or visits `/admin`), signs in with their Firebase Authentication account, and generates 1–200 product pairs. `/admin` redirects to `/admin/qr-batches`. The server verifies the account's `admin` custom claim, creates the products, and returns a CSV containing `slug`, `redirect_url`, and `activation_code`. The dashboard downloads the CSV, previews individual QRs for SVG download, and can print separate QR-label and activation-insert sheets in the same product order. Store the CSV securely; it is the only plaintext export. The server keeps an encrypted recovery copy so an interrupted request can safely return the same batch when retried. Test one printed QR and code pair before packing a full batch. The current project has no automatic store/order integration, so matching generated products to orders and packing the correct code remain manual fulfillment work.

The dashboard uses `VITE_FIREBASE_API_KEY` to sign in through Firebase Authentication. Get the web API key from Firebase Console → Project settings → General → your web app. Set it in local `.env.local` for local use and in the Vercel Production environment before deployment. It is a public browser key, not a server secret; restrict it to Firebase Authentication APIs and your required site domains. Never put `QR_CODE_PEPPER` or a service-account key in a `VITE_` variable.

If a customer loses an unused code, verify their order before an administrator uses `/api/qr/admin/reset-activation` for that product. If an activated customer needs a different destination, verify ownership before using `/api/qr/admin/update-destination`.

To remove admin access, run `node functions/set-admin-claim.js FIREBASE_AUTH_UID --revoke` using the trusted Firebase service identity. This removes the admin claim and revokes that user's existing refresh tokens. Deploy the updated Function so admin requests also check token revocation.

## Test the full flow on localhost

The local test page creates one real product in the deployed Firebase project (`luxxglow`) and calls its deployed Function. **It is a live Firestore smoke test, not an isolated emulator test.** Do not use its test product for a customer order.

1. Ensure `.env.local` contains `VITE_FIREBASE_API_KEY` for the Firebase project. Keep local environment files private; do not commit them.
2. In a terminal at the repository root, run:

   ```powershell
   npm install
   npm run dev -- --host 0.0.0.0
   ```

3. On the same computer, open `http://localhost:5173/qr-local-test`. Sign in with a Firebase Authentication account whose custom claim is `admin: true`. If you see “Administrator access required,” ask the project administrator to grant the claim with the steps in [GOOGLE_REVIEW_QR_SETUP.md](./GOOGLE_REVIEW_QR_SETUP.md), then sign out and back in.
4. Click **Generate one test product**. The page shows a QR, a local URL, an activation code, and the permanent `devonyx.in` URL.
5. Open the QR's local URL, or scan it with a phone connected to the same Wi-Fi. For a phone, open the test page using the computer's LAN address, for example `http://192.168.1.20:5173/qr-local-test`; use the address Vite prints for your computer. Keep Vite running while testing.
6. The local QR sends you to the setup form. Enter the displayed code, a business name, and a valid Google review URL. Submit, then scan/open the local QR again. It should redirect to that review page.
7. The local test generates and then activates a product in live Firestore. After testing, if you want to remove it, find `qrProducts/{slug}` in Firebase Console (the slug is in the permanent URL) and delete that document. Read its `activationCodeHash` field first, then delete the matching `qrActivationCodes/{activationCodeHash}` document. Keep the two deletions paired. Do not delete any customer product.

The same `/admin/qr-batches` screen works in Vite and on the deployed site after `VITE_FIREBASE_API_KEY` is configured. For the localhost test flow, `/qr-local-test` is a shortcut that creates exactly one live product and shows a local QR. If the page does not load, make sure Vite is running. If generation returns an authorization error, sign in again after the admin claim is set. If the business form rejects a link, copy the review link from Google Business Profile; arbitrary website URLs are not accepted.

## Deploying the website

The frontend and rewrites are served by Vercel. `vercel.json` proxies `/r/*` and `/api/qr/*` to the deployed Firebase Function, so Vercel does not need a Firebase service-account credential or the QR pepper. Firebase Functions and Firestore rules are managed separately with the Firebase CLI. The local-only `/qr-local-test` page is excluded from production. Deploy the latest `qrApi` Function before using the new batch screen; it now uses encrypted, idempotent batch recovery and checks revoked admin tokens.

Before launch, set `VITE_FIREBASE_API_KEY` in the Vercel Production environment, confirm the Vercel project uses `devonyx.in` with HTTPS, and check the rewrite paths in a preview deployment. The marketplace listing links are not configured yet, so the product page currently says listings are coming soon. Do not use real customer codes in smoke tests.

For Firebase setup, recovery operations, security notes, and the launch checklist, see [GOOGLE_REVIEW_QR_SETUP.md](./GOOGLE_REVIEW_QR_SETUP.md).
