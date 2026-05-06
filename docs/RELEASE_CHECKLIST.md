# Silver Shield Release Checklist

Use this checklist before submitting Silver Shield to a public extension store or sharing with external testers.

## Code and tests

- [ ] `git status` is clean.
- [ ] `git pull origin main` has been run.
- [ ] `npm install` succeeds.
- [ ] `npm run build` succeeds.
- [ ] `npm run test:rules` succeeds.
- [ ] `npm run package` succeeds.
- [ ] `packages/silver-shield-extension-v0.1.0.zip` exists.
- [ ] Extension reloads successfully in Chrome.
- [ ] Extension reloads successfully in Edge.

## Product QA

- [ ] Popup opens from toolbar.
- [ ] Onboarding opens on fresh install.
- [ ] User can complete family setup.
- [ ] User can pin the extension using the onboarding instructions.
- [ ] Options page saves settings.
- [ ] Trusted contact appears in high-risk next steps.
- [ ] Recent history stores short previews only.
- [ ] Clear history works.
- [ ] Trusted domains suppress page-warning noise.
- [ ] Blocked domains increase risk.
- [ ] Page warning banner appears on high-risk pages.
- [ ] Dismiss once works.
- [ ] Don’t warn on this site works.
- [ ] Reset dismissed sites works.

## Rule QA

Run every fake example in `demo/demo.html`:

- [ ] Royal Mail parcel fee.
- [ ] HMRC refund.
- [ ] Bank verification code.
- [ ] WhatsApp-style family scam.
- [ ] Microsoft remote access scam.
- [ ] Crypto/investment pressure.
- [ ] Normal harmless message.

## Accessibility QA

- [ ] Popup is keyboard navigable.
- [ ] Options page is keyboard navigable.
- [ ] Onboarding is keyboard navigable.
- [ ] Focus outlines are visible.
- [ ] Text is readable.
- [ ] Colour is not the only source of meaning.
- [ ] Wording is calm and plain English.

## Store package QA

- [ ] ZIP contains `manifest.json` at root.
- [ ] ZIP contains built popup files.
- [ ] ZIP contains built options files.
- [ ] ZIP contains built onboarding files.
- [ ] ZIP contains built content script.
- [ ] ZIP contains built background service worker.
- [ ] ZIP contains icons.
- [ ] ZIP does not contain `node_modules`.
- [ ] ZIP does not contain `.env` files.
- [ ] ZIP does not contain unrelated local files.

## Store listing QA

- [ ] Short description is final.
- [ ] Long description is final.
- [ ] Store screenshots are exported.
- [ ] Promotional images are exported.
- [ ] Privacy policy URL is public.
- [ ] Support URL or support email is ready.
- [ ] Permission justification is ready.
- [ ] Data use answers are ready.
- [ ] No listing copy uses guarantee wording.

## Manual policy sanity check

Before submitting, manually check the latest store rules in the Chrome Web Store and Microsoft Edge Add-ons dashboards.

Confirm:

- [ ] Manifest V3 is accepted.
- [ ] Permission justifications are complete.
- [ ] Privacy disclosures match actual behaviour.
- [ ] Screenshots meet size requirements.
- [ ] Store asset dimensions are current.
- [ ] Developer account details are correct.
