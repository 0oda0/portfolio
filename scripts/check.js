'use strict';
// Проверка проектов: node scripts/check.js  — ищет ошибки в projects/*/project.json до публикации.
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const errs = [];
const idx = JSON.parse(fs.readFileSync(path.join(root, 'projects/index.json'), 'utf8'));
const STATUSES = ['idea', 'in_progress', 'testing', 'deployed', 'done', 'paused'];
for (const slug of idx.projects) {
  const dir = path.join(root, 'projects', slug);
  const f = path.join(dir, 'project.json');
  const where = (m) => errs.push(`${slug}: ${m}`);
  if (!/^[a-z0-9-]+$/.test(slug)) where('slug — только латиница в нижнем регистре, цифры и дефис');
  if (!fs.existsSync(f)) { where('нет project.json'); continue; }
  let p; try { p = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { where('project.json не читается: ' + e.message); continue; }
  if (p.slug !== slug) where(`slug в файле (${p.slug}) не совпадает с папкой`);
  for (const k of ['title', 'subtitle', 'cover']) if (!p[k]) where(`нет поля ${k}`);
  if (p.status && !STATUSES.includes(p.status)) where(`status должен быть одним из: ${STATUSES.join(', ')}`);
  const img = (x, ctx) => { if (x && !fs.existsSync(path.join(dir, x))) where(`${ctx}: нет файла ${x}`); };
  img(p.cover, 'cover'); img(p.hero?.image, 'hero.image'); img(p.hero?.phone, 'hero.phone');
  const ids = new Set();
  for (const c of p.chapters || []) {
    if (!c.id || !c.title || !Array.isArray(c.screens)) where(`глава без id/title/screens`);
    for (const s of c.screens || []) {
      if (!s.id || !s.title || !s.img) where(`экран без id/title/img в главе ${c.id}`);
      if (ids.has(s.id)) where(`повтор id экрана ${s.id}`); ids.add(s.id);
      img(s.img, `экран ${s.id}`); img(s.full, `экран ${s.id} (full)`);
    }
  }
  for (const g of p.gallery?.items || []) img(g.img, 'gallery');
  const text = fs.readFileSync(f, 'utf8');
  if (/(password|пароль|token|api[_-]?key)\s*["':=]/i.test(text)) where('похоже на секрет в project.json — уберите');
}
if (errs.length) { console.error('Ошибки:\n- ' + errs.join('\n- ')); process.exit(1); }
console.log(`OK: проектов ${idx.projects.length}, ошибок нет`);
