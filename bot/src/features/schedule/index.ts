import { InlineKeyboard, InputMediaBuilder } from "grammy";
import { callbackQueryLogger } from "../../utils/callbackQueryLogger";
import { addToEditMainBtnToKeyboard } from "../main";

export const scheduleCommand = "schedule";

export const scheduleCallbackQuery = callbackQueryLogger(async (ctx) => {
  const toMainKeybord = addToEditMainBtnToKeyboard(new InlineKeyboard(), ctx.state);

  await ctx.editMessageMedia(
    InputMediaBuilder.photo(ctx.getMessage("commands.schedule.url"), {
      parse_mode: "HTML",
      caption: ctx.getMessage("commands.schedule.message"),
    }),
    {
      reply_markup: toMainKeybord,
    }
  );
});
