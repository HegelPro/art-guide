import { addToEditMainBtnToKeyboard } from "../main";
import { callbackQueryLogger } from "../../utils/callbackQueryLogger";
import { InlineKeyboard, InputMediaBuilder } from "grammy";

export const registerCommand = "register";
export const registerSearchKey = "regis";

export const registerCallbackQuery = callbackQueryLogger(async (ctx) => {
  const toMainKeybord = addToEditMainBtnToKeyboard(
    new InlineKeyboard(),
    ctx.state
  );

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
