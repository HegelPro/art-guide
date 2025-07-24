import { BotCommand } from "grammy/types";
import { Messages } from "../state/messages";
import { commandLogger } from "../utils/commandLogger";

export const startCommand = (messages: Messages): BotCommand => ({
  command: "start",
  description: messages["commands.start.description"],
});

export const startCommandMiddleware = commandLogger(async (ctx) => {
  await ctx.reply(ctx.state.messages["commands.start.message"], {
    // parse_mode: "HTML",
  });
});
