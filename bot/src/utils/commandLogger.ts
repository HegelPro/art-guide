import { CommandMiddleware } from "grammy";
import { StateContext } from "../state/state";
import { appendAction } from "../table/appendAction";

export const commandLogger =
  (
    middleware: CommandMiddleware<StateContext>
  ): CommandMiddleware<StateContext> =>
  async (ctx, next) => {
    await appendAction(ctx.state.sheets, {
      actionType: "command",
      details: ctx.message?.text,
      userId: ctx.from?.id,
      userName: ctx.from?.username,
      date: new Date().toISOString(),
    }).catch((error: unknown) => console.error("Failed to log command:", error));

    if (typeof middleware === "function") {
      return await middleware(ctx, next);
    } else {
      return await middleware.middleware()(ctx, next);
    }
  };
