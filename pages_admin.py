"""Admin dashboard."""
from build import page_head

def build_admin():
    b = page_head("Admin", "JCIA Admin Dashboard", "Go live, manage products, sales, members, testimonies, prayer requests, events and notifications.")
    b += """
<section class="section"><div class="container dash">
  <aside style="flex:1;min-width:220px">
    <div class="kpis" id="kpis"></div>
    <div class="card mt2" style="padding:1rem"><b>⚠️ Quick links</b>
      <div class="footer-links mt1 small">
        <a href="live.html" target="_blank">Open Live page ↗</a>
        <a href="academy.html" target="_blank">Open Academy ↗</a>
        <a href="events.html" target="_blank">Open Events ↗</a>
      </div>
      <p class="small muted mt1">Demo dashboard stores data in this browser (localStorage). Connect Firebase/Supabase + Rust serverless backend for production multi-user (see README).</p>
    </div>
  </aside>
  <div class="dash-main">
    <div class="admin-tabs">
      <button class="tab on" data-tab="golive">🔴 Go Live</button>
      <button class="tab" data-tab="products">🎓 Products</button>
      <button class="tab" data-tab="sales">💰 Sales</button>
      <button class="tab" data-tab="members">👥 Members</button>
      <button class="tab" data-tab="testimonies">✨ Testimonies</button>
      <button class="tab" data-tab="prayers">🙏 Prayer Requests</button>
      <button class="tab" data-tab="events">🗓 Events</button>
      <button class="tab" data-tab="notify">📣 Notify</button>
    </div>
    <div id="panel"></div>
  </div>
</div>
<script src="assets/js/admin.js"></script>"""
    return b
