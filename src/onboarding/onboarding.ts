import { getSettings, markOnboardingCompleted, saveSettings } from "../shared/storage.js";

const form = document.getElementById("onboarding-form");
const protectedPersonName = document.getElementById("protected-person-name");
const installerRelationship = document.getElementById("installer-relationship");
const trustedContactName = document.getElementById("trusted-contact-name");
const trustedContactContact = document.getElementById("trusted-contact-contact");
const sensitivity = document.getElementById("sensitivity");
const warningBanners = document.getElementById("warning-banners");
const skipButton = document.getElementById("skip-button");
const status = document.getElementById("status");

loadExistingSettings();
form.addEventListener("submit", handleSubmit);
skipButton.addEventListener("click", handleSkip);

async function loadExistingSettings() {
  const settings = await getSettings();
  protectedPersonName.value = settings.protectedPersonName;
  installerRelationship.value = settings.installerRelationship;
  trustedContactName.value = settings.trustedContactName;
  trustedContactContact.value = settings.trustedContactContact;
  sensitivity.value = settings.sensitivity;
  warningBanners.checked = settings.warningBannersEnabled;
}

async function handleSubmit(event) {
  event.preventDefault();

  await saveSettings({
    protectedPersonName: protectedPersonName.value.trim(),
    installerRelationship: installerRelationship.value.trim(),
    trustedContactName: trustedContactName.value.trim(),
    trustedContactContact: trustedContactContact.value.trim(),
    sensitivity: sensitivity.value,
    warningBannersEnabled: warningBanners.checked,
    onboardingCompleted: true,
  });

  status.textContent = "Setup saved. You can now use Silver Shield from the browser toolbar.";
  window.setTimeout(() => {
    chrome.runtime.openOptionsPage();
  }, 900);
}

async function handleSkip() {
  await markOnboardingCompleted();
  status.textContent = "Setup skipped for now. You can finish it later in Settings.";
  window.setTimeout(() => {
    chrome.runtime.openOptionsPage();
  }, 900);
}
