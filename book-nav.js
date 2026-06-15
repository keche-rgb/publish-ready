/* ============================================================
   PUBLISHREADY — BOOK NAV v2
   Corrections:
   1. Défilement horizontal fluide page par page (snap)
   2. Pages vides visibles en défilant
   3. Texte latéral caché — panneau flottant au appui long
   4. Sommaire toujours EN DERNIER
   5. Couverture aux normes Amazon KDP (6x9 in)
   6. Upload image de couverture depuis galerie ou URL
   ============================================================ */
(function () {

  /* ══════════════════════════════════
     1. MODE DÉFILEMENT
  ══════════════════════════════════ */
  let scrollMode = 'vertical';

  function injectScrollToggle() {
    if (document.getElementById('btn-scroll-mode')) return;
    const topbar = document.getElementById('topbar');
    if (!topbar) return;
    const btn = document.createElement('button');
    btn.className = 'tb-btn';
    btn.id = 'btn-scroll-mode';
    btn.innerHTML = '↕ Vertical';
    btn.onclick = toggleScrollMode;
    const spacer = topbar.querySelector('.spacer');
    spacer ? topbar.insertBefore(btn, spacer) : topbar.appendChild(btn);
  }

  function toggleScrollMode() {
    scrollMode = scrollMode === 'vertical' ? 'horizontal' : 'vertical';
    document.getElementById('btn-scroll-mode').innerHTML =
      scrollMode === 'vertical' ? '↕ Vertical' : '↔ Pages';
    applyScrollMode();
  }

  function applyScrollMode() {
    const area = document.getElementById('editor-area');
    if (!area) return;
    if (scrollMode === 'horizontal') {
      area.style.cssText = `
        overflow-x: auto; overflow-y: hidden;
        display: flex; flex-direction: row;
        align-items: flex-start;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        padding: 24px 16px; gap: 24px;
        flex: 1;
      `;
      document.querySelectorAll('.book-page').forEach(p => {
        p.style.scrollSnapAlign = 'start';
        p.style.flexShrink = '0';
        p.style.width = 'min(520px, 90vw)';
        p.style.minHeight = '700px';
      });
    } else {
      area.style.cssText = `
        overflow-y: auto; overflow-x: hidden;
        display: flex; flex-direction: column;
        align-items: center; padding: 32px 24px;
        flex: 1;
      `;
      document.querySelectorAll('.book-page').forEach(p => {
        p.style.scrollSnapAlign = '';
        p.style.flexShrink = '';
        p.style.width = '';
        p.style.minHeight = '';
      });
    }
  }

  /* ══════════════════════════════════
     2. PAGE VIDE (blank page entre sections)
  ══════════════════════════════════ */
  function createBlankPage(id) {
    const p = document.createElement('div');
    p.className = 'book-page blank-page';
    p.id = id || 'blank-' + Date.now();
    p.style.cssText = `
      background: white;
      box-shadow: 0 2px 24px rgba(0,0,0,0.10), 0 0 0 1px #d8d0c4;
      border-radius: 2px;
      width: 100%;
      max-width: 680px;
      min-height: 840px;
      margin-bottom: 24px;
    `;
    return p;
  }

  /* ══════════════════════════════════
     3. MASQUER page-meta (texte latéral)
        + Panneau flottant au appui long
  ══════════════════════════════════ */
  function hidePageMeta() {
    const meta = document.getElementById('page-meta');
    if (meta) meta.style.display = 'none';
  }

  function injectFormatFloater() {
    if (document.getElementById('format-floater')) return;

    const floater = document.createElement('div');
    floater.id = 'format-floater';
    floater.style.cssText = `
      display:none; position:fixed; z-index:500;
      background:#1a1814; color:#faf8f4;
      border:1px solid #b8860b; border-radius:10px;
      padding:16px; min-width:220px;
      box-shadow:0 8px 32px rgba(0,0,0,0.4);
      font-family:'Inter',sans-serif; font-size:0.82rem;
    `;
    floater.innerHTML = `
      <div style="font-size:0.65rem;letter-spacing:0.1em;color:#d4a520;margin-bottom:10px;text-transform:uppercase">⚙ Format du texte</div>
      <label style="color:#999;font-size:0.7rem">Police</label>
      <select id="fl-font" style="width:100%;background:#2e2a26;border:1px solid #444;color:#fff;padding:5px;border-radius:3px;margin-bottom:8px;font-size:0.78rem">
        <option value="'Times New Roman',serif">Times New Roman</option>
        <option value="Georgia,serif">Georgia</option>
        <option value="Garamond,serif">Garamond</option>
        <option value="'Courier New',monospace">Courier New</option>
      </select>
      <label style="color:#999;font-size:0.7rem">Taille</label>
      <select id="fl-size" style="width:100%;background:#2e2a26;border:1px solid #444;color:#fff;padding:5px;border-radius:3px;margin-bottom:8px;font-size:0.78rem">
        <option value="11pt">11pt</option>
        <option value="12pt" selected>12pt</option>
        <option value="14pt">14pt</option>
        <option value="16pt">16pt</option>
      </select>
      <label style="color:#999;font-size:0.7rem">Interligne</label>
      <select id="fl-spacing" style="width:100%;background:#2e2a26;border:1px solid #444;color:#fff;padding:5px;border-radius:3px;margin-bottom:12px;font-size:0.78rem">
        <option value="1.5">1.5×</option>
        <option value="2" selected>Double</option>
        <option value="2.5">2.5×</option>
      </select>
      <div style="display:flex;gap:8px">
        <button onclick="applyFloaterFormat()" style="flex:1;background:#b8860b;border:none;color:#000;padding:7px;border-radius:5px;cursor:pointer;font-weight:600;font-size:0.78rem">Appliquer</button>
        <button onclick="closeFloater()" style="flex:1;background:#3a3530;border:none;color:#fff;padding:7px;border-radius:5px;cursor:pointer;font-size:0.78rem">Fermer</button>
      </div>
    `;
    document.body.appendChild(floater);

    // Fermer en cliquant ailleurs
    document.addEventListener('click', function(e) {
      if (!floater.contains(e.target)) closeFloater();
    });
  }

  let longPressTimer = null;
  let floaterTarget = null;

  function setupLongPress() {
    const editorArea = document.getElementById('editor-area');
    if (!editorArea) return;

    editorArea.addEventListener('touchstart', function(e) {
      longPressTimer = setTimeout(function() {
        const touch = e.touches[0];
        showFloater(touch.clientX, touch.clientY);
      }, 600);
    }, { passive: true });

    editorArea.addEventListener('touchend', function() {
      clearTimeout(longPressTimer);
    });
    editorArea.addEventListener('touchmove', function() {
      clearTimeout(longPressTimer);
    });

    // Desktop: clic droit
    editorArea.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      showFloater(e.clientX, e.clientY);
    });
  }

  function showFloater(x, y) {
    const f = document.getElementById('format-floater');
    if (!f) return;
    f.style.display = 'block';
    const left = Math.min(x, window.innerWidth - 240);
    const top = Math.min(y, window.innerHeight - 280);
    f.style.left = left + 'px';
    f.style.top = top + 'px';
  }

  window.closeFloater = function() {
    const f = document.getElementById('format-floater');
    if (f) f.style.display = 'none';
  };

  window.applyFloaterFormat = function() {
    const font = document.getElementById('fl-font').value;
    const size = document.getElementById('fl-size').value;
    const spacing = document.getElementById('fl-spacing').value;
    document.querySelectorAll('.chapter-body, #main-editor').forEach(el => {
      el.style.fontFamily = font;
      el.style.fontSize = size;
      el.style.lineHeight = spacing;
    });
    // Sync avec sidebar si elle existe
    const ff = document.getElementById('font-family');
    const fs = document.getElementById('font-size');
    const ls = document.getElementById('line-spacing');
    if (ff) ff.value = font;
    if (fs) fs.value = size;
    if (ls) ls.value = spacing;
    closeFloater();
  };

  /* ══════════════════════════════════
     4. PAGE DE COUVERTURE (normes KDP 6x9)
  ══════════════════════════════════ */
  function injectCoverPage() {
    if (document.getElementById('cover-page')) return;
    const chaptersArea = document.getElementById('chapters-area');
    if (!chaptersArea) return;

    const coverPage = document.createElement('div');
    coverPage.id = 'cover-page';
    coverPage.className = 'book-page';
    // 6x9 inches = ratio 2:3 — KDP standard
    coverPage.style.cssText = `
      background: #1a1814;
      width: 100%;
      max-width: 600px;
      aspect-ratio: 6/9;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      text-align: center;
      padding: 60px 48px 48px;
      margin-bottom: 24px;
      border-radius: 2px;
      position: relative;
      overflow: hidden;
      box-shadow: 4px 4px 20px rgba(0,0,0,0.4);
    `;
    coverPage.innerHTML = `
      <!-- Image de fond -->
      <div id="cover-bg-img" style="position:absolute;inset:0;background-size:cover;background-position:center;opacity:0.35;transition:opacity .3s"></div>
      <!-- Upload image -->
      <div style="position:absolute;top:12px;right:12px;z-index:10;display:flex;gap:6px">
        <button onclick="document.getElementById('cover-img-upload').click()" title="Depuis galerie"
          style="background:rgba(0,0,0,0.6);border:1px solid #b8860b;color:#d4a520;padding:6px 10px;border-radius:6px;cursor:pointer;font-size:0.7rem">📷 Galerie</button>
        <button onclick="promptCoverURL()" title="Depuis URL"
          style="background:rgba(0,0,0,0.6);border:1px solid #b8860b;color:#d4a520;padding:6px 10px;border-radius:6px;cursor:pointer;font-size:0.7rem">🔗 URL</button>
      </div>
      <input type="file" id="cover-img-upload" accept="image/*" style="display:none" onchange="loadCoverImage(event)">

      <!-- Contenu couverture -->
      <div style="z-index:2;width:100%">
        <div style="width:48px;height:2px;background:#b8860b;margin:0 auto 24px"></div>
        <div id="cp-genre-label" style="font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;color:#b8860b;margin-bottom:16px">A Novel</div>
      </div>

      <div style="z-index:2;width:100%;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center">
        <div id="cp-title" style="font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:700;color:#faf8f4;line-height:1.2;margin-bottom:16px">My Book Title</div>
        <div style="width:40px;height:1px;background:#b8860b;margin:0 auto 16px"></div>
        <div id="cp-author" style="font-family:'Playfair Display',serif;font-style:italic;font-size:1rem;color:#d4a520">by Author Name</div>
      </div>

      <div style="z-index:2;width:100%">
        <div style="font-size:0.55rem;color:rgba(255,255,255,0.3);letter-spacing:0.1em;margin-top:24px">
          KDP READY · 6×9 IN · 300 DPI RECOMMENDED
        </div>
      </div>
    `;
    chaptersArea.insertBefore(coverPage, chaptersArea.firstChild);
  }

  window.promptCoverURL = function() {
    const url = prompt('Copiez/collez l\'URL de votre image :');
    if (url) setCoverBg(url);
  };

  window.loadCoverImage = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) { setCoverBg(e.target.result); };
    reader.readAsDataURL(file);
  };

  function setCoverBg(src) {
    const bg = document.getElementById('cover-bg-img');
    if (bg) {
      bg.style.backgroundImage = `url('${src}')`;
      bg.style.opacity = '0.55';
    }
  }

  function updateCoverPageContent() {
    const title = document.getElementById('book-title-input');
    const author = document.getElementById('book-author-input');
    const cpTitle = document.getElementById('cp-title');
    const cpAuthor = document.getElementById('cp-author');
    if (title && cpTitle) cpTitle.textContent = title.value || 'My Book Title';
    if (author && cpAuthor) cpAuthor.textContent = 'by ' + (author.value || 'Author Name');
  }

  /* ══════════════════════════════════
     5. SOMMAIRE — toujours en DERNIER
  ══════════════════════════════════ */
  function injectTOCPage() {
    // Supprimer ancien si existant
    const old = document.getElementById('toc-page');
    if (old) old.remove();

    const chaptersArea = document.getElementById('chapters-area');
    if (!chaptersArea) return;

    const tocPage = document.createElement('div');
    tocPage.id = 'toc-page';
    tocPage.className = 'book-page';
    tocPage.style.cssText = `
      background: white;
      box-shadow: 0 2px 24px rgba(0,0,0,0.13), 0 0 0 1px #d8d0c4;
      border-radius: 2px;
      padding: 60px 60px;
      width: 100%;
      max-width: 680px;
      min-height: 500px;
      margin-top: 24px;
    `;
    tocPage.innerHTML = `
      <div style="text-align:center;margin-bottom:32px">
        <div style="font-size:0.65rem;letter-spacing:0.18em;text-transform:uppercase;color:#b8860b;margin-bottom:8px">Table of Contents</div>
        <div style="font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:#1a1814">Sommaire</div>
        <div style="width:48px;height:2px;background:#b8860b;margin:12px auto 0"></div>
      </div>
      <div id="toc-list" style="font-family:'Times New Roman',serif;font-size:12pt;line-height:2;color:#1a1814"></div>
    `;
    // Toujours DERNIER dans chaptersArea
    chaptersArea.appendChild(tocPage);
    updateTOC();
  }

  window.updateTOC = function() {
    const tocList = document.getElementById('toc-list');
    if (!tocList) return;

    const inputs = document.querySelectorAll('.chapter-title-input');
    if (inputs.length === 0) {
      tocList.innerHTML = '<p style="color:#999;font-style:italic;font-size:0.85rem">Les chapitres apparaîtront ici automatiquement…</p>';
      return;
    }

    let html = '';
    inputs.forEach((input, i) => {
      const title = input.value || ('Chapter ' + (i + 1));
      const chEl = input.closest('[id^="ch-"]');
      const chId = chEl ? chEl.id : '';
      html += `<div style="display:flex;align-items:baseline;gap:8px;padding:4px 0;cursor:pointer"
        onclick="document.getElementById('${chId}')?.scrollIntoView({behavior:'smooth'})">
        <span style="flex:1;border-bottom:1px dotted #ccc">${title}</span>
        <span style="color:#b8860b;font-size:0.85rem;flex-shrink:0">${i + 1}</span>
      </div>`;
    });
    tocList.innerHTML = html;

    // Garder TOC en dernier
    const chaptersArea = document.getElementById('chapters-area');
    const toc = document.getElementById('toc-page');
    if (chaptersArea && toc && chaptersArea.lastElementChild !== toc) {
      chaptersArea.appendChild(toc);
    }
  };

  /* ══════════════════════════════════
     OBSERVATIONS
  ══════════════════════════════════ */
  function observe() {
    const area = document.getElementById('chapters-area');
    if (!area) return;

    // Détecter ajout de chapitres
    new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        m.addedNodes.forEach(function(n) {
          if (n.nodeType === 1 && n.id && n.id.startsWith('ch-')) {
            // Nouveau chapitre ajouté — garder TOC en dernier
            setTimeout(function() {
              window.updateTOC();
              applyScrollMode();
            }, 50);
          }
        });
      });
    }).observe(area, { childList: true });

    // Titres de chapitres → sync TOC
    area.addEventListener('input', function(e) {
      if (e.target.classList.contains('chapter-title-input')) {
        window.updateTOC();
      }
    });

    // Titre/auteur → sync couverture
    ['book-title-input', 'book-author-input'].forEach(function(id) {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', updateCoverPageContent);
    });
  }

  /* ══════════════════════════════════
     INIT
  ══════════════════════════════════ */
  function setup() {
    setTimeout(function() {
      hidePageMeta();
      injectScrollToggle();
      injectCoverPage();
      injectTOCPage();
      injectFormatFloater();
      setupLongPress();
      observe();
      updateCoverPageContent();
    }, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }

})();
        
