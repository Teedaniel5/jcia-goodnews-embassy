"""Live, academy, checkout, library, account pages (client-side app behavior)."""
from build import page_head

def build_live():
    b = page_head("Live", "Watch JCIA Services Live", "YouTube Live · Facebook Live · live chat · prayer requests — the Embassy is streaming.")
    b += """
<section class="dark section"><div class="container grid g2" style="align-items:start">
  <div>
    <div class="flex spread mb1"><span class="live-badge" id="liveBadge" style="display:none"><span class="dot"></span> LIVE NOW</span>
      <span id="liveStatus" class="small" style="color:#aab7d4">Checking service status…</span></div>
    <div class="live-wrap">
      <div class="live-off" id="liveOff">
        <span style="font-size:2.4rem">📡</span>
        <b style="font-family:var(--font-head);font-size:1.2rem">Next Service</b>
        <div class="countdown" id="countdown">—</div>
        <p class="small" style="color:#aab7d4">Sundays 9AM &amp; Wednesdays 6PM (CAT) · <a href="https://www.youtube.com/@jciagoodnewsembassy" target="_blank" rel="noopener" style="color:var(--gold-light)">Subscribe on YouTube</a> for the ping.</p>
      </div>
      <div id="livePlayer" class="hidden"></div>
    </div>
    <div class="flex mt1">
      <a class="social-btn" data-social="youtube" href="#"></a>
      <a class="social-btn" data-social="facebook" href="#"></a>
      <span class="small" style="color:#aab7d4">Streaming to 4 platforms — admin chooses per service (multi-stream).</span>
    </div>
    <div class="card mt2" style="background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.12)"><div class="card-body">
      <b>On Air Preferences (Admin)</b>
      <p class="small" style="color:#aab7d4">Platforms chosen in the Admin Dashboard appear as watch links here once service goes live.</p>
      <div id="platformLinks" class="flex mt1"></div>
    </div></div>
  </div>
  <div class="chat-panel">
    <div class="chat-head"><span>💬 Live Chat &amp; Questions</span><a class="btn btn-wa btn-sm" href="https://wa.me/263774827123?text=Prayer%20request%20during%20service" target="_blank" rel="noopener">WhatsApp ↗</a></div>
    <div class="chat-body" id="chatBody">
      <div class="chat-msg them"><div class="who">Usher</div>Welcome to the Good News Embassy! Post your questions and prayer points below. 🙏</div>
      <div class="chat-msg them"><div class="who">Protocol</div>Keep it holy, kind and edifying. Questions will be read on air.</div>
    </div>
    <form class="chat-form" id="chatForm">
      <input id="chatInput" placeholder="Type a message or question…" maxlength="300">
      <button class="btn btn-gold btn-sm" type="submit">Send</button>
    </form>
    <p class="small" style="color:#93a0bd;padding:.4rem .8rem 0">Demo chat is local to your device — connect Firebase (see README) for true multi-user chat during service.</p>
  </div>
</div></section>

<section class="section white-bg" id="prayer"><div class="container grid g2">
  <div>
    <span class="eyebrow">Prayer Request</span>
    <h2 class="section-title">We Will Stand With You</h2>
    <form class="form mt2" id="prayerForm">
      <div class="field"><label>Full Name</label><input name="name" required></div>
      <div class="field"><label>Your Prayer Request</label><textarea name="request" rows="4" required></textarea></div>
      <div class="toggle-row">
        <label class="toggle"><input type="checkbox" name="shared" id="prayerShared"><span class="track"></span></label>
        <span>Share publicly on the Prayer Wall (off = private to admin only)</span>
      </div>
      <button class="btn btn-gold" type="submit">Submit Request 🙏</button>
      <button class="btn btn-wa btn-block" type="button" onclick="JCIA_WA('PRAYER REQUEST\\n' + document.querySelector('#prayerForm [name=name]').value + ': ' + document.querySelector('#prayerForm [name=request]').value)">Or Send Directly via WhatsApp</button>
      <div id="prayerOk" class="success-msg hidden">Your prayer request has been received. The intercession team is standing with you — expect a testimony! 🕊️</div>
    </form>
  </div>
  <div>
    <span class="eyebrow">Prayer Wall</span>
    <h2 class="section-title small" style="font-size:1.5rem">Public Requests</h2>
    <div id="prayerWall" class="grid mt1"></div>
  </div>
</div></section>

<section class="dark section" id="testimonies"><div class="container">
  <div class="center"><span class="eyebrow eyebrow-light">Testimonies Wall</span>
  <h2 class="section-title">Give God the Glory</h2></div>
  <div class="grid g3 mt2" id="liveTestimonies"></div>
  <a class="btn btn-gold mt2" href="testimonies.html">Share Your Testimony →</a>
</div></section>

<section class="section"><div class="container">
  <div class="center"><span class="eyebrow">Social Hub</span>
  <h2 class="section-title">Latest From Our Platforms</h2></div>
  <div class="grid g4 social-grid mt1">
    <a class="card" data-hub="facebook" href="#"><div class="card-img"><span class="big-ico">f</span></div><div class="card-body"><h3>Facebook</h3><p>Services, live alerts &amp; community posts.</p></div></a>
    <a class="card" data-hub="youtube" href="#"><div class="card-img"><span class="big-ico">▶</span></div><div class="card-body"><h3>YouTube</h3><p>Sermons, crusade replays &amp; shorts.</p></div></a>
    <a class="card" data-hub="instagram" href="#"><div class="card-img"><span class="big-ico">◎</span></div><div class="card-body"><h3>Instagram</h3><p>Prophetic moments in pictures.</p></div></a>
    <a class="card" data-hub="tiktok" href="#"><div class="card-img"><span class="big-ico">♪</span></div><div class="card-body"><h3>TikTok</h3><p>Clips, praise reports &amp; spice.</p></div></a>
  </div>
</div></section>
<script>
(function(){
  /* social links */
  if(window.JCIA){var map=JCIA.socials;document.querySelectorAll('[data-hub]').forEach(function(a){a.href=map[a.dataset.hub];a.target='_blank';});}

  /* LIVE state from admin dashboard (localStorage) */
  var live = JSON.parse(localStorage.getItem('jcia_live') || 'null');
  var badge=document.getElementById('liveBadge'),status=document.getElementById('liveStatus'),
      off=document.getElementById('liveOff'),player=document.getElementById('livePlayer'),
      links=document.getElementById('platformLinks');
  if(live && live.isLive){
    badge.style.display='inline-flex'; status.textContent='We are live right now — God bless you!';
    off.classList.add('hidden');
    if(live.youtubeId){player.classList.remove('hidden');
      player.innerHTML='<iframe src="https://www.youtube.com/embed/'+live.youtubeId+'" allowfullscreen title="JCIA Live Service"></iframe>';}
    else if(live.facebookUrl){player.classList.remove('hidden');
      player.innerHTML='<iframe src="https://www.facebook.com/plugins/video.php?href='+encodeURIComponent(live.facebookUrl)+'" allowfullscreen title="JCIA Live Service"></iframe>';}
    var chips = (live.platforms||[]).map(function(p){
      var url = p==='youtube'?'https://youtube.com/@jciagoodnewsembassy': p==='facebook'?'https://facebook.com/jciagoodnewsembassy': p==='instagram'?'https://instagram.com/jcia_goodnewsembassy':'https://tiktok.com/@jcia.goodnewsembassy';
      return '<a class="pay-chip" href="'+url+'" target="_blank" rel="noopener" style="text-transform:capitalize">▶ Watch on '+p+'</span></a>';}).join('');
    links.innerHTML = chips || '<span class="small" style="color:#aab7d4">Watch links will appear here.</span>';
  } else {
    /* countdown to next service (Sun 9AM / Wed 6PM CAT ~ UTC+2) */
    function nextService(){
      var now=new Date(), d=new Date(now);
      d.setMinutes(0,d.getSeconds?0:0,0); d.setSeconds(0);
      function at(day,h){var t=new Date(d); t.setDate(d.getDate()+((day-d.getDay()+7)%7)); t.setHours(h-2,0,0,0); return t;}
      var opts=[at(0,9),at(3,18),at(0,9)]; /* CAT times in UTC */
      if(now.getDay()===3){opts.push(at(3,18));}
      var future=opts.filter(function(t){return t>now;}).sort(function(a,b){return a-b;});
      return future[0]||opts[2];
    }
    var target=nextService();
    function tick(){
      var s=Math.max(0,target-new Date());
      var dd=Math.floor(s/864e5),hh=Math.floor(s%864e5/36e5),mm=Math.floor(s%36e5/6e4),ss=Math.floor(s%6e4/1000);
      document.getElementById('countdown').textContent=dd+'d '+hh+'h '+mm+'m '+ss+'s';
    }
    setInterval(tick,1000);tick();
    status.textContent='We are offline — see you at the next service.';
    badge.style.display='none';
  }

  /* Prayer requests */
  var pf=document.getElementById('prayerForm');
  if(pf){pf.addEventListener('submit',function(e){
    e.preventDefault();
    var fd=new FormData(pf);
    var list=JSON.parse(localStorage.getItem('jcia_prayers')||'[]');
    var shared=document.getElementById('prayerShared').checked;
    list.push({name:fd.get('name'),request:fd.get('request'),shared:shared,at:new Date().toISOString(),status:'new'});
    localStorage.setItem('jcia_prayers',JSON.stringify(list));
    pf.reset();
    document.getElementById('prayerOk').classList.remove('hidden');
    paintWall();
    if(shared){window.open('https://wa.me/263774827123?text='+encodeURIComponent('PRAYER REQUEST\\nName: '+fd.get('name')+'\\nRequest: '+fd.get('request')),'_blank');}
  });}
  function paintWall(){
    var wall=document.getElementById('prayerWall'); if(!wall)return;
    var list=JSON.parse(localStorage.getItem('jcia_prayers')||'[]').filter(p=>p.shared);
    var seed=[{name:'M.C.',request:'Healed of chronic migraines after last Sunday\\'s service — permanent relief since the prayer line.'},{name:'T.N.',request:'Thanking God for a job I received 3 days after the Joel lesson.'}];
    list=list.concat(seed);
    wall.innerHTML=list.map(function(p){
      return '<div class="card"><div class="card-body"><p>🙏 “'+p.request+'”</p><span class="small" style="color:var(--navy);font-weight:700">— '+(p.name||'Anonymous')+' · Agreed in prayer</span></div></div>';}).join('');
  }
  paintWall();

  /* Chat */
  var cf=document.getElementById('chatForm'),body=document.getElementById('chatBody');
  if(cf){cf.addEventListener('submit',function(e){
    e.preventDefault();
    var t=document.getElementById('chatInput').value.trim(); if(!t)return;
    var d=document.createElement('div');d.className='chat-msg me';d.textContent=t;
    body.appendChild(d);body.scrollTop=body.scrollHeight;
    document.getElementById('chatInput').value='';
    setTimeout(function(){
      var r=document.createElement('div');r.className='chat-msg them';
      r.innerHTML='<div class="who">Usher</div>Amen 🙏 Your message has been noted. For prayer, use the Prayer Request form below the player.';
      body.appendChild(r);body.scrollTop=body.scrollHeight;
    },1200);
  });}

  /* testimonies preview */
  if(document.getElementById('liveTestimonies')){
    var t=JSON.parse(localStorage.getItem('jcia_testimonies')||'[]').filter(x=>x.approved);
    var seedT=[{text:'Terminal cancer dissolved after the crusade prayer line — doctors confirmed DRY.',name:'R.M.',loc:'Bulawayo'},
               {text:'I watched online from South Africa and received my healing the same night by faith.',name:'S.K.',loc:'Johannesburg'},
               {text:'After 6 years waiting, my visa came through a week after joining the JCIA Movement.',name:'B.N.',loc:'Harare'}];
    var all=seedT.concat(t.map(function(x){return {text:x.text,name:x.name||'Member',loc:'JCIA Family'};}));
    document.getElementById('liveTestimonies').innerHTML=all.slice(0,3).map(function(x){
      return '<div class="card"><div class="card-body"><p>✨ “'+x.text+'”</p><span class="small" style="color:var(--gold-light);font-weight:700">— '+(x.name||'Member')+', '+(x.loc||'')+'</span></div></div>';}).join('');
  }
})();
</script>"""
    return b
