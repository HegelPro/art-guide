import { BotCommand } from "grammy/types";
import { Messages } from "../state/messages";
import { commandLogger } from "../utils/commandLogger";

export const donateCommand = (messages: Messages): BotCommand => ({
  command: "donate",
  description: messages["commands.donate.description"],
});

export const donateCommandMiddleware = commandLogger(async (ctx) => {
  await ctx.reply(ctx.state.messages["commands.donate.message"], {
    // parse_mode: "HTML",
  });
});
