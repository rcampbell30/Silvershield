import { analyseScamRisk, shouldSuppressPageWarning } from "../shared/riskScoring.js";
import { getSettings } from "../shared/storage.js";
import { showWarningBanner } from "./warningBanner.js";

const MAX_PAGE_TEXT_CHARS = 12000;
const MIN_TEXT_CHARS = 80;

main().catch(() => {
  // Content scripts should fail quietly and never break the page.
});

async function main() {
  const settings = await getSettings();
  if (!settings.warningBannersEnabled) return;
  if (shouldSuppressPageWarning(location.hostname, settings)) return;

  const pageText = getVisiblePageText();
  const checkedText = `${location.href}\n\n${pageText}`;
  const analysis = analyseScamRisk(checkedText, settings);

  if (analysis.riskLevel === "high") {
    showWarningBanner(analysis, { hostname: location.hostname });
  }
}

function getVisiblePageText() {
  const text = document.body?.innerText || "";
  if (text.trim().length < MIN_TEXT_CHARS) {
    return document.title || "";
  }
  return text.replace(/\s+/g, " ").trim().slice(0, MAX_PAGE_TEXT_CHARS);
}
