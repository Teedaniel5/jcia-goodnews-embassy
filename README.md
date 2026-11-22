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

**Bootstrap:** first login with `teedanielbrilliant@gmail.com` or `audreybrilliant@gmail.com` (any password ≥ 4 chars the first time) creates the Super Admin. Other members can be assigned roles viaMembers ▸ 🛡 Role. Roles and their tabs:

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

## Production wiring (demo → real)

The demo stores data in `localStorage` (single browser) and simulates uploads/payments so **nothing is faked as live when it isn't**. Contained swap points, all behind `assets/js/jcia-db.js`:

- **Auth & database** — Firebase Auth (Google provider is already button-ready) + Firestore; replace the `J.*` methods (members, session, content). Use auth custom claims for `adminRole` and *deny rules* on `memberClass`.
- **Security (Partner files)** — partner-gated items are already hidden from shop, library and download counts; download links for partner-visibility products redirect to `partners.html`. At production, never ship public URLs: store files in Firebase Storage / Cloudinary with **signed, expiring URLs generated from a server after a server-side class check**.
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
- Bootstrap Super Admin password, then set strong passwords for all admin accounts
