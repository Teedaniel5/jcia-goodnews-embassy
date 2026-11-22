"""Extra pages: ministries + ministry pages + movement."""
from build import header, footer, page_head, ministry_page, MINISTRIES, WHATSAPP

def build_ministries():
    b = page_head("Ministries", "Ministries of the Embassy", "Every age and calling has a family — enter yours.")
    b += """
<section class="section"><div class="container grid g3">"""
    for m in MINISTRIES:
        b += f"""
  <a class="card" href="{m['slug']}.html">
    <div class="card-img" style="display:flex;align-items:center;justify-content:center"><span style="font-size:3rem">{m['icon']}</span></div>
    <div class="card-body"><span class="pill">Ministry</span><h3 class="mt1">{m['name']}</h3><p>{m['tagline']}</p>
    <p class="small">Lead: {m['leader'].split(' — ')[0]}</p><span class="meta" style="margin-top:auto">Enter page →</span></div>
  </a>"""
    b += """
</div></section>
<section class="dark section"><div class="container center">
  <h2 class="section-title">Not Sure Where You Fit?</h2>
  <p class="section-sub" style="margin-inline:auto">Message us on WhatsApp and we will place you where heaven has positioned you.</p>
  <div class="flex" style="justify-content:center">
    <a class="btn btn-wa" href="https://wa.me/""" + WHATSAPP + """?text=Help%20me%20find%20my%20ministry%20at%20JCIA" target="_blank" rel="noopener">💬 Ask on WhatsApp</a>
    <a class="btn btn-gold" href="movement.html#soulwinner">Join the Movement</a>
  </div>
</div></section>"""
    return b

def build_ministry(slug):
    m = [x for x in MINISTRIES if x["slug"] == slug][0]
    b = ministry_page(m)
    if slug == "movement":
        b += """
<section class="dark section" id="soulwinner"><div class="container grid g2">
  <div>
    <span class="eyebrow eyebrow-light">JCIA Movement — Evangelical Ministry</span>
    <h2 class="section-title">I Want To Be A Soul Winner</h2>
    <p class="section-sub">Join the army of agents who preach the gospel, win souls, and take crusades from Bulawayo to the Nations. Fill the form and you will be added to the Soul Winners WhatsApp group for training and deployment.</p>
    <div class="card mt2" style="padding:1.2rem">
      <b style="font-family:var(--font-head)">Upcoming Crusades &amp; Outreaches</b>
      <ul class="mt1 check-list">
        <li>Although we go weekly — check the <a href="events.html" style="color:var(--gold-light)">Events Calendar</a> for the next crusade.</li>
        <li>Although street evangelism teams meet every 2nd Saturday, Bulawayo CBD</li>
        <li>Although national crusades quarterly — cities announced per quarter</li>
      </ul>
    </div>
    <div class="card mt1" style="padding:1.2rem">
      <b style="font-family:var(--font-head)">Outreach Locations</b>
      <div class="mt1">
        <iframe class="map" style="min-height:260px" title="Bulawayo outreaches map" src="https://www.openstreetmap.org/export/embed.html?bbox=28.50%2C-20.20%2C28.68%2C-20.10&amp;layer=mapnik" loading="lazy"></iframe>
      </div>
      <ul class="small mt1 check-list">
        <li>Bulawayo CBD — street evangelism</li>
        <li>Highfields, Nkulumane, Mpopoma — door-to-door</li>
        <li>Nations — crusades and missions as the Lord leads</li>
      </ul>
    </div>
  </div>
  <div class="card" style="padding:1.4rem;align-self:start">
    <h3 style="font-family:var(--font-head)">I Want To Be A Soul Winner</h3>
    <p class="small muted">Soul-winning training + deployment start immediately.</p>
    <form class="form mt1" data-wa-form="I Want To Be A Soul Winner">
      <div class="field"><label>Full Name</label><input name="Name" required></div>
      <div class="field"><label>WhatsApp Number</label><input name="WhatsApp Number" required></div>
      <div class="field"><label>City / Town</label><input name="City" required placeholder="e.g. Bulawayo"></div>
      <div class="field"><label>Age</label><input name="Age" type="number" min="1" max="120" required></div>
      <button class="btn btn-gold btn-block" type="submit">Join the JCIA Movement 🚀</button>
      <p class="form-note">Your details open in WhatsApp addressed to the movement desk — you will receive training materials and be deployed with a team.</p>
    </form>
  </div>
</div></section>"""
    return b
