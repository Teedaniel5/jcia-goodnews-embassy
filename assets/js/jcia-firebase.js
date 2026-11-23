/* JCIA FIREBASE BRIDGE — FREE Spark plan.
   Activated from Admin ▸ Edit Site ▸ Firebase. Paste the web config (apiKey, authDomain,
   projectId, storageBucket, messagingSenderId, appId); the SDK loads on demand and the site
   switches to REAL Firebase Auth (email/password + Google + password reset), Firestore
   (members/sales/giving/prayers) and Storage (file uploads). Without config the site keeps
   running in localStorage demo mode, so nothing breaks.

   Firebase Security (do at production, README ▸ Security):
   - Firestore rules: only signed-in users write their own member doc.
   - Auth custom claim /admin:true gates admin pages server-side.
   - Storage rules: partner files need a verified partner claim before download. */
(function (w) {
  "use strict";
  const K = "jcia_firebase_config";
  const SDK = "https://www.gstatic.com/firebasejs/10.12.2/";
  let app = null, auth = null, db = null, storage = null;
  const listeners = [];
  let status = "not-configured";
  let lastError = "";

  function cfg() { try { return JSON.parse(localStorage.getItem(K) || "null"); } catch (e) { return null; } }
  function ready() { return !!(app && auth); }
  const emit = (s) => { status = s; w.JCIA_FB_STATUS = s; listeners.forEach(f => { try { f(s); } catch (e) { } }); };

  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = src; s.onload = () => res(); s.onerror = () => rej(new Error("Could not load " + src));
      document.head.appendChild(s);
    });
  }

  async function activate(cfgObj) {
    const c = cfgObj || cfg();
    if (!c || !c.apiKey || !c.projectId) { emit("not-configured"); return null; }
    if (!c.appId) { emit("error: appId missing in config"); return null; }
    try {
      if (!w.firebase || !w.firebase.app) await loadScript(SDK + "firebase-app-compat.js");
      if (!w.firebase.auth) await loadScript(SDK + "firebase-auth-compat.js");
      if (!w.firebase.firestore) await loadScript(SDK + "firebase-firestore-compat.js");
      if (!w.firebase.storage) await loadScript(SDK + "firebase-storage-compat.js");
      app = w.firebase.apps && w.firebase.apps.length ? w.firebase.app() : w.firebase.initializeApp(c);
      auth = app.auth(); db = app.firestore(); storage = app.storage();
      emit("connected");
      return app;
    } catch (e) { lastError = e && e.message ? e.message : String(e); emit("error: " + lastError); return null; }
    lastError = "";
  }

  function saveConfig(c) {
    const clean = Object.fromEntries(Object.entries(c || {}).map(([k, v]) => [k, String(v || "").trim()]));
    if (!Object.values(clean).some(v => v)) return null; /* empty form must not wipe a good config */
    localStorage.setItem(K, JSON.stringify(clean));
    return activate(clean);
  }
  function clearConfig() { localStorage.removeItem(K); app = null; auth = null; db = null; storage = null; emit("not-configured"); }

  const mapAuthError = (e) => {
    const code = (e && e.code) || "";
    if (code.includes("configuration-not-found") || code.includes("operation-not-allowed")) return "Firebase needs Email/Password enabled: Firebase console ▸ Authentication ▸ Sign-in method ▸ enable Email/Password, then try again.";
    if (code.includes("email-already-in-use")) return "That email already has an account — please Log In instead.";
    if (code.includes("invalid-email")) return "That email address is not valid.";
    if (code.includes("weak-password")) return "Password too weak — use at least 6 characters.";
    if (code.includes("wrong-password") || code.includes("invalid-credential") || code.includes("user-not-found")) return "No Firebase account with those details yet — if you registered before Firebase was connected, simply use the same email and password you signed up with; the site will recognise you.";
    if (code.includes("too-many-requests")) return "Too many attempts — please wait a moment and retry.";
    if (code.includes("network")) return "Network error — check your connection and retry.";
    if (code.includes("popup-closed") || code.includes("cancelled-popup")) return "Google sign-in was cancelled.";
    if (code.includes("unauthorized-domain")) return "This domain is not authorised in Firebase ▸ Authentication ▸ Settings ▸ Authorized domains. Add your Vercel domain.";
    if (code.includes("api-key-not-valid")) return "The Firebase apiKey does not look valid — re-check the values in Admin ▸ Edit Site ▸ Firebase.";
    return (e && e.message) || "Authentication failed.";
  };

  async function authSignup(o) {
    if (!ready()) throw new Error("not-configured");
    const cred = await auth.createUserWithEmailAndPassword(String(o.email || "").trim(), String(o.password || ""));
    if (o.name) await cred.user.updateProfile({ displayName: o.name, photoURL: o.photo || null });
    return cred.user;
  }
  async function authLogin(email, pw) {
    if (!ready()) throw new Error("not-configured");
    const cred = await auth.signInWithEmailAndPassword(String(email || "").trim(), String(pw || ""));
    return cred.user;
  }
  async function authGoogle(cb) {
    if (!ready()) throw new Error("not-configured");
    const provider = new w.firebase.auth.GoogleAuthProvider();
    const cred = await auth.signInWithPopup(provider);
    return cred.user;
  }
  async function authReset(email) {
    if (!ready()) throw new Error("not-configured");
    await auth.sendPasswordResetEmail(String(email || "").trim());
    return true;
  }
  async function saveDoc(col, id, data) {
    if (!ready()) return false;
    await db.collection(col).doc(id).set(data, { merge: true });
    return true;
  }
  async function upload(file, path, onProgress) {
    if (!storage) return null;
    const ref = storage.ref().child(path);
    const task = ref.put(file);
    return new Promise((res, rej) => {
      task.on("state_changed",
        (s) => { if (onProgress) onProgress(s.bytesTransferred / (s.totalBytes || 1)); },
        rej,
        async () => res({ url: await ref.getDownloadURL(), path }));
    });
  }
  async function downloadURL(path) {
    if (!storage) return null;
    return await storage.ref().child(path).getDownloadURL();
  }

  w.JCIA_FB = { cfg, ready, activate, saveConfig, clearConfig, authSignup, authLogin, authGoogle: (cb) => authGoogle(cb), authReset, saveDoc, upload, downloadURL, onStatus: (f) => { listeners.push(f); f(status); }, statusNow: () => status, lastError: () => lastError, ERROR_TEXT: mapAuthError };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => activate());
  else activate();
})(window);
