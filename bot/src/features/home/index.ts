import { InputMediaBuilder } from "grammy";
import { callbackQueryLogger } from "../../utils/callbackQueryLogger";
import { getToMainKeyboardMiddleware } from "../main";

export const homeCommand = "home";

export const homeCallbackQuery = callbackQueryLogger(async (ctx) => {
  const toMainKeybord = await getToMainKeyboardMiddleware(ctx);
  await ctx.editMessageMedia(
    InputMediaBuilder.photo(ctx.getMessage("commands.home.url"), {
      parse_mode: "HTML",
      caption: ctx.getMessage("commands.home.message"),
    }),
    {
      reply_markup: toMainKeybord,
    }
  );
});
