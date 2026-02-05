import { InlineKeyboard } from "grammy";
import { BotCommand } from "grammy/types";
import { getMessage, Messages } from "../../state/messages";
import { commandLogger } from "../../utils/commandLogger";

export const faqCommand = "faq";

export const faqCommandMiddleware = commandLogger(async (ctx) => {
  let keyboard = new InlineKeyboard();

  ctx.state.faqs.forEach((row, i) => {
    keyboard.text(row[0], "faq" + i).row();
  });

  await ctx.reply(getMessage(ctx.state)("commands.faq.message"), {
    reply_markup: keyboard,
    parse_mode: "MarkdownV2",
  });
});
