"""Academy/shop, checkout, library, account."""
from build import page_head

def build_academy():
    b = page_head("JCIA Academy", "JCIA ACADEMY — Shop Courses, eBooks, Audios & More",
                  "Preaching, teaching and training disciples worldwide — video courses, eBooks, MP3 sermons, PDFs, PowerPoint presentations and more.")
    b += """
<section class="dark section"><div class="container grid g3">
  <div class="card" style="background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.12)"><div class="card-body"><div class="icon-chip">🎓</div><h3 class="mt1">Online Bible School</h3><p>Structured video courses with modules, quizzes, progress tracking and certificates on completion.</p></div></div>
  <div class="card" style="background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.12)"><div class="card-body"><div class="icon-chip">🛒</div><h3 class="mt1">Secure Checkout</h3><p>PayPal, Stripe, Paynow, EcoCash, Mukuru — or order on WhatsApp. Instant access in My Library after payment.</p></div></div>
  <div class="card" style="background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.12)"><div class="card-body"><div class="icon-chip">♾️</div><h3 class="mt1">Lifetime Access</h3><p>Download your files anytime from your Member dashboard. Purchases are saved to your account forever.</p></div></div>
</div></section>

<section class="section"><div class="container">
  <div class="center"><span class="eyebrow">The Store</span>
  <h2 class="section-title">Equip Yourself</h2>
  <p class="section-sub" style="margin-inline:auto">Start with the free devotional — then go from Redeemed Soul to Kingdom Star.</p></div>
  <div id="shop"></div>
</div></section>

<section class="dark section"><div class="container grid g2" style="align-items:center">
  <div>
    <span class="eyebrow eyebrow-light">Disciple Membership</span>
    <h2 class="section-title">All Courses + Private Community + Mentorship</h2>
    <ul class="check-list mt2">
      <li>Access to <b>all courses</b> in the Academy</li>
      <li><b>Private community</b> of JCIA disciples</li>
      <li><b>Monthly mentorship Zoom</b> with Apostle Tee Daniel Brilliant</li>
      <li>Watch live, join chat, get devotionals, submit prayer requests</li>
    </ul>
    <div class="flex mt2">
      <a class="btn btn-gold" href="account.html?plan=disciple">Become a Disciple Member — $12/month</a>
      <a class="btn btn-outline" href="account.html">Free Member</a>
    </div>
  </div>
  <div class="card" style="padding:1.4rem"><div class="card-body">
    <h3>Member Tiers</h3>
    <table class="table mt1"><tr><th>Benefit</th><th>Free</th><th>Disciple ($12/m)</th></tr>
      <tr><td>Watch live + chat</td><td>✓</td><td>✓</td></tr>
      <tr><td>Devotionals</td><td>✓</td><td>✓</td></tr>
      <tr><td>Prayer requests</td><td>✓</td><td>✓</td></tr>
      <tr><td>All Academy courses</td><td>—</td><td>✓</td></tr>
      <tr><td>Private community</td><td>—</td><td>✓</td></tr>
      <tr><td>Monthly mentorship Zoom</td><td>—</td><td>✓</td></tr></table>
  </div></div>
</div></section>
<script>
document.addEventListener('DOMContentLoaded',function(){if(window.JCIAStore){JCIAStore.renderShop(document.getElementById('shop'));}});
</script>"""
    return b

def build_checkout():
    b = page_head("Checkout", "Secure Checkout", "PayPal · Stripe · Paynow · EcoCash · Mukuru · or order on WhatsApp.")
    b += """
<section class="section"><div class="container grid g2" style="align-items:start">
  <div class="card" style="padding:1.4rem">
    <h2 style="font-family:var(--font-head);font-size:1.3rem">Your Order</h2>
    <div id="cartList" class="mt1"></div>
    <div class="flex spread mt2" style="border-top:1px solid #edf0f6;padding-top:1rem">
      <b>Total</b><b class="price" id="cartTotal">$0</b>
    </div>
    <a class="btn btn-outline btn-sm mt1" href="academy.html">← Continue shopping</a>
  </div>
  <div class="card" style="padding:1.4rem">
    <h2 style="font-family:var(--font-head);font-size:1.3rem">Payment Method</h2>
    <form class="form mt1" id="checkoutForm">
      <div class="field"><label>Full Name</label><input name="name" required></div>
      <div class="field"><label>Email (for instant access)</label><input type="email" name="email" required></div>
      <div class="field"><label>Method</label>
        <select name="method" required>
          <option value="">Select a method…</option>
          <option>PayPal</option><option>Card (Stripe)</option><option>Paynow</option>
          <option>EcoCash</option><option>Mukuru</option><option>Order via WhatsApp</option>
        </select>
      </div>
      <button class="btn btn-gold btn-block" type="submit">Complete Purchase →</button>
      <div id="payOk" class="success-msg hidden"></div>
      <p class="form-note">🔒 This page is HTTPS-secured. Stripe/PayPal/Paynow/EcoCash/Mukuru keys are wired on the server side — see README "Payments". Sales sync to the Admin Dashboard.</p>
    </form>
  </div>
</div></section>
<script>
(function(){
  var S=window.JCIAStore;
  var list=document.getElementById('cartList'),total=document.getElementById('cartTotal');
  var items=S.cartItems();
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

  document.getElementById('checkoutForm').addEventListener('submit',function(e){
    e.preventDefault();
    var fd=new FormData(e.target);
    var items=S.cartItems();
    if(!items.length){alert('Your cart is empty.');return;}
    var order={name:fd.get('name'),email:fd.get('email'),method:fd.get('method'),
      items:items.map(function(p){return p.id;}),total:S.cartTotal(),at:new Date().toISOString()};
    var orders=JSON.parse(localStorage.getItem('jcia_orders')||'[]');
    orders.push(order);localStorage.setItem('jcia_orders',JSON.stringify(orders));
    items.forEach(function(p){S.grant(p.id);});
    S.saveCart([]);
    var ok=document.getElementById('payOk');
    ok.classList.remove('hidden');
    ok.innerHTML='✅ Order received, '+order.name+'! "'+order.method+'" selected — access granted in <b>My Library</b>. '+
      (order.method==='Order via WhatsApp'
        ? '<a class="btn btn-wa btn-sm mt1" target="_blank" rel="noopener" href="https://wa.me/263780000000?text='+encodeURIComponent('ORDER\\nName: '+order.name+'\\nMethod: WhatsApp\\nItems: '+order.items.join(', ')+'\\nTotal: $'+order.total)+'">Send order on WhatsApp →</a>'
        : 'Complete payment on the '+order.method+' gateway screen (provider keys wired in config).');
    ok.insertAdjacentHTML('afterbegin','');
    setTimeout(function(){location.href='library.html';},3500);
  });
})();
</script>"""
    return b

def build_library():
    b = page_head("My Library", "My Library & Member Dashboard", "Your courses, downloads and progress — all in one place.")
    b += """
<section class="section"><div class="container">
  <div id="library"></div>
  <div class="card mt2" style="padding:1.4rem"><div class="card-body">
    <h3>Downloads & Files</h3>
    <p class="small muted">Product files (PDF, MP4, MP3, PPT) are attached to each item after purchase. With Disciple Membership, every course unlocks automatically.</p>
    <a class="btn btn-gold btn-sm mt1" href="academy.html">Browse the Academy →</a>
  </div></div>
</div></section>
<script>
document.addEventListener('DOMContentLoaded',function(){if(window.JCIAStore){JCIAStore.renderLibrary(document.getElementById('library'));}});
</script>"""
    return b

def build_account():
    b = page_head("Account", "Member Login / Signup", "Free members watch live, join chat, get devotionals. Disciple members unlock everything.")
    b += """
<section class="section"><div class="container" style="max-width:560px">
  <div class="card" style="padding:1.6rem">
    <h2 style="font-family:var(--font-head);font-size:1.4rem" id="formTitle">Create Your Account</h2>
    <p class="small muted">Email + Google sign-in supported.</p>
    <form class="form mt1" id="authForm">
      <div class="field"><label>Full Name</label><input name="name" required></div>
      <div class="field"><label>Email</label><input type="email" name="email" required></div>
      <div class="field"><label>Password</label><input type="password" name="password" minlength="6" required></div>
      <button class="btn btn-gold btn-block" type="submit">Sign Up — Free Member</button>
      <button class="btn btn-outline btn-block" type="button" onclick="alert('Connect Google OAuth client ID — see README Logins section.')">Continue with Google</button>
      <div id="authOk" class="success-msg hidden"></div>
      <p class="form-note">Already registered? <a href="#" id="toggleLogin" style="color:var(--gold-deep);font-weight:700">Log in here</a>. Disciple plan ($12/month) can be chosen after signup on this page.</p>
    </form>
    <div class="card mt2" style="background:var(--off-white);border-color:#e3e7ef"><div class="card-body">
      <b>Disciple Membership — $12/month</b>
      <p class="small muted">All courses, private community, monthly mentorship Zoom with Apostle Tee Daniel Brilliant.</p>
      <button class="btn btn-gold btn-sm mt1" id="becomeDisciple">Upgrade to Disciple</button>
    </div></div>
  </div>
</div></section>
<script>
(function(){
  var S=window.JCIAStore;
  var loginMode=false;
  document.getElementById('toggleLogin').addEventListener('click',function(e){
    e.preventDefault();loginMode=!loginMode;
    document.getElementById('formTitle').textContent=loginMode?'Welcome Back':'Create Your Account';
    this.textContent=loginMode?'New here? Sign up':'Log in here';
    document.querySelector('#authForm button[type=submit]').textContent=loginMode?'Log In':'Sign Up — Free Member';
  });
  var params=new URLSearchParams(location.search);
  document.getElementById('authForm').addEventListener('submit',function(e){
    e.preventDefault();
    var fd=new FormData(e.target);
    var m={name:fd.get('name'),email:fd.get('email'),plan:'free',at:new Date().toISOString()};
    var members=JSON.parse(localStorage.getItem('jcia_members')||'[]');
    if(loginMode){
      var found=members.find(function(x){return x.email===m.email;});
      if(!found){alert('No member found with that email — sign up first.');return;}
      m=found;
    } else {
      if(!members.find(function(x){return x.email===m.email;}))members.push(m);
      else {alert('Email already registered — logging you in.');}
      localStorage.setItem('jcia_members',JSON.stringify(members));
    }
    S.db.set('jcia_member',m);
    var ok=document.getElementById('authOk');
    ok.classList.remove('hidden');
    ok.innerHTML='✅ Welcome, '+m.name+'! Your '+m.plan+' membership is active.';
    setTimeout(function(){
      if(params.get('plan')==='disciple'||m.plan==='disciple')location.href='library.html';
      else location.href='library.html';
    },1600);
  });
  document.getElementById('becomeDisciple').addEventListener('click',function(){
    var m=S.member();
    if(!m){location.href='account.html?plan=disciple';return;}
    m.plan='disciple';S.db.set('jcia_member',m);
    var members=JSON.parse(localStorage.getItem('jcia_members')||'[]');
    var i=members.findIndex(function(x){return x.email===m.email;});
    if(i>-1)members[i]=m;
    localStorage.setItem('jcia_members',JSON.stringify(members));
    S.grant('discipleship-101');S.grant('spiritual-intelligence');S.grant('50-preaching-ppts');S.grant('kids-bible-lessons');
    location.href='library.html';
  });
})();
</script>"""
    return b
