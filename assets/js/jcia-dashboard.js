/* Member dashboard: profile, library, giving history, class, course progress, notifications */
document.addEventListener("DOMContentLoaded", function () {
  const D = window.JCIA_DB, S = window.JCIAStore;
  const root = document.getElementById("dashRoot");
  if (!root) return;
  const m = D.session();
  if (!m) { root.innerHTML = '<div class="card center" style="padding:2rem"><p><b>🔒 Please log in first.</b></p><a class="btn btn-gold mt1" href="account.html">Login / Signup →</a></div>'; return; }

  const tabs = ["profile", "library", "giving", "class", "progress", "notifs"];
  let active = "profile";
  const QS = new URLSearchParams(location.search).get("tab");
  if (QS && tabs.includes(QS)) active = QS;

  function clsBadge(m) { return '<span class="class-badge cb-' + m.memberClass + '">' + D.CLASSES[m.memberClass].icon + " " + D.CLASSES[m.memberClass].name + " · " + m.level + "</span>"; }

  function sec(name) { return { profile: rProfile, library: rLibrary, giving: rGiving, class: rClass, progress: rProgress, notifs: rNotifs }[name]; }

  function rProfile() {
    return `<div class="grid g2" style="align-items:start">
      <div class="member-hero">
        ${m.photo ? `<img class="mh-avatar" src="${m.photo}" alt="Profile photo">` : '<div class="mh-avatar" style="display:flex;align-items:center;justify-content:center;background:#14224a;font-size:2.4rem">👤</div>'}
        <div>
          <div class="mh-id">${m.id}</div>
          <b style="font-size:1.1rem">${m.name}</b><br>${clsBadge(m)}
          <p class="small" style="color:#aab7d4;margin-top:.4rem">Member since ${new Date(m.joined).toLocaleDateString()} ${m.status === "active" ? "· ✅ Active" : "· ⛔ Blocked"}</p>
        </div>
        <div style="margin-left:auto"><a class="btn btn-outline btn-sm" href="partners.html">Partners Lounge (Gold)</a></div>
      </div>
      <div class="card" style="padding:1.4rem">
        <h3 class="mb1">My Profile</h3>
        <div class="dl">
          <div><span>Full Name</span><b><input id="pfName" value="${(m.name || "").replace(/"/g, "")}" style="border:none;text-align:right;font-weight:700"></b></div>
          <div><span>Email</span><b>${m.email}</b></div>
          <div><span>WhatsApp</span><b><input id="pfWa" value="${m.whatsapp || ""}" style="border:none;text-align:right"></b></div>
          <div><span>Country</span><b><input id="pfCountry" value="${m.country || ""}" style="border:none;text-align:right"></b></div>
          <div><span>City</span><b><input id="pfCity" value="${m.city || ""}" style="border:none;text-align:right"></b></div>
          <div><span>Gender</span><b><select id="pfGender" style="border:none;font-weight:700"><option ${m.gender === "Male" ? "selected" : ""}>Male</option><option ${m.gender === "Female" ? "selected" : ""}>Female</option></select></b></div>
          <div><span>Date of Birth</span><b><input id="pfDob" type="date" value="${m.dob || ""}" style="border:none;text-align:right"></b></div>
          <div><span>Member ID</span><b class="ref-code">${m.id}</b></div>
        </div>
        <div class="mt1">
          <label class="small" style="font-weight:700">Profile Photo</label>
          <input type="file" id="pfPhoto" accept="image/*">
        </div>
        <button class="btn btn-gold mt1" id="pfSave">Save Profile</button>
        <button class="btn btn-outline btn-sm mt1" id="pfLogout">Log Out</button>
      </div>
    </div>`;
  }

  function rLibrary() {
    const lib = (m.purchases || []);
    const items = lib.map(id => S.product(id)).filter(Boolean);
    return `<div class="card" style="padding:1.4rem">
      <h3 class="mb1">My Library (${items.length})</h3>
      ${items.map(p => `<div class="list-item"><div class="li-main"><b>${p.icon} ${p.title}</b><span>${p.cat} · ${p.price ? "$" + p.price : "Free"} · ${p.downloads || 0} downloads</span></div>
        <a class="btn btn-gold btn-sm" href="library.html#${p.id}">Open ↗</a></div>`).join("") || '<p class="muted">Empty — explore the <a href="academy.html" style="color:var(--gold-deep);font-weight:700">Academy →</a></p>'}
      <a class="btn btn-outline btn-sm mt1" href="library.html">Open full Library →</a>
    </div>`;
  }

  function rGiving() {
    const g = (m.givings || []).slice().reverse();
    return `<div class="card" style="padding:1.4rem">
      <h3 class="mb1">My Giving History</h3>
      ${g.length ? `<div class="table-scroll"><table class="table"><tr><th>Ref</th><th>Type</th><th>Amount</th><th>Method</th><th>When</th><th>Status</th></tr>
       ${g.map(x => `<tr><td><b class="ref-code" style="font-size:.9rem">${x.ref}</b></td><td>${x.type} (${x.freq})</td><td>$${x.amount}</td><td>${x.method}</td><td>${new Date(x.at).toLocaleDateString()}</td><td><span class="badge ${x.status === "approved" ? "badge-ok" : "badge-pending"}">${x.status || "pending"}</span></td></tr>`).join("")}</table></div>`
      : '<p class="muted">No giving yet.</p>'}
      <a class="btn btn-gold btn-sm mt2" href="give.html">Give / Sow a Seed →</a>
    </div>`;
  }

  function rClass() {
    const C = D.CLASSES;
    return `<div class="grid g4">
      ${Object.keys(C).map(k => {
      const included = k === m.memberClass;
      return `<div class="card ${included ? "" : ""}" style="${included ? "border:2px solid var(--gold);box-shadow:0 10px 26px rgba(212,175,55,.25)" : ""}">
          <div class="card-body center"><span class="class-icon">${C[k].icon}</span>
          <h3 style="font-size:1rem">${C[k].name}</h3>
          <p class="small">${k === "son" ? "Closest sons — mentorship with Apostle Tee Daniel Brilliant, highest access." : k === "partner" ? "Financial partners supporting the vision — exclusive Lounge access." : k === "servant" ? "Ushers, Media, Choir, Intercessors, Evangelism, Kids Teachers, Protocol." : "Members worldwide — free tier."}</p>
          <ul class="small muted">${C[k].levels.map(l => "<li>" + l + "</li>").join("")}</ul>
          ${included ? '<span class="badge badge-ok">Your class</span>' : `<a class="btn btn-outline btn-sm mt1" href="account.html?upgrade=${k}">Request / Upgrade →</a>`}
        </div></div>`;
    }).join("")}
    </div>
    <div class="card mt2" style="padding:1.4rem"><b>How upgrading works</b>
    <ul class="check-list mt1 small">
      <li>Sons: apply via WhatsApp +263 77 482 7123 — approved by Apostle's office.</li>
      <li>Partners: choose your level and give monthly on the <a href="give.html" style="color:var(--gold-deep)">Give page</a> — access unlocks automatically.</li>
      <li>Servants: department assignment by the Membership Admin.</li>
      <li>Admin can upgrade, downgrade or move any member instantly from the Dashboard.</li>
    </ul></div>`;
  }

  function rProgress() {
    const keys = Object.keys(m.progress || {});
    return `<div class="card" style="padding:1.4rem">
      <h3 class="mb1">My Courses Progress</h3>
      ${keys.length ? keys.map(k => {
      const p = S.product(k); const pct = m.progress[k] || 0;
      return p ? `<div class="list-item"><div class="li-main"><b>${p.icon} ${p.title}</b><div class="progress-thin"><span style="width:${pct}%"></span></div></div><b>${pct}%</b></div>` : "";
    }).join("") : '<p class="muted">No enrolments yet — start in the <a href="academy.html" style="color:var(--gold-deep);font-weight:700">Academy →</a></p>'}
    </div>`;
  }

  function rNotifs() {
    const all = (D.content().notifications || []);
    const visible = all.filter(n => n.audience === "all" || n.audience === m.memberClass || n.audience === m.level || n.audience === m.id || n.audience === "partners:" + m.level);
    return `<div class="card" style="padding:1.4rem">
      <h3 class="mb1">Notifications</h3>
      ${visible.length ? visible.map(n => `<div class="list-item"><div class="li-main"><b>📣 ${n.title}</b><span>${n.body}</span><span class="muted small">${new Date(n.at).toLocaleString()} · to ${n.audience}</span></div></div>`).join("") : '<p class="muted">No notifications yet.</p>'}
    </div>`;
  }

  function paint() {
    root.innerHTML = `
      <div class="member-hero">
        ${m.photo ? `<img class="mh-avatar" src="${m.photo}">` : '<div class="mh-avatar" style="display:flex;align-items:center;justify-content:center;background:#14224a;font-size:2.2rem">👤</div>'}
        <div><div class="mh-id">${m.id}</div><b>${m.name}</b><br>${clsBadge(m)}</div>
        <div class="head-tools" style="margin-left:auto">
          <a class="btn btn-gold btn-sm" href="partners.html">⭐ Partners Lounge</a>
          <a class="btn btn-outline btn-sm" href="live.html">📺 Watch Live</a>
        </div>
      </div>
      <div class="dash-tabs mt2">${tabs.map(t => `<button class="tab ${active === t ? "on" : ""}" data-tab="${t}">${{ profile: "👤 My Profile", library: "📚 My Library", giving: "🙏 My Giving History", class: "🎖 My Membership Class", progress: "🎓 Courses Progress", notifs: "🔔 Notifications" }[t]}</button>`).join("")}</div>
      <div id="dashPane">${sec(active)()}</div>`;
    document.querySelectorAll("[data-tab]", root).forEach(t => t.addEventListener("click", () => { active = t.dataset.tab; paint(); }));
    const save = document.getElementById("pfSave");
    if (save) save.addEventListener("click", () => {
      D.updateMember(m.id, {
        name: document.getElementById("pfName").value.trim() || m.name,
        whatsapp: document.getElementById("pfWa").value.trim(),
        country: document.getElementById("pfCountry").value.trim(),
        city: document.getElementById("pfCity").value.trim(),
        gender: document.getElementById("pfGender").value,
        dob: document.getElementById("pfDob").value
      });
      location.reload();
    });
    const ph = document.getElementById("pfPhoto");
    if (ph) ph.addEventListener("change", () => {
      D.compressImage(ph.files[0], 320, (dataUrl) => { D.updateMember(m.id, { photo: dataUrl }); location.reload(); });
    });
    const lo = document.getElementById("pfLogout");
    if (lo) lo.addEventListener("click", () => { D.logout(); location.href = "index.html"; });
  }
  paint();
});
