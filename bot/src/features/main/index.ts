import { getMessage } from "../../state/messages";
import { State, StateContext } from "../../state/state";
import { InlineKeyboard, InputMediaBuilder } from "grammy";
import { startCommand } from "../start";
import { registerSearchKey, registerCommand } from "../register";
import { geoCommand } from "../geo";
import { donateCommand } from "../donate";
import { scheduleCommand } from "../schedule";
import { homeCommand } from "../home";
import { callbackQueryLogger } from "../../utils/callbackQueryLogger";
import { artsSearchKey } from "../artList";
import { merchSearchKey } from "../merch_list";

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
      getMessage(ctx.state)("buttons.inlineShowRegistration"),
      registerSearchKey
    )
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

export const addToEditMainBtnToKeyboard = (
  inlineKeyboard: InlineKeyboard,
  state: State
): InlineKeyboard =>
  inlineKeyboard
    .text(getMessage(state)("commands.main.description"), editMainCommand)
    .row();

export const editMainCallbackQuery = callbackQueryLogger(async (ctx) => {
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

export const editMainCommand = "editMain";

export const addToPushMainBtnToKeyboard = (
  inlineKeyboard: InlineKeyboard,
  state: State
): InlineKeyboard =>
  inlineKeyboard
    .text(getMessage(state)("commands.main.description"), pushMainCommand)
    .row();

export const pushMainCallbackQuery = callbackQueryLogger(async (ctx) => {
  const mainKeybord = await getMainKeyboardMiddleware(ctx);

  await ctx.replyWithPhoto(ctx.getMessage("commands.main.url"), {
    caption: ctx.getMessage("commands.main.message"),
    parse_mode: "HTML",
    reply_markup: mainKeybord,
  });
});

export const pushMainCommand = "pushMain";

export const addToPushMainBtnWithRemoveRegistrationToKeyboard = (
  inlineKeyboard: InlineKeyboard,
  state: State
): InlineKeyboard =>
  inlineKeyboard
    .text('getMessage(state)("commands.main.description")', pushMainWithRemoveRegistrationCommand)
    .row();

export const pushMainWithRemoveRegistrationCallbackQuery = callbackQueryLogger(
  async (ctx) => {
    ctx.removeRegistration?.();

    console.log(ctx.state.registrations);

    const mainKeybord = await getMainKeyboardMiddleware(ctx);

    await ctx.replyWithPhoto(ctx.getMessage("commands.main.url"), {
      caption: ctx.getMessage("commands.main.message"),
      parse_mode: "HTML",
      reply_markup: mainKeybord,
    });
  }
);

export const pushMainWithRemoveRegistrationCommand =
  "pushMainWithRmoveRegistration";
