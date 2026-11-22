"""Phase 2 pages: member dashboard, partners lounge, social hub."""
from build import page_head

def build_dashboard():
    b = page_head("Member Dashboard", "My JCIA Dashboard", "Your profile, library, giving history, membership class, course progress and notifications.")
    b += """
<section class="section"><div class="container">
  <div id="dashRoot">
    <div class="card center" style="padding:2rem"><p><b>🔒 Please log in first.</b></p>
      <a class="btn btn-gold mt1" href="account.html">Login / Signup →</a></div>
  </div>
</div></section>
<script src="assets/js/jcia-dashboard.js"></script>"""
    return b

def build_partners():
    b = page_head("Partners Lounge", "The PARTNERS LOUNGE — Gold Access", "Exclusive teachings, prophetic messages, Zoom links and downloads for covenant partners.")
    b += """
<section class="lounge section"><div class="container">
  <div class="center">
    <span class="hero-badge">✦ GOLD ACCESS · PARTNERS & SONS ONLY</span>
    <h1 class="lounge-title mt1">THE PARTNERS LOUNGE</h1>
    <p class="section-sub" style="margin-inline:auto;color:#dbe3f2">"…them that honour me I will honour." — 1 Samuel 2:30</p>
  </div>
  <div id="loungeRoot"></div>
</div></section>
<script src="assets/js/jcia-lounge.js"></script>"""
    return b

def build_social():
    b = page_head("Social Hub", "Social Hub — Follow & Share the Embassy", "Latest posts, live alerts and follow buttons for Facebook, YouTube, Instagram and TikTok.")
    b += """
<section class="section"><div class="container">
  <div class="grid g4" id="socialCards"></div>
</div></section>
<section class="dark section"><div class="container">
  <div class="center"><span class="eyebrow eyebrow-light">Social Feed</span>
  <h2 class="section-title">Latest From All Platforms</h2>
  <p class="section-sub" style="margin-inline:auto;color:#c7cfdf">Posts stream live from our pages. Follow to be the first to see sermons, crusades and prophetic moments.</p></div>
  <div class="grid g4 mt2" id="feedGrid">
    <div class="card gold-box lounge"><div class="card-img" style="display:flex;align-items:center;justify-content:center"><span style="font-size:2.6rem">f</span></div><div class="card-body"><h3>Facebook</h3><p>Full service posts, live announcements & community updates.</p></div></div>
    <div class="card gold-box lounge"><div class="card-img" style="display:flex;align-items:center;justify-content:center"><span style="font-size:2.6rem">▶</span></div><div class="card-body"><h3>YouTube</h3><p>Sermons, crusade replays, worship moments and shorts.</p></div></div>
    <div class="card gold-box lounge"><div class="card-img" style="display:flex;align-items:center;justify-content:center"><span style="font-size:2.6rem">◎</span></div><div class="card-body"><h3>Instagram</h3><p>Prophetic moments in pictures, quotes and daily gold.</p></div></div>
    <div class="card gold-box lounge"><div class="card-img" style="display:flex;align-items:center;justify-content:center"><span style="font-size:2.6rem">♪</span></div><div class="card-body"><h3>TikTok</h3><p>Clips, praise reports and pure Kingdom heat.</p></div></div>
  </div>
  <div class="center mt2"><a class="btn btn-gold" href="live.html">Watch LiveWhile You're Here 📺</a></div>
</div></section>
<script>
(function(){
  var c=JCIA_DB.content(),so=c.socials;
  var defs=[
    ['facebook','Facebook','f',so.facebook,so.facebookFollowers,'#1877f2'],
    ['youtube','YouTube','▶',so.youtube,so.youtubeFollowers,'#e11d2e'],
    ['instagram','Instagram','◎',so.instagram,so.instagramFollowers,'#c13584'],
    ['tiktok','TikTok','♪',so.tiktok,so.tiktokFollowers,'#111']
  ];
  function svg(k){var m={facebook:'M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.7-.1-1.5-.2-2.3-.2-2.3 0-3.9 1.4-3.9 4v2.3H8v3h2.2v7h3.3z',youtube:'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z',instagram:'M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 3.6a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 2.2a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm6.4-3.7a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z',tiktok:'M16.7 2h-3.1v13.3a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.3a6 6 0 0 0-.9-.1 5.9 5.9 0 1 0 5.9 5.9V8.7a7.4 7.4 0 0 0 4.3 1.4V7a4.4 4.4 0 0 1-4.2-5z'};return '<svg width="26" height="26" viewBox="0 0 24 24" fill="'+col+'"><path d="'+m[k]+'"/></svg>';var col='#1877f2';}
  document.getElementById('socialCards').innerHTML=defs.map(function(d){
    return '<div class="stat-card"><svg width="30" height="30" viewBox="0 0 24 24" fill="'+d[5]+'"><path d="'+path(d[0])+'"/></svg><div class="follower-count">'+d[4]+'</div><div class="small muted">Followers</div><a class="btn btn-gold btn-sm mt1" style="width:100%" target="_blank" rel="noopener" href="'+d[3]+'">Follow '+d[1]+'</a></div>';
  }).join('');
  function path(k){var m={facebook:'M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.7-.1-1.5-.2-2.3-.2-2.3 0-3.9 1.4-3.9 4v2.3H8v3h2.2v7h3.3z',youtube:'M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z',instagram:'M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 3.6a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zm0 2.2a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm6.4-3.7a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z',tiktok:'M16.7 2h-3.1v13.3a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.3a6 6 0 0 0-.9-.1 5.9 5.9 0 1 0 5.9 5.9V8.7a7.4 7.4 0 0 0 4.3 1.4V7a4.4 4.4 0 0 1-4.2-5z'};return m[k];}
  var url=encodeURIComponent(location.href),txt=encodeURIComponent('Join me at the Good News Embassy — JCIA:');
  document.querySelectorAll('[data-share]').forEach(function(a){
    var k=a.dataset.share;
    a.href = k==='wa'?'https://wa.me/?text='+txt+'%20'+url : k==='fb'?'https://www.facebook.com/sharer/sharer.php?u='+url : 'https://www.tiktok.com/';
    a.target='_blank';
  });
})();
</script>"""
    return b
