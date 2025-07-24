import { InlineKeyboard } from "grammy";
import { BotCommand } from "grammy/types";
import { Messages } from "../state/messages";
import { commandLogger } from "../utils/commandLogger";

export const faqCommand = (messages: Messages): BotCommand => ({
  command: "faq",
  description: messages["commands.faq.description"],
});
export const faqCommandMiddleware =
  commandLogger(async (ctx) => {
    let keyboard = new InlineKeyboard();

    ctx.state.faqs.forEach((row, i) => {
      keyboard.text(row[0], "faq" + i).row();
    });

    await ctx.reply(ctx.state.messages["commands.faq.message"], {
      reply_markup: keyboard,
      // parse_mode: "HTML",
    });
  });
