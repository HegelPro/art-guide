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
import { artsSearchKey, merchSearchKey } from "./search";
import { registerCallbackQuery, registerCommand } from "./features/register";
import { mainCommand, mainCallbackQuery } from "./features/main";
import { getMessage } from "./state/messages";
import { scheduleCallbackQuery, scheduleCommand } from "./features/schedule";
import { bot } from "./bot";
import { homeCallbackQuery, homeCommand } from "./features/home";
import { reloadCommand, reloadCommandMiddleware } from "./features/reload";

bot.catch(botErrorHandler);

async function start() {
  // Обновляем состояние перед стартом приложения
  await reloadState();

  bot.use(addStateMiddleware());

  bot.callbackQuery(mainCommand, mainCallbackQuery);
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

  bot.on("message:photo", async (ctx) => {
    if (!ctx.from.is_bot) {
      ctx.state.admins.forEach((admin) => {
        console.log(`--${admin.id}--`);
        if (ctx.message?.photo) {
          ctx.api.sendPhoto(admin.id, ctx.message?.photo[0].file_id, {
            caption: `user: ${ctx.message.chat.username}\nfirstname: ${ctx.message.chat.first_name}\nlastname: ${ctx.message.chat.last_name}`,
          });
        }
      });
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
    }
  });

  bot.start();
}

start();
