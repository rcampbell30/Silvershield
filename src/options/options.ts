import { getSettings, saveSettings } from "../shared/storage.js";

const form = document.getElementById("settings-form");
const trustedName = document.getElementById("trusted-name");
const trustedContact = document.getElementById("trusted-contact");
const sensitivity = document.getElementById("sensitivity");
const warningBanners = document.getElementById("warning-banners");
const emergencyHelp = document.getElementById("emergency-help");
const saveStatus = document.getElementById("save-status");

loadSettings();
form.addEventListener("submit", handleSubmit);

async function loadSettings() {
  const settings = await getSettings();
  trustedName.value = settings.trustedContactName;
  trustedContact.value = settings.trustedContactContact;
  sensitivity.value = settings.sensitivity;
  warningBanners.checked = settings.warningBannersEnabled;
  emergencyHelp.value = settings.emergencyHelpText;
}

async function handleSubmit(event) {
  event.preventDefault();

  await saveSettings({
    trustedContactName: trustedName.value.trim(),
    trustedContactContact: trustedContact.value.trim(),
    sensitivity: sensitivity.value,
    warningBannersEnabled: warningBanners.checked,
    emergencyHelpText: emergencyHelp.value.trim(),
  });

  saveStatus.textContent = "Settings saved on this browser.";
  window.setTimeout(() => {
    saveStatus.textContent = "";
  }, 3000);
}
