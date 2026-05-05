import { DEFAULT_SETTINGS, STORAGE_KEYS } from "../shared/constants.js";
import { normalizeSettings } from "../shared/storage.js";

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get(STORAGE_KEYS.settings);
  if (!existing[STORAGE_KEYS.settings]) {
    await chrome.storage.local.set({ [STORAGE_KEYS.settings]: DEFAULT_SETTINGS });
  } else {
    await chrome.storage.local.set({
      [STORAGE_KEYS.settings]: normalizeSettings(existing[STORAGE_KEYS.settings]),
    });
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "OPEN_SILVER_SHIELD") return false;

  openSilverShield().then(
    () => sendResponse({ ok: true }),
    (error) => sendResponse({ ok: false, error: String(error) }),
  );

  return true;
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
