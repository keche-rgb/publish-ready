/* ============================================================
   PUBLISHREADY — MOBILE RESPONSIVE PATCH v2
   ============================================================ */

* { box-sizing: border-box; }
html, body { overflow-x: hidden; }

/* ============================================================
   TABLETTE (≤ 1024px)
   ============================================================ */
@media (max-width: 1024px) {
  #main { flex-direction: column !important; }
  #sidebar {
    width: 100% !important;
    height: auto !important;
    overflow-x: auto;
    overflow-y: visible;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px;
    border-right: none !important;
    border-bottom: 1px solid rgba(255,255,255,0.12);
  }
  #right-panel { width: 100% !important; }
  #editor-area { padding: 16px 8px !important; }
}

/* ============================================================
   MOBILE (≤ 768px)
   ============================================================ */
@media (max-width: 768px) {

  #topbar {
    position: sticky !important;
    top: 0;
    z-index: 100;
    padding: 8px 10px !important;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    flex-wrap: nowrap;
  }
  #topbar::-webkit-scrollbar { display: none; }
  #topbar .logo { font-size: 0.88rem !important; white-space: nowrap; flex-shrink: 0; }
  .tb-btn { font-size: 0.68rem !important; padding: 5px 8px !important; white-space: nowrap; flex-shrink: 0; }
  #word-count { display: none; }

  #main { flex-direction: column !important; position: relative; }

  /* ── SIDEBAR : masquée par défaut ── */
  #sidebar {
    width: 100% !important;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
    padding: 0 !important;
    border-right: none !important;
    border-bottom: none;
    /* scroll horizontal pour atteindre tous les contrôles */
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  #sidebar.open {
    max-height: 75vh;
    overflow-y: auto;
    overflow-x: auto;
    padding: 10px 12px !important;
    border-bottom: 1px solid rgba(255,255,255,0.15) !important;
    /* deux colonnes pour les groupes de réglages */
    display: grid !important;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    align-items: start;
  }

  .sidebar-section { grid-column: 1 / -1; }
  .format-group { padding: 6px 8px !important; }
  .sidebar-label { font-size: 0.6rem !important; }
  .sidebar-btn { font-size: 0.78rem !important; padding: 6px 8px !important; }

  /* ── RIGHT PANEL : masqué par défaut ── */
  #right-panel {
    width: 100% !important;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    border-left: none !important;
    border-top: 1px solid transparent;
  }
  #right-panel.open {
    max-height: 80vh;
    overflow-y: auto;
    border-top-color: #d4a520;
  }

  /* Éditeur */
  #editor-area { padding: 12px 8px !important; }
  #editor-frame { padding: 20px 14px !important; min-height: auto; }
  #main-editor { font-size: 1rem !important; line-height: 1.8 !important; }

  /* Modal export */
  #modal { padding: 24px 16px !important; }
  .modal-actions { flex-direction: column; }
  .modal-btn { width: 100% !important; margin-bottom: 6px; }

  /* Cover */
  #cover-preview { max-width: 200px !important; margin: 0 auto !important; }

  /* Status bar */
  .status-bar { font-size: 0.62rem !important; flex-wrap: wrap; gap: 4px; padding: 4px 8px; }

  /* Tap targets */
  button, [role="button"] { min-height: 40px; min-width: 40px; }

  /* ── Barre de navigation mobile en bas ── */
  .mobile-bottom-nav {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    z-index: 95;
    background: #1a1814;
    border-top: 1px solid #b8860b;
    padding-bottom: env(safe-area-inset-bottom);
  }
  .mobile-bottom-nav button {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    font-size: 0.58rem !important;
    padding: 6px 0 !important;
    background: none !important;
    border: none !important;
    cursor: pointer;
    color: #888;
    transition: color 0.15s;
    font-family: 'Inter', sans-serif;
    min-height: unset !important;
  }
  .mobile-bottom-nav button.active { color: #d4a520; }
  .mobile-bottom-nav button .nav-icon { font-size: 1.2rem; line-height: 1; }

  body { padding-bottom: calc(56px + env(safe-area-inset-bottom)); }
}

/* ============================================================
   TRÈS PETITS ÉCRANS (≤ 375px)
   ============================================================ */
@media (max-width: 375px) {
  .tb-btn { font-size: 0.62rem !important; padding: 4px 6px !important; }
  #editor-frame { padding: 14px 10px !important; }
  #main-editor { font-size: 0.95rem !important; }
  #sidebar.open { grid-template-columns: 1fr; }
}
