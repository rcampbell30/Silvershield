# Silver Shield

Silver Shield is a browser-extension-first scam warning product for older or vulnerable users and the family members who help protect them.

> Scam warnings for the browser your family already uses.

This MVP is a Chrome/Edge-compatible Manifest V3 extension. It is intentionally practical, local-first, and limited in scope. It is not a new safe browser, not a full cybersecurity suite, and not an AI miracle product.

## What this MVP does

- Provides a popup where someone can paste suspicious text, email content, SMS content, or a link.
- Runs a deterministic local scam-risk analyser in the browser.
- Returns one of three careful risk labels:
  - Likely safe
  - Be careful
  - High risk signs found
- Shows plain-English reasons and next steps.
- Scans visible page text lightly with a content script.
- Shows a non-intrusive warning banner when high-risk signs are found on a page.
- Saves trusted contact settings locally.
- Saves a small local history of recent checks using short previews only.
- Uses `chrome.storage.local` for settings and history.

## What it does not do yet

- No backend.
- No account system.
- No payment system.
- No Supabase integration.
- No AI API calls.
- No telemetry.
- No real contact messaging.
- No Safari/iPhone build yet.
- No guarantee that a page or message is safe or unsafe.

Silver Shield can make mistakes. When in doubt, ask someone you trust or contact the organisation directly using a known official route.

## Project structure

```txt
src/
  background/
    serviceWorker.ts
  content/
    contentScript.ts
    warningBanner.ts
  popup/
    popup.html
    popup.ts
    popup.css
  options/
    options.html
    options.ts
    options.css
  shared/
    scamRules.ts
    riskScoring.ts
    storage.ts
    types.ts
    constants.ts

public/
  icons/
    README.md

scripts/
  build.mjs
  testRules.mjs

manifest.json
package.json
tsconfig.json
README.md
```

PNG icons are generated into `dist/icons/` by `scripts/build.mjs`. Replace them with designed brand PNG files later if needed.

## Permissions model

The extension requests only:

```json
"permissions": ["storage"]
```

It does **not** request `tabs`, `activeTab`, broad host permissions, or any network permission.

The content script matches `http://*/*` and `https://*/*` so it can show scam-warning banners on ordinary web pages. This is broad page coverage, but the MVP keeps the behaviour local: page text is analysed in the browser and is not transmitted anywhere.

## Install locally in Chrome or Edge

1. Run:

   ```bash
   npm install
   npm run build
   ```

2. Open the extensions page:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`

3. Enable **Developer Mode**.

4. Choose **Load unpacked**.

5. Select the generated `dist` folder.

6. Pin Silver Shield to the browser toolbar and open the popup.

## Development commands

```bash
npm install
npm run build
npm run test:rules
```

This project currently uses a small zero-dependency build script instead of Vite. The source files stay modular under `src/`, and the build script copies them into `dist/`. The content script is bundled into one classic script because Manifest V3 content scripts should not rely on extension-page ES module imports.

## Testing the risk engine

Run:

```bash
npm run test:rules
```

The test script checks sample cases for:

- Fake Royal Mail parcel fee message.
- Fake HMRC tax refund message.
- Fake bank verification code request.
- Family “lost phone” message.
- Normal harmless message.
- Shortened and non-HTTPS URL detection.

## Local scam-risk analyser

The first rule engine is deterministic and local. It looks for warning signs such as:

- Urgency: “act now”, “limited time”, “urgent”, “within 24 hours”.
- Money pressure: “send money”, “bank transfer”, “gift card”, “crypto”, “refund fee”.
- Credential requests: “password”, “verification code”, “PIN”, “login details”.
- Impersonation: “HMRC”, “bank”, “Royal Mail”, “police”, “Microsoft support”.
- Suspicious links: shortened URLs, non-HTTPS links, odd domains, lookalike wording.
- Emotional manipulation: “family emergency”, “I lost my phone”, “don’t tell anyone”.
- Prize/refund hooks: “you won”, “refund pending”, “parcel fee”, “tax rebate”.

The analyser returns:

```ts
{
  riskLevel: "safe" | "caution" | "high",
  score: number,
  matchedSignals: [],
  explanation: string,
  recommendedActions: string[]
}
```

## Privacy model

Silver Shield is local-only in this MVP.

- Checked messages are not sent to a server.
- Page text is not transmitted.
- No telemetry is collected.
- No account is required.
- Settings are stored in `chrome.storage.local`.
- History stores only a timestamp, risk level, score, matched signal count, and a short preview of the checked text.
- Full checked text is not stored by default.

Future AI checking would require explicit consent, clear privacy copy, and careful handling of sensitive content. Users should avoid pasting passwords, bank details, PINs, or verification codes.

## Safety copy rules

Silver Shield should never say:

- “This is definitely safe.”
- “This is definitely a scam.”
- “We guarantee protection.”

Use careful wording:

- “Likely safe.”
- “Be careful.”
- “High risk signs found.”
- “Silver Shield can make mistakes.”
- “When in doubt, ask someone you trust or contact the organisation directly.”

## Future roadmap

### Phase 1

Chrome/Edge desktop extension MVP.

### Phase 2

Better rule engine, allowlist/blocklist, stronger suspicious-domain detection, and a proper family contact workflow.

### Phase 3

Optional consent-based AI checker with privacy-preserving design and clear user controls.

### Phase 4

Safari Web Extension conversion and Apple-compatible companion app.

### Phase 5

iPhone/iPad family setup flow.

## Suggested next build tasks

- Replace generated placeholder icons with polished Silver Shield PNG icons.
- Add an allowlist for known trusted sites.
- Add a local blocklist/watchlist for suspicious domains.
- Add better per-site banner dismissal so dismissing one page does not hide all future warnings.
- Add accessibility testing with keyboard-only navigation and screen reader labels.
- Add a small onboarding page for family-installed setup.
