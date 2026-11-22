/* JCIA — The Good News Embassy | Global script */
window.JCIA = {
  // *** Replace placeholders with real details before go-live (see README) ***
  whatsapp: "263774827123",
  whatsappDisplay: "+263 77 482 7123",
  email: "teedanielbrilliant@gmail.com",
  location: "Bulawayo, Zimbabwe",
  socials: {
    facebook: "https://facebook.com/jciagoodnewsembassy",
    youtube: "https://youtube.com/@jciagoodnewsembassy",
    instagram: "https://instagram.com/jcia_goodnewsembassy",
    tiktok: "https://tiktok.com/@jcia.goodnewsembassy"
  },
  // Live stream ids/urls (admin overrides via Dashboard > Go Live)
  live: { youtubeId: "", facebookUrl: "" }
};

(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* Sticky nav */
  const burger = $(".hamburger"), nav = $(".nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("open");
      burger.classList.toggle("x");
    });
    $$("a", nav).forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
  }
  /* Active link */
  const path = location.pathname.split("/").pop() || "index.html";
  $$(".nav a").forEach(a => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });

  /* SOCIAL SVG ICONS */
  const ICONS = {
    facebook: '<svg viewBox="0 0 24 24"><path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.7-.1-1.5-.2-2.3-.2-2.3 0-3.9 1.4-3.9 4v2.3H8v3h2.2v7h3.3z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 3.6a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 2.2a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm6.4-3.7a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24"><path d="M16.7 2h-3.1v13.3a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.3a6 6 0 0 0-.9-.1 5.9 5.9 0 1 0 5.9 5.9V8.7a7.4 7.4 0 0 0 4.3 1.4V7a4.4 4.4 0 0 1-4.2-5z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.6 14.1c-.2.7-1.4 1.3-1.9 1.3-.5.1-1.2.1-1.9-.1a12.4 12.4 0 0 1-5.9-5.2c-.6-1-.9-2-.9-2.7 0-.8.4-1.5.8-1.9.3-.3.6-.4.9-.4h.6c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.2-.3.4-.1.7.2.4.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.5 1.5.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.5.4s0 .9-.2 1.4z"/></svg>'
  };

  /* Floating WhatsApp button */
  if ($(".wa-float")) {
    $(".wa-float").href = `https://wa.me/${JCIA.whatsapp}?text=${encodeURIComponent("Hi JCIA Good News Embassy! I'd like to connect.")}`;
    $(".wa-float").innerHTML = ICONS.whatsapp;
  }

  /* Follow bar icons */
  $$("[data-social]").forEach(el => {
    const k = el.dataset.social;
    if (ICONS[k] && JCIA.socials[k]) {
      el.href = JCIA.socials[k];
      el.innerHTML = ICONS[k];
      el.setAttribute("aria-label", "Follow on " + k);
      el.target = "_blank";
      el.rel = "noopener";
    }
  });

  /* Testimonies / media slider */
  $$(".slider").forEach(s => {
    const slides = s.querySelector(".slides"); if (!slides) return;
    const nav = s.querySelector(".slider-nav"); const n = slides.children.length;
    let i = 0, iv;
    if (nav) for (let k = 0; k < n; k++) { const b = document.createElement("button"); b.setAttribute("aria-label", "Slide " + (k + 1)); b.addEventListener("click", () => go(k)); nav.appendChild(b); }
    function go(k) { i = k; slides.style.transform = `translateX(-${k * 100}%)`; if (nav) $$("button", nav).forEach((b, bi) => b.classList.toggle("on", bi === k)); }
    function auto() { clearInterval(iv); iv = setInterval(() => go((i + 1) % n), 6000); }
    go(0); auto();
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) clearInterval(iv);
    s.addEventListener("mouseenter", () => clearInterval(iv));
    s.addEventListener("mouseleave", auto);
  });

  /* Newsletter */
  $$(".newsletter").forEach(f => f.addEventListener("submit", e => {
    e.preventDefault();
    const email = $("input", f).value.trim();
    if (!email) return;
    const subs = JSON.parse(localStorage.getItem("jcia_subscribers") || "[]");
    subs.push({ email, at: new Date().toISOString() });
    localStorage.setItem("jcia_subscribers", JSON.stringify(subs));
    f.innerHTML = '<p class="success-msg">You are subscribed! Daily Good News devotionals are on the way. 🎉</p>';
  }));

  /* Contact / forms → WhatsApp out */
  window.JCIA_WA = function (text) {
    window.open(`https://wa.me/${JCIA.whatsapp}?text=${encodeURIComponent(text)}`, "_blank");
  };

  /* Admin-set overrides: jcia-db.js loads right after main.js, so re-apply on DOM ready */
  document.addEventListener("DOMContentLoaded", function () {
    if (!window.JCIA_DB) return;
    try {
      const c = JCIA_DB.content();
      const so = c.socials || {}, st = c.site || {};
      if (st.whatsapp) {
        JCIA.whatsapp = String(st.whatsapp).replace(/\D/g, "");
        const wf = $(".wa-float"); if (wf) wf.href = `https://wa.me/${JCIA.whatsapp}?text=${encodeURIComponent("Hi JCIA Good News Embassy! I'd like to connect.")}`;
      }
      if (st.contactEmail) JCIA.email = st.contactEmail;
      Object.keys(so).forEach(k => {
        if (!so[k] || typeof so[k] !== "string" || !so[k].startsWith("http")) return;
        $$(`[data-social="${k}"]`).forEach(el => { el.href = so[k]; });
      });
    } catch (e) { /* storage unavailable — defaults stand */ }
  });

  /* Generic form handler: [data-wa-form] composes a WhatsApp message from fields */
  $$("[data-wa-form]").forEach(f => f.addEventListener("submit", e => {
    e.preventDefault();
    const title = f.dataset.waForm || "New submission";
    const lines = Array.from(new FormData(f).entries())
      .map(([k, v]) => `${k}: ${v}`).join("\n");
    JCIA_WA(`${title}\n${lines}`);
  }));
})();
