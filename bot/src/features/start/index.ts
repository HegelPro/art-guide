import { InlineKeyboard, InputMediaBuilder } from "grammy";
import { artsSearchKey, merchSearchKey } from "../../search";
import { commandLogger } from "../../utils/commandLogger";
import { getToMainKeyboardMiddleware } from "../main";
import { getMessage } from "../../state/messages";
import { callbackQueryLogger } from "../../utils/callbackQueryLogger";

export const startCommand = "start";

export const startCommandMiddleware = commandLogger(async (ctx) => {
  const keyboard = await getToMainKeyboardMiddleware(ctx);

  const art = ctx.state.arts.find(
    (art, index) => ctx.match === `${artsSearchKey}_${index}`
  );
  const merch = ctx.state.merchs.find(
    (merch, index) => ctx.match === `${merchSearchKey}_${index}`
  );
  if (art) {
    if (art.photo) {
      await ctx.replyWithPhoto(art.photo, {
        caption: art.name,
      });
    }

    if (art.audio) {
      await ctx.replyWithVoice(art.audio, {
        caption: art.description,
        reply_markup: new InlineKeyboard()
          .switchInlineCurrent(
            getMessage(ctx.state)("buttons.inlineShowArt"),
            artsSearchKey
          )
          .row(),
        // .text("Главное меню", startCommand(ctx.state).command)
        // .row(),
      });
    }
    ctx.deleteMessage();
  } else if (merch) {
    if (merch.photo) {
      await ctx.replyWithPhoto(merch.photo, {
        caption: merch.name,
      });
    }

    ctx.deleteMessage();
  } else {
    await ctx.replyWithPhoto(getMessage(ctx.state)("commands.start.url"), {
      parse_mode: "HTML",
      caption: getMessage(ctx.state)("commands.start.message"),
      reply_markup: keyboard,
    });
  }
});

export const startCallbackQuery = callbackQueryLogger(async (ctx) => {
  const toMainKeybord = await getToMainKeyboardMiddleware(ctx);
  await ctx.editMessageMedia(
    InputMediaBuilder.photo(ctx.getMessage("commands.start.url"), {
      parse_mode: "HTML",
      caption: ctx.getMessage("commands.start.message"),
    }),
    {
      reply_markup: toMainKeybord,
    }
  );
});
