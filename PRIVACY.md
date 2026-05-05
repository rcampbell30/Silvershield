# Silver Shield Privacy

Silver Shield v0.1.0 is a local-first browser extension MVP.

## Summary

Silver Shield checks scam warning signs locally in the browser. In this version, checked messages, page text, settings, and history are not sent to a server.

## What is checked locally

Silver Shield may locally analyse:

- Text pasted into the popup checker.
- Links pasted into the popup checker.
- Visible page text when page warning banners are enabled.
- The current page URL/hostname for local trusted or blocked domain checks.

## What is stored locally

Silver Shield uses `chrome.storage.local` to store:

- Trusted contact name.
- Trusted contact phone or email.
- Protected person name.
- Installer relationship.
- Warning sensitivity.
- Whether page warning banners are enabled.
- Trusted domains.
- Blocked domains.
- Sites where warning banners were dismissed.
- Recent check history containing:
  - date/time,
  - risk level,
  - score,
  - number of matched warning signs,
  - a short preview of the checked text.

## What is not stored by default

Silver Shield does not store the full pasted message in history by default. It stores only a short preview so users can recognise the check later.

## What is not collected

Silver Shield v0.1.0 does not collect, send, sell, or share:

- Full pasted messages.
- Full page text.
- Browsing history.
- Bank details.
- Passwords.
- PINs.
- Verification codes.
- Analytics or telemetry.
- Account details.

## No backend in this MVP

There is no Silver Shield server in this MVP. There are no accounts, payments, analytics, AI API calls, or telemetry pipelines.

## Sensitive information warning

Users should avoid pasting passwords, bank details, PINs, one-time passcodes, or verification codes into Silver Shield or any other tool.

## Future AI checking

Future optional AI checking would require:

- explicit user consent,
- clear explanation of what would be sent,
- a way to avoid sending sensitive content,
- strong data-handling rules,
- an option to keep using local-only checking.

AI checking is not part of v0.1.0.

## Removing local data

Users can remove Silver Shield data by:

1. Opening the extension settings and clearing history / reset dismissed sites where available.
2. Removing the extension from Chrome or Edge.
3. Clearing browser extension storage if needed through browser developer tools.
