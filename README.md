# JCIA — The Good News Embassy · Website

Complete, mobile-first, SEO-friendly static website for **Jesus Christ Intelligence Agency (JCIA) — The Good News Embassy**, Bulawayo, Zimbabwe.
Phase 2 adds **membership, classes, partners lounge, role-gated admin, the JCIA Assistant (Gemini AI), automatic giving flow and site-wide editing — with no coding**.

Live: https://jcia-goodnews-embassy.vercel.app · WhatsApp **+263 77 482 7123** · teedanielbrilliant@gmail.com

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Hero ("WELCOME TO THE GOOD NEWS EMBASSY"), vision/mission, Apostle (gold frame), ministries, events, social hub, testimonies **slider** |
| `about.html` | Story, vision, mission, full Apostle Tee Daniel Brilliant profile, President Audrey Brilliant, beliefs |
| `ministries.html` + `kids/youth/men/women/movement.html` | Leader, meeting times, gallery, WhatsApp join. `movement.html` adds "**I Want To Be A Soul Winner**" form + outreach map + crusades |
| `live.html` | Embedded player, **LIVE NOW** badge + countdown, live chat, prayer requests (private/public), prayer wall, social hub — dashboard ↔ page share one state |
| `academy.html` | JCIA Academy store with **visibility-aware** cards (everyone → partner levels) |
| `checkout.html` | PayPal, Stripe, Paynow, EcoCash, Mukuru, **Bank Transfer** (details shown), WhatsApp order · 8% gateway-failure simulation with **retry (no lost sale)** |
| `library.html` / `dashboard.html` | My Library + **Member Dashboard**: Profile, Library, Giving History, Membership Class, Courses Progress, Notifications |
| `account.html` | Signup/Login: **Email+Password, Google-ready, WhatsApp-number 6-digit-code flow** · profile: Name, Country, City, WhatsApp, Gender, DOB, Photo |
| `partners.html` | 🔥 NEW — gold **PARTNERS LOUNGE**: per-level vault (Seed → Covenant → Kingdom → Embassy → Global), Zoom links, downloads; Sons of the Prophet see everything |
| `social.html` | 🔥 NEW — Social Hub: all 4 platforms, follower counts, follow buttons |
| `give.html` | Tithe/Offering/Seed/Partnership/Building Fund/Missions · reference code · **"I HAVE SENT" proof upload → admin approval → receipt** |
| `events.html` · `blog.html` · `testimonies.html` · `contact.html` | Calendar w/ .ics · devotionals · approved testimony wall · contact |
| `admin.html` | **Role-gated Super Admin dashboard** (see below) |

## Admin dashboard (`admin.html`) — role gated

**Admin login is LOCKED — no bootstrap by email.**

1. **First-Time Admin Setup (once):** open `admin.html` — since no admin exists, you are asked for an approved founder email (`teedanielbrilliant@gmail.com` / `audreybrilliant@gmail.com`) and a **real password (min 8)**, then the site hands you a **6-digit code via WhatsApp +263 77 482 7123** (wa.me deep link — confirm on the Apostle's phone) to enter. Setup then disappears permanently; nobody else can create Super Admin.
2. **Every later login:** password **+** a fresh 6-digit WhatsApp code.
3. **3 wrong attempts = 1-hour lock.**
4. **Change Admin Password** (sidebar) edits the password and **logs out all other admin sessions**; "🛑 Log out ALL admin sessions" invalidates every session instantly (session-epoch mechanism).
5. Blocked/removed admins cannot use existing sessions; blocked members are logged out too.

Other members can be assigned roles viaMembers ▸ 🛡 Role. Roles and their tabs:

| Role | Sees |
|---|---|
| Super Admin / President | Everything (Apostle + Audrey) |
| Media Admin | Go Live · Upload/Products · Edit Site · Notify · Assistant |
| Finance Admin | Sales · Giving & Proofs |
| Membership Admin | Members · Testimonies · Prayer Requests |

Panels: 🔴 Go Live (isLive + YouTube ID + Facebook URL + Facebook/YouTube/Instagram/TikTok ON-OFF per service) · 👥 Members (search by name/country/class, members by country & city, one-click **class + level + role** changes, block/unblock/remove, CSV export) · 📚 Upload **ANY file (PDF/MP3/MP4/PPT/PPTX/DOC/DOCX/XLS/JPG/PNG/ZIP ≤ 500MB)** with price, category, **visibility** (Everyone / General / Servants / Sons / Partners Only / specific Partner Level), cover + crop position/size/frame, replace & delete · ✏️ Edit Site (hero, vision, mission, apostle bio, service times, contact, social URLs + follower counts + YouTube Live ID, giving details, Academy starter prices) · 💰 Sales · 🙏 Giving & Proofs (approve → receipt notification) · ✨ Testimonies · 🕊 Prayer Requests · 🗓 Events (visibility-aware) · 📰 Blog · 📣 Notify (presets, Push/Email/WhatsApp, per-class audience) · 🤖 JCIA Assistant (Gemini key, personality, greeting, forbidden topics, FAQ trainer, live chat history) · 🗄 Backup (CSV + full JSON).

**"✏️ Edit This Page"** floats on every page — admins only.

## Membership classes & visibility

`JCIA_DB.CLASSES`: **Sons of the Prophet** (Son → Senior Son → Chief Son) · **Partners** (Seed → Covenant → Kingdom → Embassy → Global) · **Servants** (Ushers, Media, Choir, Intercessors, Evangelism Team, Kids Teachers, Protocol) · **General Congregation**. Members see only what their class allows everywhere (shop, library, downloads, events, products); upgrades trigger a congratulations popup that unlocks new content (`partners-level gates` checked in `JCIA_DB.canView`).

## JCIA Assistant (Gemini)

Floating gold JCIA-logo button on every page. Answers from a built-in ministry knowledge base (vision, mission, times, joining, giving, partnership, courses, prayer, directions…) and uses **Gemini** when a key is set: Admin ▸ 🤖 JCIA Assistant ▸ paste key (or `localStorage.jcia_gemini_key`). It recommends courses by member level, collects prayer requests & testimonies to the admin, and follows the personality/forbidden-topics set by admin. At production, proxy the Gemini call through a serverless function so the key is never in the browser.

## Connect Firebase — FREE Spark plan, step by step

1. **Create the project** — go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project** → name it (e.g. `jcia-goodnews-embassy`) → continue → **Create**. (Everything below fits the free Spark plan: Auth email/password ~50k MAU, Firestore 1 GiB, Storage 5 GB.)
2. **Register the web app** — click the **Web icon (`</>`)** → nickname `JCIA Site` → **Register app**. Firebase shows a `firebaseConfig` block: copy **apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId**.
3. **Paste the keys** — open the site → **Admin** (locked login) → **✏️ Edit Site** → **🔥 Firebase** → paste each value → **💾 Save & Connect** → status shows *Connected*. (Values are stored in the browser, not in the code.)
4. **Turn on what you need** (all free): **Authentication → Sign-in method → Email/Password + Google**; **Firestore Database → Create database**; **Storage → Get started**.
5. **Authorize your domain** — Authentication → Settings → Authorized domains → add `jcia-goodnews-embassy.vercel.app` (this makes Google login work on the live site).
6. **Firestore rules** (client-side demo — the site talks to Firestore directly from the browser, so members must be publicly readable/writable for the Admin Members panel to load everyone worldwide; tighten with server-verified admin claims before storing anything sensitive):
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /members/{docId} {
      allow read: if true;
      allow create, update: if true;
      allow delete: if true;
    }
  }
}
```

## Production wiring (demo → real)

The demo stores data in `localStorage` (single browser) and simulates uploads/payments so **nothing is faked as live when it isn't**. Contained swap points, all behind `assets/js/jcia-db.js`:

- **Auth & database** — paste the Firebase config in **Admin ▸ Edit Site ▸ Firebase ▸ Save & Connect** (step-by-step guide is embedded right there). `assets/js/jcia-firebase.js` loads the SDK on demand and gives you **real Firebase Auth**: email+password signup/login, Google sign-in, password-reset emails, Firestore member records (`saveDoc('members', jcia-id, …)`, `listDocs('members')`, `removeDoc`) and **Storage uploads with progress** (products land in `products/<id>_<filename>` and get a download URL). With Firebase connected, **Admin ▸ Members loads every member worldwide from Firestore** (auto-merged with the local roster every 30 s) and admin actions (class/level/role/block/remove) are mirrored back to Firestore. Replace the `J.*` methods (members, session, content) with Firestore reads to move the whole data layer server-side.
- **Security (Admin & Partner files)** — the demo admin lock (password + WhatsApp code + lockout) runs client-side. After connecting Firebase, create the admin accounts in Firebase Auth, add **Firestore/Storage security rules** and an `admin: true` custom claim, then verify the claim server-side before showing admin data and before issuing download links. Partner-visibility items are already hidden from shop, library and download counts and partner download links redirect to `partners.html`; at production, store files in Firebase Storage and serve **signed, expiring URLs generated only after a server-side class check**.
- **Payments** — insert hosted payment links / a checkout endpoint in `checkout.html` + `give.html`; call the existing `grant`/receipt hooks after server-side confirmation. Bank Transfer + proofs work end-to-end in demo.
- **Uploads (500MB)** — the admin uploader validates size and shows progress; connect Firebase Storage / Cloudinary resumable uploads at the marked spot.
- **Receipts & notifications** — EmailJS / Firebase Functions email + WhatsApp Cloud API at the `D.notify` and wa.me deep links' call points.
- **Push notifications** — FCM keys off the same `notify()` entries.

## Run / build

```bash
python3 build.py      # regenerates all pages from build.py + pages_*.py
python3 -m http.server 8000
```

Deployed by Vercel automatically from `main`.

## Before go-live checklist

- Social URLs + follower counts → Admin ▸ Edit Site ▸ Socials
- Giving details (EcoCash, Bank, Paynow, Mukuru, PayPal) → Admin ▸ Edit Site ▸ Giving
- Gemini API key → Admin ▸ JCIA Assistant
- Real photo of President Audrey Brilliant (an emblem is shown meanwhile)
- First-Time Admin Setup (once) with a strong password (min 8) — then admin login is password + WhatsApp 6-digit code everywhere
