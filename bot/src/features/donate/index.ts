import { InputMediaBuilder } from "grammy";
import { callbackQueryLogger } from "../../utils/callbackQueryLogger";
import { getToMainKeyboardMiddleware } from "../main";

export const donateCommand = "donate";

export const donateCallbackQuery = callbackQueryLogger(async (ctx) => {
  const toMainKeybord = await getToMainKeyboardMiddleware(ctx);
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
