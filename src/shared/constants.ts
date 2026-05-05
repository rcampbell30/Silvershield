export const EXTENSION_NAME = "Silver Shield";

export const DEFAULT_SETTINGS = {
  trustedContactName: "",
  trustedContactContact: "",
  protectedPersonName: "",
  installerRelationship: "",
  sensitivity: "normal",
  warningBannersEnabled: true,
  onboardingCompleted: false,
  trustedDomains: [],
  blockedDomains: [],
  dismissedWarningSites: [],
  emergencyHelpText:
    "If money was sent or bank details were shared, contact your bank immediately using the number on the back of your card. In the UK, you can also report scams to Action Fraud.",
};

export const STORAGE_KEYS = {
  settings: "silverShieldSettings",
  history: "silverShieldHistory",
};

export const MAX_HISTORY_ITEMS = 20;
export const HISTORY_PREVIEW_LENGTH = 80;
export const MAX_DOMAIN_LIST_ITEMS = 80;

export const RISK_LEVEL_LABELS = {
  safe: "Likely safe",
  caution: "Be careful",
  high: "High risk signs found",
};

export const DEFAULT_ACTIONS = [
  "Don’t click links from the message.",
  "Don’t send money, gift cards, crypto, or bank transfers.",
  "Call the organisation using a trusted number, not a number in the message.",
  "Ask a trusted contact before continuing.",
  "Contact your bank immediately if money was sent or bank details were shared.",
];
