import { getSettings, saveSettings } from "../shared/storage.js";

const form = document.getElementById("settings-form");
const protectedPersonName = document.getElementById("protected-person-name");
const installerRelationship = document.getElementById("installer-relationship");
const trustedName = document.getElementById("trusted-name");
const trustedContact = document.getElementById("trusted-contact");
const sensitivity = document.getElementById("sensitivity");
const warningBanners = document.getElementById("warning-banners");
const emergencyHelp = document.getElementById("emergency-help");
const saveStatus = document.getElementById("save-status");
const openOnboardingButton = document.getElementById("open-onboarding");

loadSettings();
form.addEventListener("submit", handleSubmit);
openOnboardingButton.addEventListener("click", openOnboarding);

async function loadSettings() {
  const settings = await getSettings();
  protectedPersonName.value = settings.protectedPersonName;
  installerRelationship.value = settings.installerRelationship;
  trustedName.value = settings.trustedContactName;
  trustedContact.value = settings.trustedContactContact;
  sensitivity.value = settings.sensitivity;
  warningBanners.checked = settings.warningBannersEnabled;
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
    emergencyHelpText: emergencyHelp.value.trim(),
    onboardingCompleted: true,
  });

  saveStatus.textContent = "Settings saved on this browser.";
  window.setTimeout(() => {
    saveStatus.textContent = "";
  }, 3000);
}

function openOnboarding() {
  chrome.runtime.sendMessage({ type: "OPEN_ONBOARDING" }, () => {
    if (chrome.runtime.lastError) {
      window.location.href = chrome.runtime.getURL("onboarding/onboarding.html");
    }
  });
}
