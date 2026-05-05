import { DEFAULT_ACTIONS } from "./constants.js";
import { SCAM_SIGNAL_RULES, SHORTENED_URL_DOMAINS, SUSPICIOUS_DOMAIN_HINTS } from "./scamRules.js";
import { domainMatches, normalizeDomainList } from "./storage.js";

const URL_PATTERN = /\b(?:https?:\/\/|www\.)[^\s<>()"']+|\b[a-z0-9.-]+\.(?:com|co\.uk|org|net|info|top|xyz|click|shop|uk|online|site)(?:\/[^\s<>()"']*)?/gi;

export function analyseScamRisk(input, settings = {}) {
  const text = String(input || "").trim();
  const matchedSignals = [];
  const normalizedSettings = {
    ...settings,
    trustedDomains: normalizeDomainList(settings.trustedDomains),
    blockedDomains: normalizeDomainList(settings.blockedDomains),
  };

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

  matchedSignals.push(...detectSuspiciousUrls(text, normalizedSettings));

  const rawScore = matchedSignals.reduce((sum, signal) => sum + signal.weight, 0);
  const comboBonus = getCombinationBonus(matchedSignals);
  const trustedDomainAdjustment = getTrustedDomainAdjustment(text, matchedSignals, normalizedSettings);
  const score = Math.max(0, Math.min(100, rawScore + comboBonus + trustedDomainAdjustment));
  const riskLevel = getRiskLevel(score, normalizedSettings.sensitivity || "normal");

  return {
    riskLevel,
    score,
    matchedSignals,
    explanation: buildExplanation(riskLevel, matchedSignals, trustedDomainAdjustment),
    recommendedActions: buildRecommendedActions(riskLevel, normalizedSettings),
  };
}

export const analyzeScamRisk = analyseScamRisk;

export function extractUrls(input) {
  return Array.from(String(input || "").matchAll(URL_PATTERN)).map((match) => cleanUrl(match[0]));
}

export function detectSuspiciousUrls(input, settings = {}) {
  const urls = extractUrls(input);
  const signals = [];
  const seen = new Set();
  const trustedDomains = normalizeDomainList(settings.trustedDomains);
  const blockedDomains = normalizeDomainList(settings.blockedDomains);

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

    if (domainMatches(hostname, blockedDomains)) {
      addSignalOnce(signals, seen, {
        id: `url-blocked-domain-${hostname}`,
        category: "Blocked site",
        label: "Link matches your blocked sites list",
        evidence: hostname,
        weight: 42,
        explanation: "This domain is on your local blocked list.",
      });
    }

    if (domainMatches(hostname, trustedDomains)) {
      addSignalOnce(signals, seen, {
        id: `url-trusted-domain-${hostname}`,
        category: "Trusted site",
        label: "Link matches your trusted sites list",
        evidence: hostname,
        weight: -12,
        explanation: "This domain is on your local trusted list. This does not guarantee the message is safe.",
      });
    }

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

export function shouldSuppressPageWarning(hostname, settings = {}) {
  const trustedDomains = normalizeDomainList(settings.trustedDomains);
  const dismissedWarningSites = normalizeDomainList(settings.dismissedWarningSites);
  return domainMatches(hostname, trustedDomains) || domainMatches(hostname, dismissedWarningSites);
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
  if (categories.has("Parcel scam") && categories.has("Link")) bonus += 8;
  if (categories.has("Bank code scam") && categories.has("Personal details")) bonus += 8;
  if (categories.size >= 4) bonus += 6;
  return bonus;
}

function getTrustedDomainAdjustment(text, signals, settings) {
  const hasTrustedDomain = signals.some((signal) => signal.category === "Trusted site");
  const hasBlockedDomain = signals.some((signal) => signal.category === "Blocked site");
  const highPressureSignals = signals.filter((signal) => signal.weight >= 18).length;

  if (hasBlockedDomain) return 0;
  if (!hasTrustedDomain) return 0;
  if (highPressureSignals >= 2) return -4;
  if (/\b(?:password|PIN|verification code|OTP|send money|gift card|crypto)\b/i.test(text)) return -4;
  return -10;
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

function buildExplanation(riskLevel, signals, trustedDomainAdjustment = 0) {
  if (signals.length === 0) {
    return "Silver Shield did not find obvious scam warning signs. This does not guarantee it is safe.";
  }

  const visibleSignals = signals.filter((signal) => signal.category !== "Trusted site");
  const labels = (visibleSignals.length ? visibleSignals : signals).slice(0, 4).map((signal) => signal.label.toLowerCase());
  const summary = labels.join(", ");
  const trustedNote = trustedDomainAdjustment < 0 ? " A trusted domain reduced the score, but this is not a guarantee." : "";

  if (riskLevel === "high") {
    return `Silver Shield found high risk signs: ${summary}. Treat this carefully and verify through a trusted route.${trustedNote}`;
  }

  if (riskLevel === "caution") {
    return `Silver Shield found warning signs: ${summary}. Check before clicking, replying, or sending anything.${trustedNote}`;
  }

  return `Silver Shield found a small number of warning signs: ${summary}. Stay cautious and verify if anything feels unusual.${trustedNote}`;
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
