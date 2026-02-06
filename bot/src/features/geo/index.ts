import { InlineKeyboard, InputMediaBuilder } from "grammy";
import { callbackQueryLogger } from "../../utils/callbackQueryLogger";
import { addToEditMainBtnToKeyboard } from "../main";

export const geoCommand = "geo";

export const geoCallbackQuery = callbackQueryLogger(async (ctx) => {
  const toMainKeybord = addToEditMainBtnToKeyboard(new InlineKeyboard(), ctx.state);

  await ctx.editMessageMedia(
    InputMediaBuilder.photo(ctx.getMessage("commands.geo.url"), {
      parse_mode: "HTML",
      caption: ctx.getMessage("commands.geo.message"),
    }),
    {
      reply_markup: toMainKeybord,
    }
  );
});
