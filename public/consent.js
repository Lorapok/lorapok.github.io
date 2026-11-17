/**
 * Lorapok Labs — process consent banner (analytics + Google AdSense).
 * Fail closed: adsense.js waits for lp:consent-marketing before loading tags.
 */
(function () {
  const STORAGE_KEY = "lp-process-consent";
  const VERSION = "2026-11-18";
  const BANNER_ID = "lp-consent-banner";
  const PREFERENCES_ID = "lp-consent-preferences";
  const GTM_ID = "GTM-MK42N9WX";
  const GTM_LOADED_KEY = "__lpGoogleTagManagerLoaded";
  const ADSENSE_CLIENT = "ca-pub-3756651399602872";
  const ADSENSE_LOADED_KEY = "__lpAdsenseScriptLoaded";
  const MARKETING_HOSTS = new Set(["lorapok.tech", "www.lorapok.tech"]);
  let previousFocus = null;

  function isProductionMarketingHost() {
    return MARKETING_HOSTS.has(String(window.location.hostname || "").toLowerCase());
  }

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

  function loadGoogleTagManager() {
    if (!isProductionMarketingHost()) return;
    if (window[GTM_LOADED_KEY]) return;
    window[GTM_LOADED_KEY] = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://lorapok.tech/metrics/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(script);
  }

  function loadAdsense() {
    if (!isProductionMarketingHost()) return;
    if (window[ADSENSE_LOADED_KEY]) return;
    window[ADSENSE_LOADED_KEY] = true;
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    document.head.appendChild(script);
  }

  function allowMarketing() {
    if (!isProductionMarketingHost()) {
      document.dispatchEvent(
        new CustomEvent("lp:consent-marketing-skipped", {
          detail: { version: VERSION, reason: "non-production-host" },
        }),
      );
      return;
    }
    loadGoogleTagManager();
    loadAdsense();
    document.dispatchEvent(new CustomEvent("lp:consent-marketing", { detail: { version: VERSION } }));
  }

  function revokeMarketing() {
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
      });
    }
    if (typeof window.fbq === "function") window.fbq("consent", "revoke");
    document.dispatchEvent(new CustomEvent("lp:consent-withdrawn", { detail: { version: VERSION } }));
  }

  function hideBanner() {
    const node = document.getElementById(BANNER_ID);
    if (node) node.remove();
    if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
    previousFocus = null;
  }

  function decide(allow) {
    const wasAllowed = readStored()?.marketing === true;
    const stored = writeStored(allow);
    window.__LP_PROCESS_CONSENT__ = stored;
    hideBanner();
    renderPreferencesButton();
    if (allow) {
      allowMarketing();
    } else if (wasAllowed) {
      revokeMarketing();
      // Reload to remove already-executed marketing runtimes from memory. Stored
      // consent remains denied, so the next page load stays essential-only.
      window.setTimeout(() => window.location.reload(), 50);
    }
  }

  function renderPreferencesButton() {
    if (document.getElementById(PREFERENCES_ID)) return;
    const button = document.createElement("button");
    button.id = PREFERENCES_ID;
    button.className = "lp-consent-preferences";
    button.type = "button";
    button.textContent = "Privacy choices";
    button.setAttribute("aria-haspopup", "dialog");
    button.addEventListener("click", () => renderBanner());
    document.body.appendChild(button);
  }

  function renderBanner() {
    if (document.getElementById(BANNER_ID)) return;
    previousFocus = document.activeElement;
    document.getElementById(PREFERENCES_ID)?.remove();
    const hasExistingChoice = readStored() !== null;
    const bar = document.createElement("div");
    bar.id = BANNER_ID;
    bar.className = "lp-consent-banner";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-modal", "true");
    bar.setAttribute("aria-label", "Privacy and advertising consent");
    bar.innerHTML = `
      <div class="lp-consent-banner-inner">
        <p class="lp-consent-copy">
          Lorapok Labs may use visit measurement, Meta Pixel, and Google AdSense tags to support open-source work.
          Choose <strong>Essential only</strong> to skip third-party marketing tags.
          See <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">Google advertising policies</a>.
        </p>
        <div class="lp-consent-actions">
          ${hasExistingChoice ? '<button type="button" class="lp-consent-btn lp-consent-btn--quiet" data-consent="close">Keep current choice</button>' : ''}
          <button type="button" class="lp-consent-btn lp-consent-btn--ghost" data-consent="decline">Essential only</button>
          <button type="button" class="lp-consent-btn lp-consent-btn--primary" data-consent="accept">Allow ads &amp; analytics</button>
        </div>
      </div>`;
    document.body.appendChild(bar);
    bar.querySelector('[data-consent="accept"]')?.addEventListener("click", () => decide(true));
    bar.querySelector('[data-consent="decline"]')?.addEventListener("click", () => decide(false));
    bar.querySelector('[data-consent="close"]')?.addEventListener("click", () => {
      hideBanner();
      renderPreferencesButton();
    });
    bar.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && hasExistingChoice) {
        hideBanner();
        renderPreferencesButton();
      }
    });
    bar.querySelector("button")?.focus();
  }

  window.LP_PROCESS_CONSENT = {
    version: VERSION,
    get: readStored,
    isProductionMarketingHost,
    allowMarketing,
    showChoices: renderBanner,
    withdraw: () => decide(false),
  };

  function boot() {
    const stored = readStored();
    window.__LP_PROCESS_CONSENT__ = stored;
    if (stored?.marketing === true) {
      allowMarketing();
      renderPreferencesButton();
      return;
    }
    if (stored?.marketing === false) {
      renderPreferencesButton();
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
