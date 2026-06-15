/* ============================================================
   PUBLISHREADY — MOBILE TOGGLE SCRIPT v2
   - Sidebar/panel ouvrable et fermable
   - Fermeture en touchant l'éditeur
   - Sidebar scrollable horizontalement
   ============================================================ */

(function () {
  function isMobile() { return window.innerWidth <= 768; }

  function injectBottomNav() {
    if (document.getElementById('mobile-bottom-nav')) return;
    const nav = document.createElement('div');
    nav.className = 'mobile-bottom-nav';
    nav.id = 'mobile-bottom-nav';
    nav.innerHTML = `
      <button id="btn-nav-edit" class="active" onclick="mobileToggle('editor')">
        <span class="nav-icon">✍️</span>Écrire
      </button>
      <button id="btn-nav-sidebar" onclick="mobileToggle('sidebar')">
        <span class="nav-icon">⚙️</span>Format
      </button>
      <button id="btn-nav-panel" onclick="mobileToggle('panel')">
        <span class="nav-icon">🤖</span>IA / Cover
      </button>
      <button id="btn-nav-export" onclick="openDownload()">
        <span class="nav-icon">⬇️</span>Exporter
      </button>
    `;
    document.body.appendChild(nav);
  }

  function injectOverlay() {
    if (document.getElementById('mobile-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'mobile-overlay';
    overlay.style.cssText = `
      display:none; position:fixed; inset:0; z-index:89;
      background:rgba(0,0,0,0.01);
    `;
    // Toucher l'overlay (= toucher l'éditeur) ferme tout
    overlay.addEventListener('click', function () {
      closeAll();
    });
    document.body.appendChild(overlay);
  }

  let currentView = 'editor';

  function closeAll() {
    const sidebar = document.getElementById('sidebar');
    const rp = document.getElementById('right-panel');
    const overlay = document.getElementById('mobile-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (rp) rp.classList.remove('open');
    if (overlay) overlay.style.display = 'none';
    currentView = 'editor';
    updateNavButtons('editor');
  }

  window.mobileToggle = function (view) {
    if (!isMobile()) return;

    const sidebar = document.getElementById('sidebar');
    const rp = document.getElementById('right-panel');
    const overlay = document.getElementById('mobile-overlay');

    // Même bouton = ferme tout
    if (view === currentView && view !== 'editor') {
      closeAll();
      return;
    }

    currentView = view;

    if (view === 'editor') {
      closeAll();
      return;
    }

    if (view === 'sidebar') {
      const isOpen = sidebar && sidebar.classList.contains('open');
      closeAll();
      if (!isOpen) {
        sidebar && sidebar.classList.add('open');
        if (overlay) overlay.style.display = 'block';
        currentView = 'sidebar';
      }
    } else if (view === 'panel') {
      const isOpen = rp && rp.classList.contains('open');
      closeAll();
      if (!isOpen) {
        rp && rp.classList.add('open');
        if (overlay) overlay.style.display = 'block';
        currentView = 'panel';
      }
    }

    updateNavButtons(currentView);
  };

  function updateNavButtons(view) {
    ['edit', 'sidebar', 'panel', 'export'].forEach(id => {
      const btn = document.getElementById('btn-nav-' + id);
      if (btn) btn.classList.remove('active');
    });
    const map = { editor: 'edit', sidebar: 'sidebar', panel: 'panel' };
    const activeBtn = document.getElementById('btn-nav-' + (map[view] || 'edit'));
    if (activeBtn) activeBtn.classList.add('active');
  }

  function setup() {
    if (isMobile()) {
      injectBottomNav();
      injectOverlay();
    }
  }

  window.addEventListener('resize', function () {
    if (isMobile()) {
      injectBottomNav();
      injectOverlay();
    } else {
      closeAll();
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
