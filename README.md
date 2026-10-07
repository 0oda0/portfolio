# Портфолио

Статический сайт: главная (обо мне, контакты, проекты) и страницы проектов в формате «экран + бизнес-логика».

- `profile.json` — обо мне, услуги, стек, контакты. **Замените поля в [квадратных скобках].**
- `projects/index.json` — список проектов на главной.
- `projects/<slug>/project.json` + `img/` — проект. Формат: `docs/PROJECT_SCHEMA.md`.
- **Добавить новый проект:** промт в `docs/ADD_PROJECT_PROMPT.md`.

## Запуск
```bash
node serve.js            # http://localhost:8081
node scripts/check.js    # проверка проектов перед публикацией
```
## На сервер
```bash
git clone https://github.com/0oda0/portfolio.git /root/portfolio && cd /root/portfolio
PORT=8081 bash deploy/install.sh        # обновление: git pull (перезапуск не нужен)
```
Без сборки и зависимостей — нужен только Node.js. Файлы можно выложить и на любой статический хостинг.
