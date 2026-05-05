import { DEFAULT_SETTINGS, HISTORY_PREVIEW_LENGTH, MAX_HISTORY_ITEMS, STORAGE_KEYS } from "./constants.js";

export async function getSettings() {
  const result = await chrome.storage.local.get(STORAGE_KEYS.settings);
  return normalizeSettings(result[STORAGE_KEYS.settings]);
}

export async function saveSettings(settings) {
  const normalized = normalizeSettings(settings);
  await chrome.storage.local.set({ [STORAGE_KEYS.settings]: normalized });
  return normalized;
}

export async function getHistory() {
  const result = await chrome.storage.local.get(STORAGE_KEYS.history);
  return Array.isArray(result[STORAGE_KEYS.history]) ? result[STORAGE_KEYS.history] : [];
}

export async function addHistoryItem(input, analysis) {
  const existing = await getHistory();
  const item = {
    id: String(Date.now()),
    checkedAt: new Date().toISOString(),
    riskLevel: analysis.riskLevel,
    score: analysis.score,
    preview: makePreview(input),
    matchedSignalCount: analysis.matchedSignals.length,
  };

  const nextHistory = [item, ...existing].slice(0, MAX_HISTORY_ITEMS);
  await chrome.storage.local.set({ [STORAGE_KEYS.history]: nextHistory });
  return nextHistory;
}

export async function clearHistory() {
  await chrome.storage.local.set({ [STORAGE_KEYS.history]: [] });
}

export function normalizeSettings(settings = {}) {
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    sensitivity: ["low", "normal", "high"].includes(settings.sensitivity) ? settings.sensitivity : DEFAULT_SETTINGS.sensitivity,
    warningBannersEnabled:
      typeof settings.warningBannersEnabled === "boolean"
        ? settings.warningBannersEnabled
        : DEFAULT_SETTINGS.warningBannersEnabled,
  };
}

export function makePreview(input) {
  const text = String(input || "").replace(/\s+/g, " ").trim();
  if (text.length <= HISTORY_PREVIEW_LENGTH) return text;
  return `${text.slice(0, HISTORY_PREVIEW_LENGTH - 1)}…`;
}
