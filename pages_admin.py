"""Admin dashboard — Phase 2 (role-gated full control)."""
from build import page_head

def build_admin():
    b = page_head("Admin", "JCIA Super Admin Dashboard", "Full control: members & classes, uploads with visibility, site editor, giving approvals, assistant, blog, events, notifications.")
    b += """
<section class="section"><div class="container" id="adminAuth">
  <div class="card" style="max-width:460px;margin-inline:auto;padding:1.6rem">
    <h2 style="font-family:var(--font-head)">🔐 Admin Login</h2>
    <p class="small muted">Reserved for Apostle Tee Daniel Brilliant, President Audrey Brilliant and approved admins.</p>
    <form class="form mt1" id="adminLoginForm">
      <div class="field"><label>Admin Email</label><input type="email" name="email" required placeholder="teedanielbrilliant@gmail.com"></div>
      <div class="field"><label>Admin Password</label><input type="password" name="password" required></div>
      <button class="btn btn-gold btn-block" type="submit">Enter Admin →</button>
      <div id="adminErr" class="hidden" style="background:#fde8e8;border:1px solid #f5b5b5;color:#b91c1c;padding:.8rem 1rem;border-radius:10px;font-weight:600"></div>
    </form>
    <p class="form-note">Security demo note: swap this gate for Firebase Auth + server roles at production (README ▸ Security).</p>
  </div>
</div>
<div class="container admin-wrap hidden" id="adminRoot">
  <aside class="admin-side card" style="padding:.9rem">
    <div class="center mb1">
      <div id="adminWho" class="small"></div>
      <button class="btn btn-outline btn-sm mt1" id="adminLogoutB">Log Out</button>
    </div>
    <div class="tool-btn-list" id="adminTabs"></div>
  </aside>
  <div id="panel"></div>
</div>
<script src="assets/js/jcia-admin.js"></script>"""
    return b
