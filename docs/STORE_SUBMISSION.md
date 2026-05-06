# Silver Shield Store Submission Guide

This document prepares Silver Shield for Chrome Web Store and Microsoft Edge Add-ons submission.

Silver Shield v0.1.0 is designed as a local-first scam warning extension. It does not use a backend, account system, telemetry, payments, or external AI/API calls.

## Submission status

Current status: **tester-ready, store-prep ready**.

Before public submission, complete the checklist in `docs/RELEASE_CHECKLIST.md` and add final screenshots/assets listed in `docs/STORE_ASSETS.md`.

## Extension package

Build the submission ZIP with:

```bash
npm run package
```

Output:

```txt
packages/silver-shield-extension-v0.1.0.zip
```

The package is built from `dist/` only.

## Recommended listing category

Use the closest available browser-extension category, likely one of:

- Productivity
- Accessibility
- Privacy & Security
- Utilities

Choose the category that best matches the current store dashboard options.

## Single-purpose statement

Silver Shield helps users identify scam warning signs in suspicious messages, links, and web pages using local-only browser checks.

## Short description

Scam warning signs for the browser your family already uses.

## Store summary

Silver Shield is a privacy-first scam warning extension for Chrome and Edge. It helps older or vulnerable users pause before clicking suspicious links, sending money, or sharing sensitive details.

The extension can check pasted messages, emails, SMS text, or links for common scam warning signs. It can also show a calm warning banner on pages with obvious scam-like language.

Silver Shield runs locally in the browser in this MVP. It does not require an account, backend, telemetry, payments, or external AI calls.

## Long description

Silver Shield helps families add a calm scam-warning layer to the browser someone already uses.

It is designed for older or vulnerable users who may receive suspicious messages about parcel fees, tax refunds, bank verification codes, fake support calls, family emergencies, or urgent payment requests.

Features:

- Popup checker for suspicious messages, emails, SMS content, and links.
- Plain-English results: Likely safe, Be careful, or High risk signs found.
- Local scam-risk rule engine.
- Warning signs and next steps shown in clear language.
- Trusted contact setup for family support.
- Optional page warning banners.
- Trusted and blocked domain controls.
- Local recent-check history with short previews only.
- Privacy-first design with no account and no telemetry.

Silver Shield does not guarantee that something is safe or unsafe. It is a practical pause-and-check tool. When in doubt, users should ask someone they trust or contact the organisation directly using an official route.

## Important wording rules

Do not say:

- Stops all scams.
- 100% scam protection.
- Guaranteed scam detection.
- Definitely safe.
- Definitely a scam.

Use:

- Scam warning signs.
- Helps you pause before clicking.
- High risk signs found.
- Can make mistakes.
- Contact the organisation directly.

## Permissions justification

Current permission:

```json
"permissions": ["storage"]
```

Justification:

Silver Shield uses browser local storage to save the user’s local settings, trusted contact setup, trusted/blocked domains, dismissed warning sites, and short recent-check history. No stored data is sent to a server.

Content script matches:

```json
"matches": ["http://*/*", "https://*/*"]
```

Justification:

Silver Shield uses a content script to locally scan visible page text and the current page URL for obvious scam-like warning signs. This allows it to show a non-intrusive warning banner on risky pages. Page text is processed locally in the browser and is not transmitted.

## Data use disclosure draft

Silver Shield processes pasted text, links, visible page text, and page URLs locally in the browser to detect scam warning signs.

Silver Shield stores settings and small recent-check previews locally using browser storage.

Silver Shield does not collect, transmit, sell, or share user data. It has no account system, telemetry, backend, payment processing, or external AI/API calls in v0.1.0.

## Privacy policy URL

Use one of:

- GitHub `PRIVACY.md` URL.
- Hosted `docs/store-privacy-policy.html` via GitHub Pages or your own website.

Recommended final public URL:

```txt
https://<your-domain>/silver-shield/privacy
```

or, if using GitHub Pages:

```txt
https://rcampbell30.github.io/Silvershield/store-privacy-policy.html
```

## Support URL

Use one of:

- GitHub repo issues page.
- Hosted `docs/support.html` via GitHub Pages or your own website.

Recommended final public URL:

```txt
https://<your-domain>/silver-shield/support
```

## Review notes for store reviewers

Silver Shield is a local-first scam warning extension. It does not call any external APIs or remote scripts. All risk checking in v0.1.0 is deterministic and runs in the browser.

To test:

1. Install the unpacked extension from `dist/` or upload the packaged ZIP.
2. Open the extension popup.
3. Paste one of the fake examples from `demo/demo.html`.
4. Run “Check for scam signs”.
5. Open settings to review trusted contact and domain-list controls.

The demo examples are fake and local. No real scam links or real services are used.

## Store submission cautions

Before submitting, check the latest Chrome Web Store and Microsoft Edge Add-ons requirements directly in their dashboards. Store policy wording, screenshot dimensions, account requirements, and review rules can change.
