(function () {
  const config = window.ILK_MILYONUM_CONFIG || {};
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const siteNav = document.querySelector("[data-site-nav]");
  const form = document.querySelector("[data-lead-form]");
  const statusEl = document.querySelector("[data-form-status]");
  const phoneInput = document.querySelector("#phone");
  const pricingSection = document.querySelector("[data-pricing-section]");

  const cleanConfigValue = (value) => (typeof value === "string" ? value.trim() : "");

  function initAnalytics() {
    const ga4Id = cleanConfigValue(config.ga4Id);
    const metaPixelId = cleanConfigValue(config.metaPixelId);

    if (ga4Id) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", ga4Id);

      const gaScript = document.createElement("script");
      gaScript.async = true;
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ga4Id);
      document.head.appendChild(gaScript);
    }

    if (metaPixelId) {
      window.fbq = function fbq() {
        window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments);
      };
      if (!window._fbq) window._fbq = window.fbq;
      window.fbq.push = window.fbq;
      window.fbq.loaded = true;
      window.fbq.version = "2.0";
      window.fbq.queue = [];
      window.fbq("init", metaPixelId);
      window.fbq("track", "PageView");

      const pixelScript = document.createElement("script");
      pixelScript.async = true;
      pixelScript.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(pixelScript);
    }
  }

  function trackEvent(name, params) {
    const payload = params || {};
    if (typeof window.gtag === "function") {
      window.gtag("event", name, payload);
    }
    if (typeof window.fbq === "function") {
      window.fbq("trackCustom", name, payload);
    }
    window.dispatchEvent(new CustomEvent("ilkMilyonum:event", { detail: { name, params: payload } }));
  }

  function buildWhatsAppUrl(variant) {
    const number = cleanConfigValue(config.whatsappNumber).replace(/[^\d]/g, "");
    const message =
      variant === "consultation"
        ? cleanConfigValue(config.whatsappConsultationMessage)
        : cleanConfigValue(config.whatsappDefaultMessage);
    const encodedMessage = encodeURIComponent(message || "Salam! İlk Milyonum kursu haqqında sualım var.");
    return number ? `https://wa.me/${number}?text=${encodedMessage}` : `https://wa.me/?text=${encodedMessage}`;
  }

  function applyConfig() {
    const coursePriceLabel = cleanConfigValue(config.coursePriceLabel);
    const accessDurationLabel = cleanConfigValue(config.accessDurationLabel);
    const certificateLabel = cleanConfigValue(config.certificateLabel);
    const privacyUrl = cleanConfigValue(config.privacyPolicyUrl);

    if (coursePriceLabel) {
      document.querySelectorAll("[data-course-price]").forEach((node) => {
        node.textContent = coursePriceLabel;
      });
    }
    if (accessDurationLabel) {
      document.querySelectorAll("[data-access-duration]").forEach((node) => {
        node.textContent = accessDurationLabel;
      });
    }
    if (certificateLabel) {
      document.querySelectorAll("[data-certificate]").forEach((node) => {
        node.textContent = certificateLabel;
      });
    }
    if (privacyUrl) {
      document.querySelectorAll("[data-privacy-link], [data-privacy-link-footer]").forEach((link) => {
        link.href = privacyUrl;
      });
    }

    const courseCtaUrl = cleanConfigValue(config.courseCtaUrl);
    if (courseCtaUrl) {
      document.querySelectorAll("[data-course-cta]").forEach((link) => {
        link.href = courseCtaUrl;
        link.target = cleanConfigValue(config.courseCtaTarget) || "_self";
        if (link.target === "_blank") {
          link.rel = "noopener";
        }
      });
    }

    document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
      link.href = buildWhatsAppUrl(link.dataset.whatsappVariant);
      link.target = "_blank";
      link.rel = "noopener";
    });

    document.querySelectorAll("[data-current-year]").forEach((node) => {
      node.textContent = String(new Date().getFullYear());
    });
  }

  function closeMobileMenu() {
    if (!menuToggle || !siteNav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    siteNav.dataset.open = "false";
  }

  function initNavigation() {
    if (menuToggle && siteNav) {
      menuToggle.addEventListener("click", () => {
        const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isExpanded));
        siteNav.dataset.open = String(!isExpanded);
      });
    }

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const hash = link.getAttribute("href");
        if (!hash) return;
        if (hash === "#") {
          if (
            link.hasAttribute("data-required-url") ||
            link.hasAttribute("data-privacy-link") ||
            link.hasAttribute("data-privacy-link-footer")
          ) {
            event.preventDefault();
          }
          return;
        }
        const target = document.querySelector(hash);
        if (!target) return;
        event.preventDefault();
        const scrollMarginTop = parseFloat(window.getComputedStyle(target).scrollMarginTop) || 0;
        const headerOffset = scrollMarginTop || ((document.querySelector("[data-header]")?.offsetHeight || 0) + 22);
        const targetTop = window.scrollY + target.getBoundingClientRect().top - headerOffset;
        window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
        closeMobileMenu();
      });
    });
  }

  function initAccordions() {
    document.querySelectorAll("[data-accordion]").forEach((accordion) => {
      accordion.querySelectorAll(".accordion__trigger").forEach((trigger) => {
        trigger.addEventListener("click", () => {
          const panelId = trigger.getAttribute("aria-controls");
          const panel = panelId ? document.getElementById(panelId) : null;
          if (!panel) return;

          const shouldOpen = trigger.getAttribute("aria-expanded") !== "true";
          if (accordion.hasAttribute("data-single-open")) {
            accordion.querySelectorAll(".accordion__trigger").forEach((otherTrigger) => {
              const otherPanel = document.getElementById(otherTrigger.getAttribute("aria-controls"));
              otherTrigger.closest(".accordion__item")?.setAttribute("data-open", "false");
              otherTrigger.setAttribute("aria-expanded", "false");
              if (otherPanel) otherPanel.hidden = true;
            });
          }

          trigger.setAttribute("aria-expanded", String(shouldOpen));
          trigger.closest(".accordion__item")?.setAttribute("data-open", String(shouldOpen));
          panel.hidden = !shouldOpen;
        });
      });
    });
  }

  function initTracking() {
    document.querySelectorAll(".js-track").forEach((node) => {
      node.addEventListener("click", () => {
        const cta = node.dataset.cta || node.textContent.trim();
        trackEvent("cta_click", { cta });
        if (node.hasAttribute("data-whatsapp-link")) {
          trackEvent("whatsapp_click", { cta, variant: node.dataset.whatsappVariant || "default" });
        }
      });
    });

    if (pricingSection && "IntersectionObserver" in window) {
      let hasTrackedPricing = false;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasTrackedPricing) {
              hasTrackedPricing = true;
              trackEvent("pricing_view", { section: "qiymet" });
              observer.disconnect();
            }
          });
        },
        { threshold: 0.35 }
      );
      observer.observe(pricingSection);
    }
  }

  function initUtmFields() {
    const params = new URLSearchParams(window.location.search);
    document.querySelectorAll("[data-utm-field]").forEach((field) => {
      const key = field.dataset.utmField;
      field.value = params.get(key) || "";
    });
    document.querySelectorAll("[data-page-url-field]").forEach((field) => {
      field.value = window.location.href;
    });
  }

  function formatAzPhone(value) {
    let digits = value.replace(/\D/g, "");
    if (digits.startsWith("994")) digits = digits.slice(3);
    if (digits.startsWith("0")) digits = digits.slice(1);
    digits = digits.slice(0, 9);

    const chunks = [];
    if (digits.slice(0, 2)) chunks.push(digits.slice(0, 2));
    if (digits.slice(2, 5)) chunks.push(digits.slice(2, 5));
    if (digits.slice(5, 7)) chunks.push(digits.slice(5, 7));
    if (digits.slice(7, 9)) chunks.push(digits.slice(7, 9));
    return "+994" + (chunks.length ? " " + chunks.join(" ") : "");
  }

  function initPhoneMask() {
    if (!phoneInput) return;
    phoneInput.addEventListener("focus", () => {
      if (!phoneInput.value.trim()) phoneInput.value = "+994 ";
    });
    phoneInput.addEventListener("input", () => {
      phoneInput.value = formatAzPhone(phoneInput.value);
    });
  }

  function setFormStatus(message, state) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.dataset.state = state || "";
  }

  async function submitLead(event) {
    event.preventDefault();
    if (!form) return;

    setFormStatus("", "");
    if (!form.checkValidity()) {
      form.reportValidity();
      setFormStatus("Zəhmət olmasa bütün məcburi sahələri düzgün doldurun.", "error");
      return;
    }

    const endpoint = cleanConfigValue(config.appsScriptEndpoint);
    if (!endpoint) {
      setFormStatus("Google Apps Script endpoint-i əlavə edilməyib. Hələlik WhatsApp vasitəsilə müraciət edin.", "error");
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    setFormStatus("Göndərilir...", "");

    try {
      const formData = new FormData(form);
      const payload = new URLSearchParams();
      formData.forEach((value, key) => {
        payload.append(key, value);
      });
      const request = {
        method: "POST",
        body: payload
      };
      if (config.appsScriptNoCors !== false) {
        request.mode = "no-cors";
      }

      const response = await fetch(endpoint, request);
      if (config.appsScriptNoCors === false) {
        if (!response.ok) {
          throw new Error("Form endpoint returned " + response.status);
        }

        const responseText = await response.text();
        if (responseText) {
          const result = JSON.parse(responseText);
          if (result.success === false) {
            throw new Error(result.message || "Google Sheets yazılışı alınmadı.");
          }
        }
      }

      form.reset();
      initUtmFields();
      trackEvent("form_submit", { form: "registration" });
      setFormStatus("Müraciət göndərildi. Tezliklə sizinlə əlaqə saxlanılacaq.", "success");
    } catch (error) {
      const detail = error && error.message ? ` (${error.message})` : "";
      setFormStatus(`Göndəriş alınmadı${detail}. Zəhmət olmasa bir az sonra yenidən cəhd edin və ya WhatsApp-a yazın.`, "error");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  }

  function initForm() {
    if (!form) return;
    form.addEventListener("submit", submitLead);
  }

  initAnalytics();
  applyConfig();
  initNavigation();
  initAccordions();
  initTracking();
  initUtmFields();
  initPhoneMask();
  initForm();
})();
