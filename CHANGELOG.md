# Changelog

## 0.1.0 - Local tester MVP

Initial Silver Shield browser extension MVP.

### Added

- Chrome/Edge-compatible Manifest V3 extension.
- Popup checker for suspicious messages, emails, SMS content, and links.
- Deterministic local scam-risk analyser.
- Risk levels: Likely safe, Be careful, High risk signs found.
- Plain-English matched warning signs and recommended actions.
- Content-script page warning banner.
- First-install onboarding flow.
- Family setup fields:
  - protected person name,
  - installer relationship,
  - trusted contact name,
  - trusted contact phone/email.
- Local settings using `chrome.storage.local`.
- Local history with short previews only.
- Trusted domains.
- Blocked domains.
- Per-site banner dismissal.
- Reset for dismissed-site choices.
- UK-focused scam rules for:
  - Royal Mail / Evri / DPD parcel scams,
  - HMRC refund scams,
  - DVLA penalty scams,
  - NHS payment or appointment scams,
  - bank OTP / verification code scams,
  - WhatsApp-style family scams,
  - Microsoft support / remote access scams,
  - investment and crypto pressure.
- Local demo page with copyable fake examples.
- Privacy, safety, QA, and tester documentation.
- Package script to build a ZIP for local testing.

### Not included

- No backend.
- No accounts.
- No telemetry.
- No payments.
- No AI API calls.
- No real trusted-contact messaging.
- No Safari/iOS build yet.
