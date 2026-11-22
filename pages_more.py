"""Give, events, blog, testimonies."""
from build import page_head

def build_give():
    b = page_head("Give", "Give / Tithe / Offering / Seed / Partnership",
                  "Sow into the gospel — evangelism, crusades, media and humanitarian outreaches from Bulawayo to the Nations.")
    b += """
<section class="dark section"><div class="container" style="max-width:760px">
  <div class="center">
    <span class="eyebrow eyebrow-light">Giving</span>
    <h2 class="section-title">Partner With the Vision</h2>
    <p class="section-sub" style="margin-inline:auto;color:#c7cfdf">"Bring the whole tithe into the storehouse…" — Malachi 3:10. Every gift fuels preaching, healing crusades, and the raising of Kingdom stars.</p>
  </div>
  <div class="card" style="padding:1.6rem;background:rgba(255,255,255,.98)">
    <div class="tabs" id="giveTabs">
      <button class="tab on" data-type="One-time">One-Time</button>
      <button class="tab" data-type="Monthly">Monthly</button>
    </div>
    <form class="form" id="giveForm">
      <div class="field"><label>Purpose</label>
        <select name="Purpose"><option>Tithe</option><option>Offering</option><option>Seed</option><option>Partnership</option><option>Missions / Crusades</option><option>Media & Online Ministry</option><option>Humanitarian</option></select>
      </div>
      <div class="field"><label>Amount (USD)</label>
        <div class="flex">
          <input name="Amount" type="number" min="1" step="0.01" required placeholder="e.g. 25" style="max-width:180px">
          <span class="small" id="freqLabel">one-time gift</span>
        </div>
      </div>
      <div class="flex">
        <button type="button" class="btn btn-outline btn-sm quick" data-amt="10">$10</button>
        <button type="button" class="btn btn-outline btn-sm quick" data-amt="25">$25</button>
        <button type="button" class="btn btn-outline btn-sm quick" data-amt="50">$50</button>
        <button type="button" class="btn btn-outline btn-sm quick" data-amt="100">$100</button>
        <button type="button" class="btn btn-outline btn-sm quick" data-amt="500">$500</button>
      </div>
      <div class="form-grid">
        <div class="field"><label>Full Name</label><input name="Name" required></div>
        <div class="field"><label>Email</label><input type="email" name="Email" required></div>
      </div>
      <div class="field"><label>Method</label>
        <select name="Method" required>
          <option value="">Choose…</option>
          <option>PayPal</option><option>Card (Stripe)</option><option>Paynow</option>
          <option>EcoCash</option><option>Mukuru</option><option>Bank Transfer</option>
          <option>Sent by Hand / WhatsApp</option>
        </select>
      </div>
      <div id="giveDetails" class="lock-note hidden"></div>
      <button class="btn btn-gold btn-block" type="submit">Give Now 🙏</button>
      <div id="giveOk" class="success-msg hidden"></div>
      <div class="hidden" id="proofBox">
        <button class="btn btn-wa btn-block mt1" id="iHaveSent" type="button">✅ I HAVE SENT — Submit Proof &amp; Get Receipt</button>
        <div class="field mt1"><label>Proof of payment (screenshot)</label><input type="file" id="proofFile" accept="image/*"></div>
        <div class="progress-thin hidden" id="proofProg"><span></span></div>
      </div>
      <p class="form-note">🔒 Every gift receives a <b>Giving Reference Code</b>; receipts go out via Email + WhatsApp; gifts land in your Dashboard giving history; admin approves proofs and issues receipts.</p>
    </form>
  </div>
</div></section>
<section class="section"><div class="container grid g3">
  <div class="card"><div class="card-body"><div class="icon-chip">🌍</div><h3 class="mt1">Missions &amp; Crusades</h3><p>Funds open-air crusades across Zimbabwe, Africa and the Nations.</p></div></div>
  <div class="card"><div class="card-body"><div class="icon-chip">📺</div><h3 class="mt1">Media &amp; Online</h3><p>Live streaming, the Academy and discipleship for thousands of mobile viewers.</p></div></div>
  <div class="card"><div class="card-body"><div class="icon-chip">❤️</div><h3 class="mt1">Humanitarian</h3><p>Food, school fees and care for families in the Embassy community.</p></div></div>
</div></section>
<script>
(function(){
  var D=window.JCIA_DB;
  var freq='One-time';
  document.querySelectorAll('#giveTabs .tab').forEach(function(t){t.addEventListener('click',function(){
    document.querySelectorAll('#giveTabs .tab').forEach(function(x){x.classList.remove('on');});
    t.classList.add('on');freq=t.dataset.type;
    document.getElementById('freqLabel').textContent = freq==='Monthly'?'monthly partnership':'one-time gift';
  });});
  document.querySelectorAll('.quick').forEach(function(q){q.addEventListener('click',function(){
    var i=document.querySelector('#giveForm [name=Amount]');i.value=q.dataset.amt;i.focus();});});

  document.querySelector('#giveForm [name=Method]').addEventListener('change',function(){
    var g=D.content().giving,box=document.getElementById('giveDetails');
    var map={'EcoCash':'📱 <b>EcoCash:</b> '+(g.ecocash||'(Admin to update)'),
      'Bank Transfer':'🏦 <b>Bank:</b> '+(g.bank||'(Admin to update)')+'<br><b>Account:</b> '+(g.bankAccount||'(Admin to update)')+' — use your Giving Reference Code',
      'Paynow':'⚡ <b>Paynow:</b> '+(g.paynow||'(Admin to update)'),
      'Mukuru':'🌍 <b>Mukuru:</b> '+(g.mukuru||'(Admin to update)'),
      'PayPal':'💳 <b>PayPal:</b> '+(g.paypal||'(Admin to update)')};
    if(map[this.value]){box.classList.remove('hidden');box.innerHTML=map[this.value];}
    else{box.classList.add('hidden');}
  });

  var currentRef=null;
  document.getElementById('giveForm').addEventListener('submit',function(e){
    e.preventDefault();
    var fd=new FormData(e.target);var o=Object.fromEntries(fd.entries());
    o.Frequency=freq;o.at=new Date().toISOString();
    o.ref='JCIA-GIVE-'+String(Math.floor(1000+Math.random()*9000))+'-'+Date.now().toString(36).toUpperCase();
    currentRef=o.ref;
    var m=D.session(); if(m){o.member=m.id;}
    var g=JSON.parse(localStorage.getItem('jcia_givings')||'[]');g.push(o);localStorage.setItem('jcia_givings',JSON.stringify(g));
    if(m){D.updateMember(m.id,{givings:(m.givings||[]).concat([o])});}
    D.notify('New Giving: '+(m?m.name:(o.Name||'Guest'))+' sowed $'+o.Amount+' ('+o.Purpose+')','Ref '+o.ref+' via '+o.Method,'admin');
    var ok=document.getElementById('giveOk');ok.classList.remove('hidden');
    ok.innerHTML='🙏 Thank you, '+(o.Name||'partner')+'! Your Giving Reference Code is <b class="ref-code">'+o.ref+'</b><br>Send $'+o.Amount+' via <b>'+o.Method+'</b> with the details shown, then press <b>I HAVE SENT</b> below. 📧💬 Confirmed receipt follows by Email + WhatsApp.';
    if(m){ok.innerHTML+=' Your gift is saved in your <a href="dashboard.html?tab=giving" style="font-weight:700;color:#13713a">Giving History</a>.';}
    document.getElementById('proofBox').classList.remove('hidden');
    ok.scrollIntoView({behavior:'smooth',block:'center'});
    window.open('https://wa.me/263774827123?text='+encodeURIComponent('GIVING\nRef: '+o.ref+'\nName: '+(o.Name||'')+'\nType: '+o.Purpose+' ('+freq+')\nAmount: $'+o.Amount+'\nMethod: '+o.Method),'_blank');
  });

  document.getElementById('iHaveSent').addEventListener('click',function(){
    var f=document.getElementById('proofFile').files[0];
    var msg=document.getElementById('giveOk');
    if(!f){msg.innerHTML+=' 📎 <b style="color:#b91c1c">Attach your proof screenshot first.</b>';return;}
    var pv=document.querySelector('#proofProg');pv.classList.remove('hidden');
    var pct=0;var iv=setInterval(function(){pct+=Math.random()*30;pv.firstElementChild.style.width=Math.min(100,pct)+'%';},150);
    D.compressImage(f,900,function(dataUrl){
      clearInterval(iv);pv.firstElementChild.style.width='100%';
      var proofs=JSON.parse(localStorage.getItem('jcia_proofs')||'[]');
      proofs.push({ref:currentRef,proof:dataUrl,at:new Date().toISOString(),status:'pending'});
      localStorage.setItem('jcia_proofs',JSON.stringify(proofs));
      var g=JSON.parse(localStorage.getItem('jcia_givings')||'[]');
      var i=g.findIndex(function(x){return x.ref===currentRef;});
      if(i>-1){g[i].status='pending-approval';g[i].proof=dataUrl.slice(0,200000);}
      localStorage.setItem('jcia_givings',JSON.stringify(g));
      msg.innerHTML='🎉 <b>Proof received!</b> Ref <b class="ref-code">'+currentRef+'</b> — admin is confirming; your receipt follows by Email + WhatsApp.';
      document.getElementById('iHaveSent').outerHTML='<span class="badge badge-ok">Proof submitted ✓</span>';
      window.open('https://wa.me/263774827123?text='+encodeURIComponent('I HAVE SENT — giving ref '+currentRef+' — proof screenshot uploaded. Please approve and issue receipt.'),'_blank');
    });
  });
})();
</script></script>"""
    return b

EVENTS = [
    ("2025-12-15", "Sunday Main Service", "Service", "9:00 AM", "The Embassy, Bulawayo", "Preaching the gospel, healing and the prophetic — Mark 16:15-18."),
    ("2025-12-17", "Prophetic Service", "Service", "6:00 PM", "The Embassy, Bulawayo", "Word, prophecy and prayer line."),
    ("2025-12-27", "JCIA Crusade — Bulawayo CBD", "Crusade", "10:00 AM", "Bulawayo City Centre", "Open-air crusade: salvation, healing, deliverance, miracles & wonders."),
    ("2026-01-03", "Street Evangelism", "Outreach", "9:00 AM", "Bulawayo CBD", "JCIA Movement soul-winning deployment."),
    ("2026-01-24", "Discipleship Training Intensive", "Training", "9:00 AM", "The Embassy + Online", "Spiritual Intelligence Activation training day."),
    ("2026-02-14", "Kingdom Stars Conference", "Conference", "9:00 AM", "The Embassy, Bulawayo", "Annual conference with Apostle Tee Daniel Brilliant & President Audrey Brilliant."),
]

def ics_for(i, ev):
    d, t = ev[0], ev[3].replace(":", "").replace(" ", "")
    kind = {"Service": "800", "Crusade": "b91c1c", "Outreach": "0e8a3e", "Training": "7c3aed", "Conference": "d4af37"}
    return f"""BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//JCIA Good News Embassy//EN
BEGIN:VEVENT
UID:jcia-{i}@goodnewsembassy.org
DTSTART:{d.replace('-', '')}T{t}00
SUMMARY:{ev[1]} — JCIA Good News Embassy
LOCATION:{ev[4]}
DESCRIPTION:{ev[5]}
END:VEVENT
END:VCALENDAR
"""

def build_events():
    b = page_head("Events", "Events Calendar — Services, Crusades, Trainings, Conferences",
                  "Add any event straight to your phone or Google Calendar.")
    b += """
<section class="section"><div class="container">
  <div class="tabs">
    <button class="tab on" data-f="all">All</button><button class="tab" data-f="Service">Services</button>
    <button class="tab" data-f="Crusade">Crusades</button><button class="tab" data-f="Training">Trainings</button>
    <button class="tab" data-f="Conference">Conferences</button><button class="tab" data-f="Outreach">Outreaches</button>
  </div>
  <div class="grid" id="eventList" style="gap:.8rem"></div>
</div></section>
<script>
(function(){
  var EV=[
"""
    for i, e in enumerate(EVENTS):
        ics_data = ics_for(i, e).replace("\n", "\\n")
        b += f'    [{i},"{e[0]}","{e[1]}","{e[2]}","{e[3]}","{e[4]}","{e[5]}","{ics_data}"],\n'
    b += """
  ];
  var list=document.getElementById('eventList');
  var months=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  function paint(f){
    list.innerHTML=EV.filter(function(e){return f==='all'||e[3]===f;}).map(function(e){
      var d=e[1].split('-');
      return '<div class="card"><div class="card-body event-card">'+
        '<div class="event-date"><b>'+parseInt(d[2],10)+'</b><span>'+months[parseInt(d[1],10)-1]+'</span><span style="letter-spacing:0">'+d[0].slice(2)+'</span></div>'+
        '<div style="flex:1;min-width:0"><div class="flex spread"><b style="font-family:var(--font-head)">'+e[2]+'</b><span class="pill">'+e[3]+'</span></div>'+
        '<p class="small muted">🕐 '+e[4]+' · 📍 '+e[5]+'</p><p class="small">'+e[6]+'</p>'+
        '<button class="btn btn-outline btn-sm mt1" data-ics="'+e[0]+'">🗓 Add to Calendar</button></div></div></div>';
    }).join('');
    document.querySelectorAll('[data-ics]').forEach(function(btn){
      btn.addEventListener('click',function(){
        var e=EV[+btn.dataset.ics];
        var blob=new Blob([e[7]],{type:'text/calendar'});
        var a=document.createElement('a');a.href=URL.createObjectURL(blob);
        a.download=e[2].replace(/[^a-z0-9]+/gi,'-')+'.ics';a.click();
      });
    });
  }
  document.querySelectorAll('.tabs .tab').forEach(function(t){t.addEventListener('click',function(){
    document.querySelectorAll('.tabs .tab').forEach(function(x){x.classList.remove('on');});
    t.classList.add('on');paint(t.dataset.f);
  });});
  paint('all');
})();
</script>"""
    return b

def build_blog():
    b = page_head("Daily Devotional", "Blog & Daily Devotional — The Good News", "Fresh devotionals, prophetic insights and teachings — every morning.")
    posts = [
        ("Redeemed! What the Cross Actually Gave You", "2025-12-08", "Redemption is not a coupon for heaven someday — it is a full citizenship granted today. When Jesus cried 'It is finished,' your file in heaven was stamped PAID…", "Mark 16:15-18 · Romans 8:1-2"),
        ("Shine: Repositioned for Dominion", "2025-12-07", "A star does not beg the night for permission — it shines. Isaiah 60:1 says arise and shine, for your light has come. Repositioning begins with seeing yourself as heaven sees you…", "Isaiah 60:1-3 · Matthew 5:14-16"),
        ("Daniel's Discipline: The Secret of Higher Perception", "2025-12-06", "Daniel purposed in his heart, set his face to seek God, and heaven released intel that silenced kings. Spiritual intelligence is trained, not wished for…", "Daniel 1:8 · Daniel 10:12 · Amos 3:7"),
        ("The Prayer That Moves Mountains", "2025-12-05", "Faith does not negotiate with symptoms. It declares what heaven has already said. Whosoever shall say… and shall not doubt in his heart (Mark 11:23)…", "Mark 11:22-24"),
        ("Mothers of Stars — A Word from President Audrey", "2025-12-04", "Every home is an embassy of heaven. As mothers of stars, our words water destinies. Speak life, walk in grace, raise the star God placed in your hands…", "Proverbs 31:26-28"),
    ]
    b += """
<section class="section"><div class="container grid" style="gap:1.2rem">"""
    for t, d, ex, ref in posts:
        b += f"""
  <article class="card"><div class="card-body">
    <div class="flex spread"><span class="pill">Devotional</span><span class="small muted">{d}</span></div>
    <h3 class="mt1">{t}</h3><p>{ex}</p>
    <p class="small" style="color:var(--gold-deep);font-weight:700">📖 {ref}</p>
    <div class="flex mt1"><a class="btn btn-outline btn-sm" href="live.html#prayer">Stand With Us in Prayer</a>
    <a class="btn btn-outline btn-sm" href="live.html?action=watch">Watch Live</a></div>
  </div></article>"""
    b += """
</div>
<div class="center mt2"><a class="btn btn-dark" href="account.html">Get devotionals by email — become a free member</a></div>
</section>"""
    return b

def build_testimonies():
    b = page_head("Testimonies", "Testimonies Wall", "Read what God has done — and share your own. All testimonies are reviewed before publishing.")
    b += """
<section class="dark section"><div class="container grid g2" style="align-items:start">
  <div>
    <span class="eyebrow eyebrow-light">Share</span>
    <h2 class="section-title">Tell Somebody About Jesus</h2>
    <p class="section-sub">Text or video testimony (upload the video to WhatsApp and send it). Our team approves and publishes — to the glory of God.</p>
    <form class="form" id="testForm">
      <div class="field"><label>Full Name (or initials)</label><input name="name" required></div>
      <div class="field"><label>City / Country</label><input name="city" placeholder="e.g. Bulawayo, Zimbabwe"></div>
      <div class="field"><label>Your Testimony</label><textarea name="text" rows="5" required></textarea></div>
      <button class="btn btn-gold" type="submit">Submit Testimony ✨</button>
      <div id="testOk" class="success-msg hidden">Received! Our team will review and publish your testimony shortly. 🎉</div>
    </form>
  </div>
  <div>
    <span class="eyebrow eyebrow-light">The Wall</span>
    <h2 class="section-title small" style="font-size:1.4rem">Praise Reports</h2>
    <div class="grid mt1" id="testWall"></div>
  </div>
</div></section>
<script>
(function(){
  var seed=[
    {text:'Terminal cancer dissolved after the crusade prayer line. Doctors confirmed — the report is DRY. Jesus still heals!',name:'R.M.',city:'Bulawayo'},
    {text:'Blind from an accident for 3 years — after the prophetic service on Wednesday I saw my son\\'s face for the first time.',name:'N. Dube',city:'Gwanda'},
    {text:'Joined the JCIA Movement as a soul winner last quarter. We have led 214 souls to Christ in ourstreet this month.',name:'K.T.',city:'Harare'},
    {text:'The Discipleship 101 course rewired my prayer life. Finances unstuck, purpose clear. Kingdom star activated.',name:'S.M.',city:'Johannesburg'},
    {text:'My marriage of 9 years, on the rocks, was restored after the Women of Grace fellowship. God of the Embassy is faithful.',name:'L.N.',city:'Bulawayo'}
  ];
  var own=JSON.parse(localStorage.getItem('jcia_testimonies')||'[]').filter(function(t){return t.approved;})
    .map(function(t){return {text:t.text,name:t.name,city:t.city||'JCIA Family'};});
  function paint(){
    document.getElementById('testWall').innerHTML=seed.concat(own).map(function(t){
      return '<div class="card"><div class="card-body"><p>✨ “'+t.text+'”</p><span class="small" style="color:var(--gold-light);font-weight:700">— '+(t.name||'Member')+(t.city?', '+t.city:'')+'</span></div></div>';}).join('');
  }
  paint();
  document.getElementById('testForm').addEventListener('submit',function(e){
    e.preventDefault();
    var fd=new FormData(e.target);
    var all=JSON.parse(localStorage.getItem('jcia_testimonies')||'[]');
    all.push({name:fd.get('name'),city:fd.get('city'),text:fd.get('text'),approved:false,at:new Date().toISOString()});
    localStorage.setItem('jcia_testimonies',JSON.stringify(all));
    document.getElementById('testOk').classList.remove('hidden');
    e.target.reset();
    window.open('https://wa.me/263774827123?text='+encodeURIComponent('TESTIMONY SUBMISSION\\nName: '+fd.get('name')+'\\n'+fd.get('text')),'_blank');
  });
})();
</script>"""
    return b
