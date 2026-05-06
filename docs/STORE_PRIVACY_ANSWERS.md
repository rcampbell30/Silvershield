# Store Privacy Answer Drafts

Use these drafts when filling out Chrome Web Store and Microsoft Edge Add-ons privacy/data-use forms.

Check the latest dashboard wording before submitting. Copy should match the current extension behaviour exactly.

## Single purpose

Silver Shield helps users identify scam warning signs in suspicious messages, links, and web pages using local-only browser checks.

## Permission justification: storage

Silver Shield uses browser local storage to save local settings, trusted contact setup, trusted and blocked domains, dismissed warning sites, and short recent-check history. This data stays on the user’s browser and is not sent to a server.

## Content script justification

Silver Shield uses a content script on ordinary web pages so it can locally scan visible page text and the current page URL for obvious scam-like warning signs. This lets the extension show a non-intrusive warning banner on high-risk pages. Page text is processed locally and is not transmitted.

## Data collection summary

Silver Shield v0.1.0 does not collect or transmit user data. Scam-risk checks run locally in the browser.

## Data handled locally

Silver Shield may locally process:

- text pasted into the popup checker,
- links pasted into the popup checker,
- visible page text when page warning banners are enabled,
- current page URL/hostname for trusted and blocked domain checks.

## Data stored locally

Silver Shield stores the following in browser local storage:

- trusted contact name and phone/email,
- protected person setup details,
- warning sensitivity,
- warning banner preference,
- trusted domains,
- blocked domains,
- dismissed warning sites,
- recent-check history with short previews only.

## Data not collected or transmitted

Silver Shield does not collect or transmit:

- full checked messages,
- full page text,
- browsing history,
- passwords,
- PINs,
- verification codes,
- bank details,
- analytics,
- telemetry,
- account data,
- payment data.

## Limited use certification wording

Silver Shield uses locally processed data only to provide scam warning signs, local settings, and recent-check history. Silver Shield does not sell, share, or transfer user data. Silver Shield does not use user data for advertising, creditworthiness, analytics resale, or unrelated purposes.

## Remote code / AI answer

Silver Shield v0.1.0 does not use remote code, external AI models, analytics scripts, or API calls. All scam-risk checking is deterministic and runs locally in the browser.

## Privacy policy answer

Use the public URL for `docs/store-privacy-policy.html` or `PRIVACY.md`.

Recommended final URL once hosted:

```txt
https://rcampbell30.github.io/Silvershield/store-privacy-policy.html
```

or a custom domain page:

```txt
https://<your-domain>/silver-shield/privacy
```

## Support answer

Use the public URL for `docs/support.html`, GitHub issues, or a dedicated support page.

Recommended final URL once hosted:

```txt
https://rcampbell30.github.io/Silvershield/support.html
```

or a custom domain page:

```txt
https://<your-domain>/silver-shield/support
```

## User-facing privacy summary

Silver Shield checks scam warning signs locally in your browser. It does not send checked messages, page text, or browsing data to a server. Settings and short recent-check previews are stored locally on your device.
