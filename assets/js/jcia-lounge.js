/* Partners Lounge — gold-gated exclusive content */
document.addEventListener("DOMContentLoaded", function () {
  const D = window.JCIA_DB, root = document.getElementById("loungeRoot");
  if (!root) return;
  const m = D.session();
  const LEVELS = D.CLASSES.partner.levels;

  function unlocked(levelName) {
    if (!m) return false;
    if (m.memberClass === "son") return true;           /* sons see all */
    if (m.memberClass !== "partner") return false;
    const lv = (m.level || "").replace(/^Partner · /, "");
    return LEVELS.indexOf(lv) >= LEVELS.indexOf(levelName);
  }

  const CONTENT = (D.content().partnersContent || [
    { lv: "Seed Partner", t: "Firstfruits Teaching — Why Partnership Carries Reward", link: "#", type: "Teaching" },
    { lv: "Covenant Partner", t: "Prophetic Message: The Covenant Rain", link: "#", type: "Prophetic" },
    { lv: "Kingdom Partner", t: "Monthly Partner Zoom REPLAY", link: "#", type: "Zoom" },
    { lv: "Embassy Partner", t: "Embassy BuildingBlueprints (PDF)", link: "#", type: "Download" },
    { lv: "Global Partner", t: "Chief's Table: Personal Altar Mentorship Invite", link: "#", type: "Mentorship" }
  ]);

  if (!m || !unlocked(m.level)) {
    root.innerHTML = `
      <div class="lock-note center" style="max-width:640px;margin:1.5rem auto">
        🔒 This is <b>Partners-Only</b> space. Become a Partner of the Ministry (Seed Partner and above)
        to unlock exclusive teachings, prophetic messages and monthly Zoom access with the Apostle.
      </div>
      <div class="gold-box" style="max-width:640px;margin:1rem auto;padding:1.4rem">
        <h3 style="color:var(--gold-light)">Partner Levels</h3>
        <div class="dl dark-dl mt1">
          ${LEVELS.map((l, i) => `<div><span>${l}${D.session() && D.session().level === l ? " · ✅ your level" : ""}</span><b style="color:var(--gold-light)">${["from $15/m", "from $35/m", "from $75/m", "from $150/m", "from $500/m"][i] || ""}</b></div>`).join("")}
        </div>
        <a class="btn btn-gold btn-block mt2" href="give.html">💰 Become a Partner Now</a>
        <a class="btn btn-outline btn-block mt1" href="account.html">Login (already a partner)</a>
      </div>`;
    return;
  }

  /* member is partner/son — render per-level content */
  const idxOf = LEVELS.indexOf((m.level || "").replace(/^Partner · /, "").replace(/^Global Partner.*/, "Seed Partner"));
  root.innerHTML = `
    <div class="gold-box" style="padding:1.4rem;margin-bottom:1.6rem;display:flex;gap:1rem;align-items:center;flex-wrap:wrap">
      <div style="font-size:2.4rem">🏅</div>
      <div><b style="font-family:var(--font-head);color:var(--gold-light);font-size:1.1rem">${m.name} · ${D.CLASSES[m.memberClass].name}</b>
      <p class="small">Level: <b style="color:var(--gold)">${m.level}</b> · Member ${m.id} · enjoying ${LEVELS.slice(0, LEVELS.indexOf(m.level) + 1).length} level(s) of gold access</p></div>
      <a class="btn btn-outline btn-sm" style="margin-left:auto" href="dashboard.html?tab=class">Upgrade level →</a>
    </div>
    <h3 class="mb1">Your Exclusive Vault <span class="small" style="color:#aab7d4">(locked items stay locked)</span></h3>
    ${CONTENT.map(c => {
    const open = unlocked(c.lv);
    return `<div class="gold-box list-item" style="margin-bottom:.55rem">
        <div class="li-main"><b style="color:#fff">${{ Teaching: "📖", Prophetic: "🔥", Zoom: "🎥", Download: "⬇️", Mentorship: "👑" }[c.type] || "✦"} ${c.t}</b>
        <span>${c.type} · For ${c.lv}+</span></div>
        ${open
        ? `<span class="file-chip" style="background:rgba(212,175,55,.2);color:var(--gold-light);border-color:var(--line)">✅ Unlocked</span> <a class="btn btn-gold btn-sm" data-download="${c.t}">Open</a>`
        : `<span class="lock-note" style="padding:.3rem .7rem;font-size:.75rem">🔒 ${c.lv}+</span>`}
      </div>`;
  }).join("")}
    <div class="gold-box mt2" style="padding:1.4rem">
      <b style="color:var(--gold-light)">📅 Monthly Partner Zoom with Apostle Tee Daniel Brilliant</b>
      <p class="small">Every last Friday, 7PM CAT. Zoom links post here first — Partners get the ping before anyone.</p>
    </div>
    <p class="form-note" style="color:#aab7d4">Partner downloads are access-controlled: links only resolve for active Partners and Sons (see README for server-side link signing).</p>`;

  document.querySelectorAll("[data-download]").forEach(b => b.addEventListener("click", () => {
    const count = parseInt(localStorage.getItem("jcia_dl_count_" + b.dataset.download) || "0", 10) + 1;
    localStorage.setItem("jcia_dl_count_" + b.dataset.download, count);
    b.textContent = "Opened ✓"; b.disabled = true;
  }));
});
