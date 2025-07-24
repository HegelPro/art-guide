import "dotenv/config";
import { Bot, InlineKeyboard } from "grammy";
import { InlineQueryResult } from "grammy/types";
import { startCommand, startCommandMiddleware } from "./commands/startCommand";
import {
  artListCommand,
  artListCommandMiddleware,
} from "./commands/artListCommand";
import { geoCommand, geoCommandMiddleware } from "./commands/geoCommand";
import {
  googleTableCommand,
  googleTableMiddleware,
} from "./commands/googleTableCommand";
import {
  donateCommand,
  donateCommandMiddleware,
} from "./commands/donateCommand";
import { faqCommand, faqCommandMiddleware } from "./commands/faqCommand";
import { addStateMiddleware, initState, StateContext } from "./state/state";
import { botErrorHandler } from "./utils/errorHandler";

const bot = new Bot<StateContext>((globalThis as any).process.env.BOT_TOKEN);

bot.catch(botErrorHandler);

async function startBot() {
  const state = await initState();

  bot.use(addStateMiddleware(state));

  // callbackQuery
  state.faqs?.forEach((row, i) => {
    bot.callbackQuery("faq" + i, async (ctx) => {
      await ctx.editMessageText(
        `${state.messages["faq.answer"]} ${row[0]} ${row[1]}`,
        {
          // parse_mode: "HTML",
        }
      );
    });
  });

  // commands
  bot.command(startCommand(state.messages).command, startCommandMiddleware);
  bot.command(artListCommand(state.messages).command, artListCommandMiddleware);
  bot.command(geoCommand(state.messages).command, geoCommandMiddleware);
  bot.command(
    googleTableCommand(state.messages).command,
    googleTableMiddleware
  );
  bot.command(donateCommand(state.messages).command, donateCommandMiddleware);
  bot.command(faqCommand(state.messages).command, faqCommandMiddleware);

  bot.api.setMyCommands([
    startCommand(state.messages),
    artListCommand(state.messages),
    geoCommand(state.messages),
    donateCommand(state.messages),
    faqCommand(state.messages),
  ]);

  // message
  bot.on("message", async (ctx) => {
    const art = state.arts.find((art) => art.name === ctx.message.text);
    if (art) {
      if (art.photo) {
        await ctx.replyWithPhoto(art.photo, {
          caption: art.name,
        });
      }

      if (art.audio) {
        await ctx.replyWithVoice(art.audio, {
          caption: art.description,
          reply_markup: new InlineKeyboard().switchInlineCurrent(
            ctx.state.messages["buttons.inlineShowArt"]
          ),
        });
      }
    }
    ctx.deleteMessage();
  });

  // inline_query
  bot.on("inline_query", async (ctx) => {
    const query = ctx.inlineQuery.query; // Текст, который ввел пользователь

    const results: InlineQueryResult[] = state.arts
      .filter((art) => art.name.includes(query))
      .map((art) => ({
        type: "article",
        title: art.name,
        thumbnail_url: art.photo,
        description: art.description,
        input_message_content: {
          message_text: art.name,
          payload: art.name,
        },
        id: art.name.toString(), // Уникальный ID для результата
      }));

    await ctx.answerInlineQuery(results, {
      cache_time: 0, // Не кэшировать результаты
    });
  });

  bot.start();
}

startBot();
