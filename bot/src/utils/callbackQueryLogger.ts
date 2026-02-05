import { CallbackQueryMiddleware, CommandMiddleware } from "grammy";
import { StateContext } from "../state/state";
import { sheets_v4 } from "googleapis";
import { appendAction } from "../table/appendAction";

export const callbackQueryLogger =
  (
    middleware: CallbackQueryMiddleware<StateContext>
  ): CallbackQueryMiddleware<StateContext> =>
  async (ctx, next) => {
    // console.log(ctx.message?.text);
    appendAction(ctx.state.sheets, {
      actionType: "callbackQuery",
      details: ctx.callbackQuery.data,
      userId: ctx.from.id,
      userName: ctx.from.username,
      date: new Date().toISOString(),
    });
    // await ctx.state.sheets.spreadsheets.values.append({
    //   spreadsheetId: (globalThis as any).process.env.GOOGLE_SHEET_ID,
    //   range: "actions",
    //   valueInputOption: "RAW",
    //   requestBody: {
    //     values: [
    //       [
    //         "command",
    //         ctx.message?.text,
    //         ctx.message?.from.id,
    //         ctx.message?.from.username,
    //         ctx.message?.date,
    //       ],
    //     ],
    //   },
    // });

    if (typeof middleware === "function") {
      return await middleware(ctx, next);
    } else {
      return await middleware.middleware()(ctx, next);
    }
  };
