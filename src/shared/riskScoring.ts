import { DEFAULT_ACTIONS } from "./constants.js";
import { SCAM_SIGNAL_RULES, SHORTENED_URL_DOMAINS, SUSPICIOUS_DOMAIN_HINTS } from "./scamRules.js";

const URL_PATTERN = /\b(?:https?:\/\/|www\.)[^\s<>()"']+|\b[a-z0-9.-]+\.(?:com|co\.uk|org|net|info|top|xyz|click|shop|uk|online|site)(?:\/[^\s<>()"']*)?/gi;

export function analyseScamRisk(input, settings = {}) {
  const text = String(input || "").trim();
  const matchedSignals = [];

  if (!text) {
    return {
      riskLevel: "safe",
      score: 0,
      matchedSignals,
      explanation: "No text was entered, so Silver Shield could not check for warning signs.",
      recommendedActions: ["Paste the message, email, SMS, or link you want to check."],
    };
  }

  for (const rule of SCAM_SIGNAL_RULES) {
    const evidence = findFirstEvidence(text, rule.patterns);
    if (evidence) {
      matchedSignals.push({
        id: rule.id,
        category: rule.category,
        label: rule.label,
        evidence,
        weight: rule.weight,
        explanation: rule.explanation,
      });
    }
  }

  matchedSignals.push(...detectSuspiciousUrls(text));

  const rawScore = matchedSignals.reduce((sum, signal) => sum + signal.weight, 0);
  const comboBonus = getCombinationBonus(matchedSignals);
  const score = Math.min(100, rawScore + comboBonus);
  const riskLevel = getRiskLevel(score, settings.sensitivity || "normal");

  return {
    riskLevel,
    score,
    matchedSignals,
    explanation: buildExplanation(riskLevel, matchedSignals),
    recommendedActions: buildRecommendedActions(riskLevel, settings),
  };
}

export const analyzeScamRisk = analyseScamRisk;

export function extractUrls(input) {
  return Array.from(String(input || "").matchAll(URL_PATTERN)).map((match) => cleanUrl(match[0]));
}

export function detectSuspiciousUrls(input) {
  const urls = extractUrls(input);
  const signals = [];
  const seen = new Set();

  for (const rawUrl of urls) {
    const url = toUrl(rawUrl);
    if (!url) continue;

    const hostname = url.hostname.replace(/^www\./i, "").toLowerCase();

    addSignalOnce(signals, seen, {
      id: `url-found-${hostname}`,
      category: "Link",
      label: "Message includes a link",
      evidence: rawUrl,
      weight: 4,
      explanation: "Links in unexpected messages should be checked before clicking.",
    });

    if (url.protocol !== "https:") {
      addSignalOnce(signals, seen, {
        id: `url-non-https-${hostname}`,
        category: "Link",
        label: "Link does not use HTTPS",
        evidence: rawUrl,
        weight: 14,
        explanation: "Non-HTTPS links are easier to tamper with and should be treated carefully.",
      });
    }

    if (SHORTENED_URL_DOMAINS.has(hostname)) {
      addSignalOnce(signals, seen, {
        id: `url-shortener-${hostname}`,
        category: "Link",
        label: "Shortened link hides the real destination",
        evidence: rawUrl,
        weight: 16,
        explanation: "Shortened links make it harder to see where you are being sent.",
      });
    }

    if (hostname.includes("xn--")) {
      addSignalOnce(signals, seen, {
        id: `url-punycode-${hostname}`,
        category: "Link",
        label: "Domain may use lookalike characters",
        evidence: rawUrl,
        weight: 20,
        explanation: "Some scam sites use lookalike characters to imitate trusted brands.",
      });
    }

    if (rawUrl.includes("@")) {
      addSignalOnce(signals, seen, {
        id: `url-at-symbol-${hostname}`,
        category: "Link",
        label: "Link contains an unusual @ symbol",
        evidence: rawUrl,
        weight: 18,
        explanation: "Links with @ symbols can disguise where they really go.",
      });
    }

    for (const hint of SUSPICIOUS_DOMAIN_HINTS) {
      if (hint.pattern.test(hostname)) {
        addSignalOnce(signals, seen, {
          id: `url-domain-hint-${hint.label}`,
          category: "Link",
          label: hint.label,
          evidence: hostname,
          weight: 14,
          explanation: "The link looks like it may be imitating a trusted service.",
        });
      }
    }
  }

  return signals;
}

function findFirstEvidence(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return "";
}

function cleanUrl(url) {
  return url.replace(/[.,;:!?)]*$/g, "");
}

function toUrl(rawUrl) {
  try {
    const value = rawUrl.startsWith("http://") || rawUrl.startsWith("https://") ? rawUrl : `https://${rawUrl}`;
    return new URL(value);
  } catch {
    return null;
  }
}

function addSignalOnce(signals, seen, signal) {
  if (seen.has(signal.id)) return;
  seen.add(signal.id);
  signals.push(signal);
}

function getCombinationBonus(signals) {
  const categories = new Set(signals.map((signal) => signal.category));
  let bonus = 0;
  if (categories.has("Money pressure") && categories.has("Urgency")) bonus += 10;
  if (categories.has("Personal details") && categories.has("Impersonation")) bonus += 10;
  if (categories.has("Link") && categories.has("Prize or refund hook")) bonus += 8;
  if (categories.has("Emotional pressure") && categories.has("Money pressure")) bonus += 8;
  if (categories.size >= 4) bonus += 6;
  return bonus;
}

function getRiskLevel(score, sensitivity) {
  const thresholds = {
    low: { caution: 35, high: 75 },
    normal: { caution: 25, high: 60 },
    high: { caution: 15, high: 45 },
  }[sensitivity] || { caution: 25, high: 60 };

  if (score >= thresholds.high) return "high";
  if (score >= thresholds.caution) return "caution";
  return "safe";
}

function buildExplanation(riskLevel, signals) {
  if (signals.length === 0) {
    return "Silver Shield did not find obvious scam warning signs. This does not guarantee it is safe.";
  }

  const labels = signals.slice(0, 4).map((signal) => signal.label.toLowerCase());
  const summary = labels.join(", ");

  if (riskLevel === "high") {
    return `Silver Shield found high risk signs: ${summary}. Treat this carefully and verify through a trusted route.`;
  }

  if (riskLevel === "caution") {
    return `Silver Shield found warning signs: ${summary}. Check before clicking, replying, or sending anything.`;
  }

  return `Silver Shield found a small number of warning signs: ${summary}. Stay cautious and verify if anything feels unusual.`;
}

function buildRecommendedActions(riskLevel, settings) {
  const trustedName = (settings.trustedContactName || "").trim();
  const actions = [];

  if (riskLevel === "safe") {
    actions.push("Still avoid sharing passwords, bank details, or verification codes.");
    actions.push("Contact the organisation directly if anything feels unusual.");
    return actions;
  }

  actions.push(...DEFAULT_ACTIONS);

  if (trustedName) {
    actions.unshift(`Ask ${trustedName} before continuing.`);
  }

  return Array.from(new Set(actions));
}
