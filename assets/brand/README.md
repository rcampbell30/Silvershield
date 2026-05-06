# Silver Shield brand assets

Put the generated brand PNGs in this folder before running `npm run build`.

Recommended files:

```txt
assets/brand/silver-shield-icon.png
assets/brand/onboarding-hero.png
```

Optional exact-size extension icons:

```txt
assets/brand/icons/icon-16.png
assets/brand/icons/icon-32.png
assets/brand/icons/icon-48.png
assets/brand/icons/icon-128.png
```

Build behaviour:

- If exact-size icons exist, the build copies those into `dist/icons/`.
- If exact-size icons are missing but `silver-shield-icon.png` exists, the build uses that image for all extension icon slots.
- If no brand icon exists, the build falls back to the small generated placeholder icon.
- If `onboarding-hero.png` exists, it is copied into `dist/assets/brand/` and shown on the onboarding page.

For best Chrome/Edge results, use square PNG icons and keep important details clear at small sizes.
