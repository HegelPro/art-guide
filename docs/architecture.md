# Architecture

`bot/src/main.ts` loads the configuration, fetches Google Sheet data, attaches state middleware, registers grammY handlers, sets Telegram commands, and starts long polling. `bot/src/config.ts` validates the token and sheet ID before startup.

`bot/src/state/state.ts` holds the current sheet snapshot. `/reload` replaces that snapshot after all reads succeed. The `messages`, `arts`, `admins`, `faq`, `merchs`, and `events` ranges are mapped in `bot/src/state/`; their column order is part of the integration contract. User interface text is normally resolved from the `messages` range.

`bot/src/setInlineQueryMiddleware.ts` searches arts, merch, and events. Its `/start <key>_<index>` result points into the original, unfiltered array. `bot/src/features/start` decodes that link. A future stable ID migration must change both sides together.

Registration stages live in `bot/src/state/registrations.ts`. They survive a sheet reload but not a process restart. The last stage sends a photo to sheet-listed admins. The completed registration record is returned in memory and currently is **not persisted**. Do not describe this as a stored signup until a persistence path exists.

`bot/src/utils/commandLogger.ts` and `callbackQueryLogger.ts` append action rows to the Sheet; `errorHandler.ts` attempts to append error rows. A logging failure is reported to process logs without blocking the handler.

`storage/` serves assets over HTTPS on port 443 from its `assets/` directory with certificates in `certs/`. It has a separate npm lockfile and deployment compose file. There is no frontend application in this repository.

## Secrets and deployment

`bot/.env` or `bot/.env.production` supplies `BOT_TOKEN` and `GOOGLE_SHEET_ID`; `PROXY_URL` is optional. `bot/google_file.json` is the local Google service account key. Compose injects the environment and mounts the key at runtime. The deploy workflow checks both TypeScript services and builds the bot image before the production compose command on the server. Keep the key and env files on the deployment host; they are ignored by Git.
