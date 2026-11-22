/* JCIA ACADEMY — store, cart, library, courses */
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  const STARTER_PRODUCTS = [
    {
      id: "devotional-7days", type: "pdf", cat: "pdfs", price: 0, title: "7 Days of Good News Devotional",
      author: "Apostle Tee Daniel Brilliant", icon: "📖",
      desc: "A free 7-day devotional journey through the Good News. Daily scripture, prophetic insight, and a prayer focus to reposition your day for Kingdom victory.",
      includes: ["7-day PDF devotional", "Daily prayer focus", "Printable (A4 + phone)"], file: "assets/downloads/7-days-of-good-news.pdf"
    },
    {
      id: "discipleship-101", type: "course", cat: "courses", price: 29, title: "JCIA Discipleship 101",
      author: "Apostle Tee Daniel Brilliant", icon: "🎓",
      desc: "From Redeemed Soul to Kingdom Star. The foundational JCIA discipleship course — 10 modules teaching salvation, the Kingdom, spiritual authority, prayer, and purpose. Certificate on completion.",
      includes: ["10 video modules", "Notes + quizzes", "Monthly live Q&A", "Certificate of completion"], modules: 10, file: null
    },
    {
      id: "spiritual-intelligence", type: "ebook-audio", cat: "ebooks", price: 19, title: "Spiritual Intelligence Activation",
      author: "Apostle Tee Daniel Brilliant", icon: "🧠",
      desc: "The Spiritual Intelligence Pioneer's manual — ancient disciplines of concentration and meditation joined with Biblical principles to produce measurable results in intuition, discernment, and higher perception. Includes companion audio activation sessions.",
      includes: ["eBook (PDF/EPUB)", "MP3 activation audio", "Daily practice journal"]
    },
    {
      id: "50-preaching-ppts", type: "ppt", cat: "ppts", price: 49, title: "50 Preaching PPTs + Sermon Notes",
      author: "JCIA Ministry Resources", icon: "📊",
      desc: "For pastors and teachers: 50 ready-to-preach PowerPoint presentations with full sermon notes, scripture guides and outlines. Kingdom advancement in your pulpit this Sunday.",
      includes: ["50 PPT decks", "Full sermon notes", "Editable outlines"]
    },
    {
      id: "kids-bible-lessons", type: "kids", cat: "pdfs", price: 20, title: "JCIA Kids Bible Lessons",
      author: "JCIA Kids Ministry", icon: "⭐",
      desc: "A term of JCIA Kids lessons — safe, fun, Bible-based sessions with memory verses, activities, and teacher guides for parents and children's teachers. Raise Kingdom Stars from childhood.",
      includes: ["12 lessons (PDF)", "Memory verse cards", "Teacher + parent guides"]
    }
  ];

  const COURSE_MODULES = {
    "discipleship-101": [
      { t: "Redeemed: What the Cross Actually Gave You", len: "12 min" },
      { t: "The Kingdom: A New Citizenship", len: "15 min" },
      { t: "Identity of a King's Child", len: "13 min" },
      { t: "Prayer & Fasting: Heaven's Frequencies", len: "18 min" },
      { t: "The Word: Apples of Gold", len: "14 min" },
      { t: "Hearing God: Samuel's Ear", len: "16 min" },
      { t: "Prophetic Awareness in Daily Life", len: "17 min" },
      { t: "Spiritual Authority & Dominion", len: "19 min" },
      { t: "Wisdom for Wealth & Work", len: "15 min" },
      { t: "Commissioned: Shining as a Kingdom Star", len: "20 min video + quiz" }
    ]
  };
  const QUIZ = [
    ["Mark 16:15 commissions us to…", "Go and preach the gospel to every creature"],
    ["The visa of Kingdom citizenship is…", "Redemption by the blood of Jesus"],
    ["Daniel received heaven's answers because he…", "Set his heart to understand and sought God"],
    ["A Kingdom Star shines by…", "Repositioning in Christ for dominion in the supernatural and the natural"]
  ];

  const db = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } },
    set(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
  };

  /* ---- products (admin can add) ---- */
  function products() {
    const custom = db.get("jcia_products", []);
    const hosted = (window.JCIA_DB ? JCIA_DB.content().products : []) || [];
    return [...STARTER_PRODUCTS, ...custom, ...hosted];
  }
  function product(id) { return products().find(p => p.id === id); }

  /* ---- cart ---- */
  function cart() { return db.get("jcia_cart", []); }
  function saveCart(c) { db.set("jcia_cart", c); paintCartBar(); }
  function addToCart(id) {
    const c = cart();
    if (!c.includes(id)) { c.push(id); saveCart(c); toast("Added to cart ✓"); }
    else toast("Already in cart");
  }
  function cartItems() { return cart().map(id => product(id)).filter(Boolean); }
  function cartTotal() { return cartItems().reduce((s, p) => s + p.price, 0); }

  function paintCartBar() {
    const bar = $(".cart-bar");
    if (!bar) return;
    const ids = cart();
    if (!ids.length) { bar.classList.remove("show"); return; }
    bar.classList.add("show");
    $("[data-cart-count]", bar).textContent = ids.length;
    $("[data-cart-total]", bar).textContent = "$" + cartTotal();
  }

  /* ---- library ---- */
  function libraryPurchases() { return db.get("jcia_library", ["devotional-7days"]); }
  function grant(id) {
    const lib = libraryPurchases();
    if (!lib.includes(id)) { lib.push(id); db.set("jcia_library", lib); }
  }
  function member() { return db.get("jcia_member", null); }

  function toast(msg) {
    let t = $(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      t.style.cssText = "position:fixed;top:74px;right:16px;z-index:400;background:#0a1128;color:#d4af37;padding:.7rem 1.1rem;border-radius:10px;font-weight:700;box-shadow:0 10px 26px rgba(0,0,0,.35)";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = 1;
    clearTimeout(t._h);
    t._h = setTimeout(() => t.style.opacity = 0, 2200);
  }

  /* ---- render shop grid ---- */
  function renderShop(el) {
    const cats = [["all", "All"], ["courses", "Courses"], ["ebooks", "eBooks + Audio"], ["pdfs", "PDFs / Kids"], ["videos", "Videos"], ["audios", "Audios"], ["ppts", "PowerPoints"]];
    el.innerHTML = `
      <div class="tabs" role="tablist">${cats.map(([k, l], i) => `<button class="tab ${i === 0 ? "on" : ""}" data-cat="${k}">${l}</button>`).join("")}</div>
      <div class="grid g3" data-shop-grid></div>`;
    const grid = $("[data-shop-grid]", el);
    const owned = libraryPurchases();

    function paint(cat) {
      const me = window.JCIA_DB ? JCIA_DB.session() : null;
      const list = products().filter(p => (cat === "all" || p.cat === cat))
        .filter(p => window.JCIA_DB ? JCIA_DB.canView(p.visibility || "everyone", me) : true);
      if (!list.length) { grid.innerHTML = '<p class="muted">Nothing here for your class yet.</p>'; return; }
      grid.innerHTML = list.map(p => {
        const vis = p.visibility || "everyone";
        const locked = window.JCIA_DB ? !JCIA_DB.canView(vis, me) : false;
        const media = p.cover
          ? `<div class="prod-media"><img src="${p.cover}" alt="${p.title} cover" loading="lazy"></div>`
          : `<div class="prod-media ${p.cat}"><span class="ph">${p.icon || "🎯"}</span></div>`;
        return `
        <article class="card">
          ${media}
          <div class="card-body">
            <div class="flex"><span class="pill">${p.cat === "courses" ? "Video course" : String(p.type || "product").replace("-", " + ")}</span>
            ${vis !== "everyone" ? `<span class="pill" style="background:#3b1d6e;color:#fff">${JCIA_DB.visLabel(vis)}</span>` : ""}</div>
            <h3>${p.title}</h3>
            <p>${(p.desc || "").slice(0, 110)}…</p>
            <div class="flex spread mt1">
              ${p.price === 0 ? '<span class="tag-free">FREE</span>' : `<span class="price">$${p.price}</span>`}
            </div>
            <div class="flex mt1">
              ${locked
          ? `<button class="btn btn-dark btn-sm" style="flex:1" disabled>🔒 ${JCIA_DB.visLabel(vis)} — Upgrade to unlock</button>`
          : owned.includes(p.id)
            ? `<a class="btn btn-dark btn-sm" style="flex:1" href="library.html#${p.id}">Open in Library</a>`
            : `<button class="btn btn-gold btn-sm" style="flex:1" data-add="${p.id}">Add to Cart</button>
                 <a class="btn btn-outline btn-sm" href="checkout.html?buy=${p.id}">Buy</a>`}
            </div>
            <div class="share-row mt1">
              <a class="share-btn sh-wa" title="Share on WhatsApp" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent("See this from JCIA Academy: " + p.title + " — " + (p.price ? "$" + p.price : "Free") + " " + location.origin + "/academy.html")}">✆</a>
              <a class="share-btn sh-fb" title="Share on Facebook" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.origin + "/academy.html")}">f</a>
            </div>
          </div>
        </article>`;
      }).join("");
      $$("[data-add]", grid).forEach(b => b.addEventListener("click", () => addToCart(b.dataset.add)));
    }
    $$(".tab", el).forEach(t => t.addEventListener("click", () => {
      $$(".tab", el).forEach(x => x.classList.remove("on"));
      t.classList.add("on");
      paint(t.dataset.cat);
    }));
    paint("all");
  }

  /* ---- course / library player ---- */
  function renderLibrary(el) {
    const me = window.JCIA_DB ? JCIA_DB.session() : null;
    const owned = Array.from(new Set([].concat(libraryPurchases(), (me && me.purchases) || [])));
    const items = owned.map(id => product(id)).filter(Boolean)
      .filter(p => window.JCIA_DB ? JCIA_DB.canView(p.visibility || "everyone", me) : true);
    const m = member();
    el.innerHTML = `
      <div class="card" style="padding:1.4rem;margin-bottom:1.5rem">
        <div class="flex spread">
          <div>
            <b style="font-family:var(--font-head);font-size:1.1rem">${m ? m.name : "Guest member"}</b>
            <p class="small muted">${m ? (m.plan === "disciple" ? "Disciple Member — all courses unlock + monthly mentorship Zoom with Apostle Tee Daniel Brilliant" : "Free Member — live services, chat, devotionals") : "Sign in to save your progress."}</p>
          </div>
          <a class="btn btn-outline btn-sm" href="account.html">Account</a>
        </div>
      </div>
      <h3 class="mb1">My Products (${items.length})</h3>
      ${items.length ? items.map(p => {
      if (p.type === "course") {
        return `<article class="card mb2" data-course="${p.id}">
              <div class="card-body">
                <div class="flex spread"><h3>${p.icon} ${p.title}</h3><span class="price">$${p.price}</span></div>
                <p>${p.desc}</p>
                <div class="mt1"><div class="progress"><span data-progress style="width:${db.get("jcia_progress_" + p.id, 0)}%"></span></div>
                <p class="small muted" data-progress-label>${db.get("jcia_progress_" + p.id, 0)}% complete</p></div>
                <button class="btn btn-gold btn-sm mt1" data-open-course="${p.id}">Continue Course ▶</button>
                <div class="mt2 hidden" data-course-player="${p.id}"></div>
              </div>
            </article>`;
      }
      return `<article class="card mb1"><div class="card-body">
            <div class="flex spread"><h3>${p.icon} ${p.title}</h3><span class="price">${p.price ? "$" + p.price : "Free"}</span></div>
            <p>${p.desc}</p>
            <div class="flex mt1">
              <a class="btn btn-dark btn-sm" href="${p.visibility && p.visibility.startsWith("partner") ? "partners.html" : (p.file || "#")}" ${p.file ? 'download' : ""} data-dl="${p.id}">⬇ Download${me ? ` <span class="muted small">· ${(p.downloads || 0)}</span>` : ""}</a>
              ${p.type === "ebook-audio" ? '<a class="btn btn-outline btn-sm" href="#" onclick="return false">🎧 Audio (stream)</a>' : ""}
            </div>
          </div></article>`;
    }).join("") : '<p class="muted">Your library is empty. Visit the Academy to add products.</p>'}
      <div data-cert-area></div>`;

    $$("[data-open-course]", el).forEach(btn => btn.addEventListener("click", () => {
      const pid = btn.dataset.openCourse;
      const player = $(`[data-course-player="${pid}"]`, el);
      player.classList.toggle("hidden");
      if (!player.dataset.built) { buildCourse(player, pid); player.dataset.built = 1; }
    }));
  }

  function buildCourse(player, pid) {
    const mods = COURSE_MODULES[pid] || [];
    player.innerHTML = `
      <div style="background:#000;aspect-ratio:16/9;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#d4af37;font-weight:700">▶ Video module player (connect to your video host — see README)</div>
      <h4 class="mt2 mb1">Modules</h4>
      <div class="grid" style="gap:.6rem">
        ${mods.map((m, i) => `<div class="module-row"><span class="num">${i + 1}</span><span class="grow">${m.t} <span class="muted small">· ${m.len}</span></span>
          <button class="btn btn-outline btn-sm" data-done="${i}">Mark done</button></div>`).join("")}
      </div>
      <h4 class="mt2 mb1">Final Quiz</h4>
      <form class="form" data-quiz>
        ${QUIZ.map((q, i) => `<div class="module-row"><span class="num">Q${i + 1}</span><span class="grow">${q[0]}<br><label class="small"><input type="radio" name="q${i}" value="${q[1]}" required> ${q[1]}</label></span></div>`).join("")}
        <div><button class="btn btn-gold btn-sm">Submit Quiz</button></div>
      </form>
      <div data-cert class="mt2 hidden"><div class="certificate">
        <img class="seal" src="assets/img/jcia-logo.png" alt="JCIA seal">
        <h2>Certificate of Completion</h2>
        <p class="muted">Awarded to</p><b style="font-family:var(--font-head);font-size:1.2rem" data-cert-name>${(member() || {}).name || " JCIA Disciple "}</b>
        <p class="mt1">for completing <b>JCIA Discipleship 101 — From Redeemed Soul to Kingdom Star</b></p>
        <p class="small muted mt1">Apostle Tee Daniel Brilliant · JCIA — The Good News Embassy, Bulawayo</p>
        <button class="btn btn-outline btn-sm mt1" onclick="window.print()">Print / Save PDF</button>
      </div></div>`;

    const pidKey = "jcia_progress_" + pid;
    $$("[data-done]", player).forEach(b => b.addEventListener("click", () => {
      b.outerHTML = '<span class="badge badge-ok">Done ✓</span>';
      const total = $$("[data-done], .badge-ok", player).length;
      const pct = Math.min(100, Math.round(total / (mods.length) * 100));
      db.set(pidKey, Math.max(db.get(pidKey, 0), pct));
      if (window.JCIA_DB && JCIA_DB.session()) {
        const m = JCIA_DB.session();
        const prog = Object.assign({}, m.progress || {});
        prog[pid] = Math.max(prog[pid] || 0, pct);
        JCIA_DB.updateMember(m.id, { progress: prog });
      }
      toast("Progress saved · " + pct + "%");
    }));
    $("[data-quiz]", player).addEventListener("submit", e => {
      e.preventDefault();
      grant("certificate-" + pid);
      $("[data-cert]", player).classList.remove("hidden");
      toast("Quiz passed — certificate unlocked!");
    });
  }

  /* protected download counting + partner gate */
  document.addEventListener("click", function (e) {
    const a = e.target.closest("[data-dl]");
    if (!a) return;
    const me = window.JCIA_DB ? JCIA_DB.session() : null;
    if (!me) { return; }
    const id = a.dataset.dl;
    const all = db.get("jcia_products", []);
    const hostedP = (JCIA_DB.content().products || []).find(p => p.id === id);
    if (hostedP && hostedP.visibility && hostedP.visibility !== "everyone" && hostedP.visibility !== "general") {
      if (!JCIA_DB.canView(hostedP.visibility, me)) { e.preventDefault(); location.href = "partners.html"; return; }
    }
    const n = parseInt(localStorage.getItem("jcia_dl_" + id) || "0", 10) + 1;
    localStorage.setItem("jcia_dl_" + id, n);
  });

  /* Expose */
  window.JCIAStore = { products, product, cart, cartItems, cartTotal, addToCart, saveCart, paintCartBar, renderShop, renderLibrary, grant, libraryPurchases, member, db };
})();
