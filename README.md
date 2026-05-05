# Silver Shield

Silver Shield is a browser-extension-first scam warning product for older or vulnerable users and the family members who help protect them.

> Scam warnings for the browser your family already uses.

This MVP is a Chrome/Edge-compatible Manifest V3 extension. It is intentionally practical, local-first, and limited in scope. It is not a new safe browser, not a full cybersecurity suite, and not an AI miracle product.

## What this MVP does

- Opens a family setup/onboarding page on first install.
- Tells users to pin Silver Shield to the browser toolbar.
- Lets a family member record who is being protected and who the trusted contact is.
- Provides a popup where someone can paste suspicious text, email content, SMS content, or a link.
- Runs a deterministic local scam-risk analyser in the browser.
- Returns one of three careful risk labels:
  - Likely safe
  - Be careful
  - High risk signs found
- Shows plain-English reasons and next steps.
- Suggests asking the saved trusted contact when high-risk signs are found.
- Scans visible page text lightly with a content script.
- Shows a non-intrusive warning banner when high-risk signs are found on a page.
- Supports trusted domains, blocked domains, and per-site banner dismissal.
- Saves trusted contact and family setup settings locally.
- Saves a small local history of recent checks using short previews only.
- Includes a local demo page with fake scam examples.
- Includes privacy, safety, QA, tester, and printable family checklist docs.
- Can package the built extension into a ZIP for tester sharing.
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
  onboarding/
    onboarding.html
    onboarding.ts
    onboarding.css
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

demo/
  demo.html
  demo.css
  demo.js

docs/
  QA.md
  TESTER_GUIDE.md
  family-safety-checklist.html

scripts/
  build.mjs
  package.mjs
  testRules.mjs

public/
  icons/
    README.md

manifest.json
package.json
tsconfig.json
README.md
PRIVACY.md
SAFETY.md
CHANGELOG.md
```

PNG icons are generated into `dist/icons/` by `scripts/build.mjs`. Replace them with designed brand PNG files later if needed.

## Family setup flow

On first install, the background service worker opens `onboarding/onboarding.html`.

The onboarding page asks for:

- Person being protected.
- Installer relationship.
- Trusted contact name.
- Trusted contact phone/email.
- Warning sensitivity.
- Whether page warning banners should be enabled.

It also tells users how to pin Silver Shield to the browser toolbar:

1. Click the browser puzzle-piece/extensions icon.
2. Find Silver Shield.
3. Click the pin icon.

These values are saved locally in `chrome.storage.local`. There is no sending, syncing, account creation, or contact messaging in this MVP.

The setup guide can also be reopened from:

- The popup footer.
- The options/settings page.

## Trusted and blocked domains

The options page supports local website lists:

- Trusted domains reduce warning noise and can suppress page banners on those sites.
- Blocked domains raise risk when they appear in pasted messages or links.
- “Don’t warn on this site” choices are stored locally and can be reset from Settings.

Trusted domains never mean “definitely safe”. Silver Shield still uses careful wording and should not guarantee safety.

## Demo page

Open `demo/demo.html` locally in your browser to test examples. It includes fake messages for:

- Royal Mail parcel fee.
- HMRC refund.
- Bank verification code request.
- WhatsApp-style “Hi Mum, lost my phone”.
- Microsoft support remote access.
- Crypto/investment pressure.
- Normal harmless message.

The demo page has copy buttons so you can paste examples into the extension popup.

## Documentation

- `PRIVACY.md` — local-only privacy model and future AI privacy requirements.
- `SAFETY.md` — safe wording, product limits, and emergency steps.
- `CHANGELOG.md` — release history.
- `docs/QA.md` — manual QA checklist before sharing builds.
- `docs/TESTER_GUIDE.md` — non-technical tester instructions.
- `docs/family-safety-checklist.html` — printable family scam safety checklist.

## Permissions model

The extension requests only:

```json
"permissions": ["storage"]
```

It does **not** request `tabs`, `activeTab`, broad host permissions, or any network permission.

The content script matches `http://*/*` and `https://*/*` so it can show scam-warning banners on ordinary web pages. This is broad page coverage, but the MVP keeps the behaviour local: page text is analysed in the browser and is not transmitted anywhere.

The background worker may open the extension’s own onboarding page on fresh install. It does not read tab contents or browsing history.

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

6. The onboarding page should open on first install. Pin Silver Shield to the browser toolbar and open the popup.

## Development commands

```bash
npm install
npm run build
npm run test:rules
npm run package
```

This project currently uses a small zero-dependency build script instead of Vite. The source files stay modular under `src/`, and the build script copies them into `dist/`. The content script is bundled into one classic script because Manifest V3 content scripts should not rely on extension-page ES module imports.

## Packaging for testers

Run:

```bash
npm run package
```

This builds the extension and creates:

```txt
packages/silver-shield-extension-v0.1.0.zip
```

The `packages/` folder is ignored by git so local ZIP builds are not accidentally committed.

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
- Fake DVLA penalty message.
- Fake Microsoft remote access support message.
- Normal harmless message.
- Shortened and non-HTTPS URL detection.
- Blocked-domain scoring.
- Trusted/dismissed site page-warning suppression.

## Local scam-risk analyser

The first rule engine is deterministic and local. It looks for warning signs such as:

- Urgency: “act now”, “limited time”, “urgent”, “within 24 hours”.
- Money pressure: “send money”, “bank transfer”, “gift card”, “crypto”, “refund fee”.
- Credential requests: “password”, “verification code”, “PIN”, “login details”.
- Impersonation: “HMRC”, “bank”, “Royal Mail”, “Evri”, “DPD”, “DVLA”, “NHS”, “Microsoft support”.
- Parcel scams: redelivery fees, customs fees, missed delivery hooks.
- Bank scams: OTP, verification code, transaction approval hooks.
- Remote access scams: AnyDesk, TeamViewer, fake support, device virus claims.
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
- Trusted contact details are stored locally only.
- Trusted/blocked domains and dismissed-site choices are stored locally only.

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

Chrome/Edge desktop extension MVP with onboarding and local trusted-contact setup.

### Phase 1.5

Demo page, stronger UK rules, trusted/blocked domain controls, and per-site banner dismissal.

### Phase 1.9

Tester-ready package with privacy docs, safety docs, manual QA, tester guide, printable checklist, and ZIP packaging.

### Phase 2

Better rule engine, allowlist/blocklist refinement, stronger suspicious-domain detection, and a proper family contact workflow.

### Phase 3

Optional consent-based AI checker with privacy-preserving design and clear user controls.

### Phase 4

Safari Web Extension conversion and Apple-compatible companion app.

### Phase 5

iPhone/iPad family setup flow.

## Suggested next build tasks

- Replace generated placeholder icons with polished Silver Shield PNG icons.
- Add optional custom rule packs for UK scams.
- Add an onboarding step with screenshots showing how to pin the extension in Chrome and Edge.
- Run a small tester round with family/friends.
- Tune false positives and false negatives based on tester feedback.
