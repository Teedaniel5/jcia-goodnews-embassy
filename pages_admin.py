"""Admin dashboard — Phase 2 (role-gated full control) + LOCKED login:
First-Time Setup (founder email + real password + WhatsApp 6-digit code), then
login = password + WhatsApp 6-digit code. 3 wrong attempts = 1-hour lock."""
from build import page_head

def build_admin():
    b = page_head("Admin", "JCIA Super Admin Dashboard", "Full control: members & classes, uploads with visibility, site editor, giving approvals, assistant, blog, events, notifications.")
    b += """
<section class="section"><div class="container" id="adminAuth">
  <div class="card" style="max-width:500px;margin-inline:auto;padding:1.6rem">
    <h2 style="font-family:var(--font-head)">🔐 Admin Login</h2>
    <p class="small muted">Reserved for Apostle Tee Daniel Brilliant, President Audrey Brilliant and approved admins.
    Login needs only your approved Founder email and your admin password — nothing else.</p>
    <p class="small muted hidden" id="setupNote" style="border:1px solid var(--gold);border-radius:10px;padding:.6rem .9rem;color:#8a6d1a">⚠️ No admin exists on this browser yet — <b>First-Time Admin Setup</b> below (runs once, then disappears).</p>
    <form class="form mt1" id="adminLoginForm">
      <div class="field"><label>Admin Email (approved founders only)</label><input type="email" name="email" required placeholder="teedanielbrilliant@gmail.com"></div>
      <div class="field"><label id="pwLabel">Admin Password</label><input type="password" name="password" required minlength="8" placeholder="Your real admin password (min 8)"></div>
      <button class="btn btn-gold btn-block" type="submit" id="pwStepBtn">Enter Admin →</button>
      <div id="adminErr" class="hidden" style="background:#fde8e8;border:1px solid #f5b5b5;color:#b91c1c;padding:.8rem 1rem;border-radius:10px;font-weight:600"></div>
    </form>
    <p class="small mt1 center"><a href="#" id="forgotLink" style="color:#8a6d1a;font-weight:700">Forgot your password?</a></p>
    <div id="resetStep" class="hidden mt1" style="border:1px solid var(--gold);border-radius:12px;padding:1rem;background:#fffdf4;text-align:left">
      <b style="color:#8a6d1a">Reset your admin password</b>
      <p class="small" id="resetMsg" style="color:#374151"></p>
      <ol class="small" style="color:#374151;margin:.3rem 0 .6rem 1.1rem;padding:0">
        <li>Tap the green <b>Open WhatsApp</b> button below.</li>
        <li>WhatsApp opens with a code message <b>already typed for you</b> — press <b>SEND</b> inside WhatsApp.</li>
        <li>Read the 6-digit code from that message, type it below with your new password. Valid 10 minutes.</li>
      </ol>
      <a class="btn btn-wa btn-sm" id="resetWaLink" target="_blank" rel="noopener">💬 Open WhatsApp — your code is in the message</a>
      <div class="field mt1"><label>6-digit reset code</label><input id="resetCodeIn" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="••••••" style="letter-spacing:.4em;font-size:1.2rem;text-align:center"></div>
      <div class="field"><label>New password (min 8 characters)</label><input type="password" id="resetNewPw" minlength="8" placeholder="Your new admin password"></div>
      <button class="btn btn-gold btn-block" type="button" id="resetSaveBtn">Set New Password &amp; Enter Admin →</button>
      <details class="small mt1" style="color:#6b7280">
        <summary>WhatsApp not working on this device?</summary>
        <p class="small" style="color:#6b7280">Emergency fallback: your code appears here automatically 90 seconds after this step opens — <b id="resetCodeFallback" style="letter-spacing:.3em;font-size:1.1rem;color:#8a6d1a">••••••</b></p>
      </details>
    </div>

    <p class="form-note">Keep your admin password private — only the approved Founder emails below can ever hold an admin account.</p>
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
