import { Bot, InlineKeyboard } from "grammy";
import { StateContext } from "./state/state";
import {
  addToEditMainBtnToKeyboard,
  addToPushMainBtnWithRemoveRegistrationToKeyboard,
} from "./features/main";

export const setMessageMiddleware = async (bot: Bot<StateContext>) => {
  bot.on("message", async (ctx) => {
    if (!ctx.from.is_bot) {
      const stage = ctx.currentRegistrationStage?.();
      if (stage) {
        if (stage?.type === "input") {
          if (ctx.message.text) {
            ctx.nextRegistration?.({
              data: ctx.message.text,
            });
            await ctx.reply("Двнные успешно введены");
          } else {
            await ctx.reply("Ожидаедается текст");
          }
        } else if (stage?.type === "photo") {
          if (ctx.message.photo && stage.payload) {
            ctx.nextRegistration?.({
              data: stage.payload,
            });
            await ctx.reply("Фотография отправленна");

            ctx.state.admins.forEach((admin) => {
              if (ctx.message?.photo) {
                ctx.api.sendPhoto(admin.id, ctx.message?.photo[0].file_id, {
                  caption:
                    `payload: ${stage.payload}\n` +
                    `user: ${ctx.message.chat.username}\n` +
                    `firstname: ${ctx.message.chat.first_name}\n` +
                    `lastname: ${ctx.message.chat.last_name}`,
                });
              }
            });
          } else {
            await ctx.reply("Ождидается фото");
          }
        } else {
          ctx.removeRegistration?.();
          throw new Error("Unknown stage type");
        }

        if (ctx.isEndOfRegistration?.()) {
          const result = ctx.endRegistration?.();

          ctx.reply("Вернуться в главное меню", {
            reply_markup: addToEditMainBtnToKeyboard(
              new InlineKeyboard(),
              ctx.state,
            ),
          });
        } else {
          const question = ctx.currentRegistrationStage?.()?.question;

          if (question) {
            ctx.reply(question, {
              reply_markup: addToPushMainBtnWithRemoveRegistrationToKeyboard(
                new InlineKeyboard(),
                ctx.state,
              ),
            });
          } else {
            throw new Error("ctx.currentRegistrationStage?.question not found");
          }
        }
      } else {
        ctx.reply("Сообщение не обработанно хотите вернуться в главное меню?", {
          reply_markup: addToEditMainBtnToKeyboard(
            new InlineKeyboard(),
            ctx.state,
          ),
        });
      }
    }
  });
};
