# Silver Shield Tester Guide

This guide is for family testers using Chrome or Edge on a desktop or laptop.

## What Silver Shield is

Silver Shield is a browser extension that gives scam warning signs in plain English.

It can help check:

- suspicious emails,
- text messages copied from a phone,
- website links,
- messages asking for money,
- messages asking for passwords, PINs, or verification codes.

## What Silver Shield is not

Silver Shield is not a guarantee. It cannot prove that something is safe or definitely a scam.

When in doubt, ask someone you trust or contact the organisation directly using a phone number or website you already know is genuine.

## How to install for testing

1. Ask the project owner for the Silver Shield ZIP file or `dist` folder.
2. Unzip the file if needed.
3. Open Chrome or Edge.
4. Go to:
   - Chrome: `chrome://extensions`
   - Edge: `edge://extensions`
5. Turn on Developer Mode.
6. Click **Load unpacked**.
7. Choose the `dist` folder.
8. Silver Shield should appear in your extensions.

## How to pin Silver Shield

1. Click the puzzle-piece/extensions icon in the browser toolbar.
2. Find **Silver Shield**.
3. Click the pin icon next to it.
4. The Silver Shield icon should appear in the toolbar.

## How to check a suspicious message

1. Copy the suspicious message, email, SMS, or link.
2. Click the Silver Shield icon in the toolbar.
3. Paste the text into the box.
4. Click **Check for scam signs**.
5. Read the result and next steps.

Silver Shield may show:

- **Likely safe** — no obvious warning signs found.
- **Be careful** — some warning signs found.
- **High risk signs found** — strong scam-like warning signs found.

## Important safety rules

Never share:

- passwords,
- bank details,
- PINs,
- one-time passcodes,
- verification codes.

Do not send money because of an urgent message without checking with someone you trust.

## What to test

Try checking messages that mention:

- parcel delivery fees,
- HMRC refunds,
- bank verification codes,
- a family member with a new phone number,
- Microsoft support or remote access,
- crypto or guaranteed investment returns.

The repo includes a local demo page at `demo/demo.html` with fake examples.

## What feedback to give

Please note:

- Did the result make sense?
- Was the text easy to read?
- Were the next steps clear?
- Did anything feel too scary or confusing?
- Did the warning banner get in the way?
- Did the extension miss anything obvious?
- Did it warn too often?

## How to remove Silver Shield

1. Open `chrome://extensions` or `edge://extensions`.
2. Find **Silver Shield**.
3. Click **Remove**.
4. Confirm removal.
