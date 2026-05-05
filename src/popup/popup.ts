import { RISK_LEVEL_LABELS } from "../shared/constants.js";
import { analyseScamRisk } from "../shared/riskScoring.js";
import { addHistoryItem, clearHistory, getHistory, getSettings } from "../shared/storage.js";

const input = document.getElementById("scam-input");
const checkButton = document.getElementById("check-button");
const resultCard = document.getElementById("result-card");
const resultBadge = document.getElementById("result-badge");
const resultScore = document.getElementById("result-score");
const resultExplanation = document.getElementById("result-explanation");
const signalsWrap = document.getElementById("signals-wrap");
const signalsList = document.getElementById("signals-list");
const actionsList = document.getElementById("actions-list");
const historyList = document.getElementById("history-list");
const clearHistoryButton = document.getElementById("clear-history");
const optionsButton = document.getElementById("options-button");

checkButton.addEventListener("click", handleCheck);
clearHistoryButton.addEventListener("click", handleClearHistory);
optionsButton.addEventListener("click", () => chrome.runtime.openOptionsPage());

document.addEventListener("DOMContentLoaded", renderHistory);
renderHistory();

async function handleCheck() {
  const value = input.value.trim();
  const settings = await getSettings();
  const analysis = analyseScamRisk(value, settings);
  renderResult(analysis);

  if (value) {
    await addHistoryItem(value, analysis);
    await renderHistory();
  }
}

function renderResult(analysis) {
  resultCard.hidden = false;
  resultBadge.textContent = RISK_LEVEL_LABELS[analysis.riskLevel];
  resultBadge.className = `result-badge ${analysis.riskLevel}`;
  resultScore.textContent = `${analysis.score}/100`;
  resultExplanation.textContent = analysis.explanation;

  signalsList.innerHTML = "";
  signalsWrap.hidden = analysis.matchedSignals.length === 0;

  for (const signal of analysis.matchedSignals) {
    const item = document.createElement("li");
    item.innerHTML = `<strong>${escapeHtml(signal.label)}</strong><span class="signal-evidence">${escapeHtml(signal.explanation)}</span>`;
    signalsList.appendChild(item);
  }

  actionsList.innerHTML = "";
  for (const action of analysis.recommendedActions) {
    const item = document.createElement("li");
    item.textContent = action;
    actionsList.appendChild(item);
  }
}

async function renderHistory() {
  const history = await getHistory();
  historyList.innerHTML = "";

  if (!history.length) {
    const empty = document.createElement("li");
    empty.textContent = "No recent checks yet.";
    historyList.appendChild(empty);
    return;
  }

  for (const item of history) {
    const row = document.createElement("li");
    const date = new Date(item.checkedAt);
    row.innerHTML = `
      <strong>${escapeHtml(RISK_LEVEL_LABELS[item.riskLevel] || item.riskLevel)}</strong>
      <span>${escapeHtml(item.preview || "No preview saved")}</span>
      <span class="history-meta">${date.toLocaleString()} · ${item.matchedSignalCount} warning sign(s)</span>
    `;
    historyList.appendChild(row);
  }
}

async function handleClearHistory() {
  await clearHistory();
  await renderHistory();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
