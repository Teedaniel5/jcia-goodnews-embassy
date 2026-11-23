"""Admin dashboard — Phase 2 (role-gated full control) + LOCKED login:
First-Time Setup (founder email + real password + WhatsApp 6-digit code), then
login = password + WhatsApp 6-digit code. 3 wrong attempts = 1-hour lock."""
from build import page_head

def build_admin():
    b = page_head("Admin", "JCIA Super Admin Dashboard", "Full control: members & classes, uploads with visibility, site editor, giving approvals, assistant, blog, events, notifications.")
    b += """
<section class="section"><div class="container" id="adminAuth">
  <div class="card" style="max-width:500px;margin-inline:auto;padding:1.6rem">
    <h2 style="font-family:var(--font-head)">🔐 Admin Login — Locked</h2>
    <p class="small muted">Reserved for Apostle Tee Daniel Brilliant, President Audrey Brilliant and approved admins.
    Login needs <b>1) your admin password</b> set in Admin Settings, plus <b>2) a 6-digit code sent to WhatsApp +263 77 482 7123</b>.
    3 failed attempts = 1-hour lock.</p>
    <p class="small muted hidden" id="setupNote" style="border:1px solid var(--gold);border-radius:10px;padding:.6rem .9rem;color:#8a6d1a">⚠️ No admin exists on this browser yet — <b>First-Time Admin Setup</b> below (runs once, then disappears).</p>
    <form class="form mt1" id="adminLoginForm">
      <div class="field"><label>Admin Email (approved founders only)</label><input type="email" name="email" required placeholder="teedanielbrilliant@gmail.com"></div>
      <div class="field"><label id="pwLabel">Admin Password</label><input type="password" name="password" required minlength="8" placeholder="Your real admin password (min 8)"></div>
      <button class="btn btn-gold btn-block" type="submit" id="pwStepBtn">1 · Verify password →</button>
      <div id="adminErr" class="hidden" style="background:#fde8e8;border:1px solid #f5b5b5;color:#b91c1c;padding:.8rem 1rem;border-radius:10px;font-weight:600"></div>
      <div id="codeStep" class="hidden" style="border:1px solid var(--gold);border-radius:12px;padding:1rem;background:#fffdf4">
        <b style="color:#8a6d1a">2 · WhatsApp Verification</b>
        <p class="small" id="codeMsg" style="color:#374151"></p>
        <a class="btn btn-wa btn-sm" id="waCodeLink" target="_blank" rel="noopener">💬 Open WhatsApp — receive the code</a>
        <div class="field mt1"><label>Enter the 6-digit code</label><input id="codeIn" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="••••••" style="letter-spacing:.4em;font-size:1.2rem;text-align:center"></div>
        <button class="btn btn-gold btn-block" type="button" id="verifyBtn">Verify code &amp; Enter Admin →</button>
      </div>
    </form>
    <p class="form-note">Demo note: this lock runs fully client-side until Firebase is connected. After connecting Firebase (Admin ▸ Edit Site ▸ Firebase), member accounts authenticate server-side — README ▸ Security shows how to move this admin gate to Firebase Auth + custom claims.</p>
  </div>
</div>
<div class="container admin-wrap hidden" id="adminRoot">
  <aside class="admin-side card" style="padding:.9rem">
    <div class="center mb1">
      <div id="adminWho" class="small"></div>
      <button class="btn btn-outline btn-sm mt1" id="adminLogoutB">Log Out</button>
    </div>
    <div class="tool-btn-list" id="adminTabs"></div>
    <div class="mt2" style="border-top:1px solid #e5e7eb;padding-top:.8rem">
      <details class="acc">
        <summary>🔑 Change Admin Password</summary>
        <div class="acc-body">
          <div class="field"><label>Current password</label><input type="password" id="cpOld"></div>
          <div class="field"><label>New password (min 8)</label><input type="password" id="cpNew"></div>
          <button class="btn btn-gold btn-sm" id="cpSave">Save — logs out all other admin sessions</button>
          <div id="cpMsg" class="small mt1"></div>
        </div>
      </details>
      <details class="acc mt1">
        <summary>🛑 Log out ALL admin sessions</summary>
        <div class="acc-body">
          <button class="btn btn-outline btn-sm" id="revokeBtn">Apply &amp; re-login</button>
        </div>
      </details>
    </div>
  </aside>
  <div id="panel"></div>
</div>
<script src="assets/js/jcia-admin.js"></script>"""
    return b
