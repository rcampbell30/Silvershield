import { DEFAULT_SETTINGS, STORAGE_KEYS } from "../shared/constants.js";
import { normalizeSettings } from "../shared/storage.js";

chrome.runtime.onInstalled.addListener(async (details) => {
  const existing = await chrome.storage.local.get(STORAGE_KEYS.settings);
  const settings = existing[STORAGE_KEYS.settings]
    ? normalizeSettings(existing[STORAGE_KEYS.settings])
    : DEFAULT_SETTINGS;

  await chrome.storage.local.set({ [STORAGE_KEYS.settings]: settings });

  if (details.reason === "install" && !settings.onboardingCompleted) {
    await openOnboardingPage();
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "OPEN_SILVER_SHIELD") {
    openSilverShield().then(
      () => sendResponse({ ok: true }),
      (error) => sendResponse({ ok: false, error: String(error) }),
    );
    return true;
  }

  if (message?.type === "OPEN_ONBOARDING") {
    openOnboardingPage().then(
      () => sendResponse({ ok: true }),
      (error) => sendResponse({ ok: false, error: String(error) }),
    );
    return true;
  }

  return false;
});

async function openSilverShield() {
  if (chrome.action?.openPopup) {
    try {
      await chrome.action.openPopup();
      return;
    } catch {
      // Some browsers only allow openPopup in limited user-gesture contexts.
    }
  }

  await chrome.runtime.openOptionsPage();
}

async function openOnboardingPage() {
  const onboardingUrl = chrome.runtime.getURL("onboarding/onboarding.html");

  if (chrome.tabs?.create) {
    try {
      await chrome.tabs.create({ url: onboardingUrl });
      return;
    } catch {
      // Fallback below keeps the extension usable if tabs.create is unavailable.
    }
  }

  await chrome.runtime.openOptionsPage();
}
