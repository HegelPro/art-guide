import { InlineKeyboard, InputMediaBuilder } from "grammy";
import { callbackQueryLogger } from "../../utils/callbackQueryLogger";
import { addToEditMainBtnToKeyboard } from "../main";

export const donateCommand = "donate";

export const donateCallbackQuery = callbackQueryLogger(async (ctx) => {
  const toMainKeybord = addToEditMainBtnToKeyboard(new InlineKeyboard(), ctx.state);

  await ctx.editMessageMedia(
    InputMediaBuilder.photo(ctx.getMessage("commands.donate.url"), {
      parse_mode: "HTML",
      caption: ctx.getMessage("commands.donate.message"),
    }),
    {
      reply_markup: toMainKeybord,
    }
  );
});
