/**
 * PUBLISHREADY — MOBILE JS PATCH
 *
 * How to add this to your project:
 *   Option A) Paste the contents of this file at the END of your existing JS file.
 *   Option B) Create mobile.js and add before </body> in index.html:
 *        <script src="mobile-patch.js"></script>
 */

(function () {
  'use strict';

  const MOBILE_BP = 768;

  function isMobile() {
    return window.innerWidth <= MOBILE_BP;
  }

  /* ── 1. Inject bottom navigation bar ── */
  function injectBottomNav() {
    if (document.querySelector('.mobile-bottom-nav')) return;

    const nav = document.createElement('nav');
    nav.className = 'mobile-bottom-nav';
    nav.setAttribute('aria-label', 'Main navigation');

    // Tabs map to major app sections
    const tabs = [
      { icon: '✏️', label: 'Write',    action: showEditor },
      { icon: '📚', label: 'Chapters', action: showSidebar },
      { icon: '🎨', label: 'Cover',    action: 
triggerCover },
  { icon: "📖", label: "Read", emoji: "📖" },
  { icon: "🗒️", label: "Notes", emoji: "🗒️" },
  { icon: "🔍", label: "Search", emoji: "🔍" },
  { icon: "🖼️", label: "Gallery", emoji: "🖼️" },
  { icon: "⚙️", label: "Settings", emoji: "⚙️" },
  { icon: "❤️", label: "Saved", emoji: "❤️" },
      { icon: '✦',  label: 'AI',       action: triggerAI },
      { icon: '⬇',  label: 'Export',   action: triggerExport },
    ];

    tabs.forEach(({ icon, label, action }) => {
      const btn = document.createElement('button');
      btn.innerHTML = `<span class="nav-icon">${icon}</span><span>${label}</span>`;
      btn.setAttribute('aria-label', label);
      btn.addEventListener('click', () => {
        document.querySelectorAll('.mobile-bottom-nav button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        action();
      });
      nav.appendChild(btn);
    });

    document.body.appendChild(nav);
    // Default active state
    nav.querySelector('button').classList.add('active');
  }

  /* ── 2. Sidebar drawer toggle ── */
  function injectOverlay() {
    if (document.querySelector('.sidebar-overlay')) return;
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.addEventListener('click', closeSidebar);
    document.body.appendChild(overlay);
  }

  function showSidebar() {
    const sidebar = document.querySelector('.sidebar, aside');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    const sidebar = document.querySelector('.sidebar, aside');
    const overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ── 3. Action helpers — map to whatever click targets exist in the app ── */
  function showEditor() {
    closeSidebar();
    const editor = document.querySelector('.editor, textarea, [class*="editor"]');
    if (editor) editor.focus();
  }

  function triggerCover() {
    closeSidebar();
    const coverBtn = document.querySelector('[class*="cover"], button[title*="Cover"], button[aria-label*="Cover"]')
                  || [...document.querySelectorAll('button')].find(b => b.textContent.includes('Cover'));
    if (coverBtn) coverBtn.click();
  }

  function triggerAI() {
    closeSidebar();
    const aiBtn = document.querySelector('[class*="spell"], button[title*="Spell"], button[aria-label*="Spell"]')
               || [...document.querySelectorAll('button')].find(b => b.textContent.includes('Spell Check') || b.textContent.includes('AI'));
    if (aiBtn) aiBtn.click();
  }

  function triggerExport() {
    closeSidebar();
    const exportBtn = document.querySelector('[class*="export"], button[title*="Export"]')
                   || [...document.querySelectorAll('button')].find(b => b.textContent.includes('Export'));
    if (exportBtn) exportBtn.click();
  }

  /* ── 4. Swipe-to-close gesture on sidebar drawer ── */
  function addSwipeToClose() {
    const sidebar = document.querySelector('.sidebar, aside');
    if (!sidebar) return;

    let startY = null;

    sidebar.addEventListener('touchstart', e => {
      startY = e.touches[0].clientY;
    }, { passive: true });

    sidebar.addEventListener('touchend', e => {
      if (startY === null) return;
      const deltaY = e.changedTouches[0].clientY - startY;
      if (deltaY > 60) closeSidebar(); // swipe down > 60px closes drawer
      startY = null;
    }, { passive: true });
  }

  /* ── 5. Auto-resize textarea height as user types ── */
  function autoResizeTextarea() {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(ta => {
      const resize = () => {
        ta.style.height = 'auto';
        ta.style.height = ta.scrollHeight + 'px';
      };
      ta.addEventListener('input', resize);
      resize(); // run once on load
    });
  }

  /* ── 6. Prevent double-tap zoom on buttons (iOS) ── */
  function preventDoubleTapZoom() {
    let lastTap = 0;
    document.addEventListener('touchend', e => {
      const now = Date.now();
      if (now - lastTap < 300 && e.target.closest('button, [role="button"]')) {
        e.preventDefault();
      }
      lastTap = now;
    });
  }

  /* ── 7. Keyboard-aware layout: shift content when virtual keyboard opens ── */
  function handleVirtualKeyboard() {
    if (!('visualViewport' in window)) return;

    const vvp = window.visualViewport;
    vvp.addEventListener('resize', () => {
      const keyboardHeight = window.innerHeight - vvp.height;
      const bottomNav = document.querySelector('.mobile-bottom-nav');
      if (bottomNav) {
        bottomNav.style.transform = keyboardHeight > 100
          ? `translateY(-${keyboardHeight}px)`
          : '';
      }
    });
  }

  /* ── Init ── */
  function init() {
    if (!isMobile()) {
      // Clean up if resized back to desktop
      const bottomNav = document.querySelector('.mobile-bottom-nav');
      if (bottomNav) bottomNav.remove();
      return;
    }

    injectOverlay();
    injectBottomNav();
    addSwipeToClose();
    autoResizeTextarea();
    preventDoubleTapZoom();
    handleVirtualKeyboard();
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-evaluate on resize (e.g. rotating phone)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 200);
  });
})();
