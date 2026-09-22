/**
 * Google AdSense — Consent Mode for lorapok.tech.
 * The verification snippet lives in index.html <head> (static, crawler-readable).
 * This file grants ad_storage only after explicit marketing consent.
 */
(function () {
  const LOADED_KEY = "__lpAdsenseConsentReady";

  function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  function setConsentDefaults() {
    window.gtag = window.gtag || gtag;
    gtag("consent", "default", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
      wait_for_update: 500,
    });
  }

  function grantConsentMode() {
    if (window[LOADED_KEY]) return;
    window[LOADED_KEY] = true;
    gtag("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });
  }

  function maybeGrant() {
    const stored = window.__LP_PROCESS_CONSENT__ || window.LP_PROCESS_CONSENT?.get?.();
    if (stored?.marketing === true) {
      grantConsentMode();
      return;
    }
    document.addEventListener("lp:consent-marketing", () => grantConsentMode(), { once: true });
  }

  setConsentDefaults();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", maybeGrant);
  } else {
    maybeGrant();
  }
})();
