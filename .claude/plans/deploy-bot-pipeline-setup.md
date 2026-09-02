# Запуск production-деплоя bot/ через существующий pipeline

## Контекст

В репозитории уже есть workflow [.github/workflows/deploy-bot.yml](.github/workflows/deploy-bot.yml) (добавлен последним коммитом `a0b07b6 Add pipeline config`), который при пуше в `main` (или вручную через `workflow_dispatch`):
1. Собирает `bot/` (TypeScript → JS) и проверяет, что Docker-образ собирается (`docker build ./bot`) — это job `build`, чисто проверочный, его образ никуда не публикуется.
2. Job `deploy` подключается по SSH к серверу и выполняет:
   ```bash
   cd "$DEPLOY_PATH"
   git fetch origin main
   git reset --hard origin/main
   docker compose -f bot/docker-compose.yaml up -d --build --force-recreate --remove-orphans
   ```

Сам код pipeline менять не нужно — он написан правильно и соответствует описанной задаче ("подхватить main и пересобрать prod"). Проблема не в коде, а в том, что **вокруг него ничего не настроено**: нет сервера/секретов/файлов с ключами, поэтому job `deploy` упадёт при первом же запуске. План ниже — это чек-лист действий **вне репозитория** (сервер + настройки GitHub), которые нужно выполнить, чтобы pipeline заработал.

Важные факты, подтверждённые в ходе анализа:
- Репозиторий **публичный** (`github.com/HegelPro/art-guide`, `visibility: public`) — значит `git fetch`/`git reset --hard origin/main` на сервере отработает без какой-либо аутентификации к GitHub (никакой deploy key/PAT для чтения репозитория не требуется).
- `docker compose -f bot/docker-compose.yaml` использует `env_file: - .env` ([bot/docker-compose.yaml](bot/docker-compose.yaml)) — то есть на сервере в каталоге `bot/` обязателен файл именно с именем **`.env`** (не `.env.production`, хотя такой файл-вариант тоже существует в репо и используется только `docker-compose-production.yaml`, который в pipeline не задействован).
- И `.env`, и `bot/google_file.json` — в `.gitignore`, поэтому `git reset --hard` их не тронет, но и сам git их никогда не создаст на сервере — их нужно положить туда вручную один раз.
- Секреты `SSH_HOST`, `SSH_PORT`, `SSH_USER`, `DEPLOY_PATH`, `SSH_PRIVATE_KEY` читаются workflow из GitHub Actions secrets репозитория ([.github/workflows/deploy-bot.yml:43-56](.github/workflows/deploy-bot.yml)) — их нужно завести в настройках репозитория.

## Что нужно сделать (по порядку)

### 1. Подготовить сервер
- Убедиться, что на сервере установлены `git`, `docker`, `docker compose` (плагин, команда `docker compose version` должна работать).
- Пользователь, под которым будет заходить CI (`SSH_USER`), должен иметь право запускать `docker`/`docker compose` без интерактивного sudo (обычно — быть в группе `docker`).
- Убедиться, что у сервера есть исходящий доступ в интернет (для `docker build` — `FROM node:lts`, `npm install`).

### 2. Склонировать репозиторий на сервере в фиксированный путь
```bash
git clone https://github.com/HegelPro/art-guide.git <DEPLOY_PATH>
```
Этот путь и станет значением секрета `DEPLOY_PATH`. Публичность репо означает, что дальнейшие `git fetch origin main` от имени `SSH_USER` будут работать без дополнительной настройки credentials.

### 3. Вручную положить на сервер секретные файлы, которые не лежат в git
В `<DEPLOY_PATH>/bot/` создать:
- **`.env`** — с реальными значениями (по образцу ключей из [bot/.env](bot/.env)/[bot/.env.production](bot/.env.production)):
  ```
  BOT_TOKEN=...
  ADMIN_BOT_TOKEN=...
  GOOGLE_SHEET_ID=...
  PROXY_URL=...   # если нужен
  ```
- **`google_file.json`** — ключ сервисного аккаунта Google (для Sheets API, см. [bot/src/table/getSheets.ts](bot/src/table/getSheets.ts)).

### 4. Настроить SSH-доступ для CI
- Сгенерировать отдельную SSH-пару для деплоя (если ещё нет): `ssh-keygen -t ed25519 -f deploy_key -N ""`.
- Публичный ключ (`deploy_key.pub`) добавить в `~/.ssh/authorized_keys` пользователя `SSH_USER` на сервере.
- Приватный ключ (полное содержимое файла, включая `-----BEGIN/END-----`) сохранить в секрет `SSH_PRIVATE_KEY`.

### 5. Завести секреты в GitHub (Settings → Secrets and variables → Actions → New repository secret)
| Secret | Значение |
|---|---|
| `SSH_HOST` | IP/домен сервера |
| `SSH_PORT` | порт SSH (можно не задавать — по умолчанию `22`) |
| `SSH_USER` | пользователь для SSH-подключения |
| `SSH_PRIVATE_KEY` | приватный ключ из шага 4 |
| `DEPLOY_PATH` | путь на сервере из шага 2, например `/opt/art-guide` |

### 6. Проверить вручную один раз перед первым автоматическим запуском
Зайти на сервер по SSH под `SSH_USER` и вручную прогнать ровно то, что делает workflow:
```bash
cd <DEPLOY_PATH>
git fetch origin main
git reset --hard origin/main
docker compose -f bot/docker-compose.yaml up -d --build --force-recreate --remove-orphans
docker compose -f bot/docker-compose.yaml logs -f art-guide
```
Это отловит проблемы с правами/Docker/отсутствующими файлами до того, как это сделает CI.

### 7. Запустить pipeline
- Либо запушить любой коммит в `main`,
- либо вручную: вкладка **Actions → Deploy bot → Run workflow** (доступно благодаря `workflow_dispatch`).
- Проверить оба job'а (`build`, `deploy`) в логах Actions.

### 8. Проверить результат
- На сервере: `docker compose -f bot/docker-compose.yaml ps` — контейнер `art-guide` должен быть `Up`.
- В Telegram: отправить боту `/start` и убедиться, что он отвечает.

## Верификация плана в целом
Раздел выше — это операционные шаги вне кодовой базы (сервер, GitHub UI), поэтому "тестов" в привычном смысле нет. Критерий успеха — зелёный прогон workflow `Deploy bot` в GitHub Actions и живой ответ бота в Telegram после пуша в `main`.

## Не входит в этот план
- Аналогичный pipeline для `storage/` — не запрашивался в этом заходе, `storage/docker-compose-production.yaml` существует, но CI для него нет.
- Изменение самого workflow-файла — в текущем виде код pipeline корректен для описанной задачи, править нечего.
