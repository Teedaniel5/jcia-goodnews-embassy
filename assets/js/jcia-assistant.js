/* JCIA ASSISTANT — Gemini-powered floating assistant (graceful local-knowledge fallback).
   Admin sets the Gemini API key in Dashboard → JCIA Assistant. NEVER ship a real key in code. */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const D = window.JCIA_DB;

  const LOGO = "assets/img/jcia-logo.png";
  const GREETING = D.content().assistant.greeting || "Welcome to The Good News Embassy. I am JCIA Assistant. How can I help you grow in Christ today?";

  /* ---------- local knowledge base (admin can extend via FAQ tab) ---------- */
  const KB = () => [
    { k: ["vision", "mission", "about jcia", "who are", "what is jcia"], a: "JCIA — Jesus Christ Intelligence Agency, The Good News Embassy, is a prophetic ministry birthed in Bulawayo, Zimbabwe and sent to the Nations. Our Vision: redeemed souls raised as Kingdom stars for dominion worldwide. Our Mission: preaching the gospel, healing, deliverance, prophetic, miracles & wonders (Mark 16:15-18)." },
    { k: ["service time", "when is service", " sunday", " wednesday"], a: "Service times: " + (D.content().site.serviceTimes || "Sundays 9AM · Wednesdays 6PM") + " (CAT). You can also watch LIVE at live.html — Sundays 9AM & Wednesdays 6PM. 🔴" },
    { k: ["join", "become a member", "sign up", "register"], a: "Beautiful! Go to account.html (or the Login button at the top). Signup takes 2 minutes: Full Name, Country, City, WhatsApp, and a photo. You instantly become JCIA-" + "xxxx and receive daily devotionals. 🎉" },
    { k: ["give", "tithe", "offering", "donate", "sow"], a: "Thank you for sowing! Visit give.html — choose Tithe, Offering, Seed, Partnership, Building Fund or Missions. Pick a one-time or monthly amount, then pay via EcoCash, Paynow, Bank, Mukuru, PayPal — or send proof with the “I Have Sent” button. You'll get a Giving Reference Code instantly. 🙏" },
    { k: ["partner", "partnership"], a: "Partners are the financial backbone of the vision! Levels: Seed Partner → Covenant Partner → Kingdom Partner → Embassy Partner → Global Partner. Each level unlocks more of the exclusive PARTNERS LOUNGE (teachings, prophetic messages, Zoom links). See give.html → Partnership or dashboard.html → Membership Class." },
    { k: ["son of the prophet", "sons", "mentorship", "mentor"], a: "SONS OF THE PROPHET — Son, Senior Son and Chief Son — receive closest mentorship with Apostle Tee Daniel Brilliant and the highest access in the Embassy. Apply via the dashboard (Membership Class → Sons) or WhatsApp +263 77 482 7123." },
    { k: ["buy", "course", "academy", "shop", "price"], a: "The JCIA Academy has courses, eBooks, audios, PDFs and PowerPoints: e.g. JCIA Discipleship 101 ($29, 10 modules + certificate), Spiritual Intelligence Activation ($19), 50 Preaching PPTs ($49), JCIA Kids Bible Lessons ($20) and a FREE 7 Days devotional. Visit academy.html!" },
    { k: ["prayer"], a: "I can take your prayer request! Tell me: 1) your name 2) what you are trusting God for — and I'll open the Prayer form, or I'll send it straight to the intercession team on WhatsApp. Nothing is too hard for God. 🕊️" },
    { k: ["testimony", "praise"], a: "Praise report time! 🎉 Send me your testimony (what God did + your name) and I'll route it to admin for approval, then it goes on the Testimonies Wall to glorify Jesus." },
    { k: ["direction", "location", "address", "bulawayo"], a: "The Embassy is in Bulawayo, Zimbabwe — the full map is on contact.html. WhatsApp +263 77 482 7123 and the protocol team will send exact directions + welcome you. 📍" },
    { k: ["live", "watch", "youtube"], a: "Watch live services on live.html — YouTube Live + Facebook Live with live chat and prayer lines. If we're off-air you'll see a countdown to the next service. 🔴" },
    { k: ["login problem", "password", "forgot", "checkout problem", "payment fail"], a: "Let's fix that fast. For login: use account.html → “Forgot?” to reset by email/WhatsApp. For payments: EcoCash/Paynow/Mukuru need the correct number/format; if a payment fails you can retry safely — your cart is saved. If stuck, WhatsApp +263 77 482 7123 and quote your Member ID." },
    { k: ["bible verse", "scripture", "word"], a: "A word for you today: “Arise, shine; for thy light is come, and the glory of the LORD is risen upon thee.” — Isaiah 60:1. Also meditate on Mark 16:15-18, your Kingdom mandate. 📖" },
    { k: ["discipleship", "grow", "grow in christ"], a: "Growth track at JCIA: 1) Sign up & attend services 2) Join a ministry (ministries.html) 3) Do JCIA Discipleship 101 in the Academy 4) Become a Partner or Son of the Prophet for mentorship. I'd recommend starting with the FREE 7 Days of Good News devotional — it's in academy.html! ✨" }
  ];

  const COURSES = () => (window.JCIAStore ? JCIAStore.products().filter(p => p.cat === "courses" || p.cat === "ebooks") : []);

  /* ---------- UI ---------- */
  function build() {
    if (document.querySelector(".assist-fab")) return;
    const fab = document.createElement("button");
    fab.className = "assist-fab"; fab.setAttribute("aria-label", "JCIA Assistant");
    fab.innerHTML = '<img src="' + LOGO + '" alt="JCIA Assistant"><span class="dot"></span>';
    const panel = document.createElement("div");
    panel.className = "assist-panel"; panel.setAttribute("role", "dialog");
    panel.innerHTML = `
      <div class="assist-head">
        <img src="${LOGO}" alt=""><div><b>JCIA ASSISTANT</b><span>Powered by Gemini AI · The Good News Embassy</span></div>
        <button class="btn btn-sm" id="assistX" style="margin-left:auto;background:none;border:none;color:#93a0bd;font-size:1.2rem">✕</button>
      </div>
      <div class="assist-body">
        <div class="assist-msg bot">${GREETING}</div>
      </div>
      <div class="assist-chips">
        <button data-q="Service times">🕐 Service times</button>
        <button data-q="How do I join?">🙋 How to join</button>
        <button data-q="How to give">🙏 How to give</button>
        <button data-q="Become a partner">💰 Become a partner</button>
        <button data-q="Recommend a course">🎓 Recommend a course</button>
        <button data-q="Prayer request">🕊️ Prayer request</button>
      </div>
      <form class="assist-form">
        <input placeholder="Ask me anything… (JCIA, Bible, growth)" maxlength="500">
        <button class="btn btn-gold btn-sm" type="submit">Send</button>
      </form>`;
    document.body.appendChild(fab); document.body.appendChild(panel);
    const body = $(".assist-body", panel), input = $("input", panel), form = $(".assist-form", panel);

    fab.addEventListener("click", () => { panel.classList.toggle("open"); if (panel.classList.contains("open")) input.focus(); });
    $("#assistX", panel).addEventListener("click", () => panel.classList.remove("open"));
    body.parentElement.addEventListener("click", (e) => {
      const chip = e.target.closest("[data-q]");
      if (chip) { input.value = chip.dataset.q; form.dispatchEvent(new Event("submit")); }
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const t = input.value.trim(); if (!t) return;
      addMsg(body, t, "user"); input.value = "";
      reply(t, body);
    });
  }

  function addMsg(body, text, who, html) {
    const d = document.createElement("div");
    d.className = "assist-msg " + who;
    d[html ? "innerHTML" : "textContent"] = text;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
    return d;
  }
  function log(msg) {
    const l = JSON.parse(localStorage.getItem("jcia_assistant_log") || "[]");
    l.push(msg); localStorage.setItem("jcia_assistant_log", JSON.stringify(l.slice(-500)));
  }

  async function reply(text, body) {
    log({ who: "user", text, at: new Date().toISOString(), member: (D.session() || {}).id || "guest" });
    const thinking = addMsg(body, "⏳ ...", "bot");
    let answer = null;
    const key = localStorage.getItem("jcia_gemini_key");

    if (key && !processingSpecial(text)) {
      try {
        const persona = {
          Prophetic: "You are JCIA ASSISTANT of The Good News Embassy (Bulawayo, Zimbabwe — Apostle Tee Daniel Brilliant, Prophet of Mark 16:15-18). Answer with prophetic warmth, scripture (KJV), 120 words max.",
          Loving: "You are JCIA ASSISTANT, gentle and loving like a caring usher. scripture (KJV), 120 words max, always point to Jesus's love.",
          Bold: "You are JCIA ASSISTANT, bold as a lion, declarative faith, KJV scripture, 120 words max.",
          Biblical: "You are JCIA ASSISTANT, strictly Biblical with book-chapter-verse references (KJV), 120 words max."
        }[D.content().assistant.personality] || "You are JCIA ASSISTANT, warm, Biblical, 120 words max.";
        const forbidden = (D.content().assistant.forbidden || "").split(",").map(s => s.trim()).filter(Boolean);
        const SYSTEM = persona + " The ministry: vision = redeemed souls raised as Kingdom stars for dominion worldwide; mission = preaching the gospel, healing, deliverance, prophetic, miracles & wonders (Mark 16:15-18). Service times: " + (D.content().site.serviceTimes) + ". WhatsApp +263 77 482 7123. Email " + D.content().site.contactEmail + ". Location Bulawayo, Zimbabwe. If asked about " + forbidden.join(" or ") + " politely decline and redirect to Kingdom topics. FAQ: " + JSON.stringify(D.content().faqs || []) + ". Products: " + JSON.stringify((COURSES() || []).map(p => ({ t: p.title, p: p.price })));
        const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + key, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ system_instruction: { parts: [{ text: SYSTEM }] }, contents: [{ role: "user", parts: [{ text }] }] })
        });
        const j = await r.json();
        if (j.candidates && j.candidates[0]) answer = j.candidates[0].content.parts[0].text;
      } catch (e) { answer = null; }
    }

    if (!answer) answer = localAnswer(text);
    thinking.textContent = answer;
    thinking.innerHTML = answer.replace(/\n/g, "<br>").replace(/live\.html|academy\.html|give\.html|account\.html|dashboard\.html|contact\.html|ministries\.html|partners\.html/g, m => '<a href="' + m + '" style="color:var(--gold-light);font-weight:700">' + m + "</a>");
    log({ who: "bot", text: answer, at: new Date().toISOString() });
  }

  function processingSpecial(text) {
    /* flows: prayer request / testimony collection */
    const t = text.toLowerCase();
    if (t.startsWith("prayer request") || /^prayer:\s*/.test(t)) {
      const body = text.replace(/^(prayer request|prayer:)\s*/i, "");
      const list = JSON.parse(localStorage.getItem("jcia_prayers") || "[]");
      list.push({ name: (D.session() || {}).name || "JCIA Assistant guest", request: body, shared: false, at: new Date().toISOString(), status: "new" });
      localStorage.setItem("jcia_prayers", JSON.stringify(list));
      return "🕊️ Your prayer request has been delivered to the intercession team. “Call unto me, and I will answer thee” (Jeremiah 33:3). Expect your miracle — and share a testimony when it comes!";
    }
    if (t.startsWith("testimony")) {
      const list = JSON.parse(localStorage.getItem("jcia_testimonies") || "[]");
      list.push({ name: (D.session() || {}).name || "", text: text.replace(/^testimony\s*/i, ""), approved: false, at: new Date().toISOString() });
      localStorage.setItem("jcia_testimonies", JSON.stringify(list));
      return "🎉 Glory to God! Your testimony is with admin for approval and will soon appear on the Testimonies Wall. To God be the glory!";
    }
    if (t.includes("recommend") && (t.includes("course") || t.includes("what should"))) {
      const m = D.session();
      const prods = COURSES().filter(p => p.price === 0 || (m && p.price <= (m.memberClass === "partner" ? 50 : 30))).slice(0, 3);
      return "Based on your level I recommend:\n" + prods.map(p => "🎓 " + p.title + (p.price ? " — $" + p.price : " — FREE") + " (academy.html)").join("\n") + "\nTake the free devotional first, then JCIA Discipleship 101 — from Redeemed Soul to Kingdom Star!";
    }
    return null;
  }

  function localAnswer(text) {
    const t = " " + text.toLowerCase() + " ";
    const special = processingSpecial(text); if (special) return special;
    const hit = KB().find(e => e.k.some(k => t.includes(k)));
    if (hit) return hit.a;
    const faq = (D.content().faqs || []).find(f => t.includes((f.q || "").toLowerCase().slice(0, 12)));
    if (faq) return faq.a;
    return "I'm here to help you grow in Christ! 🌟 I can answer about JCIA's vision & mission, service times, joining, giving & partnership, courses, prayer, testimony, directions, login/checkout help — or share a Bible verse. Try one of the buttons above, or ask in your own words. (Enable the Gemini upgrade in Admin → JCIA Assistant for full AI answers.)";
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
