import { BotCommand } from "grammy/types";
import { getMessage } from "../../state/messages";
import { commandLogger } from "../../utils/commandLogger";
import { State } from "../../state/state";
import { getToMainKeyboardMiddleware } from "../main";
import { callbackQueryLogger } from "../../utils/callbackQueryLogger";
import { InputMediaBuilder } from "grammy";

export const registerCommand = "register";

export const registerCommandMiddleware = commandLogger(async (ctx) => {
  const keyboard = await getToMainKeyboardMiddleware(ctx);

  await ctx.reply(getMessage(ctx.state)("commands.register.message"), {
    // parse_mode: "HTML",
    reply_markup: keyboard,
  });
});

export const registerCallbackQuery = callbackQueryLogger(async (ctx) => {
  const toMainKeybord = await getToMainKeyboardMiddleware(ctx);
  await ctx.editMessageMedia(
    InputMediaBuilder.photo(ctx.getMessage("commands.register.url"), {
      parse_mode: "HTML",
      caption: ctx.getMessage("commands.register.message"),
    }),
    {
      reply_markup: toMainKeybord,
    }
  );
});
