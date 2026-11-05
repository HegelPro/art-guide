import { Bot } from "grammy";
import { InlineQueryResult } from "grammy/types";
import { StateContext } from "./state/state";
import { artsSearchKey } from "./features/artList";
import { merchSearchKey } from "./features/merch_list";
import { registerSearchKey } from "./features/register";

interface SearchItem {
  name: string;
  description?: string;
  photo?: string;
  thumbnail?: string;
}

export function buildInlineResults(
  items: SearchItem[],
  searchKey: string,
  query: string,
  usePhotoAsThumbnail = false
): InlineQueryResult[] {
  const term = query.slice(searchKey.length).trim().toLocaleLowerCase();

  return items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.name.trim().toLocaleLowerCase().includes(term))
    .map(({ item, index }) => ({
      type: "article" as const,
      id: `${searchKey}_${index}`,
      title: item.name,
      description: item.description,
      thumbnail_url: usePhotoAsThumbnail ? item.photo : item.thumbnail,
      input_message_content: {
        message_text: `/start ${searchKey}_${index}`,
      },
    }));
}

export function setInlineQueryMiddleware(bot: Bot<StateContext>): void {
  bot.on("inline_query", async (ctx) => {
    const query = ctx.inlineQuery.query;
    let results: InlineQueryResult[] = [];

    if (query.startsWith(artsSearchKey)) {
      results = buildInlineResults(ctx.state.arts, artsSearchKey, query, true);
    } else if (query.startsWith(merchSearchKey)) {
      results = buildInlineResults(ctx.state.merchs, merchSearchKey, query);
    } else if (query.startsWith(registerSearchKey)) {
      results = buildInlineResults(ctx.state.events, registerSearchKey, query);
    }

    await ctx.answerInlineQuery(results, { cache_time: 0 });
  });
}
