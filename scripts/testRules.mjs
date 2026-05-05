import { analyseScamRisk, detectSuspiciousUrls, shouldSuppressPageWarning } from "../dist/shared/riskScoring.js";

const cases = [
  {
    name: "fake Royal Mail parcel fee",
    input: "Royal Mail: Your parcel is waiting. Pay a parcel fee within 24 hours at http://royal-mail-fee.top/claim",
    expected: "high",
  },
  {
    name: "fake HMRC tax refund",
    input: "HMRC tax rebate: claim your refund pending now. Confirm your identity and login details at https://hmrc-refund.click",
    expected: "high",
  },
  {
    name: "fake bank verification code request",
    input: "Urgent: your bank account will be blocked. Reply with your password, PIN and verification code immediately.",
    expected: "high",
  },
  {
    name: "family lost phone message",
    input: "Hi mum I lost my phone, this is my new number. I need help urgently, please send money and don't tell anyone.",
    expected: "high",
  },
  {
    name: "fake DVLA vehicle penalty",
    input: "DVLA: unpaid vehicle tax penalty. Avoid a fine by paying today at https://dvla-tax-penalty.top",
    expected: "high",
  },
  {
    name: "fake Microsoft remote access support",
    input: "Microsoft support: your computer has a virus. Install AnyDesk now so our engineer can get remote access.",
    expected: "high",
  },
  {
    name: "normal harmless message",
    input: "Hi, just checking we are still meeting for lunch at 1pm tomorrow. I will bring the book you asked for.",
    expected: "safe",
  },
];

let failures = 0;

for (const testCase of cases) {
  const result = analyseScamRisk(testCase.input);
  const passed = result.riskLevel === testCase.expected;
  console.log(`${passed ? "✓" : "✗"} ${testCase.name}: ${result.riskLevel} (${result.score}/100)`);
  if (!passed) failures += 1;
}

const urlSignals = detectSuspiciousUrls("Please visit http://bit.ly/parcel-fee now");
const hasShortener = urlSignals.some((signal) => signal.id.includes("url-shortener"));
const hasNonHttps = urlSignals.some((signal) => signal.id.includes("url-non-https"));

if (hasShortener && hasNonHttps) {
  console.log("✓ URL detection catches shorteners and non-HTTPS links");
} else {
  console.log("✗ URL detection did not catch expected URL signals");
  failures += 1;
}

const blockedResult = analyseScamRisk("Visit https://known-bad-site.top now", {
  blockedDomains: ["known-bad-site.top"],
});

if (blockedResult.riskLevel === "high") {
  console.log("✓ Blocked domain raises risk");
} else {
  console.log("✗ Blocked domain did not raise risk as expected");
  failures += 1;
}

const suppressTrusted = shouldSuppressPageWarning("www.gov.uk", {
  trustedDomains: ["gov.uk"],
  dismissedWarningSites: [],
});

const suppressDismissed = shouldSuppressPageWarning("example.com", {
  trustedDomains: [],
  dismissedWarningSites: ["example.com"],
});

if (suppressTrusted && suppressDismissed) {
  console.log("✓ Trusted and dismissed sites suppress page banners");
} else {
  console.log("✗ Page-warning suppression failed");
  failures += 1;
}

if (failures > 0) {
  console.error(`${failures} rule test(s) failed`);
  process.exit(1);
}

console.log("All rule tests passed");
