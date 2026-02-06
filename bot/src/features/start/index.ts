import { InlineKeyboard, InputMediaBuilder } from "grammy";
import { commandLogger } from "../../utils/commandLogger";
import {
  addToEditMainBtnToKeyboard,
  addToPushMainBtnToKeyboard,
  addToPushMainBtnWithRemoveRegistrationToKeyboard,
} from "../main";
import { getMessage } from "../../state/messages";
import { callbackQueryLogger } from "../../utils/callbackQueryLogger";
import { registerSearchKey } from "../register";
import { artsSearchKey } from "../artList";
import { merchSearchKey } from "../merch_list";

export const startCommand = "start";

export const startCommandMiddleware = commandLogger(async (ctx) => {
  const art = ctx.state.arts.find(
    (art, index) => ctx.match === `${artsSearchKey}_${index}`
  );
  const merch = ctx.state.merchs.find(
    (merch, index) => ctx.match === `${merchSearchKey}_${index}`
  );
  const event = ctx.state.events.find(
    (register, index) => ctx.match === `${registerSearchKey}_${index}`
  );
  if (art) {
    ctx.deleteMessage();

    const keyboard = addToPushMainBtnToKeyboard(
      new InlineKeyboard()
        .switchInlineCurrent(
          getMessage(ctx.state)("buttons.inlineShowArt"),
          artsSearchKey
        )
        .row(),
      ctx.state
    );

    if (art.photo) {
      await ctx.replyWithPhoto(art.photo, {
        caption: art.name,
      });
    }

    if (art.audio) {
      await ctx.replyWithVoice(art.audio, {
        caption: art.description,
        reply_markup: keyboard,
      });
    }
  } else if (merch) {
    ctx.deleteMessage();

    const keyboard = addToPushMainBtnToKeyboard(
      new InlineKeyboard()
        .switchInlineCurrent(
          getMessage(ctx.state)("buttons.inlineShowMerch"),
          merchSearchKey
        )
        .row(),
      ctx.state
    );

    if (merch.photo) {
      await ctx.replyWithPhoto(merch.photo, {
        caption: merch.name,
        reply_markup: keyboard,
      });
    }
  } else if (event) {
    ctx.deleteMessage();

    if (event.photo) {
      await ctx.replyWithPhoto(event.photo, {
        caption: event.name,
      });
    }

    ctx.removeRegistration?.();

    ctx.startRegistration?.(event.name, [
      {
        type: "input",
        question: "Введите ФИО",
        stageName: "fio",
      },
      {
        type: "photo",
        question: "Загрузите фотографию",
        stageName: "check",
        payload: event.name,
      },
    ]);

    const question = ctx.currentRegistrationStage?.()?.question;

    if (question) {
      ctx.reply(question, {
        reply_markup: addToPushMainBtnWithRemoveRegistrationToKeyboard(
          new InlineKeyboard(),
          ctx.state
        ),
      });
    } else {
      throw new Error("ctx.currentRegistrationStage?.question not found");
    }
  } else {
    const toMainKeybord = addToEditMainBtnToKeyboard(
      new InlineKeyboard(),
      ctx.state
    );

    await ctx.replyWithPhoto(getMessage(ctx.state)("commands.start.url"), {
      parse_mode: "HTML",
      caption: getMessage(ctx.state)("commands.start.message"),
      reply_markup: toMainKeybord,
    });
  }
});

export const startCallbackQuery = callbackQueryLogger(async (ctx) => {
  const toMainKeybord = addToEditMainBtnToKeyboard(
    new InlineKeyboard(),
    ctx.state
  );

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
