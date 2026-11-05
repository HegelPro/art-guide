import { CallbackQueryMiddleware } from "grammy";
import { StateContext } from "../state/state";
import { appendAction } from "../table/appendAction";

export const callbackQueryLogger =
  (
    middleware: CallbackQueryMiddleware<StateContext>
  ): CallbackQueryMiddleware<StateContext> =>
  async (ctx, next) => {
    await appendAction(ctx.state.sheets, {
      actionType: "callbackQuery",
      details: ctx.callbackQuery.data,
      userId: ctx.from.id,
      userName: ctx.from.username,
      date: new Date().toISOString(),
    }).catch((error: unknown) => console.error("Failed to log callback query:", error));

    if (typeof middleware === "function") {
      return await middleware(ctx, next);
    } else {
      return await middleware.middleware()(ctx, next);
    }
  };
