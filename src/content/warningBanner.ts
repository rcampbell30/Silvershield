const BANNER_ID = "silver-shield-warning-banner";

export function showWarningBanner(analysis) {
  if (document.getElementById(BANNER_ID)) return;

  const banner = document.createElement("section");
  banner.id = BANNER_ID;
  banner.setAttribute("role", "status");
  banner.setAttribute("aria-live", "polite");
  banner.innerHTML = `
    <div class="ssb-shell">
      <div class="ssb-icon" aria-hidden="true">🛡</div>
      <div class="ssb-copy">
        <strong>Silver Shield warning</strong>
        <p>Silver Shield spotted scam-like warning signs on this page. Be careful before entering details or sending money.</p>
        <p class="ssb-why" hidden></p>
      </div>
      <div class="ssb-actions">
        <button type="button" data-action="why">Why?</button>
        <button type="button" data-action="open">Open Silver Shield</button>
        <button type="button" data-action="dismiss">Dismiss</button>
      </div>
    </div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    #${BANNER_ID} {
      position: fixed;
      left: 16px;
      right: 16px;
      bottom: 16px;
      z-index: 2147483647;
      font-family: Arial, Helvetica, sans-serif;
      color: #14213d;
      pointer-events: none;
    }
    #${BANNER_ID} .ssb-shell {
      max-width: 920px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 14px;
      align-items: center;
      background: #f7fbff;
      border: 2px solid #2b6cb0;
      border-radius: 16px;
      box-shadow: 0 14px 35px rgba(15, 23, 42, 0.22);
      padding: 14px 16px;
      pointer-events: auto;
    }
    #${BANNER_ID} .ssb-icon {
      width: 42px;
      height: 42px;
      display: grid;
      place-items: center;
      background: #dbeafe;
      border-radius: 999px;
      font-size: 24px;
    }
    #${BANNER_ID} strong {
      display: block;
      font-size: 17px;
      line-height: 1.25;
      margin-bottom: 3px;
    }
    #${BANNER_ID} p {
      margin: 0;
      font-size: 15px;
      line-height: 1.35;
    }
    #${BANNER_ID} .ssb-why {
      margin-top: 8px;
      color: #334155;
    }
    #${BANNER_ID} .ssb-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: flex-end;
    }
    #${BANNER_ID} button {
      border: 1px solid #2b6cb0;
      border-radius: 10px;
      background: #ffffff;
      color: #14213d;
      cursor: pointer;
      font: inherit;
      font-size: 14px;
      font-weight: 700;
      padding: 9px 12px;
    }
    #${BANNER_ID} button[data-action="open"] {
      background: #2b6cb0;
      color: #ffffff;
    }
    @media (max-width: 720px) {
      #${BANNER_ID} .ssb-shell {
        grid-template-columns: 1fr;
      }
      #${BANNER_ID} .ssb-actions {
        justify-content: flex-start;
      }
    }
  `;

  banner.prepend(style);
  document.documentElement.appendChild(banner);

  const whyCopy = banner.querySelector(".ssb-why");
  banner.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;

    const action = button.dataset.action;
    if (action === "dismiss") {
      banner.remove();
    }

    if (action === "why") {
      whyCopy.hidden = !whyCopy.hidden;
      whyCopy.textContent = getWhyText(analysis);
    }

    if (action === "open") {
      chrome.runtime.sendMessage({ type: "OPEN_SILVER_SHIELD" }, () => {
        if (chrome.runtime.lastError) {
          window.alert("Open the Silver Shield extension from the toolbar to check this page or message.");
        }
      });
    }
  });
}

function getWhyText(analysis) {
  if (!analysis?.matchedSignals?.length) {
    return "Silver Shield noticed a high overall risk score, but could not show a specific reason here.";
  }

  const reasons = analysis.matchedSignals.slice(0, 4).map((signal) => signal.label);
  return `Reasons found: ${reasons.join(", ")}. Silver Shield can make mistakes, so verify using a trusted route.`;
}
