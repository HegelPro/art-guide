import "dotenv/config";

import { InlineQueryResult } from "grammy/types";
import {
  startCallbackQuery,
  startCommand,
  startCommandMiddleware,
} from "./features/start";
import { geoCallbackQuery, geoCommand } from "./features/geo";
import { donateCallbackQuery, donateCommand } from "./features/donate";
import { addStateMiddleware, reloadState, state } from "./state/state";
import { botErrorHandler } from "./utils/errorHandler";
import {
  registerCallbackQuery,
  registerCommand,
  registerSearchKey,
} from "./features/register";
import {
  editMainCommand,
  editMainCallbackQuery,
  pushMainCallbackQuery,
  pushMainCommand,
  addToPushMainBtnToKeyboard,
  addToPushMainBtnWithRemoveRegistrationToKeyboard,
  pushMainWithRemoveRegistrationCommand,
  pushMainWithRemoveRegistrationCallbackQuery,
  addToEditMainBtnToKeyboard,
} from "./features/main";
import { getMessage } from "./state/messages";
import { scheduleCallbackQuery, scheduleCommand } from "./features/schedule";
import { bot } from "./bot";
import { homeCallbackQuery, homeCommand } from "./features/home";
import { reloadCommand, reloadCommandMiddleware } from "./features/reload";
import { artsSearchKey } from "./features/artList";
import { merchSearchKey } from "./features/merch_list";
import { InlineKeyboard } from "grammy";

bot.catch(botErrorHandler);

async function start() {
  // Обновляем состояние перед стартом приложения
  await reloadState();

  bot.use(addStateMiddleware());

  bot.callbackQuery(
    pushMainWithRemoveRegistrationCommand,
    pushMainWithRemoveRegistrationCallbackQuery
  );
  bot.callbackQuery(pushMainCommand, pushMainCallbackQuery);
  bot.callbackQuery(editMainCommand, editMainCallbackQuery);
  bot.callbackQuery(startCommand, startCallbackQuery);
  bot.callbackQuery(registerCommand, registerCallbackQuery);
  bot.callbackQuery(geoCommand, geoCallbackQuery);
  bot.callbackQuery(scheduleCommand, scheduleCallbackQuery);
  bot.callbackQuery(donateCommand, donateCallbackQuery);
  bot.callbackQuery(homeCommand, homeCallbackQuery);

  // commands
  bot.command(startCommand, startCommandMiddleware);
  bot.command(reloadCommand, reloadCommandMiddleware);

  bot.api.setMyCommands([
    {
      command: startCommand,
      description: getMessage(state)("commands.start.description"),
    },
  ]);

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
                  caption: `payload: ${stage.payload}\nuser: ${ctx.message.chat.username}\nfirstname: ${ctx.message.chat.first_name}\nlastname: ${ctx.message.chat.last_name}`,
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
              ctx.state
            ),
          });
        } else {
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
        }
      }
    }
  });

  // inline_query
  bot.on("inline_query", async (ctx) => {
    const query = ctx.inlineQuery.query; // Текст, который ввел пользователь
    if (query.startsWith(artsSearchKey)) {
      const searchQuery = query.replace(artsSearchKey, "");
      const results: InlineQueryResult[] = state.arts
        .filter((art) => {
          return art.name
            .trim()
            .toLocaleLowerCase()
            .includes(searchQuery.trim().toLocaleLowerCase());
        })
        .map((art, index) => ({
          type: "article",
          title: art.name,
          thumbnail_url: art.photo,
          description: art.description,
          input_message_content: {
            message_text: `/start ${artsSearchKey}_${index}`,
            payload: art.name,
          },
          id: art.name.toString(), // Уникальный ID для результата
        }));

      await ctx.answerInlineQuery(results, {
        cache_time: 0, // Не кэшировать результаты
      });
    } else if (query.startsWith(merchSearchKey)) {
      const searchQuery = query.replace(merchSearchKey, "");
      const results: InlineQueryResult[] = state.merchs
        .filter((merch) => {
          return merch.name
            .trim()
            .toLocaleLowerCase()
            .includes(searchQuery.trim().toLocaleLowerCase());
        })
        .map((merch, index) => ({
          type: "article",
          title: merch.name,
          thumbnail_url: merch.thumbnail,
          description: merch.description,
          input_message_content: {
            message_text: `/start ${merchSearchKey}_${index}`,
            photo_url: merch.photo,
            // payload: art.name,
          },
          id: merch.name.toString(), // Уникальный ID для результата
        }));

      await ctx.answerInlineQuery(results, {
        cache_time: 0,
      });
    } else if (query.startsWith(registerSearchKey)) {
      const searchQuery = query.replace(registerSearchKey, "");
      const results: InlineQueryResult[] = state.events
        .filter((event) => {
          return event.name
            .trim()
            .toLocaleLowerCase()
            .includes(searchQuery.trim().toLocaleLowerCase());
        })
        .map((event, index) => ({
          type: "article",
          title: event.name,
          thumbnail_url: event.thumbnail,
          description: event.description,
          input_message_content: {
            message_text: `/start ${registerSearchKey}_${index}`,
            photo_url: event.photo,
            // payload: art.name,
          },
          id: event.name.toString(), // Уникальный ID для результата
        }));

      await ctx.answerInlineQuery(results, {
        cache_time: 0,
      });
    }
  });

  bot.start();
}

start();
