/**
 * Lorapok Labs — process consent banner (analytics + Google AdSense).
 * Fail closed: adsense.js waits for lp:consent-marketing before loading tags.
 */
(function () {
  const STORAGE_KEY = "lp-process-consent";
  const VERSION = "2026-09-22";
  const BANNER_ID = "lp-consent-banner";

  function readStored() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== VERSION) return null;
      if (parsed.marketing !== true && parsed.marketing !== false) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  function writeStored(marketing) {
    const payload = {
      version: VERSION,
      marketing: Boolean(marketing),
      decidedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* private mode */
    }
    return payload;
  }

  function allowMarketing() {
    document.dispatchEvent(new CustomEvent("lp:consent-marketing", { detail: { version: VERSION } }));
  }

  function hideBanner() {
    const node = document.getElementById(BANNER_ID);
    if (node) node.remove();
  }

  function decide(allow) {
    const stored = writeStored(allow);
    window.__LP_PROCESS_CONSENT__ = stored;
    hideBanner();
    if (allow) allowMarketing();
  }

  function renderBanner() {
    if (document.getElementById(BANNER_ID)) return;
    const bar = document.createElement("div");
    bar.id = BANNER_ID;
    bar.className = "lp-consent-banner";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", "Privacy and advertising consent");
    bar.innerHTML = `
      <div class="lp-consent-banner-inner">
        <p class="lp-consent-copy">
          Lorapok Labs may use <strong>anonymous</strong> visit metrics and Google AdSense ads to support open-source work.
          Choose <strong>Essential only</strong> to skip third-party marketing tags.
          See <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">Google advertising policies</a>.
        </p>
        <div class="lp-consent-actions">
          <button type="button" class="lp-consent-btn lp-consent-btn--ghost" data-consent="decline">Essential only</button>
          <button type="button" class="lp-consent-btn lp-consent-btn--primary" data-consent="accept">Allow ads &amp; analytics</button>
        </div>
      </div>`;
    document.body.appendChild(bar);
    bar.querySelector('[data-consent="accept"]')?.addEventListener("click", () => decide(true));
    bar.querySelector('[data-consent="decline"]')?.addEventListener("click", () => decide(false));
  }

  window.LP_PROCESS_CONSENT = {
    version: VERSION,
    get: readStored,
    allowMarketing,
  };

  function boot() {
    const stored = readStored();
    window.__LP_PROCESS_CONSENT__ = stored;
    if (stored?.marketing === true) {
      allowMarketing();
      return;
    }
    if (stored?.marketing === false) {
      return;
    }
    renderBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
