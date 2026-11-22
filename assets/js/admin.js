/* JCIA Admin Dashboard (localStorage demo — swap for Firebase/Supabase in prod) */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const db = window.JCIAStore.db;
  const panel = $("#panel");

  const PLATFORMS = ["facebook", "youtube", "instagram", "tiktok"];
  const METHODS = ["PayPal", "Card (Stripe)", "Paynow", "EcoCash", "Mukuru", "Order via WhatsApp"];

  const PANES = {
    golive: renderGoLive,
    products: renderProducts,
    sales: renderSales,
    members: renderMembers,
    testimonies: renderTestimonies,
    prayers: renderPrayers,
    events: renderEvents,
    notify: renderNotify,
  };

  function renderGoLive() {
    const live = db.get("jcia_live", { isLive: false, youtubeId: "", facebookUrl: "", platforms: ["facebook", "youtube"] });
    panel.innerHTML = `
      <h2 class="mb1" style="font-family:var(--font-head)">Go Live — Multi-Stream</h2>
      <div class="card" style="padding:1.4rem">
        <div class="toggle-row mb1">
          <label class="toggle"><input type="checkbox" id="glIsLive" ${live.isLive ? "checked" : ""}><span class="track"></span></label>
          <b style="font-family:var(--font-head)">SERVICE IS LIVE NOW</b>
          <span id="glState" class="badge ${live.isLive ? "badge-live" : "badge-off"}">${live.isLive ? "ON AIR" : "OFF AIR"}</span>
        </div>
        <div class="form-grid mt2">
          <div class="field"><label>YouTube video / live ID or URL</label><input id="glYt" placeholder="e.g. jHofQWEXAMPLE or full URL" value="${live.youtubeId || ""}"></div>
          <div class="field"><label>Facebook Live URL</label><input id="glFb" placeholder="https://facebook.com/…" value="${live.facebookUrl || ""}"></div>
        </div>
        <h4 class="mt2 mb1">Stream / link to platforms (restream via Restream, castr or OBS multi-RTMP)</h4>
        <div class="flex">${PLATFORMS.map(p => `
          <label class="toggle-row" style="border:1px solid #e3e7ef;padding:.5rem .9rem;border-radius:12px">
            <span style="text-transform:capitalize;font-weight:700">${p}</span>
            <label class="toggle"><input type="checkbox" data-plat="${p}" ${live.platforms.includes(p) ? "checked" : ""}><span class="track"></span></label>
          </label>`).join("")}
        </div>
        <button class="btn btn-gold mt2" id="glSave">Save & Publish</button>
        <p class="form-note mt1">Tip: stream once through Restream.io / Castr to simulcast on all enabled platforms; embed the primary player here.</p>
      </div>`;
    $("#glSave").addEventListener("click", () => {
      const ytRaw = $("#glYt").value.trim();
      const id = ytRaw.includes("youtu") ? (ytRaw.match(/(?:v=|be\/|embed\/|live\/)([\w-]{6,})/) || [])[1] || ytRaw : ytRaw;
      db.set("jcia_live", {
        isLive: $("#glIsLive").checked,
        youtubeId: id, facebookUrl: $("#glFb").value.trim(),
        platforms: $$("[data-plat]").filter(c => c.checked).map(c => c.dataset.plat),
        at: new Date().toISOString(),
      });
      toast("Live config saved ✓ — Live page updates instantly.");
      kpis();
    });
  }

  function renderProducts() {
    const custom = db.get("jcia_products", []);
    const base = window.JCIA.__starter || [];
    panel.innerHTML = `
      <h2 class="mb1" style="font-family:var(--font-head)">Products</h2>
      <div class="card" style="padding:1.4rem">
        <h3>Add New Product</h3>
        <form id="prodForm" class="form mt1">
          <div class="form-grid">
            <div class="field"><label>Title</label><input name="title" required></div>
            <div class="field"><label>Price (USD) — 0 = free</label><input name="price" type="number" min="0" step="0.01" required></div>
          </div>
          <div class="form-grid">
            <div class="field"><label>Category</label><select name="cat">
              <option value="courses">Courses</option><option value="ebooks">eBooks + Audio</option>
              <option value="pdfs">PDFs / Kids</option><option value="videos">Videos</option>
              <option value="audios">Audios</option><option value="ppts">PowerPoints</option></select></div>
            <div class="field"><label>File link / URL (downloads)</label><input name="file" placeholder="https://… or /assets/downloads/file.pdf"></div>
          </div>
          <div class="field"><label>Description</label><textarea name="desc" rows="3" required></textarea></div>
          <div class="form-grid">
            <div class="field"><label>Cover image URL (optional)</label><input name="cover" placeholder="assets/img/…"></div>
            <div class="field"><label>Icon emoji (optional)</label><input name="icon" placeholder="🎯" maxlength="4"></div>
          </div>
          <button class="btn btn-gold" type="submit">Publish Product</button>
        </form>
      </div>
      <h3 class="mt2 mb1">Catalogue (${custom.length} custom)</h3>
      ${custom.map(p => `<div class="list-item">
        <div class="li-main"><b>${p.icon || "🎯"} ${p.title}</b><span>$${p.price} · ${p.cat}</span></div>
        <button class="btn btn-sm" data-del="${p.id}" style="border:none;color:#b91c1c;font-weight:700">Delete</button>
      </div>`).join("") || '<p class="muted small">No custom products yet — starter products live in store.js.</p>'}`;
    $("#prodForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(e.target).entries());
      const list = db.get("jcia_products", []);
      list.push({ id: "p" + Date.now(), ...fd, price: +fd.price, author: "Apostle Tee Daniel Brilliant" });
      db.set("jcia_products", list);
      toast("Product published ✓ — live in the Academy");
      render("products"); kpis();
    });
    $$("[data-del]").forEach(b => b.addEventListener("click", () => {
      db.set("jcia_products", db.get("jcia_products", []).filter(p => p.id !== b.dataset.del));
      render("products");
    }));
  }

  function renderSales() {
    const orders = db.get("jcia_orders", []);
    const gives = db.get("jcia_givings", []);
    const sales = orders.reduce((s, o) => s + o.total, 0);
    panel.innerHTML = `
      <h2 class="mb1" style="font-family:var(--font-head)">Sales & Giving</h2>
      <div class="kpis">
        <div class="kpi"><b>$${sales}</b><span>Product sales</span></div>
        <div class="kpi"><b>${orders.length}</b><span>Orders</span></div>
        <div class="kpi"><b>$${gives.reduce((s, g) => s + (+g.Amount || 0), 0)}</b><span>Giving received</span></div>
        <div class="kpi"><b>${gives.length}</b><span>Giving transactions</span></div>
      </div>
      <h3 class="mt2 mb1">Orders</h3>
      <div class="table-scroll"><table class="table"><tr><th>When</th><th>Buyer</th><th>Method</th><th>Items</th><th>Total</th></tr>
      ${orders.map(o => `<tr><td>${new Date(o.at).toLocaleString()}</td><td>${o.name}<br><span class="muted small">${o.email}</span></td><td>${o.method}</td><td>${o.items.join(", ")}</td><td><b>$${o.total}</b></td></tr>`).join("") || '<tr><td colspan="5" class="muted">No orders yet.</td></tr>'}
      </table></div>
      <h3 class="mt2 mb1">Giving</h3>
      <div class="table-scroll"><table class="table"><tr><th>When</th><th>Partner</th><th>Type</th><th>Method</th><th>Amount</th></tr>
      ${gives.map(g => `<tr><td>${new Date(g.at).toLocaleString()}</td><td>${g.Name}</td><td>${g.Purpose} (${g.Frequency})</td><td>${g.Method}</td><td><b>$${g.Amount}</b></td></tr>`).join("") || '<tr><td colspan="5" class="muted">No giving recorded yet.</td></tr>'}
      </table></div>`;
  }

  function renderMembers() {
    const ms = db.get("jcia_members", []);
    panel.innerHTML = `
      <h2 class="mb1" style="font-family:var(--font-head)">Members (${ms.length})</h2>
      <div class="table-scroll"><table class="table"><tr><th>Name</th><th>Email</th><th>Plan</th><th>Joined</th></tr>
      ${ms.map(m => `<tr><td>${m.name}</td><td>${m.email}</td><td><span class="badge ${m.plan === "disciple" ? "badge-live" : "badge-ok"}">${m.plan}</span></td><td>${new Date(m.at).toLocaleDateString()}</td></tr>`).join("") || '<tr><td colspan="4" class="muted">No members yet.</td></tr>'}
      </table></div>
      <p class="small muted mt1">Subscribers (newsletter): ${db.get("jcia_subscribers", []).length}</p>`;
  }

  function renderTestimonies() {
    const list = db.get("jcia_testimonies", []);
    panel.innerHTML = `
      <h2 class="mb1" style="font-family:var(--font-head)">Approve Testimonies</h2>
      ${list.map((t, i) => `<div class="list-item">
        <div class="li-main"><b>${t.name} <span class="badge ${t.approved ? "badge-ok" : "badge-pending"}">${t.approved ? "published" : "pending"}</span></b>
        <span>${t.text}</span><span>${t.city || ""} · ${new Date(t.at).toLocaleDateString()}</span></div>
        <div class="flex">${t.approved
      ? `<button class="btn btn-sm" data-un="${i}" style="border:1px solid #ddd">Unpublish</button>`
      : `<button class="btn btn-gold btn-sm" data-ap="${i}">Approve & Publish</button>`}
        <button class="btn btn-sm" data-rej="${i}" style="border:1px solid #ddd">Delete</button></div>
      </div>`).join("") || '<p class="muted">No submissions yet.</p>'}`;
    $$("[data-ap]").forEach(b => b.addEventListener("click", () => { const l = db.get("jcia_testimonies", []); l[+b.dataset.ap].approved = true; db.set("jcia_testimonies", l); toast("Testimony published ✓"); render("testimonies"); }));
    $$("[data-un]").forEach(b => b.addEventListener("click", () => { const l = db.get("jcia_testimonies", []); l[+b.dataset.un].approved = false; db.set("jcia_testimonies", l); render("testimonies"); }));
    $$("[data-rej]").forEach(b => b.addEventListener("click", () => { const l = db.get("jcia_testimonies", []).filter((_, i) => i !== +b.dataset.rej); db.set("jcia_testimonies", l); render("testimonies"); }));
  }

  function renderPrayers() {
    const list = db.get("jcia_prayers", []);
    panel.innerHTML = `
      <h2 class="mb1" style="font-family:var(--font-head)">Prayer Requests (${list.length})</h2>
      ${list.map((p, i) => `<div class="list-item">
        <div class="li-main"><b>${p.name} <span class="badge ${p.shared ? "badge-ok" : "badge-off"}">${p.shared ? "public" : "private"}</span></b><span>${p.request}</span></div>
        <div class="flex">
          <a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent("PRAYER: " + p.name + " — " + p.request)}">Reply on WhatsApp</a>
          <button class="btn btn-sm" data-pr="${i}" style="border:1px solid #ddd">Mark prayed</button>
        </div></div>`).join("") || '<p class="muted">No prayer requests yet.</p>'}`;
    $$("[data-pr]").forEach(b => b.addEventListener("click", () => { const l = db.get("jcia_prayers", []); l.splice(+b.dataset.pr, 1); db.set("jcia_prayers", l); render("prayers"); }));
  }

  function renderEvents() {
    panel.innerHTML = `
      <h2 class="mb1" style="font-family:var(--font-head)">Manage Events Calendar</h2>
      <div class="card" style="padding:1.4rem">
        <form id="evForm" class="form">
          <div class="form-grid">
            <div class="field"><label>Title</label><input name="title" required></div>
            <div class="field"><label>Date</label><input name="date" type="date" required></div>
          </div>
          <div class="form-grid">
            <div class="field"><label>Type</label><select name="type"><option>Service</option><option>Crusade</option><option>Outreach</option><option>Training</option><option>Conference</option></select></div>
            <div class="field"><label>Time</label><input name="time" placeholder="e.g. 9:00 AM"></div>
          </div>
          <div class="field"><label>Location</label><input name="loc" value="The Embassy, Bulawayo"></div>
          <div class="field"><label>Description</label><textarea name="desc" rows="2"></textarea></div>
          <button class="btn btn-gold" type="submit">Add to Calendar</button>
        </form>
      </div>
      <h3 class="mt2 mb1">Custom events added</h3>
      <div id="evList">
      ${(db.get("jcia_events", []).map(e => `<div class="list-item"><div class="li-main"><b>${e.title}</b><span>${e.date} ${e.time} · ${e.loc} · ${e.type}</span></div><button class="btn btn-sm" data-evdel="${e.id}" style="border:1px solid #ddd">Delete</button></div>`).join("") || '<p class="muted small">Editing the static calendar: see build.py EVENTS + README for CMS integration.</p>')}
      </div>`;
    $("#evForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const o = Object.fromEntries(new FormData(e.target).entries());
      const list = db.get("jcia_events", []);
      list.unshift({ ...o, id: "e" + Date.now() });
      db.set("jcia_events", list);
      toast("Event added ✓");
      render("events");
    });
    $$("[data-evdel]").forEach(b => b.addEventListener("click", () => {
      db.set("jcia_events", db.get("jcia_events", []).filter(e => e.id !== b.dataset.evdel));
      render("events");
    }));
  }

  function renderNotify() {
    panel.innerHTML = `
      <h2 class="mb1" style="font-family:var(--font-head)">Notify All Members</h2>
      <div class="card" style="padding:1.4rem">
        <form id="ntf" class="form">
          <div class="field"><label>Title</label><input name="title" placeholder="e.g. 🔴 WE ARE LIVE — Join now!"></div>
          <div class="field"><label>Message</label><textarea name="body" rows="3" required></textarea></div>
          <div class="form-grid">
            <div class="field"><label>Channel</label><select name="chan"><option>Push notification</option><option>Email</option><option>WhatsApp broadcast</option></select></div>
            <div class="field"><label>Audience</label><select name="aud"><option>All members</option><option>Disciple members only</option></select></div>
          </div>
          <button class="btn btn-gold" type="submit">Send 📣</button>
        </form>
        <h4 class="mt2 mb1">Sent notifications</h4>
        <div id="ntfList">${db.get("jcia_notifs", []).map(n => `<div class="list-item"><div class="li-main"><b>${n.title}</b><span>${n.body} · ${n.chan} → ${n.aud} · ${new Date(n.at).toLocaleString()}</span></div></div>`).join("") || '<p class="muted small">Nothing sent yet.</p>'}</div>
        <p class="form-note mt1">Wire this to Firebase Cloud Messaging / EmailJS / WhatsApp Cloud API in production (see README).</p>
      </div>`;
    $("#ntf").addEventListener("submit", (e) => {
      e.preventDefault();
      const o = Object.fromEntries(new FormData(e.target).entries());
      const list = db.get("jcia_notifs", []);
      list.unshift({ ...o, at: new Date().toISOString() });
      db.set("jcia_notifs", list);
      toast("Notification queued ✓");
      render("notify");
    });
  }

  function render(tab) { (PANES[tab] || renderGoLive)(); }
  $$(".admin-tabs .tab").forEach(t => t.addEventListener("click", () => {
    $$(".admin-tabs .tab").forEach(x => x.classList.remove("on"));
    t.classList.add("on");
    render(t.dataset.tab);
  }));

  function kpis() {
    const k = document.getElementById("kpis");
    if (!k) return;
    const lives = db.get("jcia_live", {});
    const orders = db.get("jcia_orders", []);
    k.innerHTML = `
      <div class="kpi"><b>${lives.isLive ? "ON AIR" : "OFF AIR"}</b><span>Live status</span></div>
      <div class="kpi"><b>$${orders.reduce((s, o) => s + o.total, 0)}</b><span>Sales</span></div>
      <div class="kpi"><b>${db.get("jcia_members", []).length}</b><span>Members</span></div>
      <div class="kpi"><b>${db.get("jcia_testimonies", []).filter(t => t.approved).length}</b><span>Testimonies live</span></div>
      <div class="kpi" style="grid-column:1/-1"><b>${db.get("jcia_prayers", []).length}</b><span>Prayer requests awaiting intercession</span></div>`;
  }

  function toast(m) {
    let t = $(".toast");
    if (!t) { t = document.createElement("div"); t.className = "toast";
      t.style.cssText = "position:fixed;top:74px;right:16px;z-index:400;background:#0a1128;color:#d4af37;padding:.7rem 1.1rem;border-radius:10px;font-weight:700";
      document.body.appendChild(t); }
    t.textContent = m; t.style.opacity = 1;
    clearTimeout(t._h); t._h = setTimeout(() => t.style.opacity = 0, 2200);
  }
  kpis();
  render("golive");
})();
