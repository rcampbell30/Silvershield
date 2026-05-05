import { DEFAULT_SETTINGS, HISTORY_PREVIEW_LENGTH, MAX_DOMAIN_LIST_ITEMS, MAX_HISTORY_ITEMS, STORAGE_KEYS } from "./constants.js";

export async function getSettings() {
  const result = await chrome.storage.local.get(STORAGE_KEYS.settings);
  return normalizeSettings(result[STORAGE_KEYS.settings]);
}

export async function saveSettings(settings) {
  const normalized = normalizeSettings(settings);
  await chrome.storage.local.set({ [STORAGE_KEYS.settings]: normalized });
  return normalized;
}

export async function markOnboardingCompleted() {
  const settings = await getSettings();
  return saveSettings({ ...settings, onboardingCompleted: true });
}

export async function dismissSiteWarnings(hostname) {
  const settings = await getSettings();
  const domain = normalizeDomain(hostname);
  if (!domain) return settings;

  return saveSettings({
    ...settings,
    dismissedWarningSites: uniqueDomainList([domain, ...settings.dismissedWarningSites]),
  });
}

export async function clearDismissedWarningSites() {
  const settings = await getSettings();
  return saveSettings({ ...settings, dismissedWarningSites: [] });
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
    trustedContactName: String(settings.trustedContactName || DEFAULT_SETTINGS.trustedContactName),
    trustedContactContact: String(settings.trustedContactContact || DEFAULT_SETTINGS.trustedContactContact),
    protectedPersonName: String(settings.protectedPersonName || DEFAULT_SETTINGS.protectedPersonName),
    installerRelationship: String(settings.installerRelationship || DEFAULT_SETTINGS.installerRelationship),
    emergencyHelpText: String(settings.emergencyHelpText || DEFAULT_SETTINGS.emergencyHelpText),
    trustedDomains: normalizeDomainList(settings.trustedDomains),
    blockedDomains: normalizeDomainList(settings.blockedDomains),
    dismissedWarningSites: normalizeDomainList(settings.dismissedWarningSites),
    onboardingCompleted:
      typeof settings.onboardingCompleted === "boolean"
        ? settings.onboardingCompleted
        : DEFAULT_SETTINGS.onboardingCompleted,
    sensitivity: ["low", "normal", "high"].includes(settings.sensitivity) ? settings.sensitivity : DEFAULT_SETTINGS.sensitivity,
    warningBannersEnabled:
      typeof settings.warningBannersEnabled === "boolean"
        ? settings.warningBannersEnabled
        : DEFAULT_SETTINGS.warningBannersEnabled,
  };
}

export function normalizeDomainList(value) {
  if (Array.isArray(value)) return uniqueDomainList(value);
  if (typeof value === "string") return uniqueDomainList(value.split(/[\n,]/));
  return [];
}

export function uniqueDomainList(domains) {
  return Array.from(new Set(domains.map(normalizeDomain).filter(Boolean))).slice(0, MAX_DOMAIN_LIST_ITEMS);
}

export function normalizeDomain(value) {
  const trimmed = String(value || "").trim().toLowerCase();
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return trimmed
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0]
      .replace(/[^a-z0-9.-]/g, "");
  }
}

export function domainMatches(hostname, domainList = []) {
  const normalized = normalizeDomain(hostname);
  return domainList.some((domain) => normalized === domain || normalized.endsWith(`.${domain}`));
}

export function makePreview(input) {
  const text = String(input || "").replace(/\s+/g, " ").trim();
  if (text.length <= HISTORY_PREVIEW_LENGTH) return text;
  return `${text.slice(0, HISTORY_PREVIEW_LENGTH - 1)}…`;
}
