# Silver Shield Screenshot Plan

Use this plan to capture clean store screenshots.

## General rules

- Use dummy/fake data only.
- Do not show real messages, phone numbers, emails, bank details, or passwords.
- Use the fake examples in `demo/demo.html`.
- Use browser zoom at 100% unless a store screenshot requires another size.
- Use a clean desktop background.
- Hide unrelated tabs.
- Keep the extension pinned in the toolbar.

## Screenshot set

### 1. Popup checker - empty state

Show:

- Silver Shield header.
- Privacy note.
- Empty paste box.
- Check button.

Purpose:

Shows simple, calm UI.

### 2. Popup checker - high risk

Paste:

```txt
Royal Mail: Your parcel is waiting. Pay a small redelivery fee within 24 hours to avoid return: http://royal-mail-fee.top/claim
```

Show:

- High risk signs found.
- Reasons.
- Next steps.
- Trusted contact recommendation if configured.

### 3. Popup checker - likely safe

Paste:

```txt
Hi, just checking we are still meeting for lunch at 1pm tomorrow. I will bring the book you asked for.
```

Show:

- Likely safe.
- Careful disclaimer.

### 4. Onboarding page

Show:

- Hero image.
- Pin Silver Shield instruction.
- Family setup fields.
- Privacy promise.

Use dummy names only.

### 5. Options page

Show:

- Trusted contact setup.
- Warning sensitivity.
- Trusted domains.
- Blocked domains.
- Reset dismissed sites button.

Use dummy data:

```txt
Protected person: Mum
Trusted contact: Sarah
Trusted domains: gov.uk, nhs.uk
Blocked domains: known-bad-site.top
```

### 6. Page warning banner

Use a local safe test page with fake high-risk text.

Show:

- Silver Shield warning banner.
- Why button expanded.
- Dismiss once.
- Don’t warn on this site.

### 7. Demo page

Show:

- Fake scam examples.
- Copy buttons.
- Clear “local demo content” label.

### 8. Printable family safety checklist

Open:

```txt
docs/family-safety-checklist.html
```

Show:

- Large readable checklist.
- Emergency guidance.

## Recommended final store image story

1. “Paste a suspicious message.”
2. “See warning signs in plain English.”
3. “Get calm next steps.”
4. “Add a trusted contact.”
5. “Use page warning banners.”
6. “Privacy-first local checks.”

## Avoid screenshots that show

- Real bank websites.
- Real scam websites.
- Real personal messages.
- Real phone numbers or emails.
- Any claim that Silver Shield guarantees protection.
