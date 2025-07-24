import { InlineKeyboard } from "grammy";
import { BotCommand } from "grammy/types";
import { Messages } from "../state/messages";
import { commandLogger } from "../utils/commandLogger";

export const artListCommand = (messages: Messages): BotCommand => ({
  command: "art_list",
  description: messages["commands.artList.description"],
});

export const artListCommandMiddleware = commandLogger(
  async (ctx) =>
    await ctx.reply(ctx.state.messages["commands.artList.message"], {
      reply_markup: new InlineKeyboard().switchInlineCurrent(
        ctx.state.messages["buttons.inlineShowArt"]
      ),
      // parse_mode: "HTML",
    })
);
