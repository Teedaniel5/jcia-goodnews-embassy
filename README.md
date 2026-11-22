# JCIA — The Good News Embassy · Website

Complete, mobile-first, SEO-friendly static website for **Jesus Christ Intelligence Agency (JCIA) — The Good News Embassy**, Bulawayo, Zimbabwe.

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Hero ("WELCOME TO THE GOOD NEWS EMBASSY"), vision/mission, Apostle, ministries, events, social hub, testimonies |
| `about.html` | Story, vision, mission, full Apostle Tee Daniel Brilliant profile, President Audrey Brilliant, beliefs |
| `ministries.html` | Ministry hub |
| `kids.html / youth.html / men.html / women.html / movement.html` | Each ministry: leader, meeting times, gallery, WhatsApp join, description. `movement.html` adds the **I Want To Be A Soul Winner** form, outreach locations map and crusades list |
| `live.html` | Embedded YouTube/Facebook Live player, **LIVE NOW** badge + countdown, live chat, prayer request form (private/public), prayer wall, testimonies, social hub + per-service platform links |
| `academy.html` | JCIA Academy store — courses, eBooks, audios, videos, PDFs, PowerPoint presentations; tabbed catalogue, cart |
| `checkout.html` | Cart + PayPal / Stripe / Paynow / EcoCash / Mukuru / WhatsApp order |
| `library.html` | My Library — purchased products, course player, modules, progress bar, quiz, certificate |
| `account.html` | Free vs Disciple ($12/m) membership, email signup (Google-ready) |
| `give.html` | Tithe / Offering / Seed / Partnership — one-time & monthly, amount chips, all payment methods |
| `events.html` | Events calendar (services, crusades, trainings, conferences) with **Add to Calendar (.ics)** |
| `blog.html` | Blog / daily devotional |
| `testimonies.html` | Public wall + submission (admin-approved) |
| `contact.html` | WhatsApp, email, location (Bulawayo), map, service times |
| `admin.html` | Admin dashboard |

## Admin dashboard (`admin.html`)

- 🔴 **Go Live**: on/off + YouTube video ID / Facebook URL + **per-service platform checkboxes (Facebook / YouTube / Instagram / TikTok)** with Restream multi-stream notes → the Live page updates instantly (badge, embedded player, watch links).
- 🎓 **Products**: publish new products (title, price USD, category, description, cover, file URL).
- 💰 **Sales**: orders + giving tables and KPI totals.
- 👥 **Members** + newsletter subscribers.
- ✨ **Testimonies**: approve / unpublish / delete before they show on the wall.
- 🙏 **Prayer requests**: view private & public, reply via WhatsApp.
- 🗓 **Events**: add events to the calendar.
- 📣 **Notify**: broadcast push/email/WhatsApp to members.

> The demo runs on `localStorage` (single browser). For production multi-user, connect Firebase or Supabase and a small backend (see "Upgrading" below). All pages already call the right data helpers (`window.JCIAStore.db`), so the swap is contained.

## Before go-live — replace placeholders

All placeholders live in two places:

1. `assets/js/main.js` → `window.JCIA = { whatsapp, email, socials{facebook,youtube,instagram,tiktok}, live{youtubeId} }`
2. Search-and-replace `263780000000` / `+263 78 000 0000` across `build.py`, then run `python3 build.py`.

Other real values to set:
- **WhatsApp number** (ministry + soul-winner desk)
- **Social URLs** (Facebook, YouTube, Instagram, TikTok)
- **YouTube Live ID** (or use Admin → Go Live)
- **Service times** (build.py ministry data + footer topbar)
- **Payfast gateway keys** (below)

## Payments

Checkout and Give pages support **PayPal, Stripe (card), Paynow, EcoCash, Mukuru** plus a **WhatsApp order** fallback that composes the full order/giving details to the ministry number.

To wire real money: create a Stripe Payment Link or PayPal checkout button per product, or a backend endpoint that creates the charge and then calls the "grant access" hook (`JCIAStore.grant(id)` client-side today). Paynow/EcoCash/Mukuru work the same way via their merchant APIs. Since this is a static site with no secrets, do key-holding on the server or use hosted payment links — never embed secret keys in these files.

## Logins

Email signup works in demo mode (localStorage). For **Google sign-in + real accounts**, add Firebase Auth and replace the handler in `account.html` (`Continue with Google` button is pre-wired). Guard `admin.html` with Firebase Auth custom claim `admin: true` before public launch.

## Live chat

Demo chat is device-local. For true multi-user chat during service, mount Firebase Realtime Database or Supabase Realtime on `#chatBody` (structure is ready: `{who, text, at}`).

## Upgrading to full content management

`python3 build.py` regenerates every page from templates in `build.py` + `pages_*.py`. Ministry pages share `MINISTRIES` data (leader, times, description) — edit once, rebuild, all pages update. For non-technical admins long-term, move content into Firebase/Firestore collections mirroring the admin dashboard panes.

## Deployment

The whole folder is static — host anywhere:

- **Netlify / Vercel / Cloudflare Pages**: drag-and-drop the folder or connect the repo. Netlify is strong for African traffic + gives free HTTPS (required for payments).
- **GitHub Pages**: Settings → Pages → deploy from branch.

Recommended: Netlify + custom domain e.g. `goodnewsembassy.org`.

## SEO

Every page ships: unique `<title>` + meta description, Open Graph tags (share image = Apostle photo), semantic headings, fast single-CSS/JS, lazy-loaded map, lightweight fonts (display=swap), responsive mobile-first layout, `robots.txt` + `sitemap.xml` (update domain after purchase), favicon from the JCIA seal.
