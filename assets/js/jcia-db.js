/* JCIA CORE (Phase 2) — members, classes, visibility, content overrides, admin roles.
   Storage adapter: localStorage today — swap each J.* method for Firebase/Firestore later (see README). */
(function (w) {
  const KEY = {
    members: "jcia_members_v2", session: "jcia_session", counter: "jcia_member_counter",
    content: "jcia_content", chatlog: "jcia_assistant_log", admins: "jcia_admins"
  };
  const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const hash = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return "h" + h.toString(36); };

  /* ---------- CLASSES & LEVELS ---------- */
  const CLASSES = {
    son: { name: "Sons of the Prophet", icon: "🕊️", levels: ["Son", "Senior Son", "Chief Son"] },
    partner: { name: "Partners of the Ministry", icon: "💰", levels: ["Seed Partner", "Covenant Partner", "Kingdom Partner", "Embassy Partner", "Global Partner"] },
    servant: { name: "Servants / Workers", icon: "🤝", levels: ["Ushers", "Media", "Choir", "Intercessors", "Evangelism Team", "Kids Teachers", "Protocol"] },
    general: { name: "General Congregation Member", icon: "👏", levels: ["Member"] }
  };
  /* access rank: number of levels in class defines depth; visibility solver below */
  const VIS_OPTIONS = ["everyone", "general", "servants", "sons", "partners", "partner-level"];

  /* ---------- CONTENT OVERRIDES ---------- */
  const DEFAULT_CONTENT = {
    site: {
      heroTitle: "WELCOME TO THE <span class='gold'>GOOD NEWS EMBASSY</span>",
      heroSub: "Jesus Christ Intelligence Agency (JCIA) — redeemed souls, raised as Kingdom Stars of the light in Christ Jesus: repositioned to shine and for dominion worldwide.",
      vision: "Redeemed souls raised to be Kingdom stars of the light in Christ Jesus, thereby repositioned to shine and for dominion worldwide — both in the supernatural and the natural.",
      mission: "Engaging in evangelical Kingdom advancement endeavours — reviving and repositioning people for total subjection to the Higher power that is God: preaching the gospel of Jesus Christ, healing, deliverance, prophetic, miracles & wonders (Mark 16:15-18).",
      apostleBio: "Prophet, miracle worker, healer of the sick, teacher and trainer, spiritual intelligence pioneer and apostolic founder. Razor-sharp prophetic anointing — accurately foretelling national events, personal destinies, and divine appointments (Amos 3:7).",
      serviceTimes: "Sundays 9AM · Wednesdays 6PM",
      contactEmail: "teedanielbrilliant@gmail.com",
      contactWhatsApp: "+263 77 482 7123",
      whatsapp: "263774827123"
    },
    socials: {
      facebook: "https://facebook.com/jciagoodnewsembassy", facebookFollowers: "1,240",
      youtube: "https://youtube.com/@jciagoodnewsembassy", youtubeFollowers: "860",
      instagram: "https://instagram.com/jcia_goodnewsembassy", instagramFollowers: "430",
      tiktok: "https://tiktok.com/@jcia.goodnewsembassy", tiktokFollowers: "980",
      youtubeLiveId: ""
    },
    giving: {
      ecocash: "0774 827 123 — Tee Daniel Brilliant", bank: "", bankAccount: "", paynow: "", mukuru: "", paypal: "teedanielbrilliant@gmail.com"
    },
    products: [], events: [], posts: [], notifications: [],
    faqs: [], assistant: { personality: "Prophetic", greeting: "Welcome to The Good News Embassy. I am JCIA Assistant. How can I help you grow in Christ today?", forbidden: "politics,occult,dating,gambling" },
    live: { isLive: false, youtubeId: "", facebookUrl: "", platforms: ["facebook", "youtube"] }
  };
  function content() {
    const c = read(KEY.content, {});
    return {
      ...DEFAULT_CONTENT, ...c,
      site: { ...DEFAULT_CONTENT.site, ...(c.site || {}) },
      socials: { ...DEFAULT_CONTENT.socials, ...(c.socials || {}) },
      giving: { ...DEFAULT_CONTENT.giving, ...(c.giving || {}) },
      assistant: { ...DEFAULT_CONTENT.assistant, ...(c.assistant || {}) },
      live: { ...DEFAULT_CONTENT.live, ...(c.live || {}) }
    };
  }
  function setContent(patch, section) {
    const c = read(KEY.content, {});
    if (section) c[section] = { ...(c[section] || {}), ...patch };
    else Object.keys(patch).forEach(k => {
      if (k.startsWith("analytics-ignore")) return;
      c[k] = typeof patch[k] === "object" && !Array.isArray(patch[k]) ? { ...(c[k] || {}), ...patch[k] } : patch[k];
    });
    write(KEY.content, c);
    try { localStorage.setItem("jcia_content_ping", Date.now()); } catch (e) { }
  }

  /* ---------- MEMBERS ---------- */
  function members() { return read(KEY.members, []); }
  function saveMembers(m) { write(KEY.members, m); }
  function nextMemberId() {
    const n = read(KEY.counter, 0) + 1; write(KEY.counter, n);
    return "JCIA-" + String(n).padStart(4, "0");
  }
  function findByEmail(email) { return members().find(m => (m.email || "").toLowerCase() === (email || "").toLowerCase()); }
  function findByWhatsApp(wa) { return members().find(m => (m.whatsapp || "").replace(/\D/g, "").endsWith((wa || "").replace(/\D/g, "").slice(-9))); }

  function signup(profile) {
    if (!profile.email || !profile.password || !profile.name) return { error: "Name, email and password are required." };
    if (findByEmail(profile.email)) return { error: "That email already has an account — please log in." };
    const m = {
      id: nextMemberId(), name: profile.name, email: profile.email,
      passwordHash: hash(profile.password), whatsapp: profile.whatsapp || "",
      country: profile.country || "", city: profile.city || "", gender: profile.gender || "",
      dob: profile.dob || "", photo: profile.photo || "",
      memberClass: "general", level: "Member", department: "", role: "", shift: "",
      adminRole: "", status: "active",
      joined: new Date().toISOString(), purchases: [], givings: [], progress: {}, notifsRead: []
    };
    if (profile.whatsapp && findByWhatsApp(profile.whatsapp) && profile.whatsapp.length > 5) {
      return { error: "That WhatsApp number is already registered — log in instead.", code: "wa-exists" };
    }
    const all = members(); all.push(m); saveMembers(all);
    login(m.email, profile.password);
    return { member: m };
  }

  function login(email, password) {
    const m = findByEmail(email);
    if (!m) return { error: "No account found with that email. Sign up first." };
    if (m.status === "blocked") return { error: "This account has been blocked by the ministry. WhatsApp us at +263 77 482 7123." };
    if (m.passwordHash !== hash(password)) return { error: "Wrong password — try again." };
    write(KEY.session, { email: m.email, at: Date.now() });
    return { member: m };
  }
  /* WhatsApp-number login: 6-digit code is shown to the member only via WhatsApp (demo) */
  function whatsappChallenge(wa) {
    const m = findByWhatsApp(wa);
    if (!m) return { error: "No member found with that WhatsApp number." };
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const pending = read("jcia_otp", {}); pending[m.id] = code; write("jcia_otp", pending);
    const link = "https://wa.me/263774827123?text=" + encodeURIComponent("JCIA LOGIN CODE\nMy member ID: " + m.id + "\nNumber: " + wa + "\nLog my code: " + code);
    return { ok: true, waLink: link, hint: "Tap Send — our desk replies with your code." };
  }
  function whatsappVerify(wa, code) {
    const m = findByWhatsApp(wa); const pending = read("jcia_otp", {});
    if (!m || pending[m.id] !== code) return { error: "Wrong code." };
    if (m.status === "blocked") return { error: "Blocked account." };
    delete pending[m.id]; write("jcia_otp", pending);
    write(KEY.session, { email: m.email, at: Date.now() });
    return { member: m };
  }
  function session() {
    const s = read(KEY.session, null);
    if (!s) return null;
    const m = findByEmail(s.email);
    return (m && m.status === "blocked") ? null : m;
  }
  function logout() { localStorage.removeItem(KEY.session); }

  /* used by Google login (Firebase): find-or-create the member, then set session */
  function upsertGoogleMember(u) {
    let m = findByEmail(u.email);
    if (!m) {
      m = { id: nextMemberId(), name: u.displayName || "JCIA Member", email: String(u.email || "").toLowerCase(), passwordHash: "google:" + u.uid, whatsapp: u.phoneNumber || "", photo: u.photoURL || "", country: "", city: "", gender: "", dob: "", memberClass: "general", level: "Member", status: "active", joined: new Date().toISOString(), purchases: [], givings: [], progress: {}, notifsRead: [] };
      const all = members(); all.push(m); saveMembers(all);
    }
    if (m.status === "blocked") return { error: "This account is blocked — contact the ministry on WhatsApp." };
    write(KEY.session, { email: m.email, at: Date.now() });
    return { member: m };
  }

  function updateMember(id, patch) {
    const all = members(); const i = all.findIndex(m => m.id === id);
    if (i < 0) return null;
    all[i] = { ...all[i], ...patch }; saveMembers(all); return all[i];
  }
  function setClass(id, memberClass, level) {
    const cls = CLASSES[memberClass];
    level = level || cls.levels[0];
    return updateMember(id, { memberClass, level, department: memberClass === "servant" ? level : "" });
  }
  function memberRank(m) {
    if (!m) return 0;
    if (m.memberClass === "son") return 100 + (CLASSES.son.levels.indexOf(m.level) + 1) * 10;
    if (m.memberClass === "partner") return 60 + (CLASSES.partner.levels.indexOf(m.level) + 1) * 10;
    if (m.memberClass === "servant") return 30;
    return 10;
  }

  /* ---------- ADMIN (locked) ----------
     No bootstrap-by-email. Admin exists only after First-Time Setup: Founder email +
     password (min 8) + 6-digit code confirmed on WhatsApp +263774827123.
     Login = password + 6-digit WhatsApp code. 3 wrong attempts = 1-hour lock.
     Changing password bumps the session epoch, killing every other admin session. */
  const ADMIN_EMAILS = ["teedanielbrilliant@gmail.com", "audreybrilliant@gmail.com"];
  const K_LOCK = "jcia_admin_lock", K_ATT = "jcia_admin_attempts", K_EPOCH = "jcia_admin_epoch", K_2FA = "jcia_admin_2fa", K_SETUP = "jcia_admin_setup";
  const epoch = () => read(K_EPOCH, 0);
  function bumpEpoch() { localStorage.setItem(K_EPOCH, String(epoch() + 1)); }
  function lockRemaining() { const t = read(K_LOCK, 0); return t > Date.now() ? Math.ceil((t - Date.now()) / 6e4) : 0; }
  const lockedNow = () => lockRemaining() > 0;
  function countFail() {
    const n = (read(K_ATT, 0) || 0) + 1; write(K_ATT, n);
    if (n >= 3) { localStorage.setItem(K_LOCK, JSON.stringify(Date.now() + 36e5)); write(K_ATT, 0); }
    return n;
  }
  const resetFails = () => localStorage.removeItem(K_ATT);
  const newCode = () => String(Math.floor(100000 + Math.random() * 900000));
  function waLinkFor(code, kind) {
    return "https://wa.me/263774827123?text=" + encodeURIComponent("JCIA ADMIN " + kind + " code: " + code + " (valid 10 minutes). Do not share this code.");
  }
  function adminExists() { return members().some(m => m.adminRole && m.status !== "blocked"); }
  function isFounder(email) { return ADMIN_EMAILS.includes(String(email || "").toLowerCase()); }

  /* first-time setup: once, only the two founder emails, only while no admin exists */
  function adminSetupStart(email, password) {
    if (lockedNow()) return { error: "Locked after failed attempts \u2014 try again in " + lockRemaining() + " minute(s)." };
    if (adminExists()) return { error: "An admin already exists. Log in normally." };
    if (!isFounder(email)) return { error: "Setup is reserved for the approved Founder emails only." };
    if (!password || password.length < 8) return { error: "Set a real password \u2014 minimum 8 characters." };
    const code = newCode();
    write(K_SETUP, { email: String(email).toLowerCase(), hash: hash(password), code, expires: Date.now() + 6e5 });
    return { stage: "code", waLink: waLinkFor(code, "SETUP"), message: "6-digit setup code sent. Confirm it on WhatsApp +263 77 482 7123, then enter it below." };
  }
  function adminSetupVerify(email, password, code) {
    if (lockedNow()) return { error: "Locked \u2014 try again in " + lockRemaining() + " minute(s)." };
    const s = read(K_SETUP, null);
    if (!s || s.email !== String(email || "").toLowerCase()) return { error: "No setup in progress \u2014 start again." };
    if (Date.now() > s.expires) return { error: "Code expired \u2014 request a new one." };
    if (s.hash !== hash(password || "")) return { error: "Password differs from the one used when the code was requested." };
    if (String(code || "").trim() !== s.code) { const n = countFail(); return { error: n >= 3 && lockedNow() ? "Wrong code. You are locked for 1 hour." : "Wrong code (attempt " + n + " of 3)." }; }
    localStorage.removeItem(K_SETUP); resetFails(); bumpEpoch();
    let all = members(); let m = all.find(x => (x.email || "").toLowerCase() === s.email);
    if (!m) {
      m = { id: nextMemberId(), name: s.email === "audreybrilliant@gmail.com" ? "President Audrey Brilliant" : "Apostle Tee Daniel Brilliant", email: s.email, passwordHash: hash(password), whatsapp: "263774827123", country: "Zimbabwe", city: "Bulawayo", memberClass: "son", level: "Chief Son", adminRole: "Super Admin", status: "active", joined: new Date().toISOString(), purchases: [], givings: [], progress: {}, notifsRead: [] };
      all.push(m); saveMembers(all);
    } else { m = updateMember(m.id, { passwordHash: hash(password), adminRole: m.adminRole || "Super Admin", status: "active" }); }
    write("jcia_admin_session", { v: 2, epoch: epoch(), memberId: m.id, at: Date.now() });
    D_users_logAdminCreated(m);
    return { ok: true, role: m.adminRole };
  }
  /* regular admin login: password THEN WhatsApp 6-digit code */
  function adminLogin(email, password) {
    if (lockedNow()) return { error: "Too many failed attempts. Locked for " + lockRemaining() + " more minute(s)." };
    if (!adminExists()) return { error: "Admin is not set up yet. Use First-Time Admin Setup below." };
    if (!isFounder(email)) return { error: "Not authorized. Only approved admins may enter." };
    const m = members().find(x => x.adminRole && x.status !== "blocked" && (x.email || "").toLowerCase() === String(email || "").toLowerCase());
    if (!m || m.passwordHash !== hash(password || "")) { const n = countFail(); return { error: n >= 3 && lockedNow() ? "Wrong credentials. You are locked for 1 hour." : "Wrong email or password (attempt " + n + " of 3, then 1-hour lock)." }; }
    const code = newCode();
    write(K_2FA, { memberId: m.id, code, expires: Date.now() + 6e5 });
    return { stage: "code", waLink: waLinkFor(code, "LOGIN"), name: m.name, message: "6-digit code sent to WhatsApp +263 77 482 7123." };
  }
  function adminVerify(email, code) {
    if (lockedNow()) return { error: "Locked \u2014 try again in " + lockRemaining() + " minute(s)." };
    const s = read(K_2FA, null);
    if (!s || Date.now() > s.expires) return { error: "Code expired \u2014 request a new one." };
    if (String(code || "").trim() !== s.code) { const n = countFail(); return { error: n >= 3 && lockedNow() ? "Wrong code. You are locked for 1 hour." : "Wrong code (attempt " + n + " of 3)." }; }
    localStorage.removeItem(K_2FA); resetFails(); bumpEpoch();
    write("jcia_admin_session", { v: 2, epoch: epoch(), memberId: s.memberId, at: Date.now() });
    const m = members().find(x => x.id === s.memberId);
    return { ok: true, role: m ? (m.adminRole || "Super Admin") : "Super Admin" };
  }
  function changeAdminPassword(oldPw, newPw) {
    const me = adminSession(); if (!me) return { error: "Not logged in as admin." };
    if (me.passwordHash !== hash(oldPw || "")) return { error: "Current password is wrong." };
    if (!newPw || newPw.length < 8) return { error: "New password must be at least 8 characters." };
    updateMember(me.id, { passwordHash: hash(newPw) });
    bumpEpoch();
    write("jcia_admin_session", { v: 2, epoch: epoch(), memberId: me.id, at: Date.now() });
    return { ok: true };
  }
  /* invalidate every admin session on this browser ("Log out all sessions") */
  function revokeAllAdminSessions() { bumpEpoch(); }
  function D_users_logAdminCreated(m) { try { const log = read("jcia_admin_audit", []); log.unshift({ event: "admin-created", id: m.id, email: m.email, at: new Date().toISOString() }); write("jcia_admin_audit", log.slice(0, 50)); } catch (e) { } }
  function adminSession() {
    const s = read("jcia_admin_session", null); if (!s) return null;
    if (s.v !== 2 || (s.epoch || 0) !== epoch()) return null; /* old sessions are invalid immediately */
    const m = members().find(x => x.id === s.memberId);
    return m && m.status !== "blocked" ? m : null;
  }
  function adminLogout() { localStorage.removeItem("jcia_admin_session"); }
  const ROLE_TABS = {
    "Super Admin": "*", "Media Admin": ["golive", "content", "site", "notify", "assistant"],
    "Finance Admin": ["sales", "giving"], "Membership Admin": ["members", "testimonies", "prayers"],
    "President": "*"
  };
  function adminCan(role, tab) {
    const t = ROLE_TABS[role] || []; return t === "*" || t.includes(tab);
  }

  /* ---------- VISIBILITY ---------- */
  function canView(v, m) {
    v = v || "everyone";
    const isSon = m && m.memberClass === "son", isPartner = m && m.memberClass === "partner";
    const isServant = m && m.memberClass === "servant";
    const isStaff = isSon || (m && m.adminRole);
    if (String(v).indexOf("partner-level") === 0) {
      if (isSon) return true;
      if (!isPartner) return false;
      const req = parseInt(String(v).split(":")[1] || "0", 10);
      return CLASSES.partner.levels.indexOf(m.level) >= req;
    }
    switch (v) {
      case "everyone": return true;
      case "general": return !!m; /* any signed-in member */
      case "servants": return isServant || isStaff;
      case "sons": return isSon;
      case "partners": return isPartner || isSon;
      default: return true;
    }
  }
  function visLabel(v) {
    if (String(v).startsWith("partner-level")) {
      const req = parseInt(String(v).split(":")[1] || "0", 10);
      return "Partners · " + (CLASSES.partner.levels[req] || "Seed Partner") + "+";
    }
    return {
      everyone: "Everyone", general: "General Members", servants: "Servants",
      sons: "Sons of the Prophet", partners: "Partners Only"
    }[v] || "Everyone";
  }

  /* ---------- NOTIFICATIONS ---------- */
  function notify(title, body, audience) {
    const n = content().notifications || [];
    n.unshift({ title, body, audience: audience || "all", at: new Date().toISOString(), readBy: [] });
    setContent({ notifications: n });
    try { localStorage.setItem("jcia_notify_ping", Date.now()); } catch (e) { }
  }

  /* ---------- EXPORT ---------- */
  function exportCSV() {
    const rows = [["MemberID", "Name", "Email", "WhatsApp", "Country", "City", "Class", "Level", "Department", "Status", "Joined"]];
    members().forEach(m => rows.push([m.id, m.name, m.email, m.whatsapp, m.country, m.city, m.memberClass, m.level, m.department, m.status, m.joined]));
    const csv = rows.map(r => r.map(c => '"' + String(c || "").replace(/"/g, '""') + '"').join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "jcia-members.csv"; a.click();
  }
  function exportBackup() {
    const data = {}; Object.values(KEY).forEach(k => data[k] = read(k, null));
    data.jcia_orders = read("jcia_orders", []); data.jcia_givings = read("jcia_givings", []);
    data.jcia_testimonies = read("jcia_testimonies", []); data.jcia_prayers = read("jcia_prayers", []);
    data.jcia_products = read("jcia_products", []); data.jcia_events = read("jcia_events", []);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    a.download = "jcia-backup-" + new Date().toISOString().slice(0, 10) + ".json"; a.click();
  }
  /* cross-tab sync */
  window.addEventListener("storage", (e) => {
    if (e.key === "jcia_content_ping" && typeof window.onJCIAContentChange === "function") window.onJCIAContentChange();
    if (e.key === "jcia_notify_ping" && typeof window.onJCIANotify === "function") window.onJCIANotify();
  });

  /* ---------- photo compress helper ---------- */
  function compressImage(file, max, cb) {
    const img = new Image(); const url = URL.createObjectURL(file);
    img.onload = () => {
      const sc = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = img.width * sc; c.height = img.height * sc;
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      cb(c.toDataURL("image/jpeg", 0.82)); URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  /* apply content overrides to [data-bind] elements on any page */
  function paintContent() {
    const c = content();
    document.querySelectorAll("[data-bind]").forEach(el => {
      const k = el.dataset.bind;
      const maps = { site: c.site, socials: c.socials, giving: c.giving, assistant: c.assistant };
      const [sec, field] = k.split(".");
      if (maps[sec] && maps[sec][field] != null) {
        if (field.includes("Title") || el.dataset.html != null) el.innerHTML = maps[sec][field];
        else el.textContent = maps[sec][field];
      }
    });
    document.querySelectorAll("[data-wa-target]").forEach(a => a.href = "https://wa.me/" + c.site.whatsapp);
  }
  document.addEventListener("DOMContentLoaded", paintContent);

  w.JCIA_DB = { CLASSES, VIS_OPTIONS, content, setContent, members, signup, login, logout, session, updateMember, setClass, memberRank, adminLogin, adminVerify, adminSetupStart, adminSetupVerify, adminExists, changeAdminPassword, revokeAllAdminSessions, lockRemaining, adminSession, adminLogout, adminCan, canView, visLabel, notify, exportCSV, exportBackup, compressImage, findByEmail, findByWhatsApp, whatsappChallenge, whatsappVerify, upsertGoogleMember };
})(window);
