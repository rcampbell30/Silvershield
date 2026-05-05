# Silver Shield Manual QA Checklist

Use this checklist before sharing a ZIP build with testers.

## Build and package

- [ ] Run `npm install`.
- [ ] Run `npm run build`.
- [ ] Run `npm run test:rules`.
- [ ] Run `npm run package`.
- [ ] Confirm `packages/silver-shield-extension-v0.1.0.zip` exists.

## Install

- [ ] Open `chrome://extensions` or `edge://extensions`.
- [ ] Enable Developer Mode.
- [ ] Load unpacked from the `dist` folder.
- [ ] Confirm Silver Shield appears in the extension list.
- [ ] Confirm the onboarding page opens on first install.

## Onboarding

- [ ] Enter protected person name.
- [ ] Enter installer relationship.
- [ ] Enter trusted contact name.
- [ ] Enter trusted contact phone/email.
- [ ] Choose low, normal, and high sensitivity in separate runs.
- [ ] Toggle page warning banners off and on.
- [ ] Complete setup.
- [ ] Confirm settings are saved.
- [ ] Confirm final pin-in-toolbar guidance is visible.

## Popup checker

Use `demo/demo.html` and copy each example into the popup.

- [ ] Royal Mail parcel fee returns high risk.
- [ ] HMRC refund returns high risk.
- [ ] Bank verification code request returns high risk.
- [ ] “Hi Mum, lost phone” returns high risk.
- [ ] Microsoft remote access returns high risk.
- [ ] Crypto/investment pressure returns caution or high risk depending sensitivity.
- [ ] Normal harmless message returns likely safe.
- [ ] High-risk result suggests asking the trusted contact.
- [ ] Warning signs are shown in plain English.
- [ ] Recommended actions are shown.

## Local history

- [ ] Recent checks appear after running popup checks.
- [ ] History stores short previews only.
- [ ] Clear history button works.
- [ ] Full sensitive text is not stored in history.

## Options/settings

- [ ] Family setup fields load correctly.
- [ ] Family setup fields save correctly.
- [ ] Warning sensitivity saves correctly.
- [ ] Page warning banner toggle saves correctly.
- [ ] Emergency help text saves correctly.
- [ ] Trusted domains save correctly.
- [ ] Blocked domains save correctly.
- [ ] Domain entries are normalised, e.g. `https://www.gov.uk/path` becomes `gov.uk`.

## Trusted and blocked domains

- [ ] Add `gov.uk` to trusted domains.
- [ ] Confirm `www.gov.uk` page warnings are suppressed.
- [ ] Add `known-bad-site.top` to blocked domains.
- [ ] Confirm a pasted link to `https://known-bad-site.top` increases risk.
- [ ] Confirm trusted-domain results do not say “definitely safe”.

## Page warning banners

- [ ] Visit a locally created or demo high-risk page.
- [ ] Confirm the Silver Shield banner appears when risk is high.
- [ ] Click “Why?” and confirm clear reasons appear.
- [ ] Click “Dismiss once” and confirm the banner disappears temporarily.
- [ ] Reload and confirm the banner can reappear.
- [ ] Click “Don’t warn on this site”.
- [ ] Reload and confirm the banner is suppressed for that site.
- [ ] Reset dismissed sites in Settings.
- [ ] Confirm warnings can appear again after reset.

## Accessibility

- [ ] Use keyboard only to tab through popup controls.
- [ ] Use keyboard only to tab through options controls.
- [ ] Focus outlines are visible.
- [ ] Text is readable at normal browser zoom.
- [ ] Buttons have clear labels.
- [ ] No essential instruction relies only on colour.
- [ ] Warning copy avoids panic and fearmongering.

## Privacy and safety checks

- [ ] No API keys are required.
- [ ] No backend URL is configured.
- [ ] No analytics or telemetry is present.
- [ ] Permissions remain minimal.
- [ ] README, PRIVACY.md, and SAFETY.md match current behaviour.

## Removal

- [ ] Remove the extension from Chrome/Edge.
- [ ] Confirm it no longer appears in the toolbar.
- [ ] Reinstall cleanly if needed.
