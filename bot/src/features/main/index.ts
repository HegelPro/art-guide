import { getMessage } from "../../state/messages";
import { StateContext } from "../../state/state";
import { InlineKeyboard, InputMediaBuilder } from "grammy";
import { artsSearchKey, merchSearchKey } from "../../search";
import { startCommand } from "../start";
import { registerCommand } from "../register";
import { geoCommand } from "../geo";
import { donateCommand } from "../donate";
import { scheduleCommand } from "../schedule";
import { homeCommand } from "../home";
import { callbackQueryLogger } from "../../utils/callbackQueryLogger";

export const getMainKeyboardMiddleware = async (ctx: StateContext) =>
  new InlineKeyboard()
    .text(getMessage(ctx.state)("commands.start.description"), startCommand)
    .text(
      getMessage(ctx.state)("commands.register.description"),
      registerCommand
    )
    .row()
    .text(getMessage(ctx.state)("commands.geo.description"), geoCommand)
    .text(
      getMessage(ctx.state)("commands.schedule.description"),
      scheduleCommand
    )
    .row()
    .text(getMessage(ctx.state)("commands.donate.description"), donateCommand)
    .text(getMessage(ctx.state)("commands.home.description"), homeCommand)
    .row()
    .switchInlineCurrent(
      getMessage(ctx.state)("buttons.inlineShowArt"),
      artsSearchKey
    )
    .switchInlineCurrent(
      getMessage(ctx.state)("buttons.inlineShowMerch"),
      merchSearchKey
    )
    .row();

export const getToMainKeyboardMiddleware = async (ctx: StateContext) =>
  new InlineKeyboard()
    .text(getMessage(ctx.state)("commands.main.description"), mainCommand)
    .row();

export const mainCallbackQuery = callbackQueryLogger(async (ctx) => {
  const mainKeybord = await getMainKeyboardMiddleware(ctx);
  await ctx.editMessageMedia(
    InputMediaBuilder.photo(ctx.getMessage("commands.main.url"), {
      parse_mode: "HTML",
      caption: ctx.getMessage("commands.main.message"),
    }),
    {
      reply_markup: mainKeybord,
    }
  );
});

export const mainCommand = "main";
