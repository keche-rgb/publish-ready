/* ============================================================
   PUBLISHREADY — MOBILE TOGGLE SCRIPT
   Gère l'affichage/masquage de la sidebar et du panneau droit
   sur mobile via une barre de navigation en bas
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

  // Quel onglet est actif
  let currentView = 'editor';

  window.mobileToggle = function (view) {
    if (!isMobile()) return;

    const sidebar   = document.getElementById('sidebar');
    const rightPanel = document.getElementById('right-panel');

    // Si on retape le même bouton → ferme tout et revient à l'éditeur
    if (view === currentView && view !== 'editor') {
      sidebar   && sidebar.classList.remove('open');
      rightPanel && rightPanel.classList.remove('open');
      currentView = 'editor';
      updateNavButtons('editor');
      return;
    }

    currentView = view;

    if (view === 'editor') {
      sidebar   && sidebar.classList.remove('open');
      rightPanel && rightPanel.classList.remove('open');
    } else if (view === 'sidebar') {
      sidebar   && sidebar.classList.toggle('open');
      rightPanel && rightPanel.classList.remove('open');
    } else if (view === 'panel') {
      rightPanel && rightPanel.classList.toggle('open');
      sidebar   && sidebar.classList.remove('open');
    }

    updateNavButtons(view);
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
    if (isMobile()) injectBottomNav();
  }

  window.addEventListener('resize', function () {
    if (isMobile()) {
      injectBottomNav();
    } else {
      // Sur desktop : tout visible
      const sidebar = document.getElementById('sidebar');
      const rp = document.getElementById('right-panel');
      if (sidebar) sidebar.classList.remove('open');
      if (rp) rp.classList.remove('open');
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
