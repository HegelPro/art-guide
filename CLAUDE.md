# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

This is a Telegram bot ("art-guide") for guiding visitors through an art event/exhibition: browsing artworks and merch via inline search, registering for events, showing a schedule/geo/donate info, etc. It's a Node.js/TypeScript monorepo-style repo with two independent npm projects:

- `bot/` — the actual Telegram bot (grammY), the main thing being developed.
- `storage/` — a minimal Express/HTTPS static file server for serving assets (photos referenced by the bot). Its `src/bot.ts` is currently a stub file (empty) — only the compiled `build/bot.js` reflects a previous version; treat this project as effectively dormant/placeholder.

Root `package.json` just proxies build/start scripts into each subproject via `npm --prefix`.

## Common commands

Run from the repo root unless noted:

```bash
npm run build              # build both bot and storage (tsc)
npm run build:bot          # build only bot/
npm run build:storage      # build only storage/
npm run start:bot          # node bot/build/main.js (requires prior build)
npm run start:storage      # node storage/build/bot.js
npm run build:start:bot    # build then start the bot
npm run build:start:storage
```

Working inside `bot/` directly (most common case):

```bash
npm --prefix bot install
npm --prefix bot run build   # tsc -> bot/build
npm --prefix bot run start   # node build/main.js
npm --prefix bot run build:start
```

There is no lint or test setup in this repo (no eslint/jest/vitest config, no test scripts). Don't invent test commands.

VS Code task "Start Bot" (default build task) runs `npm run start:bot` from the repo root.

## Configuration / secrets

- `bot/.env`, `bot/.env.development`, `bot/.env.production` hold `BOT_TOKEN`, `ADMIN_BOT_TOKEN`, `GOOGLE_SHEET_ID`, and (dev/local) `PROXY_URL`. Loaded via `dotenv/config` at the top of `bot/src/main.ts`.
- `bot/google_file.json` is a Google service-account key used for Sheets API auth (`bot/src/table/getSheets.ts`, scope `spreadsheets`). All bot content (UI strings, artworks, merch, FAQ, admins, events) is read from a Google Sheet at startup — there is no database.
- Never commit real values for these; they're already present as local files in this working copy.

## Deployment

`.github/workflows/deploy-bot.yml` builds `bot/` on push to `main`, then SSHes into a server and runs `docker compose -f bot/docker-compose.yaml up -d --build --force-recreate --remove-orphans` after a hard reset to `origin/main`. `bot/docker-compose-development.yaml` / `-production.yaml` are variants selecting `.env.development` / `.env.production` and (dev only) bind-mounting `src`/`build`. `storage/` has its own `docker-compose-production.yaml` exposing port 443 with mounted `certs`/`assets` (not present in source control) — it's deployed separately from the bot.

## Architecture (bot/)

**Startup sequence** (`bot/src/main.ts`): load env → `reloadState()` (fetches everything from Google Sheets) → register the state middleware → register callback queries → register commands (`start`, `reload`) → register the message middleware (registration flow) → register the inline query middleware → `bot.start()`.

**State (`bot/src/state/state.ts`)** is a single module-level singleton (`export let state`), rebuilt wholesale by `reloadState()`/`initState()`, which re-reads every sheet range (`messages`, `arts`, `admins`, `faq`, `merchs`, `events`) in parallel-ish sequence and rebuilds an in-memory registrations store. There is no per-request diffing — a `reload` command (see `features/reload`) just calls `reloadState()` again. Each `state/*.ts` module (`arts.ts`, `messages.ts`, `admins.ts`, `merchs.ts`, `events.ts`, `faq.ts`) follows the same shape: an `initX(sheets)` async function that fetches a named range, `.shift()`s the header row, and maps remaining rows positionally into typed objects — column order in the sheet is load-bearing and must match the row-index mapping in code.

`addStateMiddleware()` attaches `ctx.state`, `ctx.getMessage`, and (per-user, keyed by `ctx.from.id`) registration helpers (`startRegistration`, `nextRegistration`, `endRegistration`, `removeRegistration`, `registration`, `currentRegistrationStage`, `isEndOfRegistration`) onto every update via `StateContext` (`bot/src/state/state.ts`).

**Messages/i18n**: All user-facing text and URLs come from the `messages` sheet range as a flat `key -> value` map (dotted keys like `commands.start.message`, `commands.start.url`, `buttons.inlineShowArt`). Always fetch strings through `ctx.getMessage("...")` / `getMessage(state)("...")` rather than hardcoding text — this is how the bot's copy (including CTA button labels and photo URLs) is edited by non-developers via the spreadsheet.

**Features (`bot/src/features/<name>/index.ts`)**: one folder per bot "screen" (`start`, `main`, `home`, `register`, `geo`, `schedule`, `donate`, `faq`, `artList`, `merch_list`, `reload`). Each feature typically exports:
- a `<name>Command` string constant (used both as a `/command` and as callback-query data),
- a `<name>CommandMiddleware` wrapped in `commandLogger(...)`,
- a `<name>CallbackQuery` wrapped in `callbackQueryLogger(...)`.

Screens are rendered as a photo message with an inline keyboard (`InputMediaBuilder.photo` + `editMessageMedia` for callback-driven updates, `replyWithPhoto` for fresh messages) — see `features/main/index.ts` for the canonical "main menu" keyboard builder (`getMainKeyboardMiddleware`) and the `addToXBtnToKeyboard` helpers other features compose to append a "back to main" button. When adding a new feature, follow this same command/callback-query pair + keyboard-helper pattern and wire it into `setCallbackQueries.ts` (and `main.ts` if it needs a top-level command).

**Wiring hubs**:
- `bot/src/setCallbackQueries.ts` — registers every feature's `bot.callbackQuery(command, callbackQuery)` pair; new features must be added here explicitly.
- `bot/src/setMessageMiddleware.ts` — handles free-text/photo messages, but only meaningfully for driving the multi-stage **registration** flow (see below); anything else gets a fallback "message not handled" reply.
- `bot/src/setInlineQueryMiddleware.ts` — implements inline search (`@bot <query>`) for three domains distinguished by a search-key prefix on the query string: `artsSearchKey` (arts), `merchSearchKey` (merch), `registerSearchKey` (events). Selecting a result sends `/start <searchKey>_<index>` back to the bot, which `features/start/index.ts` decodes by matching `ctx.match` against `${key}_${index}` to look up the corresponding item by array index in `state.arts` / `state.merchs` / `state.events`. This index-based addressing is fragile to sheet row reordering — be aware when touching arts/merch/events data flow.

**Registration flow** (`bot/src/state/registrations.ts` + `setMessageMiddleware.ts`): triggered from `features/start` when `/start` decodes an event deep-link. `startRegistration(userId, eventName, stages)` pushes a `RegistrationStateItem` (array of `{type: "input"|"photo", question, stageName, payload?}` stages) into an in-memory `registrations` array (not persisted — lost on process restart/reload). Each subsequent user message advances `stageId` via `nextRegistration`; `"photo"` stage results additionally broadcast the uploaded photo to every admin in `state.admins` via `ctx.api.sendPhoto`. `endRegistration` reduces collected stage results into a `{stageName: data}` record and clears the entry — currently the caller in `setMessageMiddleware.ts` computes this result but does not yet persist it anywhere (e.g. append to a sheet) — check current behavior before assuming registrations are recorded.

**Logging/telemetry**: `utils/commandLogger.ts` / `utils/callbackQueryLogger.ts` wrap command and callback-query handlers to append an `actions` row to the Google Sheet (`table/appendAction.ts`) before running the wrapped handler — every new command/callback-query handler should be wrapped the same way for consistent analytics. `utils/errorHandler.ts` (`bot.catch(...)`) logs uncaught errors to an `errors` sheet range and replies with a generic Russian error message to the user.

**Language note**: sheet-driven UI strings are Russian; several in-code fallback strings, error messages, and comments are also Russian. Match this when adding new user-facing fallback text or comments in `bot/src`.

## TypeScript config notes

Both `bot/tsconfig.json` and `storage/tsconfig.json` target `es2016`/`commonjs`, `strict: true`, output to `./build`, `rootDir: ./src`. `(globalThis as any).process.env.X` is used repeatedly instead of a typed `process.env` import — `bot/src/global.d.ts` exists but is currently empty, so `@types/node`'s ambient `process` isn't picked up cleanly; follow the existing `(globalThis as any).process` idiom for consistency rather than introducing a different access pattern in the same files.
