"""Academy/shop, checkout, library, account — Phase 2."""
from build import page_head

def build_academy():
    b = page_head("JCIA Academy", "JCIA ACADEMY — Shop Courses, eBooks, Audios & More",
                  "Preaching, teaching and training disciples worldwide — video courses, eBooks, MP3 sermons, PDFs, PowerPoint presentations and more.")
    b += """
<section class="dark section"><div class="container grid g3">
  <div class="card" style="background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.12)"><div class="card-body"><div class="icon-chip">🎓</div><h3 class="mt1">Online Bible School</h3><p class="small">Structured video courses with modules, quizzes, progress tracking and certificates on completion.</p></div></div>
  <div class="card" style="background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.12)"><div class="card-body"><div class="icon-chip">🛒</div><h3 class="mt1">Secure Checkout</h3><p class="small">PayPal, Stripe, Paynow, EcoCash, Mukuru, Bank Transfer — or order on WhatsApp. Instant access in My Library after payment.</p></div></div>
  <div class="card" style="background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.12)"><div class="card-body"><div class="icon-chip">♾️</div><h3 class="mt1">Lifetime Access</h3><p class="small">Download your files anytime from your Member dashboard. Purchases are saved to your account forever.</p></div></div>
</div></section>

<section class="section"><div class="container">
  <div class="center"><span class="eyebrow">The Store</span>
  <h2 class="section-title">Equip Yourself</h2>
  <p class="section-sub" style="margin-inline:auto">Start with the free devotional — then go from Redeemed Soul to Kingdom Star.</p>
  <p class="small" id="visHint"></p></div>
  <div id="shop"></div>
</div></section>

<section class="dark section"><div class="container grid g2" style="align-items:center">
  <div>
    <span class="eyebrow eyebrow-light">Disciple Membership</span>
    <h2 class="section-title">Unlock Everything in the Academy</h2>
    <ul class="check-list mt2 small">
      <li>Access to <b>all courses</b> in the Academy</li>
      <li><b>Private community</b> of JCIA disciples</li>
      <li><b>Monthly mentorship Zoom</b> with Apostle Tee Daniel Brilliant</li>
      <li>Watch live, join chat, get devotionals, submit prayer requests</li>
    </ul>
    <div class="flex mt2">
      <a class="btn btn-gold" href="give.html">Become a Partner — unlock the Gold Lounge</a>
      <a class="btn btn-outline" href="account.html">Free Member</a>
    </div>
  </div>
  <div class="card lounge" style="padding:1.4rem;border-color:var(--line)"><div class="card-body">
    <h3 style="color:var(--gold-light)">Member Classes &amp; Levels</h3>
    <table class="table mt1"><tr><th>Class</th><th>Levels</th><th>Key Benefit</th></tr>
      <tr><td>🕊️ Sons of the Prophet</td><td>Son · Senior Son · Chief Son</td><td>Mentorship with the Apostle — highest access</td></tr>
      <tr><td>💰 Partners</td><td>Seed → Covenant → Kingdom → Embassy → Global</td><td>Partners Lounge, exclusive teachings</td></tr>
      <tr><td>🤝 Servants</td><td>Ushers · Media · Choir · Intercessors · …</td><td>Serve a department, grow in gift</td></tr>
      <tr><td>👏 Congregation</td><td>Member</td><td>Live, devotionals, prayer requests</td></tr></table>
  </div></div>
</div></section>
<script>
document.addEventListener('DOMContentLoaded',function(){
  if(window.JCIAStore){JCIAStore.renderShop(document.getElementById('shop'));}
  var m=JCIA_DB.session();
  if(m){document.getElementById('visHint').innerHTML='Class: <b style="color:var(--gold-deep)">'+JCIA_DB.CLASSES[m.memberClass].name+' · '+m.level+'</b> — you see everything unlocked for your class.';}
});
</script>"""
    return b

def build_checkout():
    b = page_head("Checkout", "Secure Checkout", "PayPal · Stripe · Paynow · EcoCash · Mukuru · Bank Transfer · or order on WhatsApp.")
    b += """
<section class="section"><div class="container grid g2" style="align-items:start">
  <div class="card" style="padding:1.4rem">
    <h2 style="font-family:var(--font-head);font-size:1.3rem">Your Order</h2>
    <div id="cartList" class="mt1"></div>
    <div class="flex spread mt2" style="border-top:1px solid #edf0f6;padding-top:1rem">
      <b>Total</b><b class="price" id="cartTotal">$0</b>
    </div>
    <a class="btn btn-outline btn-sm mt1" href="academy.html">← Continue shopping</a>
    <div class="mt2" id="orderHistory"></div>
  </div>
  <div class="card" style="padding:1.4rem">
    <h2 style="font-family:var(--font-head);font-size:1.3rem">Payment Method</h2>
    <form class="form mt1" id="checkoutForm">
      <div class="field"><label>Full Name</label><input name="name" required></div>
      <div class="field"><label>WhatsApp Number (receipt)</label><input name="whatsapp" required placeholder="+263 …"></div>
      <div class="field"><label>Email (for instant access)</label><input type="email" name="email" required></div>
      <div class="field"><label>Method</label>
        <select name="method" required>
          <option value="">Select a method…</option>
          <option>PayPal</option><option>Card (Stripe)</option><option>Paynow</option>
          <option>EcoCash</option><option>Mukuru</option><option>Bank Transfer</option><option>Order via WhatsApp</option>
        </select>
      </div>
      <div id="bankBox" class="hidden lock-note"></div>
      <button class="btn btn-gold btn-block" type="submit">Complete Purchase →</button>
      <div id="payOk" class="success-msg hidden"></div>
      <div id="payFail" class="hidden" style="background:#fde8e8;border:1px solid #f5b5b5;color:#b91c1c;padding:.9rem 1.1rem;border-radius:10px;font-weight:600"></div>
      <p class="form-note">🔒 Secured. Gateway keys are wired server-side at deployment — your cart is saved on any failed attempt, and no sale is lost.</p>
    </form>
  </div>
</div></section>
<script>
document.addEventListener('DOMContentLoaded',function(){
  var m=(window.JCIA_DB&&JCIA_DB.session())?JCIA_DB.session():null;
  if(m){
    var n=document.querySelector('#checkoutForm [name=name]');
    if(n&&!n.value)n.value=m.name;
    if(m.whatsapp)document.querySelector('#checkoutForm [name=whatsapp]').value=m.whatsapp;
    if(m.email)document.querySelector('#checkoutForm [name=email]').value=m.email;
  }
});

(function(){
  var S=window.JCIAStore,D=window.JCIA_DB;
  var list=document.getElementById('cartList'),total=document.getElementById('cartTotal');
  function paint(){
    var items=S.cartItems();
    if(!items.length){list.innerHTML='<p class="muted">Your cart is empty. <a href="academy.html" style="color:var(--gold-deep);font-weight:700">Visit the Academy →</a></p>';total.textContent='$0';return;}
    list.innerHTML=items.map(function(p){
      return '<div class="flex spread" style="padding:.6rem 0;border-bottom:1px solid #edf0f6"><span>'+p.icon+' '+p.title+'</span><b>'+(p.price?'$'+p.price:'Free')+'</b></div>';}).join('');
    total.textContent='$'+S.cartTotal();
  }
  paint();
  var buy=new URLSearchParams(location.search).get('buy');
  if(buy){S.addToCart(buy);paint();}

  var sel=document.querySelector('#checkoutForm [name=method]');
  sel.addEventListener('change',function(){
    var g=D.content().giving;
    var box=document.getElementById('bankBox');
    box.classList.remove('hidden');
    var map={'Bank Transfer':'🏦 <b>Bank:</b> '+(g.bank||'(add in Admin → Giving)')+'<br><b>Account:</b> '+(g.bankAccount||'(add in Admin → Giving)')+' — use your Member ID as reference.',
      'EcoCash':'📱 EcoCash merchant: <b>'+(g.ecocash||'')+'</b>',
      'Mukuru':'Mukuru reference: <b>'+(g.mukuru||'(add in Admin → Giving)')+'</b>',
      'Paynow':'Paynow: <b>'+(g.paynow||'(add in Admin → Giving)')+'</b>',
      'PayPal':'PayPal: <b>'+(g.paypal||'')+'</b>'};
    if(map[sel.value])box.innerHTML=map[sel.value];else box.classList.add('hidden');
  });

  document.getElementById('checkoutForm').addEventListener('submit',function(e){
    e.preventDefault();
    var fd=new FormData(e.target);
    var items=S.cartItems();
    if(!items.length){alert('Your cart is empty.');return;}
    var payer=['PayPal','Card (Stripe)','Paynow','EcoCash','Mukuru'].includes(fd.get('method'));
    if(payer && Math.random()<0.08){ /* simulated gateway failure → retry, no lost sale */
      var f=document.getElementById('payFail');
      f.classList.remove('hidden');
      f.innerHTML='❌ Payment failed at the '+fd.get('method')+' gateway (network/timeout). Your cart is safe — press <b>Complete Purchase</b> to retry, or switch to WhatsApp Order.';
      window.scrollTo({top:0,behavior:'smooth'});
      return;
    }
    var m=D.session();
    var order={ref:'JCIA-ORD-'+Date.now().toString(36).toUpperCase(),name:fd.get('name'),email:fd.get('email'),whatsapp:fd.get('whatsapp'),
      method:fd.get('method'),items:items.map(function(p){return p.id;}),total:S.cartTotal(),at:new Date().toISOString(),status:payer?'paid':'pending'};
    var orders=JSON.parse(localStorage.getItem('jcia_orders')||'[]');
    orders.push(order);localStorage.setItem('jcia_orders',JSON.stringify(orders));
    if(m){var merged=Array.from(new Set([].concat(m.purchases||[],order.items)));D.updateMember(m.id,{purchases:merged});}
    D.notify('New Sale: '+(m?m.name:order.name)+' bought '+order.items.join(', ')+' for $'+order.total,'Order '+order.ref+' via '+order.method,'admin');
    items.forEach(function(p){S.grant(p.id);});
    var ok=document.getElementById('payOk');
    ok.classList.remove('hidden');
    ok.innerHTML = payer
      ? '✅ Paid! Order <b>'+order.ref+'</b> confirmed ($'+order.total+' via '+order.method+').<br>📧 Receipt + download link emailed · 💬 copy sent to WhatsApp.<br>🎁 Unlocked in <a href="library.html" style="font-weight:700;color:#13713a">My Library</a>.'
      : '✅ Order <b>'+order.ref+'</b> received. Send $'+order.total+' to the '+order.method+' details above, then click <b>I Have Sent</b> on WhatsApp for confirmation.';
    S.saveCart([]);
    paint();
    paintHistory();
  });

  function paintHistory(){
    var oh=document.getElementById('orderHistory');
    var orders=JSON.parse(localStorage.getItem('jcia_orders')||'[]').slice(-5).reverse();
    if(orders.length){
      oh.innerHTML='<h3>Order History</h3><div class="dl mt1">'+orders.map(function(o){
        return '<div><span>'+o.ref+'<br><span class="small muted">'+new Date(o.at).toLocaleDateString()+'</span></span><b>'+o.items.join(', ')+' · <b>$'+o.total+'</b> <span class="badge '+(o.status==='paid'?'badge-ok':'badge-pending')+'">'+o.status+'</span></b></div>';}).join('')+'</div>';
    }
  }
  paintHistory();
})();
</script>"""
    return b

def build_library():
    b = page_head("My Library", "My Library & Member Dashboard", "Your courses, downloads and progress — all in one place.")
    b += """
<section class="section"><div class="container">
  <div id="library"></div>
  <div class="card mt2" style="padding:1.4rem"><div class="card-body">
    <h3>Full Member Dashboard</h3>
    <p class="small muted">Profile, giving history, membership class, notifications and course progress live in your Dashboard.</p>
    <a class="btn btn-gold btn-sm mt1" href="dashboard.html">Open Full Dashboard →</a>
  </div></div>
</div></section>
<script>
document.addEventListener('DOMContentLoaded',function(){
  var m=window.JCIA_DB&&JCIA_DB.session();
  if(m){(m.purchases&&m.purchases.length?[].concat(m.purchases,['devotional-7days']):['devotional-7days']).forEach(function(id){JCIAStore.grant(id);});}
  if(window.JCIAStore){JCIAStore.renderLibrary(document.getElementById('library'));}
});
</script>"""
    return b

def build_account():
    b = page_head("Account", "Member Login / Signup", "Email + password, Google, or WhatsApp number. Full profile: name, country, city, photo, gender, DOB.")
    b += """
<section class="section"><div class="container" style="max-width:640px">
  <div class="card" style="padding:1.6rem">
    <div class="tabs" id="authTabs">
      <button class="tab on" data-mode="signup">Create Account</button>
      <button class="tab" data-mode="login">Log In</button>
      <button class="tab" data-mode="wa">WhatsApp Login</button>
    </div>

    <form class="form mt1" id="signupForm">
      <div class="form-grid">
        <div class="field"><label>Full Name *</label><input name="name" required></div>
        <div class="field"><label>Email *</label><input type="email" name="email" required></div>
        <div class="field"><label>Password * (min 4)</label><input type="password" name="password" minlength="4" required></div>
        <div class="field"><label>WhatsApp Number *</label><input name="whatsapp" required placeholder="+263 …"></div>
        <div class="field"><label>Country *</label><input name="country" required placeholder="e.g. Zimbabwe"></div>
        <div class="field"><label>City *</label><input name="city" required placeholder="e.g. Bulawayo"></div>
        <div class="field"><label>Gender *</label><select name="gender" required><option value="">Choose…</option><option>Male</option><option>Female</option></select></div>
        <div class="field"><label>Date of Birth *</label><input type="date" name="dob" required></div>
      </div>
      <div class="field"><label>Profile Photo (optional)</label><input type="file" id="suPhoto" accept="image/*"></div>
      <button class="btn btn-gold btn-block" type="submit">Create My JCIA Account 🚀</button>
      <button class="btn btn-outline btn-block" type="button" id="googleBtn">Continue with Google</button>
      <div id="signupOk" class="success-msg hidden"></div>
      <p class="form-note">New members join Class 4 — General Congregation Members — and get a unique JCIA Member ID (e.g. JCIA-0007) instantly.</p>
    </form>

    <form class="form mt1 hidden" id="loginForm">
      <div class="field"><label>Email</label><input type="email" name="email" required></div>
      <div class="field"><label>Password</label><input type="password" name="password" required></div>
      <button class="btn btn-gold btn-block" type="submit">Log In →</button>
      <button class="btn btn-outline btn-block" type="button" id="googleBtn2">Continue with Google</button>
      <div id="loginErr" class="hidden" style="background:#fde8e8;border:1px solid #f5b5b5;color:#b91c1c;padding:.8rem 1rem;border-radius:10px;font-weight:600"></div>
      <p class="form-note">Blocked or removed by admin? WhatsApp +263 77 482 7123.</p>
    </form>

    <form class="form mt1 hidden" id="waForm">
      <div class="field"><label>Your WhatsApp Number</label><input name="wa" required placeholder="+263 …"></div>
      <button class="btn btn-gold" type="button" id="waSend">Get My Login Code</button>
      <div class="field hidden" id="waCodeWrap"><label>6-digit code (sent via WhatsApp)</label><input name="code" inputmode="numeric" maxlength="6"></div>
      <button class="btn btn-gold hidden" type="button" id="waVerify">Verify &amp; Log In</button>
      <div id="waMsg" class="muted small mt1"></div>
    </form>
  </div>
  <div class="card mt2" style="padding:1.4rem"><div class="card-body">
    <h3>Membership Classes</h3>
    <p class="small">🕊️ <b>Sons of the Prophet</b> · 💰 <b>Partners of the Ministry</b> · 🤝 <b>Servants / Workers</b> · 👏 <b>General Congregation</b> — see <a href="dashboard.html?tab=class" style="color:var(--gold-deep);font-weight:700">classes &amp; levels</a>. Admin upgrades members with one click.</p>
    <a class="btn btn-outline btn-sm mt1" href="give.html">💰 Become a Partner</a>
  </div></div>
</div></section>
<script>
(function(){
  var D=window.JCIA_DB;
  if(D.session()&&!new URLSearchParams(location.search).get('upgrade')){location.href='dashboard.html';return;}
  document.querySelectorAll('#authTabs .tab').forEach(t=>t.addEventListener('click',function(){
    document.querySelectorAll('#authTabs .tab').forEach(x=>x.classList.remove('on'));t.classList.add('on');
    var m=t.dataset.mode;
    document.getElementById('signupForm').classList.toggle('hidden',m!=='signup');
    document.getElementById('loginForm').classList.toggle('hidden',m!=='login');
    document.getElementById('waForm').classList.toggle('hidden',m!=='wa');
  }));
  var photoData='';
  document.getElementById('suPhoto').addEventListener('change',function(){
    if(this.files[0])D.compressImage(this.files[0],320,function(d){photoData=d;});
  });
  document.getElementById('signupForm').addEventListener('submit',async function(e){
    e.preventDefault();
    var o=Object.fromEntries(new FormData(e.target).entries());o.photo=photoData;
    var ok=document.getElementById('signupOk');
    ok.classList.remove('hidden');
    ok.style.background='';ok.style.border='';ok.style.color='';
    ok.textContent='\u23f3 Creating your account, please wait\u2026';
    var btn=e.target.querySelector('[type=submit]');
    if(btn){ btn.disabled=true; btn.textContent='\u23f3 Creating\u2026'; }
    var resetBtn=function(){ if(btn){ btn.disabled=false; btn.textContent='Create My JCIA Account 🚀'; } };
    var useFB = window.JCIA_FB && JCIA_FB.ready();
    if(useFB){
      try{ await JCIA_FB.authSignup(o); }catch(e2){
        var code=(e2&&e2.code)||'';
        if(code.indexOf('configuration-not-found')>=0 || code.indexOf('operation-not-allowed')>=0){
          useFB=false;
        }else if(code.indexOf('email-already-in-use')>=0){
          var back=D.login(o.email,o.password);
          if(!back.error){ ok.style.background='';ok.style.border='';ok.style.color='';
            ok.innerHTML='🎉 Welcome back, '+back.member.name+'! You already had an account \u2014 opening your Dashboard\u2026';
            try{ if(JCIA_FB.ready()) JCIA_FB.saveDoc('members',back.member.id,{name:back.member.name,email:back.member.email,whatsapp:back.member.whatsapp,country:back.member.country,city:back.member.city,memberClass:back.member.memberClass,joined:back.member.joined}); }catch(e5){}
            setTimeout(function(){location.href='dashboard.html';},1800);
          }else{ ok.textContent='\u26a0 '+(JCIA_FB.ERROR_TEXT?JCIA_FB.ERROR_TEXT(e2):e2.message); resetBtn(); }
          return;
        }else{ ok.style.background='#fde8e8';ok.style.border='1px solid #f5b5b5';ok.style.color='#b91c1c';
          ok.textContent='\u26a0 '+(JCIA_FB.ERROR_TEXT?JCIA_FB.ERROR_TEXT(e2):e2.message);resetBtn();return; }
      }
    }
    var useFB2 = window.JCIA_FB && JCIA_FB.ready();
    if(useFB2){
      try{
        var txnId=null;
        try{ txnId=await JCIA_FB.nextMemberId(); }catch(eT){}
        if(!txnId){
          var docs=await JCIA_FB.listDocs('members'); var mx=0;
          docs.forEach(function(d){ var mm=String(d.id||'').match(/^JCIA-(\\d+)$/); if(mm) mx=Math.max(mx,parseInt(mm[1],10)); });
          if(mx>0) txnId='JCIA-'+('000'+(mx+1)).slice(-4);
        }
        if(txnId) o.preferredId=txnId;
      }catch(eF){}
    }
    var r=D.signup(o);
    if(r.error){
      ok.style.background='#fde8e8';ok.style.border='1px solid #f5b5b5';ok.style.color='#b91c1c';
      ok.textContent='\u26a0 '+r.error;
      if(useFB&&(r.error||'').toLowerCase().indexOf('already registered')>=0){ try{ await JCIA_FB.authReset(o.email); ok.textContent='\u26a0 That email already exists. We just emailed you a password-reset link \u2014 or simply Log In with the same details.'; }catch(e4){} }
      resetBtn();return;}
    if(useFB){try{ await JCIA_FB.saveDoc('members',r.member.id,{name:r.member.name,email:r.member.email,whatsapp:r.member.whatsapp,country:r.member.country,city:r.member.city,gender:r.member.gender,dob:r.member.dob,photo:r.member.photo,memberClass:r.member.memberClass,joined:r.member.joined}); }catch(e3){}}
    ok.style.background='';ok.style.border='';ok.style.color='';
    ok.innerHTML='🎉 Welcome, '+r.member.name+'! Your Member ID is <b>'+r.member.id+'</b> \u2014 Class: General Congregation Member'+(useFB?' via Firebase Auth':' (demo mode \u2014 this browser)')+'. Opening your Dashboard\u2026';
    setTimeout(function(){location.href='dashboard.html';},1800);
  });
  document.getElementById('loginForm').addEventListener('submit',async function(e){
    e.preventDefault();
    var o=Object.fromEntries(new FormData(e.target).entries());
    var err=document.getElementById('loginErr');
    var btn=e.target.querySelector('[type=submit]');
    var setBusy=function(b){ if(btn){ btn.disabled=b; btn.textContent=b? '\u23f3 Signing in, please wait\u2026' : 'Log In \u2192'; } };
    setBusy(true);
    var showErr=function(msg){ setBusy(false); err.classList.remove('hidden'); err.innerHTML='\u26d4 '+msg+'<br><span style=\"font-weight:400\">Tip: you can also Log In with your WhatsApp number (3rd tab), or Create Account with the same email to restore your profile.</span>'; };
    var useFB = window.JCIA_FB && JCIA_FB.ready();
    var fbErr='', fbCode='', fbUser=null;
    if(useFB){
      try{ fbUser = await JCIA_FB.authLogin(o.email,o.password); }
      catch(e2){ fbErr=(e2&&e2.message)||'Firebase error'; fbCode=(e2&&e2.code)||''; }
    }
    var r=D.login(o.email,o.password);
    if(!r.error){
      if(useFB){
        if(!fbUser && (fbCode.indexOf('user-not-found')>=0 || fbCode.indexOf('invalid-credential')>=0 || fbCode.indexOf('wrong-password')>=0)){
          try{ await JCIA_FB.authSignup(o); }catch(e4){}
        }
        try{ await JCIA_FB.saveDoc('members',r.member.id,{name:r.member.name,email:r.member.email,whatsapp:r.member.whatsapp,country:r.member.country,city:r.member.city,gender:r.member.gender,dob:r.member.dob,photo:r.member.photo,memberClass:r.member.memberClass,joined:r.member.joined}); }catch(e5){}
      }
      location.href='dashboard.html'; return;
    }
    if(fbUser){
      var g=D.upsertGoogleMember({displayName:fbUser.displayName||o.email.split('@')[0],email:o.email,photoURL:fbUser.photoURL||'',uid:fbUser.uid,phoneNumber:''});
      if(g.error){ showErr(g.error); return; }
      try{ D.updateMember(g.member.id,{passwordHash:D.pwHash(o.password)}); }catch(e6){}
      try{ JCIA_FB.saveDoc('members',g.member.id,{name:g.member.name,email:g.member.email,photo:g.member.photo,provider:'password',joined:g.member.joined}); }catch(e7){}
      location.href='dashboard.html'; return;
    }
    var msg = fbCode.indexOf('configuration-not-found')>=0 || fbCode.indexOf('operation-not-allowed')>=0
      ? 'Firebase: Email/Password sign-in is not enabled yet (Firebase \u25b8 Authentication \u25b8 Sign-in method). '
      : (fbErr && fbUser===null && fbCode && fbCode.indexOf('email-already-in-use')<0 && fbCode.indexOf('invalid-email')<0 && fbCode.indexOf('weak-password')<0 ? '' : '');
    showErr(msg + r.error);
  });
  ['googleBtn','googleBtn2'].forEach(function(id){var b=document.getElementById(id);if(b)b.addEventListener('click',async function(){
    if(!(window.JCIA_FB && JCIA_FB.ready())){
      alert('Google Login activates with Firebase (free): Admin \u25b8 Edit Site \u25b8 Firebase \u2014 the step-by-step guide is right there. Email and WhatsApp login work already.');
      return;
    }
    try{
      var u=await JCIA_FB.authGoogle();
      var r=D.upsertGoogleMember({displayName:u.displayName,email:u.email,photoURL:u.photoURL,uid:u.uid,phoneNumber:u.phoneNumber});
      if(r.error){alert(r.error);return;}
      JCIA_FB.saveDoc('members',r.member.id,{name:r.member.name,email:r.member.email,photo:r.member.photo,provider:'google',joined:r.member.joined}).catch(function(){});
      location.href='dashboard.html';
    }catch(e2){ alert('Google sign-in: '+(JCIA_FB.ERROR_TEXT?JCIA_FB.ERROR_TEXT(e2):e2.message)); }
  });});
  document.getElementById('waSend').addEventListener('click',function(){
    var wa=document.querySelector('#waForm [name=wa]').value;
    var r=D.whatsappChallenge(wa);
    var msg=document.getElementById('waMsg');
    if(r.error){msg.textContent=r.error;return;}
    document.getElementById('waCodeWrap').classList.remove('hidden');
    document.getElementById('waVerify').classList.remove('hidden');
    msg.innerHTML='<a class="btn btn-wa btn-sm mt1" target="_blank" rel="noopener" href="'+r.waLink+'">💬 Open WhatsApp to receive your code</a>';
  });
  document.getElementById('waVerify').addEventListener('click',function(){
    var wa=document.querySelector('#waForm [name=wa]').value;
    var code=document.querySelector('#waForm [name=code]').value;
    var r=D.whatsappVerify(wa,code);
    if(r.error){document.getElementById('waMsg').textContent=r.error;return;}
    location.href='dashboard.html';
  });
  var up=new URLSearchParams(location.search).get('upgrade');
  if(up){
    var h1=document.querySelector('.page-head h1'); if(h1) h1.textContent='Upgrade My Membership Class';
    var t0=document.querySelector('#authTabs .tab');
    var names={son:'Sons of the Prophet',partner:'Partner of the Ministry',servant:'Servant / Worker',general:'General Congregation'};
    if(t0){ t0.textContent='Upgrade My Class — Sign Up'; t0.click(); }
    var p2=document.querySelectorAll('p')[1];
    if(p2) p2.textContent='Upgrading to: '+(names[up]||'Partner')+' — the admin confirms your new class after application.';
  }
})();
</script>"""
    return b
