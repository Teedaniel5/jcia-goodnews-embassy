#!/usr/bin/env python3
"""Build script: assembles static HTML pages for the JCIA — Good News Embassy site.
Run: python3 build.py"""
import os
from datetime import date

ROOT = os.path.dirname(os.path.abspath(__file__))
TITLE_BASE = "JCIA | The Good News Embassy"
NAV = [
    ("index.html", "Home"), ("about.html", "About"), ("ministries.html", "Ministries"),
    ("movement.html", "JCIA Movement"), ("live.html", "Live"), ("academy.html", "Academy/Shop"),
    ("give.html", "Give"), ("contact.html", "Contact"),
]
WHATSAPP = "263774827123"

def header(title, desc):
    nav_html = "".join(
        f'<a href="{h}">{l}</a>' for h, l in NAV
    )
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} | {TITLE_BASE}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title} — JCIA | The Good News Embassy">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="assets/img/apostle-hero.jpg">
<meta property="og:type" content="website">
<meta name="theme-color" content="#0a1128">
<link rel="icon" type="image/png" href="assets/img/jcia-logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
<div class="topbar">⚡ &nbsp;<a href="live.html">Sundays 9AM · Wednesdays 6PM — Join the Live Service</a>&nbsp;<a href="give.html" style="margin-left:.6rem">Give</a></div>
<header class="header">
  <div class="container header-inner">
    <a class="brand" href="index.html">
      <img src="assets/img/jcia-logo.png" alt="JCIA logo">
      <span class="brand-txt"><span class="brand-name">JCIA</span><br><span class="brand-tag">The Good News Embassy</span></span>
    </a>
    <nav class="nav" aria-label="Main">{nav_html}</nav>
    <div class="head-tools">
      <a class="user-chip" href="dashboard.html" id="userChip" style="text-decoration:none"><span>👤</span><span data-chip-name>Login</span></a>
      <button class="tool-btn" id="langBtn" aria-label="Translate / Language" title="Translate this page">🌐</button>
      <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </div>
  <div class="search-box" id="searchBox">
    <input id="searchInput" placeholder="🔍 Search sermons, products, events, devotional…" aria-label="Search">
    <div class="search-results" id="searchResults"></div>
  </div>
</header>
<div id="google_translate_element"></div>
<div class="follow-bar">
  <div class="container fb-inner">
    <span>Follow the Embassy:</span>
    <a class="social-btn" data-social="facebook" href="#"></a>
    <a class="social-btn" data-social="youtube" href="#"></a>
    <a class="social-btn" data-social="instagram" href="#"></a>
    <a class="social-btn" data-social="tiktok" href="#"></a>
    <a class="btn btn-wa btn-sm" href="https://wa.me/{WHATSAPP}">💬 WhatsApp</a>
  </div>
</div>
<main>
"""

def footer():
    y = date.today().year
    return f"""</main>
<div class="cart-bar">
  <span>🛒 <b data-cart-count>0</b> item(s) — <b data-cart-total>$0</b></span>
  <a class="btn btn-gold" href="checkout.html">Checkout →</a>
</div>
<a class="wa-float" href="https://wa.me/{WHATSAPP}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"></a>
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <img src="assets/img/good-news-embassy.png" alt="Good News Embassy" style="width:170px;margin-bottom:1rem;background:#fff;border-radius:10px;padding:.4rem">
        <p style="margin-bottom:.3rem"><b style="color:#fff">JESUS CHRIST INTELLIGENCE AGENCY</b><br>The Good News Embassy</p>
        <p>Redeemed souls, raised as Kingdom Stars — from Bulawayo, Zimbabwe to the Nations.</p>
        <div class="social-row mt1">
          <a class="social-btn" data-social="facebook" href="#"></a>
          <a class="social-btn" data-social="youtube" href="#"></a>
          <a class="social-btn" data-social="instagram" href="#"></a>
          <a class="social-btn" data-social="tiktok" href="#"></a>
        </div>
      </div>
      <div>
        <h4>Explore</h4>
        <div class="footer-links">
          <a href="dashboard.html">Member Dashboard</a>
          <a href="partners.html">Partners Lounge (Gold)</a>
          <a href="social.html">Social Hub</a>
          <a href="about.html">About the Ministry</a>
          <a href="ministries.html">Ministries</a>
          <a href="movement.html">JCIA Movement</a>
          <a href="live.html">Watch Live</a>
          <a href="events.html">Events Calendar</a>
          <a href="blog.html">Daily Devotional</a>
          <a href="testimonies.html">Testimonies</a>
        </div>
      </div>
      <div>
        <h4>Get Involved</h4>
        <div class="footer-links">
          <a href="give.html">Give / Partner</a>
          <a href="academy.html">JCIA Academy Shop</a>
          <a href="account.html">Become a Member</a>
          <a href="movement.html#soulwinner">Be a Soul Winner</a>
          <a href="live.html#prayer">Send a Prayer Request</a>
          <a href="contact.html">Contact Us</a>
        </div>
      </div>
      <div>
        <h4>Newsletter — The Good News</h4>
        <p style="margin-bottom:.8rem">Get daily devotionals and prophetic highlights.</p>
        <form class="newsletter" data-newsletter>
          <input type="email" required placeholder="Your email address">
          <button class="btn btn-gold btn-sm">Subscribe</button>
        </form>
        <p class="mt1">📍 Bulawayo, Zimbabwe<br>✉️ <a href="mailto:teedanielbrilliant@gmail.com">teedanielbrilliant@gmail.com</a><br>💬 <a href="https://wa.me/{WHATSAPP}">WhatsApp: +263 77 482 7123</a></p>
      </div>
    </div>
    <div class="footer-bottom">© {y} Jesus Christ Intelligence Agency (JCIA) — The Good News Embassy. All rights reserved. · <a href="admin.html">Admin</a></div>
  </div>
</footer>
<script src="assets/js/main.js"></script>
<script src="assets/js/jcia-db.js"></script>
<script src="assets/js/jcia-firebase.js"></script>
<script src="assets/js/store.js"></script>
<script src="assets/js/jcia-assistant.js"></script>
<script src="//translate.google.com/translate_a/element.js?cb=googleTranslateInit" defer></script>
""" + """<script>function googleTranslateInit(){try{new google.translate.TranslateElement({pageLanguage:'en',autoDisplay:false},'google_translate_element');}catch(e){}}
JCIAStore && JCIAStore.paintCartBar();
(function(){/* login chip in header */
  var m = JCIA_DB.session();
  var chip = document.getElementById('userChip');
  if(chip && m){chip.querySelector('[data-chip-name]').textContent = m.name.split(' ')[0] + ' · ' + m.id;
    var ic = chip.querySelector('span'); if(m.photo){var im=document.createElement('img');im.src=m.photo;im.alt='';ic.replaceWith(im);} }
  else if(chip){chip.querySelector('[data-chip-name]').textContent = 'Login / Join';}
})();

(function(){/* search overlay: products, events, posts, holdings */
  var sb = document.getElementById('searchBox'), si = document.getElementById('searchInput'), sr = document.getElementById('searchResults');
  if(!sb) return;
  var toggle = document.createElement('button'); toggle.className='tool-btn'; toggle.innerHTML='🔍'; toggle.setAttribute('aria-label','Search');
  toggle.addEventListener('click', function(){ sb.classList.toggle('open'); if(sb.classList.contains('open')) si.focus(); });
  $tools = document.querySelector('.head-tools'); $tools.prepend(toggle);
  var idx = [];
  JJ = JCIA_DB.content();
  JJ.products.forEach(function(p){ if(window.JCIA_DB.canView(p.visibility||'everyone', JCIA_DB.session())) idx.push({t:p.title,d:(p.cat||'product')+' · '+(p.price?'$'+p.price:'FREE'),h:'academy.html'}); });
  (JJ.events||[]).forEach(function(e){ idx.push({t:e.title||e.id, d:(e.type||'event')+' · '+(e.date||''), h:'events.html'}); });
  (JJ.posts||[]).forEach(function(p){ idx.push({t:p.title||p.id, d:'post · '+(p.date||''), h:'blog.html'}); });
  [['JCIA Discipleship 101','course · $29','academy.html'],['Spiritual Intelligence Activation','eBook + audio · $19','academy.html'],['7 Days of Good News','free PDF devotional','academy.html'],['Sunday Main Service','service · weekly','live.html'],['Prophetic Service','service · weekly','live.html'],['JCIA Crusade','crusade','events.html']].forEach(function(f){ idx.push({t:f[0],d:f[1],h:f[2]}); });
  si.addEventListener('input', function(){
    var q = si.value.toLowerCase(); if(q.length<2){sr.innerHTML='';return;}
    sr.innerHTML = idx.filter(function(x){return (x.t+' '+x.d).toLowerCase().includes(q);}).slice(0,8)
      .map(function(x){return '<a href="'+x.h+'"><b>'+x.t+'</b> <span class="muted">'+x.d+'</span></a>';}).join('') || '<a>Nothing found — ask the JCIA Assistant 💬</a>';
  });
})();
/* Language toggle: 🌐 opens/closes the translate widget so it never blocks buttons */
(function(){
  var lb = document.getElementById('langBtn'), gte = document.getElementById('google_translate_element');
  if(!lb || !gte) return;
  lb.addEventListener('click', function(e){
    e.stopPropagation();
    gte.classList.toggle('open');
  });
  document.addEventListener('click', function(e){
    if(gte.classList.contains('open') && !gte.contains(e.target) && e.target !== lb) gte.classList.remove('open');
  });
})();
/* Edit This Page button (admins only) */
(function(){
  var a = JCIA_DB.adminSession();
  if(a && !document.getElementById('editPageBtn') && window.location.pathname.split('/').pop() !== 'admin.html'){
    var b = document.createElement('a'); b.id='editPageBtn'; b.href='admin.html#site';
    b.className='btn btn-gold btn-sm'; b.textContent='✏️ Edit This Page';
    b.style.cssText='position:fixed;bottom:86px;left:16px;z-index:305;box-shadow:0 8px 22px rgba(0,0,0,.35)';
    document.body.appendChild(b);
  }
})();
/* Class upgrade congratulations popup */
(function(){
  try{
    var m = JCIA_DB.session(); if(!m || !m.id) return;
    var k = 'jcia_last_class_' + m.id;
    var prev = localStorage.getItem(k);
    var now = (m.memberClass||'general') + '|' + (m.level||'');
    if(prev && prev !== now){
      var ov = document.createElement('div'); ov.className='modal';
      var cls = JCIA_DB.CLASSES[m.memberClass] ? JCIA_DB.CLASSES[m.memberClass].name : 'General Congregation';
      var isPtr = m.memberClass === 'partner' || m.memberClass === 'son';
      ov.innerHTML = '<div class="popup-announce modal-card" style="text-align:center;padding:2rem;position:relative;max-width:420px">'
        + '<button class="modal-x" aria-label="Close" style="position:absolute;right:10px;top:8px;border:none;background:none;font-size:1.4rem;cursor:pointer">✕</button>'
        + '<div style="font-size:3rem">🎉</div><h2>Congratulations!</h2>'
        + '<p>New class unlocked: <b>'+cls+' · '+(m.level||'Member')+'</b>.</p>'
        + '<p class="small muted">Exclusive content has been unlocked in your dashboard'+(isPtr?' and the Partners Lounge':'')+'.</p>'
        + '<div style="display:flex;gap:.6rem;justify-content:center;margin-top:1rem;flex-wrap:wrap"><a class="btn btn-gold" href="dashboard.html">Open My Dashboard</a>'+(isPtr?'<a class="btn btn-outline" href="partners.html">Partners Lounge</a>':'')+'</div></div>';
      ov.style.cssText = 'position:fixed;inset:0;background:rgba(4,8,24,.72);z-index:400;display:flex;align-items:center;justify-content:center;padding:1rem';
      ov.querySelector('.modal-x').onclick = function(){ ov.remove(); };
      ov.addEventListener('click', function(e){ if(e.target === ov) ov.remove(); });
      document.body.appendChild(ov);
    }
    localStorage.setItem(k, now);
  }catch(e){}
})();
</script>
</body>
</html>
"""

def page_head(crumbs, h1, sub):
    return f"""<section class="page-head"><div class="container">
<div class="crumbs"><a href="index.html">Home</a> / {crumbs}</div>
<h1>{h1}</h1><p>{sub}</p></div></section>"""

MINISTRIES = [
    dict(slug="kids", name="JCIA Kids", title="Children's Ministry", icon="⭐",
         leader="JCIA Kids Leadership Team (under Pastor Audrey Brilliant — Mother of the Embassy)",
         tagline="Raise Kingdom Stars from childhood.",
         desc="""JCIA Kids is a safe, joyful world where children meet Jesus early. Every lesson is built to plant the Word deep: exciting Bible stories, memory verses, skits, songs, games and activities that turn little hearts into bold Kingdom Stars. We equip parents and children's teachers with practical guides so the fire continues at home.""",
         times=[("Sundays", "8:30 AM — Kids Church (during main service)"),
                ("2nd Saturday", "10:00 AM — Superstar Bible Club")],
         join="JCIA Kids Parents & Teachers"),
    dict(slug="youth", name="JCIA Youth", title="Youth Ministry", icon="🔥",
         leader="JCIA Youth Leadership Team",
         tagline="Bold. Modern. On fire for purpose.",
         desc="""JCIA Youth is where teens and young adults are discipled for real life — worship, the Word, mentorship, talent development and purpose coaching. We raise a generation that prays, dreams, builds and shines without apology. If you are 13–30, this is your family.""",
         times=[("Fridays", "5:30 PM — Youth Ignite Service"),
                ("Last Friday", "7:00 PM — Talent & Purpose Night")],
         join="JCIA Youth Squad"),
    dict(slug="men", name="JCIA Men", title="Men's Ministry", icon="🛡️",
         leader="JCIA Men's Leadership Team",
         tagline="Fathers and kings — brotherhood, discipline, dominion.",
         desc="""JCIA Men is a brotherhood of fathers, kings and heirs. We build men of prayer, integrity and provision — covering their homes, leading with wisdom, and taking dominion in the marketplace and the spirit. Iron sharpens iron here.""",
         times=[("1st Saturday", "8:00 AM — Men's War Room Prayer"),
                ("Monthly", "Men's Breakfast & Leadership Clinic")],
         join="JCIA Men Brotherhood"),
    dict(slug="women", name="JCIA Women", title="Women's Ministry", icon="👑",
         leader="President Audrey Brilliant — President, Mother of the Embassy & Leader of Women's Ministry",
         tagline="Grace, wisdom, motherhood — raising stars.",
         desc="""Led by President Audrey Brilliant, JCIA Women is a sanctuary of grace for daughters, wives, mothers and leaders. Here women are taught, prayed for and released — carrying wisdom, beauty and fire into their homes, careers and calling. Mothers of stars raising stars.""",
         times=[("Thursdays", "2:00 PM — Women of Grace Fellowship"),
                ("Monthly", "Mothers & Daughters Banquet")],
         join="JCIA Women of Grace"),
    dict(slug="movement", name="JCIA Movement", title="Evangelical Ministry", icon="🌍",
         leader="Apostle Tee Daniel Brilliant — Apostolic Overseer",
         tagline="Souls won from Bulawayo to the Nations.",
         desc="""The JCIA Movement is the evangelical arm of the Embassy — soul winning, street evangelism, outreaches, missions and open-air crusades marked by preaching the gospel, healing, deliverance, prophecy, miracles and wonders (Mark 16:15-18). It carries the burden of the vision: reviving and repositioning people for total subjection to the Higher power that is God.""",
         times=[("Every 2nd Saturday", "9:00 AM — Street Evangelism, Bulawayo CBD"),
                ("Quarterly", " JCIA Crusades & National Outreaches")],
         join="JCIA Soul Winners"),
]

def ministry_page(m):
    body = page_head(m["name"], m["title"] + " — " + m["tagline"],
                     "Led by " + m["leader"].split(" — ")[0])
    gallery = {"kids": ["⭐", "🎈", "📖", "🎨"], }  # placeholder emoji galleries replaced below
    body += f"""
<section class="section"><div class="container grid g2">
  <div>
    <span class="eyebrow">Ministry</span>
    <h2 class="section-title"><span style="font-size:1.4em">{m['icon']}</span> {m['name']}</h2>
    <p>{m['desc']}</p>
    <div class="card mt2" style="padding:1.2rem">
      <b style="font-family:var(--font-head)">Meeting Times</b>
      <ul class="mt1">
        {"".join(f'<li class="meta mb1">🕑 {d} — {t}</li>' for d, t in m['times'])}
      </ul>
      <p class="small muted mt1">Send a WhatsApp message to confirm this week's venue and time.</p>
    </div>
    <div class="flex mt2">
      <a class="btn btn-wa" href="https://wa.me/{WHATSAPP}?text={('Join ' + m['name']).replace(' ', '%20')}" target="_blank" rel="noopener">💬 Join {m['name']} on WhatsApp</a>
      <a class="btn btn-outline" href="movement.html#soulwinner">Serve With Us</a>
    </div>
  </div>
  <div>
    <div class="media-frame"><span class="flourish"></span></div>
    <div class="card">
      <img class="card-img" src="assets/img/apostle-mic-white.jpg" alt="{m['name']} gallery — ministry photo" style="height:260px">
      <div class="card-body">
        <b style="font-family:var(--font-head)">Ministry Leadership</b>
        <p class="small">{m['leader']}</p>
      </div>
    </div>
  </div>
</div></section>
<section class="dark section"><div class="container">
  <span class="eyebrow eyebrow-light">Photo Gallery</span>
  <h2 class="section-title">{m['name']} in Action</h2>
  <p class="section-sub">Photos are uploaded as the ministry live its mandate — send yours to the WhatsApp number and they will feature here.</p>
  <div class="gallery" id="gallery"></div>
</div></section>
<section class="section white-bg"><div class="container grid g3">
  <div class="card"><div class="card-body"><div class="icon-chip">📖</div><h3 class="mt1">The Word</h3><p>Every activity is anchored in Scripture — the gospel first, always (Mark 16:15).</p></div></div>
  <div class="card"><div class="card-body"><div class="icon-chip">🤝</div><h3 class="mt1">Community</h3><p>A family that prays together, grows together and wins souls together.</p></div></div>
  <div class="card"><div class="card-body"><div class="icon-chip">✨</div><h3 class="mt1">The Supernatural</h3><p>Signs and wonders follow the believing Church (Mark 16:17-18).</p></div></div>
</div></section>
<script>
(function(){{
  var g = document.getElementById('gallery');
  var cap = '{m['name']}';
  var shots = ['reached souls','worship','prayer line','team'];
  g.innerHTML = shots.map(function(s,i){{
    return '<figure style="margin:0;border-radius:10px;overflow:hidden;background:linear-gradient(135deg,#14224a,#0a1128);color:#d4af37;display:flex;align-items:center;justify-content:center;height:170px;font-family:Montserrat"><figcaption style="text-align:center;padding:1rem"><b style="font-size:1.6rem">'+['💛','🙌','🙏','🔥'][i]+'</b><br><span style="font-size:.8rem">'+cap+' · '+s+'</span></figcaption></figure>';
  }}).join('');
}})();
</script>
"""
    return body

# ---------------- PAGES ----------------

def build_index():
    b = """
<section class="hero"><div class="container hero-grid">
  <div>
    <span class="hero-badge">✦ A Prophetic Ministry — Bulawayo to the Nations</span>
    <h1 data-bind="site.heroTitle" data-html>WELCOME TO THE <span class="gold">GOOD NEWS EMBASSY</span></h1>
    <p class="hero-sub" data-bind="site.heroSub">Jesus Christ Intelligence Agency (JCIA) — redeemed souls, raised as Kingdom Stars of the light in Christ Jesus: repositioned to shine and for dominion worldwide.</p>
    <div class="hero-actions">
      <a class="btn btn-gold" href="live.html">🔴 WATCH LIVE NOW</a>
      <a class="btn btn-outline" href="movement.html#soulwinner">JOIN THE JCIA MOVEMENT</a>
      <a class="btn btn-white" href="give.html">GIVE</a>
      <a class="btn btn-outline" href="academy.html">SHOP ACADEMY</a>
    </div>
    <div class="stats">
      <div class="stat"><b>Mark 16:15-18</b>Our Mandate</div>
      <div class="stat"><b>Bulawayo → Nations</b>Our Sweep</div>
      <div class="stat"><b>Amos 3:7</b>The Prophetic Seal</div>
    </div>
  </div>
  <div class="hero-media">
    <div class="media-frame flourish-wrap">
      <span class="flourish"></span><span class="flourish flourish2"></span>
      <img src="assets/img/apostle-hero.jpg" alt="Apostle Tee Daniel Brilliant preaching — JCIA Good News Embassy" fetchpriority="high">
    </div>
  </div>
</div></section>

<section class="section"><div class="container center">
  <span class="eyebrow">Who We Are</span>
  <h2 class="section-title">A Prophetic Ministry Sent to the Nations</h2>
  <div class="gold-line"></div>
  <div class="grid g2 mt2">
    <div class="card"><div class="card-body"><div class="icon-chip">👁️</div><h3 class="mt1">Our Vision</h3><p>Redeemed souls raised to be Kingdom stars of the light in Christ Jesus, thereby repositioned to shine and for dominion worldwide — both in the supernatural and the natural.</p></div></div>
    <div class="card"><div class="card-body"><div class="icon-chip">🚀</div><h3 class="mt1">Our Mission</h3><p>Engaging in evangelical Kingdom advancement endeavours — reviving and repositioning people for total subjection to the Higher power that is God: preaching the gospel of Jesus Christ, healing, deliverance, prophetic, miracles &amp; wonders (Mark 16:15-18).</p></div></div>
  </div>
</div></section>

<section class="dark section"><div class="container grid g2" style="align-items:center">
  <div class="media-frame"><span class="flourish"></span><img class="avatar gold-frame pos-top" style="aspect-ratio:4/5" src="assets/img/apostle-red-suit.jpg" alt="Apostle Tee Daniel Brilliant"></div>
  <div>
    <span class="eyebrow eyebrow-light">Meet the Apostle</span>
    <h2 class="section-title">Apostle Tee Daniel Brilliant — A Voice of This Generation</h2>
    <p class="quote">"The same God who spoke to Samuel, who gave Daniel wisdom, who opened Paul's third eye on the road to Damascus — He is ready to activate YOU."</p>
    <p class="mt1">Prophet, miracle worker, healer of the sick, teacher and trainer, spiritual intelligence pioneer and apostolic founder. Razor-sharp prophetic anointing — accurately foretelling national events, personal destinies, and divine appointments (Amos 3:7).</p>
    <div class="flex mt2">
      <a class="btn btn-gold" href="about.html#apostle">Read His Story</a>
      <a class="btn btn-outline" href="academy.html">Train Under Him</a>
    </div>
  </div>
</div></section>

<section class="section"><div class="container">
  <div class="center"><span class="eyebrow">Ministries</span>
  <h2 class="section-title">A Place for Every Star</h2>
  <p class="section-sub" style="margin-inline:auto">Every age and every calling has a family inside the Embassy.</p></div>
  <div class="grid g3">"""

    cards = [
        ("⭐", "JCIA Kids", "Children's Ministry — safe, fun, Bible lessons and activities for parents and teachers.", "kids.html"),
        ("🔥", "JCIA Youth", "Bold and modern — discipleship, talent and purpose for teens and young adults.", "youth.html"),
        ("🛡️", "JCIA Men", "Brotherhood, leadership, discipline and dominion — fathers and kings.", "men.html"),
        ("👑", "JCIA Women", "Led by President Audrey Brilliant — grace, wisdom, motherhood, raising stars.", "women.html"),
        ("🌍", "JCIA Movement", "Soul winning, street evangelism, missions and crusades — Bulawayo to the Nations.", "movement.html"),
        ("🎓", "JCIA Academy", "Online Bible school, courses, ebooks and training for disciples and leaders.", "academy.html"),
    ]
    b += "".join(f"""
    <a class="card" href="{h}"><div class="card-body"><div class="icon-chip">{i}</div><h3 class="mt1">{n}</h3><p>{d}</p><span class="meta" style="margin-top:auto">Enter →</span></div></a>""" for i, n, d, h in cards)
    b += """
  </div>
</div></section>

<section class="dark section"><div class="container grid g2" style="align-items:center">
  <div>
    <span class="eyebrow eyebrow-light">Upcoming</span>
    <h2 class="section-title">Services, Crusades &amp; Trainings</h2>
    <p class="section-sub">Never miss a divine appointment — the full calendar has Add-to-Calendar buttons.</p>
    <div class="grid mt2">
      <div class="card"><div class="card-body event-card"><div class="event-date"><b>SUN</b><span>WEEKLY</span></div>
        <div><b style="font-family:var(--font-head)">Sunday Main Service</b><p class="small muted">🕐 9:00 AM · The Embassy, Bulawayo</p></div></div></div>
      <div class="card"><div class="card-body event-card"><div class="event-date"><b>WED</b><span>WEEKLY</span></div>
        <div><b style="font-family:var(--font-head)">Prophetic Service</b><p class="small muted">🕐 6:00 PM · The Embassy, Bulawayo</p></div></div></div>
      <div class="card"><div class="card-body event-card"><div class="event-date"><b>SAT</b><span>BIWEEKLY</span></div>
        <div><b style="font-family:var(--font-head)">Street Evangelism — JCIA Movement</b><p class="small muted">🕐 9:00 AM · Bulawayo CBD</p></div></div></div>
    </div>
    <a class="btn btn-gold mt2" href="events.html">Full Events Calendar →</a>
  </div>
  <div class="card" style="padding:1.4rem">
    <span class="pill">Daily Devotional</span>
    <h3 class="mt1" style="font-size:1.25rem">Today's Good News</h3>
    <p class="mt1 muted">Fresh prophetic devotionals are published every morning on the blog.</p>
    <a class="btn btn-outline btn-sm mt1" href="blog.html" style="border-color:var(--navy);color:var(--navy)">Read Today's Word →</a>
  </div>
</div></section>

<section class="section"><div class="container">
  <div class="center"><span class="eyebrow">Social Hub</span>
  <h2 class="section-title">The Embassy on Social Media</h2>
  <p class="section-sub" style="margin-inline:auto">Latest posts and streams from Facebook, YouTube, Instagram and TikTok.</p></div>
  <div class="grid g4 social-grid">"""
    for k, label, ico in [("facebook", "Facebook", "f"), ("youtube", "YouTube", "▶"), ("instagram", "Instagram", "◎"), ("tiktok", "TikTok", "♪")]:
        b += f"""
    <a class="card" href="#" data-social-link="{k}"><div class="card-img"><span class="big-ico">{ico}</span></div>
    <div class="card-body"><h3>{label}</h3><p>Latest posts, clips and live alerts.</p><span class="meta">Follow →</span></div></a>"""
    b += """
  </div>
</div></section>

<section class="section white-bg"><div class="container center">
  <span class="eyebrow">Testimonies</span>
  <h2 class="section-title">What God Is Doing</h2>
  <div class="gold-line"></div>
  <div class="slider mt2" id="homeTesti" style="max-width:720px;margin-inline:auto">
    <div class="slides">
      <div class="slide"><div class="card"><div class="card-body"><p>✨ “Terminal cancer dissolved after the crusade prayer line — doctors confirmed DRY.”</p><span class="small" style="color:var(--navy);font-weight:700">— R.M., Bulawayo</span></div></div></div>
      <div class="slide"><div class="card"><div class="card-body"><p>✨ “Watched online from South Africa and received my healing the same night by faith.”</p><span class="small" style="color:var(--navy);font-weight:700">— S.K., Johannesburg</span></div></div></div>
      <div class="slide"><div class="card"><div class="card-body"><p>✨ “After 6 years waiting, my visa came through a week after joining the JCIA Movement.”</p><span class="small" style="color:var(--navy);font-weight:700">— B.N., Harare</span></div></div></div>
      <div class="slide"><div class="card"><div class="card-body"><p>✨ “My son’s results turned around after the Kids Superstar Club prayed with us.”</p><span class="small" style="color:var(--navy);font-weight:700">— P.M., Bulawayo</span></div></div></div>
    </div>
    <div class="slider-nav" id="homeTestiNav"></div>
  </div>
  <a class="btn btn-dark mt2" href="testimonies.html">Read &amp; Share Testimonies →</a>
</div></section>
<script>
(function(){
  /* social hub links from config */
  var map={facebook:'https://facebook.com/jciagoodnewsembassy',youtube:'https://youtube.com/@jciagoodnewsembassy',instagram:'https://instagram.com/jcia_goodnewsembassy',tiktok:'https://tiktok.com/@jcia.goodnewsembassy'};
  document.querySelectorAll('[data-social-link]').forEach(function(a){a.href=map[a.dataset.socialLink];a.target='_blank';a.rel='noopener';});
})();
</script>"""
    return b

def build_about():
    b = page_head("About", "About JCIA — The Good News Embassy", "A prophetic ministry birthed in Bulawayo, Zimbabwe, and sent to the Nations.")
    b += """
<section class="section"><div class="container grid g2">
  <div>
    <span class="eyebrow">Our Story</span>
    <h2 class="section-title">Birthed in Bulawayo. Sent to the Nations.</h2>
    <p>The Good News Embassy is the prophetic house of the <b>Jesus Christ Intelligence Agency (JCIA)</b> — a family of redeemed champions carrying one obsession: the Good News of Jesus Christ. From humble beginnings in Bulawayo, the ministry has carried crusades, teachings and prophetic fire across cities and borders.</p>
    <p class="mt1">The word "intelligence agency" is deliberate: we are heaven's HUMINT in the Earth — gathering God's counsel (Amos 3:7), decoding eternity into daily life, and deploying agents of light into every sphere of society.</p>
    <div class="mt2">
      <div class="card" style="padding:1.2rem"><b style="font-family:var(--font-head)">Our Vision</b><p class="mt1">Redeemed souls raised to be Kingdom stars of the light in Christ Jesus, thereby repositioned to shine and for dominion worldwide — both in the supernatural and the natural.</p></div>
      <div class="card mt1" style="padding:1.2rem"><b style="font-family:var(--font-head)">Our Mission</b><p class="mt1">Engaging in evangelical Kingdom advancement endeavours, thereby reviving and repositioning people for total subjection to the Higher power that is God by: preaching the gospel of Jesus Christ, healing, deliverance, prophetic, miracles &amp; wonders — Mark 16:15-18.</p></div>
    </div>
  </div>
  <div class="media-frame"><span class="flourish"></span><img class="avatar gold-frame pos-top" style="aspect-ratio:4/5" src="assets/img/apostle-mic-white.jpg" alt="Apostle Tee Daniel Brilliant ministering"></div>
</div></section>

<section class="dark section" id="apostle"><div class="container grid g2" style="align-items:start">
  <div class="card gold-frame" style="padding:0"><img class="card-img" style="height:340px;object-position:top" src="assets/img/apostle-pulpit.jpg" alt="Apostle Tee Daniel Brilliant on the pulpit">
    <div class="card-body"><h3>Apostle Tee Daniel Brilliant</h3>
    <p class="small">Senior Pastor · Founder · Apostolic Overseer</p></div></div>
  <div>
    <span class="eyebrow eyebrow-light">The Founder</span>
    <h2 class="section-title">A Voice of This Generation</h2>
    <details class="acc" open><summary>Prophet of God — Amos 3:7</summary><div class="acc-body">Moves in razor-sharp prophetic anointing, accurately foretelling national events, personal destinies, and divine appointments. The secret of the LORD is with those who fear Him.</div></details>
    <details class="acc"><summary>Miracle Worker — Signs &amp; Wonders</summary><div class="acc-body">Signs and wonders are the hallmark of his crusades — the supernatural is normal in the Kingdom.</div></details>
    <details class="acc"><summary>Healer of the Sick — Mark 16:18</summary><div class="acc-body">Terminal cancers dissolved, the blind regain sight, the deaf hear, the lame walk. Jesus still heals — He has not changed.</div></details>
    <details class="acc"><summary>Teacher &amp; Trainer</summary><div class="acc-body">Breaks down complex spiritual and mental disciplines into practical training anyone can follow — prayer, fasting, Meditation on the Word and mind renewal.</div></details>
    <details class="acc"><summary>Spiritual Intelligence Pioneer</summary><div class="acc-body">Combines ancient disciplines of concentration and meditation with Biblical principles to produce measurable results in intuition, discernment, and higher perception.</div></details>
    <details class="acc"><summary>Apostolic Founder</summary><div class="acc-body">Has built a global community of spiritual champions who operate in gifts of the Spirit, prophetic intercession, and supernatural wisdom.</div></details>
    <div class="card mt2" style="padding:1.2rem">
      <p class="quote">"The same God who spoke to Samuel, who gave Daniel wisdom, who opened Paul's third eye on the road to Damascus — He is ready to activate YOU."</p>
      <p class="small muted mt1">— The Mandate</p>
    </div>
  </div>
</div></section>

<section class="section"><div class="container grid g2">
  <div class="card"><div class="card-body">
    <img class="avatar gold-frame" style="width:220px;background:#fff;padding:1rem" src="assets/img/good-news-embassy.png" alt="The Good News Embassy — President Audrey Brilliant's office emblem">
    <h3 class="mt1">President Audrey Brilliant</h3>
    <p class="small muted">President · Mother of the Embassy · Leader of Women's Ministry</p>
    <p class="mt1">The wife of Apostle Tee Daniel Brilliant and co-labourer in the vision. As Mother of the Embassy she covers the family in prayer and grace, and as Leader of the Women's Ministry she raises daughters, wives and mothers into their full royal identity — mothers of stars, raising stars.</p>
    <a class="btn btn-outline btn-sm mt1" href="women.html">JCIA Women →</a>
  </div></div>
  <div class="card"><div class="card-body">
    <div class="icon-chip">📜</div><h3 class="mt1">What We Believe</h3>
    <ul class="check-list mt1">
      <li>The Bible is the inspired, infallible Word of God.</li>
      <li>Salvation is through faith in Jesus Christ alone.</li>
      <li>The Holy Spirit empowers believers with gifts for service.</li>
      <li>Divine healing and deliverance are for today (Mark 16:17-18).</li>
      <li>The Church is commissioned to preach the gospel to every creature (Mark 16:15).</li>
      <li>Believers are being repositioned as Kingdom stars — for shine and dominion.</li>
    </ul>
  </div></div>
</div></section>"""
    return b

def build_contact():
    b = page_head("Contact", "Contact the Good News Embassy", "WhatsApp, email, visit or pray with us — we answer fast.")
    b += f"""
<section class="section"><div class="container grid g2">
  <div>
    <span class="eyebrow">Contact</span>
    <h2 class="section-title">We'd Love to Hear From You</h2>
    <div class="card mt2" style="padding:1.3rem">
      <div class="flex"><div class="icon-chip">💬</div><div><b>WhatsApp (fastest)</b><p class="small muted">+263 77 482 7123 · Mon–Sat 9am–6pm</p></div></div>
      <div class="flex mt1"><div class="icon-chip">✉️</div><div><b>Email</b><p class="small muted">teedanielbrilliant@gmail.com</p></div></div>
      <div class="flex mt1"><div class="icon-chip">📍</div><div><b>Location</b><p class="small muted">Bulawayo, Zimbabwe — the Embassy awaits you.</p></div></div>
    </div>
    <h3 class="mt2 mb1">Send a Message</h3>
    <form class="form" data-wa-form="Contact from website">
      <div class="form-grid">
        <div class="field"><label>Full Name</label><input name="Name" required></div>
        <div class="field"><label>Phone / WhatsApp</label><input name="Phone" required></div>
      </div>
      <div class="field"><label>Email</label><input type="email" name="Email"></div>
      <div class="field"><label>Message</label><textarea name="Message" rows="4" required></textarea></div>
      <button class="btn btn-gold" type="submit">Send via WhatsApp →</button>
      <p class="form-note">Your message opens in WhatsApp addressed to the ministry — fastest response.</p>
    </form>
  </div>
  <div>
    <iframe class="map" title="Map of Bulawayo, Zimbabwe" src="https://www.openstreetmap.org/export/embed.html?bbox=28.50%2C-20.20%2C28.68%2C-20.10&amp;layer=mapnik" loading="lazy"></iframe>
    <div class="card mt1"><div class="card-body">
      <h3>Service Times</h3>
      <ul class="mt1 check-list">
        <li>Sunday Main Service — 9:00 AM</li>
        <li>Wednesday Prophetic Service — 6:00 PM</li>
        <li>Friday Youth Ignite — 5:30 PM</li>
      </ul>
      <a class="btn btn-wa btn-sm mt1" href="https://wa.me/{WHATSAPP}?text=Directions%20to%20the%20Embassy%20please" target="_blank" rel="noopener">Get Directions on WhatsApp</a>
    </div></div>
  </div>
</div></section>"""
    return b

PAGES = {
    "index.html": ("Home", "JCIA — The Good News Embassy, Bulawayo Zimbabwe. A prophetic ministry of the gospel, healing, deliverance, prophetic, miracles & wonders (Mark 16:15-18). Watch live, join the movement, shop the Academy.", build_index),
    "about.html": ("About Us", "The story, vision, mission, leadership and beliefs of the Jesus Christ Intelligence Agency — The Good News Embassy.", build_about),
    "contact.html": ("Contact", "Contact JCIA — The Good News Embassy in Bulawayo, Zimbabwe via WhatsApp, email or in person.", build_contact),
}

def build_all():
    import pages_extra, pages_live_media, pages_shop, pages_more, pages_admin, pages_phase2
    extra = dict(PAGES)
    extra["ministries.html"] = ("Ministries", "The ministries of JCIA Good News Embassy: Kids, Youth, Men, Women, and the JCIA Movement evangelistic ministry.", pages_extra.build_ministries)
    for m in MINISTRIES:
        slug = m["slug"]
        extra[slug + ".html"] = (m["name"], m["title"] + " — " + m["tagline"] + " Meeting times, leadership, gallery and WhatsApp join for " + m["name"] + ".", (lambda s: (lambda: pages_extra.build_ministry(s)))(slug))
    extra["live.html"] = ("Live Services", "Watch JCIA live services on YouTube Live and Facebook Live, join live chat, submit prayer requests and read testimonies.", pages_live_media.build_live)
    extra["academy.html"] = ("JCIA Academy", "Shop courses, ebooks, audios, videos, PDFs and PowerPoint presentations at the JCIA Academy.", pages_shop.build_academy)
    extra["checkout.html"] = ("Checkout", "Secure checkout with PayPal, Stripe, Paynow, EcoCash, Mukuru and WhatsApp orders.", pages_shop.build_checkout)
    extra["library.html"] = ("My Library", "Your JCIA Academy purchases, course progress, quizzes and certificates.", pages_shop.build_library)
    extra["account.html"] = ("Member Account", "Login or signup as a free member or paid Disciple member of the Good News Embassy.", pages_shop.build_account)
    extra["give.html"] = ("Give", "Give tithes, offerings, seeds and partnership to the Good News Embassy — one-time or monthly, securely.", pages_more.build_give)
    extra["events.html"] = ("Events", "Services, crusades, trainings and conferences of the Good News Embassy — add to your calendar.", pages_more.build_events)
    extra["blog.html"] = ("Daily Devotional", "Daily devotionals, prophetic insights and teachings from the Good News Embassy blog.", pages_more.build_blog)
    extra["testimonies.html"] = ("Testimonies", "Praise reports and testimonies from the JCIA Good News Embassy family.", pages_more.build_testimonies)
    extra["admin.html"] = ("Admin", "JCIA administration dashboard.", pages_admin.build_admin)
    extra["dashboard.html"] = ("Member Dashboard", "Your JCIA member dashboard: profile, library, giving history, membership class, course progress and notifications.", pages_phase2.build_dashboard)
    extra["partners.html"] = ("Partners Lounge", "Gold access — exclusive teachings, prophetic messages and Zoom mentoring for Partners and Sons of the Prophet.", pages_phase2.build_partners)
    extra["social.html"] = ("Social Hub", "Follow the Good News Embassy on Facebook, YouTube, Instagram and TikTok — latest posts and live updates.", pages_phase2.build_social)

    for fname, (ptitle, desc, fn) in extra.items():
        html = header(ptitle, desc) + fn()
        body = footer()
        html += body
        try:
            with open(os.path.join(ROOT, fname), "w", encoding="utf-8") as fh:
                fh.write(html)
        except UnicodeEncodeError as ue:
            import sys
            bad = html[ue.start:ue.end]
            print("SURROGATES while writing", fname, "position", ue.start, "context:", repr(bad), file=sys.stderr)
            raise
        print("built", fname, len(html), "bytes")

if __name__ == "__main__":
    build_all()
