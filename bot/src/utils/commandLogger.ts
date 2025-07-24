import { CommandMiddleware } from "grammy";
import { StateContext } from "../state/state";

export const commandLogger =
  (
    middleware: CommandMiddleware<StateContext>
  ): CommandMiddleware<StateContext> =>
  async (ctx, next) => {
    // console.log(ctx.message?.text);
    await ctx.state.sheets.spreadsheets.values.append({
      spreadsheetId: (globalThis as any).process.env.GOOGLE_SHEET_ID,
      range: "events",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            "command",
            ctx.message?.text,
            ctx.message?.from.id,
            ctx.message?.from.username,
            ctx.message?.date,
          ],
        ],
      },
    });

    if (typeof middleware === "function") {
      return await middleware(ctx, next);
    } else {
      return await middleware.middleware()(ctx, next);
    }
  };
