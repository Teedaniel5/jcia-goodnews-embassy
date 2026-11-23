/* JCIA ADMIN (Phase 2) — role-gated full control panel.
   Demo data layer: localStorage. At production swap JCIA_DB + orders for Firestore (README). */
(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const D = () => window.JCIA_DB;
  const S = () => window.JCIAStore;
  const PLATFORMS = ["facebook", "youtube", "instagram", "tiktok"];
  const TABS = [
    ["overview", "📊 Overview"], ["golive", "🔴 Go Live"], ["members", "👥 Members"],
    ["content", "📚 Upload / Products"], ["site", "✏️ Edit Site"], ["sales", "💰 Sales"],
    ["giving", "🙏 Giving & Proofs"], ["testimonies", "✨ Testimonies"], ["prayers", "🕊 Prayer Requests"],
    ["events", "🗓 Events"], ["blog", "📰 Blog Posts"], ["notify", "📣 Notify Members"],
    ["assistant", "🤖 JCIA Assistant"], ["backup", "🗄 Backup"]
  ];
  let TAB = "overview";
  let coverData = "", pickedFile = null, pickedName = "";

  function toast(msg) {
    let t = document.getElementById("jciaToast");
    if (!t) { t = document.createElement("div"); t.id = "jciaToast"; t.className = "toast";
      t.style.cssText = "position:fixed;top:18px;right:18px;z-index:9999;background:#0b1230;color:#f5d67b;border:1px solid #f5d67b;border-radius:12px;padding:.8rem 1.1rem;font-weight:600;box-shadow:0 10px 30px rgba(0,0,0,.4);max-width:320px";
      document.body.appendChild(t); }
    t.textContent = msg; t.style.opacity = "1";
    setTimeout(() => { t.style.opacity = "0"; }, 3200);
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function when(iso) { try { return new Date(iso).toLocaleDateString() + " " + new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } }
  function read(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } }
  function write(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
  function visOptions(sel) {
    const opts = [["everyone", "Everyone"], ["general", "General Members"], ["servants", "Servants"], ["sons", "Sons of the Prophet"], ["partners", "Partners Only"]];
    (D().CLASSES.partner.levels || []).forEach((lv, i) => opts.push(["partner-level:" + i, "Partner Level — " + lv]));
    return opts.map(o => `<option value="${o[0]}"${o[0] === sel ? " selected" : ""}>${o[1]}</option>`).join("");
  }
  function hostListHosted(list) { return list || []; }

  /* ==== Firebase member sync: pull every registered member worldwide into the panel ==== */
  const MKEY = "jcia_members_v2";
  let fbSyncAt = 0, fbSyncMsg = "";
  const fbReady = () => window.JCIA_FB && JCIA_FB.ready();
  function mergeFBMembers(docs) {
    const cls = D().CLASSES;
    const all = read(MKEY, []);
    let added = 0, updated = 0;
    (docs || []).forEach((doc) => {
      if (!doc || !doc.email) return;
      const i = all.findIndex(m => m.id === doc.id || (m.email || "").toLowerCase() === String(doc.email).toLowerCase());
      if (i >= 0) {
        const m = Object.assign({}, all[i]);
        ["name", "email", "whatsapp", "country", "city", "gender", "dob", "photo", "memberClass", "level", "department", "role", "shift", "adminRole", "status", "joined"].forEach(k => { if (doc[k] != null && doc[k] !== "") m[k] = doc[k]; });
        if (!cls[m.memberClass]) m.memberClass = "general";
        if (!cls[m.memberClass].levels.includes(m.level || "")) m.level = cls[m.memberClass].levels[0];
        all[i] = m; updated++;
      } else {
        const mc = cls[doc.memberClass] ? doc.memberClass : "general";
        all.push({ id: doc.id || ("JCIA-" + String(doc.email).substr(0, 4)), name: doc.name || String(doc.email).split("@")[0], email: String(doc.email).toLowerCase(), passwordHash: "fb", whatsapp: doc.whatsapp || "", country: doc.country || "", city: doc.city || "", gender: doc.gender || "", dob: doc.dob || "", photo: doc.photo || "", memberClass: mc, level: cls[mc].levels[0], department: "", role: "", shift: "", adminRole: doc.adminRole || "", status: doc.status || "active", joined: doc.joined || new Date().toISOString(), purchases: [], givings: [], progress: {}, notifsRead: [] });
        added++;
      }
    });
    if (added || updated) write(MKEY, all);
    return { added, updated, total: (docs || []).length };
  }
  function fbSyncMembers(force) {
    if (!fbReady()) { fbSyncMsg = ""; return; }
    if (!force && Date.now() - fbSyncAt < 30000) return;
    fbSyncAt = Date.now();
    JCIA_FB.listDocs("members").then((docs) => {
      const r = mergeFBMembers(docs);
      fbSyncMsg = "\ud83d\udd25 Firebase connected \u2014 " + r.total + " member" + (r.total === 1 ? "" : "s") + " worldwide loaded" + (r.added ? " (" + r.added + " new)" : "");
      render();
    }).catch((e) => {
      fbSyncMsg = "\u26a0 Firebase members sync failed: " + ((e && e.message) || e);
      render();
    });
  }
  const fbMirror = (id, patch) => { if (fbReady()) JCIA_FB.saveDoc("members", id, patch).catch(() => {}); };
  const fbRemove = (id) => { if (fbReady()) JCIA_FB.removeDoc("members", id).catch(() => {}); };

  /* ================= PANES ================= */
  const PANES = {};

  PANES.overview = () => {
    fbSyncMembers();
    const ms = D().members();
    const giv = read("jcia_givings", []), orders = read("jcia_orders", []);
    const money = (a) => Number(a && (a.Amount || a.amount) || 0);
    const week = ms.filter(m => m.joined && (Date.now() - new Date(m.joined).getTime()) < 7 * 864e5).length;
    const gTotal = giv.reduce((s, g) => s + money(g), 0);
    const sTotal = orders.filter(o => o.status === "paid").reduce((s, o) => s + Number(o.total || 0), 0);
    const tes = read("jcia_testimonies", []), pray = read("jcia_prayers", []);
    const byClass = {}; ms.forEach(m => { byClass[m.memberClass || "general"] = (byClass[m.memberClass || "general"] || 0) + 1; });
    $("#panel").innerHTML = `
      <div class="stat-grid">
        <div class="stat-card gold"><b>${ms.length}</b><span>Total Members Worldwide</span></div>
        <div class="stat-card"><b>+${week}</b><span>New This Week</span></div>
        <div class="stat-card"><b>$${gTotal.toFixed(2)}</b><span>Giving Recorded</span></div>
        <div class="stat-card"><b>$${sTotal.toFixed(2)}</b><span>Academy Sales</span></div>
      </div>
      <div class="card mt1"><h3>Members by Class</h3><dl>
        ${Object.keys(D().CLASSES).map(k => `<div class="dl-row"><dt>${D().CLASSES[k].icon} ${D().CLASSES[k].name}</dt><dd>${byClass[k] || 0}</dd></div>`).join("")}
      </dl></div>
      <div class="card mt1"><h3>Moderation Queue</h3><dl>
        <div class="dl-row"><dt>✨ Testimonies awaiting approval</dt><dd>${tes.filter(t => !t.approved && t.status !== "hidden").length}</dd></div>
        <div class="dl-row"><dt>🕊 Prayer requests</dt><dd>${pray.length} (${pray.filter(p => !p.private).length} public)</dd></div>
        <div class="dl-row"><dt>⛔ Blocked members</dt><dd>${ms.filter(m => m.status === "blocked").length}</dd></div>
        <div class="dl-row"><dt>🙏 Proofs awaiting approval</dt><dd>${giv.filter(g => g.status === "pending-approval").length}</dd></div>
      </dl></div>`;
  };

  PANES.golive = () => {
    const live = D().content().live || {};
    $("#panel").innerHTML = `
      <div class="card"><h3>🔴 Go Live — Service Stream Control</h3>
        <p class="small muted">One toggle updates the LIVE NOW badge, player and platform links across the whole site (Restream-style multi-platform).</p>
        <label class="field"><input type="checkbox" id="glIsLive" ${live.isLive ? "checked" : ""} style="width:auto"> <b>WE ARE LIVE NOW (show badge + player)</b></label>
        <div class="field"><label>YouTube Live Video ID (the part after ?v=)</label><input id="glYt" value="${esc(live.youtubeId || "")}" placeholder="e.g. jfKfPfyJRdk"></div>
        <div class="field"><label>Facebook Live URL</label><input id="glFb" value="${esc(live.facebookUrl || "")}" placeholder="https://facebook.com/.../live"></div>
        <div class="field"><label>Stream ON/OFF per platform</label><div class="check-row">
          ${PLATFORMS.map(p => `<label class="check"><input type="checkbox" data-plat="${p}" ${(live.platforms || []).includes(p) ? "checked" : ""} style="width:auto"> ${p[0].toUpperCase() + p.slice(1)}</label>`).join("")}
        </div></div>
        <button class="btn btn-gold" id="glSave">Save Live Settings</button>
      </div>
      <div class="card mt1"><h3>📺 Official Social Page Links (site-wide)</h3>
      <p class="small muted">Also editable in ✏️ Edit Site → Socials. These power the follow bar and Social Hub.</p></div>`;
    $("#glSave").onclick = () => {
      const plats = $$("[data-plat]").filter(c => c.checked).map(c => c.dataset.plat);
      D().setContent({ isLive: $("#glIsLive").checked, youtubeId: $("#glYt").value.trim(), facebookUrl: $("#glFb").value.trim(), platforms: plats }, "live");
      toast("✅ Live settings saved — site updated everywhere");
    };
  };

  PANES.members = () => {
    fbSyncMembers();
    const ms = D().members();
    const q = (sessionStorage.getItem("jcia_member_q") || "");
    const filt = ms.filter(m => !q || [m.name, m.country, m.city, m.email, (m.memberClass || "") + " " + (m.level || "")].join(" ").toLowerCase().includes(q.toLowerCase()));
    const countries = {}; ms.forEach(m => { if (m.country) countries[m.country] = (countries[m.country] || 0) + 1; });
    const cities = {}; ms.forEach(m => { const k = (m.city || "") + " · " + (m.country || ""); if (m.city) cities[k] = (cities[k] || 0) + 1; });
    $("#panel").innerHTML = `
      <div class="stat-grid">
        <div class="stat-card gold"><b>${ms.length}</b><span>Members</span></div>
        <div class="stat-card"><b>${Object.keys(countries).length}</b><span>Countries</span></div>
        <div class="stat-card"><b>${Object.keys(cities).length}</b><span>Cities</span></div>
        <div class="stat-card"><b>${ms.filter(m => m.status === "blocked").length}</b><span>Blocked</span></div>
      </div>
      <div class="card mt1" style="display:flex;gap:.6rem;flex-wrap:wrap;align-items:center">
        <input id="mSearch" class="grow" placeholder="🔍 Search name / country / city / class…" style="flex:1;min-width:220px;padding:.7rem 1rem;border-radius:10px;border:1px solid #e5e7eb" value="${esc(q)}">
        <button class="btn btn-outline btn-sm" id="csvBtn">⬇ Export CSV / Excel</button>
      </div>
      ${Object.keys(countries).length ? `<div class="card mt1"><h3>By Country</h3><dl>${Object.entries(countries).sort((a, b) => b[1] - a[1]).map(e => `<div class="dl-row"><dt>${esc(e[0])}</dt><dd>${e[1]}</dd></div>`).join("")}</dl>
        <h3 class="mt1">By City</h3><dl>${Object.entries(cities).sort((a, b) => b[1] - a[1]).map(e => `<div class="dl-row"><dt>${esc(e[0])}</dt><dd>${e[1]}</dd></div>`).join("")}</dl></div>` : ""}
      ${fbSyncMsg ? `<p class="small muted mt1">${fbSyncMsg}</p>` : ""}
      <div id="mList" class="mt1">${memberRows(filt)}</div>`;
    $("#csvBtn").onclick = () => D().exportCSV();
    $("#mSearch").oninput = (e) => { sessionStorage.setItem("jcia_member_q", e.target.value); PANES.members(); const i2 = $("#mSearch"); i2.focus(); i2.setSelectionRange(i2.value.length, i2.value.length); };
  };

  function memberRows(filt) {
    return filt.map(m => `<div class="card m-card" style="padding:1rem;margin-bottom:.8rem">
      <div style="display:flex;gap:.8rem;align-items:center;flex-wrap:wrap">
        ${m.photo ? `<img src="${m.photo}" alt="" style="width:46px;height:46px;border-radius:50%;object-fit:cover;border:2px solid var(--gold)">` : `<span style="width:46px;height:46px;border-radius:50%;background:var(--navy);color:#fff;display:inline-flex;align-items:center;justify-content:center;object-fit:cover">👤</span>`}
        <b>${esc(m.name)}</b> <span class="muted small">${esc(m.id)}</span>
        <span class="class-badge cb-${esc(m.memberClass || "general")}">${esc(D().CLASSES[m.memberClass] ? D().CLASSES[m.memberClass].name : "General")} · ${esc(m.level || "")}</span>
        ${m.adminRole ? `<span class="class-badge cb-admin">${esc(m.adminRole)}</span>` : ""}
        <span class="class-badge ${m.status === "blocked" ? "cb-partner" : "cb-general"}">${m.status || "active"}</span>
      </div>
      <p class="small mt1">✉️ ${esc(m.email || "—")} · 📱 ${esc(m.whatsapp || "—")} · 📍 ${esc(m.city || "")}, ${esc(m.country || "")} · ${esc(m.gender || "")} ${m.dob ? "· 🎂 " + esc(m.dob) : ""} · 📅 joined ${when(m.joined)}</p>
      <div class="mt1" style="display:flex;gap:.5rem;flex-wrap:wrap;align-items:center">
        <select data-cls="${m.id}" style="padding:.4rem;border-radius:8px">${Object.keys(D().CLASSES).map(k => `<option value="${k}"${m.memberClass === k ? " selected" : ""}>${D().CLASSES[k].name}</option>`).join("")}</select>
        <select data-lvl="${m.id}" style="padding:.4rem;border-radius:8px">${(D().CLASSES[m.memberClass] ? D().CLASSES[m.memberClass].levels : ["Member"]).map(l => `<option${m.level === l ? " selected" : ""}>${l}</option>`).join("")}</select>
        <button class="btn btn-outline btn-sm" data-role-btn="${m.id}">🛡 Role</button>
        <button class="btn btn-outline btn-sm" data-blk="${m.id}">${m.status === "blocked" ? "Unblock" : "Block"}</button>
        <button class="btn btn-outline btn-sm" data-del="${m.id}" style="border-color:#dc2626;color:#b91c1c">🗑 Remove</button>
      </div>
    </div>`).join("") || `<p class="muted">No members found.</p>`;
  }

  PANES.content = () => {
    $("#panel").innerHTML = `
      <div class="card"><h3>📚 Upload ANY File — Sell or Give Free</h3>
        <p class="small muted">PDF, MP3, MP4, PPT, PPTX, DOC, DOCX, XLS, JPG, PNG, ZIP — up to 500MB demo storage (connect Firebase Storage / Cloudinary for real hosting, README ▸ Uploads).</p>
        <div id="drop" class="upload-drop">⬆️ <b>Click or drop the file here</b><div class="small muted" id="upName">No file chosen</div>
          <input type="file" id="fIn" hidden>
          <div class="progress-thin mt1" style="display:none"><i id="upProg"></i></div><div id="upStatus" class="small muted"></div>
        </div>
        <form class="form mt1" id="upForm">
          <div class="field"><label>Title</label><input name="title" required></div>
          <div class="field"><label>Description</label><textarea name="desc" rows="2"></textarea></div>
          <div style="display:flex;gap:.8rem;flex-wrap:wrap">
            <div class="field" style="flex:1;min-width:140px"><label>Price USD (0 = FREE)</label><input name="price" type="number" min="0" step="0.01" value="0"></div>
            <div class="field" style="flex:1;min-width:180px"><label>Category</label><select name="cat">
              <option value="courses">Course</option><option value="ebooks">eBook</option><option value="pdfs">PDF / Study Guide</option>
              <option value="videos">Video (MP4)</option><option value="audios">Audio (MP3)</option>
              <option value="ppts">PowerPoint</option><option value="files">Other File</option></select></div>
            <div class="field" style="flex:1;min-width:220px"><label>Visibility — who can see & buy</label><select name="visibility">${visOptions("everyone")}</select></div>
          </div>
          <div class="field"><label>Cover Image (JPG/PNG — auto-compressed)</label><input type="file" id="coverIn" accept="image/*"></div>
          <div id="coverPrev" class="mt1"></div>
          <div style="display:flex;gap:.8rem;flex-wrap:wrap">
            <div class="field"><label>Image Position</label><select name="imgPos"><option value="pos-center">Center</option><option value="pos-top">Top</option><option value="pos-bottom">Bottom</option></select></div>
            <div class="field"><label>Image Size</label><select name="imgSize"><option value="m-md">Medium</option><option value="m-sm">Small</option><option value="m-lg">Large</option><option value="m-full">Full</option></select></div>
            <div class="field"><label>Frame</label><select name="imgFrame"><option value="1">Gold frame + rounded</option><option value="0">Plain</option></select></div>
          </div>
          <button class="btn btn-gold" type="submit">🚀 Publish to Academy</button>
        </form>
      </div>
      <div class="card mt1"><h3>🗂 Published Products & Files</h3><div id="hostList"></div></div>`;
    const drop = $("#drop"), fIn = $("#fIn");
    drop.addEventListener("click", () => fIn.click());
    drop.addEventListener("dragover", e => { e.preventDefault(); drop.classList.add("drag"); });
    drop.addEventListener("dragleave", () => drop.classList.remove("drag"));
    drop.addEventListener("drop", e => { e.preventDefault(); drop.classList.remove("drag"); pick(e.dataTransfer.files[0]); });
    fIn.onchange = () => pick(fIn.files[0]);
    function pick(f) {
      if (!f) return;
      if (f.size > 500 * 1024 * 1024) { $("#upStatus").innerHTML = "⛔ File is larger than 500MB. Compress it or host it on YouTube and paste the link in the description."; pickedFile = null; return; }
      pickedFile = f; $("#upName").textContent = "✅ " + f.name + " (" + (f.size / 1048576).toFixed(1) + " MB)";
      const bar = drop.querySelector(".progress-thin"); bar.style.display = "block";
      let p = 0; const iv = setInterval(() => { p = Math.min(100, p + 12 + Math.random() * 12); $("#upProg").style.width = p + "%";
        if (p >= 100) { clearInterval(iv); $("#upStatus").innerHTML = "✅ " + f.name + " picked for upload (" + (f.size / 1048576).toFixed(1) + " MB)"; } }, 120);
    }
    $("#coverIn").onchange = function () { const f = this.files[0]; if (f) D().compressImage(f, 800, (d) => { coverData = d; $("#coverPrev").innerHTML = `<img src="${d}" alt="" style="max-width:200px;border-radius:12px">`; }); };
    $("#upForm").onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const o = {
        id: "u" + Date.now(), title: fd.get("title"), desc: fd.get("desc"),
        price: Number(fd.get("price") || 0), cat: fd.get("cat"), type: fd.get("cat"),
        visibility: fd.get("visibility"), icon: "📦", cover: coverData, downloads: 0,
        imgPos: fd.get("imgPos"), imgSize: fd.get("imgSize"), imgFrame: fd.get("imgFrame") === "1"
      };
      if (pickedFile) {
        o.fileName = pickedFile.name; o.fileSize = pickedFile.size;
        if (window.JCIA_FB && JCIA_FB.ready()) {
          $("#upStatus").textContent = "Uploading to Firebase Storage…";
          try {
            const up = await JCIA_FB.upload(pickedFile, "products/" + o.id + "_" + pickedFile.name, (p) => { $("#upProg").style.width = Math.round(p * 100) + "%"; });
            o.file = up.url; o.storagePath = up.path;
            $("#upStatus").textContent = "✅ Uploaded to Firebase Storage";
          } catch (err) { $("#upStatus").textContent = "⚠️ Storage upload failed (" + (err && err.message ? err.message : err) + ") — published in demo mode instead."; }
        }
      }
      if (window.JCIA_FB && JCIA_FB.ready()) { try { await JCIA_FB.saveDoc("products", o.id, { title: o.title, desc: o.desc, price: o.price, cat: o.cat, visibility: o.visibility }); } catch (e2) { } }
      const c = D().content(); c.products = [o].concat(c.products || []); D().setContent({ products: c.products });
      toast("✅ Published: " + o.title);
      PANES.content();
    };
    renderHostList();
  };

  function renderHostList() {
    const list = hostListHosted((D().content().products || []).concat(read("jcia_products", [])));
    $("#hostList").innerHTML = list.map(p => `<div class="dl-row" style="align-items:center">
      <dt>${p.cover ? `<img src="${p.cover}" style="width:40px;height:40px;object-fit:cover;border-radius:8px"> ` : "📦 "}${esc(p.title)} <span class="muted small">· ${esc(p.cat || p.type || "")} · ${p.price ? "$" + p.price : "FREE"} · ${D().visLabel(p.visibility || "everyone")}</span></dt>
      <dd style="display:flex;gap:.4rem">
        <button class="btn btn-outline btn-sm" data-repl="${p.id}" data-store="${p._store || ""}">🖼 Replace media</button>
        <button class="btn btn-outline btn-sm" style="border-color:#dc2626;color:#b91c1c" data-delp="${p.id}">🗑</button>
      </dd></div>`).join("") || `<p class="muted">Nothing yet.</p>`;
    $$("[data-delp]").forEach(b => b.onclick = () => {
      if (!confirm("Delete this item permanently?")) return;
      const id = b.dataset.delp;
      D().setContent({ products: (D().content().products || []).filter(x => x.id !== id) });
      write("jcia_products", read("jcia_products", []).filter(x => x.id !== id));
      toast("🗑 Deleted"); renderHostList();
    });
    $$("[data-repl]").forEach(b => b.onclick = () => {
      const inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/*";
      inp.onchange = () => D().compressImage(inp.files[0], 800, (d) => {
        const id = b.dataset.repl;
        const contentProducts = (D().content().products || []).map(x => x.id === id ? Object.assign({}, x, { cover: d }) : x);
        D().setContent({ products: contentProducts });
        write("jcia_products", read("jcia_products", []).map(x => x.id === id ? Object.assign({}, x, { cover: d }) : x));
        toast("🖼 Media replaced"); renderHostList();
      });
      inp.click();
    });
  }

  PANES.site = () => {
    const c = D().content(), s = c.site, so = c.socials || {}, g = c.giving || {};
    const F = (id, label, val, ta) => `<div class="field grow"><label>${label}</label>${ta ? `<textarea id="${id}" rows="3">${esc(val || "")}</textarea>` : `<input id="${id}" value="${esc(val || "")}">`}</div>`;
    $("#panel").innerHTML = `
      <div class="card"><h3>✏️ Core Site Text (updates every page live)</h3><div style="display:flex;flex-wrap:wrap;gap:.6rem">
        ${F("sHeroT", "Hero Title (HTML allowed)", s.heroTitle)}${F("sHeroS", "Hero Subtitle", s.heroSub, 1)}
        ${F("sVision", "Vision (verbatim)", s.vision, 1)}${F("sMission", "Mission (verbatim)", s.mission, 1)}
        ${F("sBio", "Apostle Bio", s.apostleBio, 1)}${F("sTimes", "Service Times", s.serviceTimes)}
        ${F("sEmail", "Contact Email", s.contactEmail)}${F("sWaD", "WhatsApp Display", s.contactWhatsApp)}${F("sWa", "WhatsApp Number (263…)", s.whatsapp)}
      </div><button class="btn btn-gold mt1" id="saveCore">💾 Save Site Text</button></div>
      <div class="card mt1"><h3>📶 Socials — official URLs, follower counts, YouTube Live ID</h3><div style="display:flex;flex-wrap:wrap;gap:.6rem">
        ${F("soFb", "Facebook URL", so.facebook)}${F("soFbN", "Facebook followers (display)", so.facebookFollowers)}
        ${F("soYt", "YouTube URL", so.youtube)}${F("soYtN", "YouTube followers (display)", so.youtubeFollowers)}
        ${F("soIg", "Instagram URL", so.instagram)}${F("soIgN", "Instagram followers (display)", so.instagramFollowers)}
        ${F("soTk", "TikTok URL", so.tiktok)}${F("soTkN", "TikTok followers (display)", so.tiktokFollowers)}
        ${F("soLive", "YouTube Live Video ID (site-wide live player)", so.youtubeLiveId)}
      </div><button class="btn btn-gold mt1" id="saveSocial">💾 Save Socials</button></div>
      <div class="card mt1"><h3>🙏 Giving Details (shown on Give page & checkout)</h3><div style="display:flex;flex-wrap:wrap;gap:.6rem">
        ${F("gEco", "EcoCash Number", g.ecocash)}${F("gBank", "Bank Name", g.bank)}${F("gAcc", "Bank Account", g.bankAccount)}
        ${F("gPay", "Paynow Details", g.paynow)}${F("gMuk", "Mukuru Details", g.mukuru)}${F("gPp", "PayPal Email", g.paypal)}
      </div><button class="btn btn-gold mt1" id="saveGiving">💾 Save Giving Details</button></div>
      <div class="card mt1"><h3>🎓 Academy Starter Product Prices (USD)</h3>${starterPriceRows(c)}</div>
      <div class="card mt1"><h3>🔥 Firebase (FREE Spark Plan — real accounts, database, storage)</h3>
        <p class="small muted">Paste your Firebase web app config. Until then the site runs the locked demo mode on this browser.</p>
        <div id="fbStatus" class="class-badge cb-general" style="display:inline-block">checking…</div>
        <div style="display:flex;flex-wrap:wrap;gap:.6rem" class="mt1">
          ${F("fbKey", "apiKey", (window.JCIA_FB && JCIA_FB.cfg() && JCIA_FB.cfg().apiKey) || "")}
          ${F("fbDomain", "authDomain", (window.JCIA_FB && JCIA_FB.cfg() && JCIA_FB.cfg().authDomain) || "")}
          ${F("fbProj", "projectId", (window.JCIA_FB && JCIA_FB.cfg() && JCIA_FB.cfg().projectId) || "")}
          ${F("fbBucket", "storageBucket", (window.JCIA_FB && JCIA_FB.cfg() && JCIA_FB.cfg().storageBucket) || "")}
          ${F("fbSender", "messagingSenderId", (window.JCIA_FB && JCIA_FB.cfg() && JCIA_FB.cfg().messagingSenderId) || "")}
          ${F("fbApp", "appId", (window.JCIA_FB && JCIA_FB.cfg() && JCIA_FB.cfg().appId) || "")}
        </div>
        <div style="display:flex;gap:.6rem;flex-wrap:wrap" class="mt1">
          <button class="btn btn-gold" id="fbSave">💾 Save &amp; Connect</button>
          <button class="btn btn-outline" id="fbTest">🔌 Test Connection</button>
          <button class="btn btn-outline" id="fbClear" style="border-color:#dc2626;color:#b91c1c">Disconnect</button>
        </div>
        <details class="acc mt1"><summary>📖 How to connect Firebase — step by step (free)</summary><div class="acc-body">
          <ol style="text-align:left;padding-left:1.2rem">
            <li>Go to <b>console.firebase.google.com</b> → <b>Add project</b> → name it (e.g. <i>jcia-goodnews-embassy</i>) → continue (Analytics optional) → Create.</li>
            <li>Click the <b>Web icon (&lt;/&gt;)</b> to add a web app → nickname it → <b>Register app</b>.</li>
            <li>Copy the shown <b>firebaseConfig</b> values (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).</li>
            <li>Paste each value above → <b>Save &amp; Connect</b>. Status turns green when connected.</li>
            <li>Enable what you need (generous free tiers): <b>Authentication</b> → Sign-in method → enable <b>Email/Password</b> and <b>Google</b>; <b>Firestore Database</b> → Create database; <b>Storage</b> → Get started.</li>
            <li>Authentication → Settings → <b>Authorized domains</b> → add <b>jcia-goodnews-embassy.vercel.app</b>.</li>
          </ol>
        </div></details>
      </div>`;
    $("#saveCore").onclick = () => {
      D().setContent({ heroTitle: $("#sHeroT").value.trim(), heroSub: $("#sHeroS").value.trim(), vision: $("#sVision").value.trim(), mission: $("#sMission").value.trim(), apostleBio: $("#sBio").value.trim(), serviceTimes: $("#sTimes").value.trim(), contactEmail: $("#sEmail").value.trim(), contactWhatsApp: $("#sWaD").value.trim(), whatsapp: $("#sWa").value.trim().replace(/\D/g, "") }, "site");
      toast("✅ Site text saved");
    };
    $("#saveSocial").onclick = () => {
      D().setContent({ facebook: $("#soFb").value.trim(), facebookFollowers: $("#soFbN").value.trim(), youtube: $("#soYt").value.trim(), youtubeFollowers: $("#soYtN").value.trim(), instagram: $("#soIg").value.trim(), instagramFollowers: $("#soIgN").value.trim(), tiktok: $("#soTk").value.trim(), tiktokFollowers: $("#soTkN").value.trim(), youtubeLiveId: $("#soLive").value.trim() }, "socials");
      toast("✅ Socials saved everywhere");
    };
    $("#saveGiving").onclick = () => {
      D().setContent({ ecocash: $("#gEco").value.trim(), bank: $("#gBank").value.trim(), bankAccount: $("#gAcc").value.trim(), paynow: $("#gPay").value.trim(), mukuru: $("#gMuk").value.trim(), paypal: $("#gPp").value.trim() }, "giving");
      toast("✅ Giving details saved");
    };
    const fbSt = $("#fbStatus");
    if (fbSt && window.JCIA_FB) {
      const paintFb = (s) => {
        fbSt.textContent = s === "connected" ? "🔥 Connected — real Firebase Auth + Firestore + Storage" : (String(s).indexOf("error") === 0 ? "⛔ " + s : (s === "not-configured" ? "Not configured — demo mode" : s));
      };
      JCIA_FB.onStatus(paintFb); paintFb(JCIA_FB.statusNow());
      $("#fbSave").onclick = async () => {
        await JCIA_FB.saveConfig({ apiKey: $("#fbKey").value, authDomain: $("#fbDomain").value, projectId: $("#fbProj").value, storageBucket: $("#fbBucket").value, messagingSenderId: $("#fbSender").value, appId: $("#fbApp").value });
        paintFb(JCIA_FB.statusNow());
        toast(JCIA_FB.statusNow() === "connected" ? "🔥 Firebase connected — real Auth, Firestore & Storage are live" : "⛔ Firebase: " + (JCIA_FB.statusNow() === "not-configured" ? "config incomplete (apiKey, projectId and appId required)" : JCIA_FB.statusNow()));
      };
      $("#fbTest").onclick = async () => {
        await JCIA_FB.activate();
        paintFb(JCIA_FB.statusNow());
        const s = JCIA_FB.statusNow();
        toast(s === "connected" ? "🔌 Connection verified — project " + (JCIA_FB.cfg() && JCIA_FB.cfg().projectId) : "⛔ Firebase test: " + (s === "not-configured" ? "no config saved yet — paste it above and Save & Connect" : s + (JCIA_FB.lastError() ? " — check each field (appId often missed)" : "")));
      };
      $("#fbClear").onclick = () => { if (!confirm("Disconnect Firebase from this site?")) return; JCIA_FB.clearConfig(); paintFb("not-configured"); toast("Disconnected — demo mode"); };
    }
    $$("[data-saveprice]").forEach(b => b.onclick = () => {
      const id = b.dataset.saveprice, v = Number(document.querySelector('[data-price="' + id + '"]').value || 0);
      write("jcia_products", read("jcia_products", []).map(x => x.id === id ? Object.assign({}, x, { price: v }) : x));
      const patch = {}; patch["starterPrice_" + id] = v; D().setContent(patch);
      const over = read("jcia_price_overrides", {}); over[id] = v; write("jcia_price_overrides", over);
      toast("🎓 Price updated: $" + v);
    });
  };

  function starterPriceRows(c) {
    const starters = [["devotional-7days", "7 Days of Good News Devotional"], ["discipleship-101", "JCIA Discipleship 101 Course"], ["spiritual-intelligence", "Spiritual Intelligence Activation"], ["50-preaching-ppts", "50 Preaching PPTs + Sermon Notes"], ["kids-bible-lessons", "JCIA Kids Bible Lessons"]];
    return starters.map(([id, title]) => {
      const p = read("jcia_products", []).find(x => x.id === id);
      const val = p ? p.price : (c["starterPrice_" + id] != null ? c["starterPrice_" + id] : "");
      return `<div class="dl-row" style="align-items:center"><dt>${esc(title)}</dt><dd style="display:flex;gap:.4rem;align-items:center">
        <input data-price="${id}" type="number" min="0" step="0.01" value="${val}" style="width:90px;padding:.4rem;border-radius:8px;border:1px solid #e5e7eb">
        <button class="btn btn-outline btn-sm" data-saveprice="${id}">Save</button></dd></div>`;
    }).join("");
  }

  PANES.sales = () => {
    const orders = read("jcia_orders", []);
    const paid = orders.filter(o => o.status === "paid");
    const total = paid.reduce((s, o) => s + Number(o.total || 0), 0);
    $("#panel").innerHTML = `
      <div class="stat-grid">
        <div class="stat-card gold"><b>$${total.toFixed(2)}</b><span>Paid Revenue</span></div>
        <div class="stat-card"><b>${orders.length}</b><span>Orders</span></div>
        <div class="stat-card"><b>${paid.length}</b><span>Paid</span></div>
        <div class="stat-card"><b>${orders.filter(o => o.status !== "paid").length}</b><span>Pending / Failed</span></div>
      </div>
      <div class="card mt1"><h3>💰 Orders</h3>
        ${orders.map(o => `<div class="dl-row"><dt><span class="ref-code">${esc(o.ref || "")}</span> ${esc((o.items || []).map(i => i.title || i.id).join(", "))} <span class="muted small">${esc(o.method || "")} · ${when(o.at)}</span></dt>
        <dd><b>$${Number(o.total || 0).toFixed(2)}</b> <span class="muted small">${esc((o.name || "") + " " + (o.email || "") + " " + (o.whatsapp || ""))}</span>
        <span class="class-badge ${o.status === "paid" ? "cb-general" : "cb-partner"}">${esc(o.status || "")}</span></dd></div>`).join("") || `<p class="muted">No sales yet.</p>`}
      </div>`;
  };

  PANES.giving = () => {
    const giv = read("jcia_givings", []);
    const total = giv.filter(g => g.status === "approved").reduce((s, g) => s + Number(g.Amount || g.amount || 0), 0);
    $("#panel").innerHTML = `
      <div class="stat-grid">
        <div class="stat-card gold"><b>$${total.toFixed(2)}</b><span>Approved Total</span></div>
        <div class="stat-card"><b>${giv.length}</b><span>Transactions</span></div>
        <div class="stat-card"><b>${giv.filter(g => g.status === "pending-approval").length}</b><span>Awaiting Proof Approval</span></div>
      </div>
      <div class="card mt1"><h3>🙏 Giving Transactions</h3>
      ${giv.map(g => `${g.proof ? `<img src="${g.proof}" alt="proof" style="width:90px;max-height:70px;object-fit:cover;border-radius:8px"> ` : ""}<div class="dl-row">
        <dt><span class="ref-code">${esc(g.ref || g.Ref || "")}</span> ${esc(g.Type || g.type || "")} · $${Number(g.Amount || g.amount || 0).toFixed(2)} · ${esc(g.Method || g.method || "")} <span class="muted small">${esc(g.Name || g.name || "")} · ${when(g.at || g.date)}</span></dt>
        <dd><span class="class-badge ${g.status === "approved" ? "cb-general" : (g.status === "rejected" ? "cb-partner" : "cb-servant")}">${esc(g.status || "received")}</span>
        ${g.status !== "approved" && g.status !== "rejected" ? `<button class="btn btn-outline btn-sm" data-ap-g="${esc(g.ref || g.Ref || "")}">✅ Approve + Receipt</button>
        <button class="btn btn-outline btn-sm" data-rej-g="${esc(g.ref || g.Ref || "")}" style="border-color:#dc2626;color:#b91c1c">Reject</button>` : ""}</dd></div>`).join("") || `<p class="muted">No giving recorded yet.</p>`}
      </div>`;
    $$("[data-ap-g]").forEach(b => b.onclick = () => {
      approveGiving(b.dataset.apG || b.dataset["ap-g"] || b.getAttribute("data-ap-g"), "approved");
      toast("✅ Giving approved — receipt issued to member");
      PANES.giving();
    });
    $$("[data-rej-g]").forEach(b => b.onclick = () => {
      approveGiving(b.getAttribute("data-rej-g"), "rejected"); toast("Rejected"); PANES.giving();
    });
  };

  function approveGiving(ref, status) {
    const all = read("jcia_givings", []);
    const g = all.find(x => (x.ref || x.Ref) === ref); if (!g) return;
    g.status = status; write("jcia_givings", all);
    const ms = D().members(); const m = ms.find(x => x.id === g.memberId);
    if (m) { m.givings = (m.givings || []).map(x => (x.ref || x.Ref) === ref ? Object.assign({}, x, { status }) : x); D().updateMember(m.id, { givings: m.givings }); }
    D().notify("Giving " + (status === "approved" ? "Approved ✅" : "Rejected"), (g.ref || g.Ref) + " — " + (g.Type || g.type || "") + " $" + (g.Amount || g.amount || 0), "all");
  }

  PANES.testimonies = () => {
    const tes = read("jcia_testimonies", []);
    $("#panel").innerHTML = `<div class="card"><h3>✨ Testimonies</h3>
      ${tes.map((t, i) => `<div class="dl-row"><dt>“${esc(t.text || "")}” <span class="muted small">— ${esc(t.name || "Anonymous")} · ${when(t.at)}</span></dt>
      <dd><span class="class-badge ${t.approved ? "cb-general" : "cb-servant"}">${t.approved ? "live" : "pending"}</span>
      <button class="btn btn-outline btn-sm" data-tes="${i}">${t.approved ? "Unpublish" : "Approve"}</button>
      <button class="btn btn-outline btn-sm" data-tesdel="${i}" style="border-color:#dc2626;color:#b91c1c">🗑</button></dd></div>`).join("") || `<p class="muted">None yet.</p>`}</div>`;
    $$("[data-tes]").forEach(b => b.onclick = () => {
      const t = read("jcia_testimonies", []); const i = Number(b.dataset.tes);
      t[i].approved = !t[i].approved; write("jcia_testimonies", t); toast("Updated"); PANES.testimonies();
    });
    $$("[data-tesdel]").forEach(b => b.onclick = () => {
      if (!confirm("Delete this testimony?")) return;
      const t = read("jcia_testimonies", []); t.splice(Number(b.dataset.tesdel), 1); write("jcia_testimonies", t); PANES.testimonies();
    });
  };

  PANES.prayers = () => {
    const pray = read("jcia_prayers", []);
    $("#panel").innerHTML = `<div class="card"><h3>🕊 Prayer Requests</h3>
      ${pray.map((p, i) => `<div class="dl-row"><dt>${esc(p.request || p.text || "")} <span class="muted small">— ${esc(p.name || "")} · ${p.private ? "🔒 Private" : "🌍 Public"} · ${when(p.at)}</span></dt>
      <dd>${p.whatsapp ? `<a class="btn btn-outline btn-sm" href="https://wa.me/${String(p.whatsapp).replace(/\D/g, "")}" target="_blank" rel="noopener">Reply</a>` : ""}
      <button class="btn btn-outline btn-sm" data-pry="${i}">✅ Mark prayed</button>
      <button class="btn btn-outline btn-sm" data-prydel="${i}" style="border-color:#dc2626;color:#b91c1c">🗑</button></dd></div>`).join("") || `<p class="muted">None yet.</p>`}</div>`;
    $$("[data-pry]").forEach(b => b.onclick = () => { const t = read("jcia_prayers", []); t[Number(b.dataset.pry)].done = true; write("jcia_prayers", t); toast("Marked prayed"); PANES.prayers(); });
    $$("[data-prydel]").forEach(b => b.onclick = () => { const t = read("jcia_prayers", []); t.splice(Number(b.dataset.prydel), 1); write("jcia_prayers", t); PANES.prayers(); });
  };

  PANES.events = () => {
    const ev = (D().content().events || []).concat(read("jcia_events", []));
    $("#panel").innerHTML = `<div class="card"><h3>🗓 Create Event</h3>
      <form class="form" id="evForm">
        <div class="field"><label>Title</label><input name="title" required></div>
        <div style="display:flex;gap:.6rem;flex-wrap:wrap">
          <div class="field grow"><label>Date</label><input name="date" type="date" required></div>
          <div class="field grow"><label>Type</label><select name="type"><option>Service</option><option>Crusade</option><option>Outreach</option><option>Training</option><option>Conference</option></select></div>
          <div class="field grow"><label>Time</label><input name="time" placeholder="9:00 AM"></div>
          <div class="field grow"><label>Visibility</label><select name="visibility">${visOptions("everyone")}</select></div>
        </div>
        <div class="field"><label>Location</label><input name="loc" value="The Embassy, Bulawayo"></div>
        <div class="field"><label>Description</label><textarea name="desc" rows="2"></textarea></div>
        <button class="btn btn-gold">Publish Event</button>
      </form></div>
      <div class="card mt1"><h3>🗓 Events (${ev.length})</h3>
      ${ev.map(e => `<div class="dl-row"><dt>${esc(e.title || e.id)} · ${esc(e.type || "")} · ${esc(e.date || "")} <span class="muted small">${esc(e.loc || "")}</span></dt>
      <dd>${e.id ? `<button class="btn btn-outline btn-sm" data-evdel="${esc(e.id)}">🗑</button>` : `<span class="muted small">starter event</span>`}</dd></div>`).join("")}</div>`;
    $("#evForm").onsubmit = (e2) => {
      e2.preventDefault(); const fd = new FormData(e2.target);
      const o = { id: "e" + Date.now(), title: fd.get("title"), date: fd.get("date"), type: fd.get("type"), time: fd.get("time"), loc: fd.get("loc"), desc: fd.get("desc"), visibility: fd.get("visibility") };
      D().setContent({ events: [o].concat(D().content().events || []) }); toast("🗓 Event published"); PANES.events();
    };
    $$("[data-evdel]").forEach(b => b.onclick = () => {
      D().setContent({ events: (D().content().events || []).filter(x => x.id !== b.dataset.evdel) });
      write("jcia_events", read("jcia_events", []).filter(x => x.id !== b.dataset.evdel)); toast("🗑 Event removed"); PANES.events();
    });
  };

  PANES.blog = () => {
    const posts = D().content().posts || [];
    $("#panel").innerHTML = `<div class="card"><h3>📰 New Post / Devotional</h3>
      <form class="form" id="bpForm">
        <div class="field"><label>Title</label><input name="title" required></div>
        <div class="field"><label>Scripture / Ref</label><input name="ref" placeholder="Mark 16:15-18"></div>
        <div class="field"><label>Body</label><textarea name="body" rows="4" required></textarea></div>
        <button class="btn btn-gold">Publish</button>
      </form></div>
      <div class="card mt1"><h3>Posts (${posts.length})</h3>
      ${posts.map(p => `<div class="dl-row"><dt>${esc(p.title || p.id)} <span class="muted small">${esc(p.date || "")}</span></dt><dd><button class="btn btn-outline btn-sm" data-bpdel="${esc(p.id)}">🗑</button></dd></div>`).join("")}</div>`;
    $("#bpForm").onsubmit = (e2) => {
      e2.preventDefault(); const fd = new FormData(e2.target);
      const o = { id: "b" + Date.now(), title: fd.get("title"), ref: fd.get("ref"), body: fd.get("body"), date: new Date().toISOString().slice(0, 10) };
      D().setContent({ posts: [o].concat(posts) }); toast("📰 Published"); PANES.blog();
    };
    $$("[data-bpdel]").forEach(b => b.onclick = () => {
      D().setContent({ posts: (D().content().posts || []).filter(x => x.id !== b.dataset.bpdel) }); toast("🗑 Post removed"); PANES.blog();
    });
  };

  PANES.notify = () => {
    const notes = (D().content().notifications || []);
    $("#panel").innerHTML = `<div class="card"><h3>📣 Send Notification</h3>
      <form class="form" id="ntf">
        <div class="field"><label>Preset</label><select id="nPre"><option value="">— choose —</option><option value="🔴 LIVE NOW — Join the service!|Watch live now on the Good News Embassy live page.">🔴 Live Now</option>
        <option value="📺 New Sermon Uploaded|A fresh sermon is available in the Academy library.">📺 New Sermon</option>
        <option value="🎓 New Course in JCIA Academy|A new product just landed in the Academy shop.">🎓 New Product</option>
        <option value="🙏 Prayer Alert|Stand with us in prayer today.">🙏 Prayer Alert</option></select></div>
        <div class="field"><label>Title</label><input name="title" required></div>
        <div class="field"><label>Message</label><textarea name="body" rows="2" required></textarea></div>
        <div style="display:flex;gap:.6rem;flex-wrap:wrap">
          <div class="field grow"><label>Channel</label><select name="channel"><option>Push</option><option>Email</option><option>WhatsApp broadcast</option></select></div>
          <div class="field grow"><label>Audience</label><select name="aud"><option value="all">All members</option><option value="partners">Partners</option><option value="son">Sons</option><option value="servant">Servants</option><option value="general">General Congregation</option></select></div>
        </div>
        <button class="btn btn-gold">🚀 Send</button>
      </form></div>
      <div class="card mt1"><h3>Sent (${notes.length})</h3>
      ${notes.map(n => `<div class="dl-row"><dt>${esc(n.title)} <span class="muted small">${esc((n.audience || "all"))} · ${when(n.at)}</span></dt><dd class="muted small">${esc(n.body || "")}</dd></div>`).join("")}</div>`;
    $("#nPre").onchange = () => { const v = $("#nPre").value.split("|"); if (v[0]) { document.querySelector('#ntf [name=title]').value = v[0]; document.querySelector('#ntf [name=body]').value = v[1] || ""; } };
    $("#ntf").onsubmit = (e2) => {
      e2.preventDefault(); const fd = new FormData(e2.target);
      D().notify(fd.get("title"), fd.get("body"), fd.get("aud"));
      toast("📣 Sent to " + fd.get("aud")); PANES.notify();
    };
  };

  PANES.assistant = () => {
    const a = D().content().assistant || {}, f = D().content().faqs || [];
    $("#panel").innerHTML = `<div class="card"><h3>🤖 JCIA Assistant Settings</h3>
      <div class="field"><label>Gemini API Key (stays in this browser at demo; proxy via serverless at production)</label>
      <input type="password" id="gKey" value="${esc(localStorage.getItem("jcia_gemini_key") || "")}" placeholder="AIza…"></div>
      <div style="display:flex;gap:.6rem;flex-wrap:wrap">
        <div class="field grow"><label>Personality</label><select id="aPersona">
          ${["Prophetic", "Loving", "Bold", "Biblical"].map(p => `<option${a.personality === p ? " selected" : ""}>${p}</option>`).join("")}</select></div>
        <div class="field grow"><label>Greeting</label><input id="aGreet" value="${esc(a.greeting || "")}"></div>
      </div>
      <div class="field"><label>Forbidden topics (comma-separated)</label><input id="aForbidden" value="${esc(a.forbidden || "")}"></div>
      <button class="btn btn-gold" id="saveAsst">💾 Save Assistant</button></div>
      <div class="card mt1"><h3>🎓 Train Answers — FAQs</h3>
      <form class="form" id="faqForm">
        <div style="display:flex;gap:.6rem;flex-wrap:wrap">
          <div class="field grow"><label>Keywords (comma-separated)</label><input name="kw" required></div>
          <div class="field grow"><label>Official Answer</label><input name="ans" required></div>
        </div><button class="btn btn-gold">Add FAQ</button></form>
        <div class="mt1">${f.map((q, i) => `<div class="dl-row"><dt><b>${esc(q.kw)}</b></dt><dd class="muted small">${esc(q.ans)} <button class="btn btn-outline btn-sm" data-fqdel="${i}">🗑</button></dd></div>`).join("")}</div></div>
      <div class="card mt1"><h3>💬 Live Chat History (last 40)</h3>
      ${(read("jcia_assistant_log", []).slice(-40).reverse() || []).map(l => `<div class="dl-row"><dt>${l.who === "user" ? "👤" : "🤖"} ${esc(l.text).slice(0, 110)}</dt><dd class="muted small">${esc(l.member || "guest")} · ${when(l.at)}</dd></div>`).join("") || `<p class="muted">No chats yet.</p>`}</div>`;
    $("#saveAsst").onclick = () => {
      localStorage.setItem("jcia_gemini_key", $("#gKey").value.trim());
      D().setContent({ personality: $("#aPersona").value, greeting: $("#aGreet").value.trim() || a.greeting, forbidden: $("#aForbidden").value.trim() }, "assistant");
      toast("🤖 Assistant updated — reload pages to see it");
    };
    $("#faqForm").onsubmit = (e2) => {
      e2.preventDefault(); const fd = new FormData(e2.target);
      D().setContent({ faqs: { kw: fd.get("kw"), ans: fd.get("ans") } ? [{ kw: fd.get("kw"), ans: fd.get("ans") }].concat(f) : f });
      toast("FAQ added"); PANES.assistant();
    };
    $$("[data-fqdel]").forEach(b => b.onclick = () => {
      const nf = (D().content().faqs || []).filter((x, i) => i !== Number(b.dataset.fqdel));
      D().setContent({ faqs: nf }); PANES.assistant();
    });
  };

  PANES.backup = () => {
    $("#panel").innerHTML = `<div class="card"><h3>🗄 Backup & Export</h3>
      <p class="small muted">Members (CSV for Excel) or a full JSON snapshot of every store: members, content overrides, orders, givings, testimonies, prayers, products, events.</p>
      <div style="display:flex;gap:.8rem;flex-wrap:wrap">
        <button class="btn btn-gold" id="bk-csv">⬇ Members CSV</button>
        <button class="btn btn-outline" id="bk-json">⬇ Full JSON Backup</button>
      </div></div>`;
    $("#bk-csv").onclick = () => D().exportCSV();
    $("#bk-json").onclick = () => D().exportBackup();
  };

  /* ================= SHELL ================= */
  function enter(role) {
    $("#adminAuth").classList.add("hidden");
    $("#adminRoot").classList.remove("hidden");
    const me = D().adminSession();
    $("#adminWho").innerHTML = me ? `${me.photo ? `<img src="${me.photo}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid var(--gold)">` : "🛡️"}<br><b>${esc(me.name)}</b><br><span class="class-badge cb-admin">${esc(role || me.adminRole || "Admin")}</span> <span class="muted small">${esc(me.id)}</span>` : "";
    $("#adminTabs").innerHTML = TABS.filter(t => D().adminCan(role || "Super Admin", t[0]))
      .map(t => `<button class="btn admin-tab" data-tab="${t[0]}">${t[1]}</button>`).join("");
    $$("#adminTabs [data-tab]").forEach(b => b.onclick = () => { TAB = b.dataset.tab; render(); });
    render();
  }
  function render() {
    $$("#adminTabs [data-tab]").forEach(b => b.classList.toggle("btn-gold", b.dataset.tab === TAB));
    (PANES[TAB] || PANES.overview)();
    window.location.hash = TAB;
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!$("#panel")) return;
    const showErr = (msg) => { const er = $("#adminErr"); er.textContent = "⛔ " + msg; er.classList.remove("hidden"); };
    const sess = D().adminSession();
    if (sess) enter(sess.adminRole);
    let pending = null;
    if (!D().adminExists()) { const n = $("#setupNote"); if (n) n.classList.remove("hidden"); const l = $("#pwLabel"); if (l) l.textContent = "Set your real admin password (min 8)"; const s = $("#pwStepBtn"); if (s) s.textContent = "1 · Send setup code to WhatsApp →"; }
    const lf = $("#adminLoginForm");
    if (lf) lf.onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(lf);
      const email = fd.get("email"), password = fd.get("password");
      let r;
      if (!D().adminExists()) {
        r = D().adminSetupStart(email, password);
        if (r.error) { showErr(r.error); return; }
        pending = { mode: "setup", email, password };
      } else {
        r = D().adminLogin(email, password);
        if (r.error) { showErr(r.error); return; }
        pending = { mode: "login", email };
      }
      $("#adminErr").classList.add("hidden");
      document.getElementById("pwStepBtn").disabled = true;
      showStep(r.message || "", r.waLink);
    };
    function showStep(msg, waLink) {
      const st = $("#codeStep"); st.classList.remove("hidden");
      $("#codeMsg").textContent = msg || "";
      const a = $("#waCodeLink"); a.href = waLink;
    }
    const vb = $("#verifyBtn");
    if (vb) vb.onclick = () => {
      if (!pending) { showErr("Verify your password first."); return; }
      const code = $("#codeIn").value.trim();
      const r = pending.mode === "setup" ? D().adminSetupVerify(pending.email, pending.password, code) : D().adminVerify(pending.email, code);
      if (r.error) { showErr(r.error); return; }
      $("#codeStep").classList.add("hidden");
      enter(r.role);
    };
    const cpSave = $("#cpSave");
    if (cpSave) cpSave.onclick = () => {
      const r = D().changeAdminPassword($("#cpOld").value, $("#cpNew").value);
      const m = $("#cpMsg");
      if (r.error) { m.textContent = "⛔ " + r.error; return; }
      m.textContent = "✅ Password changed. All other admin sessions are logged out. You stay signed in.";
    };
    const revokeBtn = $("#revokeBtn");
    if (revokeBtn) revokeBtn.onclick = () => { D().revokeAllAdminSessions(); D().adminLogout(); window.location.reload(); };
    const lb = $("#adminLogoutB");
    if (lb) lb.onclick = () => { D().adminLogout(); window.location.reload(); };
    if (sess && window.location.hash && PANES[window.location.hash.slice(1)]) { TAB = window.location.hash.slice(1); render(); }
    document.addEventListener("change", (e) => {
      const t = e.target.closest("[data-cls],[data-lvl]");
      if (!t || t.tagName !== "SELECT") return;
      if (t.dataset.cls != null) {
        D().setClass(t.dataset.cls, t.value); toast("Class changed — access updated");
        const mm = D().members().find(x => x.id === t.dataset.cls);
        if (mm) fbMirror(mm.id, { memberClass: mm.memberClass, level: mm.level, department: mm.department });
        render();
      } else if (t.dataset.lvl != null) {
        D().updateMember(t.dataset.lvl, { level: t.value }); toast("Level changed"); fbMirror(t.dataset.lvl, { level: t.value }); render();
      }
    });
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-role-btn],[data-blk],[data-del]");
      if (!t) return;
      if (t.dataset.roleBtn != null) {
        const r = prompt("Assign role:\nSuper Admin / President / Media Admin / Finance Admin / Membership Admin\n(leave blank to remove)");
        if (r === null) return;
        D().updateMember(t.dataset.roleBtn, { adminRole: r.trim() || "" }); toast("Role updated"); fbMirror(t.dataset.roleBtn, { adminRole: r.trim() || "" }); render();
      } else if (t.dataset.blk != null) {
        const m = D().members().find(x => x.id === t.dataset.blk);
        const newStatus = m.status === "blocked" ? "active" : "blocked";
        D().updateMember(t.dataset.blk, { status: newStatus });
        fbMirror(t.dataset.blk, { status: newStatus });
        toast(newStatus === "blocked" ? "⛔ Blocked — cannot login" : "Unblocked"); render();
      } else if (t.dataset.del != null) {
        if (!confirm("Remove this member permanently? They will not be able to login again.")) return;
        const all = D().members().filter(x => x.id !== t.dataset.del);
        localStorage.setItem("jcia_members_v2", JSON.stringify(all));
        fbRemove(t.dataset.del);
        toast("🗑 Member removed"); render();
      }
    });
  });
})();
