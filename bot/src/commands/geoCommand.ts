import { BotCommand } from "grammy/types";
import { Messages } from "../state/messages";
import { commandLogger } from "../utils/commandLogger";

export const geoCommand = (messages: Messages): BotCommand => ({
  command: "geo",
  description: messages["commands.geo.description"],
});

export const geoCommandMiddleware =
  commandLogger(async (ctx) => {
    await ctx.reply(ctx.state.messages["commands.geo.message"], {
      // parse_mode: "HTML",
    });
    await ctx.replyWithLocation(53.553667, 49.294907);
  });
