/* ============================================================
   PUBLISHREADY — BOOK NAVIGATION v1
   - Mode défilement : vertical OU horizontal (pages)
   - Page de couverture automatique
   - Sommaire automatique synchronisé avec les chapitres
   ============================================================ */

(function () {

  // ── MODE DE DÉFILEMENT ──
  let scrollMode = 'vertical'; // 'vertical' | 'horizontal'

  // Injecte le bouton de bascule dans la topbar
  function injectScrollToggle() {
    if (document.getElementById('btn-scroll-mode')) return;
    const topbar = document.getElementById('topbar');
    if (!topbar) return;
    const btn = document.createElement('button');
    btn.className = 'tb-btn';
    btn.id = 'btn-scroll-mode';
    btn.title = 'Changer le mode de défilement';
    btn.innerHTML = '↕ Vertical';
    btn.onclick = toggleScrollMode;
    // Insère avant le spacer
    const spacer = topbar.querySelector('.spacer');
    if (spacer) topbar.insertBefore(btn, spacer);
    else topbar.appendChild(btn);
  }

  function toggleScrollMode() {
    scrollMode = scrollMode === 'vertical' ? 'horizontal' : 'vertical';
    applyScrollMode();
    const btn = document.getElementById('btn-scroll-mode');
    if (btn) btn.innerHTML = scrollMode === 'vertical' ? '↕ Vertical' : '↔ Pages';
  }

  function applyScrollMode() {
    const area = document.getElementById('editor-area');
    const container = document.getElementById('page-container');
    if (!area || !container) return;

    if (scrollMode === 'horizontal') {
      area.style.overflowX = 'auto';
      area.style.overflowY = 'hidden';
      area.style.display = 'flex';
      area.style.flexDirection = 'row';
      area.style.alignItems = 'flex-start';
      area.style.scrollSnapType = 'x mandatory';
      area.style.WebkitOverflowScrolling = 'touch';
      container.style.display = 'flex';
      container.style.flexDirection = 'row';
      container.style.gap = '32px';
      container.style.padding = '32px 24px';
      // Chaque page = snap
      document.querySelectorAll('.book-page').forEach(p => {
        p.style.scrollSnapAlign = 'start';
        p.style.flexShrink = '0';
      });
    } else {
      area.style.overflowX = '';
      area.style.overflowY = 'auto';
      area.style.display = '';
      area.style.flexDirection = '';
      area.style.alignItems = '';
      area.style.scrollSnapType = '';
      container.style.display = '';
      container.style.flexDirection = '';
      container.style.gap = '';
      container.style.padding = '';
      document.querySelectorAll('.book-page').forEach(p => {
        p.style.scrollSnapAlign = '';
        p.style.flexShrink = '';
      });
    }
  }

  // ── PAGE DE COUVERTURE ──
  function injectCoverPage() {
    if (document.getElementById('cover-page')) return;
    const chaptersArea = document.getElementById('chapters-area');
    if (!chaptersArea) return;

    const coverPage = document.createElement('div');
    coverPage.id = 'cover-page';
    coverPage.className = 'book-page cover-book-page';
    coverPage.style.cssText = `
      background: #1a1814;
      color: #d4a520;
      min-height: 500px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 60px 40px;
      margin-bottom: 40px;
      border-radius: 2px;
      position: relative;
    `;
    coverPage.innerHTML = `
      <div style="font-size:3rem;margin-bottom:20px;opacity:0.3">📖</div>
      <div id="cp-title" style="font-family:'Playfair Display',serif;font-size:2rem;font-weight:700;margin-bottom:12px;line-height:1.2">My Book Title</div>
      <div id="cp-author" style="font-family:'Playfair Display',serif;font-style:italic;font-size:1rem;opacity:0.8;margin-bottom:32px">by Author Name</div>
      <div style="width:60px;height:2px;background:#b8860b;margin:0 auto 24px"></div>
      <div id="cp-genre-label" style="font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;opacity:0.5">A Novel</div>
    `;
    chaptersArea.insertBefore(coverPage, chaptersArea.firstChild);
    updateCoverPageContent();
  }

  function updateCoverPageContent() {
    const title = document.getElementById('book-title-input');
    const author = document.getElementById('book-author-input');
    const cpTitle = document.getElementById('cp-title');
    const cpAuthor = document.getElementById('cp-author');
    if (title && cpTitle) cpTitle.textContent = title.value || 'My Book Title';
    if (author && cpAuthor) cpAuthor.textContent = 'by ' + (author.value || 'Author Name');
  }

  // ── PAGE DE SOMMAIRE ──
  function injectTOCPage() {
    if (document.getElementById('toc-page')) return;
    const chaptersArea = document.getElementById('chapters-area');
    if (!chaptersArea) return;

    const tocPage = document.createElement('div');
    tocPage.id = 'toc-page';
    tocPage.className = 'book-page';
    tocPage.style.cssText = `
      background: white;
      padding: 60px 60px;
      margin-bottom: 32px;
      min-height: 400px;
      box-shadow: 0 2px 24px rgba(0,0,0,0.13), 0 0 0 1px #d8d0c4;
      border-radius: 2px;
    `;
    tocPage.innerHTML = `
      <div style="text-align:center;margin-bottom:32px">
        <div style="font-size:0.65rem;letter-spacing:0.18em;text-transform:uppercase;color:#b8860b;margin-bottom:8px">Table of Contents</div>
        <div style="font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:#1a1814">Sommaire</div>
        <div style="width:48px;height:2px;background:#b8860b;margin:12px auto 0"></div>
      </div>
      <div id="toc-list" style="font-family:'Times New Roman',serif;font-size:12pt;line-height:2;color:#1a1814">
        <p style="color:#999;font-style:italic;font-size:0.85rem">Les chapitres apparaîtront ici automatiquement…</p>
      </div>
    `;

    // Insère après la page de couverture
    const coverPage = document.getElementById('cover-page');
    if (coverPage && coverPage.nextSibling) {
      chaptersArea.insertBefore(tocPage, coverPage.nextSibling);
    } else {
      chaptersArea.insertBefore(tocPage, chaptersArea.firstChild);
    }
  }

  // ── MISE À JOUR DU SOMMAIRE ──
  function updateTOC() {
    const tocList = document.getElementById('toc-list');
    if (!tocList) return;

    const chapterInputs = document.querySelectorAll('.chapter-title-input');
    if (chapterInputs.length === 0) {
      tocList.innerHTML = '<p style="color:#999;font-style:italic;font-size:0.85rem">Les chapitres apparaîtront ici automatiquement…</p>';
      return;
    }

    let html = '';
    chapterInputs.forEach((input, i) => {
      const title = input.value || ('Chapter ' + (i + 1));
      const chId = input.closest('[id^="ch-"]') ? input.closest('[id^="ch-"]').id : '';
      html += `
        <div style="display:flex;align-items:baseline;gap:8px;padding:4px 0;cursor:pointer"
             onclick="document.getElementById('${chId}')?.scrollIntoView({behavior:'smooth'})">
          <span style="flex:1;border-bottom:1px dotted #ccc">${title}</span>
          <span style="color:#b8860b;font-size:0.85rem;flex-shrink:0">${i + 1}</span>
        </div>`;
    });
    tocList.innerHTML = html;
  }

  // Observe les changements de titres pour mettre à jour le sommaire
  function observeChapterTitles() {
    const chaptersArea = document.getElementById('chapters-area');
    if (!chaptersArea) return;

    const observer = new MutationObserver(function () {
      updateTOC();
      updateCoverPageContent();
      applyScrollMode();
    });
    observer.observe(chaptersArea, { childList: true, subtree: true, characterData: true });

    // Aussi sur les inputs directement
    chaptersArea.addEventListener('input', function (e) {
      if (e.target.classList.contains('chapter-title-input')) {
        updateTOC();
      }
    });
  }

  // Sync avec les inputs titre/auteur
  function observeTitleInputs() {
    const titleInput = document.getElementById('book-title-input');
    const authorInput = document.getElementById('book-author-input');
    if (titleInput) titleInput.addEventListener('input', updateCoverPageContent);
    if (authorInput) authorInput.addEventListener('input', updateCoverPageContent);
  }

  // ── INIT ──
  function setup() {
    // Attendre que l'app soit initialisée
    setTimeout(function () {
      injectScrollToggle();
      injectCoverPage();
      injectTOCPage();
      updateTOC();
      observeChapterTitles();
      observeTitleInputs();
    }, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }

  // Expose pour usage externe
  window.updateTOC = updateTOC;
  window.updateCoverPageContent = updateCoverPageContent;

})();
