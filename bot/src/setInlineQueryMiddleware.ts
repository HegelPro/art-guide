import { Bot } from "grammy";
import { state, StateContext } from "./state/state";
import { artsSearchKey } from "./features/artList";
import { InlineQueryResult } from "grammy/types";
import { merchSearchKey } from "./features/merch_list";
import { registerSearchKey } from "./features/register";

export const setInlineQueryMiddleware = async (bot: Bot<StateContext>) => {
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
};
