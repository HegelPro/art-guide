import { Bot, InlineKeyboard } from "grammy";
import { StateContext } from "./state/state";
import {
  addToEditMainBtnToKeyboard,
  addToPushMainBtnWithRemoveRegistrationToKeyboard,
} from "./features/main";

export const setMessageMiddleware = (bot: Bot<StateContext>): void => {
  bot.on("message", async (ctx) => {
    if (!ctx.from.is_bot) {
      const stage = ctx.currentRegistrationStage?.();
      if (stage) {
        if (stage.type === "input") {
          if (ctx.message.text) {
            ctx.nextRegistration?.({
              data: ctx.message.text,
            });
            await ctx.reply("Данные успешно введены");
          } else {
            await ctx.reply("Ожидается текст");
            return;
          }
        } else if (stage.type === "photo") {
          if (ctx.message.photo && stage.payload) {
            ctx.nextRegistration?.({
              data: stage.payload,
            });
            const photos = ctx.message.photo;
            const photo = photos[photos.length - 1];
            const deliveries = await Promise.allSettled(
              ctx.state.admins.map((admin) =>
                ctx.api.sendPhoto(admin.id, photo.file_id, {
                  caption:
                    `payload: ${stage.payload}\n` +
                    `user: ${ctx.message.chat.username}\n` +
                    `firstname: ${ctx.message.chat.first_name}\n` +
                    `lastname: ${ctx.message.chat.last_name}`,
                })
              )
            );
            deliveries.forEach((delivery) => {
              if (delivery.status === "rejected") {
                console.error("Failed to send registration photo:", delivery.reason);
              }
            });
            await ctx.reply("Фотография отправлена");
          } else {
            await ctx.reply("Ожидается фото");
            return;
          }
        } else {
          ctx.removeRegistration?.();
          throw new Error("Unknown stage type");
        }

        if (ctx.isEndOfRegistration?.()) {
          ctx.endRegistration?.();

          await ctx.reply("Вернуться в главное меню", {
            reply_markup: addToEditMainBtnToKeyboard(
              new InlineKeyboard(),
              ctx.state,
            ),
          });
        } else {
          const question = ctx.currentRegistrationStage?.()?.question;

          if (question) {
            await ctx.reply(question, {
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
        await ctx.reply("Сообщение не обработано. Хотите вернуться в главное меню?", {
          reply_markup: addToEditMainBtnToKeyboard(
            new InlineKeyboard(),
            ctx.state,
          ),
        });
      }
    }
  });
};
