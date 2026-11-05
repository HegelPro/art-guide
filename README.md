# Art Guide

Telegram-бот на grammY и TypeScript для каталога работ и событий. Данные и тексты интерфейса загружаются из Google Sheets. `storage/` — отдельный HTTPS-сервер для файлов; React-приложения в репозитории пока нет.

## Подготовка

Требуется Node.js 22. Из корня репозитория:

```sh
npm ci --prefix bot
npm ci --prefix storage
npm run check
```

Для локального запуска бота скопируйте `bot/.env.example` в `bot/.env`, заполните переменные и положите ключ сервисного аккаунта в `bot/google_file.json`. Эти файлы не добавляются в Git. Запуск: `npm run build:start:bot`.

Инструкции для Codex: [AGENTS.md](AGENTS.md). Устройство сервисов и границы текущей реализации: [docs/architecture.md](docs/architecture.md).
