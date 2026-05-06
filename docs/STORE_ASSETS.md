# Silver Shield Store Asset Checklist

Use this file to prepare Chrome Web Store and Microsoft Edge Add-ons assets.

Check the latest store dashboards before final export because required dimensions may change.

## Existing product assets

Recommended local brand files:

```txt
assets/brand/silver-shield-icon.png
assets/brand/onboarding-hero.png
assets/brand/icons/icon-16.png
assets/brand/icons/icon-32.png
assets/brand/icons/icon-48.png
assets/brand/icons/icon-128.png
```

## Extension icons

Required for the extension package:

- [ ] `icon-16.png`
- [ ] `icon-32.png`
- [ ] `icon-48.png`
- [ ] `icon-128.png`

Guidance:

- Use a simple shield/check motif.
- Avoid small text.
- Keep strong contrast at 16px and 32px.
- Use a square PNG.
- Keep important details inside safe padding.

## Store screenshots

Prepare screenshots showing:

1. Popup checker empty state.
2. Popup checker high-risk result.
3. Popup checker likely-safe result.
4. Onboarding/family setup page.
5. Settings page with trusted contact and domain controls.
6. Warning banner on a safe local demo page.
7. Printable family safety checklist.

Recommended screenshot principles:

- Use real extension UI, not fake mockups.
- Do not include personal data.
- Do not include real scam links.
- Use the fake examples from `demo/demo.html`.
- Keep browser zoom normal.
- Use a clean desktop background.

## Promotional images

Prepare a simple brand banner with:

- Silver Shield logo/icon.
- Short tagline: “Scam warnings for the browser your family already uses.”
- Soft blue/silver/white palette.
- No scary hacker imagery.
- No promises such as “100% protection”.

## Suggested screenshot script

### Screenshot 1: Popup checker

Text to paste:

```txt
Royal Mail: Your parcel is waiting. Pay a small redelivery fee within 24 hours to avoid return: http://royal-mail-fee.top/claim
```

Expected result: high risk signs found.

### Screenshot 2: Trusted contact

Set trusted contact name to a dummy name such as:

```txt
Sarah
```

Expected result: high-risk checks suggest asking Sarah before continuing.

### Screenshot 3: Settings

Show:

- protected person name,
- trusted contact,
- sensitivity,
- trusted domains,
- blocked domains.

Use dummy data only.

### Screenshot 4: Warning banner

Use a local demo page or safe test page with fake scam wording. Do not screenshot a real malicious site.

## Asset wording rules

Allowed:

- Scam warning signs.
- Helps you pause before clicking.
- Privacy-first local checks.
- Built for family support.

Avoid:

- Guaranteed scam protection.
- Stops all scams.
- Definitely safe.
- Definitely a scam.
- Bank-grade security unless independently verified.
