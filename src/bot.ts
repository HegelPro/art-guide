import { Bot, InlineKeyboard } from "grammy";
import * as path from "path";
import { InlineQueryResult, InputFile } from "grammy/types";
import "dotenv/config";
import { artListCommand, arts, startCommand } from "./config";
import { messages } from "./messages";

const bot = new Bot((globalThis as any).process.env.BOT_TOKEN);

bot.command(startCommand.command, (ctx) =>
  ctx.reply(messages.commands.start.message, {
    reply_markup: new InlineKeyboard().switchInlineCurrent(
      messages.buttons.inlineShowArt
    ),
  })
);

bot.command(artListCommand.command, (ctx) =>
  ctx.reply(messages.commands.start.message, {
    reply_markup: new InlineKeyboard().switchInlineCurrent(
      messages.buttons.inlineShowArt
    ),
  })
);

bot.api.setMyCommands([startCommand, artListCommand]);

bot.on("message", (ctx) => {
  const art = arts.find((art) => art.name === ctx.message.text);
  if (art && art.audio) {
    const audioFile = new InputFile(
      path.join(__dirname, "..", "assets", art.audio)
    );
    ctx.replyWithAudio(audioFile, {
      title: "заголовок",
      performer: "автор",
      caption: "подпись",
    });
  }
});

bot.on("inline_query", async (ctx) => {
  // const query = ctx.inlineQuery.query; // Текст, который ввел пользователь
  const results: InlineQueryResult[] = arts.map((art, index) => ({
    type: "article",
    title: art.name,
    description: art.shortDescription,
    input_message_content: {
      message_text: art.name,
    },
    id: index.toString(), // Уникальный ID для результата
  }));

  await ctx.answerInlineQuery(results, {
    cache_time: 0, // Не кэшировать результаты
  });
});

// Start the bot.
bot.start();
