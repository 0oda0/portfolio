'use strict';
// Общее для всех страниц портфолио: экранирование, тема, увеличение скриншотов.
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// *слово* в заголовке выделяется акцентным цветом
const emph = (s) => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');

(() => {
  const T = ['auto', 'light', 'dark'], TL = { auto: 'как в системе', light: 'светлая', dark: 'тёмная' };
  let ti = 0;
  try { ti = Math.max(0, T.indexOf(localStorage.getItem('pf-theme') || 'auto')); } catch {}
  const btn = document.getElementById('theme');
  const apply = () => {
    const t = T[ti];
    if (t === 'auto') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t;
    if (btn) btn.textContent = 'Тема: ' + TL[t];
    try { localStorage.setItem('pf-theme', t); } catch {}
  };
  apply();
  if (btn) btn.onclick = () => { ti = (ti + 1) % 3; apply(); };

  const dlg = document.getElementById('zoom'), zi = document.getElementById('zoom-img');
  if (!dlg) return;
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.shot'); if (!b) return;
    zi.src = b.dataset.full; zi.alt = b.querySelector('img')?.alt || '';
    if (dlg.showModal) dlg.showModal();
  });
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
})();
