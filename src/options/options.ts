import { clearDismissedWarningSites, getSettings, normalizeDomainList, saveSettings } from "../shared/storage.js";

const form = document.getElementById("settings-form");
const protectedPersonName = document.getElementById("protected-person-name");
const installerRelationship = document.getElementById("installer-relationship");
const trustedName = document.getElementById("trusted-name");
const trustedContact = document.getElementById("trusted-contact");
const sensitivity = document.getElementById("sensitivity");
const warningBanners = document.getElementById("warning-banners");
const trustedDomains = document.getElementById("trusted-domains");
const blockedDomains = document.getElementById("blocked-domains");
const emergencyHelp = document.getElementById("emergency-help");
const saveStatus = document.getElementById("save-status");
const openOnboardingButton = document.getElementById("open-onboarding");
const clearDismissedSitesButton = document.getElementById("clear-dismissed-sites");

loadSettings();
form.addEventListener("submit", handleSubmit);
openOnboardingButton.addEventListener("click", openOnboarding);
clearDismissedSitesButton.addEventListener("click", handleClearDismissedSites);

async function loadSettings() {
  const settings = await getSettings();
  protectedPersonName.value = settings.protectedPersonName;
  installerRelationship.value = settings.installerRelationship;
  trustedName.value = settings.trustedContactName;
  trustedContact.value = settings.trustedContactContact;
  sensitivity.value = settings.sensitivity;
  warningBanners.checked = settings.warningBannersEnabled;
  trustedDomains.value = settings.trustedDomains.join("\n");
  blockedDomains.value = settings.blockedDomains.join("\n");
  emergencyHelp.value = settings.emergencyHelpText;
}

async function handleSubmit(event) {
  event.preventDefault();

  await saveSettings({
    protectedPersonName: protectedPersonName.value.trim(),
    installerRelationship: installerRelationship.value.trim(),
    trustedContactName: trustedName.value.trim(),
    trustedContactContact: trustedContact.value.trim(),
    sensitivity: sensitivity.value,
    warningBannersEnabled: warningBanners.checked,
    trustedDomains: normalizeDomainList(trustedDomains.value),
    blockedDomains: normalizeDomainList(blockedDomains.value),
    emergencyHelpText: emergencyHelp.value.trim(),
    onboardingCompleted: true,
  });

  showStatus("Settings saved on this browser.");
}

async function handleClearDismissedSites() {
  await clearDismissedWarningSites();
  showStatus("Dismissed site warning choices have been reset.");
}

function openOnboarding() {
  chrome.runtime.sendMessage({ type: "OPEN_ONBOARDING" }, () => {
    if (chrome.runtime.lastError) {
      window.location.href = chrome.runtime.getURL("onboarding/onboarding.html");
    }
  });
}

function showStatus(message) {
  saveStatus.textContent = message;
  window.setTimeout(() => {
    saveStatus.textContent = "";
  }, 3000);
}
