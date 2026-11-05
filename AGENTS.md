# Codex project guide

## Scope

- `bot/` is the grammY Telegram bot, written in TypeScript for Node.js 22.
- `storage/` is a separate Express HTTPS asset server. It is not imported by the bot.
- There is no React frontend in this repository. Add frontend tooling only when a concrete frontend feature requires it.
- Read [docs/architecture.md](docs/architecture.md) before changing bot data flow or deployment.

## Local commands

Run from the repository root:

```sh
npm ci --prefix bot
npm ci --prefix storage
npm run check
```

`npm run check` compiles the bot, runs its focused Node tests, and compiles storage. `npm run build` compiles both services. Running either service needs its runtime credentials and external services; do not start a bot during routine verification.

## Change guidelines

- Keep grammY handlers in `bot/src/features` and register callback queries in `setCallbackQueries.ts`; register new commands in `main.ts`.
- Use `StateContext` and `ctx.state` for the current sheet snapshot. Fetch UI copy through `ctx.getMessage` where a sheet key exists. If adding a key, document the expected sheet row.
- Sheet columns are positional. Keep mappings in `bot/src/state` aligned with the Google Sheet and do not mutate API response rows.
- Inline result links use the original array index. Preserve this contract when changing search or `/start` deep links.
- Keep registration state consistent across `/reload`; any persistence change needs an explicit design because registrations currently live only in memory.
- Await Telegram and Sheets calls, or handle their rejection explicitly. Do not log registration answers, tokens, service account keys, or full sheet contents.
- Add a focused regression test in `bot/test` for behavior changes, then run `npm run check`. Avoid tests that require live Telegram or Google APIs.
- Keep secrets out of Git and image build contexts. Use `bot/.env.example` as the variable list and provide `bot/google_file.json` outside source control.

## Delivery

Summarize behavior changes, commands run, and any unverified integration boundary. Do not claim a live bot or Google Sheets check from a TypeScript build alone.
